// config.js — static config for the isometric Babylon scene (styleguide overlay).
// Pure data + tiny helpers; engine-agnostic numbers. Mirrors the brand palette
// used by the export's stadium-babylon (same club hexes), so the iso campus is
// visually on-brand without touching the export snapshot.

export const PITCH = { w: 68, h: 105 };          // metres, same as stadium config

// Tile grid that the campus sits on. Kept modest so the whole thing fits a
// single thin-instance buffer (one draw call).
export const GRID = {
  cols: 40,        // tiles along x
  rows: 40,        // tiles along z
  tile: 6,         // tile edge length (world units)
  gap: 0.18,       // visual gap between tiles
  height: 0.6,     // raised tile thickness
};

// Club accents — identical hexes to stadium-babylon/config.js CLUBS.
export const CLUBS = {
  hafenstadt: { name: 'Hafenstadt', primary: 0x1f3d6b, secondary: 0xd9b04a, tag: 'Marineblau · Gold' },
  kaltenbach: { name: 'Kaltenbach', primary: 0x7a1c2f, secondary: 0xead7c1, tag: 'Weinrot · Creme' },
  auerbach:   { name: 'Auerbach',   primary: 0x3b6e3e, secondary: 0xe8c66a, tag: 'Wiesengrün · Butter' },
  sauveterre: { name: 'Sauveterre', primary: 0x2e4a3a, secondary: 0xc79c4a, tag: 'Tannengrün · Senf' },
};

export const SCARLET = 0xb7301b;

// Paper palette as hex numbers (for Babylon Color3) — matches the CSS tokens.
export const PAPER = {
  paper: 0xf4ede0,
  paper2: 0xfbf6ea,
  rule: 0xd9cdb4,
  ink: 0x1a1410,
  grass: 0x4f7a44,
  grassDark: 0x466b3d,
  ground: 0xe8dfcb,
};

// ── Isometric camera — true isometric angle ─────────────────────
// Classic isometric: yaw 45°, elevation 35.264° above the ground plane.
// In Babylon's ArcRotateCamera, beta is measured from +Y (the pole), so the
// 35.264° elevation is beta = acos(1/√3) ≈ 0.9553 rad ≈ 54.736° from the pole.
export const ISO = {
  alpha: Math.PI / 4,                  // 45° azimuth
  beta:  Math.acos(1 / Math.sqrt(3)),  // ≈0.9553 rad → 35.264° elevation (true iso)
  radius: 230,                         // distance (ortho: only affects clipping/feel)
  orthoHalfHeight: 95,                 // vertical half-extent in world units (zoom)
  orthoMin: 38,                        // closest zoom (smaller half-height)
  orthoMax: 150,                       // farthest zoom (larger half-height)
};

// ── Helpers ─────────────────────────────────────────────────────
export function hexToColor3(hex) {
  return new BABYLON.Color3(((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255);
}
export function hexToColor4(hex, a = 1) {
  return new BABYLON.Color4(((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255, a);
}
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
