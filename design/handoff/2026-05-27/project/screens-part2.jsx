// screens-part2.jsx — Match feed, Halftime sheet, Finance, Stadium, Onboarding, Saves

// =================================================================
// 5. MATCH FEED (text-feed tier)
// =================================================================
function ScreenMatchFeed({theme, scheme}){
  const t = THEMES[theme][scheme];
  const kindMeta = {
    goal:    { color:t.accent,  letter:'⚽', strong:true },
    chance:  { color:t.warn,    letter:'⟶', strong:false },
    card:    { color:t.warn,    letter:'▮', strong:false },
    sub:     { color:t.inkMute, letter:'⇅', strong:false },
    set:     { color:t.inkMute, letter:'⌖', strong:false },
    whistle: { color:t.inkSoft, letter:'❘',  strong:false },
  };
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      {/* Pinned score header */}
      <header style={{background:t.card, borderBottom:`1px solid ${t.rule}`, padding:'8px 14px 10px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <button style={{width:36,height:36,borderRadius:10,background:t.bgInk,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.ChevronLeft color={t.ink} size={18}/></button>
          <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.4, textAlign:'center', textTransform:'uppercase'}}>Aurelia Premier · 32. ST.</div>
          <button style={{width:36,height:36,borderRadius:10,background:t.bgInk,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.Settings color={t.ink} size={16}/></button>
        </div>
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:14, marginTop:6}}>
          <div style={{display:'flex', alignItems:'center', gap:8}}>
            <Crest {...crestFor('Northbridge City')} size={28}/>
            <SerifH theme={theme} style={{fontSize:14, fontWeight:700, color:t.ink}}>Northbridge</SerifH>
          </div>
          <SerifH theme={theme} style={{fontSize:42, fontWeight:800, color:t.ink, letterSpacing:-1, fontFamily:THEMES[theme].font, lineHeight:1}}>1<span style={{color:t.inkSoft}}>:</span><span style={{color:t.accent}}>2</span></SerifH>
          <div style={{display:'flex', alignItems:'center', gap:8}}>
            <SerifH theme={theme} style={{fontSize:14, fontWeight:700, color:t.ink}}>Hafenstadt</SerifH>
            <Crest {...crestFor('FC Hafenstadt')} size={28}/>
          </div>
        </div>
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginTop:6}}>
          <span style={{fontFamily:'JetBrains Mono', fontSize:11, fontWeight:700, color:t.accent}}>● LIVE · 90+3</span>
          <span style={{fontSize:11, color:t.inkMute}}>27.412 Zuschauer</span>
        </div>
        {/* xG live strip — T2.3 */}
        <LiveXgStrip theme={theme} scheme={scheme} a={1.1} b={1.8}
          aLabel="NBC" bLabel="FCH"
          points={[
            { min:1,  a:0,   b:0   },
            { min:12, a:0,   b:0.2 },
            { min:18, a:0.2, b:0.4 },
            { min:24, a:0.3, b:0.5 },
            { min:34, a:0.4, b:0.9 }, // FCH 1:0
            { min:40, a:0.5, b:1.0 },
            { min:46, a:0.5, b:1.0 },
            { min:55, a:0.7, b:1.0 },
            { min:58, a:1.0, b:1.0 }, // NBC 1:1
            { min:65, a:1.0, b:1.2 },
            { min:71, a:1.0, b:1.4 },
            { min:78, a:1.0, b:1.5 },
            { min:82, a:1.0, b:1.7 }, // FCH 2:1
            { min:90, a:1.1, b:1.8 },
          ]}/>
        {/* Segmented tabs: text / ticker */}
        <div style={{display:'flex', marginTop:8, background:t.bgInk, borderRadius:10, padding:3}}>
          {[{l:'Reportage',a:true},{l:'2D-Ticker'},{l:'Aufstellung'}].map(c=>(
            <span key={c.l} style={{flex:1, textAlign:'center', padding:'7px 0', borderRadius:8, fontSize:11, fontWeight:700,
              background:c.a?t.card:'transparent', color:c.a?t.ink:t.inkMute,
              boxShadow:c.a?`0 1px 0 ${t.rule}`:'none'}}>{c.l}</span>
          ))}
        </div>
      </header>

      {/* Event feed */}
      <div style={{flex:1, overflowY:'auto', padding:'8px 14px 90px'}}>
        {FEED.map((e,i)=>{
          const k = kindMeta[e.kind] || kindMeta.set;
          return (
            <div key={i} style={{display:'flex', gap:10, padding:'10px 0', borderBottom:`1px solid ${t.rule}`}}>
              <div style={{flex:'0 0 44px', textAlign:'right'}}>
                <div style={{fontFamily:'JetBrains Mono', fontSize:13, fontWeight:700, color:t.inkMute, fontVariantNumeric:'tabular-nums'}}>{e.min}</div>
                {e.score && <div style={{fontFamily:'JetBrains Mono', fontSize:10, fontWeight:700, color:t.accent, marginTop:2}}>{e.score}</div>}
              </div>
              <div style={{flex:'0 0 22px', display:'flex', flexDirection:'column', alignItems:'center', paddingTop:3}}>
                {e.kind==='set' ? <MiniPitch size={20} color={t.inkMute}/>
                  : <span style={{display:'inline-block', width:22, height:22, borderRadius:6, background:k.color+'22', color:k.color, fontWeight:800, fontSize:11, textAlign:'center', lineHeight:'22px'}}>{k.letter}</span>}
              </div>
              <div style={{flex:1}}>
                <SerifH theme={theme} style={{display:'block', fontSize: e.kind==='goal'?17:14, fontWeight: e.kind==='goal'?800:700, color:e.kind==='goal'?t.accent:t.ink, lineHeight:1.15}}>{e.t}</SerifH>
                <div style={{fontSize:12, color:t.inkMute, marginTop:1, fontFamily:THEMES[theme].font, fontStyle: e.kind==='goal'?'normal':'italic'}}>{e.s}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer speed control */}
      <div style={{position:'absolute',left:0,right:0,bottom:0,padding:'10px 14px 22px',background:`linear-gradient(to top, ${t.bg}, ${t.bg}f0 60%, transparent)`,display:'flex',gap:8}}>
        <button style={{flex:1, height:48, borderRadius:14, background:t.card, border:`1px solid ${t.rule}`, color:t.ink, fontWeight:700, fontFamily:'inherit', display:'flex',alignItems:'center',justifyContent:'center',gap:6, fontSize:13}}><I.Whistle size={16} color={t.ink}/> Pause</button>
        <button style={{flex:2, height:48, borderRadius:14, background:t.ink, border:'none', color:t.bg, fontWeight:800, fontFamily:'inherit', display:'flex',alignItems:'center',justifyContent:'center',gap:6, fontSize:14}}>Tempo &nbsp;❯❯ &nbsp; <span style={{opacity:.6, fontWeight:600, fontSize:11}}>(2×)</span></button>
      </div>
    </div>
  );
}

// =================================================================
// 6. HALFTIME SHEET (bottom sheet)
// =================================================================
function ScreenHalftime({theme, scheme}){
  const t = THEMES[theme][scheme];
  // Show the underlying match feed dimmed, then sheet over it
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%', position:'relative', background:t.bg}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      {/* Dim backdrop with match summary */}
      <div style={{padding:'16px', opacity:.45, filter:'blur(.3px)'}}>
        <SerifH theme={theme} style={{fontSize:12, fontWeight:700, color:t.inkMute, textTransform:'uppercase', letterSpacing:.6}}>Halbzeit · 45'</SerifH>
        <SerifH theme={theme} style={{display:'block', fontSize:30, fontWeight:800, color:t.ink}}>Northbridge 0:1 Hafenstadt</SerifH>
        <div style={{fontSize:12, color:t.inkMute, marginTop:4}}>Verdiente Führung dank Wieser (34'). Brody hängt durch.</div>
      </div>
      <div style={{position:'absolute', inset:0, background:`${t.ink}50`, backdropFilter:'blur(2px)'}}/>

      {/* Sheet */}
      <div style={{
        position:'absolute', left:0, right:0, bottom:0, top:120,
        background:t.card, borderTopLeftRadius:24, borderTopRightRadius:24,
        boxShadow:`0 -10px 30px -10px ${t.ink}40`,
        padding:'10px 16px 22px',
        display:'flex', flexDirection:'column'
      }}>
        <div style={{width:42, height:4, borderRadius:99, background:t.rule, margin:'4px auto 8px'}}/>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
          <div>
            <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>Kabinenansprache</div>
            <SerifH theme={theme} style={{display:'block', fontSize:22, fontWeight:700, color:t.ink, lineHeight:1.1}}>Was passen wir an?</SerifH>
          </div>
          <span style={{fontSize:11, color:t.accent, fontWeight:700}}>3 Min. Pause</span>
        </div>

        {/* Formation */}
        <div style={{marginTop:14}}>
          <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.5, textTransform:'uppercase', marginBottom:6}}>Formation</div>
          <div style={{display:'flex', gap:6, overflowX:'auto', padding:'2px 0 4px'}}>
            {['4-3-3','4-4-2','4-2-3-1','3-5-2','5-3-2'].map((f,i)=>(
              <div key={f} style={{
                flex:'0 0 auto', minWidth:64, padding:'8px 10px',
                borderRadius:10, fontSize:12, fontWeight:700,
                border:`1px solid ${i===0?t.ink:t.rule}`,
                background:i===0?t.ink:t.bg, color:i===0?t.bg:t.ink,
                fontFamily:'JetBrains Mono', textAlign:'center'
              }}>{f}{i===0 && <div style={{fontSize:9, fontWeight:600, opacity:.7, marginTop:1, fontFamily:'Inter'}}>aktuell</div>}</div>
            ))}
          </div>
          <div style={{marginTop:10, display:'flex', justifyContent:'center'}}>
            <div style={{width:200}}>
              <FormationPitch theme={theme} scheme={scheme} formation="4-3-3"/>
            </div>
          </div>
        </div>

        {/* Mentality */}
        <div style={{marginTop:8}}>
          <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.5, textTransform:'uppercase', marginBottom:6}}>Mentalität</div>
          <div style={{display:'flex', gap:6}}>
            {[{l:'Sichern'},{l:'Ausgeglichen', a:true},{l:'Drücken'}].map((m,i)=>(
              <button key={i} style={{
                flex:1, height:44, borderRadius:12, border:`1px solid ${m.a?t.ink:t.rule}`,
                background:m.a?t.ink:t.bg, color:m.a?t.bg:t.ink, fontWeight:700, fontSize:13, fontFamily:'inherit'
              }}>{m.l}</button>
            ))}
          </div>
        </div>

        {/* Suggested sub */}
        <div style={{marginTop:10, padding:'10px 12px', background:t.bgInk, borderRadius:12, border:`1px dashed ${t.rule}`}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.5, textTransform:'uppercase'}}>Vorgeschlagener Wechsel</div>
            <span style={{fontSize:10, color:t.accent, fontWeight:700}}>Co-Trainer empfiehlt</span>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:8, marginTop:6, fontSize:13}}>
            <span style={{fontWeight:700, color:t.ink}}>Holtmann</span>
            <I.ArrowRight size={16} color={t.inkSoft}/>
            <span style={{fontWeight:700, color:t.accent}}>Velten</span>
            <span style={{flex:1}}/>
            <span style={{fontSize:11, color:t.inkMute}}>frischer · +0,4 Form</span>
          </div>
        </div>

        <div style={{flex:1}}/>

        {/* Bottom buttons */}
        <button style={{width:'100%', height:32, marginTop:10, marginBottom:8, background:'transparent', border:'none', color:t.inkMute, fontWeight:600, fontSize:12, fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:4}}>Mehr Taktik <I.ChevronDown size={14} color={t.inkMute}/></button>
        <div style={{display:'flex', gap:8}}>
          <button style={{flex:1, height:52, borderRadius:14, background:t.bg, border:`1px solid ${t.rule}`, color:t.ink, fontWeight:700, fontSize:14, fontFamily:'inherit'}}>Wie bisher</button>
          <button style={{flex:2, height:52, borderRadius:14, background:t.accent, color:'#fff', border:'none', fontWeight:800, fontSize:15, fontFamily:'inherit', boxShadow:`0 6px 14px -4px ${t.accent}80`}}>Übernehmen & weiter</button>
        </div>
      </div>
    </div>
  );
}

// =================================================================
// 7. FINANCE
// =================================================================
function ScreenFinance({theme, scheme}){
  const t = THEMES[theme][scheme];
  const f = FIN;
  const Bar = ({pos=true, w, label, value, color}) => (
    <div style={{display:'flex', alignItems:'center', gap:8, padding:'7px 0', borderBottom:`1px solid ${t.rule}`}}>
      <span style={{flex:1, fontSize:12.5, color:t.ink, fontWeight:500}}>{label}</span>
      <div style={{width:96, height:6, background:t.bgInk, borderRadius:99, overflow:'hidden'}}>
        <div style={{width:w+'%', height:'100%', background:color}}/>
      </div>
      <span style={{minWidth:90, textAlign:'right', fontFamily:'JetBrains Mono', fontSize:12, fontWeight:700, color:pos?t.ok:t.danger, fontVariantNumeric:'tabular-nums'}}>{pos?'+':'–'} {eur(Math.abs(value)).replace(' €',' €')}</span>
    </div>
  );
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{padding:'4px 16px 10px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
          <div>
            <div style={{fontSize:11,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>Mai 2026</div>
            <SerifH theme={theme} style={{display:'block', fontSize:26, fontWeight:700, color:t.ink, lineHeight:1}}>Finanzen</SerifH>
          </div>
          <LevyChip theme={theme} scheme={scheme}/>
        </div>
      </header>

      <div style={{padding:'0 16px 12px'}}>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'12px 14px'}}>
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <div>
              <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>Kontostand</div>
              <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:800, color:t.ink, fontFamily:'JetBrains Mono', fontVariantNumeric:'tabular-nums', marginTop:2}}>{eur(f.cash)}</SerifH>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>Monatssaldo</div>
              <div style={{display:'inline-flex', alignItems:'center', gap:4, fontSize:18, fontWeight:800, color:t.ok, fontFamily:'JetBrains Mono', marginTop:2}}><I.TrendUp size={16} color={t.ok}/>+ 632.000 €</div>
            </div>
          </div>
          <div style={{display:'flex', gap:6, marginTop:10}}>
            {[{l:'Betrieb', a:true},{l:'Investition'},{l:'Verlauf'}].map(c=>(
              <span key={c.l} style={{padding:'6px 10px', borderRadius:8, fontSize:11, fontWeight:700,
                background:c.a?t.bgInk:'transparent', color:c.a?t.ink:t.inkMute,
                border:`1px solid ${c.a?t.rule:'transparent'}`}}>{c.l}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{flex:1, overflowY:'auto', padding:'0 16px 20px'}}>
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'6px 2px'}}>Einnahmen</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'2px 14px'}}>
          {f.ops.map((x,i)=>(
            <Bar key={i} pos={true} w={Math.round(x.v/f.monthlyRev*100)} label={x.k} value={x.v} color={t.ok}/>
          ))}
        </div>

        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'14px 2px 6px'}}>Ausgaben</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'2px 14px'}}>
          {f.expenses.map((x,i)=>(
            <Bar key={i} pos={false} w={Math.round(Math.abs(x.v)/f.monthlyExp*100)} label={x.k} value={x.v} color={t.danger}/>
          ))}
        </div>

        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'14px 2px 6px'}}>Investitionsbudget</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'12px 14px'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', fontFamily:'JetBrains Mono'}}>
            <span style={{fontSize:12, fontWeight:700, color:t.ink}}>{eur(f.investSpent)} <span style={{color:t.inkSoft, fontWeight:500}}>/ {eur(f.investBudget)}</span></span>
            <span style={{fontSize:11, color:t.inkMute}}>27 %</span>
          </div>
          <div style={{height:8, background:t.bgInk, borderRadius:99, marginTop:8, overflow:'hidden'}}>
            <div style={{width:'27%', height:'100%', background:t.ink}}/>
          </div>
        </div>

        {/* Levers */}
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'14px 2px 6px'}}>Hebel</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'14px'}}>
          <Slider theme={theme} scheme={scheme} label="Ticketpreis · Stehplatz" value={62} unit="%" tooltip="14 € / Karte" leftL="-30%" rightL="+30%"/>
          <Slider theme={theme} scheme={scheme} label="Trikotsponsoring" value={48} unit="%" tooltip="1,8 Mio. € / Saison" leftL="bescheiden" rightL="aggressiv"/>
          <Slider theme={theme} scheme={scheme} label="Nachwuchs-Etat" value={71} unit="%" tooltip="180.000 € / Monat" leftL="kühl" rightL="großzügig" last/>
        </div>
      </div>
    </div>
  );
}

function Slider({theme, scheme, label, value=50, unit='', tooltip, leftL, rightL, last}){
  const t = THEMES[theme][scheme];
  return (
    <div style={{padding:'6px 0', borderBottom: last?'none':`1px solid ${t.rule}`, marginBottom: last?0:4}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
        <span style={{fontSize:12.5, fontWeight:700, color:t.ink}}>{label}</span>
        <span style={{fontSize:11, color:t.inkMute, fontFamily:'JetBrains Mono'}}>{tooltip}</span>
      </div>
      <div style={{position:'relative', height:30, marginTop:6}}>
        <div style={{position:'absolute', top:13, left:0, right:0, height:4, background:t.bgInk, borderRadius:99}}/>
        <div style={{position:'absolute', top:13, left:0, width:value+'%', height:4, background:t.accent, borderRadius:99}}/>
        <div style={{position:'absolute', top:6, left:`calc(${value}% - 9px)`, width:18, height:18, borderRadius:99, background:t.card, border:`2px solid ${t.accent}`, boxShadow:`0 1px 3px ${t.ink}30`}}/>
      </div>
      <div style={{display:'flex', justifyContent:'space-between', fontSize:10, color:t.inkSoft, marginTop:2}}>
        <span>{leftL}</span><span>{rightL}</span>
      </div>
    </div>
  );
}

// =================================================================
// 8. STADIUM
// =================================================================
function ScreenStadium({theme, scheme}){
  const t = THEMES[theme][scheme];
  const [tab, setTab] = React.useState('anlage');
  const SectionLabel = ({k, c}) => (
    <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', padding:'12px 4px 6px'}}>
      <span style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>{k}</span>
      {c && <span style={{fontSize:10, color:t.inkSoft}}>{c}</span>}
    </div>
  );
  const Row = ({glyph, name, status, detail, roi, cost, soft, danger, action='ausbauen'}) => (
    <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'10px 12px', display:'flex', gap:10, alignItems:'center', marginBottom:8}}>
      <div style={{width:38, height:38, flex:'0 0 38px', borderRadius:9, background:soft?t.bgInk:t.accentSoft, color:soft?t.inkMute:t.accent, display:'grid', placeItems:'center'}}>{glyph}</div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:8}}>
          <SerifH theme={theme} style={{fontSize:14.5, fontWeight:700, color:t.ink, lineHeight:1.1}}>{name}</SerifH>
          <span style={{fontSize:10.5, color: soft?t.inkSoft : (danger?t.danger:t.ok), fontWeight:700, whiteSpace:'nowrap'}}>{status}</span>
        </div>
        {detail && <div style={{fontSize:11, color:t.inkMute, marginTop:2, lineHeight:1.3}}>{detail}</div>}
        <div style={{display:'flex', gap:10, marginTop:5, alignItems:'baseline', flexWrap:'wrap'}}>
          {roi && <span style={{fontSize:10.5, color:t.ok, fontWeight:700, fontFamily:'JetBrains Mono'}}>{roi}</span>}
          {cost && <span style={{fontSize:10.5, color:t.inkSoft, fontFamily:'JetBrains Mono'}}>· Kosten {cost}</span>}
        </div>
      </div>
      <button aria-label={action} style={{
        width:34, height:34, borderRadius:9, border:`1px solid ${t.rule}`,
        background: soft ? t.ink : t.bg, color: soft ? t.bg : t.ink,
        display:'grid', placeItems:'center', flex:'0 0 34px'
      }}>{soft ? <I.Plus size={15} color={t.bg}/> : <I.ChevronRight size={15} color={t.ink}/>}</button>
    </div>
  );

  // Stand card with side-view + capacity bar
  const StandCard = ({s}) => {
    const roofIcon = s.roof === 'full' ? <GlyphRoof size={14} color={t.ok}/>
                   : s.roof === 'partial' ? <GlyphRoofPartial size={14} color={t.warn}/>
                   : <GlyphRoofOpen size={14} color={t.danger}/>;
    const roofLabel = { full:'Dach komplett', partial:'Dach teilweise', open:'Ohne Dach' }[s.roof];
    return (
      <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'12px 14px', marginBottom:10}}>
        <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8}}>
          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <div style={{width:30, height:30, borderRadius:8, background:t.ink, color:t.bg, display:'grid', placeItems:'center', fontWeight:800, fontFamily:'Inter', fontSize:13}}>{s.id}</div>
            <div>
              <SerifH theme={theme} style={{fontSize:15, fontWeight:700, color:t.ink, lineHeight:1.05}}>{s.name}</SerifH>
              <div style={{fontSize:11, color:t.inkMute, marginTop:2, display:'flex', gap:6, alignItems:'center'}}>
                <span style={{fontFamily:'JetBrains Mono', fontWeight:700, color:t.ink}}>{new Intl.NumberFormat('de-DE').format(s.cap)}</span>
                <span>Plätze · {s.rows} Reihen · {s.blocks} Blöcke</span>
              </div>
            </div>
          </div>
          <span style={{display:'inline-flex', alignItems:'center', gap:5, padding:'4px 8px', borderRadius:99,
            background: s.roof==='full'?t.accentSoft : s.roof==='partial'?'#e8d28a55' : '#f6dcd522',
            color: s.roof==='full'?t.ok : s.roof==='partial'?t.warn : t.danger,
            fontSize:10, fontWeight:800, letterSpacing:.3, whiteSpace:'nowrap'
          }}>{roofIcon} {roofLabel}</span>
        </div>

        {/* Side view */}
        <div style={{marginTop:10, background:t.bg, border:`1px solid ${t.rule}`, borderRadius:10, padding:'4px 6px'}}>
          <StandSideView stand={s} theme={theme} scheme={scheme}/>
        </div>

        {/* Capacity bar */}
        <div style={{marginTop:10}}>
          <CapacityBar stand={s} theme={theme} scheme={scheme}/>
        </div>

        {/* Upgrade row */}
        <div style={{marginTop:10, display:'flex', alignItems:'center', gap:8, padding:'9px 10px', background:t.bgInk, borderRadius:10}}>
          <I.TrendUp size={14} color={t.accent}/>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:12, fontWeight:700, color:t.ink, lineHeight:1.2}}>{s.upgrade}</div>
            <div style={{fontSize:10.5, color:t.inkSoft, fontFamily:'JetBrains Mono'}}>{s.upgradeCost}</div>
          </div>
          <button style={{height:32, padding:'0 12px', borderRadius:8, background:t.ink, color:t.bg, border:'none', fontWeight:700, fontSize:11, fontFamily:'inherit'}}>Ausbauen</button>
        </div>
      </div>
    );
  };

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{padding:'4px 16px 8px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
          <div>
            <div style={{fontSize:10.5,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>{STADIUM_INFO.name} · {STADIUM_INFO.built}</div>
            <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:700, color:t.ink, lineHeight:1}}>Stadionausbau</SerifH>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>Kapazität</div>
            <SerifH theme={theme} style={{fontSize:18, fontWeight:800, color:t.ink, fontFamily:'JetBrains Mono'}}>27.412</SerifH>
          </div>
        </div>
      </header>

      {/* Section tabs */}
      <div style={{padding:'4px 12px 0'}}>
        <div style={{display:'flex', gap:4, padding:3, background:t.bgInk, borderRadius:10}}>
          {[
            {id:'anlage',   l:'Anlage'},
            {id:'tribuene', l:'Tribünen'},
            {id:'rasen',    l:'Rasen & Licht'},
            {id:'gastro',   l:'Gastro'},
            {id:'typen',    l:'Stadiontyp'},
          ].map(o=>(
            <button key={o.id} onClick={()=>setTab(o.id)} style={{
              flex:1, padding:'7px 0', borderRadius:7, border:'none',
              background: tab===o.id ? t.card : 'transparent',
              color: tab===o.id ? t.ink : t.inkMute,
              boxShadow: tab===o.id ? `0 1px 0 ${t.rule}` : 'none',
              fontFamily:'inherit', fontWeight:700, fontSize:10.5
            }}>{o.l}</button>
          ))}
        </div>
      </div>

      <div style={{flex:1, overflowY:'auto', padding:'10px 12px 20px'}}>

        {tab === 'anlage' && (<>
          {/* Plot */}
          <div style={{background:t.bg, border:`1px solid ${t.rule}`, borderRadius:14, padding:'6px 6px 4px'}}>
            <StadiumPlot theme={theme} scheme={scheme}/>
          </div>
          {/* Legend */}
          <div style={{display:'flex', gap:10, padding:'8px 4px 0', flexWrap:'wrap', fontSize:10, color:t.inkMute, fontWeight:600}}>
            <span style={{display:'inline-flex', alignItems:'center', gap:4}}><GlyphRoof size={12} color={t.ink}/> Tribüne · Dach</span>
            <span style={{display:'inline-flex', alignItems:'center', gap:4}}><GlyphRoofOpen size={12} color={t.inkMute}/> ohne Dach</span>
            <span style={{display:'inline-flex', alignItems:'center', gap:4}}><GlyphFloodlight size={12} color={t.warn}/> Flutlichtmast</span>
            <span style={{display:'inline-flex', alignItems:'center', gap:4}}><GlyphHeating size={12} color={t.accent}/> Rasenheizung</span>
            <span style={{display:'inline-flex', alignItems:'center', gap:4}}><span style={{width:11, height:9, borderRadius:2, border:`1px dashed ${t.rule}`}}/> Slot frei</span>
          </div>

          <SectionLabel k="Anbauten" c="Budget · 8,5 Mio. €"/>
          <Row glyph={<I.Building size={18} color={t.accent}/>} name="Klubhotel"
            status="Stufe 2" detail="120 Zimmer · 78 % Auslastung"
            roi="+ 42.000 € / Monat" cost="1,8 Mio. €"/>
          <Row glyph={<I.Tag size={18} color={t.accent}/>} name="Fanshop"
            status="Stufe 3" detail="650 m² · zwei Stockwerke"
            roi="+ 28.500 € / Monat" cost="820.000 €"/>
          <Row glyph={<I.Pitch size={18} color={t.accent}/>} name="Nachwuchszentrum"
            status="Stufe 1" detail="4 Plätze · Internat geplant"
            roi="+ 1 Talent / Saison" cost="2,4 Mio. €"/>
          <Row glyph={<I.Users size={18} color={t.accent}/>} name="Klubhaus"
            status="Stufe 2" detail="Vereinsheim · Mitgliederlounge"
            roi="+ 8.400 € / Monat" cost="540.000 €"/>
          <Row glyph={<I.Coins size={18} color={t.inkMute}/>} name="Vereinsrestaurant"
            status="Slot frei" detail="Empfehlung des Vorstands"
            roi="≈ + 18.000 € / Monat" cost="640.000 €" soft action="bauen"/>
        </>)}

        {tab === 'tribuene' && (<>
          <SectionLabel k="Vier Tribünen · 27.412 Plätze gesamt"/>
          {/* Roof summary chip row */}
          <div style={{display:'flex', gap:6, marginBottom:8, padding:'8px 10px', background:t.bgInk, borderRadius:10, alignItems:'center'}}>
            <div style={{flex:1, fontSize:11, color:t.inkMute, fontWeight:700}}>Überdachung</div>
            {[
              {l:'N', s:'full'},{l:'S', s:'open'},{l:'O', s:'full'},{l:'W', s:'partial'},
            ].map(x=>{
              const c = x.s==='full'?t.ok : x.s==='partial'?t.warn : t.danger;
              const g = x.s==='full'?<GlyphRoof size={12} color={c}/> : x.s==='partial'?<GlyphRoofPartial size={12} color={c}/> : <GlyphRoofOpen size={12} color={c}/>;
              return (
                <span key={x.l} style={{display:'inline-flex', alignItems:'center', gap:3, padding:'3px 7px', borderRadius:99, background:'transparent', border:`1px solid ${c}40`, color:c, fontSize:10.5, fontWeight:800, fontFamily:'JetBrains Mono'}}>{g}{x.l}</span>
              );
            })}
          </div>
          {STANDS.map(s=> <StandCard key={s.id} s={s}/>)}
        </>)}

        {tab === 'rasen' && (<>
          <SectionLabel k="Rasen, Drainage & Beleuchtung"/>
          <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'10px 12px', marginBottom:10}}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
              <SerifH theme={theme} style={{fontSize:15, fontWeight:700, color:t.ink}}>Rasenheizung</SerifH>
              <span style={{fontSize:10.5, fontWeight:700, color:t.ok, display:'inline-flex', alignItems:'center', gap:4}}><GlyphHeating size={14} color={t.ok}/> Aktiv</span>
            </div>
            <div style={{fontSize:11, color:t.inkMute, marginTop:2}}>Frostschäden im Winter ausgeschlossen · ganzjährig betriebsbereit</div>
            {/* Visual heating coil */}
            <svg viewBox="0 0 280 30" style={{width:'100%', marginTop:8}}>
              <rect x="0" y="2" width="280" height="26" rx="4" fill={t.ok} opacity=".25"/>
              <path d="M6 16 Q14 6 22 16 T38 16 T54 16 T70 16 T86 16 T102 16 T118 16 T134 16 T150 16 T166 16 T182 16 T198 16 T214 16 T230 16 T246 16 T262 16 T278 16"
                fill="none" stroke={t.accent} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <Row glyph={<GlyphDrainGlyph/>} name="Drainage" status="Stufe 2 von 3" detail="+ 12 % Spielfähigkeit bei Starkregen" cost="420.000 €"/>
          <Row glyph={<GlyphFloodlight size={18} color={t.warn}/>} name="Flutlicht" status="1.800 Lux · UEFA-tauglich" detail="Stufe 3 von 4 · Upgrade auf 2.400 Lux möglich" cost="680.000 €"/>
          <Row glyph={<I.Megaphone size={18} color={t.accent}/>} name="Anzeigetafel" status="LED · 12×6 m" detail="Sponsorenflächen ausgebaut" soft action="verwalten"/>
        </>)}

        {tab === 'gastro' && (<>
          <SectionLabel k="Gastronomie · Spieltagserlös" c="Ø 27.000 € / Heimspiel"/>
          {GASTRO.map((g,i)=>{
            const open = g.status === 'Slot frei';
            const glyph = g.id==='beer' ? <BeerGlyph color={open?t.inkMute:t.accent}/>
                        : g.id==='wurst'? <WurstGlyph color={open?t.inkMute:t.accent}/>
                        : g.id==='vip'  ? <GlyphVIP size={18} color={open?t.inkMute:t.warn}/>
                        : <I.Coins size={18} color={open?t.inkMute:t.accent}/>;
            return (
              <Row key={i} glyph={glyph} name={g.name} status={g.status} detail={g.detail}
                roi={g.roi} cost={g.cost} soft={open} action={open?'planen':'verwalten'}/>
            );
          })}
        </>)}

        {tab === 'typen' && (<>
          <SectionLabel k="Stadiontypen · Ausbaupfad"/>
          <div style={{fontSize:11, color:t.inkMute, padding:'0 4px 8px', fontFamily:THEMES[theme].font, fontStyle:'italic', lineHeight:1.35}}>
            Vom Dorfplatz zur geschlossenen Arena. Aktueller Typ: <b style={{color:t.accent, fontStyle:'normal'}}>Standard</b> · 4 Tribünen.
          </div>
          {STADIUM_TYPES.map((tp,i)=>(
            <div key={tp.id} style={{
              background: tp.current ? t.accentSoft : t.card,
              border:`1px solid ${tp.current ? t.accent : t.rule}`,
              borderRadius:14, padding:'12px 14px', marginBottom:10,
              display:'flex', gap:12, alignItems:'flex-start'
            }}>
              <div style={{flex:'0 0 120px', background:t.bg, border:`1px solid ${t.rule}`, borderRadius:10, overflow:'hidden'}}>
                <StadiumTypePlan type={tp} theme={theme} scheme={scheme}/>
              </div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between'}}>
                  <SerifH theme={theme} style={{fontSize:15, fontWeight:700, color: tp.current ? t.accent : t.ink, lineHeight:1.1}}>{tp.name}</SerifH>
                  {tp.current && <span style={{fontSize:10, fontWeight:800, letterSpacing:.6, color:t.accent}}>AKTUELL</span>}
                </div>
                <div style={{fontSize:11, color:t.inkMute, marginTop:2, lineHeight:1.35}}>{tp.desc}</div>
                <div style={{display:'flex', gap:6, marginTop:6, flexWrap:'wrap'}}>
                  <span style={{display:'inline-flex', alignItems:'center', gap:3, padding:'2px 7px', borderRadius:99, background:t.bgInk, fontSize:10, fontWeight:700, color:t.ink}}>{tp.stands} Tribüne{tp.stands>1?'n':''}</span>
                  <span style={{display:'inline-flex', alignItems:'center', gap:3, padding:'2px 7px', borderRadius:99, background:t.bgInk, fontSize:10, fontWeight:700, fontFamily:'JetBrains Mono', color:t.ink}}>{tp.capRange}</span>
                  <span style={{display:'inline-flex', alignItems:'center', gap:3, padding:'2px 7px', borderRadius:99, background:t.bgInk, fontSize:10, fontWeight:700, color:t.inkMute}}>{tp.pitch}</span>
                </div>
              </div>
            </div>
          ))}
        </>)}
      </div>
    </div>
  );
}

// tiny inline glyphs (need theme color via parent; use local SVGs)
function GlyphDrainGlyph(){
  return (
    <svg width="18" height="18" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{color:'#b7301b'}}>
      <path d="M11 2 Q4 11 4 15 A7 7 0 0 0 18 15 Q18 11 11 2 Z" fill="currentColor" fillOpacity=".15"/>
    </svg>
  );
}
function BeerGlyph({color}){
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 6 L7 19 L15 19 L17 6 Z" fill={color} fillOpacity=".15"/>
      <path d="M5 6 L17 6"/>
      <path d="M17 9 Q21 9 21 12 Q21 15 17 15"/>
      <path d="M7 9 L7 16" opacity=".55"/>
      <path d="M11 9 L11 16" opacity=".55"/>
    </svg>
  );
}
function WurstGlyph({color}){
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="9" width="16" height="6" rx="3" fill={color} fillOpacity=".15"/>
      <path d="M5 12 L17 12" opacity=".7"/>
      <path d="M11 12 L13 7" opacity=".8"/>
      <path d="M9 12 L7 17" opacity=".8"/>
    </svg>
  );
}

// =================================================================
// 9. ONBOARDING (three screens)
// =================================================================
function ScreenOnboardingCountry({theme, scheme}){
  const t = THEMES[theme][scheme];
  const COUNTRIES = [
    {n:'Deutschland', flag:'🇩🇪', league:'Aurelia Premier', tier:'1. Liga · 18 Klubs', sel:true},
    {n:'Italien',     flag:'🇮🇹', league:'Liga Norvania',   tier:'1. Liga · 20 Klubs'},
    {n:'Frankreich',  flag:'🇫🇷', league:'Liga Norvania',   tier:'1. Liga · 20 Klubs'},
    {n:'Japan',       flag:'🇯🇵', league:'Liga Norvania',   tier:'1. Liga · 18 Klubs'},
    {n:'Portugal',    flag:'🇵🇹', league:'Liga Norvania',   tier:'1. Liga · 18 Klubs'},
  ];
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%', position:'relative'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{padding:'4px 16px 8px'}}>
        <div style={{display:'flex', gap:6, alignItems:'center'}}>
          <span style={{flex:1, height:4, borderRadius:99, background:t.ink}}/>
          <span style={{flex:1, height:4, borderRadius:99, background:t.rule}}/>
          <span style={{flex:1, height:4, borderRadius:99, background:t.rule}}/>
        </div>
        <div style={{fontSize:10, fontWeight:700, color:t.inkMute, letterSpacing:.6, marginTop:10, textTransform:'uppercase'}}>Schritt 1 von 3</div>
        <SerifH theme={theme} style={{display:'block', fontSize:28, fontWeight:700, color:t.ink, lineHeight:1.05, marginTop:2}}>Wo soll Ihr Fußball-<br/>kosmos beginnen?</SerifH>
        <div style={{fontSize:13, color:t.inkMute, marginTop:6, fontFamily:THEMES[theme].font, fontStyle:'italic'}}>Echtes Land, frei erfundene Liga. Funktioniert ohne Netz.</div>
      </header>
      <div style={{flex:1, overflowY:'auto', padding:'10px 16px 16px'}}>
        {COUNTRIES.map((c,i)=>(
          <div key={i} style={{
            background: c.sel ? t.ink : t.card, color:c.sel?t.bg:t.ink,
            border:`1px solid ${c.sel?t.ink:t.rule}`, borderRadius:14, padding:'12px 14px',
            marginBottom:8, display:'flex', alignItems:'center', gap:10
          }}>
            <div style={{width:38, height:38, borderRadius:10, background: c.sel?t.bgInk:t.bgInk, display:'grid', placeItems:'center', fontSize:22}}>{c.flag}</div>
            <div style={{flex:1}}>
              <SerifH theme={theme} style={{fontSize:16, fontWeight:700}}>{c.n}</SerifH>
              <div style={{fontSize:11, color:c.sel?t.bgInk:t.inkMute, marginTop:1}}>{c.league} · {c.tier}</div>
            </div>
            {c.sel && <I.Check size={18} color={t.bg}/>}
          </div>
        ))}
      </div>
      <div style={{position:'absolute', left:0, right:0, bottom:0, padding:'10px 16px 22px', background:t.bg}}>
        <button style={{width:'100%', height:54, borderRadius:14, background:t.accent, color:'#fff', border:'none', fontWeight:800, fontSize:15, fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:8}}>Weiter <I.ArrowRight size={18} color="#fff"/></button>
      </div>
    </div>
  );
}

function ScreenOnboardingClub({theme, scheme}){
  const t = THEMES[theme][scheme];
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%', position:'relative'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{padding:'4px 16px 8px'}}>
        <div style={{display:'flex', gap:6, alignItems:'center'}}>
          <span style={{flex:1, height:4, borderRadius:99, background:t.ink}}/>
          <span style={{flex:1, height:4, borderRadius:99, background:t.ink}}/>
          <span style={{flex:1, height:4, borderRadius:99, background:t.rule}}/>
        </div>
        <div style={{fontSize:10, fontWeight:700, color:t.inkMute, letterSpacing:.6, marginTop:10, textTransform:'uppercase'}}>Schritt 2 von 3</div>
        <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:700, color:t.ink, lineHeight:1.05, marginTop:2}}>Wer braucht Sie<br/>am dringendsten?</SerifH>
      </header>
      <div style={{flex:1, overflowY:'auto', padding:'8px 12px 16px'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
          {CLUBS_PROC.map((c,i)=>(
            <div key={i} style={{
              background: i===0 ? t.accentSoft : t.card,
              border:`1px solid ${i===0 ? t.accent : t.rule}`,
              borderRadius:14, padding:'10px 10px 12px',
              display:'flex', flexDirection:'column', alignItems:'flex-start', gap:4
            }}>
              <Crest shape={c.shape} a={c.a} b={c.b} charge={c.charge} size={42}/>
              <SerifH theme={theme} style={{fontSize:13, fontWeight:700, color:t.ink, lineHeight:1.1, marginTop:2}}>{c.n}</SerifH>
              <div style={{fontSize:10, color:i===0?t.accent:t.inkMute, fontWeight:700, letterSpacing:.4, textTransform:'uppercase'}}>{c.league}</div>
              <div style={{fontSize:10.5, color:t.inkMute, lineHeight:1.3, fontFamily:THEMES[theme].font, fontStyle:'italic'}}>{c.pitch}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{position:'absolute', left:0, right:0, bottom:0, padding:'10px 16px 22px', background:t.bg, display:'flex', gap:8}}>
        <button style={{flex:1, height:50, borderRadius:14, background:'transparent', color:t.ink, border:`1px solid ${t.rule}`, fontWeight:700, fontSize:14, fontFamily:'inherit'}}>Würfeln</button>
        <button style={{flex:2, height:50, borderRadius:14, background:t.accent, color:'#fff', border:'none', fontWeight:800, fontSize:15, fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:8}}>FC Hafenstadt nehmen <I.ArrowRight size={18} color="#fff"/></button>
      </div>
    </div>
  );
}

function ScreenOnboardingManager({theme, scheme}){
  const t = THEMES[theme][scheme];
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%', position:'relative'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{padding:'4px 16px 8px'}}>
        <div style={{display:'flex', gap:6, alignItems:'center'}}>
          {[1,2,3].map(i=><span key={i} style={{flex:1, height:4, borderRadius:99, background:t.ink}}/>)}
        </div>
        <div style={{fontSize:10, fontWeight:700, color:t.inkMute, letterSpacing:.6, marginTop:10, textTransform:'uppercase'}}>Schritt 3 von 3</div>
        <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:700, color:t.ink, lineHeight:1.05, marginTop:2}}>Und Sie sind…?</SerifH>
        <div style={{fontSize:12, color:t.inkMute, marginTop:4, fontFamily:THEMES[theme].font, fontStyle:'italic'}}>Ein Initial-Chip reicht für die erste Saison.</div>
      </header>

      <div style={{padding:'24px 16px 0', display:'flex', flexDirection:'column', alignItems:'center', gap:14}}>
        <div style={{width:120, height:120, borderRadius:'50%', background:t.accentSoft, color:t.accent, display:'grid', placeItems:'center', fontFamily:THEMES[theme].font, fontWeight:800, fontSize:54, border:`2px solid ${t.accent}`}}>JL</div>
        <div style={{display:'flex', gap:6}}>
          {[t.accent,'#0e3a5f','#3f6a2f','#a3680f','#7a3a8a','#262626'].map((c,i)=>(
            <button key={i} style={{width:32, height:32, borderRadius:99, background:c, border: i===0?`2.5px solid ${t.ink}`:'none', boxShadow: i===0?`0 0 0 2px ${t.bg}`:'none'}}/>
          ))}
        </div>
      </div>

      <div style={{padding:'18px 16px 0'}}>
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', marginBottom:6}}>Name</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'12px 14px', display:'flex', alignItems:'center', gap:8}}>
          <SerifH theme={theme} style={{fontSize:18, fontWeight:700, color:t.ink}}>Julia Lindquist</SerifH>
          <span style={{flex:1}}/>
          <button style={{fontSize:11, color:t.accent, fontWeight:700, background:'transparent', border:'none'}}>ändern</button>
        </div>
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'14px 0 6px'}}>Spitzname (optional)</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'12px 14px', color:t.inkSoft, fontFamily:THEMES[theme].font, fontStyle:'italic'}}>„Die Hand vom Hafen"</div>
      </div>

      <div style={{flex:1}}/>
      <div style={{position:'absolute', left:0, right:0, bottom:0, padding:'10px 16px 22px', background:t.bg}}>
        <button style={{width:'100%', height:56, borderRadius:14, background:t.ink, color:t.bg, border:'none', fontWeight:800, fontSize:16, fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:8}}>Karriere starten <I.ArrowRight size={20} color={t.bg}/></button>
      </div>
    </div>
  );
}

// =================================================================
// 10. SAVE MANAGEMENT
// =================================================================
function ScreenSaves({theme, scheme}){
  const t = THEMES[theme][scheme];
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{padding:'4px 16px 12px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
          <div>
            <div style={{fontSize:11,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>Karriereverwaltung</div>
            <SerifH theme={theme} style={{display:'block', fontSize:26, fontWeight:700, color:t.ink, lineHeight:1}}>Meine Karrieren</SerifH>
          </div>
          <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.Settings color={t.ink} size={16}/></button>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:6, marginTop:10, padding:'8px 10px', background:t.bgInk, borderRadius:10}}>
          <I.CloudOff size={14} color={t.inkMute}/>
          <span style={{fontSize:11, color:t.inkMute, fontWeight:600}}>Offline gespeichert · 77 MB von 250 MB belegt</span>
        </div>
      </header>

      <div style={{flex:1, overflowY:'auto', padding:'0 16px 16px'}}>
        {SAVE_SLOTS.map((s,i)=>{
          if (s.empty) return (
            <button key={i} style={{
              width:'100%', background:'transparent', border:`1.5px dashed ${t.rule}`, borderRadius:14,
              padding:'18px 14px', marginBottom:10, color:t.inkMute, fontFamily:'inherit',
              display:'flex', flexDirection:'column', alignItems:'center', gap:4
            }}>
              <I.Plus size={20} color={t.inkMute}/>
              <span style={{fontSize:14, fontWeight:700}}>Neue Karriere starten</span>
              <span style={{fontSize:11}}>Slot {s.i} · frei</span>
            </button>
          );
          return (
            <div key={i} style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'14px', marginBottom:10}}>
              <div style={{display:'flex', alignItems:'center', gap:10}}>
                <div style={{width:42, height:42, borderRadius:10, background:t.accentSoft, color:t.accent, display:'grid', placeItems:'center', fontFamily:THEMES[theme].font, fontWeight:800, fontSize:18}}>{s.mgr}</div>
                <div style={{flex:1, minWidth:0}}>
                  <SerifH theme={theme} style={{display:'block', fontSize:16, fontWeight:700, color:t.ink, lineHeight:1.1}}>{s.name}</SerifH>
                  <div style={{fontSize:11, color:t.inkMute, marginTop:2}}>{s.club} · Saison {s.season}</div>
                </div>
                <span style={{fontSize:10, color:t.inkSoft, whiteSpace:'nowrap'}}>{s.stamp}</span>
              </div>
              <div style={{marginTop:10}}>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:10, color:t.inkMute, marginBottom:3, fontFamily:'JetBrains Mono'}}>
                  <span>{s.size} MB</span>
                  <span>{Math.round(s.ratio*100)}% des Quotas</span>
                </div>
                <div style={{height:4, background:t.bgInk, borderRadius:99, overflow:'hidden'}}>
                  <div style={{width:(s.ratio*100)+'%', height:'100%', background:t.ink}}/>
                </div>
              </div>
              <div style={{display:'flex', gap:6, marginTop:12}}>
                <button style={{flex:1, height:42, borderRadius:10, background:t.ink, color:t.bg, border:'none', fontWeight:800, fontSize:13, fontFamily:'inherit'}}>Fortsetzen</button>
                <button aria-label="Exportieren" style={{width:42, height:42, borderRadius:10, background:t.bg, border:`1px solid ${t.rule}`, display:'grid', placeItems:'center'}}><I.Download size={16} color={t.ink}/></button>
                <button aria-label="Importieren" style={{width:42, height:42, borderRadius:10, background:t.bg, border:`1px solid ${t.rule}`, display:'grid', placeItems:'center'}}><I.Upload size={16} color={t.ink}/></button>
                <button aria-label="Löschen" style={{width:42, height:42, borderRadius:10, background:t.bg, border:`1px solid ${t.rule}`, display:'grid', placeItems:'center'}}><I.Trash size={16} color={t.danger}/></button>
              </div>
            </div>
          );
        })}

        {/* iOS install banner */}
        <div style={{background:t.accentSoft, border:`1px solid ${t.accent}`, borderRadius:14, padding:'12px 14px', marginTop:6, display:'flex', gap:10, alignItems:'flex-start'}}>
          <div style={{width:36, height:36, borderRadius:10, background:'#fff', border:`1px solid ${t.accent}`, display:'grid', placeItems:'center', flex:'0 0 36px'}}><I.AddHome size={20} color={t.accent}/></div>
          <div style={{flex:1}}>
            <SerifH theme={theme} style={{display:'block', fontSize:14, fontWeight:800, color:t.accent}}>Auf Startbildschirm hinzufügen</SerifH>
            <div style={{fontSize:11.5, color:t.ink, marginTop:2, lineHeight:1.35}}>So spielen Sie offline wie eine echte App. <span style={{color:t.inkMute}}>Im Safari-Menü tippen → <I.ShareIos size={11} color={t.inkMute}/> „Zum Home-Bildschirm".</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  ScreenMatchFeed, ScreenHalftime, ScreenFinance, ScreenStadium,
  ScreenOnboardingCountry, ScreenOnboardingClub, ScreenOnboardingManager,
  ScreenSaves, Slider
});
