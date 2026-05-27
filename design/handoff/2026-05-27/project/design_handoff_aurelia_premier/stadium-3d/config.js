// config.js — Static config + data (no three.js imports).

export const PITCH = { w: 68, h: 105 };

export const CLUBS = {
  hafenstadt: { name: 'Hafenstadt', primary: 0x1f3d6b, secondary: 0xd9b04a, tag: 'Marineblau · Gold' },
  kaltenbach: { name: 'Kaltenbach', primary: 0x7a1c2f, secondary: 0xead7c1, tag: 'Weinrot · Creme' },
  auerbach:   { name: 'Auerbach',   primary: 0x3b6e3e, secondary: 0xe8c66a, tag: 'Wiesengrün · Butter' },
  sauveterre: { name: 'Sauveterre', primary: 0x2e4a3a, secondary: 0xc79c4a, tag: 'Tannengrün · Senf' },
};

// Sector definitions for the bowl. Each sector = an angle range around the
// pitch center where clicks resolve to that name.
// Angle 0 = +x (east), increases counter-clockwise (right-hand rule).
export const SECTORS = {
  E: { name: 'Osttribüne',  cap: 7400,  type: 'Sitzplätze · VIP-Logen',
       heritage: 'Vorstands- und Sponsorenseite. Pressebox unter der Dachkante.',
       arc: [-Math.PI/4,  Math.PI/4] },
  N: { name: 'Nordtribüne', cap: 12000, type: 'Steh- + Sitzplätze',
       heritage: 'Hauptkurve · Fankurve. Die Choreo-Tribüne; Bahnen-Coreos sind hier zu Hause.',
       arc: [ Math.PI/4,  3*Math.PI/4] },
  W: { name: 'Westtribüne', cap: 7400,  type: 'Sitzplätze',
       heritage: 'Klassische Gegentribüne. Beste TV-Kamera-Achse, Mittelaufnahme.',
       arc: [ 3*Math.PI/4, -3*Math.PI/4] },  // wraps -π
  S: { name: 'Südtribüne',  cap: 8200,  type: 'Sitzplätze, gedeckt',
       heritage: 'Familienblock · Sicht direkt aufs Spielfeld. Gemischtes Publikum.',
       arc: [-3*Math.PI/4, -Math.PI/4] },
};

// Bowl geometry parameters (kept small so a sensible default fits ~35k seats)
export const BOWL = {
  innerW: PITCH.w + 16,   // inner long dimension
  innerH: PITCH.h + 12,   // inner short dimension
  cornerRadius: 22,
  rows: 22,
  rowHeight: 0.7,
  rowDepth: 0.9,
  // Two-tier split: rows 0..tier1Top = lower, rows tier1Top+1..tier2Bottom-1 = VIP gap, rest = upper
  tier1Top: 12,
  tier2Bottom: 14,
};

// Camera presets — animation hop-targets.
// Each preset has a camera position + look-at target.
export const CAM_PRESETS = {
  heli:  { pos: [125, 95, 125], target: [0, 6, 0],  fov: 32, label: 'Helikopter' },
  drone: { pos: [0, 220, 0.001], target: [0, 0, 0], fov: 35, label: 'Drohne' },
  side:  { pos: [-160, 30, 0],    target: [0, 8, 0], fov: 26, label: 'Gegentribüne' },
  goal:  { pos: [0, 12, -130],    target: [0, 6, 0], fov: 30, label: 'Hinter dem Tor' },
  press: { pos: [120, 70, 0],     target: [0, 6, 0], fov: 28, label: 'Pressebox' },
};

// Stadium name shown on outer signage
export const STADIUM_NAME = 'AURELIA ARENA';
