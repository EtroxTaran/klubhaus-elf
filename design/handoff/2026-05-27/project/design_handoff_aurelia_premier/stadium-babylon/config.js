// config.js — Static config + data. Identical schema to the three.js version;
// values are pure numbers so this file is engine-agnostic.

export const PITCH = { w: 68, h: 105 };

export const CLUBS = {
  hafenstadt: { name: 'Hafenstadt', primary: 0x1f3d6b, secondary: 0xd9b04a, tag: 'Marineblau · Gold' },
  kaltenbach: { name: 'Kaltenbach', primary: 0x7a1c2f, secondary: 0xead7c1, tag: 'Weinrot · Creme' },
  auerbach:   { name: 'Auerbach',   primary: 0x3b6e3e, secondary: 0xe8c66a, tag: 'Wiesengrün · Butter' },
  sauveterre: { name: 'Sauveterre', primary: 0x2e4a3a, secondary: 0xc79c4a, tag: 'Tannengrün · Senf' },
};

// Angle 0 = +x (east), increases counter-clockwise. Note: in Babylon's right-
// handed system with our `useRightHandedSystem = true`, atan2(z, x) on the
// horizontal plane gives the same orientation as the three.js version.
export const SECTORS = {
  E: { name: 'Osttribüne',  cap: 7400,  type: 'Sitzplätze · VIP-Logen',
       heritage: 'Vorstands- und Sponsorenseite. Pressebox unter der Dachkante.',
       arc: [-Math.PI/4,  Math.PI/4] },
  N: { name: 'Nordtribüne', cap: 12000, type: 'Steh- + Sitzplätze',
       heritage: 'Hauptkurve · Fankurve. Die Choreo-Tribüne; Bahnen-Choreos sind hier zu Hause.',
       arc: [ Math.PI/4,  3*Math.PI/4] },
  W: { name: 'Westtribüne', cap: 7400,  type: 'Sitzplätze',
       heritage: 'Klassische Gegentribüne. Beste TV-Kamera-Achse, Mittelaufnahme.',
       arc: [ 3*Math.PI/4, -3*Math.PI/4] },
  S: { name: 'Südtribüne',  cap: 8200,  type: 'Sitzplätze, gedeckt',
       heritage: 'Familienblock · Sicht direkt aufs Spielfeld. Gemischtes Publikum.',
       arc: [-3*Math.PI/4, -Math.PI/4] },
};

export const BOWL = {
  innerW: PITCH.w + 16,
  innerH: PITCH.h + 12,
  cornerRadius: 22,
  rows: 22,
  rowHeight: 0.7,
  rowDepth: 0.9,
  tier1Top: 12,
  tier2Bottom: 14,
};

// Camera presets — positions in world space (x, y, z), look-at target, and
// (optional) fov. The Babylon camera director converts position+target into
// the equivalent ArcRotateCamera alpha/beta/radius and animates with eased lerp.
export const CAM_PRESETS = {
  heli:  { pos: [125, 95, 125],  target: [0, 6, 0], fov: 32, label: 'Helikopter' },
  drone: { pos: [0,   220, 0.001], target: [0, 0, 0], fov: 35, label: 'Drohne' },
  campus:{ pos: [280, 200, 280], target: [0, 0, 0], fov: 34, label: 'Campus' },
  side:  { pos: [-160, 30, 0],    target: [0, 8, 0], fov: 26, label: 'Gegentribüne' },
  goal:  { pos: [0,   12, -130],  target: [0, 6, 0], fov: 30, label: 'Hinter dem Tor' },
  press: { pos: [120, 70, 0],     target: [0, 6, 0], fov: 28, label: 'Pressebox' },
};

export const STADIUM_NAME = 'AURELIA ARENA';

// ── Babylon helpers ────────────────────────────────────────────
// FOV: Babylon uses radians (vertical FOV). three.js uses degrees.
export const degToRad = (d) => (d * Math.PI) / 180;

// Convert 0xRRGGBB → BABYLON.Color3
export function hexToColor3(hex) {
  return new BABYLON.Color3(((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255);
}
export function hexToColor4(hex, a = 1) {
  return new BABYLON.Color4(((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255, a);
}

// Lerp helpers for the time-of-day palette
export function lerp(a, b, t) { return a + (b - a) * t; }
export function lerpHex(a, b, t) {
  const ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255;
  const br = (b >> 16) & 255, bg = (b >> 8) & 255, bb = b & 255;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return (r << 16) | (g << 8) | bl;
}
