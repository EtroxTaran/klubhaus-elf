// team.jsx — Player detail, Training, Einzeltraining, Medical/Injuries,
// Scouting+Talents, Teams (1./2./Jugend), Staff. Loaded after tactics.jsx.

// ---------- ATTRIBUTE BAR (1–10, numeric + glyph) ----------
function AttrBar({theme, scheme, label, value, max=10, hint, accentHi=true}){
  const t = THEMES[theme][scheme];
  const cells = Array.from({length:max});
  const tone = value>=8 ? t.ok : value>=5 ? t.ink : t.warn;
  return (
    <div style={{padding:'9px 0', borderBottom:`1px solid ${t.rule}`}}>
      <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between'}}>
        <span style={{fontSize:12.5, fontWeight:600, color:t.ink}}>{label}</span>
        <span style={{fontFamily:'JetBrains Mono', fontSize:13, fontWeight:800, color: accentHi?tone:t.ink, fontVariantNumeric:'tabular-nums'}}>{value.toString().replace('.', ',')}<span style={{color:t.inkSoft, fontWeight:500, fontSize:11}}>/{max}</span></span>
      </div>
      <div style={{display:'flex', gap:2, marginTop:5}}>
        {cells.map((_,i)=>(
          <div key={i} style={{flex:1, height:6, borderRadius:1, background: i < Math.floor(value) ? tone : t.rule, opacity: i === Math.floor(value) ? .6 + (value%1)*0.4 : 1}}/>
        ))}
      </div>
      {hint && <div style={{fontSize:10.5, color:t.inkSoft, marginTop:3}}>{hint}</div>}
    </div>
  );
}

function TraitPill({theme, scheme, label, tone='accent'}){
  const t = THEMES[theme][scheme];
  const c = tone==='accent' ? t.accent : tone==='ok' ? t.ok : tone==='warn' ? t.warn : t.inkMute;
  return (
    <span style={{display:'inline-flex', alignItems:'center', gap:4, padding:'4px 9px', borderRadius:99,
      background: c+'18', color:c, fontSize:11, fontWeight:700, fontFamily:'Inter', letterSpacing:.2}}>
      <span style={{width:5, height:5, borderRadius:99, background:c}}/>{label}
    </span>
  );
}

// =================================================================
// 18. PLAYER DETAIL — Marek Brody
// =================================================================
function ScreenPlayerDetail({theme, scheme}){
  const t = THEMES[theme][scheme];
  const p = {
    name:'Marek Brody', pos:'OM', age:26, nat:'DE', shirt:10, str:8, tal:3, form:'8,4', value:'14,5 Mio. €',
    contractUntil:'06/27', wages:'48.000 € / Mon.', clause:'15 Mio. €',
    attrs: [
      { l:'Spielaufbau',  v:8.4, h:'liest das Mittelfeld' },
      { l:'Abschluss',    v:8.1, h:'kalt im Strafraum' },
      { l:'Tempo',        v:7.8 },
      { l:'Mentalität',   v:8.9, h:'übernimmt Verantwortung' },
      { l:'Physis',       v:7.2 },
      { l:'Defensive',    v:4.5, h:'arbeitet selten zurück' },
    ],
    season:{ apps:28, goals:9, assists:12, yc:2, rc:0, motm:5, xg:8.4, formAvg:'7,8' },
    traits:[
      {l:'Anführer', tone:'accent'},
      {l:'Heimkind', tone:'ok'},
      {l:'Mentalitätsmonster', tone:'accent'},
      {l:'Druckanfällig', tone:'warn'},
    ],
    forms:[7.4, 8.0, 7.6, 8.4, 7.9, 8.1, 8.6, 8.2, 8.4, 8.9],
    injuries:[{when:'Jan 2026', what:'Muskelfaserriss · Oberschenkel', dur:'3 Wochen'}],
  };
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%', position:'relative'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{padding:'4px 16px 8px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.ChevronLeft color={t.ink} size={18}/></button>
          <span style={{fontSize:10, fontWeight:700, color:t.inkMute, letterSpacing:.6, textTransform:'uppercase'}}>Kader · Spielerprofil</span>
          <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.More color={t.ink} size={16}/></button>
        </div>
      </header>

      {/* Identity card */}
      <div style={{padding:'0 16px'}}>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'14px'}}>
          <div style={{display:'flex', gap:14, alignItems:'flex-start'}}>
            <Portrait name={p.name} theme={theme} scheme={scheme} size={72} variant="player"/>
            <div style={{flex:1, minWidth:0}}>
              <div style={{display:'flex', alignItems:'baseline', gap:6}}>
                <span style={{fontSize:10, fontFamily:'JetBrains Mono', color:t.inkSoft, fontWeight:700}}>#{p.shirt}</span>
                <span style={{fontSize:10, color:t.inkSoft, fontWeight:700}}>{p.nat}</span>
              </div>
              <SerifH theme={theme} style={{display:'block', fontSize:22, fontWeight:700, color:t.ink, lineHeight:1.05}}>{p.name}</SerifH>
              <div style={{display:'flex', alignItems:'center', gap:8, marginTop:4}}>
                <PosPill pos={p.pos} theme={theme} scheme={scheme}/>
                <span style={{fontSize:12, color:t.inkMute}}>{p.age} Jahre</span>
                <span style={{fontSize:12, color:t.inkSoft}}>· Marktwert</span>
                <span style={{fontSize:12, fontFamily:'JetBrains Mono', fontWeight:700, color:t.ink}}>{p.value}</span>
              </div>
              <div style={{display:'flex', gap:12, marginTop:8, alignItems:'center'}}>
                <div>
                  <div style={{fontSize:9.5, color:t.inkMute, fontWeight:700, letterSpacing:.4, textTransform:'uppercase'}}>Stärke</div>
                  <StrBar n={p.str} theme={theme} scheme={scheme} w={56}/>
                </div>
                <div>
                  <div style={{fontSize:9.5, color:t.inkMute, fontWeight:700, letterSpacing:.4, textTransform:'uppercase'}}>Talent</div>
                  <div style={{marginTop:3}}><Talent n={p.tal} theme={theme} scheme={scheme}/></div>
                </div>
                <div>
                  <div style={{fontSize:9.5, color:t.inkMute, fontWeight:700, letterSpacing:.4, textTransform:'uppercase'}}>Form</div>
                  <SerifH theme={theme} style={{fontSize:14, fontWeight:800, color:t.ok, fontFamily:'JetBrains Mono'}}>{p.form}</SerifH>
                </div>
              </div>
            </div>
          </div>
          {/* Traits */}
          <div style={{display:'flex', gap:5, marginTop:12, flexWrap:'wrap'}}>
            {p.traits.map((tr,i)=><TraitPill key={i} theme={theme} scheme={scheme} label={tr.l} tone={tr.tone}/>)}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{flex:1, overflowY:'auto', padding:'12px 16px 110px'}}>
        {/* Attributes */}
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', marginBottom:6}}>Attribute · 1 bis 10</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'2px 14px'}}>
          {p.attrs.map((a,i)=>(
            <AttrBar key={i} theme={theme} scheme={scheme} label={a.l} value={a.v} hint={a.h}/>
          ))}
        </div>

        {/* Season stats */}
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'14px 2px 6px'}}>Saison 2026/27</div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:6}}>
          <Stat tile theme={theme} scheme={scheme} k="Spiele" v={p.season.apps}/>
          <Stat tile theme={theme} scheme={scheme} k="Tore" v={p.season.goals} accent/>
          <Stat tile theme={theme} scheme={scheme} k="Vorl." v={p.season.assists} accent/>
          <Stat tile theme={theme} scheme={scheme} k="Form ⌀" v={p.season.formAvg}/>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:6, marginTop:6}}>
          <Stat tile theme={theme} scheme={scheme} k="MOTM" v={p.season.motm}/>
          <Stat tile theme={theme} scheme={scheme} k="Gelb" v={p.season.yc}/>
          <Stat tile theme={theme} scheme={scheme} k="Rot" v={p.season.rc}/>
          <Stat tile theme={theme} scheme={scheme} k="xG" v={p.season.xg.toString().replace('.', ',')}/>
        </div>

        {/* Form curve */}
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'10px 14px', marginTop:10}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
            <span style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>Formkurve · 10 Spiele</span>
            <span style={{fontSize:12, color:t.ok, fontWeight:800, fontFamily:'JetBrains Mono'}}>↑ 8,4</span>
          </div>
          <Sparkline data={p.forms.map(v=>v*10)} theme={theme} scheme={scheme}/>
        </div>

        {/* Contract */}
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'14px 2px 6px'}}>Vertrag</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'2px 14px'}}>
          <KV theme={theme} scheme={scheme} k="Laufzeit" v={`bis ${p.contractUntil}`}/>
          <KV theme={theme} scheme={scheme} k="Grundgehalt" v={p.wages}/>
          <KV theme={theme} scheme={scheme} k="Torprämie" v="22.000 € / Tor"/>
          <KV theme={theme} scheme={scheme} k="Ausstiegsklausel" v={p.clause} last/>
        </div>

        {/* Injuries history */}
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'14px 2px 6px'}}>Verletzungshistorie</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'10px 14px'}}>
          {p.injuries.map((iz,i)=>(
            <div key={i} style={{display:'flex', alignItems:'center', gap:10}}>
              <div style={{width:30, height:30, borderRadius:8, background:t.danger+'20', color:t.danger, display:'grid', placeItems:'center'}}>+</div>
              <div style={{flex:1}}>
                <div style={{fontSize:12.5, fontWeight:700, color:t.ink}}>{iz.what}</div>
                <div style={{fontSize:11, color:t.inkMute}}>{iz.when} · {iz.dur} Ausfall</div>
              </div>
            </div>
          ))}
          <div style={{fontSize:11, color:t.inkSoft, marginTop:8, fontFamily:THEMES[theme].font, fontStyle:'italic'}}>Robust. Seit drei Jahren maximal eine Verletzung pro Saison.</div>
        </div>
      </div>

      {/* Bottom CTAs */}
      <div style={{position:'absolute', left:0, right:0, bottom:0, padding:'10px 16px 22px', background:`linear-gradient(to top, ${t.bg} 80%, transparent)`, display:'flex', gap:8}}>
        <button style={{flex:1, height:50, borderRadius:14, background:t.card, border:`1px solid ${t.rule}`, color:t.ink, fontWeight:700, fontSize:13, fontFamily:'inherit'}}>Trainingsfokus</button>
        <button style={{flex:2, height:50, borderRadius:14, background:t.ink, color:t.bg, border:'none', fontWeight:800, fontSize:14, fontFamily:'inherit'}}>Vertragsgespräch</button>
      </div>
    </div>
  );
}
function Stat({theme, scheme, k, v, accent, tile}){
  const t = THEMES[theme][scheme];
  return (
    <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:10, padding:'8px 10px', textAlign:tile?'left':'center'}}>
      <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.4, textTransform:'uppercase'}}>{k}</div>
      <SerifH theme={theme} style={{display:'block', fontSize:18, fontWeight:800, color: accent?t.accent:t.ink, fontFamily:'JetBrains Mono', marginTop:2, lineHeight:1}}>{v}</SerifH>
    </div>
  );
}
function KV({theme, scheme, k, v, last}){
  const t = THEMES[theme][scheme];
  return (
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', padding:'9px 0', borderBottom: last?'none':`1px solid ${t.rule}`}}>
      <span style={{fontSize:12, color:t.inkMute}}>{k}</span>
      <span style={{fontSize:12.5, fontWeight:700, color:t.ink, fontFamily:'JetBrains Mono'}}>{v}</span>
    </div>
  );
}

// =================================================================
// 19. TRAINING — weekly plan
// =================================================================
function ScreenTraining({theme, scheme}){
  const t = THEMES[theme][scheme];
  const days = ['Mo','Di','Mi','Do','Fr','Sa'];
  // 2 sessions/day: morning + afternoon, with focus type
  const schedule = [
    [{f:'Defensive'},{f:'Athletik'}],
    [{f:'Standards'},{f:'Pause'}],
    [{f:'Offensive'},{f:'Video'}],
    [{f:'Defensive'},{f:'Athletik'}],
    [{f:'Spielform'},{f:'Pause'}],
    [{f:'Anstoßvorb.'},{f:'frei'}],
  ];
  const focusColors = {
    'Defensive':'#3f6a2f', 'Offensive':t.accent, 'Athletik':'#a3680f',
    'Standards':'#7a3a8a', 'Video':'#1f6f9a', 'Spielform':'#3f6a2f',
    'Pause':t.inkSoft, 'frei':t.inkSoft, 'Anstoßvorb.':t.ink
  };
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{padding:'4px 16px 6px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
          <div>
            <div style={{fontSize:10.5,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>Trainingswoche · 19. Mai</div>
            <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:700, color:t.ink, lineHeight:1}}>Training</SerifH>
          </div>
          <span style={{fontSize:11, color:t.accent, fontWeight:800, padding:'4px 10px', borderRadius:99, background:t.accentSoft}}>Sonntag: Northbridge</span>
        </div>
      </header>

      {/* Squad picker */}
      <div style={{padding:'8px 16px 0'}}>
        <div style={{display:'flex', gap:5}}>
          {['1. Mannschaft','Reserve','Jugend'].map((s,i)=>(
            <button key={s} style={{
              flex:1, padding:'8px 0', borderRadius:9, border:`1px solid ${i===0?t.ink:t.rule}`,
              background: i===0?t.ink:t.card, color: i===0?t.bg:t.ink,
              fontFamily:'inherit', fontWeight:700, fontSize:11.5
            }}>{s}</button>
          ))}
        </div>
      </div>

      <div style={{flex:1, overflowY:'auto', padding:'12px 16px 20px'}}>
        {/* Weekly plan */}
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', marginBottom:6}}>Wochenplan</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'10px 8px'}}>
          <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:4}}>
            {days.map((d,i)=>(
              <div key={d}>
                <div style={{fontSize:10, color:t.inkMute, fontWeight:800, letterSpacing:.5, textAlign:'center', textTransform:'uppercase'}}>{d}</div>
                <div style={{display:'flex', flexDirection:'column', gap:3, marginTop:5}}>
                  {schedule[i].map((s,j)=>{
                    const c = focusColors[s.f] || t.inkSoft;
                    return (
                      <div key={j} style={{padding:'7px 4px', borderRadius:7, background: s.f==='Pause'||s.f==='frei' ? 'transparent' : c+'18', border: s.f==='Pause'||s.f==='frei'?`1px dashed ${t.rule}`:`1px solid ${c}40`, textAlign:'center'}}>
                        <div style={{fontSize:9, color:t.inkSoft, fontWeight:700}}>{j===0?'AM':'PM'}</div>
                        <div style={{fontSize:10, fontWeight:800, color:c, marginTop:1}}>{s.f}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div style={{display:'flex', flexWrap:'wrap', gap:6, marginTop:10, paddingTop:8, borderTop:`1px solid ${t.rule}`, fontSize:9.5, color:t.inkMute}}>
            {Object.entries(focusColors).filter(([k])=>!['Pause','frei'].includes(k)).map(([k,c])=>(
              <span key={k} style={{display:'inline-flex', alignItems:'center', gap:3}}><span style={{width:8, height:8, borderRadius:2, background:c}}/>{k}</span>
            ))}
          </div>
        </div>

        {/* Focus distribution sliders */}
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'14px 2px 6px'}}>Fokus-Verteilung · diese Woche</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'0 14px'}}>
          <TSlider theme={theme} scheme={scheme} label="Defensive" value={30} onChange={()=>{}} leftL="vernachlässigt" rightL="Schwerpunkt" hint="30 %"/>
          <TSlider theme={theme} scheme={scheme} label="Offensive" value={50} onChange={()=>{}} leftL="vernachlässigt" rightL="Schwerpunkt" hint="50 %"/>
          <TSlider theme={theme} scheme={scheme} label="Standards" value={20} onChange={()=>{}} leftL="vernachlässigt" rightL="Schwerpunkt" hint="20 %"/>
        </div>

        {/* Workload */}
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'14px 2px 6px'}}>Belastung</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'12px 14px'}}>
          <Workload theme={theme} scheme={scheme} label="Mannschaftserschöpfung" value={62} note="leicht erhöht — eine Einheit lockerer planen"/>
          <Workload theme={theme} scheme={scheme} label="Verletzungsrisiko" value={28} note="im grünen Bereich"/>
          <Workload theme={theme} scheme={scheme} label="Moral" value={84} note="vor Heimspiel typisch hoch" last/>
        </div>

        {/* Today's session */}
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'14px 2px 6px'}}>Heute · Mittwoch</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'12px 14px'}}>
          <SerifH theme={theme} style={{display:'block', fontSize:15, fontWeight:700, color:t.ink}}>Offensive · 9:30 – 11:30</SerifH>
          <div style={{fontSize:11.5, color:t.inkMute, marginTop:2, lineHeight:1.4}}>Halbfeld 8 gegen 8 mit Konterimpulsen. Co-Trainer Mertens leitet die Außenbahn-Stationen.</div>
          <div style={{display:'flex', gap:5, marginTop:8, flexWrap:'wrap'}}>
            <TraitPill theme={theme} scheme={scheme} label="alle 14 Spieler an Bord" tone="ok"/>
            <TraitPill theme={theme} scheme={scheme} label="Wendling: Lauftraining solo" tone="warn"/>
          </div>
        </div>
      </div>
    </div>
  );
}
function Workload({theme, scheme, label, value, note, last}){
  const t = THEMES[theme][scheme];
  const c = value>=70 ? t.danger : value>=50 ? t.warn : t.ok;
  return (
    <div style={{padding:'7px 0', borderBottom: last?'none':`1px solid ${t.rule}`}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
        <span style={{fontSize:12.5, fontWeight:600, color:t.ink}}>{label}</span>
        <span style={{fontFamily:'JetBrains Mono', fontSize:12, fontWeight:800, color:c}}>{value} %</span>
      </div>
      <div style={{height:5, background:t.bgInk, borderRadius:99, marginTop:5, overflow:'hidden'}}>
        <div style={{width:value+'%', height:'100%', background:c}}/>
      </div>
      <div style={{fontSize:10.5, color:t.inkSoft, marginTop:3}}>{note}</div>
    </div>
  );
}

// =================================================================
// 20. EINZELTRAINING
// =================================================================
function ScreenIndividualTraining({theme, scheme}){
  const t = THEMES[theme][scheme];
  const assignments = [
    { name:'Marek Brody',     pos:'OM', focus:'Standards',   coach:'Mertens',  prog:0.6, eta:'2 Wochen', delta:'+ 0,2 Stärke' },
    { name:'Aleksy Wieser',   pos:'ST', focus:'Abschluss',   coach:'Klar',     prog:0.4, eta:'4 Wochen', delta:'+ 0,3 Stärke' },
    { name:'Niko Velten',     pos:'ZM', focus:'Spielaufbau', coach:'Mertens',  prog:0.8, eta:'1 Woche',  delta:'+ 0,4 Stärke' },
    { name:'Henrik Voss',     pos:'IV', focus:'Physis',      coach:'Petrich',  prog:0.2, eta:'6 Wochen', delta:'+ 0,2 Stärke' },
  ];
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{padding:'4px 16px 8px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
          <div>
            <div style={{fontSize:10.5,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>4 von 6 Slots belegt</div>
            <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:700, color:t.ink, lineHeight:1}}>Einzeltraining</SerifH>
          </div>
          <button style={{height:34, padding:'0 12px', borderRadius:9, background:t.ink, color:t.bg, border:'none', fontWeight:700, fontSize:11, fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:4}}>
            <I.Plus size={13} color={t.bg}/> Spieler
          </button>
        </div>
      </header>

      {/* Coach load */}
      <div style={{padding:'0 16px'}}>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'12px 14px'}}>
          <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', marginBottom:6}}>Co-Trainer-Auslastung</div>
          {[
            {n:'Werner Mertens', spec:'Offensive', load:75},
            {n:'Klaus Klar',     spec:'Torjäger',  load:50},
            {n:'Sven Petrich',   spec:'Athletik',  load:35},
          ].map((c,i)=>(
            <div key={i} style={{display:'flex', alignItems:'center', gap:10, padding:'5px 0'}}>
              <Portrait name={c.n} theme={theme} scheme={scheme} size={28}/>
              <div style={{flex:1, minWidth:0}}>
                <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between'}}>
                  <span style={{fontSize:12, fontWeight:700, color:t.ink}}>{c.n}</span>
                  <span style={{fontSize:10.5, color: c.load>=80?t.danger : c.load>=60?t.warn:t.ok, fontFamily:'JetBrains Mono', fontWeight:800}}>{c.load} %</span>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:6, marginTop:2}}>
                  <span style={{fontSize:10, color:t.inkSoft, flex:'0 0 70px'}}>{c.spec}</span>
                  <div style={{flex:1, height:4, background:t.bgInk, borderRadius:99, overflow:'hidden'}}>
                    <div style={{width:c.load+'%', height:'100%', background: c.load>=80?t.danger : c.load>=60?t.warn:t.ok}}/>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assignments */}
      <div style={{flex:1, overflowY:'auto', padding:'14px 16px 20px'}}>
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', marginBottom:6}}>Aktive Förderpläne</div>
        {assignments.map((a,i)=>(
          <div key={i} style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'12px 14px', marginBottom:8}}>
            <div style={{display:'flex', alignItems:'center', gap:10}}>
              <Portrait name={a.name} theme={theme} scheme={scheme} size={40} variant="player"/>
              <div style={{flex:1, minWidth:0}}>
                <div style={{display:'flex', alignItems:'center', gap:6}}>
                  <PosPill pos={a.pos} theme={theme} scheme={scheme}/>
                  <SerifH theme={theme} style={{fontSize:14, fontWeight:700, color:t.ink}}>{a.name}</SerifH>
                </div>
                <div style={{fontSize:11, color:t.inkMute, marginTop:2}}>Fokus · <span style={{color:t.accent, fontWeight:700}}>{a.focus}</span> · Coach {a.coach}</div>
              </div>
              <span style={{fontSize:11, color:t.ok, fontWeight:800, fontFamily:'JetBrains Mono'}}>{a.delta}</span>
            </div>
            <div style={{display:'flex', alignItems:'center', gap:8, marginTop:10}}>
              <div style={{flex:1, height:6, background:t.bgInk, borderRadius:99, overflow:'hidden'}}>
                <div style={{width:(a.prog*100)+'%', height:'100%', background:t.accent}}/>
              </div>
              <span style={{fontSize:10.5, color:t.inkMute, fontFamily:'JetBrains Mono'}}>ETA · {a.eta}</span>
            </div>
          </div>
        ))}

        {/* Empty slot */}
        <button style={{
          width:'100%', background:'transparent', border:`1.5px dashed ${t.rule}`, borderRadius:14,
          padding:'18px 14px', color:t.inkMute, fontFamily:'inherit', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontSize:13, fontWeight:700
        }}>
          <I.Plus size={16} color={t.inkMute}/> Spieler in den Förderplan aufnehmen
          <span style={{fontSize:10, color:t.inkSoft, fontWeight:500}}>(noch 2 Slots)</span>
        </button>
      </div>
    </div>
  );
}

// =================================================================
// 21. MEDIZINISCHE ABTEILUNG & VERLETZUNGEN
// =================================================================
function ScreenMedical({theme, scheme}){
  const t = THEMES[theme][scheme];
  const injured = [
    { name:'Lars Wendling', pos:'TW', what:'Schultereckgelenk · 2. Grades', etaWeeks:2, severity:'mittel', confidence:80, tx:'konservativ', back:'02. Juni' },
    { name:'Felipe Manso',  pos:'IV', what:'Muskelfaserriss · Oberschenkel', etaWeeks:4, severity:'mittel', confidence:65, tx:'Reha-Programm', back:'16. Juni' },
    { name:'Jonas Bredow',  pos:'AV', what:'Knöchelbandzerrung',  etaWeeks:0.5, severity:'leicht', confidence:90, tx:'Tape + Schonung', back:'21. Mai' },
  ];
  const risk = [
    { name:'Tobias Reiter', val:62, why:'2.640 Minuten ohne Pause' },
    { name:'Aleksy Wieser', val:48, why:'leicht muskuläre Beschwerden' },
    { name:'Mateo Carrara', val:34, why:'Standard-Wert · stabil' },
    { name:'Marek Brody',   val:18, why:'frisch · niedriges Risiko' },
  ];
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{padding:'4px 16px 8px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
          <div>
            <div style={{fontSize:10.5,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>Medizinische Abteilung</div>
            <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:700, color:t.ink, lineHeight:1}}>Krankenstation</SerifH>
          </div>
          <span style={{fontSize:11, color:t.danger, fontWeight:800, padding:'4px 10px', borderRadius:99, background:t.danger+'14'}}>3 Ausfälle</span>
        </div>
      </header>

      <div style={{flex:1, overflowY:'auto', padding:'10px 16px 20px'}}>
        {/* Doc */}
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'10px 14px', display:'flex', alignItems:'center', gap:12, marginBottom:12}}>
          <Portrait name="Dr. Magdalena Frey" theme={theme} scheme={scheme} size={44}/>
          <div style={{flex:1}}>
            <SerifH theme={theme} style={{fontSize:14, fontWeight:700, color:t.ink}}>Dr. Magdalena Frey</SerifH>
            <div style={{fontSize:11, color:t.inkMute}}>Mannschaftsärztin · 12 Jahre Vereinszugehörigkeit</div>
          </div>
          <MoodFace mood={0} size={30} theme={theme} scheme={scheme}/>
        </div>

        {/* Currently injured */}
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', marginBottom:6}}>Aktuelle Ausfälle</div>
        {injured.map((iz,i)=>{
          const weeksToBars = Math.min(8, Math.max(1, Math.round(iz.etaWeeks)));
          return (
            <div key={i} style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'10px 12px', marginBottom:8}}>
              <div style={{display:'flex', alignItems:'flex-start', gap:10}}>
                <Portrait name={iz.name} theme={theme} scheme={scheme} size={40} variant="player"/>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{display:'flex', alignItems:'center', gap:6}}>
                    <PosPill pos={iz.pos} theme={theme} scheme={scheme}/>
                    <SerifH theme={theme} style={{fontSize:14, fontWeight:700, color:t.ink}}>{iz.name}</SerifH>
                  </div>
                  <div style={{fontSize:11.5, color:t.danger, marginTop:3, fontWeight:600, display:'inline-flex', alignItems:'center', gap:4}}>
                    <span style={{width:6, height:6, borderRadius:99, background:t.danger}}/>{iz.what}
                  </div>
                  <div style={{fontSize:11, color:t.inkMute, marginTop:2}}>Behandlung · {iz.tx} · Rückkehr ca. {iz.back}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.4, textTransform:'uppercase'}}>Ausfall</div>
                  <SerifH theme={theme} style={{fontSize:16, fontWeight:800, color:t.danger, fontFamily:'JetBrains Mono'}}>{iz.etaWeeks < 1 ? Math.round(iz.etaWeeks*7) + ' T' : iz.etaWeeks + ' W'}</SerifH>
                </div>
              </div>
              {/* Recovery timeline */}
              <div style={{marginTop:10}}>
                <div style={{display:'flex', gap:3, marginBottom:4}}>
                  {Array.from({length:8}).map((_,j)=>(
                    <div key={j} style={{flex:1, height:6, borderRadius:2, background: j>=weeksToBars ? t.ok : (j===weeksToBars-1 ? t.warn : t.danger), opacity: j>=weeksToBars ? .35 : 1}}/>
                  ))}
                </div>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:9.5, color:t.inkSoft, fontFamily:'JetBrains Mono'}}>
                  <span>jetzt</span><span>in 8 Wochen</span>
                </div>
              </div>
              {/* Tx options */}
              <div style={{display:'flex', gap:6, marginTop:8}}>
                <button style={{flex:1, height:34, borderRadius:8, background:t.bg, border:`1px solid ${t.rule}`, fontSize:11, fontWeight:700, color:t.ink, fontFamily:'inherit'}}>Konservativ</button>
                <button style={{flex:1, height:34, borderRadius:8, background:t.bgInk, border:`1px solid ${t.rule}`, fontSize:11, fontWeight:700, color:t.ink, fontFamily:'inherit'}}>Intensiv-Reha <span style={{color:t.warn}}>+Risiko</span></button>
                <button style={{flex:1, height:34, borderRadius:8, background:t.bg, border:`1px solid ${t.rule}`, fontSize:11, fontWeight:700, color:t.danger, fontFamily:'inherit'}}>OP erwägen</button>
              </div>
            </div>
          );
        })}

        {/* Risk panel */}
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'14px 2px 6px'}}>Verletzungsrisiko · Top 4</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'2px 14px'}}>
          {risk.map((r,i)=>{
            const c = r.val>=60 ? t.danger : r.val>=40 ? t.warn : t.ok;
            return (
              <div key={i} style={{padding:'10px 0', borderBottom: i<risk.length-1?`1px solid ${t.rule}`:'none'}}>
                <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between'}}>
                  <span style={{fontSize:12.5, fontWeight:700, color:t.ink}}>{r.name}</span>
                  <span style={{fontFamily:'JetBrains Mono', fontSize:12, fontWeight:800, color:c}}>{r.val} %</span>
                </div>
                <div style={{height:4, marginTop:4, background:t.bgInk, borderRadius:99, overflow:'hidden'}}>
                  <div style={{width:r.val+'%', height:'100%', background:c}}/>
                </div>
                <div style={{fontSize:10.5, color:t.inkSoft, marginTop:3, fontFamily:THEMES[theme].font, fontStyle:'italic'}}>{r.why}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// =================================================================
// 22. SCOUTING & TALENTE POOL
// =================================================================
function ScreenScouting({theme, scheme}){
  const t = THEMES[theme][scheme];
  const targets = [
    { name:'Élise Vannier',   nat:'FR', pos:'OM', age:19, str:6, tal:4, rec:'sehr empfohlen', club:'Olympique Sauveterre', estimate:'2,8 Mio. €' },
    { name:'Ronan Heffernan', nat:'IE', pos:'IV', age:22, str:7, tal:3, rec:'empfohlen',      club:'Northbridge City',    estimate:'4,6 Mio. €' },
    { name:'Lukas Pichler',   nat:'AT', pos:'ZM', age:17, str:5, tal:4, rec:'Top-Talent',     club:'Sporting Kaltenbach', estimate:'650.000 €' },
    { name:'Mads Therkildsen', nat:'DK', pos:'ST', age:25, str:7, tal:2, rec:'beobachten',    club:'Oakport United',     estimate:'5,4 Mio. €' },
  ];
  const regions = [
    { code:'DE', name:'Aurelia', scouts:2, active:8 },
    { code:'IT', name:'Norvania-Süd', scouts:1, active:4 },
    { code:'FR', name:'Norvania-West', scouts:1, active:3 },
    { code:'BR', name:'Übersee', scouts:0, active:0, dim:true },
  ];
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{padding:'4px 16px 8px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
          <div>
            <div style={{fontSize:10.5,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>4 Scouts · 15 Beobachtungen</div>
            <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:700, color:t.ink, lineHeight:1}}>Scouting</SerifH>
          </div>
          <button style={{height:34, padding:'0 10px', borderRadius:9, background:t.card, border:`1px solid ${t.rule}`, color:t.ink, fontWeight:700, fontSize:11, fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:4}}>
            <I.Search size={14} color={t.ink}/> Suche
          </button>
        </div>
      </header>

      <div style={{flex:1, overflowY:'auto', padding:'8px 16px 20px'}}>
        {/* Map placeholder */}
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', marginBottom:6}}>Beobachtungsnetz</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'12px', position:'relative'}}>
          <ScoutMap theme={theme} scheme={scheme}/>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginTop:8}}>
          {regions.map((r,i)=>(
            <div key={i} style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:10, padding:'8px 10px', opacity: r.dim?.55:1}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                <span style={{fontSize:12.5, fontWeight:700, color:t.ink}}>{r.name}</span>
                <span style={{fontFamily:'JetBrains Mono', fontSize:10, color:t.inkSoft, fontWeight:700}}>{r.code}</span>
              </div>
              <div style={{fontSize:10.5, color:t.inkMute, marginTop:2}}>{r.scouts} Scout{r.scouts!==1?'s':''} · {r.active} aktiv</div>
            </div>
          ))}
        </div>

        {/* Talents */}
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'16px 2px 6px'}}>Talente-Pool · 4 von 23</div>
        {targets.map((tg,i)=>(
          <div key={i} style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'10px 12px', marginBottom:8, display:'flex', gap:10, alignItems:'center'}}>
            <Portrait name={tg.name} theme={theme} scheme={scheme} size={42} variant="player"/>
            <div style={{flex:1, minWidth:0}}>
              <div style={{display:'flex', alignItems:'center', gap:6}}>
                <PosPill pos={tg.pos} theme={theme} scheme={scheme}/>
                <span style={{fontSize:13.5, fontWeight:700, color:t.ink}}>{tg.name}</span>
                <span style={{fontSize:10, color:t.inkSoft, fontFamily:'JetBrains Mono'}}>{tg.nat}</span>
              </div>
              <div style={{fontSize:11, color:t.inkMute, marginTop:2}}>{tg.club} · {tg.age} J. · ca. {tg.estimate}</div>
              <div style={{display:'flex', gap:8, marginTop:5, alignItems:'center'}}>
                <StrBar n={tg.str} theme={theme} scheme={scheme} w={44}/>
                <Talent n={tg.tal} theme={theme} scheme={scheme}/>
                <span style={{fontSize:10, padding:'2px 7px', borderRadius:99,
                  background: tg.rec==='Top-Talent'?t.accentSoft : tg.rec==='sehr empfohlen'?'#cfe0d2' : tg.rec==='empfohlen'?'#e8d28a40' : t.bgInk,
                  color: tg.rec==='Top-Talent'?t.accent : tg.rec==='sehr empfohlen'?t.ok : tg.rec==='empfohlen'?t.warn : t.inkMute,
                  fontWeight:800, letterSpacing:.3}}>{tg.rec}</span>
              </div>
            </div>
            <button aria-label="Detail" style={{width:32, height:32, borderRadius:8, background:t.bg, border:`1px solid ${t.rule}`, display:'grid', placeItems:'center'}}><I.ChevronRight size={14} color={t.ink}/></button>
          </div>
        ))}
      </div>
    </div>
  );
}
// Stylized scouting map — abstract continents with scout pins
function ScoutMap({theme, scheme}){
  const t = THEMES[theme][scheme];
  return (
    <svg viewBox="0 0 320 160" style={{width:'100%', display:'block'}}>
      <rect x="0" y="0" width="320" height="160" rx="8" fill={t.bgInk}/>
      {/* abstract continents */}
      <g fill={t.card} stroke={t.rule} strokeWidth=".8">
        <path d="M30 40 Q60 25 90 40 L120 50 Q140 70 160 60 L180 80 Q200 100 180 120 L140 130 Q100 130 80 110 L50 100 Q25 80 30 40 Z"/>
        <path d="M200 30 Q230 20 260 30 L290 50 Q300 80 280 100 L240 120 Q210 110 200 80 Z"/>
      </g>
      {/* pins */}
      {[
        {x:90, y:75, label:'A', live:true},
        {x:65, y:55, label:'B', live:true},
        {x:135, y:95, label:'C', live:true},
        {x:240, y:70, label:'D', live:true},
        {x:260, y:90, label:'E', live:false},
      ].map((p,i)=>(
        <g key={i} opacity={p.live?1:.4}>
          <circle cx={p.x} cy={p.y} r="10" fill={t.accent+'22'}/>
          <circle cx={p.x} cy={p.y} r="5" fill={t.accent} stroke={t.ink} strokeWidth=".8"/>
          <text x={p.x} y={p.y+2} textAnchor="middle" fontSize="6" fontWeight="800" fill="#fff" fontFamily="Inter">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

// =================================================================
// 23. TEAMS (1./2./Jugend)
// =================================================================
function ScreenTeams({theme, scheme}){
  const t = THEMES[theme][scheme];
  const teams = [
    { id:'first', name:'1. Mannschaft', league:'Aurelia Premier · 2.', squad:14, age:25.6, avgStr:7.2, next:'Northbridge auswärts', form:'SSNSU' },
    { id:'res',   name:'Reserve · U23', league:'Liga Norvania · 3.',   squad:18, age:21.4, avgStr:5.6, next:'Sauveterre II',         form:'SSUNS' },
    { id:'youth', name:'Jugend · U19',  league:'Jugendliga Aurelia',    squad:22, age:17.2, avgStr:4.4, next:'Trainingsspiel',         form:'SUSNS' },
  ];
  const promotable = [
    { name:'Henrik Voss',  pos:'IV', age:19, str:5, tal:4, team:'Reserve' },
    { name:'Pavel Schramm',pos:'OM', age:20, str:6, tal:4, team:'Reserve' },
    { name:'Tim Reckling', pos:'AV', age:18, str:4, tal:4, team:'U19' },
  ];
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{padding:'4px 16px 8px'}}>
        <div>
          <div style={{fontSize:10.5,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>FC Hafenstadt · drei Mannschaften</div>
          <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:700, color:t.ink, lineHeight:1}}>Vereinsstruktur</SerifH>
        </div>
      </header>

      <div style={{flex:1, overflowY:'auto', padding:'8px 16px 20px'}}>
        {teams.map((tm,i)=>(
          <div key={i} style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'12px 14px', marginBottom:10}}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
              <div>
                <SerifH theme={theme} style={{display:'block', fontSize:17, fontWeight:700, color:t.ink, lineHeight:1.05}}>{tm.name}</SerifH>
                <div style={{fontSize:11, color:t.inkMute, marginTop:2}}>{tm.league}</div>
              </div>
              <button aria-label="Öffnen" style={{width:34, height:34, borderRadius:9, background:t.bg, border:`1px solid ${t.rule}`, display:'grid', placeItems:'center'}}><I.ChevronRight size={15} color={t.ink}/></button>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6, marginTop:10}}>
              <Tm theme={theme} scheme={scheme} k="Kader" v={tm.squad}/>
              <Tm theme={theme} scheme={scheme} k="Alter ⌀" v={tm.age.toString().replace('.', ',')}/>
              <Tm theme={theme} scheme={scheme} k="Stärke ⌀" v={tm.avgStr.toString().replace('.', ',')}/>
            </div>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:10}}>
              <div>
                <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.4, textTransform:'uppercase'}}>Form</div>
                <div style={{marginTop:3}}><FormStrip form={tm.form} theme={theme} scheme={scheme}/></div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.4, textTransform:'uppercase'}}>Nächstes Spiel</div>
                <div style={{fontSize:12, fontWeight:700, color:t.ink, marginTop:2, fontFamily:THEMES[theme].font, fontStyle:'italic'}}>{tm.next}</div>
              </div>
            </div>
          </div>
        ))}

        {/* Promotion candidates */}
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'4px 2px 6px'}}>Beförderungs-Kandidaten</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'2px 14px'}}>
          {promotable.map((p,i)=>(
            <div key={i} style={{display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom: i<promotable.length-1?`1px solid ${t.rule}`:'none'}}>
              <Portrait name={p.name} theme={theme} scheme={scheme} size={32} variant="player"/>
              <div style={{flex:1, minWidth:0}}>
                <div style={{display:'flex', alignItems:'center', gap:6}}>
                  <PosPill pos={p.pos} theme={theme} scheme={scheme}/>
                  <span style={{fontSize:13, fontWeight:700, color:t.ink}}>{p.name}</span>
                </div>
                <div style={{fontSize:11, color:t.inkMute, marginTop:1, display:'flex', alignItems:'center', gap:6}}>
                  <span>{p.age} J.</span>
                  <span style={{fontFamily:'JetBrains Mono'}}>Stärke {p.str}</span>
                  <span>· aus {p.team}</span>
                </div>
              </div>
              <Talent n={p.tal} theme={theme} scheme={scheme}/>
              <button aria-label="Hochziehen" style={{height:30, padding:'0 10px', borderRadius:8, background:t.ink, color:t.bg, border:'none', fontSize:11, fontWeight:700, fontFamily:'inherit'}}>Hochziehen</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function Tm({theme, scheme, k, v}){
  const t = THEMES[theme][scheme];
  return (
    <div style={{background:t.bg, border:`1px solid ${t.rule}`, borderRadius:9, padding:'7px 9px'}}>
      <div style={{fontSize:9.5, color:t.inkMute, fontWeight:700, letterSpacing:.4, textTransform:'uppercase'}}>{k}</div>
      <div style={{fontSize:15, fontWeight:800, color:t.ink, fontFamily:'JetBrains Mono'}}>{v}</div>
    </div>
  );
}

// =================================================================
// 24. STAFF
// =================================================================
function ScreenStaff({theme, scheme}){
  const t = THEMES[theme][scheme];
  const groups = [
    { id:'coach', title:'Trainerstab', members: [
      { name:'Julia Lindquist', role:'Cheftrainerin · Sie',    str:8, contract:'06/28', tag:'Wechselt nicht',         you:true },
      { name:'Werner Mertens',  role:'Co-Trainer · Offensive', str:7, contract:'06/27', tag:'Lukas-Variante geübt' },
      { name:'Klaus Klar',      role:'Co-Trainer · Torjäger',  str:6, contract:'06/26', tag:'Vertrag läuft aus' },
      { name:'Sven Petrich',    role:'Athletiktrainer',        str:7, contract:'06/27', tag:'Belastung im Griff' },
      { name:'Erik Brandl',     role:'Torwarttrainer',         str:7, contract:'06/27', tag:'eigenständig' },
    ]},
    { id:'scout', title:'Scouting', members:[
      { name:'Holger Kasten',   role:'Chefscout',              str:8, contract:'06/29', tag:'Augen für Junge' },
      { name:'Antonia Wirth',   role:'Scout · Aurelia',        str:7, contract:'06/27', tag:'8 aktive Berichte' },
      { name:'Patrice Lemoine', role:'Scout · Norvania-West',  str:7, contract:'06/28', tag:'3 aktive Berichte' },
      { name:'Mario Conti',     role:'Scout · Norvania-Süd',   str:6, contract:'06/26', tag:'4 aktive Berichte' },
    ]},
    { id:'med', title:'Medizinische Abteilung', members:[
      { name:'Dr. Magdalena Frey', role:'Mannschaftsärztin', str:8, contract:'06/29', tag:'12 Jahre im Verein' },
      { name:'Renata Adler',       role:'Physiotherapie',    str:7, contract:'06/27', tag:'Reiter im Behandlungs­plan' },
      { name:'Boris Niemann',      role:'Physiotherapie',    str:6, contract:'06/26', tag:'Bredow-Reha verantwortlich' },
    ]},
  ];
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{padding:'4px 16px 8px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
          <div>
            <div style={{fontSize:10.5,color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase'}}>12 Personen · 3 Abteilungen</div>
            <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:700, color:t.ink, lineHeight:1}}>Mitarbeiter</SerifH>
          </div>
          <button style={{height:34, padding:'0 10px', borderRadius:9, background:t.card, border:`1px solid ${t.rule}`, color:t.ink, fontWeight:700, fontSize:11, fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:4}}>
            <I.Plus size={13} color={t.ink}/> Einstellen
          </button>
        </div>
      </header>

      <div style={{flex:1, overflowY:'auto', padding:'8px 16px 20px'}}>
        {groups.map((g,gi)=>(
          <React.Fragment key={gi}>
            <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin: gi===0 ? '4px 2px 6px' : '14px 2px 6px'}}>{g.title}</div>
            <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'2px 14px'}}>
              {g.members.map((m,mi)=>{
                const soon = m.contract.startsWith('06/26');
                return (
                  <div key={mi} style={{display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom: mi<g.members.length-1?`1px solid ${t.rule}`:'none'}}>
                    <Portrait name={m.name} theme={theme} scheme={scheme} size={36}/>
                    <div style={{flex:1, minWidth:0}}>
                      <div style={{display:'flex', alignItems:'center', gap:6}}>
                        <SerifH theme={theme} style={{fontSize:13.5, fontWeight:700, color:t.ink}}>{m.name}</SerifH>
                        {m.you && <span style={{fontSize:9, fontWeight:800, color:t.accent, padding:'1px 6px', borderRadius:99, background:t.accentSoft, letterSpacing:.4}}>SIE</span>}
                      </div>
                      <div style={{fontSize:11, color:t.inkMute, marginTop:1}}>{m.role}</div>
                      <div style={{fontSize:10.5, color:t.inkSoft, marginTop:3, fontFamily:THEMES[theme].font, fontStyle:'italic'}}>{m.tag}</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <StrBar n={m.str} theme={theme} scheme={scheme} w={42}/>
                      <div style={{fontSize:10, color: soon?t.danger:t.inkSoft, fontWeight:soon?700:500, marginTop:4, fontFamily:'JetBrains Mono', display:'inline-flex', alignItems:'center', gap:3}}>
                        {soon && <span style={{width:4, height:4, borderRadius:99, background:t.danger}}/>}▸ {m.contract}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  AttrBar, TraitPill, KV, Stat,
  ScreenPlayerDetail, ScreenTraining, ScreenIndividualTraining,
  ScreenMedical, ScreenScouting, ScreenTeams, ScreenStaff,
});
