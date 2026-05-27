// a11y.jsx — visual A11y audit screen.
//   42  A11y-Audit · Kontrast-Übersicht + Touch-Map + Befund-Checkliste

function ScreenA11yAudit({theme='A', scheme='light'}){
  const t = THEMES[theme][scheme];
  // sample contrast pairs (computed offline, see ACCESSIBILITY.md)
  const PAIRS = [
    { fg:'#1a1410', bg:'#f4ede0', name:'ink · paper',     ratio:14.5, grade:'AAA' },
    { fg:'#5a4f44', bg:'#f4ede0', name:'inkMute · paper', ratio:7.1,  grade:'AAA' },
    { fg:'#7a6f63', bg:'#f4ede0', name:'inkSoft · paper', ratio:4.5,  grade:'AA',  note:'≥14pt' },
    { fg:'#b7301b', bg:'#f4ede0', name:'accent · paper',  ratio:5.3,  grade:'AA' },
    { fg:'#ffffff', bg:'#b7301b', name:'weiß · accent',   ratio:5.8,  grade:'AA' },
    { fg:'#3f6a2f', bg:'#f4ede0', name:'ok · paper',      ratio:5.2,  grade:'AA' },
    { fg:'#a3680f', bg:'#f4ede0', name:'warn · paper',    ratio:4.7,  grade:'AA' },
    { fg:'#9b1f0a', bg:'#f4ede0', name:'danger · paper',  ratio:6.4,  grade:'AA' },
  ];
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{padding:'4px 16px 8px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
          <div>
            <div style={{fontSize:10.5,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>Audit · WCAG 2.2 AA</div>
            <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:700, color:t.ink, lineHeight:1}}>Barrierefreiheit</SerifH>
          </div>
          <span style={{fontSize:11, color:t.ok, fontWeight:800, padding:'4px 10px', borderRadius:99, background:t.ok+'1f', letterSpacing:.4}}>✓ AA bestanden</span>
        </div>
      </header>

      <div style={{flex:1, overflowY:'auto', padding:'8px 16px 20px'}}>
        {/* Score card */}
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'12px 14px', marginBottom:10, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10}}>
          {[
            {k:'Kontrast', v:'8/8', sub:'Paare AA+'},
            {k:'Tap-Target', v:'24/25', sub:'≥ 44×44 px'},
            {k:'Glyph+Farbe', v:'9/9', sub:'doppelt codiert'},
          ].map((s,i)=>(
            <div key={i} style={{textAlign:'left', borderRight: i<2?`1px solid ${t.rule}`:'none', paddingRight: i<2?6:0}}>
              <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.4, textTransform:'uppercase'}}>{s.k}</div>
              <SerifH theme={theme} style={{display:'block', fontSize:18, fontWeight:800, color:t.ok, fontFamily:'JetBrains Mono', lineHeight:1, marginTop:2}}>{s.v}</SerifH>
              <div style={{fontSize:10, color:t.inkSoft, marginTop:2}}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'4px 2px 6px'}}>Kontrast · hell</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'2px 14px', marginBottom:10}}>
          {PAIRS.map((p,i)=>(
            <div key={i} style={{display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom: i<PAIRS.length-1?`1px solid ${t.rule}`:'none'}}>
              <div style={{flex:'0 0 64px', background:p.bg, border:`1px solid ${t.rule}`, borderRadius:8, padding:'6px 8px', textAlign:'center', fontFamily:THEMES[theme].font, fontWeight:800, color:p.fg, fontSize:14}}>Aa</div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:12, fontWeight:700, color:t.ink, fontFamily:'JetBrains Mono'}}>{p.name}</div>
                {p.note && <div style={{fontSize:10, color:t.inkSoft, marginTop:1, fontFamily:THEMES[theme].font, fontStyle:'italic'}}>{p.note}</div>}
              </div>
              <span style={{fontFamily:'JetBrains Mono', fontSize:13, fontWeight:800, color: p.ratio>=7?t.ok : p.ratio>=4.5?t.ok : t.danger}}>{p.ratio.toFixed(1).replace('.', ',')} : 1</span>
              <span style={{fontSize:10, fontWeight:800, padding:'2px 7px', borderRadius:99, background: p.grade==='AAA'?t.ok+'22':t.warn+'22', color: p.grade==='AAA'?t.ok:t.warn, letterSpacing:.5}}>{p.grade}</span>
            </div>
          ))}
        </div>

        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'4px 2px 6px'}}>Tap-Target-Karte</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'12px 14px', marginBottom:10}}>
          <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:8}}>
            {[
              {l:'PillBtn',       sz:'44+',  ok:true},
              {l:'HubTile',       sz:'96',   ok:true},
              {l:'Advance-CTA',   sz:'56',   ok:true},
              {l:'Slider-Thumb',  sz:'44',   ok:true},
              {l:'Player-Token',  sz:'44×52',ok:true},
              {l:'Inbox-Kebab',   sz:'36',   ok:false},
              {l:'Tab-Segment',   sz:'44+',  ok:true},
              {l:'Crest-Action',  sz:'40',   ok:true},
            ].map((x,i)=>(
              <div key={i} style={{padding:'8px 6px', background: x.ok?t.ok+'10':t.warn+'14', borderRadius:8, border:`1px solid ${x.ok?t.ok:t.warn}40`}}>
                <div style={{fontSize:9.5, color:t.inkMute, fontWeight:700, letterSpacing:.3, textTransform:'uppercase'}}>{x.l}</div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginTop:2}}>
                  <span style={{fontFamily:'JetBrains Mono', fontSize:12, fontWeight:800, color:t.ink}}>{x.sz} px</span>
                  <span style={{fontSize:11, fontWeight:800, color: x.ok?t.ok:t.warn}}>{x.ok?'✓':'△'}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{fontSize:11, color:t.inkSoft, marginTop:8, fontFamily:THEMES[theme].font, fontStyle:'italic'}}>
            Eine Stelle bleibt grenzwertig: Inbox-Mehr-Kebab. Engineering-Fix in Komponenten-Refactor.
          </div>
        </div>

        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'4px 2px 6px'}}>Glyph + Farbe</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'10px 14px', marginBottom:10, display:'flex', flexDirection:'column', gap:6}}>
          {[
            {l:'Form S/U/N', g:'S U N', note:'Buchstabe + Farbe'},
            {l:'Vorhersage ▲▼=', g:'▲ = ▼', note:'Glyphe + Farbe'},
            {l:'Vertrag läuft aus', g:'●', note:'Punkt + Datum rot'},
            {l:'Dach offen/teil/voll', g:'⎴ ⎴ ⎴', note:'Stroke + Dash + Farbe'},
          ].map((r,i)=>(
            <div key={i} style={{display:'flex', alignItems:'center', gap:10, padding:'5px 0'}}>
              <span style={{flex:'0 0 90px', fontSize:11.5, color:t.ink, fontWeight:600}}>{r.l}</span>
              <span style={{flex:'0 0 60px', fontFamily:'JetBrains Mono', fontWeight:800, fontSize:12, color:t.accent, letterSpacing:1.5}}>{r.g}</span>
              <span style={{fontSize:10.5, color:t.inkMute, flex:1, fontStyle:'italic', fontFamily:THEMES[theme].font}}>{r.note}</span>
              <span style={{fontSize:11, fontWeight:800, color:t.ok}}>✓</span>
            </div>
          ))}
        </div>

        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'4px 2px 6px'}}>Offene Punkte · 6 Items</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'10px 14px'}}>
          {[
            'aria-hidden auf dekorative <Crest/>, wenn Klubname als Text daneben.',
            'role="status" auf LiveXgStrip für Live-Region-Announce.',
            '<dl>/<dt>/<dd> statt <div> bei Stat-Tiles (Kpi · Stat · Sum).',
            'Focus-Trap im Halbzeit-Sheet, Settings-Sheet, Pressekonferenz.',
            'prefers-reduced-motion: cinematic.* zu statischem Final-Frame.',
            'Inbox-Mehr-Kebab auf 44×44 px erweitern (aktuell 36).',
          ].map((todo,i)=>(
            <div key={i} style={{display:'flex', alignItems:'flex-start', gap:10, padding:'7px 0', borderBottom: i<5?`1px solid ${t.rule}`:'none'}}>
              <span style={{flex:'0 0 22px', fontFamily:'JetBrains Mono', fontSize:11, fontWeight:800, color:t.inkSoft}}>{i+1}.</span>
              <span style={{fontSize:12, color:t.ink, lineHeight:1.4}}>{todo}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenA11yAudit });
