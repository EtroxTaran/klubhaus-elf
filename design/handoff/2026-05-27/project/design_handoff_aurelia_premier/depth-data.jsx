// depth-data.jsx — three more depth screens:
//   39  Spieler-Heatmap (T2.1)
//   40  Karrierebogen / CV-Timeline (T2.2)
//   41  Saison-Chronik / Album (T3.1)

// =================================================================
// 39 — SPIELER-HEATMAP (T2.1)
// SVG heatmap over a top-down pitch, three filter chips for halves/full.
// =================================================================
function ScreenPlayerHeatmap({theme='A', scheme='light'}){
  const t = THEMES[theme][scheme];
  const [filter, setFilter] = React.useState('full');
  // 24 heatpoints on a 100×60 pitch, biased toward Brody's #10 territory
  // (left-of-center attacking half). Seeded so it's deterministic.
  const POINTS = [
    [42,28,1.0],[46,30,.9],[50,32,1.0],[44,24,.8],[48,22,.7],[40,34,.7],
    [38,30,.6],[42,40,.5],[36,26,.6],[52,28,.7],[44,18,.4],[50,40,.5],
    [56,30,.5],[34,32,.5],[40,46,.4],[46,46,.3],[52,42,.4],[58,38,.3],
    [42,12,.25],[58,18,.25],[30,28,.3],[28,38,.2],[60,46,.2],[64,30,.3],
  ];
  const halfFilter = (p) => filter==='full' || (filter==='h1' ? p[2]>=.5 : p[2]<.6);
  const visible = POINTS.filter(halfFilter);

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{padding:'4px 16px 8px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.ChevronLeft color={t.ink} size={18}/></button>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>Heatmap · NBC 1 : 2 FCH</div>
            <SerifH theme={theme} style={{fontSize:16, fontWeight:700, color:t.ink}}>Marek Brody · OM</SerifH>
          </div>
          <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.More color={t.ink} size={16}/></button>
        </div>
      </header>

      {/* Identity strip */}
      <div style={{padding:'0 16px 8px'}}>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'10px 14px', display:'flex', alignItems:'center', gap:10}}>
          <Portrait name="Marek Brody" theme={theme} scheme={scheme} size={36} variant="player"/>
          <div style={{flex:1}}>
            <div style={{display:'flex', alignItems:'center', gap:6}}>
              <PosPill pos="OM" theme={theme} scheme={scheme}/>
              <SerifH theme={theme} style={{fontSize:14, fontWeight:700, color:t.ink}}>Marek Brody</SerifH>
            </div>
            <div style={{fontSize:11, color:t.inkMute, marginTop:1}}>89 Min. · 1 Tor · 1 Vorlage · 62 Aktionen</div>
          </div>
          <SerifH theme={theme} style={{fontSize:20, fontWeight:800, color:t.ok, fontFamily:'JetBrains Mono'}}>8,7</SerifH>
        </div>
      </div>

      {/* Filter chips */}
      <div style={{padding:'0 16px 8px'}}>
        <div style={{display:'flex', gap:4, padding:3, background:t.bgInk, borderRadius:9}}>
          {[
            {id:'full', l:'Gesamt'},
            {id:'h1',   l:'1. Halbzeit'},
            {id:'h2',   l:'2. Halbzeit'},
          ].map(o=>(
            <button key={o.id} onClick={()=>setFilter(o.id)} style={{
              flex:1, padding:'8px 0', borderRadius:7, border:'none',
              background: filter===o.id ? t.card : 'transparent',
              color: filter===o.id ? t.ink : t.inkMute,
              boxShadow: filter===o.id ? `0 1px 0 ${t.rule}` : 'none',
              fontFamily:'inherit', fontWeight:700, fontSize:11.5
            }}>{o.l}</button>
          ))}
        </div>
      </div>

      {/* Heatmap pitch */}
      <div style={{padding:'4px 16px 0'}}>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'8px', position:'relative'}}>
          <svg viewBox="0 0 200 130" style={{width:'100%', display:'block', borderRadius:8, overflow:'hidden'}}>
            <defs>
              <radialGradient id="hot-blob" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor={t.accent} stopOpacity=".75"/>
                <stop offset="40%"  stopColor={t.accent} stopOpacity=".35"/>
                <stop offset="100%" stopColor={t.accent} stopOpacity="0"/>
              </radialGradient>
              <linearGradient id="hot-pitch" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor={t.ok} stopOpacity=".5"/>
                <stop offset="1" stopColor={t.ok} stopOpacity=".4"/>
              </linearGradient>
            </defs>
            {/* pitch */}
            <rect x="2" y="2" width="196" height="126" rx="3" fill="url(#hot-pitch)" stroke={t.ink} strokeWidth=".5"/>
            {/* stripes */}
            {Array.from({length:8}).map((_,i)=>(<rect key={i} x={2+i*24.5} y="2" width="12.25" height="126" fill="#fff" opacity={i%2?.06:0}/>))}
            {/* center + circle */}
            <line x1="100" y1="2" x2="100" y2="128" stroke="#fff" strokeWidth=".5" opacity=".6"/>
            <circle cx="100" cy="65" r="14" fill="none" stroke="#fff" strokeWidth=".5" opacity=".6"/>
            {/* boxes */}
            <rect x="2" y="35" width="22" height="60" fill="none" stroke="#fff" strokeWidth=".5" opacity=".6"/>
            <rect x="176" y="35" width="22" height="60" fill="none" stroke="#fff" strokeWidth=".5" opacity=".6"/>
            <rect x="2" y="50" width="8" height="30" fill="none" stroke="#fff" strokeWidth=".5" opacity=".6"/>
            <rect x="190" y="50" width="8" height="30" fill="none" stroke="#fff" strokeWidth=".5" opacity=".6"/>
            {/* direction arrow */}
            <g opacity=".55">
              <path d="M85 8 L115 8 L115 5 L122 9 L115 13 L115 10 L85 10 Z" fill="#fff"/>
              <text x="100" y="20" textAnchor="middle" fontFamily="Inter" fontSize="5" fontWeight="700" fill="#fff">SPIELRICHTUNG · 2. HZ</text>
            </g>
            {/* heat blobs */}
            {visible.map((p,i)=>{
              const r = 14 + p[2]*10;
              return <circle key={i} cx={p[0]*2} cy={p[1]*2} r={r} fill="url(#hot-blob)"/>;
            })}
            {/* average position cross */}
            {(() => {
              const avgX = visible.reduce((s,p)=>s+p[0]*p[2],0)/visible.reduce((s,p)=>s+p[2],0);
              const avgY = visible.reduce((s,p)=>s+p[1]*p[2],0)/visible.reduce((s,p)=>s+p[2],0);
              return (
                <g>
                  <circle cx={avgX*2} cy={avgY*2} r="6" fill={t.bg} stroke={t.ink} strokeWidth="1"/>
                  <text x={avgX*2} y={avgY*2+2} textAnchor="middle" fontFamily="Inter" fontSize="6" fontWeight="800" fill={t.ink}>10</text>
                </g>
              );
            })()}
          </svg>
          <div style={{display:'flex', justifyContent:'space-between', marginTop:6, fontSize:9.5, color:t.inkSoft, fontFamily:'JetBrains Mono', fontWeight:700}}>
            <span>Eigene Hälfte</span>
            <span>Mittellinie</span>
            <span>Gegnerhälfte</span>
          </div>
        </div>
      </div>

      {/* Stats below */}
      <div style={{flex:1, overflowY:'auto', padding:'12px 16px 20px'}}>
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', marginBottom:6}}>Aktionen im Spiel</div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:6}}>
          <ActionTile theme={theme} scheme={scheme} k="Pässe" v="58" sub="91 % angekommen" accent/>
          <ActionTile theme={theme} scheme={scheme} k="Pässe in Drittel" v="11"/>
          <ActionTile theme={theme} scheme={scheme} k="Schüsse" v="4" sub="2 aufs Tor" accent/>
          <ActionTile theme={theme} scheme={scheme} k="Dribblings" v="6" sub="4 erfolgreich"/>
          <ActionTile theme={theme} scheme={scheme} k="Zweikämpfe" v="8" sub="63 %"/>
          <ActionTile theme={theme} scheme={scheme} k="Ballverluste" v="3"/>
        </div>

        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'16px 2px 6px'}}>Schlüsselmomente</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'2px 14px'}}>
          {[
            { min:"34'", e:'Vorlage zum 1:0', col:t.ok,    sym:'⚽' },
            { min:"68'", e:'Großchance · Pfostenschuss', col:t.warn, sym:'·' },
            { min:"82'", e:'Tor zum 2:1 · Volley aus 14 m', col:t.accent, sym:'⚽' },
          ].map((m,i,arr)=>(
            <div key={i} style={{display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom: i<arr.length-1?`1px solid ${t.rule}`:'none'}}>
              <span style={{fontFamily:'JetBrains Mono', fontSize:12, fontWeight:800, color:t.inkMute, width:36, textAlign:'right'}}>{m.min}</span>
              <span style={{width:22, height:22, borderRadius:6, background:m.col+'22', color:m.col, display:'grid', placeItems:'center', fontWeight:800}}>{m.sym}</span>
              <span style={{flex:1, fontSize:13, fontWeight:700, color:t.ink}}>{m.e}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function ActionTile({theme, scheme, k, v, sub, accent}){
  const t = THEMES[theme][scheme];
  return (
    <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:10, padding:'9px 11px'}}>
      <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.4, textTransform:'uppercase'}}>{k}</div>
      <SerifH theme={theme} style={{display:'block', fontSize:18, fontWeight:800, color: accent?t.accent:t.ink, fontFamily:'JetBrains Mono', marginTop:2, lineHeight:1}}>{v}</SerifH>
      {sub && <div style={{fontSize:10, color:t.inkSoft, marginTop:2}}>{sub}</div>}
    </div>
  );
}

// =================================================================
// 40 — KARRIEREBOGEN (T2.2)
// Vertical CV-style timeline of clubs, injuries, trophies, ratings.
// =================================================================
function ScreenCareerArc({theme='A', scheme='light'}){
  const t = THEMES[theme][scheme];
  // Sorted newest-on-top
  const EVENTS = [
    { y:2026, kind:'season', club:'FC Hafenstadt',     pos:'OM', apps:28, goals:9,  rating:'7,8', note:'Saison im Anlauf — Pokal-Halbfinale.' },
    { y:2025, kind:'season', club:'FC Hafenstadt',     pos:'OM', apps:34, goals:12, rating:'7,6', note:'Aufstieg in die Aurelia Premier.' },
    { y:2024, kind:'transfer', from:'Riverdale Athletic', to:'FC Hafenstadt', fee:'4,2 Mio. €', note:'Wechselt für eine Rekordablöse.' },
    { y:2024, kind:'season', club:'Riverdale Athletic', pos:'OM', apps:31, goals:10, rating:'7,4', note:'Erste komplette Profisaison.' },
    { y:2023, kind:'injury', what:'Muskelfaserriss · 5 Wochen', note:'Im Pokalspiel gegen Northbridge.' },
    { y:2023, kind:'season', club:'Riverdale Athletic', pos:'ZM', apps:20, goals:4,  rating:'6,9', note:'Bricht als Joker in die Stammelf.' },
    { y:2022, kind:'award',   t:'Bester Nachwuchsspieler · Norvania-Süd' },
    { y:2022, kind:'season',  club:'Riverdale Athletic II', pos:'ZM', apps:18, goals:6, rating:'7,1', note:'Erste Berührung mit dem Profibetrieb.' },
    { y:2021, kind:'debut',   t:'Pflichtspieldebüt · Cup-Auswärtsspiel' },
  ];
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{padding:'4px 16px 8px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.ChevronLeft color={t.ink} size={18}/></button>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>Werdegang</div>
            <SerifH theme={theme} style={{fontSize:16, fontWeight:700, color:t.ink}}>Marek Brody · #10</SerifH>
          </div>
          <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.Download color={t.ink} size={16}/></button>
        </div>
      </header>

      {/* Summary chips */}
      <div style={{padding:'4px 16px 12px', display:'flex', gap:6, flexWrap:'wrap'}}>
        <Sum theme={theme} scheme={scheme} k="Profispiele" v="113"/>
        <Sum theme={theme} scheme={scheme} k="Tore" v="41" accent/>
        <Sum theme={theme} scheme={scheme} k="Vorlagen" v="36" accent/>
        <Sum theme={theme} scheme={scheme} k="Saison ⌀" v="7,5"/>
      </div>

      <div style={{flex:1, overflowY:'auto', padding:'0 16px 24px'}}>
        <div style={{position:'relative', paddingLeft:24}}>
          {/* axis line */}
          <div style={{position:'absolute', left:8, top:6, bottom:6, width:2, background:t.rule, borderRadius:99}}/>
          {EVENTS.map((e,i)=>(
            <ArcEvent key={i} theme={theme} scheme={scheme} e={e} last={i===EVENTS.length-1}/>
          ))}
          {/* birth marker */}
          <div style={{position:'relative', display:'flex', alignItems:'center', gap:10, paddingTop:12}}>
            <span style={{position:'absolute', left:-22, top:14, width:18, height:18, borderRadius:99, background:t.ink, border:`3px solid ${t.bg}`, boxShadow:`0 0 0 1px ${t.rule}`}}/>
            <div style={{flex:1, padding:'10px 14px', background:t.card, border:`1px dashed ${t.rule}`, borderRadius:12}}>
              <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between'}}>
                <SerifH theme={theme} style={{fontSize:13, fontWeight:700, color:t.ink}}>Geboren · Hafenstadt</SerifH>
                <span style={{fontFamily:'JetBrains Mono', fontSize:11, fontWeight:700, color:t.inkSoft}}>2000</span>
              </div>
              <div style={{fontSize:11, color:t.inkMute, marginTop:2, fontFamily:THEMES[theme].font, fontStyle:'italic'}}>„Heimkind". Trägt es bis heute mit sich."</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function Sum({theme, scheme, k, v, accent}){
  const t = THEMES[theme][scheme];
  return (
    <div style={{padding:'6px 10px', background:t.card, border:`1px solid ${t.rule}`, borderRadius:10, display:'flex', alignItems:'baseline', gap:6}}>
      <span style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.4, textTransform:'uppercase'}}>{k}</span>
      <span style={{fontFamily:'JetBrains Mono', fontSize:13, fontWeight:800, color: accent?t.accent:t.ink}}>{v}</span>
    </div>
  );
}
function ArcEvent({theme, scheme, e, last}){
  const t = THEMES[theme][scheme];
  const k = e.kind;
  const conf = {
    season:   { c:t.ink,    bg:t.bgInk,   glyph:'⌖' },
    transfer: { c:t.accent, bg:t.accentSoft, glyph:'⇄' },
    injury:   { c:t.danger, bg:t.danger+'18', glyph:'+' },
    award:    { c:t.warn,   bg:t.warn+'18',   glyph:'★' },
    debut:    { c:t.ok,     bg:t.ok+'18',     glyph:'●' },
  }[k];
  return (
    <div style={{position:'relative', display:'flex', alignItems:'flex-start', gap:10, marginBottom:10}}>
      <span style={{position:'absolute', left:-22, top:14, width:18, height:18, borderRadius:99, background:conf.c, color:'#fff', display:'grid', placeItems:'center', fontSize:10, fontWeight:800, border:`3px solid ${t.bg}`, boxShadow:`0 0 0 1px ${conf.c}`}}>{conf.glyph}</span>
      <div style={{flex:1, padding:'10px 14px', background:t.card, border:`1px solid ${t.rule}`, borderRadius:12}}>
        <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:8}}>
          <SerifH theme={theme} style={{fontSize:13.5, fontWeight:700, color:conf.c, lineHeight:1.15}}>
            {k==='season'   && `${e.club} · ${e.pos}`}
            {k==='transfer' && `${e.from} → ${e.to}`}
            {k==='injury'   && e.what}
            {k==='award'    && e.t}
            {k==='debut'    && e.t}
          </SerifH>
          <span style={{fontFamily:'JetBrains Mono', fontSize:11, fontWeight:800, color:t.inkSoft}}>{e.y}</span>
        </div>
        {k==='season' && (
          <div style={{display:'flex', gap:8, marginTop:6, alignItems:'baseline', flexWrap:'wrap'}}>
            <span style={{fontSize:11, color:t.inkMute}}><b style={{color:t.ink, fontFamily:'JetBrains Mono'}}>{e.apps}</b> Spiele</span>
            <span style={{fontSize:11, color:t.inkMute}}><b style={{color:t.ink, fontFamily:'JetBrains Mono'}}>{e.goals}</b> Tore</span>
            <span style={{fontSize:11, color:t.inkMute}}>Saison <b style={{color:t.ok, fontFamily:'JetBrains Mono'}}>{e.rating}</b></span>
          </div>
        )}
        {k==='transfer' && (
          <div style={{fontSize:11, color:t.inkMute, marginTop:4, fontFamily:'JetBrains Mono'}}>Ablöse · {e.fee}</div>
        )}
        {e.note && <div style={{fontSize:11, color:t.inkMute, marginTop:5, fontFamily:THEMES[theme].font, fontStyle:'italic', lineHeight:1.35}}>{e.note}</div>}
      </div>
    </div>
  );
}

// =================================================================
// 41 — SAISON-CHRONIK / ALBUM (T3.1)
// Vintage album page, scrollable but feels like a single bound spread.
// =================================================================
function ScreenSeasonAlbum({theme='A', scheme='light'}){
  const t = THEMES[theme][scheme];
  // Paper color is intentionally warmer/aged to differentiate from regular screens
  const paper = scheme==='light' ? '#ede2c8' : '#1f1812';
  const ruleC = scheme==='light' ? '#bba98a' : '#3b3024';
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%', position:'relative'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      {/* Header */}
      <header style={{padding:'4px 16px 6px', background:t.bg, position:'relative', zIndex:5}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.ChevronLeft color={t.ink} size={18}/></button>
          <SerifH theme={theme} style={{fontSize:16, fontWeight:700, color:t.ink}}>Saison-Album</SerifH>
          <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.ShareIos color={t.ink} size={16}/></button>
        </div>
      </header>

      {/* Album page */}
      <div style={{
        flex:1, overflowY:'auto', padding:'18px 18px 28px',
        background:paper,
        backgroundImage: scheme==='light'
          ? 'radial-gradient(circle at 10% 15%, rgba(0,0,0,.04) 0%, transparent 60%), radial-gradient(circle at 90% 85%, rgba(0,0,0,.05) 0%, transparent 60%)'
          : 'radial-gradient(circle at 10% 15%, rgba(255,255,255,.03) 0%, transparent 60%), radial-gradient(circle at 90% 85%, rgba(255,255,255,.04) 0%, transparent 60%)'
      }}>
        {/* Cover ribbon */}
        <div style={{textAlign:'center', borderBottom:`1.5px solid ${ruleC}`, paddingBottom:14, marginBottom:14, position:'relative'}}>
          <div style={{display:'inline-block', padding:'6px 14px', background:t.accent, color:'#fff', fontWeight:800, letterSpacing:1.4, fontSize:10, fontFamily:'Inter', transform:'rotate(-2deg)'}}>SAISON 2025/26</div>
          <SerifH theme={theme} style={{display:'block', fontSize:32, fontWeight:800, color:t.ink, lineHeight:1.05, letterSpacing:-0.5, marginTop:10}}>Das Jahr von Hafenstadt</SerifH>
          <div style={{fontSize:12, color:t.inkMute, marginTop:4, fontFamily:THEMES[theme].font, fontStyle:'italic'}}>Vom Aufsteiger zum Vizemeister. 17 Heimsiege. Eine Saison zum Einrahmen.</div>
          {/* Date stamp */}
          <div style={{position:'absolute', right:0, top:0, transform:'rotate(8deg)', border:`2px solid ${t.accent}`, color:t.accent, padding:'4px 8px', fontFamily:'Inter', fontSize:9, fontWeight:900, letterSpacing:1.2, background:'#fff8'}}>GEDRUCKT 18.05.2026</div>
        </div>

        {/* 3-photo collage */}
        <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gridTemplateRows:'auto auto', gap:8, marginBottom:14}}>
          <AlbumPhoto theme={theme} scheme={scheme} rotate={-1.5} bigCaption="34' · 1:0 in Northbridge" smallCaption="Wieser köpft Hafenstadt vorzeitig zum Sieg." span="row1col1" kind="goal"/>
          <AlbumPhoto theme={theme} scheme={scheme} rotate={1.2} bigCaption="Aufstieg gefeiert" smallCaption="März — Tabellenführung gesichert." kind="celebration"/>
          <AlbumPhoto theme={theme} scheme={scheme} rotate={-0.6} bigCaption="Vor 27.412 zuhause" smallCaption="Der Block N singt sich heiser." kind="crowd"/>
        </div>

        {/* Key stats ribbon */}
        <div style={{background:'#fff', border:`1.5px solid ${ruleC}`, borderRadius:4, padding:'12px 14px', marginBottom:14, position:'relative'}}>
          <div style={{fontSize:9.5, fontWeight:800, color:t.inkMute, letterSpacing:.8, textTransform:'uppercase', marginBottom:8, fontFamily:'Inter'}}>Saison in Zahlen</div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:6}}>
            {[
              { v:'72', k:'Punkte' },
              { v:'22', k:'Siege' },
              { v:'+44', k:'Tordiff.' },
              { v:'7,5', k:'Saison ⌀' },
            ].map((s,i)=>(
              <div key={i} style={{textAlign:'center', padding:'4px 0', borderRight: i<3 ? `1px dashed ${ruleC}` : 'none'}}>
                <SerifH theme={theme} style={{display:'block', fontSize:22, fontWeight:800, color:t.ink, fontFamily:'JetBrains Mono'}}>{s.v}</SerifH>
                <div style={{fontSize:9, color:t.inkMute, fontWeight:700, letterSpacing:.4, textTransform:'uppercase', marginTop:1}}>{s.k}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trophy cabinet */}
        <div style={{padding:'12px 14px', background:'#fff', border:`1.5px solid ${ruleC}`, borderRadius:4, marginBottom:14}}>
          <div style={{fontSize:9.5, fontWeight:800, color:t.inkMute, letterSpacing:.8, textTransform:'uppercase', marginBottom:8, fontFamily:'Inter'}}>Trophäenschrank</div>
          <div style={{display:'flex', gap:14, alignItems:'center'}}>
            <Trophy theme={theme} scheme={scheme} kind="cup"   label="Vizemeister · Liga Norvania"/>
            <Trophy theme={theme} scheme={scheme} kind="ball"  label="Aufstieg in die Aurelia Premier"/>
            <Trophy theme={theme} scheme={scheme} kind="medal" label="Tor des Jahres · Brody"/>
          </div>
        </div>

        {/* Tabloid clippings */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
          {[
            { stamp:'TAGESKURIER', t:'„Hafenstadt steigt auf — die Stadt steht still."', d:'12.04.2026' },
            { stamp:'SPORT-ECHO',  t:'„Brody, der Spielmacher, der Hafenstadt liebt."',  d:'24.04.2026' },
          ].map((c,i)=>(
            <div key={i} style={{
              background:'#fffdf3', border:`1px solid ${ruleC}`, padding:'10px 12px',
              transform: i===0?'rotate(-1.4deg)':'rotate(1.1deg)',
              boxShadow:'0 2px 4px rgba(0,0,0,.06)'
            }}>
              <div style={{fontSize:9, fontWeight:900, color:t.danger, letterSpacing:1.2, marginBottom:4}}>{c.stamp}</div>
              <SerifH theme={theme} style={{display:'block', fontSize:13, fontWeight:700, color:'#1a1410', lineHeight:1.2}}>{c.t}</SerifH>
              <div style={{fontSize:10, color:'#5a4f44', marginTop:6, fontFamily:'JetBrains Mono'}}>{c.d}</div>
            </div>
          ))}
        </div>

        {/* Footer signature */}
        <div style={{textAlign:'center', marginTop:18, paddingTop:14, borderTop:`1.5px solid ${ruleC}`, fontSize:11, color:t.inkSoft, fontFamily:THEMES[theme].font, fontStyle:'italic'}}>
          Bewahrt im Karriere-Archiv von Julia Lindquist · Hafenstadt, im Frühjahr 2026
        </div>
      </div>

      {/* Bottom actions */}
      <div style={{padding:'10px 16px 20px', background:t.bg, display:'flex', gap:8, borderTop:`1px solid ${t.rule}`}}>
        <button style={{flex:1, height:46, borderRadius:12, background:t.card, border:`1px solid ${t.rule}`, color:t.ink, fontWeight:700, fontSize:12, fontFamily:'inherit', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6}}>
          <I.Download size={14} color={t.ink}/> PDF speichern
        </button>
        <button style={{flex:1.5, height:46, borderRadius:12, background:t.ink, color:t.bg, border:'none', fontWeight:800, fontSize:13, fontFamily:'inherit'}}>Vorherige Saison →</button>
      </div>
    </div>
  );
}

function AlbumPhoto({theme, scheme, rotate=0, bigCaption, smallCaption, kind}){
  const t = THEMES[theme][scheme];
  // Inline B/W SVG illustration per kind
  const Illus = () => {
    if (kind==='celebration') return (
      <g>
        <rect width="160" height="100" fill="#0c0a08"/>
        <g fill="#fff">
          <circle cx="80" cy="32" r="9"/>
          <path d="M70 44 L90 44 L94 80 L66 80 Z"/>
          {/* arms up */}
          <path d="M68 44 L52 28 L48 32 L66 50 Z"/>
          <path d="M92 44 L108 28 L112 32 L94 50 Z"/>
        </g>
        {/* confetti */}
        {Array.from({length:30}).map((_,i)=>(
          <rect key={i} x={5 + (i*5.3)%150} y={5 + (i*7.1)%80} width="2.5" height="5" fill="#fff" opacity={.4 + (i%3)*0.2}/>
        ))}
      </g>
    );
    if (kind==='crowd') return (
      <g>
        <rect width="160" height="100" fill="#0c0a08"/>
        {/* crowd silhouettes */}
        {Array.from({length:80}).map((_,i)=>(
          <circle key={i} cx={4 + (i*4.7)%158} cy={20 + ((i*3.1)%80)} r="2.4" fill="#fff" opacity=".18"/>
        ))}
        {/* banner */}
        <rect x="44" y="42" width="72" height="20" fill="#b7301b"/>
        <text x="80" y="56" textAnchor="middle" fontFamily="Inter" fontWeight="900" fontSize="10" fill="#fff" letterSpacing="1">HAFENSTADT</text>
      </g>
    );
    // default: goal
    return (
      <g>
        <rect width="160" height="100" fill="#0c0a08"/>
        {/* net */}
        <g stroke="#fff" strokeWidth=".6" opacity=".55">
          {Array.from({length:14}).map((_,i)=>(<line key={i} x1={i*12} y1="0" x2={i*12} y2="100"/>))}
          {Array.from({length:10}).map((_,i)=>(<line key={i} x1="0" y1={i*11} x2="160" y2={i*11}/>))}
        </g>
        {/* player */}
        <g fill="#fff">
          <circle cx="60" cy="44" r="8"/>
          <path d="M54 54 L66 54 L70 84 L50 84 Z"/>
          <path d="M50 84 L36 88 L40 92 L54 88 Z"/>
          <path d="M70 54 L82 50 L84 54 L74 60 Z"/>
        </g>
        {/* ball */}
        <circle cx="106" cy="50" r="6" fill="#fff" stroke="#0c0a08" strokeWidth="1"/>
        <path d="M104 47 L108 47 L109 51 L103 51 Z" fill="#0c0a08"/>
      </g>
    );
  };
  return (
    <div style={{
      background:'#fff', padding:8, transform:`rotate(${rotate}deg)`,
      boxShadow:'0 3px 8px rgba(0,0,0,.10)',
      border:'1px solid #d3c5a4'
    }}>
      <div style={{aspectRatio:'16/10', overflow:'hidden'}}>
        <svg viewBox="0 0 160 100" style={{width:'100%', display:'block'}}>
          <Illus/>
        </svg>
      </div>
      <div style={{padding:'6px 4px 0'}}>
        <div style={{fontFamily:THEMES[theme].font, fontWeight:700, fontSize:11.5, color:'#1a1410', lineHeight:1.1}}>{bigCaption}</div>
        <div style={{fontFamily:THEMES[theme].font, fontStyle:'italic', fontSize:10, color:'#5a4f44', marginTop:2, lineHeight:1.3}}>{smallCaption}</div>
      </div>
    </div>
  );
}

function Trophy({theme, scheme, kind, label}){
  const t = THEMES[theme][scheme];
  return (
    <div style={{flex:1, textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:5}}>
      <svg width="44" height="44" viewBox="0 0 44 44">
        {kind==='cup' && (<g>
          <path d="M14 8 H30 V18 Q30 26 22 28 Q14 26 14 18 Z" fill={t.warn} stroke={t.ink} strokeWidth="1"/>
          <path d="M14 12 Q8 12 8 18 Q8 22 12 22" fill="none" stroke={t.ink} strokeWidth="1.2"/>
          <path d="M30 12 Q36 12 36 18 Q36 22 32 22" fill="none" stroke={t.ink} strokeWidth="1.2"/>
          <rect x="18" y="28" width="8" height="6" fill={t.warn} stroke={t.ink} strokeWidth="1"/>
          <rect x="12" y="34" width="20" height="3" fill={t.warn} stroke={t.ink} strokeWidth="1"/>
        </g>)}
        {kind==='ball' && (<g>
          <circle cx="22" cy="22" r="14" fill="#fff" stroke={t.ink} strokeWidth="1.3"/>
          <polygon points="22,16 28,20 26,28 18,28 16,20" fill={t.ink}/>
        </g>)}
        {kind==='medal' && (<g>
          <path d="M16 4 L22 16 L28 4 Z" fill="#b7301b" stroke={t.ink} strokeWidth=".8"/>
          <circle cx="22" cy="26" r="11" fill={t.warn} stroke={t.ink} strokeWidth="1.2"/>
          <text x="22" y="30" textAnchor="middle" fontFamily="Newsreader, serif" fontWeight="800" fontSize="11" fill={t.ink}>★</text>
        </g>)}
      </svg>
      <div style={{fontSize:10, color:'#1a1410', fontWeight:600, lineHeight:1.2, textAlign:'center', maxWidth:96}}>{label}</div>
    </div>
  );
}

Object.assign(window, {
  ScreenPlayerHeatmap, ScreenCareerArc, ScreenSeasonAlbum,
  ActionTile, Sum, ArcEvent, AlbumPhoto, Trophy,
});
