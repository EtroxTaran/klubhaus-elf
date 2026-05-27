// adaptive-inbox.jsx — POC of plan.md §5: Master-Detail pattern.
//
//   Phone   → just the list; tapping opens a Sheet (here: simulated banner)
//   Tablet  → list left, no detail (or detail in route)
//   Desktop → list (1fr) + selected-thread detail (1.4fr) side-by-side
//
// Same React tree; layout decided by AdaptiveShell + useBreakpoint.

function InboxBody({theme='A', scheme='light', selectedId=0, onSelect}){
  const tr = useT();
  return (
    <div style={{padding:'14px 16px 18px', display:'flex', flexDirection:'column', gap:8}}>
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:4}}>
        <div>
          <div style={{fontSize:11, color:'var(--inkMute)', fontWeight:700, letterSpacing:.4, textTransform:'uppercase'}}>{getLocale()==='de' ? '5 ungelesen' : '5 unread'}</div>
          <SerifH theme={theme} style={{fontSize:24, fontWeight:700, color:'var(--ink)', lineHeight:1.05}}>{tr('inbox.title')}</SerifH>
        </div>
        <button aria-label={tr('common.filter')} style={{width:36,height:36,borderRadius:10,background:'var(--card)',border:'1px solid var(--rule)',display:'grid',placeItems:'center'}}><I.Filter color="currentColor" size={16} style={{color:'var(--ink)'}}/></button>
      </header>
      {INBOX.map((c,i)=>(
        <div key={i} onClick={()=>onSelect && onSelect(i)} style={{
          cursor:'pointer', borderRadius:14,
          outline: i === selectedId ? '2px solid var(--accent)' : 'none',
          outlineOffset: i === selectedId ? -2 : 0,
        }}>
          <InboxCard theme={theme} scheme={scheme}
            tone={c.tone} from={c.from} title={c.title} body={c.body} time={c.time}/>
        </div>
      ))}
    </div>
  );
}

function InboxThreadDetail({theme='A', scheme='light', thread}){
  const tr = useT();
  const isDe = getLocale() === 'de';
  if (!thread) return null;
  return (
    <div style={{padding:'18px 18px 22px', display:'flex', flexDirection:'column', gap:14}}>
      <div style={{fontSize:11, color:'var(--accent)', fontWeight:800, letterSpacing:1.2, textTransform:'uppercase'}}>
        {tr('inbox.tone.' + thread.tone)} · {thread.from}
      </div>
      <SerifH theme={theme} style={{fontSize:26, fontWeight:800, color:'var(--ink)', lineHeight:1.1}}>{thread.title}</SerifH>
      <div style={{fontSize:14, color:'var(--ink)', lineHeight:1.5, fontFamily:THEMES[theme].font}}>{thread.body}</div>
      <div style={{borderTop:'1px solid var(--rule)', paddingTop:14, fontSize:13, color:'var(--inkMute)', lineHeight:1.5, fontFamily:THEMES[theme].font, fontStyle:'italic'}}>
        {isDe ? 'Volltext erscheint in der Production-App; hier nur Vorschau. Die rechte Spalte zeigt nur, wie das Layout auf Desktop aussieht.' : 'Full thread renders in production; this is preview only. Right column shows the desktop layout pattern.'}
      </div>
      <div style={{display:'flex', gap:6, marginTop:6, flexWrap:'wrap'}}>
        <PillBtn theme={theme} scheme={scheme} intent="accept" icon={<I.Check size={14} color="#fff"/>}>{tr('inbox.action.accept')}</PillBtn>
        <PillBtn theme={theme} scheme={scheme} intent="soft" icon={<I.Clock size={13} color={THEMES[theme][scheme].ink}/>}>{tr('inbox.action.defer')}</PillBtn>
        <PillBtn theme={theme} scheme={scheme} intent="neutral" icon={<I.X size={13} color={THEMES[theme][scheme].ink}/>}>{tr('inbox.action.decline')}</PillBtn>
      </div>
    </div>
  );
}

function InboxAdaptive({theme='A', scheme='light'}){
  const tr = useT();
  const tier = useBreakpoint();
  const [selectedId, setSelectedId] = React.useState(0);
  const thread = INBOX[selectedId];
  const isDe = getLocale() === 'de';

  // On phone: just show the list; tapping would open a Sheet (not shown here)
  // On tablet+: nav rail; list takes full main column
  // On desktop: list + detail side-by-side in main column
  const showDetailInMain = tier === 'desktop';
  return (
    <AdaptiveShell theme={theme} scheme={scheme}
      nav={<NavRail items={[
        { id:'hub',     label: isDe ? 'Büro' : 'Office',     icon:<I.Pitch size={16}/> },
        { id:'inbox',   label: tr('inbox.title'),             icon:<I.Inbox size={16}/>, active:true },
        { id:'squad',   label: tr('squad.title'),             icon:<I.Users size={16}/> },
        { id:'tactics', label: isDe ? 'Taktik' : 'Tactics',  icon:<I.Pitch size={16}/> },
        { id:'finance', label: tr('finance.title'),           icon:<I.Wallet size={16}/> },
      ]}/>}>
      {showDetailInMain ? (
        <div style={{display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:0, height:'100%'}}>
          <div style={{borderRight:'1px solid var(--rule)', overflowY:'auto'}}>
            <InboxBody theme={theme} scheme={scheme} selectedId={selectedId} onSelect={setSelectedId}/>
          </div>
          <div style={{overflowY:'auto', background:'var(--card)'}}>
            <InboxThreadDetail theme={theme} scheme={scheme} thread={thread}/>
          </div>
        </div>
      ) : (
        <InboxBody theme={theme} scheme={scheme} selectedId={selectedId} onSelect={setSelectedId}/>
      )}
    </AdaptiveShell>
  );
}

Object.assign(window, { InboxBody, InboxThreadDetail, InboxAdaptive });
