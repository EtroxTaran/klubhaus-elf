// screens-part1.jsx — Hub, Inbox, Squad, PreMatch
const SerifH = ({children, theme, style}) => (
  <span style={{fontFamily:THEMES[theme].font, ...style}}>{children}</span>
);

// =================================================================
// 1. OFFICE HUB
// =================================================================
function ScreenHub({theme, scheme}){
  const t = THEMES[theme][scheme];
  const m = FIXTURES[0];
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',padding:'0 16px 92px', position:'relative'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'6px 0 8px'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <Crest {...crestFor('FC Hafenstadt')} size={34}/>
          <div>
            <div style={{fontSize:11, color:t.inkMute, letterSpacing:.4, fontWeight:600, textTransform:'uppercase'}}>FC Hafenstadt</div>
            <SerifH theme={theme} style={{fontSize:18, fontWeight:700, lineHeight:1.05, color:t.ink}}>Mo, 18. Mai · 09:41</SerifH>
          </div>
        </div>
        <button aria-label="Posteingang" style={{position:'relative',width:40,height:40,borderRadius:12,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center',color:t.ink}}>
          <I.Inbox size={18} color={t.ink}/>
          <span style={{position:'absolute',top:-4,right:-4,minWidth:18,height:18,padding:'0 5px',borderRadius:999,background:t.accent,color:'#fff',fontSize:10,fontWeight:800,display:'grid',placeItems:'center'}}>5</span>
        </button>
      </header>
      <div style={{fontFamily:THEMES[theme].font, fontStyle:'italic', fontSize:13, color:t.inkMute, padding:'0 2px 10px', borderBottom:`1px solid ${t.rule}`, marginBottom:14}}>
        „Heute klärt sich, ob der Vorstand Geduld kennt." — Auerbach-Zeitung
      </div>

      <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:16, padding:'14px 14px 12px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
          <span style={{fontSize:10, fontWeight:800, letterSpacing:1.2, color:t.accent}}>NÄCHSTER TERMIN</span>
          <span style={{fontSize:11, color:t.inkMute, fontVariantNumeric:'tabular-nums'}}>{m.date} · 15:30</span>
        </div>
        <SerifH theme={theme} style={{display:'block', fontSize:22, fontWeight:700, lineHeight:1.1, marginTop:6, color:t.ink}}>
          Northbridge City <span style={{color:t.inkSoft}}>vs.</span> Hafenstadt
        </SerifH>
        <div style={{fontSize:12, color:t.inkMute, marginTop:4}}>{m.comp} · {m.venue} · {m.tickets}</div>
        <div style={{display:'flex',gap:18, marginTop:12, alignItems:'center'}}>
          <div>
            <div style={{fontSize:10, color:t.inkMute, fontWeight:600}}>Stärke</div>
            <div style={{display:'flex',alignItems:'center',gap:6,marginTop:4}}>
              <span style={{fontFamily:'JetBrains Mono', fontSize:13, fontWeight:700, color:t.ink}}>7,6</span>
              <span style={{fontSize:10, color:t.inkSoft}}>vs</span>
              <span style={{fontFamily:'JetBrains Mono', fontSize:13, fontWeight:700, color:t.ink}}>7,4</span>
            </div>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:10, color:t.inkMute, fontWeight:600}}>Form</div>
            <div style={{marginTop:4}}><FormStrip form="SSNSU" theme={theme} scheme={scheme}/></div>
          </div>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:14}}>
        {[
          { i:<I.Pitch color={t.ink} size={20}/>, k:'Trainingsplan', sub:'Mo–Sa · Defensive', flag:'2 Spieler angeschlagen' },
          { i:<I.Users color={t.ink} size={20}/>, k:'Transferbüro', sub:'3 Anfragen offen', flag:'Brody umworben' },
          { i:<I.Megaphone color={t.ink} size={20}/>, k:'Vorstandsvertrauen', sub:'Stabil · 7 von 10', flag:'Druck wächst' },
          { i:<I.Wallet color={t.ink} size={20}/>, k:'Finanzen', sub:'+ 632.000 € / Monat', flag:'Verbandsabgabe fällig' },
        ].map((x,i)=>(
          <div key={i} style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:12, minHeight:96, display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <div style={{width:32,height:32,borderRadius:10,background:t.bgInk,display:'grid',placeItems:'center'}}>{x.i}</div>
              <I.ChevronRight size={14} color={t.inkSoft}/>
            </div>
            <div>
              <div style={{fontSize:13, fontWeight:700, color:t.ink, lineHeight:1.15}}>{x.k}</div>
              <div style={{fontSize:11, color:t.inkMute, marginTop:2}}>{x.sub}</div>
              <div style={{fontSize:10, color:t.accent, marginTop:4, fontWeight:600}}>· {x.flag}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{flex:1}}></div>

      <div style={{position:'absolute',left:0,right:0,bottom:0,padding:'12px 16px 22px',background:`linear-gradient(to top, ${t.bg} 70%, transparent)`}}>
        <button style={{
          width:'100%', height:56, borderRadius:16, border:'none',
          background:t.ink, color:t.bg, fontWeight:700, fontSize:16,
          display:'flex', alignItems:'center', justifyContent:'center', gap:10,
          fontFamily:'inherit', position:'relative',
          boxShadow:`0 8px 20px -8px ${t.ink}80`
        }}>
          <span style={{position:'absolute',left:14,top:7,fontSize:9,fontWeight:700,color:t.bgInk,letterSpacing:.8, opacity:.8}}>+3 TAGE</span>
          Weiter zum nächsten Termin
          <I.ArrowRight size={20} color={t.bg}/>
        </button>
      </div>
    </div>
  );
}

// =================================================================
// 2. INBOX
// =================================================================
function ScreenInbox({theme, scheme}){
  const t = THEMES[theme][scheme];
  const toneMap = {
    board:   { bg: t.accentSoft, fg: t.accent, label:'Vorstand', glyph:'§' },
    media:   { bg: t.bgInk,      fg: t.ink,    label:'Presse',   glyph:'¶' },
    sponsor: { bg: '#e8d28a55',  fg: t.warn,   label:'Sponsor',  glyph:'€' },
    scout:   { bg: '#cfe0d255',  fg: t.ok,     label:'Scouting', glyph:'◎' },
    fan:     { bg: t.bgInk,      fg: t.inkMute,label:'Fans',     glyph:'♪' },
  };
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <ScreenHeader theme={theme} scheme={scheme}
        kicker="5 ungelesen" title="Posteingang"
        right={
          <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.Filter color={t.ink} size={16}/></button>
        }>
        <div style={{display:'flex',gap:6,marginTop:10, overflowX:'auto', paddingBottom:2}}>
          {['Alle','Vorstand','Presse','Sponsor','Scouting','Fans'].map((c,i)=>(
            <span key={c} style={{padding:'5px 10px', borderRadius:999, fontSize:11, fontWeight:600,
              background: i===0 ? t.ink : 'transparent', color: i===0?t.bg:t.inkMute,
              border:`1px solid ${i===0 ? t.ink : t.rule}`, whiteSpace:'nowrap'}}>{c}</span>
          ))}
        </div>
        <div style={{borderBottom:`1px solid ${t.rule}`, marginTop:8, marginLeft:-16, marginRight:-16}}/>
      </ScreenHeader>

      <div style={{flex:1, overflowY:'auto', padding:'10px 12px 24px'}}>
        {INBOX.map((c,i)=>{
          const tn = toneMap[c.tone];
          return (
            <article key={i} style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:12, marginBottom:10}}>
              <div style={{display:'flex',gap:10,alignItems:'flex-start'}}>
                <div style={{width:36,height:36,borderRadius:10,background:tn.bg,color:tn.fg,display:'grid',placeItems:'center',fontWeight:800,fontSize:16,flex:'0 0 36px',fontFamily:THEMES[theme].font}}>{tn.glyph}</div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',gap:8}}>
                    <span style={{fontSize:11, fontWeight:700, color:tn.fg, letterSpacing:.3, textTransform:'uppercase'}}>{tn.label} · {c.from}</span>
                    <span style={{fontSize:10, color:t.inkSoft, whiteSpace:'nowrap'}}>{c.time}</span>
                  </div>
                  <SerifH theme={theme} style={{display:'block', fontSize:17, fontWeight:700, color:t.ink, lineHeight:1.2, marginTop:2}}>{c.title}</SerifH>
                  <div style={{fontSize:13, color:t.inkMute, marginTop:4, lineHeight:1.35}}>{c.body}</div>
                </div>
              </div>
              <div style={{display:'flex', gap:6, marginTop:10}}>
                <PillBtn theme={theme} scheme={scheme} intent="accept" icon={<I.Check size={14} color="#fff"/>}>Annehmen</PillBtn>
                <PillBtn theme={theme} scheme={scheme} intent="soft" icon={<I.Clock size={13} color={t.ink}/>}>Vertagen</PillBtn>
                <PillBtn theme={theme} scheme={scheme} intent="neutral" icon={<I.X size={13} color={t.ink}/>}>Ablehnen</PillBtn>
                <button aria-label="Mehr" style={{flex:'0 0 36px',height:36,width:36,borderRadius:999,border:`1px solid ${t.rule}`,background:'transparent',display:'grid',placeItems:'center'}}><I.More color={t.ink} size={16}/></button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

// =================================================================
// 3. SQUAD LIST
// =================================================================
function ScreenSquad({theme, scheme}){
  const t = THEMES[theme][scheme];
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <ScreenHeader theme={theme} scheme={scheme}
        kicker="Kader · 14 Spieler" title="Erste Mannschaft"
        right={
          <div style={{display:'flex', gap:6}}>
            <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.Search color={t.ink} size={16}/></button>
            <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.Filter color={t.ink} size={16}/></button>
          </div>
        }>
        <div style={{display:'flex',gap:6,marginTop:10, overflowX:'auto'}}>
          {[{l:'Stärke',a:true},{l:'Alter'},{l:'Vertrag'},{l:'Talent'},{l:'Position'}].map(c=>(
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
        <div style={{fontSize:11, color:t.inkSoft, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', padding:'12px 4px 6px'}}>Bank</div>
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
          <span style={{fontVariantNumeric:'tabular-nums'}}>{p.age} J.</span>
          <span style={{fontVariantNumeric:'tabular-nums'}}>Form {p.form}</span>
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
  const Row = ({label, a, b, hint, accentSide, mono=true}) => (
    <div style={{padding:'10px 0', borderBottom:`1px solid ${t.rule}`}}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:8}}>
        <div style={{fontFamily: mono?'JetBrains Mono':'inherit', fontSize:14, fontWeight:700, color:accentSide==='a'?t.accent:t.ink, minWidth:64}}>{a}</div>
        <div style={{fontSize:10, color:t.inkSoft, letterSpacing:.6, textTransform:'uppercase', fontWeight:700}}>{label}</div>
        <div style={{fontFamily: mono?'JetBrains Mono':'inherit', fontSize:14, fontWeight:700, color:accentSide==='b'?t.accent:t.ink, minWidth:64, display:'flex', justifyContent:'flex-end'}}>{b}</div>
      </div>
      {hint && <div style={{fontSize:10, color:t.inkSoft, textAlign:'center', marginTop:2, fontStyle:'italic', fontFamily:THEMES[theme].font}}>{hint}</div>}
    </div>
  );
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%', position:'relative'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{padding:'6px 16px 8px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.ChevronLeft color={t.ink} size={18}/></button>
          <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.5, textAlign:'center', textTransform:'uppercase'}}>Aurelia Premier · 32. Spieltag<br/><span style={{fontWeight:400, textTransform:'none'}}>So 24. Mai · 15:30 · Northbridge Arena</span></div>
          <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.More color={t.ink} size={16}/></button>
        </div>
      </header>

      <div style={{padding:'10px 16px 0', display:'flex', alignItems:'center', gap:10}}>
        <Side s={OPP} crestProps={crestFor('Northbridge City')} kit={kitFor('Northbridge City')} align="left"/>
        <SerifH theme={theme} style={{fontSize:30, fontWeight:700, color:t.inkSoft, fontStyle:'italic'}}>vs.</SerifH>
        <Side s={OWN} crestProps={crestFor('FC Hafenstadt')} kit={kitFor('FC Hafenstadt')} align="right"/>
      </div>

      <div style={{margin:'14px 16px 0', background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'4px 14px'}}>
        <Row label="Stärke (Ø)" a="7,4" b="7,6" accentSide="b" hint="leichter Vorteil Hafenstadt"/>
        <Row label="Form" mono={false}
          a={<FormStrip form="SUNSU" theme={theme} scheme={scheme}/>}
          b={<FormStrip form="SSNSU" theme={theme} scheme={scheme}/>}/>
        <Row label="Tabelle" a="4." b="2." accentSide="b"/>
      </div>

      <div style={{padding:'12px 16px 0'}}>
        <div style={{fontSize:10, color:t.inkMute, letterSpacing:.8, fontWeight:700, textTransform:'uppercase'}}>Schlüsselspieler</div>
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
              <div style={{fontSize:10, color:t.accent, marginTop:2, fontWeight:700}}>{OWN.short} · in Form · {k.tag}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:'12px 16px 0'}}>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'10px 12px'}}>
          <div style={{fontSize:10, color:t.inkMute, letterSpacing:.6, fontWeight:700, textTransform:'uppercase'}}>Direktvergleich (letzte 5)</div>
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
          <div style={{fontSize:11, color:t.inkMute, marginTop:6, fontFamily:THEMES[theme].font, fontStyle:'italic'}}>„Hafenstadt hat in Northbridge zuletzt 2018 verloren."</div>
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
          <I.Whistle size={22} color="#fff" sw={2.2}/> Anpfiff
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenHub, ScreenInbox, ScreenSquad, ScreenPreMatch, PlayerCard, SerifH });
