// adaptive-hub.jsx — POC of plan.md §5 "one component, three tiers".
//
// Same HubBody renders identically on phone (390 px), tablet (768 px) and
// desktop (1280 px). AdaptiveShell handles the chrome: bottom CTA on phone,
// left nav rail on tablet+, right context rail on desktop only.
//
// Compare to legacy ScreenHub (`screens-part1.jsx`) which has the phone
// chrome hard-coded around the body. The legacy version still works; this
// POC shows the path forward for production.

function HubBody({theme='A', scheme='light'}){
  const t = THEMES[theme][scheme];
  const tr = useT();
  const isDe = getLocale() === 'de';
  const m = FIXTURES[0];
  const kicker = isDe
    ? '„Heute klärt sich, ob der Vorstand Geduld kennt." — Auerbach-Zeitung'
    : '“Today we find out if the board has any patience left.” — Auerbach Times';
  return (
    <div style={{padding:'0 16px 16px', display:'flex', flexDirection:'column', gap:14}}>
      <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0 4px'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <Crest {...crestFor('FC Hafenstadt')} size={34}/>
          <div>
            <div style={{fontSize:11, color:'var(--inkMute)', letterSpacing:.4, fontWeight:600, textTransform:'uppercase'}}>FC Hafenstadt</div>
            <SerifH theme={theme} style={{fontSize:18, fontWeight:700, lineHeight:1.05, color:'var(--ink)'}}>{isDe ? 'Mo, 18. Mai · 09:41' : 'Mon, 18 May · 09:41'}</SerifH>
          </div>
        </div>
        <button aria-label={tr('inbox.title')} style={{position:'relative',width:40,height:40,borderRadius:12,background:'var(--card)',border:'1px solid var(--rule)',display:'grid',placeItems:'center',color:'var(--ink)'}}>
          <I.Inbox size={18} color={t.ink}/>
          <span style={{position:'absolute',top:-4,right:-4,minWidth:18,height:18,padding:'0 5px',borderRadius:999,background:'var(--accent)',color:'#fff',fontSize:10,fontWeight:800,display:'grid',placeItems:'center'}}>5</span>
        </button>
      </header>
      <div style={{fontFamily:THEMES[theme].font, fontStyle:'italic', fontSize:13, color:'var(--inkMute)', padding:'0 2px 10px', borderBottom:'1px solid var(--rule)'}}>
        {kicker}
      </div>

      <NextMatchCard theme={theme} scheme={scheme}
        home="Northbridge City" away="Hafenstadt"
        dateLine={`${m.date} · 15:30`}
        metaLine={`${m.comp} · ${m.venue} · ${m.tickets}`}
        aside={
          <div style={{display:'flex',gap:18, alignItems:'center'}}>
            <div>
              <div style={{fontSize:10, color:'var(--inkMute)', fontWeight:600}}>{isDe ? 'Stärke' : 'Strength'}</div>
              <div style={{display:'flex',alignItems:'center',gap:6,marginTop:4}}>
                <span style={{fontFamily:'JetBrains Mono', fontSize:13, fontWeight:700, color:'var(--ink)'}}>7,6</span>
                <span style={{fontSize:10, color:'var(--inkSoft)'}}>vs</span>
                <span style={{fontFamily:'JetBrains Mono', fontSize:13, fontWeight:700, color:'var(--ink)'}}>7,4</span>
              </div>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:10, color:'var(--inkMute)', fontWeight:600}}>{tr('squad.col.form')}</div>
              <div style={{marginTop:4}}><FormStrip form="SSNSU" theme={theme} scheme={scheme}/></div>
            </div>
          </div>
        }/>

      {/* Tile grid — container-aware: stacks 1-col on narrow, 2-col on
          medium, 4-col on wide. Driven by CSS grid auto-fit / minmax. */}
      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))',
        gap:10,
      }}>
        {[
          { i:<I.Pitch color={t.ink} size={20}/>,     k: tr('hub.tile.training'),  sub: isDe ? 'Mo–Sa · Defensive' : 'Mon–Sat · Defending', flag: isDe ? '2 Spieler angeschlagen' : '2 players knocked' },
          { i:<I.Users color={t.ink} size={20}/>,     k: tr('hub.tile.transfers'), sub: isDe ? '3 Anfragen offen'   : '3 enquiries open',    flag: isDe ? 'Brody umworben' : 'Brody wanted' },
          { i:<I.Megaphone color={t.ink} size={20}/>, k: tr('board.title'),         sub: isDe ? 'Stabil · 7 von 10'  : 'Stable · 7 of 10',    flag: isDe ? 'Druck wächst' : 'Pressure rising' },
          { i:<I.Wallet color={t.ink} size={20}/>,    k: tr('hub.tile.finance'),   sub: isDe ? '+ 632.000 € / Monat': '+ €632k / month',     flag: tr('finance.levy') + (isDe ? ' fällig' : ' due') },
        ].map((x,i)=>(
          <HubTile key={i} theme={theme} scheme={scheme}
            icon={x.i} label={x.k} sub={x.sub} flag={x.flag}/>
        ))}
      </div>
    </div>
  );
}

// ─── Adaptive Hub Wrapper ──────────────────────────────────────
// Phone, Tablet and Desktop all render via this single component. The
// AdaptiveShell decides what chrome to show; HubBody fills the main column.
function HubAdaptive({theme='A', scheme='light'}){
  const tr = useT();
  const isDe = getLocale() === 'de';
  const navItems = [
    { id:'hub',     label: isDe ? 'Büro'           : 'Office',     icon: <I.Pitch    size={16} color={'currentColor'}/>, active:true },
    { id:'inbox',   label: tr('inbox.title'),                       icon: <I.Inbox    size={16} color={'currentColor'}/> },
    { id:'squad',   label: tr('squad.title'),                       icon: <I.Users    size={16} color={'currentColor'}/> },
    { id:'tactics', label: isDe ? 'Taktik'         : 'Tactics',    icon: <I.Pitch    size={16} color={'currentColor'}/> },
    { id:'finance', label: tr('finance.title'),                     icon: <I.Wallet   size={16} color={'currentColor'}/> },
    { id:'board',   label: tr('board.title'),                       icon: <I.Megaphone size={16} color={'currentColor'}/> },
  ];
  return (
    <AdaptiveShell theme={theme} scheme={scheme}
      nav={<NavRail items={navItems}/>}
      context={
        // Right context rail — only shown ≥ 1200 px
        <div style={{padding:'14px 12px', display:'flex', flexDirection:'column', gap:10}}>
          <div style={{fontSize:10, fontWeight:800, color:'var(--accent)', letterSpacing:1.2, textTransform:'uppercase'}}>{isDe ? 'Heute · 18. Mai' : 'Today · 18 May'}</div>
          <div style={{background:'var(--card)', border:'1px solid var(--rule)', borderRadius:12, padding:'10px 12px'}}>
            <div style={{fontSize:11, color:'var(--inkMute)', fontWeight:700, letterSpacing:.4, textTransform:'uppercase'}}>{isDe ? 'Verbandsabgabe' : 'League Levy'}</div>
            <div style={{fontFamily:'JetBrains Mono', fontSize:18, fontWeight:800, color:'var(--accent)', marginTop:4}}>−14.500 €</div>
            <div style={{fontSize:10.5, color:'var(--inkSoft)', marginTop:3}}>{isDe ? 'fällig in 4 Tagen' : 'due in 4 days'}</div>
          </div>
          <div style={{background:'var(--card)', border:'1px solid var(--rule)', borderRadius:12, padding:'10px 12px'}}>
            <div style={{fontSize:11, color:'var(--inkMute)', fontWeight:700, letterSpacing:.4, textTransform:'uppercase'}}>{tr('hub.tile.inbox')}</div>
            <div style={{fontSize:14, fontWeight:700, color:'var(--ink)', marginTop:4}}>{isDe ? '5 ungelesen' : '5 unread'}</div>
            <div style={{fontSize:10.5, color:'var(--inkSoft)', marginTop:3}}>{isDe ? '2 Vorstand · 1 Presse · 2 Sponsor' : '2 board · 1 press · 2 sponsor'}</div>
          </div>
        </div>
      }
      bottomActions={
        // Only shown ≤ 768 px (CSS hides it above)
        <AdvanceButton theme={theme} scheme={scheme}
          daysOffset={3}
          label={isDe ? 'Weiter zum nächsten Termin' : 'Advance to next event'}/>
      }
    >
      <HubBody theme={theme} scheme={scheme}/>
    </AdaptiveShell>
  );
}

Object.assign(window, { HubAdaptive, HubBody });
