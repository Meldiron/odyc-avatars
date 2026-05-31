#!/usr/bin/env node
// Node CLI for odyc-avatars — reuses the shared browser-agnostic logic in
// avatar.js (generate / toSVG / toTXT) and adds the Node-only pieces:
// a dependency-free PNG encoder (zlib), a terminal preview, and batch export.
//
// Usage:
//   node src/lib/cli.mjs "seed"                          # write illustration.svg
//   node src/lib/cli.mjs "seed" out --format all         # out.svg + out.png + out.txt
//   node src/lib/cli.mjs "seed" out --preview
//   node src/lib/cli.mjs --batch 100 avatars/ --format all
//
// Formats: svg | png | txt | all  (default: svg)
import zlib from 'node:zlib';
import fs from 'node:fs';
import path from 'node:path';
import { SIZE, TEMPLATE_NAMES, generate, toSVG, toTXT } from './avatar.js';
import { TEMPLATES } from './data.js';

// --- Minimal dependency-free PNG encoder (RGBA, via Node's zlib) ---
function crc32(buf) {
  let crc = ~0;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (~crc) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

/** Render a hex-color grid to a PNG Buffer; transparent cells get alpha 0. */
function toPNG({ grid }, { scale = 32 } = {}) {
  const dim = SIZE * scale;
  const stride = dim * 4 + 1; // 4 bytes/pixel + 1 filter byte per scanline
  const raw = Buffer.alloc(stride * dim); // zero-filled => transparent black

  for (let y = 0; y < dim; y++) {
    const gy = (y / scale) | 0;
    let off = y * stride + 1; // skip filter byte (0 = none)
    for (let x = 0; x < dim; x++) {
      const hex = grid[gy][(x / scale) | 0];
      if (hex) {
        raw[off] = parseInt(hex.substr(1, 2), 16);
        raw[off + 1] = parseInt(hex.substr(3, 2), 16);
        raw[off + 2] = parseInt(hex.substr(5, 2), 16);
        raw[off + 3] = 255;
      }
      off += 4;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(dim, 0);
  ihdr.writeUInt32BE(dim, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', zlib.deflateSync(raw)),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

/** True-color terminal preview. */
function toTerminal({ grid }) {
  const reset = '\x1b[0m';
  let out = '';
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const hex = grid[y][x];
      if (!hex) { out += '  '; continue; }
      const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.substr(i, 2), 16));
      out += `\x1b[38;2;${r};${g};${b}m██${reset}`;
    }
    out += '\n';
  }
  return out;
}

/** Sanity-check every template is exactly 8x8; report ALL problems at once. */
function validateTemplates() {
  const errors = [];
  for (const [name, rows] of Object.entries(TEMPLATES)) {
    if (rows.length !== SIZE) errors.push(`${name}: ${rows.length} rows (expected ${SIZE})`);
    rows.forEach((r, i) => {
      if (r.length !== SIZE) errors.push(`${name} row ${i}: width ${r.length} ("${r}")`);
    });
  }
  if (errors.length) throw new Error(`Bad templates:\n  ${errors.join('\n  ')}`);
}

function resolveFormats(arg) {
  const v = (arg || 'svg').toLowerCase();
  if (v === 'all') return ['svg', 'png', 'txt'];
  if (['svg', 'png', 'txt'].includes(v)) return [v];
  throw new Error(`Unknown format "${arg}" (expected svg|png|txt|all)`);
}

function writeOutputs(model, base, formats) {
  if (formats.includes('svg')) fs.writeFileSync(`${base}.svg`, toSVG(model));
  if (formats.includes('png')) fs.writeFileSync(`${base}.png`, toPNG(model));
  if (formats.includes('txt')) fs.writeFileSync(`${base}.txt`, toTXT(model));
}

function batch(count, dir, formats) {
  fs.mkdirSync(dir, { recursive: true });
  const imgExt = formats.includes('svg') ? 'svg' : formats.includes('png') ? 'png' : null;
  const cards = [];
  for (let i = 1; i <= count; i++) {
    const name = TEMPLATE_NAMES[(i - 1) % TEMPLATE_NAMES.length];
    const model = generate(`odyc-${i}`, name);
    writeOutputs(model, path.join(dir, `avatar-${i}`), formats);
    const img = imgExt
      ? `<img src="avatar-${i}.${imgExt}" width="64" height="64" alt="${model.name}">`
      : `<pre>${toTXT(model)}</pre>`;
    cards.push(`<figure>${img}<figcaption>${i}. ${model.name}</figcaption></figure>`);
  }

  const html = `<!doctype html><meta charset="utf-8"><title>odyc-avatars</title>
<style>body{background:#212529;color:#f8f9fa;font:13px system-ui;margin:24px}
main{display:grid;grid-template-columns:repeat(auto-fill,80px);gap:16px}
figure{margin:0;text-align:center}img{image-rendering:pixelated;background:#343a40;border-radius:6px}
figcaption{margin-top:4px;color:#ced4da;font-size:11px}</style>
<h1>odyc-avatars — ${count} illustrations</h1><main>${cards.join('')}</main>`;
  fs.writeFileSync(path.join(dir, 'index.html'), html);

  console.log(`Wrote ${count} avatars (${formats.join(', ')}) + index.html to ${dir}`);
}

/** Read a flag value supporting "--flag value" and "--flag=value". */
function flagValue(args, name) {
  const i = args.indexOf(`--${name}`);
  if (i !== -1 && args[i + 1] && !args[i + 1].startsWith('--')) return args[i + 1];
  const eq = args.find((a) => a.startsWith(`--${name}=`));
  return eq ? eq.split('=')[1] : undefined;
}

function main() {
  validateTemplates();
  const args = process.argv.slice(2);
  const formats = resolveFormats(flagValue(args, 'format'));

  if (args[0] === '--batch') {
    batch(Number(args[1]) || 100, args[2] || 'avatars/', formats);
    return;
  }

  const preview = args.includes('--preview');
  const fmtVal = flagValue(args, 'format');
  const positional = args.filter((a) => !a.startsWith('--') && a !== fmtVal);
  const input = positional[0];

  if (!input) {
    console.error('Usage: node src/lib/cli.mjs <seed> [out] [--format svg|png|txt|all] [--preview]');
    console.error('       node src/lib/cli.mjs --batch <count> [dir/] [--format svg|png|txt|all]');
    process.exit(1);
  }

  const base = path.resolve((positional[1] || 'illustration').replace(/\.(svg|png|txt)$/i, ''));
  const model = generate(input);
  writeOutputs(model, base, formats);

  console.log(`Wrote ${path.basename(base)}.{${formats.join(',')}}  (${model.name}: ${model.body}/${model.accent})`);
  if (preview) process.stdout.write('\n' + toTerminal(model) + '\n');
}

main();
