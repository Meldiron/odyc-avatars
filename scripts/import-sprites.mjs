#!/usr/bin/env node
// One-off codegen: decode CC0 8x8 spritesheets, slice into 8x8 tiles, quantize
// each pixel to the odyc palette, and emit fixed-color templates into
// src/lib/sprites.js. Zero runtime deps (Node zlib only).
//
//   node scripts/import-sprites.mjs --inspect   # print counts + sample tiles
//   node scripts/import-sprites.mjs             # write src/lib/sprites.js
//
// Source sheets (CC0 / public domain, OpenGameArt). Download into ./.import/ first:
//   sprite-sheet.png  https://opengameart.org/sites/default/files/sprite-sheet.png
//   8x8critters.png   https://opengameart.org/sites/default/files/8x8critters.png
import zlib from 'node:zlib';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PALETTE } from '../src/lib/data.js';

const ROOT = path.resolve(fileURLToPath(import.meta.url), '../..');

// --- sheets to import ---
// bg: 'alpha'   = background is alpha-transparent (just trust the alpha channel)
//     'pertile' = each tile sits on a solid fill; the tile's most-common opaque color is bg
//     'global'  = whole sheet shares one solid bg = its most-common opaque color
const SHEETS = [
  // CC0 "8x8 Character and Sprite Sheet" — 80 characters, transparent bg, 16x5 @ stride 8.
  { file: '.import/sprite-sheet.png', prefix: 'char', offset: 0, stride: 8, cell: 8, bg: 'alpha' },
  // CC0 "8x8 Critter Pack" — slimes/goblins/skeletons/etc on solid per-group fills.
  { file: '.import/8x8critters.png', prefix: 'crit', offset: 0, stride: 8, cell: 8, bg: 'pertile' },
];
const MIN_PIXELS = 9; // drop near-empty tiles (blanks / mid-animation fragments)

// --- minimal PNG decoder: 8-bit RGBA, non-interlaced ---
function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
}
function decodePNG(buf) {
  let p = 8, width, height, bitDepth, colorType;
  const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p); p += 4;
    const type = buf.toString('ascii', p, p + 4); p += 4;
    const data = buf.subarray(p, p + len); p += len + 4;
    if (type === 'IHDR') {
      width = data.readUInt32BE(0); height = data.readUInt32BE(4);
      bitDepth = data[8]; colorType = data[9];
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
  }
  if (bitDepth !== 8 || colorType !== 6) {
    throw new Error(`unsupported PNG (depth ${bitDepth}, colorType ${colorType}); need 8-bit RGBA`);
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const bpp = 4, stride = width * bpp;
  const out = Buffer.alloc(stride * height);
  let prev = Buffer.alloc(stride), ip = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[ip++];
    const cur = out.subarray(y * stride, y * stride + stride);
    raw.copy(cur, 0, ip, ip + stride); ip += stride;
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? cur[x - bpp] : 0;
      const b = prev[x];
      const c = x >= bpp ? prev[x - bpp] : 0;
      let v = cur[x];
      if (filter === 1) v = (v + a) & 0xff;
      else if (filter === 2) v = (v + b) & 0xff;
      else if (filter === 3) v = (v + ((a + b) >> 1)) & 0xff;
      else if (filter === 4) v = (v + paeth(a, b, c)) & 0xff;
      else if (filter !== 0) throw new Error(`bad filter ${filter}`);
      cur[x] = v;
    }
    prev = cur;
  }
  return { width, height, data: out };
}

// --- palette quantization ---
const hexRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.substr(i, 2), 16));
const PAL = PALETTE.filter((p) => p.hex).map((p) => ({ v: String(p.value), rgb: hexRgb(p.hex) }));
function nearest(r, g, b) {
  let best = '0', bd = Infinity;
  for (const p of PAL) {
    const dr = r - p.rgb[0], dg = g - p.rgb[1], db = b - p.rgb[2];
    const d = dr * dr + dg * dg + db * db;
    if (d < bd) { bd = d; best = p.v; }
  }
  return best;
}

// Most-frequent opaque color within a pixel region [ox,oy,w,h].
function dominantColor(img, ox, oy, w, h) {
  const counts = new Map();
  for (let y = oy; y < oy + h; y++) {
    for (let x = ox; x < ox + w; x++) {
      const i = (y * img.width + x) * 4;
      if (img.data[i + 3] < 128) continue;
      const key = (img.data[i] << 16) | (img.data[i + 1] << 8) | img.data[i + 2];
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }
  let best = -1, bc = -1;
  for (const [k, c] of counts) if (c > bc) { bc = c; best = k; }
  return best < 0 ? null : [(best >> 16) & 0xff, (best >> 8) & 0xff, best & 0xff];
}

function tileGrid(img, ox, oy, bg) {
  const rows = [];
  for (let y = 0; y < 8; y++) {
    let s = '';
    for (let x = 0; x < 8; x++) {
      const i = ((oy + y) * img.width + (ox + x)) * 4;
      const r = img.data[i], g = img.data[i + 1], b = img.data[i + 2], a = img.data[i + 3];
      const isBg = bg && r === bg[0] && g === bg[1] && b === bg[2];
      s += a < 128 || isBg ? '.' : nearest(r, g, b);
    }
    rows.push(s);
  }
  return rows;
}

function sliceSheet({ file, prefix, offset, stride, cell, bg }) {
  const img = decodePNG(fs.readFileSync(path.join(ROOT, file)));
  const globalBg = bg === 'global' ? dominantColor(img, 0, 0, img.width, img.height) : null;
  const cols = Math.floor((img.width - offset) / stride);
  const rows = Math.floor((img.height - offset) / stride);
  const tiles = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const ox = offset + c * stride, oy = offset + r * stride;
      if (ox + cell > img.width || oy + cell > img.height) continue;
      const tileBg =
        bg === 'alpha' ? null : bg === 'pertile' ? dominantColor(img, ox, oy, cell, cell) : globalBg;
      const grid = tileGrid(img, ox, oy, tileBg);
      const filled = grid.join('').replace(/\./g, '').length;
      if (filled >= MIN_PIXELS) tiles.push(grid);
    }
  }
  return { prefix, cols, rows, tiles };
}

const sliced = SHEETS.map(sliceSheet);

if (process.argv.includes('--inspect')) {
  for (const s of sliced) {
    // dedupe for the count
    const uniq = new Set(s.tiles.map((t) => t.join('|')));
    console.log(`\n=== ${s.prefix}: grid ${s.cols}x${s.rows}, ${s.tiles.length} non-empty, ${uniq.size} unique ===`);
    [...new Set(s.tiles.map((t) => t.join('|')))].slice(0, 5).map((k) => k.split('|')).forEach((g, i) => {
      console.log(`  [${s.prefix}-${i}]`);
      g.forEach((row) => console.log('   ' + row));
    });
  }
  process.exit(0);
}

// --- emit src/lib/sprites.js ---
const seen = new Set();
const entries = [];
for (const s of sliced) {
  let n = 0;
  for (const grid of s.tiles) {
    const key = grid.join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    entries.push(`  ${s.prefix}${n}: [${grid.map((r) => `'${r}'`).join(', ')}],`);
    n++;
  }
}
const out =
  '// AUTO-GENERATED by scripts/import-sprites.mjs from CC0 OpenGameArt 8x8 sheets.\n' +
  '// Fixed-color sprites: each char is a palette "value" (0-9, "." = transparent),\n' +
  '// rendered directly (NOT recolored). Do not edit by hand — re-run the importer.\n' +
  'export const SPRITES = {\n' +
  entries.join('\n') +
  '\n};\n';
fs.writeFileSync(path.join(ROOT, 'src/lib/sprites.js'), out);
console.log(`Wrote src/lib/sprites.js with ${entries.length} unique sprites.`);
