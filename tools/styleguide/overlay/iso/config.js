// config.js — isometric club-campus config (styleguide overlay).
//
// DESIGN-SYSTEM DISCIPLINE: the single token source is aurelia.css `:root`.
// Colours are read from those CSS custom properties at runtime (getComputedStyle)
// so the 3D scene and the HTML chrome share ONE palette. The numeric hex values
// here are only fallbacks if a token can't be read. No scattered hex literals.

const ROOT = typeof document !== 'undefined' ? document.documentElement : null;

function cssVar(name) {
  if (!ROOT) return '';
  return getComputedStyle(ROOT).getPropertyValue(name).trim();
}
function parseHex(str) {
  const m = /^#?([0-9a-fA-F]{6})$/.exec((str || '').trim());
  return m ? parseInt(m[1], 16) : null;
}

/** Read a design token as a hex number, falling back to a known value. */
export function token(name, fallback) {
  const v = parseHex(cssVar(name));
  return v == null ? fallback : v;
}
export function hexToColor3(hex) {
  return new BABYLON.Color3(((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255);
}
/** Babylon Color3 from a CSS token (with hex fallback). */
export function color3(name, fallback) {
  return hexToColor3(token(name, fallback));
}

// Palette: [token name, fallback]. Fallbacks mirror aurelia.css :root.
const PAL = {
  paper:     ['--paper', 0xf4ede0],
  paper2:    ['--paper-2', 0xfbf6ea],
  rule:      ['--rule', 0xd9cdb4],
  ink:       ['--ink', 0x1a1410],
  ink2:      ['--ink-2', 0x2a221c],
  muted:     ['--muted', 0x5a4f44],
  scarlet:   ['--scarlet', 0xb7301b],
  grass:     ['--grass', 0x4f7a44],
  grassDark: ['--grass-2', 0x456b3a],
  asphalt:   ['--asphalt', 0x39342f],
  ground:    ['--ground', 0xe8dfcb],
};
/** Palette colour as Babylon Color3 (token-driven). */
export function pal(key) { const [n, f] = PAL[key]; return color3(n, f); }
export function palHex(key) { const [n, f] = PAL[key]; return token(n, f); }

// Clubs — primary accent read from --club-* tokens (added to aurelia.css).
export const CLUBS = {
  hafenstadt: { name: 'Hafenstadt', token: '--club-hafenstadt', fallback: 0x1f3d6b, tag: 'Marineblau · Gold' },
  kaltenbach: { name: 'Kaltenbach', token: '--club-kaltenbach', fallback: 0x7a1c2f, tag: 'Weinrot · Creme' },
  auerbach:   { name: 'Auerbach',   token: '--club-auerbach',   fallback: 0x3b6e3e, tag: 'Wiesengrün · Butter' },
  sauveterre: { name: 'Sauveterre', token: '--club-sauveterre', fallback: 0x2e4a3a, tag: 'Tannengrün · Senf' },
};
export function clubColor(id) { const c = CLUBS[id]; return token(c.token, c.fallback); }

// ── Isometric camera — true isometric angle (orthographic) ──────
export const ISO = {
  alpha: Math.PI / 4,                  // 45° azimuth
  beta:  Math.acos(1 / Math.sqrt(3)),  // ≈35.264° elevation (true iso)
  radius: 360,
  orthoHalfHeight: 145,                // zoom (vertical half-extent, world units)
  orthoMin: 55,
  orthoMax: 250,
};

// ── Campus layout (world units), stadium centred at origin ──────
export const FIELD  = { w: 78, h: 116 };   // green playing field
export const BORDER = { w: 88, h: 126 };   // cream run-off around field
export const STAND  = { depth: 17, height: 13, roof: 2.4 };
export const FORECOURT = { w: 150, h: 196 }; // paved plaza under/around the bowl
export const GROUND_SIZE = 1400;

// Parking lots: paved slabs with thin-instanced cars (outer corners).
export const PARKING = [
  { x: -178, z: -150, w: 70, d: 56 },
  { x:  178, z: -150, w: 70, d: 56 },
  { x:  178, z:  158, w: 70, d: 56 },
  { x: -178, z:  158, w: 70, d: 56 },
];

// Training pitches (west side of the campus).
export const TRAINING = [
  { x: -188, z: -36, w: 46, d: 30 },
  { x: -188, z:  26, w: 46, d: 30 },
];

// Campus buildings: each a simple massing (paper walls, ink roof, accent trim).
// [x, z] = footprint centre; w×d footprint; h height.
export const BUILDINGS = [
  { label: 'Akademie',  x: -188, z: -92, w: 44, d: 28, h: 17 },
  { label: 'Medizin',   x: -188, z:  84, w: 36, d: 26, h: 12 },
  { label: 'Fanshop',   x:  -34, z:-160, w: 26, d: 18, h: 10 },
  { label: 'Catering',  x:   30, z:-162, w: 16, d: 12, h:  7 },
  { label: 'Museum',    x:  176, z: -58, w: 40, d: 30, h: 19 },
  { label: 'Hotel',     x:  186, z:  78, w: 34, d: 34, h: 31 },
];

export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
