// adaptive-match.jsx — POC: Match-Day cockpit.
//
//   Phone   → score header + feed + bottom CTA (tempo)
//   Tablet  → nav + main with feed
//   Desktop → nav + main (feed + tactical pitch) + right rail (live stats)

function MatchHeader({theme='A', scheme='light'}){
  const t = THEMES[theme][scheme];
  const isDe = getLocale() === 'de';
  return (
    <header style={{background:'var(--card)', borderBottom:'1px solid var(--rule)', padding:'10px 16px 12px'}}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:14}}>
        <div style={{display:'flex', alignItems:'center', gap:8}}>
          <Crest {...crestFor('Northbridge City')} size={28}/>
          <SerifH theme={theme} style={{fontSize:14, fontWeight:700, color:'var(--ink)'}}>Northbridge</SerifH>
        </div>
        <SerifH theme={theme} style={{fontSize:42, fontWeight:800, color:'var(--ink)', letterSpacing:-1, fontFamily:THEMES[theme].font, lineHeight:1}}>1<span style={{color:'var(--inkSoft)'}}>:</span><span style={{color:'var(--accent)'}}>2</span></SerifH>
        <div style={{display:'flex', alignItems:'center', gap:8}}>
          <SerifH theme={theme} style={{fontSize:14, fontWeight:700, color:'var(--ink)'}}>Hafenstadt</SerifH>
          <Crest {...crestFor('FC Hafenstadt')} size={28}/>
        </div>
      </div>
      <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginTop:6}}>
        <span style={{fontFamily:'JetBrains Mono', fontSize:11, fontWeight:700, color:'var(--accent)'}}>● LIVE · 90+3</span>
        <span style={{fontSize:11, color:'var(--inkMute)'}}>{isDe ? '27.412 Zuschauer' : '27,412 attendance'}</span>
      </div>
    </header>
  );
}

function MatchFeedBody({theme='A', scheme='light'}){
  return (
    <div style={{padding:'8px 16px 20px', position:'relative'}}>
      <EngineMockStamp corner="tr" size="sm"/>
      {FEED.map((e,i)=>(
        <MatchEvent key={i} theme={theme} scheme={scheme}
          min={e.min} kind={e.kind}
          title={e.t} sub={e.s} score={e.score}
          last={i === FEED.length - 1}/>
      ))}
    </div>
  );
}

function MatchAdaptive({theme='A', scheme='light'}){
  const t = THEMES[theme][scheme];
  const tr = useT();
  const tier = useBreakpoint();
  const isDe = getLocale() === 'de';
  const showRightRail = tier === 'desktop';
  return (
    <AdaptiveShell theme={theme} scheme={scheme}
      nav={<NavRail items={[
        { id:'hub',     label: isDe ? 'Büro' : 'Office',    icon:<I.Pitch size={16}/> },
        { id:'inbox',   label: tr('inbox.title'),            icon:<I.Inbox size={16}/> },
        { id:'squad',   label: tr('squad.title'),            icon:<I.Users size={16}/> },
        { id:'match',   label: isDe ? 'Spiel' : 'Match',    icon:<I.Whistle size={16}/>, active:true },
        { id:'tactics', label: isDe ? 'Taktik' : 'Tactics', icon:<I.Pitch size={16}/> },
      ]}/>}
      context={
        <div style={{padding:'14px 12px', display:'flex', flexDirection:'column', gap:10}}>
          <div style={{fontSize:10, fontWeight:800, color:'var(--accent)', letterSpacing:1.2, textTransform:'uppercase'}}>{isDe ? 'Live · 90+3' : 'Live · 90+3'}</div>
          {/* Live stat tiles */}
          {[
            {k:isDe?'Ballbesitz':'Possession', v:'42 / 58 %'},
            {k:isDe?'Schüsse':'Shots',          v:'9 / 14'},
            {k:isDe?'aufs Tor':'on target',     v:'3 / 7'},
            {k:'xG',                            v:'1,1 / 1,8'},
            {k:isDe?'Ecken':'Corners',          v:'4 / 6'},
          ].map((s,i)=>(
            <div key={i} style={{background:'var(--card)', border:'1px solid var(--rule)', borderRadius:10, padding:'8px 11px'}}>
              <div style={{fontSize:10, color:'var(--inkMute)', fontWeight:700, letterSpacing:.4, textTransform:'uppercase'}}>{s.k}</div>
              <div style={{fontSize:14, fontWeight:800, color:'var(--ink)', marginTop:2, fontFamily:'JetBrains Mono'}}>{s.v}</div>
            </div>
          ))}
        </div>
      }
      bottomActions={
        <div style={{display:'flex', gap:8}}>
          <button style={{flex:1, height:48, borderRadius:14, background:'var(--card)', border:'1px solid var(--rule)', color:'var(--ink)', fontWeight:700, fontFamily:'inherit', display:'flex',alignItems:'center',justifyContent:'center',gap:6, fontSize:13}}>
            <I.Whistle size={16} color={t.ink}/> {tr('match.pause')}
          </button>
          <button style={{flex:2, height:48, borderRadius:14, background:'var(--ink)', border:'none', color:'var(--bg)', fontWeight:800, fontFamily:'inherit', display:'flex',alignItems:'center',justifyContent:'center',gap:6, fontSize:14}}>
            {tr('match.tempo')} ❯❯ ({tr('match.tempo.x2')})
          </button>
        </div>
      }
    >
      <MatchHeader theme={theme} scheme={scheme}/>
      {showRightRail
        ? <MatchFeedBody theme={theme} scheme={scheme}/>
        : <MatchFeedBody theme={theme} scheme={scheme}/>}
    </AdaptiveShell>
  );
}

Object.assign(window, { MatchHeader, MatchFeedBody, MatchAdaptive });
