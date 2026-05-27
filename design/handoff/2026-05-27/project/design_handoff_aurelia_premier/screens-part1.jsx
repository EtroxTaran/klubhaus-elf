// screens-part1.jsx — Hub, Inbox, Squad, PreMatch
const SerifH = ({children, theme, style}) => (
  <span style={{fontFamily:THEMES[theme].font, ...style}}>{children}</span>
);

// =================================================================
// 1. OFFICE HUB
// =================================================================
function ScreenHub({theme, scheme}){
  const t = THEMES[theme][scheme];
  const tr = useT();
  const m = FIXTURES[0];
  // Italic kicker — different copy per locale (Sun/Mirror voice for EN).
  const kicker = getLocale() === 'de'
    ? '„Heute klärt sich, ob der Vorstand Geduld kennt." — Auerbach-Zeitung'
    : '“Today we find out if the board has any patience left.” — Auerbach Times';
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',padding:'0 16px 92px', position:'relative'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'6px 0 8px'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <Crest {...crestFor('FC Hafenstadt')} size={34}/>
          <div>
            <div style={{fontSize:11, color:t.inkMute, letterSpacing:.4, fontWeight:600, textTransform:'uppercase'}}>FC Hafenstadt</div>
            <SerifH theme={theme} style={{fontSize:18, fontWeight:700, lineHeight:1.05, color:t.ink}}>{getLocale() === 'de' ? 'Mo, 18. Mai · 09:41' : 'Mon, 18 May · 09:41'}</SerifH>
          </div>
        </div>
        <button aria-label={tr('inbox.title')} style={{position:'relative',width:40,height:40,borderRadius:12,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center',color:t.ink}}>
          <I.Inbox size={18} color={t.ink}/>
          <span style={{position:'absolute',top:-4,right:-4,minWidth:18,height:18,padding:'0 5px',borderRadius:999,background:t.accent,color:'#fff',fontSize:10,fontWeight:800,display:'grid',placeItems:'center'}}>5</span>
        </button>
      </header>
      <div style={{fontFamily:THEMES[theme].font, fontStyle:'italic', fontSize:13, color:t.inkMute, padding:'0 2px 10px', borderBottom:`1px solid ${t.rule}`, marginBottom:14}}>
        {kicker}
      </div>

      <NextMatchCard
        theme={theme} scheme={scheme}
        home="Northbridge City" away="Hafenstadt"
        dateLine={`${m.date} · 15:30`}
        metaLine={`${m.comp} · ${m.venue} · ${m.tickets}`}
        aside={
          <div style={{display:'flex',gap:18, alignItems:'center'}}>
            <div>
              <div style={{fontSize:10, color:t.inkMute, fontWeight:600}}>{getLocale() === 'de' ? 'Stärke' : 'Strength'}</div>
              <div style={{display:'flex',alignItems:'center',gap:6,marginTop:4}}>
                <span style={{fontFamily:'JetBrains Mono', fontSize:13, fontWeight:700, color:t.ink}}>7,6</span>
                <span style={{fontSize:10, color:t.inkSoft}}>vs</span>
                <span style={{fontFamily:'JetBrains Mono', fontSize:13, fontWeight:700, color:t.ink}}>7,4</span>
              </div>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:10, color:t.inkMute, fontWeight:600}}>{tr('squad.col.form')}</div>
              <div style={{marginTop:4}}><FormStrip form="SSNSU" theme={theme} scheme={scheme}/></div>
            </div>
          </div>
        }/>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:14}}>
        {[
          { i:<I.Pitch color={t.ink} size={20}/>,      k: tr('hub.tile.training'),   sub: getLocale()==='de' ? 'Mo–Sa · Defensive' : 'Mon–Sat · Defending', flag: getLocale()==='de' ? '2 Spieler angeschlagen' : '2 players knocked' },
          { i:<I.Users color={t.ink} size={20}/>,      k: tr('hub.tile.transfers'),  sub: getLocale()==='de' ? '3 Anfragen offen' : '3 enquiries open',     flag: getLocale()==='de' ? 'Brody umworben' : 'Brody wanted' },
          { i:<I.Megaphone color={t.ink} size={20}/>,  k: tr('board.title'),          sub: getLocale()==='de' ? 'Stabil · 7 von 10' : 'Stable · 7 of 10',  flag: getLocale()==='de' ? 'Druck wächst' : 'Pressure rising' },
          { i:<I.Wallet color={t.ink} size={20}/>,     k: tr('hub.tile.finance'),    sub: getLocale()==='de' ? '+ 632.000 € / Monat' : '+ €632k / month', flag: tr('finance.levy') + (getLocale()==='de' ? ' fällig' : ' due') },
        ].map((x,i)=>(
          <HubTile key={i} theme={theme} scheme={scheme}
            icon={x.i} label={x.k} sub={x.sub} flag={x.flag}/>
        ))}
      </div>

      <div style={{flex:1}}></div>

      <div style={{position:'absolute',left:0,right:0,bottom:0,padding:'12px 16px 22px',background:`linear-gradient(to top, ${t.bg} 70%, transparent)`}}>
        <AdvanceButton theme={theme} scheme={scheme}
          daysOffset={3}
          label={getLocale() === 'de' ? 'Weiter zum nächsten Termin' : 'Advance to next event'}/>
      </div>
    </div>
  );
}

// =================================================================
// 2. INBOX
// =================================================================
function ScreenInbox({theme, scheme}){
  const t = THEMES[theme][scheme];
  const tr = useT();
  const chips = [
    getLocale() === 'de' ? 'Alle' : 'All',
    tr('inbox.tone.board'), tr('inbox.tone.media'),
    tr('inbox.tone.sponsor'), tr('inbox.tone.scout'),
    tr('inbox.tone.fan'),
  ];
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <ScreenHeader theme={theme} scheme={scheme}
        kicker={getLocale() === 'de' ? '5 ungelesen' : '5 unread'} title={tr('inbox.title')}
        right={
          <button aria-label={tr('common.filter')} style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.Filter color={t.ink} size={16}/></button>
        }>
        <div style={{display:'flex',gap:6,marginTop:10, overflowX:'auto', paddingBottom:2}}>
          {chips.map((c,i)=>(
            <span key={c} style={{padding:'5px 10px', borderRadius:999, fontSize:11, fontWeight:600,
              background: i===0 ? t.ink : 'transparent', color: i===0?t.bg:t.inkMute,
              border:`1px solid ${i===0 ? t.ink : t.rule}`, whiteSpace:'nowrap'}}>{c}</span>
          ))}
        </div>
        <div style={{borderBottom:`1px solid ${t.rule}`, marginTop:8, marginLeft:-16, marginRight:-16}}/>
      </ScreenHeader>

      <div style={{flex:1, overflowY:'auto', padding:'10px 12px 24px'}}>
        {INBOX.map((c,i)=>(
          <InboxCard key={i} theme={theme} scheme={scheme}
            tone={c.tone} from={c.from} title={c.title} body={c.body} time={c.time}/>
        ))}
      </div>
    </div>
  );
}

// =================================================================
// 3. SQUAD LIST
// =================================================================
function ScreenSquad({theme, scheme}){
  const t = THEMES[theme][scheme];
  const tr = useT();
  const isDe = getLocale() === 'de';
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <ScreenHeader theme={theme} scheme={scheme}
        kicker={tr('squad.title') + ' · 14 ' + (isDe ? 'Spieler' : 'players')} title={tr('squad.first_team')}
        right={
          <div style={{display:'flex', gap:6}}>
            <button aria-label={tr('common.search')} style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.Search color={t.ink} size={16}/></button>
            <button aria-label={tr('common.filter')} style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.Filter color={t.ink} size={16}/></button>
          </div>
        }>
        <div style={{display:'flex',gap:6,marginTop:10, overflowX:'auto'}}>
          {[
            {l: tr('squad.col.str'),      a:true},
            {l: tr('squad.col.age')},
            {l: tr('squad.col.contract')},
            {l: tr('squad.col.tal')},
            {l: tr('squad.col.pos')},
          ].map(c=>(
            <span key={c.l} style={{padding:'6px 11px', borderRadius:999, fontSize:11, fontWeight:600,
              background:c.a?t.ink:'transparent', color:c.a?t.bg:t.inkMute,
              border:`1px solid ${c.a?t.ink:t.rule}`, display:'inline-flex',alignItems:'center',gap:4}}>
              {c.l} {c.a && <I.ChevronDown size={12} color={t.bg}/>}
            </span>
          ))}
        </div>
      </ScreenHeader>

      <div style={{flex:1, overflowY:'auto', padding:'4px 12px 20px'}}>
        {SQUAD.slice(0,11).map((p,i)=><PlayerCard key={i} p={p} theme={theme} scheme={scheme}/>)}
        <div style={{fontSize:11, color:t.inkSoft, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', padding:'12px 4px 6px'}}>{isDe ? 'Bank' : 'Bench'}</div>
        {SQUAD.slice(11).map((p,i)=><PlayerCard key={i} p={p} theme={theme} scheme={scheme}/>)}
      </div>
    </div>
  );
}

function PlayerCard({p, theme, scheme}){
  const t = THEMES[theme][scheme];
  const contractSoon = p.contract.startsWith('06/26');
  return (
    <div style={{
      background:t.card, border:`1px solid ${t.rule}`, borderRadius:12,
      padding:'10px 12px', display:'flex', alignItems:'center', gap:10, marginBottom:8
    }}>
      <div style={{
        width:36, height:36, borderRadius:8, flex:'0 0 36px',
        background:t.bgInk, color:t.ink, display:'grid', placeItems:'center',
        fontFamily:'JetBrains Mono', fontWeight:700, fontSize:13
      }}>{p.shirt}</div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{display:'flex', alignItems:'center', gap:6}}>
          <span style={{fontSize:14, fontWeight:700, color:t.ink, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{p.n}</span>
          <span style={{fontSize:10, color:t.inkSoft, fontFamily:'JetBrains Mono'}}>{p.nat}</span>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:8, marginTop:4, fontSize:11, color:t.inkMute}}>
          <PosPill pos={p.pos} theme={theme} scheme={scheme}/>
          <span style={{fontVariantNumeric:'tabular-nums'}}>{p.age} {getLocale() === 'de' ? 'J.' : 'yo'}</span>
          <span style={{fontVariantNumeric:'tabular-nums'}}>{getLocale() === 'de' ? 'Form' : 'Form'} {p.form}</span>
          <span style={{
            color: contractSoon ? t.danger : t.inkMute, fontWeight: contractSoon?700:400,
            fontVariantNumeric:'tabular-nums',
            display:'inline-flex',alignItems:'center',gap:3
          }}>
            {contractSoon && <span style={{width:4,height:4,borderRadius:99,background:t.danger}}/>}
            ▸ {p.contract}
          </span>
        </div>
      </div>
      <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4}}>
        <StrBar n={p.str} theme={theme} scheme={scheme} w={56}/>
        <Talent n={p.tal} theme={theme} scheme={scheme}/>
      </div>
    </div>
  );
}

// =================================================================
// 4. PRE-MATCH
// =================================================================
function ScreenPreMatch({theme, scheme}){
  const t = THEMES[theme][scheme];
  const tr = useT();
  const isDe = getLocale() === 'de';
  const Side = ({s, crestProps, kit, align}) => (
    <div style={{display:'flex',flexDirection:'column',alignItems:align==='right'?'flex-end':'flex-start',gap:6,flex:1}}>
      <div style={{display:'flex', alignItems:'flex-end', gap:6, flexDirection:align==='right'?'row-reverse':'row'}}>
        <Crest {...crestProps} size={56}/>
        <Jersey pattern={kit.pattern} a={crestProps.a} b={crestProps.b}
                sleeveAccent={kit.sleeveAccent} crest={null} size={40}/>
      </div>
      <SerifH theme={theme} style={{fontSize:17, fontWeight:700, color:t.ink, lineHeight:1.05, textAlign:align==='right'?'right':'left'}}>{s.name}</SerifH>
      <div style={{fontSize:10, color:t.inkMute}}>{s.ranking}</div>
    </div>
  );
  // Row → use the extracted StatStrip composite from components.jsx.
  const Row = (props) => (
    <StatStrip theme={theme} scheme={scheme} {...props}/>
  );
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%', position:'relative'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{padding:'6px 16px 8px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.ChevronLeft color={t.ink} size={18}/></button>
          <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.5, textAlign:'center', textTransform:'uppercase'}}>{isDe ? 'Aurelia Premier · 32. Spieltag' : 'Aurelia Premier · Matchday 32'}<br/><span style={{fontWeight:400, textTransform:'none'}}>{isDe ? 'So 24. Mai · 15:30 · Northbridge Arena' : 'Sun 24 May · 15:30 · Northbridge Arena'}</span></div>
          <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.More color={t.ink} size={16}/></button>
        </div>
      </header>

      <div style={{padding:'10px 16px 0', display:'flex', alignItems:'center', gap:10}}>
        <Side s={OPP} crestProps={crestFor('Northbridge City')} kit={kitFor('Northbridge City')} align="left"/>
        <SerifH theme={theme} style={{fontSize:30, fontWeight:700, color:t.inkSoft, fontStyle:'italic'}}>vs.</SerifH>
        <Side s={OWN} crestProps={crestFor('FC Hafenstadt')} kit={kitFor('FC Hafenstadt')} align="right"/>
      </div>

      <div style={{margin:'14px 16px 0', background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'4px 14px'}}>
        <Row label={(isDe ? 'Stärke (Ø)' : 'Strength (avg)')} a={isDe ? '7,4' : '7.4'} b={isDe ? '7,6' : '7.6'} accentSide="b" hint={isDe ? 'leichter Vorteil Hafenstadt' : 'slight edge to Hafenstadt'}/>
        <Row label={tr('squad.col.form')} mono={false}
          a={<FormStrip form="SUNSU" theme={theme} scheme={scheme}/>}
          b={<FormStrip form="SSNSU" theme={theme} scheme={scheme}/>}/>
        <Row label={isDe ? 'Tabelle' : 'Table'} a={isDe ? '4.' : '4th'} b={isDe ? '2.' : '2nd'} accentSide="b"/>
      </div>

      <div style={{padding:'12px 16px 0'}}>
        <div style={{fontSize:10, color:t.inkMute, letterSpacing:.8, fontWeight:700, textTransform:'uppercase'}}>{isDe ? 'Schlüsselspieler' : 'Key players'}</div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:6}}>
          {OPP.key.map((k,i)=>(
            <div key={i} style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:10, padding:'8px 10px'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span style={{fontSize:12, fontWeight:700, color:t.ink}}>{k.n}</span>
                <PosPill pos={k.pos} theme={theme} scheme={scheme}/>
              </div>
              <div style={{fontSize:10, color:t.inkMute, marginTop:2}}>{OPP.short} · {k.tag}</div>
            </div>
          ))}
          {OWN.key.slice(0,1).map((k,i)=>(
            <div key={i} style={{background:t.accentSoft, border:`1px solid ${t.accent}`, borderRadius:10, padding:'8px 10px'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span style={{fontSize:12, fontWeight:800, color:t.accent}}>{k.n}</span>
                <PosPill pos={k.pos} theme={theme} scheme={scheme}/>
              </div>
              <div style={{fontSize:10, color:t.accent, marginTop:2, fontWeight:700}}>{OWN.short} · {isDe ? 'in Form' : 'in form'} · {k.tag}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:'12px 16px 0'}}>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'10px 12px'}}>
          <div style={{fontSize:10, color:t.inkMute, letterSpacing:.6, fontWeight:700, textTransform:'uppercase'}}>{isDe ? 'Direktvergleich (letzte 5)' : 'Head-to-head (last 5)'}</div>
          <div style={{display:'flex', alignItems:'center', gap:8, marginTop:6, fontFamily:'JetBrains Mono', fontSize:13, fontWeight:700}}>
            <span style={{color:t.inkMute}}>{OPP.short}</span>
            <div style={{display:'flex', gap:3, flex:1}}>
              {[{c:'N',l:'2:1'},{c:'U',l:'1:1'},{c:'S',l:'0:2'},{c:'S',l:'1:3'},{c:'N',l:'2:0'}].map((x,i)=>{
                const col = x.c==='S' ? t.ok : x.c==='N' ? t.danger : t.warn;
                return <div key={i} title={x.l} style={{flex:1, height:24, borderRadius:5, background:col, color:'#fff', display:'grid', placeItems:'center', fontSize:9}}>{x.c}</div>;
              })}
            </div>
            <span style={{color:t.ink}}>{OWN.short}</span>
          </div>
          <div style={{fontSize:11, color:t.inkMute, marginTop:6, fontFamily:THEMES[theme].font, fontStyle:'italic'}}>{isDe ? '„Hafenstadt hat in Northbridge zuletzt 2018 verloren.“' : '“Hafenstadt last lost at Northbridge back in 2018.”'}</div>
        </div>
      </div>

      <div style={{flex:1}}/>
      <div style={{padding:'12px 16px 22px'}}>
        <button style={{
          width:'100%', height:56, borderRadius:16, border:'none',
          background:t.accent, color:'#fff', fontWeight:800, fontSize:18,
          display:'flex', alignItems:'center', justifyContent:'center', gap:10,
          fontFamily:'inherit',
          boxShadow:`0 8px 22px -6px ${t.accent}90`
        }}>
          <I.Whistle size={22} color="#fff" sw={2.2}/> {tr('match.kickoff')}
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenHub, ScreenInbox, ScreenSquad, ScreenPreMatch, PlayerCard, SerifH });
