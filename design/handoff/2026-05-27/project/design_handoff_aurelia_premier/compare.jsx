// compare.jsx — Player comparison, Team comparison, Profi-Modus player detail,
// Role editor. Loaded after team.jsx.

// =================================================================
// 25. PLAYER COMPARISON
// =================================================================
function ScreenPlayerCompare({theme, scheme}){
  const t = THEMES[theme][scheme];
  const tr = useT();
  const isDe = getLocale() === 'de';
  const A = {
    name:'Marek Brody',    pos:'OM', age:26, nat:'DE', str:8, tal:3, form:8.4, value:'14,5 Mio. €', wages:'48.000 € / Mon.',
    attrs:[
      {l:'Spielaufbau',v:8.4},{l:'Abschluss',v:8.1},{l:'Tempo',v:7.8},
      {l:'Mentalität',v:8.9},{l:'Physis',v:7.2},{l:'Defensive',v:4.5},
    ],
    season:{ apps:28, goals:9, assists:12, motm:5, formAvg:'7,8' },
  };
  const B = {
    name:'Tobias Reiter',  pos:'ZM', age:28, nat:'DE', str:8, tal:3, form:8.1, value:'11,2 Mio. €', wages:'42.000 € / Mon.',
    attrs:[
      {l:'Spielaufbau',v:9.0},{l:'Abschluss',v:5.6},{l:'Tempo',v:6.4},
      {l:'Mentalität',v:8.2},{l:'Physis',v:7.6},{l:'Defensive',v:6.8},
    ],
    season:{ apps:30, goals:3, assists:8, motm:2, formAvg:'7,4' },
  };
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{padding:'4px 16px 8px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.ChevronLeft color={t.ink} size={18}/></button>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>{isDe ? 'Vergleichen' : 'Compare'}</div>
            <SerifH theme={theme} style={{fontSize:16, fontWeight:700, color:t.ink}}>{isDe ? 'Spieler an Spieler' : 'Player vs player'}</SerifH>
          </div>
          <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.Plus color={t.ink} size={16}/></button>
        </div>
      </header>

      {/* Two-up header */}
      <div style={{padding:'0 12px'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
          {[A,B].map((p,i)=>(
            <div key={i} style={{background:t.card, border:`1px solid ${i===0?t.accent:t.rule}`, borderRadius:14, padding:'12px 12px'}}>
              <Portrait name={p.name} theme={theme} scheme={scheme} size={48} variant="player"/>
              <SerifH theme={theme} style={{display:'block', fontSize:15, fontWeight:700, color:t.ink, lineHeight:1.05, marginTop:6}}>{p.name}</SerifH>
              <div style={{display:'flex', alignItems:'center', gap:5, marginTop:3}}>
                <PosPill pos={p.pos} theme={theme} scheme={scheme}/>
                <span style={{fontSize:10.5, color:t.inkMute}}>{p.age} J. · {p.nat}</span>
              </div>
              <div style={{marginTop:7}}><StrBar n={p.str} theme={theme} scheme={scheme} w={52}/></div>
              <div style={{display:'flex', justifyContent:'space-between', marginTop:7, fontSize:10.5, color:t.inkMute, fontWeight:600}}>
                <span>Form</span>
                <span style={{fontFamily:'JetBrains Mono', color:t.ok, fontWeight:800}}>{p.form.toString().replace('.', ',')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bidirectional attribute bars */}
      <div style={{flex:1, overflowY:'auto', padding:'12px 16px 16px'}}>
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', marginBottom:6}}>Attribute · Δ rechts/links</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'4px 12px'}}>
          {A.attrs.map((a,i)=>{
            const b = B.attrs[i];
            const max = 10;
            return (
              <div key={i} style={{padding:'10px 0', borderBottom: i<A.attrs.length-1?`1px solid ${t.rule}`:'none'}}>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, marginBottom:6}}>
                  <span style={{fontFamily:'JetBrains Mono', fontSize:13, fontWeight:800, color: a.v>b.v?t.ok:t.inkSoft, width:30, textAlign:'right'}}>{a.v.toString().replace('.', ',')}</span>
                  <span style={{flex:1, textAlign:'center', fontSize:11, fontWeight:700, color:t.ink}}>{a.l}</span>
                  <span style={{fontFamily:'JetBrains Mono', fontSize:13, fontWeight:800, color: b.v>a.v?t.ok:t.inkSoft, width:30}}>{b.v.toString().replace('.', ',')}</span>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:4}}>
                  {/* left bar (mirrored) */}
                  <div style={{flex:1, height:6, background:t.bgInk, borderRadius:99, overflow:'hidden', display:'flex', justifyContent:'flex-end'}}>
                    <div style={{width:`${(a.v/max)*100}%`, height:'100%', background: a.v>=b.v?t.accent:t.inkMute}}/>
                  </div>
                  <span style={{fontFamily:'JetBrains Mono', fontSize:10, fontWeight:800, color: a.v===b.v?t.inkSoft : (a.v>b.v?t.ok:t.warn), minWidth:32, textAlign:'center'}}>
                    {a.v===b.v ? '=' : (a.v>b.v?'+':'') + (a.v-b.v).toFixed(1).replace('.', ',')}
                  </span>
                  <div style={{flex:1, height:6, background:t.bgInk, borderRadius:99, overflow:'hidden'}}>
                    <div style={{width:`${(b.v/max)*100}%`, height:'100%', background: b.v>=a.v?t.accent:t.inkMute}}/>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Season stat comparison */}
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'14px 2px 6px'}}>Saison 2026/27</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'4px 12px'}}>
          {[
            {l:'Spiele',   a:A.season.apps, b:B.season.apps},
            {l:'Tore',     a:A.season.goals, b:B.season.goals},
            {l:'Vorlagen', a:A.season.assists, b:B.season.assists},
            {l:'MOTM',     a:A.season.motm, b:B.season.motm},
            {l:'Form ⌀',   a:A.season.formAvg, b:B.season.formAvg, str:true},
          ].map((s,i,arr)=>(
            <div key={i} style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', padding:'8px 0', borderBottom: i<arr.length-1?`1px solid ${t.rule}`:'none'}}>
              <span style={{fontFamily:'JetBrains Mono', fontSize:13, fontWeight:800, color:t.ink, width:40, textAlign:'right'}}>{s.a}</span>
              <span style={{flex:1, textAlign:'center', fontSize:11, color:t.inkMute}}>{s.l}</span>
              <span style={{fontFamily:'JetBrains Mono', fontSize:13, fontWeight:800, color:t.ink, width:40}}>{s.b}</span>
            </div>
          ))}
        </div>

        {/* Cost comparison */}
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'14px 2px 6px'}}>Kosten & Wert</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'4px 12px'}}>
          <CmpKV theme={theme} scheme={scheme} k="Marktwert" a={A.value} b={B.value}/>
          <CmpKV theme={theme} scheme={scheme} k="Monatsgehalt" a={A.wages} b={B.wages} last/>
        </div>

        {/* Recommendation */}
        <div style={{marginTop:12, background:t.accentSoft, border:`1px solid ${t.accent}`, borderRadius:14, padding:'12px 14px'}}>
          <div style={{display:'flex', alignItems:'flex-start', gap:10}}>
            <I.TrendUp size={20} color={t.accent}/>
            <div>
              <SerifH theme={theme} style={{fontSize:13, fontWeight:800, color:t.accent, display:'block'}}>{isDe ? 'Empfehlung des Chef-Scouts' : 'Head scout’s pick'}</SerifH>
              <div style={{fontSize:12, color:t.ink, marginTop:3, fontFamily:THEMES[theme].font, fontStyle:'italic', lineHeight:1.4}}>
                „Brody bringt die Tore — Reiter den Takt. Für ein Spiel gegen Northbridge in Topform: <b style={{fontStyle:'normal', color:t.accent}}>beide aufstellen</b>."
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CmpKV({theme, scheme, k, a, b, last}){
  const t = THEMES[theme][scheme];
  return (
    <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', padding:'8px 0', borderBottom: last?'none':`1px solid ${t.rule}`}}>
      <span style={{fontFamily:'JetBrains Mono', fontSize:12, fontWeight:700, color:t.ink, width:90, textAlign:'right'}}>{a}</span>
      <span style={{flex:1, textAlign:'center', fontSize:11, color:t.inkMute}}>{k}</span>
      <span style={{fontFamily:'JetBrains Mono', fontSize:12, fontWeight:700, color:t.ink, width:90}}>{b}</span>
    </div>
  );
}

// =================================================================
// 26. TEAM COMPARISON
// =================================================================
function ScreenTeamCompare({theme, scheme}){
  const t = THEMES[theme][scheme];
  const tr = useT();
  const isDe = getLocale() === 'de';
  const TA = { name:'FC Hafenstadt',   crest:crestFor('FC Hafenstadt'),
    rank:2,  pts:62, form:'SSNSU', avgStr:7.6, gd:'+24', sponsor:'Volta Bank',
    salaries:34_920_000, attendance:25_640, keyPlayers:['Brody','Reiter','Wieser'] };
  const TB = { name:'Northbridge City', crest:crestFor('Northbridge City'),
    rank:4,  pts:54, form:'SUNSU', avgStr:7.4, gd:'+12', sponsor:'Korex Mobil',
    salaries:28_400_000, attendance:18_220, keyPlayers:['Tarrant','Halligan','Ouellet'] };
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{padding:'4px 16px 8px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.ChevronLeft color={t.ink} size={18}/></button>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>{isDe ? 'Vergleichen' : 'Compare'}</div>
            <SerifH theme={theme} style={{fontSize:16, fontWeight:700, color:t.ink}}>{isDe ? 'Klub an Klub' : 'Club vs club'}</SerifH>
          </div>
          <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.More color={t.ink} size={16}/></button>
        </div>
      </header>

      {/* Crests row */}
      <div style={{padding:'0 16px'}}>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'14px', display:'grid', gridTemplateColumns:'1fr auto 1fr', gap:12, alignItems:'center'}}>
          <div style={{textAlign:'left'}}>
            <Crest {...TA.crest} size={56}/>
            <SerifH theme={theme} style={{display:'block', fontSize:15, fontWeight:700, color:t.ink, lineHeight:1.05, marginTop:6}}>{TA.name}</SerifH>
            <div style={{fontSize:11, color:t.inkMute, marginTop:2}}>{TA.rank}. Platz · {TA.pts} Pkt.</div>
          </div>
          <SerifH theme={theme} style={{fontSize:28, fontWeight:700, color:t.inkSoft, fontStyle:'italic'}}>vs.</SerifH>
          <div style={{textAlign:'right'}}>
            <div style={{display:'flex', justifyContent:'flex-end'}}><Crest {...TB.crest} size={56}/></div>
            <SerifH theme={theme} style={{display:'block', fontSize:15, fontWeight:700, color:t.ink, lineHeight:1.05, marginTop:6}}>{TB.name}</SerifH>
            <div style={{fontSize:11, color:t.inkMute, marginTop:2}}>{TB.rank}. Platz · {TB.pts} Pkt.</div>
          </div>
        </div>
      </div>

      <div style={{flex:1, overflowY:'auto', padding:'12px 16px 16px'}}>
        {/* Radar — 6 axes */}
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', marginBottom:6}}>Stärken-Spinne</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'14px', display:'flex', alignItems:'center', gap:14}}>
          <TeamRadar theme={theme} scheme={scheme}/>
          <div style={{flex:1, fontSize:11, color:t.inkMute, lineHeight:1.5}}>
            <div style={{display:'flex', alignItems:'center', gap:6}}><span style={{width:10, height:10, borderRadius:2, background:t.accent}}/><b style={{color:t.ink}}>Hafenstadt</b></div>
            <div style={{display:'flex', alignItems:'center', gap:6, marginTop:4}}><span style={{width:10, height:10, borderRadius:2, background:t.inkMute}}/><b style={{color:t.ink}}>Northbridge</b></div>
            <div style={{marginTop:8, fontFamily:THEMES[theme].font, fontStyle:'italic', fontSize:11}}>„Wir sind kreativer, sie sind stabiler hinten."</div>
          </div>
        </div>

        {/* Comparison rows */}
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'14px 2px 6px'}}>Kennzahlen</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'4px 12px'}}>
          <CmpRow theme={theme} scheme={scheme} k="Stärke ⌀"     a="7,6" b="7,4" winner="a"/>
          <CmpRow theme={theme} scheme={scheme} k="Tordifferenz" a={TA.gd} b={TB.gd} winner="a"/>
          <CmpRow theme={theme} scheme={scheme} k="Form (letzte 5)" a={<FormStrip form={TA.form} theme={theme} scheme={scheme}/>} b={<FormStrip form={TB.form} theme={theme} scheme={scheme}/>}/>
          <CmpRow theme={theme} scheme={scheme} k="Zuschauerschnitt" a={`${new Intl.NumberFormat('de-DE').format(TA.attendance)}`} b={`${new Intl.NumberFormat('de-DE').format(TB.attendance)}`} winner="a"/>
          <CmpRow theme={theme} scheme={scheme} k="Gehaltsbudget" a={`${(TA.salaries/1_000_000).toFixed(1).replace('.', ',')} Mio. €`} b={`${(TB.salaries/1_000_000).toFixed(1).replace('.', ',')} Mio. €`} winner="a" last/>
        </div>

        {/* Key player matchup */}
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'14px 2px 6px'}}>Schlüsseldue­lle</div>
        {[
          {a:'Brody · OM',    av:8, b:'Halligan · ZM', bv:7, note:'Brody zieht hinter die Spitzen'},
          {a:'Wieser · ST',   av:7, b:'Tarrant · ST',  bv:8, note:'Wer trifft zuerst, gewinnt'},
          {a:'Wendling · TW', av:7, b:'Ouellet · TW',  bv:7, note:'Zwei Routiniers — Standards entscheiden'},
        ].map((d,i)=>(
          <div key={i} style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'10px 12px', marginBottom:6}}>
            <div style={{display:'grid', gridTemplateColumns:'1fr auto 1fr', alignItems:'center', gap:8}}>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:12, fontWeight:700, color:t.ink}}>{d.a}</div>
                <StrBar n={d.av} theme={theme} scheme={scheme} w={48}/>
              </div>
              <SerifH theme={theme} style={{fontSize:16, fontWeight:700, color:t.inkSoft, fontStyle:'italic'}}>vs.</SerifH>
              <div>
                <div style={{fontSize:12, fontWeight:700, color:t.ink}}>{d.b}</div>
                <StrBar n={d.bv} theme={theme} scheme={scheme} w={48}/>
              </div>
            </div>
            <div style={{fontSize:11, color:t.inkMute, marginTop:6, fontFamily:THEMES[theme].font, fontStyle:'italic', textAlign:'center'}}>{d.note}</div>
          </div>
        ))}

        {/* Head to head */}
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'14px 2px 6px'}}>Direktduelle · letzte 5</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'10px 14px'}}>
          <div style={{display:'flex', alignItems:'center', gap:8, fontFamily:'JetBrains Mono', fontSize:13, fontWeight:700}}>
            <span style={{color:t.inkMute, width:32}}>FCH</span>
            <div style={{display:'flex', gap:3, flex:1}}>
              {[{c:'S',l:'2:1'},{c:'U',l:'1:1'},{c:'N',l:'0:2'},{c:'S',l:'3:1'},{c:'S',l:'2:0'}].map((x,i)=>{
                const col = x.c==='S' ? t.ok : x.c==='N' ? t.danger : t.warn;
                return (
                  <div key={i} style={{flex:1, padding:'6px 0', borderRadius:5, background:col, color:'#fff', textAlign:'center'}}>
                    <div style={{fontSize:10, fontWeight:800}}>{x.c}</div>
                    <div style={{fontSize:9, opacity:.8}}>{x.l}</div>
                  </div>
                );
              })}
            </div>
            <span style={{color:t.inkMute, width:32, textAlign:'right'}}>NBC</span>
          </div>
        </div>
      </div>
    </div>
  );
}
function CmpRow({theme, scheme, k, a, b, winner, last}){
  const t = THEMES[theme][scheme];
  return (
    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 0', borderBottom: last?'none':`1px solid ${t.rule}`, gap:8}}>
      <div style={{width:92, textAlign:'right', fontFamily:'JetBrains Mono', fontSize:13, fontWeight:800, color: winner==='a' ? t.accent : t.ink}}>{a}</div>
      <div style={{flex:1, textAlign:'center', fontSize:10.5, color:t.inkMute, textTransform:'uppercase', letterSpacing:.5, fontWeight:700}}>{k}</div>
      <div style={{width:92, textAlign:'left', fontFamily:'JetBrains Mono', fontSize:13, fontWeight:800, color: winner==='b' ? t.accent : t.ink}}>{b}</div>
    </div>
  );
}
function TeamRadar({theme, scheme}){
  const t = THEMES[theme][scheme];
  // 6 axes: Angriff, Konter, Standards, Defensive, Mittelfeld, Mentalität
  const axes = ['Angriff','Konter','Stand.','Def.','Mittelf.','Mental.'];
  const A = [8.2, 7.8, 7.0, 7.2, 8.6, 8.0];
  const B = [7.6, 8.4, 7.4, 8.0, 6.8, 7.2];
  const cx=80, cy=80, R=64;
  const point = (val, i) => {
    const a = -Math.PI/2 + (i/axes.length)*Math.PI*2;
    const r = (val/10)*R;
    return [cx + Math.cos(a)*r, cy + Math.sin(a)*r];
  };
  const polyD = (vals) => vals.map((v,i)=>{
    const [x,y] = point(v,i);
    return (i===0?'M':'L') + x.toFixed(1) + ' ' + y.toFixed(1);
  }).join(' ') + ' Z';
  return (
    <svg viewBox="0 0 160 160" style={{width:140, height:140, flex:'0 0 140px'}}>
      {/* grid rings */}
      {[2,4,6,8,10].map(v=>(
        <polygon key={v} fill="none" stroke={t.rule} strokeWidth=".5"
          points={axes.map((_,i)=>{
            const [x,y] = point(v,i);
            return `${x},${y}`;
          }).join(' ')}/>
      ))}
      {/* axes */}
      {axes.map((label,i)=>{
        const [x,y] = point(10, i);
        const [lx,ly] = point(12, i);
        return (
          <g key={i}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke={t.rule} strokeWidth=".5"/>
            <text x={lx} y={ly+2} textAnchor="middle" fontFamily="Inter" fontSize="6.5" fontWeight="700" fill={t.inkMute}>{label}</text>
          </g>
        );
      })}
      {/* B */}
      <path d={polyD(B)} fill={t.inkMute} fillOpacity=".22" stroke={t.inkMute} strokeWidth="1.2"/>
      {/* A */}
      <path d={polyD(A)} fill={t.accent} fillOpacity=".22" stroke={t.accent} strokeWidth="1.4"/>
      {A.map((v,i)=>{
        const [x,y] = point(v,i);
        return <circle key={i} cx={x} cy={y} r="2" fill={t.accent}/>;
      })}
    </svg>
  );
}

// =================================================================
// 27. PROFI-MODUS — full attribute grid for power users
// =================================================================
function ScreenPlayerDetailPro({theme, scheme}){
  const t = THEMES[theme][scheme];
  const tr = useT();
  const isDe = getLocale() === 'de';
  // 1–20 attributes grouped into Technik / Mental / Physis / Torwart-spez./Pos-spec
  const groups = [
    { id:'tech', l:'Technik', a:[
      ['Erste Annahme',16],['Passspiel',17],['Direktspiel',15],['Dribbling',13],
      ['Schusskraft',15],['Schusspräzision',16],['Kopfball',9],['Standards',14],
      ['Flanken',12],['Technik',16],
    ]},
    { id:'ment', l:'Mental', a:[
      ['Übersicht',18],['Entscheidungen',16],['Vorlagen',17],['Konzentration',13],
      ['Antizipation',14],['Druckresistenz',12],['Aggression',9],['Führung',15],
      ['Teamarbeit',12],['Mut',12],['Arbeitsrate',11],
    ]},
    { id:'phys', l:'Physis', a:[
      ['Geschwindigkeit',14],['Beschleunigung',15],['Sprungkraft',10],['Ausdauer',13],
      ['Kraft',11],['Wendigkeit',15],['Balance',14],['Natural Fitness',16],
    ]},
    { id:'pos', l:'Positions-spezifisch · OM', a:[
      ['Halbraum-Bewegung',17],['Diagonalpässe',15],['Schussdrang aus 2. Reihe',14],
      ['Strafraum-Timing',14],['Verbindungs­spiel',16],
    ]},
  ];
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%', position:'relative'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{padding:'4px 16px 8px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.ChevronLeft color={t.ink} size={18}/></button>
          <div style={{display:'flex', alignItems:'center', gap:8}}>
            <span style={{fontSize:9, fontWeight:800, color:t.accent, padding:'3px 8px', borderRadius:99, background:t.accentSoft, letterSpacing:.7}}>{isDe ? 'PROFI-MODUS' : 'PRO MODE'}</span>
            <SerifH theme={theme} style={{fontSize:16, fontWeight:700, color:t.ink}}>Brody · 1–20</SerifH>
          </div>
          <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.More color={t.ink} size={16}/></button>
        </div>
      </header>

      {/* Compact header strip */}
      <div style={{padding:'0 16px'}}>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'10px 14px', display:'flex', alignItems:'center', gap:10}}>
          <Portrait name="Marek Brody" theme={theme} scheme={scheme} size={42} variant="player"/>
          <div style={{flex:1}}>
            <SerifH theme={theme} style={{fontSize:14, fontWeight:700, color:t.ink, lineHeight:1.05}}>Marek Brody</SerifH>
            <div style={{fontSize:10.5, color:t.inkMute, marginTop:2, display:'flex', alignItems:'center', gap:6}}>
              <PosPill pos="OM" theme={theme} scheme={scheme}/>
              <span>26 J. · DE · #10</span>
            </div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:9.5, color:t.inkMute, fontWeight:700, letterSpacing:.4, textTransform:'uppercase'}}>{isDe ? 'Gesamt' : 'Overall'}</div>
            <SerifH theme={theme} style={{fontSize:20, fontWeight:800, color:t.ink, fontFamily:'JetBrains Mono', lineHeight:1}}>15,8<span style={{color:t.inkSoft, fontSize:11, fontWeight:500}}>/20</span></SerifH>
          </div>
        </div>
        {/* Pro mode banner */}
        <div style={{marginTop:8, padding:'8px 12px', background:t.bgInk, borderRadius:10, display:'flex', alignItems:'center', gap:8, fontSize:11, color:t.inkMute, fontFamily:THEMES[theme].font, fontStyle:'italic'}}>
          <I.Settings size={14} color={t.inkMute}/>
          <span style={{flex:1}}>Profi-Modus zeigt alle Attribute auf 1–20. <a href="#" style={{color:t.accent, fontWeight:700, fontStyle:'normal'}}>Zurück zur Kompaktansicht</a></span>
        </div>
      </div>

      <div style={{flex:1, overflowY:'auto', padding:'10px 16px 16px'}}>
        {groups.map((g,i)=>(
          <React.Fragment key={i}>
            <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', padding:'10px 2px 6px'}}>
              <span style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>{g.l}</span>
              <span style={{fontSize:10, color:t.inkSoft, fontFamily:'JetBrains Mono'}}>{g.a.length} Werte</span>
            </div>
            <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'4px 12px'}}>
              {g.a.map(([l,v],j)=>(
                <Attr20 key={j} theme={theme} scheme={scheme} label={l} value={v} last={j===g.a.length-1}/>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
function Attr20({theme, scheme, label, value, last}){
  const t = THEMES[theme][scheme];
  // 20 cells, color tiers
  const cells = Array.from({length:20});
  const tier = value>=17 ? t.ok : value>=13 ? t.ink : value>=9 ? t.warn : t.danger;
  return (
    <div style={{display:'flex', alignItems:'center', gap:8, padding:'7px 0', borderBottom: last?'none':`1px solid ${t.rule}`}}>
      <span style={{flex:1, fontSize:12, color:t.ink, fontWeight:600}}>{label}</span>
      <div style={{display:'flex', gap:1.5}}>
        {cells.map((_,i)=>(
          <div key={i} style={{width:5, height:10, borderRadius:1, background: i<value ? tier : t.rule}}/>
        ))}
      </div>
      <span style={{fontFamily:'JetBrains Mono', fontSize:12, fontWeight:800, color:tier, width:24, textAlign:'right', fontVariantNumeric:'tabular-nums'}}>{value}</span>
    </div>
  );
}

// =================================================================
// 28. ROLLEN-EDITOR — position role + behaviour
// =================================================================
function ScreenRoleEditor({theme, scheme}){
  const t = THEMES[theme][scheme];
  const tr = useT();
  const isDe = getLocale() === 'de';
  // Roles indexed by base position
  const ROLES = {
    OM: [
      { id:'10er',         l:'Klassischer Zehner',  d:'Bindet das Spiel zwischen den Linien — wartet auf den Raum hinter den Spitzen.', weights:{ Spielaufbau:90, Abschluss:60, Mentalität:70, Defensive:25 } },
      { id:'spielmacher',  l:'Spielmacher',         d:'Holt den Ball ab, diktiert das Tempo, sucht die Lücke zwischen Mittellinie und Strafraum.', weights:{ Spielaufbau:95, Abschluss:50, Mentalität:80, Defensive:30 } },
      { id:'trequartista', l:'Trequartista',        d:'Frei zwischen den Reihen — keine Defensivpflicht, eigene Räume zaubern.', weights:{ Spielaufbau:88, Abschluss:75, Mentalität:65, Defensive:10 } },
      { id:'schatten',     l:'Schattenstürmer',     d:'Geistert hinter der Spitze, sucht den Strafraum und nicht die Spielgestaltung.', weights:{ Spielaufbau:55, Abschluss:88, Mentalität:75, Defensive:25 } },
      { id:'halbflug',     l:'Halbflügelspieler',   d:'Versetzt sich in den Halbraum, kombiniert mit Außen und Stürmer.', weights:{ Spielaufbau:78, Abschluss:65, Mentalität:60, Defensive:45 } },
    ],
    IV: [
      { id:'klassisch',    l:'Klassischer Innenverteidiger', d:'Räumt vor dem Tor auf — köpft, blockt, klärt.', weights:{ Defensive:92, Spielaufbau:55, Physis:80, Mentalität:65 } },
      { id:'ballspielend', l:'Ballspielender Innenverteidiger', d:'Eröffnet das Spiel mit dem ersten Pass, sucht die Schnittstelle.', weights:{ Defensive:78, Spielaufbau:88, Physis:65, Mentalität:75 } },
      { id:'kompromiss',   l:'Kompromissloser Innenverteidiger', d:'Geht in jeden Zweikampf — verlässt sich auf Härte, nicht auf Antizipation.', weights:{ Defensive:95, Spielaufbau:35, Physis:92, Mentalität:60 } },
      { id:'libero',       l:'Libero',              d:'Letzte Reihe und erster Aufbauer in einem — viel Raum hinter sich.', weights:{ Defensive:85, Spielaufbau:90, Physis:75, Mentalität:85 } },
    ],
    DM: [
      { id:'abraeumer', l:'Abräumer',           d:'Zerstört Kombinationen vor der Abwehr, hält Räume klein.', weights:{ Defensive:92, Spielaufbau:55, Physis:85, Mentalität:60 } },
      { id:'regista',   l:'Tiefer Spielmacher · Regista', d:'Dirigiert das Spiel aus dem Sechserraum, lange Bälle und Wechsel.', weights:{ Defensive:60, Spielaufbau:95, Physis:60, Mentalität:80 } },
      { id:'b2b',       l:'Box-to-Box',         d:'Pendelt zwischen den Strafräumen — alles ein bisschen, nichts ausgelassen.', weights:{ Defensive:75, Spielaufbau:75, Physis:88, Mentalität:75 } },
    ],
  };
  const [pos, setPos] = React.useState('OM');
  const [role, setRole] = React.useState('spielmacher');
  const [behav, setBehav] = React.useState('ausgewogen');
  const roles = ROLES[pos] || [];
  const active = roles.find(r=>r.id===role) || roles[0];
  // Suitability: how Brody's actual attributes fit the active role
  const playerAttrs = { Spielaufbau:84, Abschluss:81, Tempo:78, Mentalität:89, Physis:72, Defensive:45 };
  const suit = active ? Math.round(
    Object.entries(active.weights).reduce((acc,[k,w])=>{
      const v = playerAttrs[k] ?? 50;
      return acc + (v/100)*w;
    },0) / Object.values(active.weights).reduce((a,b)=>a+b,0) * 100
  ) : 0;
  const suitColor = suit>=80 ? t.ok : suit>=65 ? t.warn : t.danger;

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%', position:'relative'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{padding:'4px 16px 8px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.ChevronLeft color={t.ink} size={18}/></button>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>{isDe ? 'Rolle wählen für' : 'Pick role for'}</div>
            <SerifH theme={theme} style={{fontSize:16, fontWeight:700, color:t.ink}}>Marek Brody · #10</SerifH>
          </div>
          <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.Check color={t.accent} size={16}/></button>
        </div>
      </header>

      {/* Position chooser */}
      <div style={{padding:'0 12px 6px'}}>
        <div style={{display:'flex', gap:5, overflowX:'auto', paddingBottom:4}}>
          {Object.keys(ROLES).map(p=>(
            <button key={p} onClick={()=>{setPos(p); setRole(ROLES[p][0].id);}} style={{
              flex:'0 0 auto', minWidth:50, padding:'8px 14px',
              borderRadius:9, border:`1px solid ${pos===p?t.ink:t.rule}`,
              background: pos===p?t.ink:t.card, color: pos===p?t.bg:t.ink,
              fontFamily:'JetBrains Mono', fontWeight:700, fontSize:12
            }}>{p}</button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{flex:1, overflowY:'auto', padding:'4px 16px 110px'}}>
        {/* Roles */}
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', marginBottom:6}}>Rolle</div>
        {roles.map((r,i)=>{
          const isActive = r.id === role;
          return (
            <button key={r.id} onClick={()=>setRole(r.id)} style={{
              display:'block', width:'100%', textAlign:'left', cursor:'pointer',
              background: isActive ? t.accentSoft : t.card,
              border:`1px solid ${isActive ? t.accent : t.rule}`,
              borderRadius:14, padding:'12px 14px', marginBottom:8,
              fontFamily:'inherit'
            }}>
              <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between'}}>
                <SerifH theme={theme} style={{fontSize:14.5, fontWeight:700, color: isActive ? t.accent : t.ink}}>{r.l}</SerifH>
                {isActive && <I.Check size={16} color={t.accent}/>}
              </div>
              <div style={{fontSize:11.5, color:t.inkMute, marginTop:3, fontFamily:THEMES[theme].font, fontStyle:'italic', lineHeight:1.35}}>{r.d}</div>
              {/* Attribute weight strip */}
              <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'4px 14px', marginTop:8}}>
                {Object.entries(r.weights).map(([k,v])=>(
                  <div key={k} style={{display:'flex', alignItems:'center', gap:6}}>
                    <span style={{fontSize:10, color: isActive ? t.accent : t.inkMute, fontWeight:700, flex:'0 0 60px'}}>{k}</span>
                    <div style={{flex:1, height:4, background:t.bgInk, borderRadius:99, overflow:'hidden'}}>
                      <div style={{width:v+'%', height:'100%', background: isActive ? t.accent : t.inkMute}}/>
                    </div>
                  </div>
                ))}
              </div>
            </button>
          );
        })}

        {/* Behaviour */}
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'12px 2px 6px'}}>Verhalten</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'0 14px'}}>
          <Seg theme={theme} scheme={scheme} label="Risikoverhalten" value={behav} onChange={setBehav}
            opts={[{id:'defensiv',l:'Defensiv'},{id:'ausgewogen',l:'Ausgewogen'},{id:'offensiv',l:'Offensiv'}]}/>
          <Seg theme={theme} scheme={scheme} label="Bewegungsfreiheit" value="rolle" onChange={()=>{}}
            opts={[{id:'streng',l:'An der Position'},{id:'rolle',l:'Im Rollenraum'},{id:'frei',l:'Freie Rolle'}]}/>
          <TacticToggle theme={theme} scheme={scheme} label="Tor­abschlüsse aus 2. Reihe" on={true} onChange={()=>{}}/>
          <TacticToggle theme={theme} scheme={scheme} label="Dribbling bei Aussichtslosigkeit" on={false} onChange={()=>{}}/>
        </div>
      </div>

      {/* Sticky suitability + CTA */}
      <div style={{position:'absolute', left:0, right:0, bottom:0, padding:'10px 16px 22px', background:`linear-gradient(to top, ${t.bg} 80%, transparent)`, display:'flex', gap:10, alignItems:'center'}}>
        <div style={{flex:1, background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'8px 10px'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
            <span style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.4, textTransform:'uppercase'}}>Eignung</span>
            <span style={{fontFamily:'JetBrains Mono', fontSize:14, fontWeight:800, color:suitColor}}>{suit} %</span>
          </div>
          <div style={{height:4, marginTop:5, background:t.bgInk, borderRadius:99, overflow:'hidden'}}>
            <div style={{width:suit+'%', height:'100%', background:suitColor}}/>
          </div>
        </div>
        <button style={{height:50, padding:'0 18px', borderRadius:14, background:t.ink, color:t.bg, border:'none', fontWeight:800, fontSize:14, fontFamily:'inherit'}}>Übernehmen</button>
      </div>
    </div>
  );
}

Object.assign(window, {
  ScreenPlayerCompare, ScreenTeamCompare, ScreenPlayerDetailPro, ScreenRoleEditor,
  TeamRadar, Attr20, CmpKV, CmpRow,
});
