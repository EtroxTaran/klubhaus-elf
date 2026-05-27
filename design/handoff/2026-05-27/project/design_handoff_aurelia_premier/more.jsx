// more.jsx — Club theming + remaining screens:
//   29  Vereinsfarben-Showcase (adaptive theming)
//   30  Transferbüro
//   31  Liga-Tabelle
//   32  Pokalbaum (Confederation Cup bracket)
//   33  2D-Ticker (match — second tab)
//   34  Aufstellung mit Rollen-Chips

// ---------- CLUB-THEME REGISTRY ----------
// Reads CLUB_REGISTRY from data.jsx (single source of truth). Each club's
// identity produces a derived theme key keyed by `A_<clubId>` so the existing
// screens (which read THEMES[theme][scheme]) adapt without code changes.
// alpha helper — appends 8-bit alpha to a #rrggbb hex
const alpha = (hex, aa) => hex + aa;

// Build a derived theme keyed by `A_<clubId>`
function registerClubTheme(clubId){
  const c = CLUB_REGISTRY[clubId];
  if (!c) return;
  const baseL = THEMES.A.light, baseD = THEMES.A.dark;
  const key = 'A_' + clubId;
  if (THEMES[key]) return; // already registered
  THEMES[key] = {
    name: 'Sonntagszeitung · ' + c.name,
    font: THEMES.A.font, ui: THEMES.A.ui, radius: THEMES.A.radius,
    light: { ...baseL, accent: c.primary, accentSoft: alpha(c.primary, '1f') },
    dark:  { ...baseD, accent: c.primary, accentSoft: alpha(c.primary, '33') },
  };
}
// Register a theme for every club in the registry
Object.keys(CLUB_REGISTRY).forEach(registerClubTheme);

// Back-compat alias for any pre-existing reference
const CLUBS_TONE = CLUB_REGISTRY;

// ---------- 29. CLUB COLOURS SHOWCASE ----------
// Re-uses ScreenHub but with each club's theme key. Shows that the same
// screen adapts its accent/accent-soft to the active club's palette.
function ClubHub({clubId, scheme='light'}){
  const c = CLUB_REGISTRY[clubId];
  const themeKey = 'A_' + clubId;
  const t = THEMES[themeKey][scheme];
  const m = FIXTURES[0];
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',padding:'0 16px 92px', position:'relative'}}>
      <ThemeCss theme={themeKey} scheme={scheme}/>
      <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'6px 0 8px'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <Crest {...c.crest} size={34}/>
          <Jersey pattern={c.kit?.pattern || 'solid'}
                  a={c.crest.a} b={c.crest.b}
                  sleeveAccent={c.kit?.sleeveAccent !== false}
                  crest={null} size={30}/>
          <div>
            <div style={{fontSize:11, color:t.inkMute, letterSpacing:.4, fontWeight:600, textTransform:'uppercase'}}>{c.name}</div>
            <SerifH theme={themeKey} style={{fontSize:18, fontWeight:700, lineHeight:1.05, color:t.ink}}>Mo, 18. Mai · 09:41</SerifH>
          </div>
        </div>
        <button aria-label="Posteingang" style={{position:'relative',width:40,height:40,borderRadius:12,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center',color:t.ink}}>
          <I.Inbox size={18} color={t.ink}/>
          <span style={{position:'absolute',top:-4,right:-4,minWidth:18,height:18,padding:'0 5px',borderRadius:999,background:t.accent,color:'#fff',fontSize:10,fontWeight:800,display:'grid',placeItems:'center'}}>3</span>
        </button>
      </header>
      <div style={{fontFamily:THEMES[themeKey].font, fontStyle:'italic', fontSize:13, color:t.inkMute, padding:'0 2px 10px', borderBottom:`1px solid ${t.rule}`, marginBottom:14}}>
        „Die Stadt erwartet drei Punkte." — Tageszeitung
      </div>
      <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:16, padding:'14px 14px 12px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
          <span style={{fontSize:10, fontWeight:800, letterSpacing:1.2, color:t.accent}}>NÄCHSTER TERMIN</span>
          <span style={{fontSize:11, color:t.inkMute, fontVariantNumeric:'tabular-nums'}}>{m.date} · 15:30</span>
        </div>
        <SerifH theme={themeKey} style={{display:'block', fontSize:22, fontWeight:700, lineHeight:1.1, marginTop:6, color:t.ink}}>
          Auswärts <span style={{color:t.inkSoft}}>·</span> Aurelia Premier
        </SerifH>
        <div style={{fontSize:12, color:t.inkMute, marginTop:4}}>32. Spieltag · Hafenstadt-Arena</div>
        <div style={{display:'flex',gap:18, marginTop:12, alignItems:'center'}}>
          <div>
            <div style={{fontSize:10, color:t.inkMute, fontWeight:600}}>Stärke</div>
            <div style={{fontFamily:'JetBrains Mono', fontSize:14, fontWeight:800, color:t.ink, marginTop:3}}>7,6</div>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:10, color:t.inkMute, fontWeight:600}}>Form</div>
            <div style={{marginTop:4}}><FormStrip form="SSNSU" theme={themeKey} scheme={scheme}/></div>
          </div>
        </div>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:14}}>
        {[
          { i:<I.Pitch color={t.ink} size={20}/>,    k:'Trainingsplan', sub:'Mo–Sa · Defensive', flag:'2 angeschlagen' },
          { i:<I.Users color={t.ink} size={20}/>,    k:'Transferbüro',  sub:'3 Anfragen offen',  flag:'Stürmer umworben' },
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
          background:t.accent, color:'#fff', fontWeight:800, fontSize:16,
          display:'flex', alignItems:'center', justifyContent:'center', gap:10,
          fontFamily:'inherit', position:'relative',
          boxShadow:`0 8px 20px -8px ${t.accent}90`
        }}>
          Weiter zum nächsten Termin
          <I.ArrowRight size={20} color="#fff"/>
        </button>
      </div>
    </div>
  );
}

// =================================================================
// 30. TRANSFERBÜRO
// =================================================================
function ScreenTransfers({theme, scheme}){
  const t = THEMES[theme][scheme];
  const tr = useT();
  const isDe = getLocale() === 'de';
  const [tab, setTab] = React.useState('eingehend');
  const incoming = [
    { from:'Riverdale Athletic', player:'Marek Brody', pos:'OM', age:26, str:8, bid:18_000_000, status:'verhandeln', stage:'2. Runde', delta:'+2,5 Mio. €' },
    { from:'Northbridge City',   player:'Aleksy Wieser', pos:'ST', age:23, str:7, bid:11_400_000, status:'neu',        stage:'Erstangebot' },
    { from:'AC Valguarda',       player:'Kaito Furukawa', pos:'AV', age:25, str:7, bid: 6_800_000, status:'abgelehnt',  stage:'final' },
  ];
  const outgoing = [
    { to:'Olympique Sauveterre', player:'Élise Vannier', pos:'OM', age:19, str:6, tal:4, bid: 3_200_000, status:'angeboten', stage:'wartet auf Antwort' },
    { to:'Sporting Kaltenbach',  player:'Lukas Pichler', pos:'ZM', age:17, str:5, tal:4, bid:   850_000, status:'verhandeln', stage:'2. Runde' },
  ];
  const list = tab === 'eingehend' ? incoming : outgoing;
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <ScreenHeader theme={theme} scheme={scheme}
        kicker={isDe ? 'Transferperiode · Sommer 26' : 'Transfer window · Summer 26'} title={tr('transfers.office')}
        right={
          <span style={{fontSize:11, color:t.accent, fontWeight:800, padding:'4px 10px', borderRadius:99, background:t.accentSoft}}>{isDe ? 'Budget: 12,4 Mio. €' : 'Budget: €12.4M'}</span>
        }/>

      {/* Tabs */}
      <div style={{padding:'4px 12px 0'}}>
        <div style={{display:'flex', gap:4, padding:3, background:t.bgInk, borderRadius:10}}>
          {[
            {id:'eingehend', l:'Eingehend', n:3},
            {id:'ausgehend', l:'Eigene Anfragen', n:2},
          ].map(o=>(
            <button key={o.id} onClick={()=>setTab(o.id)} style={{
              flex:1, padding:'8px 0', borderRadius:7, border:'none',
              background: tab===o.id ? t.card : 'transparent',
              color: tab===o.id ? t.ink : t.inkMute,
              boxShadow: tab===o.id ? `0 1px 0 ${t.rule}` : 'none',
              fontFamily:'inherit', fontWeight:700, fontSize:11.5,
              display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6
            }}>{o.l}<span style={{padding:'1px 6px', borderRadius:99, background:tab===o.id?t.accent:t.rule, color:tab===o.id?'#fff':t.inkMute, fontSize:10, fontWeight:800, fontFamily:'JetBrains Mono'}}>{o.n}</span></button>
          ))}
        </div>
      </div>

      <div style={{flex:1, overflowY:'auto', padding:'10px 16px 20px'}}>
        {list.map((o,i)=>{
          const tone = o.status==='neu'        ? {bg:t.accentSoft, fg:t.accent,  l:'NEU'}
                     : o.status==='verhandeln' ? {bg:'#e8d28a40',  fg:t.warn,    l:'VERHANDELN'}
                     : o.status==='angeboten'  ? {bg:t.bgInk,      fg:t.inkMute, l:'ANGEBOTEN'}
                     :                           {bg:'#f6dcd533',  fg:t.danger,  l:'ABGELEHNT'};
          return (
            <div key={i} style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'12px 14px', marginBottom:10}}>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <div style={{fontSize:10, fontWeight:700, color:t.inkMute, letterSpacing:.5, textTransform:'uppercase'}}>{tab==='eingehend' ? `Von · ${o.from}` : `An · ${o.to}`}</div>
                <span style={{fontSize:10, fontWeight:800, color:tone.fg, padding:'3px 8px', borderRadius:99, background:tone.bg, letterSpacing:.5}}>{tone.l}</span>
              </div>
              <div style={{display:'flex', alignItems:'flex-start', gap:10, marginTop:8}}>
                <Portrait name={o.player} theme={theme} scheme={scheme} size={42} variant="player"/>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{display:'flex', alignItems:'center', gap:6}}>
                    <PosPill pos={o.pos} theme={theme} scheme={scheme}/>
                    <SerifH theme={theme} style={{fontSize:15, fontWeight:700, color:t.ink}}>{o.player}</SerifH>
                  </div>
                  <div style={{fontSize:11, color:t.inkMute, marginTop:2}}>{o.age} J. · Stärke {o.str}{o.tal?` · Talent ${'★'.repeat(o.tal)}${'☆'.repeat(4-o.tal)}`:''}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:9.5, color:t.inkMute, fontWeight:700, letterSpacing:.4, textTransform:'uppercase'}}>Gebot</div>
                  <SerifH theme={theme} style={{fontSize:17, fontWeight:800, color:t.ink, fontFamily:'JetBrains Mono', lineHeight:1}}>{(o.bid/1_000_000).toFixed(1).replace('.', ',')} Mio. €</SerifH>
                  {o.delta && <div style={{fontSize:10, color:t.ok, fontWeight:700, marginTop:2, fontFamily:'JetBrains Mono'}}>{o.delta}</div>}
                </div>
              </div>

              {/* Stage tracker */}
              <NegStages theme={theme} scheme={scheme} stage={o.stage} status={o.status}/>

              <div style={{display:'flex', gap:6, marginTop:10}}>
                {o.status==='abgelehnt' ? (
                  <button style={{flex:1, height:38, borderRadius:9, background:t.bg, border:`1px solid ${t.rule}`, fontSize:12, fontWeight:700, color:t.inkMute, fontFamily:'inherit'}}>Archivieren</button>
                ) : (
                  <>
                    <button style={{flex:1, height:38, borderRadius:9, background:t.bg, border:`1px solid ${t.rule}`, fontSize:12, fontWeight:700, color:t.danger, fontFamily:'inherit'}}>Ablehnen</button>
                    <button style={{flex:1, height:38, borderRadius:9, background:t.bg, border:`1px solid ${t.rule}`, fontSize:12, fontWeight:700, color:t.ink, fontFamily:'inherit'}}>Kontern</button>
                    <button style={{flex:1.4, height:38, borderRadius:9, background:t.accent, color:'#fff', border:'none', fontSize:12, fontWeight:800, fontFamily:'inherit'}}>{tab==='eingehend'?'Annehmen':'Aufstocken'}</button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {/* Make new offer */}
        <button style={{
          width:'100%', background:'transparent', border:`1.5px dashed ${t.rule}`, borderRadius:14,
          padding:'16px 14px', color:t.inkMute, fontFamily:'inherit', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontSize:13, fontWeight:700, marginTop:6
        }}>
          <I.Plus size={16} color={t.inkMute}/> Neues Angebot ausarbeiten
        </button>
      </div>
    </div>
  );
}
function NegStages({theme, scheme, stage, status}){
  const t = THEMES[theme][scheme];
  const stages = ['Erstangebot','2. Runde','Endgespräch','Unterschrift'];
  const idx = status==='abgelehnt' ? -1
            : status==='neu'        ? 0
            : status==='verhandeln' ? 1
            : status==='angeboten'  ? 0
            : 2;
  return (
    <div style={{marginTop:10}}>
      <div style={{display:'flex', alignItems:'center', gap:4}}>
        {stages.map((s,i)=>{
          const done = i <= idx && status!=='abgelehnt';
          const failed = status==='abgelehnt';
          return (
            <React.Fragment key={s}>
              <div style={{
                flex:1, padding:'5px 4px', textAlign:'center',
                fontSize:9, fontWeight:800, letterSpacing:.4, borderRadius:5,
                background: failed ? '#f6dcd533' : done ? t.accent+'22' : t.bgInk,
                color: failed ? t.danger : done ? t.accent : t.inkSoft,
                border: `1px solid ${failed ? t.danger+'33' : done ? t.accent+'55' : 'transparent'}`
              }}>{s.toUpperCase()}</div>
              {i < stages.length-1 && <div style={{width:6, height:1, background: done?t.accent:t.rule}}/>}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// =================================================================
// 31. LIGA-TABELLE
// =================================================================
function ScreenLeagueTable({theme, scheme}){
  const t = THEMES[theme][scheme];
  const tr = useT();
  const isDe = getLocale() === 'de';
  const TABLE = [
    { r:1, n:'Riverdale Athletic',  sp:32, w:22, d:6, l:4, gf:68, ga:24, pts:72, form:'SSSUS', own:false, crest:{shape:'roundel', a:'#7a1a1a', b:'#f0e8d8', charge:'lion'} },
    { r:2, n:'FC Hafenstadt',       sp:32, w:18, d:8, l:6, gf:58, ga:34, pts:62, form:'SSNSU', own:true,  crest:{shape:'heater',  a:'#0e3a5f', b:'#c8a45a', charge:'ship'} },
    { r:3, n:'AC Valguarda',        sp:32, w:17, d:7, l:8, gf:52, ga:36, pts:58, form:'SUSUN', own:false, crest:{shape:'gonfalon',a:'#7a1a1a', b:'#f0e8d8', charge:'lion'} },
    { r:4, n:'Northbridge City',    sp:32, w:16, d:6, l:10, gf:48, ga:36, pts:54, form:'SUNSU', own:false, crest:{shape:'roundel', a:'#262626', b:'#c97a2a', charge:'tower'} },
    { r:5, n:'Sporting Kaltenbach', sp:32, w:14, d:9, l:9, gf:46, ga:40, pts:51, form:'UUSSN', own:false, crest:{shape:'gonfalon',a:'#4a2a2a', b:'#d8c8a8', charge:'sword'} },
    { r:6, n:'Olympique Sauveterre',sp:32, w:13, d:8, l:11, gf:42, ga:44, pts:47, form:'SNNSU', own:false, crest:{shape:'iberian', a:'#1f4a3a', b:'#e8d28a', charge:'eagle'} },
    { r:7, n:'SV Auerbach 02',      sp:32, w:11, d:11, l:10, gf:40, ga:38, pts:44, form:'UUUSU', own:false, crest:{shape:'iberian', a:'#2b6b3f', b:'#f4e4b8', charge:'wave'} },
    { r:8, n:'Oakport United FC',   sp:32, w:11, d:7, l:14, gf:38, ga:42, pts:40, form:'NUSNS', own:false, crest:{shape:'heater', a:'#262626', b:'#c97a2a', charge:'cog'} },
    { r:9, n:'Westhampton Rovers',  sp:32, w:10, d:8, l:14, gf:34, ga:44, pts:38, form:'NNSSN', own:false, crest:{shape:'heater', a:'#5a5a5a', b:'#f0e8d8', charge:'cross'} },
    { r:10,n:'Aurelia City',        sp:32, w:9,  d:9, l:14, gf:32, ga:46, pts:36, form:'NUNUS', own:false, crest:{shape:'roundel', a:'#1f4a6a', b:'#f0e8d8', charge:'star'} },
    { r:11,n:'St. Albrecht',        sp:32, w:9,  d:8, l:15, gf:30, ga:48, pts:35, form:'NSNNN', own:false, crest:{shape:'gonfalon', a:'#262626', b:'#d8c8a8', charge:'cross'} },
    { r:12,n:'FC Brookhaven',       sp:32, w:8,  d:5, l:19, gf:26, ga:62, pts:29, form:'NNNUN', own:false, crest:{shape:'heater', a:'#7a1a1a', b:'#f0e8d8', charge:'tower'} },
  ];
  const zoneFor = (r) => r<=2 ? {l:'CT', c:t.accent, t:'Continental Trophy'}
                       : r<=4 ? {l:'CC', c:t.warn,   t:'Confederation Cup'}
                       : r>=11? {l:'AB', c:t.danger, t:'Abstieg'}
                       : null;
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <ScreenHeader theme={theme} scheme={scheme}
        kicker={isDe ? 'Saison 2026/27 · 32. Spieltag' : 'Season 2026/27 · Matchday 32'} title="Aurelia Premier"
        right={
          <button style={{height:34, padding:'0 10px', borderRadius:9, background:t.card, border:`1px solid ${t.rule}`, color:t.ink, fontWeight:700, fontSize:11, fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:4}}>Heim/Ausw. <I.ChevronDown size={12} color={t.ink}/></button>
        }/>

      {/* Legend chips */}
      <div style={{padding:'4px 16px 8px', display:'flex', gap:6, flexWrap:'wrap'}}>
        {[
          {l:'Continental Trophy', c:t.accent},
          {l:'Confederation Cup',  c:t.warn},
          {l:'Abstiegszone',       c:t.danger},
        ].map(z=>(
          <span key={z.l} style={{display:'inline-flex', alignItems:'center', gap:4, padding:'3px 8px', borderRadius:99, background:z.c+'18', fontSize:10, fontWeight:700, color:z.c}}>
            <span style={{width:6, height:6, borderRadius:99, background:z.c}}/>{z.l}
          </span>
        ))}
      </div>

      {/* Table header */}
      <div style={{padding:'0 12px'}}>
        <div style={{display:'grid', gridTemplateColumns:'20px 20px 1fr 22px 22px 30px 44px 28px', gap:4, fontSize:9.5, color:t.inkMute, fontWeight:700, letterSpacing:.3, padding:'6px 6px'}}>
          <span></span>
          <span>#</span>
          <span>Klub</span>
          <span style={{textAlign:'right'}}>S</span>
          <span style={{textAlign:'right'}}>U</span>
          <span style={{textAlign:'right'}}>Tore</span>
          <span style={{textAlign:'right'}}>Form</span>
          <span style={{textAlign:'right'}}>Pkt</span>
        </div>
      </div>

      <div style={{flex:1, overflowY:'auto', padding:'0 12px 20px'}}>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, overflow:'hidden'}}>
          {TABLE.map((r,i)=>{
            const z = zoneFor(r.r);
            return (
              <div key={r.r} style={{
                display:'grid', gridTemplateColumns:'20px 20px 1fr 22px 22px 30px 44px 28px',
                gap:4, alignItems:'center', padding:'8px 6px',
                background: r.own ? t.accentSoft : 'transparent',
                borderBottom: i<TABLE.length-1?`1px solid ${t.rule}`:'none',
                position:'relative'
              }}>
                {z && <span style={{position:'absolute', left:0, top:0, bottom:0, width:3, background:z.c}}/>}
                {/* Kit-color bar at the right edge — split horizontally into two halves with club's tinctures */}
                <div title="Klubfarben" aria-hidden="true" style={{
                  position:'absolute', right:0, top:6, bottom:6, width:4, borderRadius:1.5,
                  overflow:'hidden', display:'flex', flexDirection:'column',
                }}>
                  <div style={{flex:1, background:r.crest.a}}/>
                  <div style={{flex:1, background:r.crest.b}}/>
                </div>
                <Crest {...r.crest} size={18}/>
                <span style={{fontFamily:'JetBrains Mono', fontSize:12, fontWeight:800, color: r.own?t.accent:t.ink, fontVariantNumeric:'tabular-nums'}}>{r.r}</span>
                <div style={{display:'flex', flexDirection:'column', minWidth:0}}>
                  <SerifH theme={theme} style={{fontSize:12.5, fontWeight: r.own?800:700, color: r.own?t.accent:t.ink, lineHeight:1.1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{r.n}</SerifH>
                  {r.own && <span style={{fontSize:9, color:t.accent, fontWeight:700, marginTop:1}}>— Sie</span>}
                </div>
                <span style={{fontFamily:'JetBrains Mono', fontSize:11, color:t.ok, fontWeight:700, textAlign:'right'}}>{r.w}</span>
                <span style={{fontFamily:'JetBrains Mono', fontSize:11, color:t.warn, fontWeight:700, textAlign:'right'}}>{r.d}</span>
                <span style={{fontFamily:'JetBrains Mono', fontSize:11, color:t.inkMute, textAlign:'right'}}>{r.gf}:{r.ga}</span>
                <div style={{display:'flex', justifyContent:'flex-end'}}>
                  <FormStripMini form={r.form} theme={theme} scheme={scheme}/>
                </div>
                <span style={{fontFamily:'JetBrains Mono', fontSize:14, fontWeight:800, color: r.own?t.accent:t.ink, textAlign:'right'}}>{r.pts}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
function FormStripMini({form, theme, scheme}){
  const t = THEMES[theme][scheme];
  return (
    <div style={{display:'flex', gap:1.5}}>
      {form.split('').map((c,i)=>{
        const col = c==='S' ? t.ok : c==='N' ? t.danger : t.warn;
        return <div key={i} style={{width:8, height:14, borderRadius:1, background:col, color:'#fff', fontFamily:'JetBrains Mono', fontWeight:800, fontSize:8, display:'grid', placeItems:'center'}}>{c}</div>;
      })}
    </div>
  );
}

// =================================================================
// 32. POKALBAUM — Confederation Cup
// =================================================================
function ScreenCupBracket({theme, scheme}){
  const t = THEMES[theme][scheme];
  const tr = useT();
  const isDe = getLocale() === 'de';
  // 4 rounds: Achtelfinale (8 -> 4), Viertel (4 -> 2), Halb (2 -> 1), Final
  // Show last 3 rounds for clarity on mobile (Viertel/Halb/Final + Sieger node)
  // Each tie is one-leg for visualization simplicity.
  const QF = [
    { h:'FC Hafenstadt',   a:'AC Valguarda',       hs:2, as:0, own:'h', date:'28. Mai', live:true },
    { h:'Riverdale Athletic', a:'Olympique Sauveterre', hs:1, as:1, pen:'4:3', own:null,  date:'29. Mai' },
    { h:'Northbridge City',a:'Oakport United FC', hs:3, as:1, own:null,    date:'29. Mai' },
    { h:'St. Albrecht',    a:'Sporting Kaltenbach',hs:0, as:2, own:null,    date:'30. Mai' },
  ];
  const SF = [
    { h:'FC Hafenstadt',     a:'Riverdale Athletic', hs:null, as:null, own:'h', date:'10. Jun' },
    { h:'Northbridge City',  a:'Sporting Kaltenbach',hs:null, as:null, own:null, date:'11. Jun' },
  ];
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <ScreenHeader theme={theme} scheme={scheme}
        kicker={isDe ? 'Confederation Cup · 2026/27' : 'Confederation Cup · 2026/27'} title={isDe ? 'Pokalbaum' : 'Cup bracket'}
        right={<I.Trophy size={28} color={t.accent}/>}/>

      <div style={{flex:1, overflowY:'auto', padding:'4px 12px 20px'}}>
        {/* Viertelfinale */}
        <RoundLabel theme={theme} scheme={scheme} l="Viertelfinale" date="28.–30. Mai"/>
        {QF.map((m,i)=> <BracketMatch key={i} m={m} theme={theme} scheme={scheme}/>)}

        {/* Halbfinale */}
        <RoundLabel theme={theme} scheme={scheme} l="Halbfinale" date="10.–11. Juni"/>
        {SF.map((m,i)=> <BracketMatch key={i} m={m} theme={theme} scheme={scheme} dim/>)}

        {/* Final */}
        <RoundLabel theme={theme} scheme={scheme} l="Finale" date="24. Juni · Hafenstadt-Arena"/>
        <div style={{background:t.card, border:`1px solid ${t.accent}`, borderRadius:14, padding:'14px 14px', textAlign:'center'}}>
          <SerifH theme={theme} style={{display:'block', fontSize:14, fontWeight:700, color:t.accent}}>Wer steht im Endspiel?</SerifH>
          <div style={{fontSize:11, color:t.inkMute, marginTop:4, fontFamily:THEMES[theme].font, fontStyle:'italic'}}>noch zwei Halbfinals zu spielen</div>
          <I.Trophy size={36} color={t.accent} style={{marginTop:8}}/>
        </div>

        {/* Tournament tree visualization */}
        <div style={{marginTop:14, background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'10px 8px'}}>
          <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', marginBottom:8, padding:'0 6px'}}>Übersicht</div>
          <BracketTree theme={theme} scheme={scheme}/>
        </div>
      </div>
    </div>
  );
}
function RoundLabel({theme, scheme, l, date}){
  const t = THEMES[theme][scheme];
  return (
    <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', margin:'12px 4px 6px'}}>
      <span style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>{l}</span>
      <span style={{fontSize:10, color:t.inkSoft, fontWeight:600}}>{date}</span>
    </div>
  );
}
function BracketMatch({m, theme, scheme, dim}){
  const t = THEMES[theme][scheme];
  const played = m.hs!==null;
  const own = m.own;
  const winner = played ? (m.hs > m.as ? 'h' : m.hs < m.as ? 'a' : (m.pen && m.pen.split(':')[0]>m.pen.split(':')[1] ? 'h' : 'a')) : null;
  return (
    <div style={{background:t.card, border: `1px solid ${own ? t.accent : t.rule}`, borderRadius:12, padding:'8px 10px', marginBottom:6, opacity:dim?.85:1}}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4}}>
        <span style={{fontSize:10, color:t.inkSoft, fontWeight:600}}>{m.date}</span>
        {m.live && <span style={{display:'inline-flex', alignItems:'center', gap:4, fontSize:9, fontWeight:800, color:t.accent, letterSpacing:.5}}><span style={{width:6, height:6, borderRadius:99, background:t.accent}}/>LIVE</span>}
        {m.pen && <span style={{fontSize:9, fontWeight:700, color:t.warn}}>n.E.</span>}
      </div>
      {[
        {name:m.h, score:m.hs, mine: own==='h', winner: winner==='h'},
        {name:m.a, score:m.as, mine: own==='a', winner: winner==='a'},
      ].map((side, i) => (
        <div key={i} style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'4px 0'}}>
          <span style={{
            fontSize:12.5,
            fontWeight: side.mine ? 800 : side.winner ? 700 : 500,
            color: side.mine ? t.accent : side.winner ? t.ink : t.inkMute,
            display:'inline-flex', alignItems:'center', gap:6,
          }}>
            {side.winner && <I.Check size={12} color={t.ok}/>}
            {side.name}
          </span>
          <span style={{fontFamily:'JetBrains Mono', fontSize:14, fontWeight:800, color: side.score==null ? t.inkSoft : side.winner ? t.ink : t.inkMute}}>
            {side.score==null ? '—' : side.score}
          </span>
        </div>
      ))}
      {m.pen && <div style={{fontSize:10, color:t.warn, fontWeight:700, textAlign:'right', fontFamily:'JetBrains Mono'}}>Elfm. {m.pen}</div>}
    </div>
  );
}
function BracketTree({theme, scheme}){
  const t = THEMES[theme][scheme];
  // Mini horizontal bracket from QF to Final
  return (
    <svg viewBox="0 0 320 220" style={{width:'100%', display:'block'}}>
      {/* Round labels */}
      <g fontFamily="Inter" fontSize="7" fontWeight="800" fill={t.inkMute} letterSpacing=".3">
        <text x="36" y="14" textAnchor="middle">VIERTELFINALE</text>
        <text x="140" y="14" textAnchor="middle">HALBFINALE</text>
        <text x="240" y="14" textAnchor="middle">FINALE</text>
        <text x="304" y="14" textAnchor="middle">SIEGER</text>
      </g>
      {/* QF boxes */}
      {[{y:30, name:'Hafenstadt', mine:true, won:true},{y:55,name:'Valguarda'},
        {y:85, name:'Riverdale', won:true},{y:110,name:'Sauveterre'},
        {y:140,name:'Northbridge', won:true},{y:165,name:'Oakport'},
        {y:195,name:'Sporting K.', won:true},{y:220,name:'St. Albrecht'},
      ].map((b,i)=>(
        <g key={i}>
          <rect x="6" y={b.y-5} width="60" height="11" rx="2" fill={b.mine?t.accentSoft:t.bgInk} stroke={b.mine?t.accent:t.rule} strokeWidth=".5"/>
          <text x="36" y={b.y+2} textAnchor="middle" fontSize="6.5" fontWeight={b.won?800:600} fill={b.mine?t.accent:b.won?t.ink:t.inkMute} fontFamily="Inter">{b.name}</text>
        </g>
      ))}
      {/* SF boxes */}
      {[{y:42, name:'Hafenstadt', mine:true},{y:97,name:'Riverdale'},
        {y:152,name:'Northbridge'},{y:207,name:'Sporting K.'},
      ].map((b,i)=>(
        <g key={i}>
          <rect x="110" y={b.y-5} width="60" height="11" rx="2" fill={b.mine?t.accentSoft:t.bgInk} stroke={b.mine?t.accent:t.rule} strokeWidth=".5"/>
          <text x="140" y={b.y+2} textAnchor="middle" fontSize="6.5" fontWeight="700" fill={b.mine?t.accent:t.ink} fontFamily="Inter">{b.name}</text>
        </g>
      ))}
      {/* Final boxes */}
      {[{y:70, name:'?'},{y:180, name:'?'}].map((b,i)=>(
        <g key={i}>
          <rect x="214" y={b.y-5} width="56" height="11" rx="2" fill={t.bgInk} stroke={t.rule} strokeWidth=".5" strokeDasharray="1.5 1.5"/>
          <text x="242" y={b.y+2} textAnchor="middle" fontSize="6.5" fontWeight="700" fill={t.inkSoft} fontFamily="Inter">{b.name}</text>
        </g>
      ))}
      {/* Cup */}
      <g transform="translate(282, 110)">
        <path d="M0 0 L20 0 L18 12 Q10 16 2 12 Z" fill={t.accent}/>
        <path d="M4 12 L4 20 L16 20 L16 12" fill={t.accent}/>
        <rect x="2" y="20" width="16" height="3" fill={t.accent}/>
      </g>
      {/* Connectors */}
      <g stroke={t.rule} strokeWidth=".6" fill="none">
        <path d="M66 30 H88 V42 H110"/><path d="M66 55 H88 V42"/>
        <path d="M66 85 H88 V97 H110"/><path d="M66 110 H88 V97"/>
        <path d="M66 140 H88 V152 H110"/><path d="M66 165 H88 V152"/>
        <path d="M66 195 H88 V207 H110"/><path d="M66 220 H88 V207"/>
        <path d="M170 42 H192 V70 H214"/><path d="M170 97 H192 V70"/>
        <path d="M170 152 H192 V180 H214"/><path d="M170 207 H192 V180"/>
      </g>
    </svg>
  );
}

// =================================================================
// 33. 2D TICKER
// =================================================================
function ScreenTicker({theme, scheme}){
  const t = THEMES[theme][scheme];
  const tr = useT();
  const isDe = getLocale() === 'de';
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%', position:'relative'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <EngineMockStamp corner="tr" size="sm"/>
      {/* Score header (re-use look from feed) */}
      <header style={{background:t.card, borderBottom:`1px solid ${t.rule}`, padding:'8px 14px 10px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <button style={{width:36,height:36,borderRadius:10,background:t.bgInk,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.ChevronLeft color={t.ink} size={18}/></button>
          <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.4, textAlign:'center', textTransform:'uppercase'}}>Aurelia Premier · 32. ST.</div>
          <button style={{width:36,height:36,borderRadius:10,background:t.bgInk,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center', fontFamily:'JetBrains Mono', fontWeight:700, fontSize:12, color:t.ink}}>2×</button>
        </div>
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:14, marginTop:6}}>
          <Crest {...crestFor('Northbridge City')} size={28}/>
          <SerifH theme={theme} style={{fontSize:14, fontWeight:700, color:t.ink}}>Northbridge</SerifH>
          <SerifH theme={theme} style={{fontSize:38, fontWeight:800, color:t.ink, fontFamily:THEMES[theme].font, letterSpacing:-1, lineHeight:1}}>1<span style={{color:t.inkSoft}}>:</span><span style={{color:t.accent}}>2</span></SerifH>
          <SerifH theme={theme} style={{fontSize:14, fontWeight:700, color:t.ink}}>Hafenstadt</SerifH>
          <Crest {...crestFor('FC Hafenstadt')} size={28}/>
        </div>
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginTop:6}}>
          <span style={{fontFamily:'JetBrains Mono', fontSize:11, fontWeight:700, color:t.accent}}>● 82'</span>
          <span style={{fontSize:11, color:t.inkMute}}>Ballbesitz · 58 %</span>
        </div>
        {/* Tabs */}
        <div style={{display:'flex', marginTop:8, background:t.bgInk, borderRadius:10, padding:3}}>
          {[{l:'Reportage'},{l:'2D-Ticker', a:true},{l:'Aufstellung'}].map(c=>(
            <span key={c.l} style={{flex:1, textAlign:'center', padding:'7px 0', borderRadius:8, fontSize:11, fontWeight:700,
              background:c.a?t.card:'transparent', color:c.a?t.ink:t.inkMute,
              boxShadow:c.a?`0 1px 0 ${t.rule}`:'none'}}>{c.l}</span>
          ))}
        </div>
      </header>

      {/* 2D Pitch with action markers */}
      <div style={{padding:'12px 14px 6px'}}>
        <Pitch2D theme={theme} scheme={scheme}/>
      </div>

      {/* Heatmap of activity & stat strips */}
      <div style={{padding:'4px 14px 0'}}>
        <div style={{display:'flex', gap:6, alignItems:'center', justifyContent:'space-between', padding:'6px 10px', background:t.card, border:`1px solid ${t.rule}`, borderRadius:10}}>
          <span style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.4, textTransform:'uppercase'}}>Letzte Aktion</span>
          <span style={{fontSize:11.5, fontFamily:THEMES[theme].font, fontStyle:'italic', color:t.accent, fontWeight:700}}>82' · TOR Brody · Volley</span>
        </div>
      </div>

      <div style={{flex:1, overflowY:'auto', padding:'10px 14px 90px'}}>
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', marginBottom:6}}>Statistiken · live</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'8px 14px'}}>
          <StatBar theme={theme} scheme={scheme} l="Ballbesitz"     a={42} b={58}/>
          <StatBar theme={theme} scheme={scheme} l="Schüsse"        a={9}  b={14} mode="count"/>
          <StatBar theme={theme} scheme={scheme} l="Aufs Tor"        a={3}  b={6}  mode="count"/>
          <StatBar theme={theme} scheme={scheme} l="Ecken"           a={4}  b={7}  mode="count"/>
          <StatBar theme={theme} scheme={scheme} l="Fouls"           a={11} b={8}  mode="count"/>
          <StatBar theme={theme} scheme={scheme} l="xG"              a={1.2} b={2.1} mode="xg" last/>
        </div>
      </div>

      {/* Bottom controls */}
      <div style={{position:'absolute',left:0,right:0,bottom:0,padding:'10px 14px 22px',background:`linear-gradient(to top, ${t.bg} 80%, transparent)`,display:'flex',gap:8}}>
        <button style={{flex:1, height:48, borderRadius:14, background:t.card, border:`1px solid ${t.rule}`, color:t.ink, fontWeight:700, fontSize:13, fontFamily:'inherit'}}>Pause</button>
        <button style={{flex:1, height:48, borderRadius:14, background:t.card, border:`1px solid ${t.rule}`, color:t.ink, fontWeight:700, fontSize:13, fontFamily:'inherit'}}>Wechsel</button>
        <button style={{flex:2, height:48, borderRadius:14, background:t.ink, color:t.bg, border:'none', fontWeight:800, fontSize:14, fontFamily:'inherit'}}>Tempo ❯❯ 2×</button>
      </div>
    </div>
  );
}
function Pitch2D({theme, scheme}){
  const t = THEMES[theme][scheme];
  return (
    <svg viewBox="0 0 360 220" style={{width:'100%', display:'block', borderRadius:10, background:t.ok, boxShadow:`inset 0 0 0 1px ${t.ink}30`}}>
      <defs>
        <linearGradient id="tk-grass" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={t.ok} stopOpacity=".95"/>
          <stop offset="1" stopColor={t.ok} stopOpacity=".75"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="360" height="220" fill="url(#tk-grass)"/>
      {/* stripes */}
      {Array.from({length:10}).map((_,i)=>(<rect key={i} x="0" y={i*22} width="360" height="11" fill="#fff" opacity={i%2?.07:0}/>))}
      {/* lines */}
      <g fill="none" stroke="#fff" strokeWidth="1.2" opacity=".8">
        <rect x="10" y="10" width="340" height="200" rx="2"/>
        <line x1="180" y1="10" x2="180" y2="210"/>
        <circle cx="180" cy="110" r="26"/>
        <rect x="10" y="62" width="46" height="96"/>
        <rect x="10" y="84" width="20" height="52"/>
        <rect x="304" y="62" width="46" height="96"/>
        <rect x="330" y="84" width="20" height="52"/>
        <circle cx="34" cy="110" r="1.5" fill="#fff"/>
        <circle cx="326" cy="110" r="1.5" fill="#fff"/>
        <circle cx="180" cy="110" r="1.5" fill="#fff"/>
      </g>
      {/* Players — classic 2D-match dots (Anstoss / FM 2D engine style).
          Solid circle in primary jersey colour, thin ring in secondary, shirt number
          in a contrast tone. GK swaps colours + amber stroke so it pops on the pitch. */}
      <g>
        {(() => {
          const nbcCrest = crestFor('Northbridge City');
          const fchCrest = crestFor('FC Hafenstadt');
          const NBC = [
            {x:30, y:110, n:'1', gk:true},
            {x:60, y:60, n:'2'},{x:60, y:90, n:'4'},
            {x:60, y:130, n:'5'},{x:60, y:160, n:'3'},
            {x:110, y:80, n:'6'},{x:110, y:140, n:'8'},
            {x:140, y:110, n:'10'},
            {x:170, y:70, n:'7'},{x:175, y:150, n:'11'},
            {x:185, y:110, n:'9'},
          ];
          const FCH = [
            {x:330, y:110, n:'1', gk:true},
            {x:300, y:60, n:'18'},{x:300, y:90, n:'5'},
            {x:300, y:130, n:'4'},{x:300, y:160, n:'22'},
            {x:250, y:80, n:'6'},{x:250, y:130, n:'14'},
            {x:230, y:110, n:'8'},
            {x:200, y:65, n:'10', highlight:true},
            {x:210, y:155, n:'11'},
            {x:195, y:108, n:'9'},
          ];
          const R = 8.5;                     // dot radius
          const lum = (hex) => {
            const r = parseInt(hex.slice(1,3),16),
                  g = parseInt(hex.slice(3,5),16),
                  b = parseInt(hex.slice(5,7),16);
            return (0.299*r + 0.587*g + 0.114*b)/255;
          };
          const renderDot = (p, crest, side) => {
            // GK inverts the kit so they read as a different player
            const fill   = p.gk ? crest.b : crest.a;
            const stroke = p.gk ? crest.a : crest.b;
            const numColor = lum(fill) > 0.55 ? '#11100e' : '#ffffff';
            return (
              <g key={`${side}-${p.n}`} transform={`translate(${p.x} ${p.y})`}>
                {/* drop shadow */}
                <ellipse cx="0" cy={R*0.95} rx={R*0.85} ry={R*0.28} fill="#000" opacity=".22"/>
                {/* highlight halo for the spotlight player */}
                {p.highlight && (
                  <circle r={R+3.5} fill="none" stroke={t.accent} strokeWidth="1.6" opacity=".95">
                    <animate attributeName="r" values={`${R+2};${R+4.5};${R+2}`} dur="1.6s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values=".95;.45;.95" dur="1.6s" repeatCount="indefinite"/>
                  </circle>
                )}
                {/* white separator so the dot lifts off the grass */}
                <circle r={R+1} fill="#ffffff" opacity=".9"/>
                {/* main dot */}
                <circle r={R} fill={fill} stroke={p.gk ? '#f5c84b' : stroke} strokeWidth={p.gk ? 1.6 : 1.2}/>
                {/* shirt number */}
                <text x="0" y="0.5" textAnchor="middle" dominantBaseline="central"
                      fontFamily="JetBrains Mono, monospace" fontWeight="800"
                      fontSize={p.n.length > 1 ? 8.2 : 9.4}
                      fill={numColor} style={{letterSpacing:-0.4}}>{p.n}</text>
              </g>
            );
          };
          return (
            <>
              {NBC.map(p => renderDot(p, nbcCrest, 'nbc'))}
              {FCH.map(p => renderDot(p, fchCrest, 'fch'))}
            </>
          );
        })()}
        {/* Ball + recent action arrow */}
        <g>
          <path d="M210 80 Q160 80 60 105" fill="none" stroke={t.accent} strokeWidth="1.6" strokeDasharray="3 2" opacity=".8"/>
          <circle cx="50" cy="106" r="3.5" fill="#fff" stroke={t.ink} strokeWidth=".8"/>
          {/* shot star marker at #10's foot */}
          <g transform="translate(200, 65)">
            <polygon points="0,-5 1.5,-1.5 5,0 1.5,1.5 0,5 -1.5,1.5 -5,0 -1.5,-1.5" fill={t.accent}/>
          </g>
        </g>
      </g>
      {/* North label */}
      <text x="10" y="218" fontSize="8" fontWeight="700" fill="#fff" fontFamily="Inter" opacity=".7">NORD</text>
      <text x="346" y="218" textAnchor="end" fontSize="8" fontWeight="700" fill="#fff" fontFamily="Inter" opacity=".7">SÜD</text>
    </svg>
  );
}
function StatBar({l, a, b, theme, scheme, mode='pct', last}){
  const t = THEMES[theme][scheme];
  const fmt = mode==='xg' ? (v)=>v.toString().replace('.', ',') : (v)=>v;
  let aw, bw;
  if (mode === 'pct') { aw = a; bw = b; }
  else { const total = a + b || 1; aw = (a/total)*100; bw = (b/total)*100; }
  return (
    <div style={{padding:'8px 0', borderBottom: last?'none':`1px solid ${t.rule}`}}>
      <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:5}}>
        <span style={{fontFamily:'JetBrains Mono', fontSize:13, fontWeight:800, color: a>b?t.accent:t.ink, width:40, textAlign:'right'}}>{fmt(a)}</span>
        <span style={{flex:1, textAlign:'center', fontSize:10.5, color:t.inkMute, textTransform:'uppercase', letterSpacing:.5, fontWeight:700}}>{l}</span>
        <span style={{fontFamily:'JetBrains Mono', fontSize:13, fontWeight:800, color: b>a?t.accent:t.ink, width:40}}>{fmt(b)}</span>
      </div>
      <div style={{display:'flex', alignItems:'center', gap:4}}>
        <div style={{flex:1, height:5, background:t.bgInk, borderRadius:99, overflow:'hidden', display:'flex', justifyContent:'flex-end'}}>
          <div style={{width:aw+'%', height:'100%', background: a>=b?t.accent:t.inkMute}}/>
        </div>
        <div style={{flex:1, height:5, background:t.bgInk, borderRadius:99, overflow:'hidden'}}>
          <div style={{width:bw+'%', height:'100%', background: b>=a?t.accent:t.inkMute}}/>
        </div>
      </div>
    </div>
  );
}

// =================================================================
// 34. LINEUP MIT ROLLEN-CHIPS
// =================================================================
function ScreenLineupRoles({theme, scheme}){
  const t = THEMES[theme][scheme];
  const tr = useT();
  const isDe = getLocale() === 'de';
  // Same lineup but each player has a role chip
  const players = [
    { shirt:1,  name:'Wendling', pos:'TW', role:'Klassisch',     str:7, x:50, y:128 },
    { shirt:18, name:'Bredow',   pos:'AV', role:'Offensiv',      str:6, x:18, y:102 },
    { shirt:4,  name:'Carrara',  pos:'IV', role:'Ballspielend',  str:8, x:38, y:106 },
    { shirt:5,  name:'Manso',    pos:'IV', role:'Kompromisslos', str:7, x:62, y:106 },
    { shirt:22, name:'Furukawa', pos:'AV', role:'Inverse',       str:7, x:82, y:102 },
    { shirt:6,  name:'Holtmann', pos:'DM', role:'Abräumer',      str:7, x:30, y:78 },
    { shirt:8,  name:'Reiter',   pos:'ZM', role:'Regista',       str:8, x:50, y:74 },
    { shirt:14, name:'Velten',   pos:'ZM', role:'Box-to-Box',    str:6, x:70, y:78 },
    { shirt:10, name:'Brody',    pos:'OM', role:'Spielmacher',   str:8, x:24, y:46, hi:true },
    { shirt:9,  name:'Wieser',   pos:'ST', role:'Schattenstür­mer', str:7, x:50, y:34 },
    { shirt:11, name:'Kalt',     pos:'ST', role:'Wandspieler',   str:7, x:76, y:46 },
  ];
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%', position:'relative'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <ScreenHeader theme={theme} scheme={scheme}
        kicker={isDe ? 'Aufstellung mit Rollen · 4-3-3' : 'Line-up with roles · 4-3-3'} title={isDe ? 'Mannschaft' : 'Squad'}
        right={
          <span style={{fontSize:10, fontWeight:800, letterSpacing:.6, color:t.accent, padding:'4px 9px', borderRadius:99, background:t.accentSoft}}>{isDe ? 'EIGNUNG Ø 84 %' : 'FIT Ø 84 %'}</span>
        }/>

      {/* Pitch */}
      <div style={{padding:'8px 14px 0', position:'relative'}}>
        <div style={{position:'relative'}}>
          <svg viewBox="0 0 100 140" style={{width:'100%', display:'block'}}>
            <rect x="2" y="2" width="96" height="136" rx="3" fill={t.ok} opacity=".55" stroke={t.ink} strokeWidth=".5"/>
            {Array.from({length:8}).map((_,i)=>(<rect key={i} x="2" y={2+i*17} width="96" height="8.5" fill="#fff" opacity={i%2?.07:0}/>))}
            <line x1="2" y1="70" x2="98" y2="70" stroke="#fff" strokeWidth=".5" opacity=".6"/>
            <circle cx="50" cy="70" r="9" fill="none" stroke="#fff" strokeWidth=".5" opacity=".6"/>
          </svg>
          {players.map((p,i)=>{
            const ownKit = kitFor('FC Hafenstadt');
            const ownCrest = crestFor('FC Hafenstadt');
            return (
              <div key={i} style={{
                position:'absolute',
                left:`calc(${p.x}% - 30px)`,
                top:`calc(${(p.y/140)*100}% - 30px)`,
                width:60, height:60, display:'flex', flexDirection:'column', alignItems:'center'
              }}>
                <PlayerToken kit={ownKit} a={ownCrest.a} b={ownCrest.b}
                             shirt={p.shirt} size={32}
                             highlight={p.hi} accent={t.accent}/>
                <div style={{
                  fontSize:9, fontWeight:700, color:t.ink, lineHeight:1, marginTop:3,
                  background:t.bg, padding:'1px 3px', borderRadius:3, whiteSpace:'nowrap',
                  overflow:'hidden', textOverflow:'ellipsis', maxWidth:54
                }}>{p.name}</div>
                <div style={{
                  fontSize:8, color: p.hi?t.accent:t.accent, fontWeight:800,
                  background:t.accentSoft, padding:'1px 4px', borderRadius:3, marginTop:1,
                  whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:62
                }}>{p.role}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Role list */}
      <div style={{flex:1, overflowY:'auto', padding:'12px 16px 16px'}}>
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', marginBottom:6}}>Rollenverteilung</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'4px 12px'}}>
          {players.map((p,i)=>(
            <div key={i} style={{display:'flex', alignItems:'center', gap:8, padding:'7px 0', borderBottom: i<players.length-1?`1px solid ${t.rule}`:'none'}}>
              <div style={{width:24, height:24, borderRadius:6, background:t.bgInk, color:t.ink, display:'grid', placeItems:'center', fontFamily:'JetBrains Mono', fontWeight:700, fontSize:11}}>{p.shirt}</div>
              <PosPill pos={p.pos} theme={theme} scheme={scheme}/>
              <span style={{flex:1, fontSize:12.5, fontWeight:700, color:t.ink, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{p.name}</span>
              <span style={{fontSize:11, fontWeight:700, color:t.accent, fontFamily:THEMES[theme].font, fontStyle:'italic'}}>{p.role}</span>
              <I.ChevronRight size={13} color={t.inkSoft}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  CLUBS_TONE, registerClubTheme,
  ClubHub, ScreenTransfers, ScreenLeagueTable, ScreenCupBracket,
  ScreenTicker, ScreenLineupRoles,
  NegStages, BracketMatch, BracketTree, Pitch2D, StatBar, FormStripMini,
});
