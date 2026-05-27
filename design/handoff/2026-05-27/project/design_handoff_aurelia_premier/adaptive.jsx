// adaptive.jsx — Responsive shell foundation.
//
// Implements plan.md §5: one component, three tiers.
//   ≤ 768 px → Phone   — single column, sticky bottom CTA, no rails
//   769-1199 → Tablet  — left nav rail (220 px) + main
//   ≥ 1200   → Desktop — left rail + main + right context rail (320 px)
//
// CSS-only: no JS viewport sniffing. Screens that opt in render via
// <AdaptiveShell>; their children sit inside the main column. Pass `nav`,
// `context`, `bottomActions` slots to control what shows on each tier.
//
// Container queries: a sibling helper `<DenseCard/>` shows how a card can
// decide its own layout (vertical vs horizontal) based on the column width
// it lands in, independent of viewport. This is the pattern composites
// should adopt during their second migration pass.

// ─── AdaptiveShell ─────────────────────────────────────────────
//
//   <AdaptiveShell
//     nav={<NavRail/>}
//     context={<MatchContext/>}
//     bottomActions={<AdvanceBar/>}
//   >
//     <Outlet/>
//   </AdaptiveShell>

function AdaptiveShell({ nav, context, bottomActions, children, theme='A', scheme='light' }){
  // Inject scoped CSS for the breakpoint behaviour. Each shell instance gets
  // its own class to avoid bleed between adjacent showcases on the canvas.
  const id = React.useId().replace(/[:]/g, '_');
  const css = `
    .as-${id} {
      display: grid; height: 100%;
      grid-template-rows: 1fr auto;
      background: var(--bg);
    }
    .as-${id} > .as-body {
      display: grid; gap: 0;
      grid-template-columns: 1fr;
      grid-template-areas: "main";
      overflow: hidden;
    }
    .as-${id} > .as-body > .as-nav     { display: none; grid-area: nav;     border-right: 1px solid var(--rule); background: var(--card); }
    .as-${id} > .as-body > .as-main    { grid-area: main; overflow-y: auto; min-width: 0; }
    .as-${id} > .as-body > .as-context { display: none; grid-area: context; border-left: 1px solid var(--rule); background: var(--card); }
    .as-${id} > .as-bottom { padding: 10px 16px env(safe-area-inset-bottom, 18px); background: linear-gradient(to top, var(--bg), color-mix(in srgb, var(--bg) 92%, transparent)); border-top: 1px solid var(--rule); }

    /* Tablet — left nav appears */
    @media (min-width: 769px) {
      .as-${id} > .as-body {
        grid-template-columns: 220px 1fr;
        grid-template-areas: "nav main";
      }
      .as-${id} > .as-body > .as-nav { display: block; }
      .as-${id} > .as-bottom { display: none; }
    }

    /* Desktop — right context rail appears */
    @media (min-width: 1200px) {
      .as-${id} > .as-body {
        grid-template-columns: 220px 1fr 320px;
        grid-template-areas: "nav main context";
      }
      .as-${id} > .as-body > .as-context { display: block; }
    }
  `;
  return (
    <ThemeRoot theme={theme} scheme={scheme} className={`as-${id}`}>
      <style>{css}</style>
      <div className="as-body">
        {nav     && <aside className="as-nav">{nav}</aside>}
        <main className="as-main">{children}</main>
        {context && <aside className="as-context">{context}</aside>}
      </div>
      {bottomActions && <div className="as-bottom">{bottomActions}</div>}
    </ThemeRoot>
  );
}

// ─── NavRail ────────────────────────────────────────────────────
// Default nav rail content for AdaptiveShell. Pass `items=[{id,label,icon,active}]`.
function NavRail({ items=[], onSelect, theme='A', scheme='light' }){
  return (
    <nav style={{padding:'14px 8px', display:'flex', flexDirection:'column', gap:2}}>
      {items.map(it => (
        <button key={it.id} onClick={()=>onSelect && onSelect(it.id)} style={{
          display:'flex', alignItems:'center', gap:10,
          padding:'10px 12px', borderRadius:10, border:'none', cursor:'pointer',
          background: it.active ? 'var(--accentSoft)' : 'transparent',
          color:    it.active ? 'var(--accent)'      : 'var(--ink)',
          fontFamily:'inherit', fontWeight: it.active ? 700 : 600, fontSize:13,
          textAlign:'left',
        }}>
          {it.icon ? <span style={{width:18, height:18, display:'grid', placeItems:'center'}}>{it.icon}</span> : null}
          {it.label}
        </button>
      ))}
    </nav>
  );
}

// ─── useBreakpoint() ────────────────────────────────────────────
// Hook for the rare case where you *must* know the tier in JS (not for
// styling — for behaviour). Returns 'phone' | 'tablet' | 'desktop'.
function useBreakpoint(){
  const [tier, setTier] = React.useState(() => {
    if (typeof window === 'undefined') return 'phone';
    const w = window.innerWidth;
    return w >= 1200 ? 'desktop' : w >= 769 ? 'tablet' : 'phone';
  });
  React.useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      setTier(w >= 1200 ? 'desktop' : w >= 769 ? 'tablet' : 'phone');
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return tier;
}

Object.assign(window, { AdaptiveShell, NavRail, useBreakpoint });
