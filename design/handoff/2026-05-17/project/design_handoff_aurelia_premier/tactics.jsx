// tactics.jsx — three deeper screens: detailed tactics, lineup with position
// swap, and a statistics dashboard. Loaded after negotiations.jsx.

// ---------- SHARED TACTICS PRIMITIVES ----------
function TSlider({theme, scheme, label, value, onChange, leftL, rightL, hint, mid}){
  const t = THEMES[theme][scheme];
  return (
    <div style={{padding:'12px 0', borderBottom:`1px solid ${t.rule}`}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
        <span style={{fontSize:12.5, fontWeight:700, color:t.ink}}>{label}</span>
        <span style={{fontSize:11.5, color:t.accent, fontFamily:'JetBrains Mono', fontWeight:700}}>{hint}</span>
      </div>
      <div style={{position:'relative', height:30, marginTop:6}}>
        <div style={{position:'absolute', top:13, left:0, right:0, height:4, background:t.bgInk, borderRadius:99}}/>
        <div style={{position:'absolute', top:13, left:0, width:value+'%', height:4, background:t.accent, borderRadius:99}}/>
        {mid && <div style={{position:'absolute', top:11, left:'50%', width:1, height:8, background:t.inkSoft, opacity:.6}}/>}
        <div style={{position:'absolute', top:6, left:`calc(${value}% - 9px)`, width:18, height:18, borderRadius:99, background:t.card, border:`2px solid ${t.accent}`, boxShadow:`0 1px 3px ${t.ink}30`}}/>
        <input type="range" min="0" max="100" value={value}
          onChange={e=>onChange(+e.target.value)}
          style={{position:'absolute', inset:0, opacity:0, cursor:'pointer'}}/>
      </div>
      <div style={{display:'flex', justifyContent:'space-between', fontSize:10, color:t.inkSoft, marginTop:2}}>
        <span>{leftL}</span><span>{rightL}</span>
      </div>
    </div>
  );
}

function Seg({theme, scheme, opts, value, onChange, label}){
  const t = THEMES[theme][scheme];
  return (
    <div style={{padding:'10px 0', borderBottom:`1px solid ${t.rule}`}}>
      {label && <div style={{fontSize:12.5, fontWeight:700, color:t.ink, marginBottom:6}}>{label}</div>}
      <div style={{display:'flex', gap:4, padding:3, background:t.bgInk, borderRadius:9}}>
        {opts.map(o=>(
          <button key={o.id} onClick={()=>onChange(o.id)} style={{
            flex:1, padding:'7px 0', borderRadius:7, border:'none',
            background: value===o.id ? t.card : 'transparent',
            color: value===o.id ? t.ink : t.inkMute,
            boxShadow: value===o.id ? `0 1px 0 ${t.rule}` : 'none',
            fontFamily:'inherit', fontWeight:700, fontSize:11
          }}>{o.l}</button>
        ))}
      </div>
    </div>
  );
}

function TacticToggle({theme, scheme, label, on, onChange, hint}){
  const t = THEMES[theme][scheme];
  return (
    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:`1px solid ${t.rule}`}}>
      <div>
        <div style={{fontSize:12.5, fontWeight:700, color:t.ink}}>{label}</div>
        {hint && <div style={{fontSize:11, color:t.inkMute, marginTop:2}}>{hint}</div>}
      </div>
      <button onClick={()=>onChange(!on)} style={{
        width:42, height:24, borderRadius:99, border:'none',
        background: on ? t.accent : t.bgInk,
        position:'relative', cursor:'pointer'
      }}>
        <span style={{
          position:'absolute', top:2, left: on ? 20 : 2,
          width:20, height:20, borderRadius:99,
          background:'#fff', transition:'left .15s',
          boxShadow:'0 1px 3px rgba(0,0,0,.2)'
        }}/>
      </button>
    </div>
  );
}

// =================================================================
// 15. TACTICS — detailed
// =================================================================
function ScreenTactics({theme, scheme}){
  const t = THEMES[theme][scheme];
  const [tab, setTab] = React.useState('angriff');
  const [preset, setPreset] = React.useState('balanced');
  // attack
  const [tempo, setTempo] = React.useState(64);
  const [breite, setBreite] = React.useState(72);
  const [trigger, setTrigger] = React.useState('mittel');
  const [konter, setKonter] = React.useState(50);
  const [flank, setFlank] = React.useState('beide');
  const [schuss, setSchuss] = React.useState(58);
  // defence
  const [linie, setLinie] = React.useState('hoch');
  const [pressInt, setPressInt] = React.useState(70);
  const [orient, setOrient] = React.useState('raum');
  const [foul, setFoul] = React.useState('fair');
  const [offside, setOffside] = React.useState(true);
  // transition
  const [aufbau, setAufbau] = React.useState('mix');
  const [transTempo, setTransTempo] = React.useState(72);
  const [gegen, setGegen] = React.useState(true);
  const [rule, setRule] = React.useState('8s');

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <ScreenHeader theme={theme} scheme={scheme}
        kicker={`Taktik · gespeichert „Hafenstadt-Standard"`}
        title="Taktik"
        right={
          <button style={{height:34, padding:'0 10px', borderRadius:9, background:t.card, border:`1px solid ${t.rule}`, color:t.ink, fontWeight:700, fontSize:11, fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:4}}>
            <I.Plus size={13} color={t.ink}/> Speichern
          </button>
        }/>

      {/* Preset row */}
      <div style={{padding:'6px 12px 0'}}>
        <div style={{display:'flex', gap:6, overflowX:'auto', paddingBottom:6}}>
          {[
            {id:'balanced', l:'Ausgeglichen', sub:'10·10·10'},
            {id:'press',    l:'Hochpressing', sub:'80·85·40'},
            {id:'konter',   l:'Konter',       sub:'40·55·80'},
            {id:'tiki',     l:'Spielkontrolle', sub:'70·40·30'},
            {id:'park',     l:'Defensiv',     sub:'20·30·15'},
          ].map(p=>(
            <button key={p.id} onClick={()=>setPreset(p.id)} style={{
              flex:'0 0 auto', minWidth:96, padding:'8px 10px',
              borderRadius:10, border:`1px solid ${preset===p.id?t.ink:t.rule}`,
              background: preset===p.id?t.ink:t.card, color: preset===p.id?t.bg:t.ink,
              fontFamily:'inherit', textAlign:'left'
            }}>
              <div style={{fontSize:12, fontWeight:800}}>{p.l}</div>
              <div style={{fontSize:9.5, color: preset===p.id?t.bgInk:t.inkMute, fontFamily:'JetBrains Mono', marginTop:1}}>{p.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{padding:'4px 12px 0'}}>
        <div style={{display:'flex', gap:4, padding:3, background:t.bgInk, borderRadius:10}}>
          {[
            {id:'angriff',     l:'Angriff'},
            {id:'verteidigung',l:'Verteidigung'},
            {id:'uebergang',   l:'Übergang'},
            {id:'standards',   l:'Standards'},
          ].map(o=>(
            <button key={o.id} onClick={()=>setTab(o.id)} style={{
              flex:1, padding:'7px 0', borderRadius:7, border:'none',
              background: tab===o.id ? t.card : 'transparent',
              color: tab===o.id ? t.ink : t.inkMute,
              boxShadow: tab===o.id ? `0 1px 0 ${t.rule}` : 'none',
              fontFamily:'inherit', fontWeight:700, fontSize:11
            }}>{o.l}</button>
          ))}
        </div>
      </div>

      <div style={{flex:1, overflowY:'auto', padding:'10px 16px 24px'}}>
        {tab === 'angriff' && (
          <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'0 14px'}}>
            <TSlider theme={theme} scheme={scheme} label="Tempo im Angriff" value={tempo} onChange={setTempo} leftL="kontrolliert" rightL="direkt" hint={tempo>70?'sehr direkt':tempo>40?'ausgewogen':'kontrolliert'}/>
            <TSlider theme={theme} scheme={scheme} label="Spielbreite" value={breite} onChange={setBreite} leftL="zentriert" rightL="weit über die Flügel" hint={breite>70?'flügel­lastig':breite>40?'breit':'zentral'}/>
            <Seg theme={theme} scheme={scheme} label="Pressing-Auslöser" value={trigger} onChange={setTrigger}
              opts={[{id:'gegner', l:'Gegnerhälfte'},{id:'mittel', l:'Mittellinie'},{id:'eigen', l:'Eigenhälfte'}]}/>
            <TSlider theme={theme} scheme={scheme} label="Konter-Fokus" value={konter} onChange={setKonter} leftL="aufbauen" rightL="schnell umschalten" hint={`${konter}%`}/>
            <Seg theme={theme} scheme={scheme} label="Flügelfokus" value={flank} onChange={setFlank}
              opts={[{id:'links', l:'Links'},{id:'beide', l:'Beide'},{id:'rechts', l:'Rechts'}]}/>
            <TSlider theme={theme} scheme={scheme} label="Schussbereitschaft" value={schuss} onChange={setSchuss} leftL="wartend" rightL="schnell abziehend" hint={schuss>70?'sehr hoch':schuss>40?'normal':'zurückhaltend'}/>
          </div>
        )}

        {tab === 'verteidigung' && (
          <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'0 14px'}}>
            <Seg theme={theme} scheme={scheme} label="Abwehrlinie" value={linie} onChange={setLinie}
              opts={[{id:'tief', l:'Tief'},{id:'mittel', l:'Mittel'},{id:'hoch', l:'Hoch'}]}/>
            <TSlider theme={theme} scheme={scheme} label="Pressingintensität" value={pressInt} onChange={setPressInt} leftL="ruhig" rightL="aggressiv" hint={`${pressInt}%`}/>
            <Seg theme={theme} scheme={scheme} label="Orientierung" value={orient} onChange={setOrient}
              opts={[{id:'mann', l:'Mann'},{id:'mix', l:'Mix'},{id:'raum', l:'Raum'}]}/>
            <Seg theme={theme} scheme={scheme} label="Foulneigung" value={foul} onChange={setFoul}
              opts={[{id:'fair', l:'Fair'},{id:'normal', l:'Normal'},{id:'taktisch', l:'Taktisch'}]}/>
            <TacticToggle theme={theme} scheme={scheme} label="Abseitsfalle" on={offside} onChange={setOffside} hint="Funktioniert nur mit hoher Linie und Konzentration"/>
            <TSlider theme={theme} scheme={scheme} label="Eingriffe im Zweikampf" value={56} onChange={()=>{}} leftL="zurückhaltend" rightL="entschlossen" hint="entschlossen"/>
          </div>
        )}

        {tab === 'uebergang' && (
          <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'0 14px'}}>
            <Seg theme={theme} scheme={scheme} label="Spielaufbau" value={aufbau} onChange={setAufbau}
              opts={[{id:'kurz', l:'Kurz'},{id:'mix', l:'Gemischt'},{id:'lang', l:'Lange Bälle'}]}/>
            <TSlider theme={theme} scheme={scheme} label="Übergangstempo" value={transTempo} onChange={setTransTempo} leftL="sicher" rightL="vertikal" hint={transTempo>70?'sehr vertikal':transTempo>40?'normal':'sicher'}/>
            <TacticToggle theme={theme} scheme={scheme} label="Gegenpressing" on={gegen} onChange={setGegen} hint="Sofort nach Ballverlust pressen"/>
            <Seg theme={theme} scheme={scheme} label="Rückzugsregel" value={rule} onChange={setRule}
              opts={[{id:'5s', l:'5 Sek.'},{id:'8s', l:'8 Sek.'},{id:'15s', l:'15 Sek.'}]}/>
            <TSlider theme={theme} scheme={scheme} label="Risiko im Spielaufbau" value={45} onChange={()=>{}} mid leftL="sicher" rightL="riskant" hint="leicht riskant"/>
          </div>
        )}

        {tab === 'standards' && (
          <div style={{display:'flex', flexDirection:'column', gap:10}}>
            {/* Eckstoß */}
            <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'10px 14px'}}>
              <SerifH theme={theme} style={{display:'block', fontSize:14, fontWeight:700, color:t.ink}}>Eckstoß</SerifH>
              <ExecutorRow theme={theme} scheme={scheme} role="Ausführer · Linksfuß" name="Tobias Reiter" pos="ZM" str={8}/>
              <ExecutorRow theme={theme} scheme={scheme} role="Ausführer · Rechtsfuß" name="Marek Brody" pos="OM" str={8}/>
              <Seg theme={theme} scheme={scheme} label="Ausrichtung" value="hoch" onChange={()=>{}}
                opts={[{id:'kurz', l:'Kurz'},{id:'hoch', l:'Hoch'},{id:'mix', l:'Mix'}]}/>
              <TacticToggle theme={theme} scheme={scheme} label="Eckstoß auf den 2. Pfosten" on={true} onChange={()=>{}}/>
            </div>
            {/* Freistoß */}
            <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'10px 14px'}}>
              <SerifH theme={theme} style={{display:'block', fontSize:14, fontWeight:700, color:t.ink}}>Freistoß</SerifH>
              <div style={{fontSize:11, color:t.inkMute, marginTop:2}}>Schützenreihenfolge</div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6, marginTop:8}}>
                {[
                  {n:1, name:'Brody', str:8},
                  {n:2, name:'Reiter', str:8},
                  {n:3, name:'Wieser', str:7},
                ].map(p=>(
                  <div key={p.n} style={{background:t.bgInk, borderRadius:10, padding:'7px 8px'}}>
                    <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between'}}>
                      <span style={{fontSize:9, color:t.inkSoft, fontWeight:800}}>{p.n}.</span>
                      <span style={{fontFamily:'JetBrains Mono', fontSize:11, color:t.ink, fontWeight:700}}>{p.str}</span>
                    </div>
                    <div style={{fontSize:11, fontWeight:700, color:t.ink, lineHeight:1.1, marginTop:2}}>{p.name}</div>
                  </div>
                ))}
              </div>
              <TacticToggle theme={theme} scheme={scheme} label="Studierter Spielzug" on={true} onChange={()=>{}} hint="Wand-Pass, dann Schuss aus dem Halbfeld"/>
            </div>
            {/* Elfmeter */}
            <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'10px 14px'}}>
              <SerifH theme={theme} style={{display:'block', fontSize:14, fontWeight:700, color:t.ink}}>Elfmeter · Reihenfolge</SerifH>
              <div style={{display:'flex', gap:6, marginTop:8, overflowX:'auto'}}>
                {['Brody','Reiter','Wieser','Carrara','Manso'].map((n,i)=>(
                  <div key={n} style={{flex:'0 0 auto', minWidth:72, padding:'6px 8px', background:t.bgInk, borderRadius:8}}>
                    <div style={{fontSize:9, color:t.inkSoft, fontWeight:800}}>{i+1}.</div>
                    <div style={{fontSize:11, fontWeight:700, color:t.ink}}>{n}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Einwurf / Anstoß */}
            <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'0 14px'}}>
              <Seg theme={theme} scheme={scheme} label="Eigene Anstöße" value="kurz" onChange={()=>{}}
                opts={[{id:'kurz', l:'Kurz absichern'},{id:'flach', l:'Flach öffnen'},{id:'lang', l:'Lang vorne'}]}/>
              <Seg theme={theme} scheme={scheme} label="Einwurf in der gegnerischen Hälfte" value="weit" onChange={()=>{}}
                opts={[{id:'kurz', l:'Kurz halten'},{id:'weit', l:'Weit nach vorn'}]}/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ExecutorRow({theme, scheme, role, name, pos, str}){
  const t = THEMES[theme][scheme];
  return (
    <div style={{display:'flex', alignItems:'center', gap:8, padding:'8px 0', borderBottom:`1px solid ${t.rule}`}}>
      <div style={{flex:1}}>
        <div style={{fontSize:11, color:t.inkMute, fontWeight:600}}>{role}</div>
        <div style={{display:'flex', alignItems:'center', gap:6, marginTop:2}}>
          <PosPill pos={pos} theme={theme} scheme={scheme}/>
          <span style={{fontSize:13, fontWeight:700, color:t.ink}}>{name}</span>
          <span style={{fontFamily:'JetBrains Mono', fontSize:11, color:t.inkMute, fontWeight:700}}>{str}</span>
        </div>
      </div>
      <button style={{height:32, padding:'0 10px', borderRadius:8, background:t.bg, border:`1px solid ${t.rule}`, fontSize:11, fontWeight:700, color:t.ink, fontFamily:'inherit'}}>ändern</button>
    </div>
  );
}

// =================================================================
// 16. AUFSTELLUNG — swappable lineup
// =================================================================
function ScreenLineup({theme, scheme}){
  const t = THEMES[theme][scheme];
  const [formation, setFormation] = React.useState('4-3-3');
  // selected player index (in `players` array) — clicking another swaps positions.
  const [selected, setSelected] = React.useState(8); // Brody by default
  // Lineup state: 11 starters as { shirt, name, pos, str, x, y }
  // Positions placed on 100x140 (top is opp goal, bottom is own goal — keeper bottom)
  const initialFormations = {
    '4-3-3': [
      { shirt:1,  name:'Wendling', pos:'TW', str:7, x:50, y:128 },
      { shirt:18, name:'Bredow',   pos:'AV', str:6, x:18, y:102 },
      { shirt:4,  name:'Carrara',  pos:'IV', str:8, x:38, y:106 },
      { shirt:5,  name:'Manso',    pos:'IV', str:7, x:62, y:106 },
      { shirt:22, name:'Furukawa', pos:'AV', str:7, x:82, y:102 },
      { shirt:6,  name:'Holtmann', pos:'DM', str:7, x:30, y:78 },
      { shirt:8,  name:'Reiter',   pos:'ZM', str:8, x:50, y:74 },
      { shirt:14, name:'Velten',   pos:'ZM', str:6, x:70, y:78 },
      { shirt:10, name:'Brody',    pos:'OM', str:8, x:24, y:46 },
      { shirt:9,  name:'Wieser',   pos:'ST', str:7, x:50, y:34 },
      { shirt:11, name:'Kalt',     pos:'ST', str:7, x:76, y:46 },
    ],
  };
  const [players, setPlayers] = React.useState(initialFormations['4-3-3']);
  const onTap = (i) => {
    if (selected === null) { setSelected(i); return; }
    if (selected === i) { setSelected(null); return; }
    setPlayers(arr => {
      const next = arr.slice();
      const a = {...next[selected]}, b = {...next[i]};
      // swap x/y only — keep shirt+name as their seat
      [next[selected], next[i]] = [
        { ...a, x: b.x, y: b.y, pos: b.pos },
        { ...b, x: a.x, y: a.y, pos: a.pos },
      ];
      return next;
    });
    setSelected(null);
  };
  const sel = selected !== null ? players[selected] : null;

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%', position:'relative'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <ScreenHeader theme={theme} scheme={scheme}
        kicker="Aufstellung · Northbridge auswärts"
        title="Mannschaft"
        right={
          <span style={{fontSize:10, fontWeight:800, letterSpacing:.6, color:t.accent, padding:'4px 9px', borderRadius:99, background:t.accentSoft}}>STÄRKE Ø 7,4</span>
        }/>

      {/* Formation row */}
      <div style={{padding:'6px 12px 0'}}>
        <div style={{display:'flex', gap:5, overflowX:'auto', paddingBottom:6}}>
          {['4-3-3','4-4-2','4-2-3-1','3-5-2','5-3-2','3-4-3'].map(f=>(
            <button key={f} onClick={()=>setFormation(f)} style={{
              flex:'0 0 auto', minWidth:60, padding:'8px 10px',
              borderRadius:9, border:`1px solid ${formation===f?t.ink:t.rule}`,
              background: formation===f?t.ink:t.card, color: formation===f?t.bg:t.ink,
              fontFamily:'JetBrains Mono', fontWeight:700, fontSize:11, textAlign:'center'
            }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Pitch */}
      <div style={{padding:'4px 14px 0', position:'relative'}}>
        <div style={{position:'relative'}}>
          <svg viewBox="0 0 100 140" style={{width:'100%', display:'block'}}>
            <defs>
              <linearGradient id="lin-pitch" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor={t.ok} stopOpacity=".65"/>
                <stop offset="1" stopColor={t.ok} stopOpacity=".45"/>
              </linearGradient>
            </defs>
            <rect x="2" y="2" width="96" height="136" rx="3" fill="url(#lin-pitch)" stroke={t.ink} strokeWidth=".5"/>
            {/* stripes */}
            {Array.from({length:8}).map((_,i)=>(<rect key={i} x="2" y={2+i*17} width="96" height="8.5" fill="#fff" opacity={i%2?.07:0}/>))}
            <line x1="2" y1="70" x2="98" y2="70" stroke="#fff" strokeWidth=".5" opacity=".6"/>
            <circle cx="50" cy="70" r="9" fill="none" stroke="#fff" strokeWidth=".5" opacity=".6"/>
            <rect x="30" y="2" width="40" height="14" fill="none" stroke="#fff" strokeWidth=".5" opacity=".6"/>
            <rect x="30" y="124" width="40" height="14" fill="none" stroke="#fff" strokeWidth=".5" opacity=".6"/>
            {/* Swap arrow when selected */}
            {sel && (
              <g>
                {players.map((p,i)=>{
                  if (i === selected) return null;
                  return <line key={i} x1={sel.x} y1={sel.y} x2={p.x} y2={p.y} stroke={t.accent} strokeWidth=".4" opacity=".4" strokeDasharray="1.5 1.5"/>;
                })}
              </g>
            )}
          </svg>
          {/* Player nodes overlaid as HTML for tap targets */}
          {players.map((p,i)=>{
            const isSel = selected === i;
            const ownKit = kitFor('FC Hafenstadt');
            const ownCrest = crestFor('FC Hafenstadt');
            return (
              <button key={p.shirt} onClick={()=>onTap(i)} aria-label={`Spieler ${p.name}`} style={{
                position:'absolute',
                left:`calc(${p.x}% - 22px)`,
                top:`calc(${(p.y/140)*100}% - 28px)`,
                width:44, height:60, padding:0,
                background:'transparent', border:'none', cursor:'pointer',
                display:'flex', flexDirection:'column', alignItems:'center',
                fontFamily:'inherit'
              }}>
                <PlayerToken kit={ownKit} a={ownCrest.a} b={ownCrest.b}
                             shirt={p.shirt} size={36}
                             highlight={isSel} accent={t.accent}/>
                <div style={{
                  fontSize:9.5, fontWeight:700, color:t.ink, lineHeight:1, marginTop:3,
                  background:t.bg, padding:'1px 3px', borderRadius:3,
                  whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:50
                }}>{p.name}</div>
                <div style={{fontSize:8.5, color: isSel?t.accent:t.inkMute, fontWeight:700, fontFamily:'JetBrains Mono'}}>{p.pos}·{p.str}</div>
              </button>
            );
          })}
        </div>
        {/* Hint chip */}
        <div style={{padding:'8px 4px 0', fontSize:11, color: sel ? t.accent : t.inkSoft, fontFamily:THEMES[theme].font, fontStyle:'italic', textAlign:'center'}}>
          {sel ? `${sel.name} ausgewählt · tippe einen Mitspieler zum Tauschen` : 'Spieler tippen, dann zweiten Spieler zum Tauschen wählen.'}
        </div>
      </div>

      {/* Bench */}
      <div style={{flex:1, overflowY:'auto', padding:'8px 12px 100px'}}>
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'4px 4px 6px'}}>Auswechselbank · 3 Spieler</div>
        {SQUAD.filter(s=>s.bench).map((p,i)=>(
          <div key={i} style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:11, padding:'8px 10px', display:'flex', alignItems:'center', gap:10, marginBottom:6}}>
            <div style={{width:30, height:30, borderRadius:8, background:t.bgInk, color:t.ink, display:'grid', placeItems:'center', fontFamily:'JetBrains Mono', fontWeight:700, fontSize:12}}>{p.shirt}</div>
            <PosPill pos={p.pos} theme={theme} scheme={scheme}/>
            <span style={{flex:1, fontSize:13, fontWeight:700, color:t.ink}}>{p.n}</span>
            <StrBar n={p.str} theme={theme} scheme={scheme} w={42}/>
            <button aria-label="Einwechseln" style={{width:30, height:30, borderRadius:8, border:`1px solid ${t.rule}`, background:t.bg, display:'grid', placeItems:'center'}}>
              <I.ArrowRight size={14} color={t.ink}/>
            </button>
          </div>
        ))}
      </div>

      {/* Sticky bottom */}
      <div style={{position:'absolute', left:0, right:0, bottom:0, padding:'10px 16px 22px', background:`linear-gradient(to top, ${t.bg} 80%, transparent)`, display:'flex', gap:8}}>
        <button style={{flex:1, height:50, borderRadius:14, background:t.card, border:`1px solid ${t.rule}`, color:t.ink, fontWeight:700, fontSize:13, fontFamily:'inherit'}}>Auto-Aufstellen</button>
        <button style={{flex:2, height:50, borderRadius:14, background:t.ink, color:t.bg, border:'none', fontWeight:800, fontSize:14, fontFamily:'inherit'}}>Übernehmen</button>
      </div>
    </div>
  );
}

// =================================================================
// 17. STATISTICS — multi-tab dashboard
// =================================================================
function ScreenStats({theme, scheme}){
  const t = THEMES[theme][scheme];
  const [tab, setTab] = React.useState('uebersicht');

  // sparkline data — monthly cashflow (12 months)
  const cashflow = [320, 410, 285, 480, 510, 420, 540, 360, 410, 580, 620, 632];
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <ScreenHeader theme={theme} scheme={scheme}
        kicker="Saison 2026/27" title="Statistiken"
        right={
          <button style={{height:34, padding:'0 10px', borderRadius:9, background:t.card, border:`1px solid ${t.rule}`, color:t.ink, fontWeight:700, fontSize:11, fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:4}}>
            2026/27 <I.ChevronDown size={12} color={t.ink}/>
          </button>
        }/>

      {/* tabs */}
      <div style={{padding:'4px 12px 0'}}>
        <div style={{display:'flex', gap:4, padding:3, background:t.bgInk, borderRadius:10, overflowX:'auto'}}>
          {[
            {id:'uebersicht', l:'Übersicht'},
            {id:'spieler',    l:'Spieler'},
            {id:'formationen',l:'Formationen'},
            {id:'spiele',     l:'Spiele'},
            {id:'finanzen',   l:'Finanzen'},
          ].map(o=>(
            <button key={o.id} onClick={()=>setTab(o.id)} style={{
              flex:'1 1 0', minWidth:60, padding:'7px 0', borderRadius:7, border:'none',
              background: tab===o.id ? t.card : 'transparent',
              color: tab===o.id ? t.ink : t.inkMute,
              boxShadow: tab===o.id ? `0 1px 0 ${t.rule}` : 'none',
              fontFamily:'inherit', fontWeight:700, fontSize:10.5
            }}>{o.l}</button>
          ))}
        </div>
      </div>

      <div style={{flex:1, overflowY:'auto', padding:'10px 12px 20px'}}>

        {tab === 'uebersicht' && (<>
          {/* KPI grid */}
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
            <Kpi theme={theme} scheme={scheme} k="Tabellenplatz" v="2." trend="↑ 1"/>
            <Kpi theme={theme} scheme={scheme} k="Tordifferenz" v="+24" trend="46:22"/>
            <Kpi theme={theme} scheme={scheme} k="xG (Saison)" v="51,2" trend="ø 1,71 / Spiel"/>
            <Kpi theme={theme} scheme={scheme} k="Punkte" v="62" trend="von 30 Spielen"/>
          </div>
          {/* Form strip */}
          <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'10px 14px', marginTop:10}}>
            <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>Form · letzte 10</div>
            <div style={{display:'flex', gap:4, marginTop:8, fontFamily:'JetBrains Mono'}}>
              {['S','S','U','S','N','S','S','U','S','N'].map((c,i)=>{
                const col = c==='S' ? t.ok : c==='N' ? t.danger : t.warn;
                return <div key={i} style={{flex:1, height:26, borderRadius:5, background:col, color:'#fff', display:'grid', placeItems:'center', fontSize:11, fontWeight:800}}>{c}</div>;
              })}
            </div>
          </div>
          {/* Cashflow sparkline */}
          <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'10px 14px', marginTop:10}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
              <span style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>Monatssaldo · 12 Monate</span>
              <span style={{fontSize:12, color:t.ok, fontWeight:800, fontFamily:'JetBrains Mono'}}>+ 632 k €</span>
            </div>
            <Sparkline data={cashflow} theme={theme} scheme={scheme}/>
          </div>
          {/* Streaks */}
          <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'10px 14px', marginTop:10}}>
            <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', marginBottom:8}}>Rekorde dieser Saison</div>
            <StatRow theme={theme} scheme={scheme} k="Längste Siegesserie" v="6 Spiele"/>
            <StatRow theme={theme} scheme={scheme} k="Heimstärke" v="11 Siege · 1 Niederlage"/>
            <StatRow theme={theme} scheme={scheme} k={'„Zu-Null"-Spiele'} v="9"/>
            <StatRow theme={theme} scheme={scheme} k="Höchster Sieg" v="4:0 vs. AC Valguarda" last/>
          </div>
        </>)}

        {tab === 'spieler' && (<>
          <StatGroup theme={theme} scheme={scheme} title="Torjäger" rows={[
            {name:'Aleksy Wieser', pos:'ST', val:14, str:7, badge:'Tore'},
            {name:'Marek Brody',   pos:'OM', val:9,  str:8, badge:'Tore'},
            {name:'Florian Kalt',  pos:'ST', val:7,  str:7, badge:'Tore'},
          ]} max={14}/>
          <StatGroup theme={theme} scheme={scheme} title="Vorlagen" rows={[
            {name:'Marek Brody',   pos:'OM', val:12, str:8, badge:'Vorl.'},
            {name:'Tobias Reiter', pos:'ZM', val:8,  str:8, badge:'Vorl.'},
            {name:'Kaito Furukawa',pos:'AV', val:5,  str:7, badge:'Vorl.'},
          ]} max={12}/>
          <StatGroup theme={theme} scheme={scheme} title="Einsatzminuten" rows={[
            {name:'Mateo Carrara', pos:'IV', val:2640, str:8, badge:'Min'},
            {name:'Tobias Reiter', pos:'ZM', val:2510, str:8, badge:'Min'},
            {name:'Lars Wendling', pos:'TW', val:2700, str:7, badge:'Min'},
          ]} max={2700} fmt={v=>new Intl.NumberFormat('de-DE').format(v)}/>
          <StatGroup theme={theme} scheme={scheme} title="Form (Ø)" rows={[
            {name:'Marek Brody',   pos:'OM', val:8.4, str:8, badge:'⌀'},
            {name:'Aleksy Wieser', pos:'ST', val:7.9, str:7, badge:'⌀'},
            {name:'Mateo Carrara', pos:'IV', val:7.8, str:8, badge:'⌀'},
          ]} max={9} fmt={v=>v.toString().replace('.', ',')}/>
        </>)}

        {tab === 'formationen' && (<>
          <div style={{fontSize:11, color:t.inkMute, padding:'2px 4px 8px', fontFamily:THEMES[theme].font, fontStyle:'italic'}}>
            Welche Anordnungen haben sich bewährt? Sortiert nach Erfolgsquote.
          </div>
          {[
            { f:'4-3-3',    games:18, w:11, d:5, l:2, gf:32, ga:13, win:61 },
            { f:'4-2-3-1', games:6,  w:3,  d:2, l:1, gf:8,  ga:5,  win:50 },
            { f:'4-4-2',    games:4,  w:1,  d:2, l:1, gf:4,  ga:4,  win:25 },
            { f:'3-5-2',    games:2,  w:1,  d:0, l:1, gf:2,  ga:2,  win:50 },
          ].map((f,i)=>(
            <div key={i} style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'10px 12px', marginBottom:8}}>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <div style={{display:'flex', alignItems:'center', gap:10}}>
                  <SerifH theme={theme} style={{fontSize:18, fontWeight:800, color:t.ink, fontFamily:'JetBrains Mono', minWidth:62}}>{f.f}</SerifH>
                  <div>
                    <div style={{fontSize:11, color:t.inkMute, fontWeight:600}}>{f.games} Spiele · {f.gf}:{f.ga} Tore</div>
                    <div style={{display:'flex', gap:3, marginTop:4}}>
                      <Chip n={f.w} l="S" theme={theme} scheme={scheme} color={t.ok}/>
                      <Chip n={f.d} l="U" theme={theme} scheme={scheme} color={t.warn}/>
                      <Chip n={f.l} l="N" theme={theme} scheme={scheme} color={t.danger}/>
                    </div>
                  </div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontFamily:'JetBrains Mono', fontSize:18, fontWeight:800, color: f.win>=50?t.ok:t.warn}}>{f.win}%</div>
                  <div style={{fontSize:9.5, color:t.inkSoft, fontWeight:600}}>Erfolgsquote</div>
                </div>
              </div>
              {/* Mini bar */}
              <div style={{display:'flex', gap:0, height:6, borderRadius:3, overflow:'hidden', marginTop:8, border:`1px solid ${t.rule}`}}>
                <div style={{width:(f.w/f.games)*100+'%', background:t.ok}}/>
                <div style={{width:(f.d/f.games)*100+'%', background:t.warn}}/>
                <div style={{width:(f.l/f.games)*100+'%', background:t.danger}}/>
              </div>
            </div>
          ))}
        </>)}

        {tab === 'spiele' && (<>
          {[
            { d:'So 17. Mai', comp:'Aurelia Premier', h:'FC Hafenstadt', a:'AC Valguarda', s:'4:0', f:'4-3-3', motm:'Brody', xg:'2,6 vs 0,9' },
            { d:'Mi 13. Mai', comp:'Confed. Cup',     h:'Oakport United', a:'FC Hafenstadt', s:'1:2', f:'4-3-3', motm:'Wieser', xg:'1,1 vs 1,8' },
            { d:'So 10. Mai', comp:'Aurelia Premier', h:'FC Hafenstadt', a:'Sporting Kaltenbach', s:'1:1', f:'4-2-3-1', motm:'Reiter', xg:'1,4 vs 1,2' },
            { d:'So 03. Mai', comp:'Aurelia Premier', h:'Olympique Sauveterre', a:'FC Hafenstadt', s:'0:2', f:'4-3-3', motm:'Brody', xg:'0,8 vs 2,0' },
            { d:'So 26. Apr', comp:'Aurelia Premier', h:'FC Hafenstadt', a:'Riverdale Athletic', s:'3:2', f:'4-3-3', motm:'Wieser', xg:'2,2 vs 1,6' },
          ].map((m,i)=>{
            const own = m.h.includes('Hafenstadt');
            const [g1,g2] = m.s.split(':').map(Number);
            const result = own ? (g1>g2?'S':g1===g2?'U':'N') : (g2>g1?'S':g1===g2?'U':'N');
            const col = result==='S'?t.ok:result==='N'?t.danger:t.warn;
            return (
              <div key={i} style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'10px 12px', marginBottom:8}}>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:8}}>
                  <span style={{fontSize:10, fontWeight:700, color:t.inkMute, letterSpacing:.5, textTransform:'uppercase'}}>{m.d} · {m.comp}</span>
                  <span style={{width:18, height:18, borderRadius:5, background:col, color:'#fff', fontSize:10, fontWeight:800, display:'grid', placeItems:'center', fontFamily:'JetBrains Mono'}}>{result}</span>
                </div>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, marginTop:6}}>
                  <SerifH theme={theme} style={{fontSize:14, fontWeight:700, color:t.ink, flex:1}}>{m.h}</SerifH>
                  <SerifH theme={theme} style={{fontSize:18, fontWeight:800, color:t.ink, fontFamily:'JetBrains Mono'}}>{m.s}</SerifH>
                  <SerifH theme={theme} style={{fontSize:14, fontWeight:700, color:t.ink, flex:1, textAlign:'right'}}>{m.a}</SerifH>
                </div>
                <div style={{display:'flex', gap:6, marginTop:6, flexWrap:'wrap'}}>
                  <span style={{fontSize:10, padding:'2px 7px', borderRadius:99, background:t.bgInk, color:t.inkMute, fontWeight:700, fontFamily:'JetBrains Mono'}}>{m.f}</span>
                  <span style={{fontSize:10, padding:'2px 7px', borderRadius:99, background:t.bgInk, color:t.inkMute, fontWeight:700}}>Spieler des Spiels · {m.motm}</span>
                  <span style={{fontSize:10, padding:'2px 7px', borderRadius:99, background:t.bgInk, color:t.inkMute, fontWeight:700, fontFamily:'JetBrains Mono'}}>xG {m.xg}</span>
                </div>
              </div>
            );
          })}
        </>)}

        {tab === 'finanzen' && (<>
          <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'10px 14px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
              <span style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>Saisonbilanz</span>
              <span style={{fontSize:14, color:t.ok, fontWeight:800, fontFamily:'JetBrains Mono'}}>+ 4,2 Mio. €</span>
            </div>
            <Sparkline data={cashflow} theme={theme} scheme={scheme}/>
            <div style={{display:'flex', justifyContent:'space-between', fontFamily:'JetBrains Mono', fontSize:10, color:t.inkSoft, marginTop:2}}>
              <span>Jun</span><span>Sep</span><span>Dez</span><span>Mär</span><span>Mai</span>
            </div>
          </div>
          {/* Einnahmen Pie-replacement: horizontal stacked bar */}
          <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'10px 14px', marginTop:10}}>
            <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', marginBottom:8}}>Einnahmenstruktur</div>
            <BreakBar theme={theme} scheme={scheme} rows={[
              {l:'Sponsoring', v:43, c:t.accent},
              {l:'TV-Gelder',  v:27, c:t.ok},
              {l:'Ticketing',  v:24, c:t.warn},
              {l:'Fanartikel', v:6,  c:t.inkMute},
            ]}/>
          </div>
          <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'10px 14px', marginTop:10}}>
            <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', marginBottom:8}}>Ausgabenstruktur</div>
            <BreakBar theme={theme} scheme={scheme} rows={[
              {l:'Gehälter',           v:58, c:t.danger},
              {l:'Stadion & Betrieb',  v:14, c:t.warn},
              {l:'Verbandsabgabe',     v:9,  c:t.accent},
              {l:'Nachwuchs',          v:8,  c:t.ok},
              {l:'Reisen',             v:5,  c:t.inkMute},
              {l:'Sonstiges',          v:6,  c:t.inkSoft},
            ]}/>
          </div>
        </>)}
      </div>
    </div>
  );
}

function Kpi({theme, scheme, k, v, trend}){
  const t = THEMES[theme][scheme];
  return (
    <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'10px 12px'}}>
      <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.5, textTransform:'uppercase'}}>{k}</div>
      <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:800, color:t.ink, lineHeight:1.05, marginTop:2, fontFamily:'JetBrains Mono'}}>{v}</SerifH>
      <div style={{fontSize:10.5, color:t.accent, fontWeight:700, marginTop:3}}>{trend}</div>
    </div>
  );
}
function StatRow({theme, scheme, k, v, last}){
  const t = THEMES[theme][scheme];
  return (
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', padding:'8px 0', borderBottom: last?'none':`1px solid ${t.rule}`}}>
      <span style={{fontSize:12, color:t.inkMute}}>{k}</span>
      <span style={{fontSize:12.5, fontWeight:700, color:t.ink, fontFamily:'JetBrains Mono'}}>{v}</span>
    </div>
  );
}
function Chip({n, l, theme, scheme, color}){
  return <span style={{display:'inline-flex', alignItems:'center', gap:3, padding:'2px 6px', borderRadius:5, background: color+'22', color, fontSize:10, fontWeight:800, fontFamily:'JetBrains Mono'}}>{n}<span style={{opacity:.7}}>{l}</span></span>;
}
function StatGroup({theme, scheme, title, rows, max, fmt}){
  const t = THEMES[theme][scheme];
  return (
    <div style={{marginBottom:10}}>
      <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', padding:'2px 4px 6px'}}>{title}</div>
      <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'2px 12px'}}>
        {rows.map((r,i)=>(
          <div key={i} style={{display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom: i<rows.length-1?`1px solid ${t.rule}`:'none'}}>
            <span style={{fontSize:11.5, color:t.inkSoft, fontFamily:'JetBrains Mono', fontWeight:700, width:14}}>{i+1}</span>
            <PosPill pos={r.pos} theme={theme} scheme={scheme}/>
            <span style={{flex:1, fontSize:13, fontWeight:700, color:t.ink}}>{r.name}</span>
            <div style={{flex:'0 0 90px'}}>
              <div style={{height:5, background:t.bgInk, borderRadius:99, overflow:'hidden'}}>
                <div style={{width:(r.val/max)*100+'%', height:'100%', background:t.accent}}/>
              </div>
            </div>
            <span style={{minWidth:50, textAlign:'right', fontFamily:'JetBrains Mono', fontSize:13, fontWeight:800, color:t.ink}}>{fmt?fmt(r.val):r.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
// inline sparkline
function Sparkline({data, theme, scheme}){
  const t = THEMES[theme][scheme];
  const W = 280, H = 60, P = 4;
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v,i)=>{
    const x = P + (i/(data.length-1)) * (W-2*P);
    const y = H-P - ((v-min)/(max-min || 1)) * (H-2*P);
    return [x,y];
  });
  const d = pts.map((p,i)=> (i===0?'M':'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const dArea = d + ` L${pts[pts.length-1][0]} ${H-P} L${pts[0][0]} ${H-P} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%', display:'block', marginTop:6}}>
      <path d={dArea} fill={t.accent} fillOpacity=".12"/>
      <path d={d} fill="none" stroke={t.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p,i)=>(
        <circle key={i} cx={p[0]} cy={p[1]} r={i===pts.length-1?3:1.6} fill={i===pts.length-1?t.accent:t.bg} stroke={t.accent} strokeWidth=".9"/>
      ))}
    </svg>
  );
}
// stacked horizontal breakdown bar
function BreakBar({rows, theme, scheme}){
  const t = THEMES[theme][scheme];
  return (
    <div>
      <div style={{display:'flex', height:14, borderRadius:5, overflow:'hidden', border:`1px solid ${t.rule}`}}>
        {rows.map((r,i)=>(
          <div key={i} title={`${r.l} ${r.v}%`} style={{width:r.v+'%', background:r.c}}/>
        ))}
      </div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4px 12px', marginTop:8}}>
        {rows.map((r,i)=>(
          <div key={i} style={{display:'flex', alignItems:'center', gap:6, fontSize:11}}>
            <span style={{width:10, height:10, borderRadius:3, background:r.c, flex:'0 0 10px'}}/>
            <span style={{flex:1, color:t.ink, fontWeight:600}}>{r.l}</span>
            <span style={{fontFamily:'JetBrains Mono', color:t.inkMute, fontWeight:700}}>{r.v}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  ScreenTactics, ScreenLineup, ScreenStats,
  TSlider, Seg, TacticToggle, Sparkline, BreakBar,
});
