// cameras.js — Camera preset interpolation (Babylon ArcRotateCamera).
// Converts XYZ position+target presets into (alpha, beta, radius, target) and
// runs a smooth eased lerp on all five values plus FOV.
import { CAM_PRESETS, degToRad } from './config.js';

// Convert {pos:[x,y,z], target:[x,y,z]} → {alpha, beta, radius, target:Vector3}
function presetToArc(p) {
  const target = new BABYLON.Vector3(p.target[0], p.target[1], p.target[2]);
  const dx = p.pos[0] - p.target[0];
  const dy = p.pos[1] - p.target[1];
  const dz = p.pos[2] - p.target[2];
  const radius = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const beta = Math.acos(Math.max(-1, Math.min(1, dy / radius)));
  const alpha = Math.atan2(dz, dx);
  const fovRad = p.fov ? degToRad(p.fov) : null;
  return { alpha, beta, radius, target, fovRad };
}

export function createCameraDirector(camera) {
  const state = {
    active: null,
    t: 0,
    duration: 1.4,
    from: { alpha: 0, beta: 0, radius: 0, target: new BABYLON.Vector3(), fov: camera.fov },
    to:   { alpha: 0, beta: 0, radius: 0, target: new BABYLON.Vector3(), fov: camera.fov },
  };

  const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  // ArcRotateCamera alpha can wrap; pick the shortest signed path.
  function shortestAlpha(from, to) {
    let d = to - from;
    while (d > Math.PI)  d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    return from + d;
  }

  function goTo(presetId, opts = {}) {
    const p = CAM_PRESETS[presetId];
    if (!p) return;
    const arc = presetToArc(p);
    state.active = presetId;
    state.t = 0;
    state.duration = opts.duration ?? 1.4;
    state.from.alpha  = camera.alpha;
    state.from.beta   = camera.beta;
    state.from.radius = camera.radius;
    state.from.target = camera.target.clone();
    state.from.fov    = camera.fov;
    state.to.alpha  = shortestAlpha(camera.alpha, arc.alpha);
    state.to.beta   = arc.beta;
    state.to.radius = arc.radius;
    state.to.target = arc.target.clone();
    state.to.fov    = arc.fovRad ?? camera.fov;
    // Pause autorotate during transit
    camera.useAutoRotationBehavior = false;
    if (camera.autoRotationBehavior) camera.autoRotationBehavior.idleRotationSpeed = 0;
  }

  function tick(dt) {
    if (!state.active) return;
    state.t += dt / state.duration;
    const e = ease(Math.min(1, state.t));
    camera.alpha  = state.from.alpha  + (state.to.alpha  - state.from.alpha)  * e;
    camera.beta   = state.from.beta   + (state.to.beta   - state.from.beta)   * e;
    camera.radius = state.from.radius + (state.to.radius - state.from.radius) * e;
    camera.target = BABYLON.Vector3.Lerp(state.from.target, state.to.target, e);
    camera.fov    = state.from.fov    + (state.to.fov    - state.from.fov)    * e;
    if (state.t >= 1) state.active = null;
  }

  return { goTo, tick, presetToArc, get active() { return state.active; } };
}
