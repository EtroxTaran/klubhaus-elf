// adaptive-finance.jsx — POC: Finance with KPI grid.
//
//   Phone   → stacked KPIs + ops list
//   Tablet  → nav + KPI grid (2 col)
//   Desktop → nav + KPI grid (4 col) + right rail (levers)

function FinanceBody({theme='A', scheme='light', includeLevers=false}){
  const tr = useT();
  const isDe = getLocale() === 'de';
  return (
    <div style={{padding:'14px 16px 22px', display:'flex', flexDirection:'column', gap:14}}>
      <header>
        <div style={{fontSize:11, color:'var(--inkMute)', fontWeight:700, letterSpacing:.4, textTransform:'uppercase'}}>{isDe ? 'Mai 2026' : 'May 2026'}</div>
        <SerifH theme={theme} style={{fontSize:24, fontWeight:700, color:'var(--ink)', lineHeight:1.05}}>{tr('finance.title')}</SerifH>
      </header>

      {/* KPI grid — adapts column count to available width */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:10}}>
        {[
          {k:isDe?'Kontostand':'Cash on hand', v:'14,28 Mio. €', t:'+ 632 k €/Mon.'},
          {k:tr('finance.balance'),             v:'+ 632 k €',   t:'+14% vs Apr'},
          {k:isDe?'Investitionen':'Investment', v:'2,3 / 8,5 M', t:'27% gebunden'},
          {k:tr('finance.levy'),                v:'-14,5 k €',   t:isDe?'fällig in 4 Tagen':'due in 4 days'},
        ].map((kpi,i)=>(
          <div key={i} style={{background:'var(--card)', border:'1px solid var(--rule)', borderRadius:12, padding:'12px 14px'}}>
            <div style={{fontSize:10, color:'var(--inkMute)', fontWeight:700, letterSpacing:.4, textTransform:'uppercase'}}>{kpi.k}</div>
            <div style={{fontSize:20, fontWeight:800, color:'var(--ink)', marginTop:4, fontFamily:'JetBrains Mono'}}>{kpi.v}</div>
            <div style={{fontSize:10.5, color:'var(--ok)', marginTop:3, fontWeight:700}}>{kpi.t}</div>
          </div>
        ))}
      </div>

      {/* Breakdown */}
      <div style={{background:'var(--card)', border:'1px solid var(--rule)', borderRadius:14, padding:'14px 16px'}}>
        <div style={{fontSize:11, color:'var(--inkMute)', fontWeight:700, letterSpacing:.4, textTransform:'uppercase'}}>{isDe ? 'Einnahmen Mai' : 'May revenue'}</div>
        {FIN.ops.map((o,i)=>(
          <div key={i} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom: i<FIN.ops.length-1?'1px solid var(--rule)':'none'}}>
            <span style={{fontSize:13, color:'var(--ink)'}}>{o.k}</span>
            <span style={{fontFamily:'JetBrains Mono', fontSize:13, fontWeight:700, color:'var(--ok)'}}>+ {Math.round(o.v/1000)} k €</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FinanceAdaptive({theme='A', scheme='light'}){
  const tr = useT();
  const isDe = getLocale() === 'de';
  return (
    <AdaptiveShell theme={theme} scheme={scheme}
      nav={<NavRail items={[
        { id:'hub',     label: isDe?'Büro':'Office',   icon:<I.Pitch size={16}/> },
        { id:'inbox',   label: tr('inbox.title'),       icon:<I.Inbox size={16}/> },
        { id:'squad',   label: tr('squad.title'),       icon:<I.Users size={16}/> },
        { id:'finance', label: tr('finance.title'),     icon:<I.Wallet size={16}/>, active:true },
        { id:'stadium', label: tr('stadium.title'),     icon:<I.Building size={16}/> },
      ]}/>}
      context={
        <div style={{padding:'14px 12px', display:'flex', flexDirection:'column', gap:10}}>
          <div style={{fontSize:10, fontWeight:800, color:'var(--accent)', letterSpacing:1.2, textTransform:'uppercase'}}>{isDe ? 'Hebel' : 'Levers'}</div>
          {[
            {k:isDe?'Ticketpreis · Stehplatz':'Ticket · standing', v:'14 €', sub:'62%'},
            {k:isDe?'Trikotsponsoring':'Shirt sponsor',             v:'1,8 M', sub:'48%'},
            {k:isDe?'Nachwuchs-Etat':'Youth budget',                v:'180 k', sub:'71%'},
          ].map((l,i)=>(
            <div key={i} style={{background:'var(--card)', border:'1px solid var(--rule)', borderRadius:10, padding:'10px 12px'}}>
              <div style={{fontSize:11, color:'var(--inkMute)', fontWeight:700, lineHeight:1.2}}>{l.k}</div>
              <div style={{fontSize:14, fontWeight:800, color:'var(--accent)', marginTop:4, fontFamily:'JetBrains Mono'}}>{l.v}</div>
              <div style={{height:4, background:'var(--bgInk)', borderRadius:99, marginTop:6, overflow:'hidden'}}>
                <div style={{width:l.sub, height:'100%', background:'var(--accent)'}}/>
              </div>
            </div>
          ))}
        </div>
      }>
      <FinanceBody theme={theme} scheme={scheme}/>
    </AdaptiveShell>
  );
}

Object.assign(window, { FinanceBody, FinanceAdaptive });
