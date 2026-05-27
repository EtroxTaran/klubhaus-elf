// cameras.js — Camera preset interpolation (smooth dolly between named viewpoints).
import * as THREE from 'three';
import { CAM_PRESETS } from './config.js';

export function createCameraDirector(camera, controls) {
  const state = {
    active: null,                 // preset id while in motion
    t: 0,                         // 0..1 progress
    duration: 1.4,                // seconds
    from: { pos: new THREE.Vector3(), target: new THREE.Vector3(), fov: camera.fov },
    to:   { pos: new THREE.Vector3(), target: new THREE.Vector3(), fov: camera.fov },
  };

  // Easing — easeInOutCubic
  const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function goTo(presetId, opts = {}) {
    const p = CAM_PRESETS[presetId];
    if (!p) return;
    state.active = presetId;
    state.t = 0;
    state.duration = opts.duration ?? 1.4;
    state.from.pos.copy(camera.position);
    state.from.target.copy(controls.target);
    state.from.fov = camera.fov;
    state.to.pos.set(...p.pos);
    state.to.target.set(...p.target);
    state.to.fov = p.fov ?? camera.fov;
    controls.autoRotate = false;
  }

  function tick(dt) {
    if (!state.active) return;
    state.t += dt / state.duration;
    const e = ease(Math.min(1, state.t));
    camera.position.lerpVectors(state.from.pos, state.to.pos, e);
    controls.target.lerpVectors(state.from.target, state.to.target, e);
    camera.fov = state.from.fov + (state.to.fov - state.from.fov) * e;
    camera.updateProjectionMatrix();
    if (state.t >= 1) state.active = null;
  }

  return { goTo, tick, get active() { return state.active; } };
}
