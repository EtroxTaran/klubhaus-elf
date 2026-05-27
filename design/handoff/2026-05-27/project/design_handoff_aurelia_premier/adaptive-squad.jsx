// adaptive-squad.jsx — POC: Squad Master-Detail.
//
//   Phone   → squad list only; tap opens a Sheet (not shown here)
//   Tablet  → list left + lightweight player-summary right
//   Desktop → 3-area: list, profile, attributes

function SquadList({theme='A', scheme='light', selectedShirt=10, onSelect}){
  const tr = useT();
  return (
    <div style={{padding:'14px 12px 18px', display:'flex', flexDirection:'column', gap:6}}>
      <header style={{padding:'2px 4px 8px', display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
        <SerifH theme={theme} style={{fontSize:20, fontWeight:700, color:'var(--ink)'}}>{tr('squad.first_team')}</SerifH>
        <span style={{fontSize:10.5, color:'var(--inkMute)', fontWeight:700, fontFamily:'JetBrains Mono'}}>{SQUAD.length}</span>
      </header>
      {SQUAD.slice(0,11).map((p,i)=>(
        <div key={i} onClick={()=>onSelect && onSelect(p.shirt)} style={{
          cursor:'pointer', borderRadius:12,
          outline: p.shirt === selectedShirt ? '2px solid var(--accent)' : 'none',
          outlineOffset: p.shirt === selectedShirt ? -2 : 0,
        }}>
          <PlayerCard p={p} theme={theme} scheme={scheme}/>
        </div>
      ))}
    </div>
  );
}

function SquadPlayerDetail({theme='A', scheme='light', shirt=10}){
  const p = SQUAD.find(s => s.shirt === shirt) || SQUAD[0];
  const isDe = getLocale() === 'de';
  return (
    <div style={{padding:'18px 18px 22px', display:'flex', flexDirection:'column', gap:14}}>
      <div style={{display:'flex', alignItems:'center', gap:12}}>
        <Portrait name={p.n} theme={theme} scheme={scheme} size={64} variant="player"/>
        <div style={{flex:1}}>
          <div style={{fontSize:11, color:'var(--inkMute)', fontWeight:700, letterSpacing:.4, textTransform:'uppercase'}}>#{p.shirt} · {p.nat}</div>
          <SerifH theme={theme} style={{fontSize:26, fontWeight:800, color:'var(--ink)', lineHeight:1.05}}>{p.n}</SerifH>
          <div style={{display:'flex', gap:8, marginTop:4, alignItems:'center'}}>
            <PosPill pos={p.pos} theme={theme} scheme={scheme}/>
            <span style={{fontSize:11, color:'var(--inkMute)', fontVariantNumeric:'tabular-nums'}}>{p.age} {isDe ? 'J.' : 'yo'}</span>
            <span style={{fontSize:11, color:'var(--inkMute)', fontVariantNumeric:'tabular-nums'}}>{isDe ? 'Form' : 'Form'} {p.form}</span>
          </div>
        </div>
        <div style={{textAlign:'right'}}>
          <StrBar n={p.str} theme={theme} scheme={scheme} w={72}/>
          <div style={{marginTop:6, display:'flex', justifyContent:'flex-end'}}><Talent n={p.tal} theme={theme} scheme={scheme}/></div>
        </div>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(120px, 1fr))', gap:10}}>
        {[
          {k:isDe?'Vertrag':'Contract', v:p.contract},
          {k:isDe?'Marktwert':'Value',  v:'12 Mio. €'},
          {k:isDe?'Gehalt':'Wages',     v:'48 k €/Mon.'},
          {k:isDe?'Klausel':'Clause',   v:'15 Mio. €'},
        ].map((s,i)=>(
          <div key={i} style={{background:'var(--card)', border:'1px solid var(--rule)', borderRadius:10, padding:'9px 11px'}}>
            <div style={{fontSize:10, color:'var(--inkMute)', fontWeight:700, letterSpacing:.4, textTransform:'uppercase'}}>{s.k}</div>
            <div style={{fontSize:13, fontWeight:700, color:'var(--ink)', marginTop:3, fontFamily:'JetBrains Mono'}}>{s.v}</div>
          </div>
        ))}
      </div>
      <div style={{borderTop:'1px solid var(--rule)', paddingTop:12, fontSize:13, color:'var(--inkMute)', fontFamily:THEMES[theme].font, fontStyle:'italic', lineHeight:1.45}}>
        {isDe ? 'Auf Desktop links Liste, rechts Detail. Auf Phone öffnet der Tap einen Sheet — Production-Implementierung folgt dem TanStack-Router Master-Detail-Pattern aus plan.md §9.1.'
              : 'Desktop shows list-left, detail-right. Phone opens a Sheet on tap — production implementation follows the TanStack-Router master-detail pattern from plan.md §9.1.'}
      </div>
    </div>
  );
}

function SquadAdaptive({theme='A', scheme='light'}){
  const tr = useT();
  const tier = useBreakpoint();
  const [selectedShirt, setSelectedShirt] = React.useState(10);
  const isDe = getLocale() === 'de';
  // Phone: just the list. Tablet+: list + detail.
  const showDetailInMain = tier !== 'phone';
  return (
    <AdaptiveShell theme={theme} scheme={scheme}
      nav={<NavRail items={[
        { id:'hub',     label: isDe ? 'Büro' : 'Office',    icon:<I.Pitch size={16}/> },
        { id:'inbox',   label: tr('inbox.title'),            icon:<I.Inbox size={16}/> },
        { id:'squad',   label: tr('squad.title'),            icon:<I.Users size={16}/>, active:true },
        { id:'tactics', label: isDe ? 'Taktik' : 'Tactics', icon:<I.Pitch size={16}/> },
        { id:'finance', label: tr('finance.title'),          icon:<I.Wallet size={16}/> },
      ]}/>}>
      {showDetailInMain ? (
        <div style={{display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:0, height:'100%'}}>
          <div style={{borderRight:'1px solid var(--rule)', overflowY:'auto'}}>
            <SquadList theme={theme} scheme={scheme} selectedShirt={selectedShirt} onSelect={setSelectedShirt}/>
          </div>
          <div style={{overflowY:'auto', background:'var(--card)'}}>
            <SquadPlayerDetail theme={theme} scheme={scheme} shirt={selectedShirt}/>
          </div>
        </div>
      ) : (
        <SquadList theme={theme} scheme={scheme} selectedShirt={selectedShirt} onSelect={setSelectedShirt}/>
      )}
    </AdaptiveShell>
  );
}

Object.assign(window, { SquadList, SquadPlayerDetail, SquadAdaptive });
