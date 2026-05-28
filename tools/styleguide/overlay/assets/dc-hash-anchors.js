// Bridge the canvas's `data-dc-section` attributes to native anchor IDs and
// to the canvas's React-internal pan/focus, so hub deep-links like
// canvas.html#screens-a actually land on that section. Also adds a
// back-to-Hub control (the export renders no native chrome to amend).
//
// The canvas uses a pan-zoom transform, not document scroll — `scrollIntoView`
// is a no-op here. The genuine pan primitive is `ctx.setFocus(sectionId/slotId)`
// inside the React tree, reachable via the fiber on any mounted section.
(() => {
  const mirror = (el) => {
    const sid = el.getAttribute('data-dc-section');
    if (sid && !el.id) el.id = sid;
  };

  const findDcCtx = (el) => {
    const key = Object.keys(el).find((k) => k.startsWith('__reactFiber$'));
    if (!key) return null;
    let fiber = el[key];
    for (let i = 0; fiber && i < 80; i++) {
      const v = fiber.memoizedProps && fiber.memoizedProps.value;
      if (v && typeof v.setFocus === 'function' && typeof v.section === 'function') return v;
      fiber = fiber.return;
    }
    return null;
  };

  const focusHash = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return false;
    const section = document.querySelector(`[data-dc-section="${CSS.escape(id)}"]`);
    if (!section) return false;
    const firstSlot = section.querySelector('[data-dc-slot]');
    if (!firstSlot) return false;
    const ctx = findDcCtx(section);
    if (!ctx) return false;
    ctx.setFocus(`${id}/${firstSlot.getAttribute('data-dc-slot')}`);
    return true;
  };

  const injectHubLink = () => {
    if (document.getElementById('overlay-hub-link')) return;
    const a = document.createElement('a');
    a.id = 'overlay-hub-link';
    a.href = 'hub.html';
    a.textContent = '← Hub';
    a.title = 'Zurück zum Aurelia-Hub';
    // Bottom-right so it never clashes with the canvas's top focus-modal chrome.
    Object.assign(a.style, {
      position: 'fixed', bottom: '16px', right: '16px', zIndex: '9999',
      padding: '8px 14px', borderRadius: '999px',
      background: 'rgba(26,20,16,.85)', color: '#f4ede0',
      font: '600 13px/1 Inter, system-ui, sans-serif',
      textDecoration: 'none', backdropFilter: 'blur(6px)',
      boxShadow: '0 4px 16px -4px rgba(0,0,0,.4)',
    });
    document.body.appendChild(a);
  };

  document.querySelectorAll('[data-dc-section]').forEach(mirror);
  injectHubLink();

  // Retry focus until the React canvas ctx is reachable (artboard slots and
  // their fibers only exist after the .jsx files finish Babel-transpiling).
  let focused = false;
  const tryFocus = () => { if (!focused) focused = focusHash(); };

  const mo = new MutationObserver((muts) => {
    let touched = false;
    for (const m of muts) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.matches?.('[data-dc-section]')) { mirror(node); touched = true; }
        node.querySelectorAll?.('[data-dc-section]').forEach((el) => { mirror(el); touched = true; });
      }
    }
    if (touched) tryFocus();
  });
  mo.observe(document.body, { childList: true, subtree: true });
  tryFocus();

  // Hash navigation after mount must always re-focus, even if a previous focus stuck.
  window.addEventListener('hashchange', () => { focused = false; tryFocus(); });
})();
