// responsive.jsx — Desktop & Tablet adaptations.
// The same React primitives (PlayerCard, InboxCard, Sparkline, etc.) get
// re-laid into a 3-column "office cockpit". Wider artboards show how the
// 390-px phone designs scale up to 1024 (tablet) and 1440 (desktop).

// ---------- DESKTOP SHELL ----------
// Top bar (club identity + breadcrumb + advance) · left rail (nav) ·
// main column · right context rail.
function DesktopShell({ theme='A', scheme='light', section='hub', breadcrumb='Büro · Übersicht', clubId='hafenstadt', children, rightRail }){
  const t = THEMES[theme][scheme];
  const club = CLUB_REGISTRY[clubId] || CLUB_REGISTRY.hafenstadt;
  const NAV = [
    { id:'hub',      l:'Büro',         icon:<I.Building size={20} color="currentColor"/> },
    { id:'inbox',    l:'Posteingang',  icon:<I.Inbox size={20} color="currentColor"/>, badge:5 },
    { id:'squad',    l:'Kader',        icon:<I.Users size={20} color="currentColor"/> },
    { id:'tactics',  l:'Taktik',       icon:<I.Pitch size={20} color="currentColor"/> },
    { id:'training', l:'Training',     icon:<I.Calendar size={20} color="currentColor"/> },
    { id:'med',      l:'Medizin',      icon:<I.Bell size={20} color="currentColor"/> },
    { id:'scout',    l:'Scouting',     icon:<I.Search size={20} color="currentColor"/> },
    { id:'transfer', l:'Transferbüro', icon:<I.Send size={20} color="currentColor"/> },
    { id:'finance',  l:'Finanzen',     icon:<I.Wallet size={20} color="currentColor"/> },
    { id:'stadium',  l:'Stadion',      icon:<I.Building size={20} color="currentColor"/> },
    { id:'league',   l:'Wettbewerbe',  icon:<I.Trophy size={20} color="currentColor"/> },
    { id:'stats',    l:'Statistik',    icon:<I.TrendUp size={20} color="currentColor"/> },
    { id:'staff',    l:'Stab',         icon:<I.Users size={20} color="currentColor"/> },
    { id:'settings', l:'Einstellungen',icon:<I.Settings size={20} color="currentColor"/> },
  ];

  return (
    <div style={{
      width:'100%', height:'100%',
      background:t.bg, color:t.ink, fontFamily: THEMES[theme].ui,
      display:'grid', gridTemplateRows:'56px 1fr', overflow:'hidden'
    }}>
      <ThemeCss theme={theme} scheme={scheme}/>
      {/* TOP BAR */}
      <header style={{
        display:'grid', gridTemplateColumns:'auto 1fr auto', gap:14,
        alignItems:'center', padding:'0 18px',
        background:t.card, borderBottom:`1px solid ${t.rule}`,
        position:'relative', zIndex:5
      }}>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <Crest {...club.crest} size={32}/>
          <div style={{lineHeight:1.05}}>
            <div style={{fontSize:10.5, fontWeight:700, color:t.inkMute, letterSpacing:.6, textTransform:'uppercase'}}>{club.name}</div>
            <SerifH theme={theme} style={{fontSize:14, fontWeight:700, color:t.ink}}>Aurelia Premier · Saison 2026/27</SerifH>
          </div>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:10, justifyContent:'center'}}>
          <I.ChevronLeft size={16} color={t.inkSoft}/>
          <span style={{fontSize:12, color:t.inkMute}}>Büro</span>
          <I.ChevronRight size={12} color={t.inkSoft}/>
          <SerifH theme={theme} style={{fontSize:14, fontWeight:700, color:t.ink}}>{breadcrumb}</SerifH>
          <span style={{flex:1}}/>
          <span style={{fontSize:11, color:t.inkSoft, fontFamily:'JetBrains Mono', fontVariantNumeric:'tabular-nums'}}>Mo · 18. Mai · 09:41</span>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <button style={{
            height:36, padding:'0 16px', borderRadius:10, border:'none',
            background:t.ink, color:t.bg, fontWeight:800, fontSize:12.5,
            fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:6,
            boxShadow:`0 6px 14px -6px ${t.ink}80`
          }}>
            <span style={{fontSize:9, fontWeight:700, opacity:.75, letterSpacing:.6}}>+3 T</span>
            Weiter zum nächsten Termin
            <I.ArrowRight size={14} color={t.bg}/>
          </button>
          <div style={{width:32, height:32, borderRadius:99, background:t.accentSoft, color:t.accent, display:'grid', placeItems:'center', fontFamily:THEMES[theme].font, fontWeight:800, fontSize:13, border:`1.5px solid ${t.accent}`}}>JL</div>
        </div>
      </header>

      {/* WORK AREA */}
      <div style={{display:'grid', gridTemplateColumns:`220px 1fr ${rightRail?'340px':'0'}`, minHeight:0}}>
        {/* LEFT RAIL */}
        <nav style={{
          background:t.card, borderRight:`1px solid ${t.rule}`,
          padding:'14px 8px', overflowY:'auto',
          display:'flex', flexDirection:'column', gap:1
        }}>
          {NAV.map(n => {
            const a = n.id === section;
            return (
              <button key={n.id} style={{
                display:'flex', alignItems:'center', gap:10,
                padding:'10px 12px', borderRadius:9, border:'none',
                background: a ? t.accentSoft : 'transparent',
                color: a ? t.accent : t.ink,
                fontFamily:'inherit', fontWeight: a?700:600, fontSize:13,
                cursor:'pointer', textAlign:'left', position:'relative'
              }}>
                {a && <span style={{position:'absolute', left:0, top:8, bottom:8, width:3, borderRadius:99, background:t.accent}}/>}
                <span style={{display:'inline-flex', color: a ? t.accent : t.inkMute}}>{n.icon}</span>
                <span style={{flex:1}}>{n.l}</span>
                {n.badge && <span style={{minWidth:18, height:18, padding:'0 5px', borderRadius:99, background:t.accent, color:'#fff', fontSize:10, fontWeight:800, display:'grid', placeItems:'center'}}>{n.badge}</span>}
              </button>
            );
          })}
          <div style={{flex:1}}/>
          <div style={{padding:'10px 12px', fontSize:10, color:t.inkSoft, fontFamily:THEMES[theme].font, fontStyle:'italic', display:'inline-flex', alignItems:'center', gap:5}}>
            <I.CloudOff size={11} color={t.inkSoft}/> Offline · 77 MB
          </div>
        </nav>

        {/* MAIN */}
        <main style={{overflow:'auto', padding:'18px 22px'}}>{children}</main>

        {/* RIGHT RAIL */}
        {rightRail && (
          <aside style={{
            background:t.card, borderLeft:`1px solid ${t.rule}`,
            padding:'16px 14px', overflowY:'auto'
          }}>
            {rightRail}
          </aside>
        )}
      </div>
    </div>
  );
}

// Card heading used inside desktop layouts
function DCard({theme, scheme, kicker, title, action, children, padding='14px 16px'}){
  const t = THEMES[theme][scheme];
  return (
    <section style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, marginBottom:14}}>
      {(kicker || title || action) && (
        <header style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', padding:'12px 16px 0', gap:8}}>
          <div>
            {kicker && <div style={{fontSize:10.5, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>{kicker}</div>}
            {title && <SerifH theme={theme} style={{display:'block', fontSize:18, fontWeight:700, color:t.ink, lineHeight:1.05, marginTop:2}}>{title}</SerifH>}
          </div>
          {action}
        </header>
      )}
      <div style={{padding}}>{children}</div>
    </section>
  );
}

// =================================================================
// D1 — DESKTOP HUB
// Three columns: identity & next match, four KPI tiles, right rail with
// inbox preview, board confidence and finance summary.
// =================================================================
function DesktopHub({theme='A', scheme='light'}){
  const t = THEMES[theme][scheme];
  return (
    <DesktopShell theme={theme} scheme={scheme} section="hub" breadcrumb="Büro · Übersicht"
      rightRail={
        <>
          <DCard theme={theme} scheme={scheme} kicker="Posteingang" title="5 ungelesen"
            action={<button style={{fontSize:11, color:t.accent, fontWeight:700, background:'transparent', border:'none', cursor:'pointer'}}>Alle öffnen →</button>}
            padding="6px 12px 14px">
            {INBOX.slice(0,3).map((c,i)=>(
              <div key={i} style={{display:'flex', gap:10, padding:'10px 0', borderBottom: i<2?`1px solid ${t.rule}`:'none'}}>
                <div style={{width:28, height:28, borderRadius:8, background:t.accentSoft, color:t.accent, display:'grid', placeItems:'center', fontWeight:800, fontFamily:THEMES[theme].font, flex:'0 0 28px'}}>§</div>
                <div style={{flex:1, minWidth:0}}>
                  <SerifH theme={theme} style={{display:'block', fontSize:13, fontWeight:700, color:t.ink, lineHeight:1.2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{c.title}</SerifH>
                  <div style={{fontSize:10.5, color:t.inkMute, marginTop:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{c.from}</div>
                </div>
                <span style={{fontSize:9.5, color:t.inkSoft, whiteSpace:'nowrap'}}>{c.time}</span>
              </div>
            ))}
          </DCard>

          <DCard theme={theme} scheme={scheme} kicker="Vorstand" title="Vertrauen · 7 / 10" padding="6px 16px 14px">
            <div style={{display:'flex', gap:3, marginTop:6}}>
              {Array.from({length:10}).map((_,i)=>(
                <div key={i} style={{flex:1, height:8, borderRadius:2, background: i<7 ? t.accent : t.rule}}/>
              ))}
            </div>
            <div style={{fontSize:11, color:t.inkMute, marginTop:8, fontFamily:THEMES[theme].font, fontStyle:'italic', lineHeight:1.35}}>
              „Sonntag in Northbridge zählen Punkte mehr als Stil."
            </div>
          </DCard>

          <DCard theme={theme} scheme={scheme} kicker="Finanzen · Mai" title="+ 632.000 €" padding="0 16px 14px">
            <Sparkline data={[420,480,510,420,540,360,410,580,620,632]} theme={theme} scheme={scheme}/>
            <div style={{display:'flex', justifyContent:'space-between', fontSize:10.5, color:t.inkMute, marginTop:6}}>
              <span>Konto · 14,28 Mio. €</span>
              <LevyChip theme={theme} scheme={scheme}/>
            </div>
          </DCard>
        </>
      }>

      {/* Tabloid kicker */}
      <div style={{fontFamily:THEMES[theme].font, fontStyle:'italic', fontSize:14, color:t.inkMute, marginBottom:14}}>
        „Heute klärt sich, ob der Vorstand Geduld kennt." — Auerbach-Zeitung
      </div>

      {/* Next match HERO */}
      <section style={{
        background:t.card, border:`1px solid ${t.rule}`, borderRadius:16,
        padding:'18px 20px', marginBottom:14,
        display:'grid', gridTemplateColumns:'1fr auto 1fr', gap:24, alignItems:'center'
      }}>
        <div style={{display:'flex', alignItems:'center', gap:14}}>
          <Crest {...crestFor('Northbridge City')} size={64}/>
          <div>
            <div style={{fontSize:11, color:t.inkMute, fontWeight:600}}>Heim</div>
            <SerifH theme={theme} style={{display:'block', fontSize:22, fontWeight:700, color:t.ink, lineHeight:1.05}}>Northbridge City</SerifH>
            <div style={{fontSize:11, color:t.inkSoft}}>4. Tabellenplatz · 54 Pkt.</div>
          </div>
        </div>

        <div style={{textAlign:'center'}}>
          <div style={{fontSize:10, fontWeight:800, color:t.accent, letterSpacing:1.4}}>NÄCHSTER TERMIN</div>
          <SerifH theme={theme} style={{display:'block', fontSize:30, fontWeight:700, color:t.inkSoft, fontStyle:'italic', lineHeight:1.05, marginTop:4}}>So · 24.5 · 15:30</SerifH>
          <div style={{fontSize:11, color:t.inkMute, marginTop:4}}>Aurelia Premier · 32. Spieltag<br/>Northbridge Arena · A</div>
          <div style={{display:'flex', justifyContent:'center', gap:8, marginTop:10}}>
            <FormStrip form="SSNSU" theme={theme} scheme={scheme}/>
          </div>
        </div>

        <div style={{display:'flex', alignItems:'center', gap:14, justifyContent:'flex-end'}}>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:11, color:t.inkMute, fontWeight:600}}>Gast</div>
            <SerifH theme={theme} style={{display:'block', fontSize:22, fontWeight:700, color:t.ink, lineHeight:1.05}}>FC Hafenstadt</SerifH>
            <div style={{fontSize:11, color:t.inkSoft}}>2. Tabellenplatz · 62 Pkt.</div>
          </div>
          <Crest {...crestFor('FC Hafenstadt')} size={64}/>
        </div>
      </section>

      {/* KPI tile grid — 4 across on desktop */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14, marginBottom:14}}>
        {[
          { i:<I.Pitch color={t.ink} size={22}/>, k:'Trainingsplan',       sub:'Mo–Sa · Defensive',  flag:'2 angeschlagen' },
          { i:<I.Users color={t.ink} size={22}/>, k:'Transferbüro',         sub:'3 Anfragen offen',   flag:'Brody umworben' },
          { i:<I.Megaphone color={t.ink} size={22}/>, k:'Vorstandsvertrauen',sub:'Stabil · 7 von 10', flag:'Druck wächst' },
          { i:<I.Wallet color={t.ink} size={22}/>, k:'Finanzen',             sub:'+ 632.000 € / Monat',flag:'Verbandsabgabe fällig' },
        ].map((x,i)=>(
          <div key={i} style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:14, minHeight:120, display:'flex', flexDirection:'column', gap:10, cursor:'pointer'}}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <div style={{width:38,height:38,borderRadius:10,background:t.bgInk,display:'grid',placeItems:'center'}}>{x.i}</div>
              <I.ChevronRight size={16} color={t.inkSoft}/>
            </div>
            <div style={{flex:1}}>
              <SerifH theme={theme} style={{display:'block', fontSize:15, fontWeight:700, color:t.ink, lineHeight:1.15}}>{x.k}</SerifH>
              <div style={{fontSize:12, color:t.inkMute, marginTop:3}}>{x.sub}</div>
            </div>
            <div style={{fontSize:11, color:t.accent, fontWeight:700}}>· {x.flag}</div>
          </div>
        ))}
      </div>

      {/* Lower row: upcoming fixtures + squad strength */}
      <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:14}}>
        <DCard theme={theme} scheme={scheme} kicker="Kommende Termine" title="Drei Spiele · zwei Wochen" padding="4px 16px 16px">
          {FIXTURES.map((f,i)=>(
            <div key={i} style={{display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom: i<FIXTURES.length-1?`1px solid ${t.rule}`:'none'}}>
              <span style={{fontSize:11, color:t.inkSoft, fontFamily:'JetBrains Mono', fontWeight:700, width:80}}>{f.date}</span>
              <span style={{fontSize:10, padding:'2px 7px', borderRadius:99, background:t.bgInk, color:t.inkMute, fontWeight:700, letterSpacing:.3, whiteSpace:'nowrap'}}>{f.tickets}</span>
              <SerifH theme={theme} style={{flex:1, fontSize:13, fontWeight:700, color:t.ink}}>{f.home} <span style={{color:t.inkSoft, fontStyle:'italic'}}>vs.</span> {f.away}</SerifH>
              <span style={{fontSize:10.5, color:t.inkMute}}>{f.comp.split(' · ')[0]}</span>
            </div>
          ))}
        </DCard>

        <DCard theme={theme} scheme={scheme} kicker="Kader · Top 4" title="Form & Stärke" padding="4px 16px 16px">
          {SQUAD.slice(0,4).map((p,i)=>(
            <div key={i} style={{display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom: i<3?`1px solid ${t.rule}`:'none'}}>
              <Portrait name={p.n} theme={theme} scheme={scheme} size={28} variant="player"/>
              <PosPill pos={p.pos} theme={theme} scheme={scheme}/>
              <span style={{flex:1, fontSize:13, fontWeight:700, color:t.ink}}>{p.n}</span>
              <StrBar n={p.str} theme={theme} scheme={scheme} w={48}/>
              <span style={{fontSize:11, color:t.ok, fontFamily:'JetBrains Mono', fontWeight:700}}>{p.form}</span>
            </div>
          ))}
        </DCard>
      </div>
    </DesktopShell>
  );
}

// =================================================================
// D2 — DESKTOP MATCH (Reportage + Tactical board + Stats)
// =================================================================
function DesktopMatch({theme='A', scheme='light'}){
  const t = THEMES[theme][scheme];
  return (
    <DesktopShell theme={theme} scheme={scheme} section="hub" breadcrumb="Spiel · Reportage"
      rightRail={
        <>
          <DCard theme={theme} scheme={scheme} kicker="Live-Statistik" title="Ballbesitz, xG, Schüsse" padding="0 16px 14px">
            <LiveStat theme={theme} scheme={scheme} k="Ballbesitz" a={42} b={58} unit="%"/>
            <LiveStat theme={theme} scheme={scheme} k="Schüsse" a={9} b={14}/>
            <LiveStat theme={theme} scheme={scheme} k="aufs Tor" a={4} b={7}/>
            <LiveStat theme={theme} scheme={scheme} k="xG" a={1.1} b={1.8} fmt="dec"/>
            <LiveStat theme={theme} scheme={scheme} k="Eckstöße" a={3} b={6}/>
            <LiveStat theme={theme} scheme={scheme} k="Fouls" a={11} b={8}/>
          </DCard>
          <DCard theme={theme} scheme={scheme} kicker="MOTM-Anwärter" title="Drei Kandidaten" padding="6px 12px 12px">
            {[
              {n:'Marek Brody', pos:'OM', val:8.7},
              {n:'Aleksy Wieser', pos:'ST', val:8.2},
              {n:'Tobias Reiter', pos:'ZM', val:7.9},
            ].map((p,i)=>(
              <div key={i} style={{display:'flex', alignItems:'center', gap:8, padding:'8px 0', borderBottom:i<2?`1px solid ${t.rule}`:'none'}}>
                <Portrait name={p.n} theme={theme} scheme={scheme} size={28} variant="player"/>
                <PosPill pos={p.pos} theme={theme} scheme={scheme}/>
                <span style={{flex:1, fontSize:12.5, fontWeight:700, color:t.ink}}>{p.n}</span>
                <span style={{fontSize:13, color: i===0?t.ok:t.ink, fontFamily:'JetBrains Mono', fontWeight:800}}>{p.val.toString().replace('.', ',')}</span>
              </div>
            ))}
          </DCard>
        </>
      }>
      {/* Scoreboard */}
      <section style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'14px 20px', marginBottom:14, display:'grid', gridTemplateColumns:'1fr auto 1fr', alignItems:'center', gap:24}}>
        <div style={{display:'flex', alignItems:'center', gap:14}}>
          <Crest {...crestFor('Northbridge City')} size={48}/>
          <SerifH theme={theme} style={{fontSize:20, fontWeight:700, color:t.ink}}>Northbridge</SerifH>
        </div>
        <div style={{textAlign:'center'}}>
          <SerifH theme={theme} style={{display:'block', fontSize:54, fontWeight:800, color:t.ink, letterSpacing:-2, fontFamily:THEMES[theme].font, lineHeight:1}}>
            1<span style={{color:t.inkSoft, margin:'0 6px'}}>:</span><span style={{color:t.accent}}>2</span>
          </SerifH>
          <div style={{fontFamily:'JetBrains Mono', fontSize:12, color:t.accent, fontWeight:800, marginTop:6}}>● 90+3 · ABPFIFF</div>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:14, justifyContent:'flex-end'}}>
          <SerifH theme={theme} style={{fontSize:20, fontWeight:700, color:t.ink}}>Hafenstadt</SerifH>
          <Crest {...crestFor('FC Hafenstadt')} size={48}/>
        </div>
      </section>

      {/* Two columns: feed + tactical pitch */}
      <div style={{display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:14}}>
        <DCard theme={theme} scheme={scheme} kicker="Reportage" title="Spielereignisse">
          {FEED.slice(0,8).map((e,i)=>{
            const col = e.kind==='goal'?t.accent:e.kind==='card'?t.warn:e.kind==='chance'?t.ok:t.inkSoft;
            const glyph = e.kind==='goal'?'⚽':e.kind==='card'?'▮':e.kind==='sub'?'⇅':e.kind==='set'?'⌖':'❘';
            return (
              <div key={i} style={{display:'flex', gap:12, padding:'9px 0', borderBottom: i<7?`1px solid ${t.rule}`:'none', alignItems:'flex-start'}}>
                <span style={{fontFamily:'JetBrains Mono', fontSize:13, fontWeight:700, color:t.inkMute, width:44, textAlign:'right'}}>{e.min}</span>
                <span style={{flex:'0 0 24px', width:24, height:24, borderRadius:6, background:col+'22', color:col, fontWeight:800, fontSize:11, display:'grid', placeItems:'center'}}>{glyph}</span>
                <div style={{flex:1}}>
                  <SerifH theme={theme} style={{display:'block', fontSize: e.kind==='goal'?16:13.5, fontWeight: e.kind==='goal'?800:700, color: e.kind==='goal'?t.accent:t.ink}}>{e.t}</SerifH>
                  <div style={{fontSize:12, color:t.inkMute, fontFamily:THEMES[theme].font, fontStyle:'italic'}}>{e.s}</div>
                </div>
                {e.score && <span style={{fontFamily:'JetBrains Mono', fontSize:13, color:t.accent, fontWeight:800}}>{e.score}</span>}
              </div>
            );
          })}
        </DCard>

        <div>
          <DCard theme={theme} scheme={scheme} kicker="Aufstellung" title="4-3-3 · Hafenstadt" padding="10px 16px 14px">
            <div style={{display:'flex', justifyContent:'center'}}>
              <div style={{width:280}}>
                <FormationPitch theme={theme} scheme={scheme} formation="4-3-3"/>
              </div>
            </div>
          </DCard>
          <DCard theme={theme} scheme={scheme} kicker="xG-Verlauf" title="0 → 90' " padding="0 16px 14px">
            <Sparkline data={[0,0.1,0.3,0.4,0.6,0.9,1.0,1.2,1.3,1.5,1.6,1.8]} theme={theme} scheme={scheme}/>
            <div style={{display:'flex', justifyContent:'space-between', fontSize:10.5, color:t.inkSoft, marginTop:6, fontFamily:'JetBrains Mono'}}>
              <span>NBC 1,1</span><span>FCH 1,8</span>
            </div>
          </DCard>
        </div>
      </div>
    </DesktopShell>
  );
}
function LiveStat({theme, scheme, k, a, b, unit='', fmt}){
  const t = THEMES[theme][scheme];
  const total = a + b;
  const ap = (a/total)*100;
  const bp = (b/total)*100;
  const display = (v) => fmt==='dec' ? v.toString().replace('.', ',') : v;
  return (
    <div style={{padding:'8px 0', borderBottom:`1px solid ${t.rule}`}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:4}}>
        <span style={{fontFamily:'JetBrains Mono', fontSize:12, fontWeight:800, color: a>b?t.accent:t.ink}}>{display(a)}{unit}</span>
        <span style={{fontSize:10.5, color:t.inkMute, fontWeight:600, letterSpacing:.3, textTransform:'uppercase'}}>{k}</span>
        <span style={{fontFamily:'JetBrains Mono', fontSize:12, fontWeight:800, color: b>a?t.accent:t.ink}}>{display(b)}{unit}</span>
      </div>
      <div style={{display:'flex', gap:0, height:3, borderRadius:99, overflow:'hidden', background:t.bgInk}}>
        <div style={{width:ap+'%', background: a>=b?t.accent:t.inkMute}}/>
        <div style={{width:'1px', background:t.bg}}/>
        <div style={{width:bp+'%', background: b>=a?t.accent:t.inkMute}}/>
      </div>
    </div>
  );
}

// =================================================================
// D3 — DESKTOP SQUAD (data grid as card grid, with filter rail)
// =================================================================
function DesktopSquad({theme='A', scheme='light'}){
  const t = THEMES[theme][scheme];
  const filterRail = (
    <>
      <DCard theme={theme} scheme={scheme} kicker="Filter" title="Position" padding="6px 14px 12px">
        <div style={{display:'flex', flexWrap:'wrap', gap:5}}>
          {['Alle','TW','IV','AV','DM','ZM','OM','ST'].map((p,i)=>(
            <button key={p} style={{
              padding:'5px 10px', borderRadius:8, border:`1px solid ${i===0?t.ink:t.rule}`,
              background:i===0?t.ink:t.bg, color:i===0?t.bg:t.ink,
              fontFamily:'JetBrains Mono', fontSize:11, fontWeight:700, cursor:'pointer'
            }}>{p}</button>
          ))}
        </div>
      </DCard>
      <DCard theme={theme} scheme={scheme} kicker="Filter" title="Alter" padding="6px 14px 12px">
        <div style={{display:'flex', gap:6, alignItems:'center'}}>
          <span style={{fontFamily:'JetBrains Mono', fontSize:11, color:t.inkMute, fontWeight:700, width:24}}>16</span>
          <div style={{flex:1, height:5, background:t.bgInk, borderRadius:99, position:'relative'}}>
            <div style={{position:'absolute', left:'10%', right:'15%', height:'100%', background:t.accent, borderRadius:99}}/>
          </div>
          <span style={{fontFamily:'JetBrains Mono', fontSize:11, color:t.inkMute, fontWeight:700, width:24}}>40</span>
        </div>
        <div style={{fontSize:10.5, color:t.inkMute, marginTop:6}}>18 – 34 Jahre</div>
      </DCard>
      <DCard theme={theme} scheme={scheme} kicker="Filter" title="Vertrag" padding="6px 14px 12px">
        {['Läuft 2026 aus','Läuft 2027 aus','Langläufer'].map((l,i)=>(
          <div key={l} style={{display:'flex', alignItems:'center', gap:8, padding:'5px 0'}}>
            <span style={{width:16, height:16, borderRadius:4, border:`1.5px solid ${i===0?t.accent:t.rule}`, background: i===0?t.accent:'transparent', display:'grid', placeItems:'center'}}>
              {i===0 && <I.Check size={10} color="#fff"/>}
            </span>
            <span style={{fontSize:12, color:t.ink, fontWeight: i===0?700:500}}>{l}</span>
          </div>
        ))}
      </DCard>
      <DCard theme={theme} scheme={scheme} kicker="Sortierung" title="Stärke ↓" padding="0 14px 14px">
        <div style={{fontSize:11, color:t.inkMute}}>Sekundär: Talent ↓ · Alter ↑</div>
      </DCard>
    </>
  );
  return (
    <DesktopShell theme={theme} scheme={scheme} section="squad" breadcrumb="Kader · Erste Mannschaft" rightRail={filterRail}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:14}}>
        <div>
          <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>Kader · 14 Spieler · Stärke ⌀ 7,2</div>
          <SerifH theme={theme} style={{fontSize:26, fontWeight:700, color:t.ink}}>Erste Mannschaft</SerifH>
        </div>
        <div style={{display:'flex', gap:6}}>
          <button style={{height:36, padding:'0 12px', borderRadius:9, background:t.card, border:`1px solid ${t.rule}`, fontWeight:700, fontSize:12, color:t.ink, fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:6}}><I.Search size={14} color={t.ink}/> Suche</button>
          <button style={{height:36, padding:'0 12px', borderRadius:9, background:t.ink, border:'none', fontWeight:700, fontSize:12, color:t.bg, fontFamily:'inherit'}}>Vergleichen</button>
        </div>
      </div>
      {/* 3-col card grid */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:10}}>
        {SQUAD.map((p,i)=><PlayerCard key={i} p={p} theme={theme} scheme={scheme}/>)}
      </div>
    </DesktopShell>
  );
}

// =================================================================
// D4 — DESKTOP TACTICS (pitch left, controls right, presets top)
// =================================================================
function DesktopTactics({theme='A', scheme='light'}){
  const t = THEMES[theme][scheme];
  return (
    <DesktopShell theme={theme} scheme={scheme} section="tactics" breadcrumb="Taktik · Hafenstadt-Standard">
      {/* Preset strip */}
      <div style={{display:'flex', gap:8, marginBottom:14}}>
        {[
          {l:'Ausgeglichen', s:'10·10·10', a:true},
          {l:'Hochpressing', s:'80·85·40'},
          {l:'Konter',       s:'40·55·80'},
          {l:'Spielkontrolle', s:'70·40·30'},
          {l:'Defensiv',     s:'20·30·15'},
        ].map((p,i)=>(
          <button key={i} style={{
            padding:'10px 14px', borderRadius:10, border:`1px solid ${p.a?t.ink:t.rule}`,
            background: p.a?t.ink:t.card, color: p.a?t.bg:t.ink,
            fontFamily:'inherit', textAlign:'left', cursor:'pointer'
          }}>
            <div style={{fontSize:13, fontWeight:800}}>{p.l}</div>
            <div style={{fontSize:10, color: p.a?t.bgInk:t.inkMute, fontFamily:'JetBrains Mono', marginTop:2}}>{p.s}</div>
          </button>
        ))}
      </div>

      {/* Two columns: pitch + control stack */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
        <DCard theme={theme} scheme={scheme} kicker="Aufstellung" title="4-3-3 · Mannschaft Hafenstadt"
          action={<span style={{fontSize:11, color:t.inkMute, fontFamily:THEMES[theme].font, fontStyle:'italic'}}>Drag zum Tauschen</span>}
          padding="20px">
          <div style={{display:'flex', justifyContent:'center'}}>
            <div style={{width:'100%', maxWidth:380}}>
              <FormationPitch theme={theme} scheme={scheme} formation="4-3-3"/>
            </div>
          </div>
          {/* Role chips legend */}
          <div style={{display:'flex', flexWrap:'wrap', gap:5, marginTop:12, justifyContent:'center'}}>
            {[
              {l:'Spielmacher', c:t.accent},
              {l:'Abräumer'},
              {l:'Ballspielender IV'},
              {l:'Schattenstürmer'},
              {l:'Halbflügel'},
            ].map((r,i)=>(
              <span key={i} style={{padding:'3px 8px', borderRadius:99, fontSize:10.5, fontWeight:700,
                background: i===0?t.accentSoft:t.bgInk, color: i===0?t.accent:t.inkMute}}>{r.l}</span>
            ))}
          </div>
        </DCard>

        <div>
          <DCard theme={theme} scheme={scheme} kicker="Angriff" title="Tempo & Breite" padding="0 16px">
            <TSlider theme={theme} scheme={scheme} label="Tempo im Angriff" value={64} onChange={()=>{}} leftL="kontrolliert" rightL="direkt" hint="ausgewogen"/>
            <TSlider theme={theme} scheme={scheme} label="Spielbreite" value={72} onChange={()=>{}} leftL="zentriert" rightL="flügellastig" hint="flügellastig"/>
            <Seg theme={theme} scheme={scheme} label="Pressing-Auslöser" value="mittel" onChange={()=>{}}
              opts={[{id:'gegner', l:'Gegnerhälfte'},{id:'mittel', l:'Mittellinie'},{id:'eigen', l:'Eigenhälfte'}]}/>
          </DCard>
          <DCard theme={theme} scheme={scheme} kicker="Verteidigung" title="Linie & Pressing" padding="0 16px 14px">
            <Seg theme={theme} scheme={scheme} label="Abwehrlinie" value="hoch" onChange={()=>{}}
              opts={[{id:'tief', l:'Tief'},{id:'mittel', l:'Mittel'},{id:'hoch', l:'Hoch'}]}/>
            <TSlider theme={theme} scheme={scheme} label="Pressingintensität" value={70} onChange={()=>{}} leftL="ruhig" rightL="aggressiv" hint="70 %"/>
            <TacticToggle theme={theme} scheme={scheme} label="Abseitsfalle" on={true} onChange={()=>{}} hint="Funktioniert nur mit hoher Linie"/>
          </DCard>
        </div>
      </div>
    </DesktopShell>
  );
}

// =================================================================
// D5 — DESKTOP FINANCE (charts + tables side by side)
// =================================================================
function DesktopFinance({theme='A', scheme='light'}){
  const t = THEMES[theme][scheme];
  return (
    <DesktopShell theme={theme} scheme={scheme} section="finance" breadcrumb="Finanzen · Mai 2026">
      {/* Top KPI row */}
      <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:14, marginBottom:14}}>
        <DCard theme={theme} scheme={scheme} kicker="Kontostand · Mai 2026" title="14.280.500 €"
          action={<LevyChip theme={theme} scheme={scheme}/>}
          padding="6px 18px 14px">
          <Sparkline data={[320,410,285,480,510,420,540,360,410,580,620,632]} theme={theme} scheme={scheme}/>
          <div style={{display:'flex', justifyContent:'space-between', fontFamily:'JetBrains Mono', fontSize:11, color:t.inkSoft, marginTop:6}}>
            <span>Jun</span><span>Aug</span><span>Okt</span><span>Dez</span><span>Feb</span><span>Apr</span><span>Mai</span>
          </div>
        </DCard>
        <DCard theme={theme} scheme={scheme} kicker="Monatssaldo" title="+ 632.000 €" padding="0 18px 14px">
          <div style={{fontSize:11, color:t.ok, fontWeight:700, display:'inline-flex', alignItems:'center', gap:4}}>
            <I.TrendUp size={14} color={t.ok}/> + 14 % vs. April
          </div>
        </DCard>
        <DCard theme={theme} scheme={scheme} kicker="Investitionen" title="2,3 / 8,5 Mio." padding="0 18px 14px">
          <div style={{height:6, background:t.bgInk, borderRadius:99, marginTop:4, overflow:'hidden'}}>
            <div style={{width:'27%', height:'100%', background:t.ink}}/>
          </div>
          <div style={{fontSize:10.5, color:t.inkMute, marginTop:6}}>27 % gebunden · Rest frei</div>
        </DCard>
        <DCard theme={theme} scheme={scheme} kicker="Gehälter" title="2,41 Mio. / Monat" padding="0 18px 14px">
          <div style={{fontSize:11, color:t.warn, fontWeight:700}}>58 % der Ausgaben</div>
        </DCard>
      </div>

      {/* Lower: revenue + expense breakdown side by side */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14}}>
        <DCard theme={theme} scheme={scheme} kicker="Einnahmenstruktur" title="Mai 2026" padding="0 18px 16px">
          <BreakBar theme={theme} scheme={scheme} rows={[
            {l:'Sponsoring', v:43, c:t.accent},
            {l:'TV-Gelder',  v:27, c:t.ok},
            {l:'Ticketing',  v:24, c:t.warn},
            {l:'Fanartikel', v:6,  c:t.inkMute},
          ]}/>
        </DCard>
        <DCard theme={theme} scheme={scheme} kicker="Ausgabenstruktur" title="Mai 2026" padding="0 18px 16px">
          <BreakBar theme={theme} scheme={scheme} rows={[
            {l:'Gehälter',          v:58, c:t.danger},
            {l:'Stadion & Betrieb', v:14, c:t.warn},
            {l:'Verbandsabgabe',    v:9,  c:t.accent},
            {l:'Nachwuchs',         v:8,  c:t.ok},
            {l:'Reisen',            v:5,  c:t.inkMute},
            {l:'Sonstiges',         v:6,  c:t.inkSoft},
          ]}/>
        </DCard>
      </div>

      {/* Levers as horizontal cards */}
      <DCard theme={theme} scheme={scheme} kicker="Hebel" title="Live anpassen" padding="6px 18px 14px">
        <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:18}}>
          <Slider theme={theme} scheme={scheme} label="Ticketpreis Stehplatz" value={62} tooltip="14 € / Karte" leftL="-30 %" rightL="+30 %"/>
          <Slider theme={theme} scheme={scheme} label="Trikotsponsoring"      value={48} tooltip="1,8 Mio. €" leftL="bescheiden" rightL="aggressiv"/>
          <Slider theme={theme} scheme={scheme} label="Nachwuchs-Etat"         value={71} tooltip="180.000 €" leftL="kühl" rightL="großzügig" last/>
        </div>
      </DCard>
    </DesktopShell>
  );
}

// =================================================================
// TABLET — narrower variant of the hub (1024-wide)
// =================================================================
function TabletHub({theme='A', scheme='light'}){
  const t = THEMES[theme][scheme];
  return (
    <DesktopShell theme={theme} scheme={scheme} section="hub" breadcrumb="Büro · Übersicht">
      <div style={{fontFamily:THEMES[theme].font, fontStyle:'italic', fontSize:13, color:t.inkMute, marginBottom:14}}>
        „Heute klärt sich, ob der Vorstand Geduld kennt." — Auerbach-Zeitung
      </div>
      <section style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:16, padding:'14px 18px', marginBottom:14}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
          <span style={{fontSize:10, fontWeight:800, color:t.accent, letterSpacing:1.4}}>NÄCHSTER TERMIN</span>
          <span style={{fontSize:11, color:t.inkMute, fontFamily:'JetBrains Mono'}}>So · 24.5 · 15:30</span>
        </div>
        <SerifH theme={theme} style={{display:'block', fontSize:22, fontWeight:700, color:t.ink, marginTop:6}}>
          Northbridge City <span style={{color:t.inkSoft, fontStyle:'italic'}}>vs.</span> FC Hafenstadt
        </SerifH>
        <div style={{fontSize:12, color:t.inkMute, marginTop:4}}>32. Spieltag · Northbridge Arena · auswärts</div>
      </section>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14}}>
        {[
          { i:<I.Pitch color={t.ink} size={20}/>, k:'Trainingsplan', sub:'2 angeschlagen'},
          { i:<I.Users color={t.ink} size={20}/>, k:'Transferbüro',  sub:'3 Anfragen'},
          { i:<I.Megaphone color={t.ink} size={20}/>, k:'Vorstandsvertrauen', sub:'7 / 10'},
          { i:<I.Wallet color={t.ink} size={20}/>, k:'Finanzen', sub:'+ 632 k €'},
        ].map((x,i)=>(
          <div key={i} style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:14}}>
            <div style={{width:34,height:34,borderRadius:10,background:t.bgInk,display:'grid',placeItems:'center'}}>{x.i}</div>
            <SerifH theme={theme} style={{display:'block', fontSize:15, fontWeight:700, color:t.ink, marginTop:10}}>{x.k}</SerifH>
            <div style={{fontSize:11, color:t.inkMute, marginTop:2}}>{x.sub}</div>
          </div>
        ))}
      </div>
      <DCard theme={theme} scheme={scheme} kicker="Posteingang" title="3 von 5" padding="6px 12px 12px">
        {INBOX.slice(0,3).map((c,i)=>(
          <div key={i} style={{display:'flex', gap:10, padding:'10px 0', borderBottom: i<2?`1px solid ${t.rule}`:'none'}}>
            <div style={{width:28, height:28, borderRadius:8, background:t.accentSoft, color:t.accent, display:'grid', placeItems:'center', fontWeight:800, fontFamily:THEMES[theme].font, flex:'0 0 28px'}}>§</div>
            <div style={{flex:1, minWidth:0}}>
              <SerifH theme={theme} style={{display:'block', fontSize:13, fontWeight:700, color:t.ink, lineHeight:1.2}}>{c.title}</SerifH>
              <div style={{fontSize:10.5, color:t.inkMute, marginTop:1}}>{c.from} · {c.time}</div>
            </div>
          </div>
        ))}
      </DCard>
    </DesktopShell>
  );
}

Object.assign(window, {
  DesktopShell, DCard, LiveStat,
  DesktopHub, DesktopMatch, DesktopSquad, DesktopTactics, DesktopFinance, TabletHub,
});
