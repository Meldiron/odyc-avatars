// Shared avatar generation (browser + Node). Deterministic PRNG seed, SVG/TXT
// export, and a <canvas>-based PNG for the web. The Node CLI (cli.mjs) imports
// generate/toSVG/toTXT from here and adds a zlib PNG encoder of its own.
import { PALETTE, TEMPLATES as CURATED } from './data.js';
import { SPRITES } from './sprites.js';

export const SIZE = 8;
// Every template is just a grid of "ink" chars (any non-"." char) plus transparent.
// Each distinct ink char is one color slot; generate() recolors all slots randomly
// per seed, so both hand-made and imported sprites get full color variety.
export const TEMPLATES = { ...CURATED, ...SPRITES };
export const TEMPLATE_NAMES = Object.keys(TEMPLATES);

// All paintable palette colors (hex) — the pool we draw recolors from.
const PALETTE_HEXES = PALETTE.filter((p) => p.hex).map((p) => p.hex);

const VALUE_BY_HEX = Object.fromEntries(
  PALETTE.filter((p) => p.hex).map((p) => [p.hex, String(p.value)])
);
const TRANSPARENT_VALUE = String(PALETTE.find((p) => p.rgb === null)?.value ?? '.');

// --- deterministic seeded byte stream (xmur3 -> mulberry32) ---
function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}
function byteStream(seed) {
  const seedFn = xmur3(String(seed));
  let a = seedFn();
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) & 0xff;
  };
}

// Deterministic Fisher-Yates using the seeded byte stream.
function shuffle(arr, next) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = next() % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Build the illustration model for a seed. Finds every distinct ink char in the
 * template (its color slots) and assigns each a distinct palette color, drawn
 * without replacement from a per-seed shuffle — so a K-color sprite has up to
 * 10·9·…·(11-K) combinations, not just two.
 */
export function generate(seed, templateName) {
  const next = byteStream(seed);
  const name = templateName || TEMPLATE_NAMES[next() % TEMPLATE_NAMES.length];
  const template = TEMPLATES[name];

  // Distinct ink chars, in first-appearance order.
  const slots = [];
  for (const row of template) {
    for (const ch of row) if (ch !== '.' && !slots.includes(ch)) slots.push(ch);
  }

  // Assign each slot a color from a shuffled palette (distinct while slots ≤ palette).
  const pool = shuffle(PALETTE_HEXES.slice(), next);
  const colorByChar = {};
  slots.forEach((ch, i) => { colorByChar[ch] = pool[i % pool.length]; });

  const grid = template.map((row) => [...row].map((ch) => (ch === '.' ? null : colorByChar[ch])));

  return { seed: String(seed), name, colors: slots.map((s) => colorByChar[s]), grid };
}

/** SVG string (transparent background, crisp pixels). */
export function toSVG({ grid }, { scale = 32 } = {}) {
  const dim = SIZE * scale;
  const rects = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const hex = grid[y][x];
      if (!hex) continue;
      rects.push(
        `<rect x="${x * scale}" y="${y * scale}" width="${scale}" height="${scale}" fill="${hex}"/>`
      );
    }
  }
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${dim}" height="${dim}" ` +
    `viewBox="0 0 ${dim} ${dim}" shape-rendering="crispEdges">${rects.join('')}</svg>`
  );
}

/** TXT: palette "value" per pixel, 8 chars per line ("." = transparent). */
export function toTXT({ grid }) {
  return (
    grid
      .map((row) => row.map((hex) => (hex ? VALUE_BY_HEX[hex] : TRANSPARENT_VALUE)).join(''))
      .join('\n') + '\n'
  );
}

/** Draw a model onto a canvas (used for both preview and PNG export). */
export function drawToCanvas(canvas, { grid }, scale = 32) {
  const dim = SIZE * scale;
  canvas.width = dim;
  canvas.height = dim;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, dim, dim);
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const hex = grid[y][x];
      if (!hex) continue;
      ctx.fillStyle = hex;
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
}

/** Resolve a model to a PNG Blob via an offscreen canvas. */
export function toPNGBlob(model, scale = 32) {
  const canvas = document.createElement('canvas');
  drawToCanvas(canvas, model, scale);
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}
