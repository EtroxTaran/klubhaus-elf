// adaptive-tactics.jsx — POC: Tactics with formation pitch.
//
//   Phone   → pitch + segmented tabs + scroll-list
//   Tablet  → nav + pitch + tabs
//   Desktop → nav + pitch (1.2fr) + role-list (1fr) side by side

function TacticsBody({theme='A', scheme='light'}){
  const tr = useT();
  const isDe = getLocale() === 'de';
  return (
    <div style={{padding:'14px 16px 22px', display:'flex', flexDirection:'column', gap:14}}>
      <header>
        <div style={{fontSize:11, color:'var(--inkMute)', fontWeight:700, letterSpacing:.4, textTransform:'uppercase'}}>{isDe ? 'Taktik · Hafenstadt-Standard' : 'Tactics · Hafenstadt-Standard'}</div>
        <SerifH theme={theme} style={{fontSize:24, fontWeight:700, color:'var(--ink)', lineHeight:1.05}}>{isDe ? '4-3-3 · Hoher Pressing' : '4-3-3 · High press'}</SerifH>
      </header>

      {/* Adaptive pitch + role list: stacks on phone, side-by-side on wide */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:14, alignItems:'flex-start'}}>
        <div style={{background:'var(--card)', border:'1px solid var(--rule)', borderRadius:14, padding:14, display:'flex', justifyContent:'center'}}>
          <div style={{width:'100%', maxWidth:280}}>
            <FormationPitch theme={theme} scheme={scheme} formation="4-3-3"/>
          </div>
        </div>
        <div style={{background:'var(--card)', border:'1px solid var(--rule)', borderRadius:14, padding:'4px 14px'}}>
          {[
            { pos:'TW', name:'Wendling', role:isDe?'Klassisch':'Classic'},
            { pos:'IV', name:'Carrara',  role:isDe?'Ballspielend':'Ball-playing'},
            { pos:'DM', name:'Holtmann', role:isDe?'Abräumer':'Anchor'},
            { pos:'ZM', name:'Reiter',   role:'Regista'},
            { pos:'OM', name:'Brody',    role:isDe?'Spielmacher':'Playmaker', hi:true},
            { pos:'ST', name:'Wieser',   role:isDe?'Schattenstürmer':'Shadow striker'},
            { pos:'ST', name:'Kalt',     role:isDe?'Wandspieler':'Target man'},
          ].map((r,i,arr)=>(
            <div key={i} style={{display:'flex', alignItems:'center', gap:8, padding:'9px 0', borderBottom: i<arr.length-1?'1px solid var(--rule)':'none'}}>
              <PosPill pos={r.pos} theme={theme} scheme={scheme}/>
              <span style={{flex:1, fontSize:12.5, fontWeight:700, color:'var(--ink)'}}>{r.name}</span>
              <span style={{fontSize:10.5, fontWeight:800, padding:'2px 7px', borderRadius:99, background: r.hi?'var(--accentSoft)':'var(--bgInk)', color: r.hi?'var(--accent)':'var(--inkMute)', letterSpacing:.3, textTransform:'uppercase'}}>{r.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TacticsAdaptive({theme='A', scheme='light'}){
  const tr = useT();
  const isDe = getLocale() === 'de';
  return (
    <AdaptiveShell theme={theme} scheme={scheme}
      nav={<NavRail items={[
        { id:'hub',     label: isDe?'Büro':'Office',   icon:<I.Pitch size={16}/> },
        { id:'inbox',   label: tr('inbox.title'),       icon:<I.Inbox size={16}/> },
        { id:'squad',   label: tr('squad.title'),       icon:<I.Users size={16}/> },
        { id:'tactics', label: isDe?'Taktik':'Tactics', icon:<I.Pitch size={16}/>, active:true },
        { id:'finance', label: tr('finance.title'),     icon:<I.Wallet size={16}/> },
      ]}/>}
      context={
        <div style={{padding:'14px 12px', display:'flex', flexDirection:'column', gap:10}}>
          <div style={{fontSize:10, fontWeight:800, color:'var(--accent)', letterSpacing:1.2, textTransform:'uppercase'}}>{isDe ? 'Schnellzugriff' : 'Quick access'}</div>
          {[
            isDe?'Aufstellung':'Line-up',
            isDe?'Rollen':'Roles',
            isDe?'Standards':'Set pieces',
            isDe?'Vorlagen':'Presets',
          ].map((l,i)=>(
            <button key={i} style={{
              padding:'10px 12px', borderRadius:10, background:'var(--card)', border:'1px solid var(--rule)',
              color:'var(--ink)', fontFamily:'inherit', fontWeight:700, fontSize:12, textAlign:'left', cursor:'pointer'
            }}>{l}</button>
          ))}
        </div>
      }>
      <TacticsBody theme={theme} scheme={scheme}/>
    </AdaptiveShell>
  );
}

Object.assign(window, { TacticsBody, TacticsAdaptive });
