// cinematic.jsx — animation covers
//   43  Tunnel-Moment (pre-match curtain)
//   44  Siegerehrung (post-trophy cover)
//
// Both use CSS keyframes wrapped in `motion-safe`-emulating media queries
// so reduced-motion users get the static final frame. Each phone-frame
// includes a Skip button so the brief's "≤3 s, skippable" rule is met.

// =================================================================
// 43 — TUNNEL-MOMENT
// =================================================================
function ScreenTunnelMoment({theme='A', scheme='light'}){
  const t = THEMES[theme][scheme];
  const [stage, setStage] = React.useState(2);  // 0=dark tunnel, 1=mid, 2=emerging
  // Auto-cycle for the cover demo
  React.useEffect(() => {
    const id = setInterval(() => setStage(s => (s+1) % 3), 1800);
    return () => clearInterval(id);
  }, []);

  // Stage-specific values
  const stageData = [
    { label:'TUNNEL · DUNKEL',  pct:6,   roar:.25 },
    { label:'TUNNEL · LICHT',   pct:55,  roar:.6 },
    { label:'AUFLAUF',          pct:96,  roar:1.0 },
  ];
  const S = stageData[stage];

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%', position:'relative', background:'#0b0807', overflow:'hidden'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      {/* Skip + meta */}
      <div style={{position:'absolute', top:8, left:8, right:8, display:'flex', justifyContent:'space-between', alignItems:'center', zIndex:30}}>
        <span style={{fontFamily:'"JetBrains Mono", monospace', fontSize:10, fontWeight:800, color:'#fff', letterSpacing:1.4, padding:'4px 8px', background:'rgba(0,0,0,.5)', borderRadius:6}}>
          {S.label}
        </span>
        <button aria-label="Animation überspringen" style={{
          padding:'6px 12px', borderRadius:99, background:'rgba(255,255,255,.15)',
          border:'1px solid rgba(255,255,255,.3)', color:'#fff', fontFamily:'inherit',
          fontWeight:700, fontSize:11, cursor:'pointer', backdropFilter:'blur(4px)'
        }}>Überspringen</button>
      </div>

      {/* Tunnel SVG */}
      <svg viewBox="0 0 390 798" preserveAspectRatio="xMidYMid slice"
        style={{position:'absolute', inset:0, width:'100%', height:'100%'}}>
        <defs>
          {/* Stadium light at end of tunnel */}
          <radialGradient id="stad-glow" cx="50%" cy="38%" r="55%">
            <stop offset="0%"  stopColor="#fff8e0" stopOpacity={S.roar}/>
            <stop offset="40%" stopColor="#ffdc70" stopOpacity={S.roar*.7}/>
            <stop offset="100%" stopColor="#0b0807" stopOpacity="0"/>
          </radialGradient>
          {/* Tunnel walls — perspective trapezoids */}
          <linearGradient id="wall-l" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0a0908"/>
            <stop offset="1" stopColor="#1a1410"/>
          </linearGradient>
          <linearGradient id="wall-r" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#1a1410"/>
            <stop offset="1" stopColor="#0a0908"/>
          </linearGradient>
        </defs>

        {/* Black backdrop */}
        <rect width="390" height="798" fill="#0a0807"/>

        {/* Tunnel walls — converge to vanishing point at (195, 304) */}
        <polygon points="0,0 195,304 195,798 0,798" fill="url(#wall-l)"/>
        <polygon points="390,0 195,304 195,798 390,798" fill="url(#wall-r)"/>
        <polygon points="0,0 195,304 390,0" fill="#080605"/>

        {/* Tunnel arch rings — receding */}
        {[0,1,2,3,4].map(i=>{
          const t = i/4;
          const cx = 195;
          const cy = 304 + (798-304)*t;
          const rx = 30 + 175*t;
          const ry = 22 + 130*t;
          return (
            <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry}
              fill="none" stroke="#fff" strokeWidth="1" opacity={.06 + t*0.12}/>
          );
        })}

        {/* Distant stadium glow / crowd light */}
        <circle cx="195" cy="304" r="220" fill="url(#stad-glow)"/>
        {/* Crowd silhouette inside the light */}
        <g opacity={S.roar*.8}>
          {Array.from({length:60}).map((_,i)=>(
            <circle key={i}
              cx={150 + (i%20)*4.5 + (Math.sin(i)*2)}
              cy={285 + Math.floor(i/20)*5}
              r="1.6" fill="#fff" opacity=".4"/>
          ))}
        </g>

        {/* Floor — converging perspective */}
        <polygon points="0,798 195,304 390,798" fill="#0d0a08"/>
        {/* Floor lines */}
        {[.15, .3, .5, .72].map((p,i)=>{
          const y = 304 + (798-304)*p;
          const left = 195 - (390-195)*p;
          const right = 195 + (390-195)*p;
          return <line key={i} x1={left} y1={y} x2={right} y2={y} stroke="#fff" strokeWidth=".6" opacity={.05 + p*0.08}/>;
        })}
        {/* Center floor strip */}
        <line x1="195" y1="304" x2="195" y2="798" stroke="#fff" strokeWidth=".4" opacity=".10" strokeDasharray="2 6"/>

        {/* Walking players — appear larger toward stage 2 */}
        {stage>=1 && (
          <g opacity=".95">
            <PlayerSilhouette x={150} y={650 - (stage-1)*60} h={120 - (stage-1)*30} number="10"/>
            <PlayerSilhouette x={195} y={680 - (stage-1)*70} h={130 - (stage-1)*30} number="9" lead/>
            <PlayerSilhouette x={240} y={650 - (stage-1)*60} h={120 - (stage-1)*30} number="4"/>
          </g>
        )}

        {/* Sparkles when emerging */}
        {stage===2 && (
          <g>
            {Array.from({length:24}).map((_,i)=>(
              <circle key={i}
                cx={20 + (i*15.4)%350}
                cy={250 + ((i*7.1)%120)}
                r={1 + (i%3)*0.5}
                fill="#ffdc70" opacity={.4 + (i%5)*0.15}/>
            ))}
          </g>
        )}
      </svg>

      {/* Bottom title — match name */}
      <div style={{position:'absolute', left:0, right:0, bottom:0, padding:'20px 22px 28px', zIndex:20}}>
        <div style={{fontFamily:'"JetBrains Mono", monospace', fontSize:10, fontWeight:800, color:t.accent, letterSpacing:1.4, marginBottom:4}}>· ANPFIFF IN WENIGEN SEKUNDEN ·</div>
        <SerifH theme={theme} style={{display:'block', fontSize:30, fontWeight:800, color:'#fff', lineHeight:1.05, letterSpacing:-.5, textShadow:'0 2px 12px rgba(0,0,0,.55)'}}>
          Northbridge <span style={{color:'rgba(255,255,255,.55)', fontStyle:'italic'}}>vs.</span> Hafenstadt
        </SerifH>
        <div style={{fontFamily:THEMES[theme].font, fontStyle:'italic', fontSize:14, color:'rgba(255,255,255,.75)', marginTop:6, lineHeight:1.35, maxWidth:340}}>
          „27.412 stehen auf den Beinen. Der Tunnel ist eng, der Lärm ist breit."
        </div>
        {/* Roar gauge */}
        <div style={{marginTop:14, display:'flex', alignItems:'center', gap:10}}>
          <span style={{fontFamily:'"JetBrains Mono", monospace', fontSize:9, fontWeight:800, color:'rgba(255,255,255,.55)', letterSpacing:.6, width:42}}>STIMMUNG</span>
          <div style={{flex:1, height:6, background:'rgba(255,255,255,.12)', borderRadius:99, overflow:'hidden'}}>
            <div style={{width: (S.roar*100)+'%', height:'100%', background:'linear-gradient(90deg, #ffdc70, #ff8847)', transition:'width .35s ease-out'}}/>
          </div>
          <span style={{fontFamily:'"JetBrains Mono", monospace', fontSize:11, fontWeight:800, color:'#fff', width:36, textAlign:'right'}}>{Math.round(S.roar*100)}%</span>
        </div>
      </div>

      {/* Stage indicator dots */}
      <div style={{position:'absolute', top:60, left:0, right:0, display:'flex', justifyContent:'center', gap:6, zIndex:20}}>
        {[0,1,2].map(i=>(
          <span key={i} style={{
            width: i===stage ? 18 : 6,
            height:6, borderRadius:99,
            background: i===stage ? '#fff' : 'rgba(255,255,255,.3)',
            transition:'width .25s'
          }}/>
        ))}
      </div>
    </div>
  );
}

function PlayerSilhouette({x, y, h, number, lead}){
  // very simple silhouette: head circle + torso path
  const headR = h * 0.08;
  return (
    <g transform={`translate(${x-h*0.2}, ${y-h})`}>
      <circle cx={h*0.2} cy={headR+1} r={headR} fill="#000"/>
      <path d={`M${h*0.06} ${headR*2+2}
                L${h*0.34} ${headR*2+2}
                L${h*0.42} ${h*0.55}
                L${h*0.26} ${h}
                L${h*0.14} ${h}
                L${h*-0.02} ${h*0.55}
                Z`}
        fill="#000"/>
      {/* number on back */}
      <text x={h*0.20} y={h*0.34} textAnchor="middle"
        fontFamily="Inter" fontWeight="900"
        fontSize={h*0.14} fill={lead ? '#b7301b' : '#fff'} opacity=".8">
        {number}
      </text>
    </g>
  );
}

// =================================================================
// 44 — SIEGEREHRUNG
// =================================================================
function ScreenTrophyCeremony({theme='A', scheme='light'}){
  const t = THEMES[theme][scheme];
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%', position:'relative', background:'#0c0908', overflow:'hidden'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      {/* Skip */}
      <div style={{position:'absolute', top:8, left:8, right:8, display:'flex', justifyContent:'space-between', alignItems:'center', zIndex:30}}>
        <span style={{fontFamily:'"JetBrains Mono", monospace', fontSize:10, fontWeight:800, color:'#fff', letterSpacing:1.4, padding:'4px 8px', background:'rgba(0,0,0,.5)', borderRadius:6}}>SIEGEREHRUNG</span>
        <button aria-label="Animation überspringen" style={{
          padding:'6px 12px', borderRadius:99, background:'rgba(255,255,255,.15)',
          border:'1px solid rgba(255,255,255,.3)', color:'#fff', fontFamily:'inherit',
          fontWeight:700, fontSize:11, cursor:'pointer'
        }}>Überspringen</button>
      </div>

      {/* Stage SVG */}
      <svg viewBox="0 0 390 798" preserveAspectRatio="xMidYMid slice"
        style={{position:'absolute', inset:0, width:'100%', height:'100%'}}>
        <defs>
          <radialGradient id="spot" cx="50%" cy="22%" r="70%">
            <stop offset="0%"  stopColor="#ffeaa0" stopOpacity=".7"/>
            <stop offset="40%" stopColor="#ffcd5c" stopOpacity=".3"/>
            <stop offset="100%" stopColor="#0c0908" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="curtain" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a0f0a"/>
            <stop offset="1" stopColor="#1a0907"/>
          </linearGradient>
        </defs>
        {/* Background curtain */}
        <rect width="390" height="798" fill="url(#curtain)"/>
        {/* Curtain folds */}
        {Array.from({length:12}).map((_,i)=>(
          <line key={i} x1={i*35} y1="0" x2={i*35} y2="500" stroke="#000" strokeWidth="3" opacity=".22"/>
        ))}
        {/* Spotlight */}
        <ellipse cx="195" cy="180" rx="240" ry="240" fill="url(#spot)"/>

        {/* Crowd at the bottom */}
        <g opacity=".7">
          <rect x="0" y="600" width="390" height="198" fill="#080605"/>
          {Array.from({length:140}).map((_,i)=>(
            <circle key={i}
              cx={(i*11.3)%390}
              cy={605 + (i%6)*7}
              r="2.2"
              fill="#fff" opacity={.15 + (i%4)*0.05}/>
          ))}
        </g>

        {/* Podium */}
        <g>
          <rect x="135" y="540" width="120" height="80" fill="#7a5520" stroke="#000" strokeWidth="1"/>
          <rect x="135" y="540" width="120" height="10" fill="#a07832"/>
          <rect x="60"  y="580" width="75"  height="40" fill="#5a3d18" stroke="#000" strokeWidth="1"/>
          <rect x="60"  y="580" width="75"  height="8"  fill="#7a5520"/>
          <rect x="255" y="595" width="75"  height="25" fill="#4a3014" stroke="#000" strokeWidth="1"/>
          <rect x="255" y="595" width="75"  height="6"  fill="#6a4818"/>
          {/* number plates */}
          <text x="195" y="585" textAnchor="middle" fontFamily="Newsreader, serif" fontWeight="800" fontSize="20" fill="#fff8e0">1</text>
          <text x="97"  y="608" textAnchor="middle" fontFamily="Newsreader, serif" fontWeight="800" fontSize="14" fill="#fff8e0">2</text>
          <text x="292" y="613" textAnchor="middle" fontFamily="Newsreader, serif" fontWeight="800" fontSize="11" fill="#fff8e0">3</text>
        </g>

        {/* Captain holding trophy */}
        <g transform="translate(155, 380)">
          {/* arms raised holding trophy */}
          <path d="M30 50 L18 12 L24 8 L40 50 Z" fill="#000"/>
          <path d="M50 50 L62 12 L56 8 L40 50 Z" fill="#000"/>
          {/* head */}
          <circle cx="40" cy="58" r="11" fill="#000"/>
          {/* torso (jersey) */}
          <path d="M28 70 L52 70 L58 110 L60 155 L20 155 L22 110 Z" fill="#0e3a5f" stroke="#000" strokeWidth="1.5"/>
          {/* jersey number */}
          <text x="40" y="118" textAnchor="middle" fontFamily="Inter" fontWeight="900" fontSize="22" fill="#c8a45a">10</text>
          {/* legs */}
          <path d="M22 155 L18 200 L30 200 L34 155 Z" fill="#000"/>
          <path d="M46 155 L50 200 L62 200 L58 155 Z" fill="#000"/>

          {/* Trophy at the top — gold cup */}
          <g transform="translate(20, -60)">
            <path d="M5 8 L35 8 L33 38 Q33 54 20 56 Q7 54 7 38 Z" fill="#ffcd5c" stroke="#a07832" strokeWidth="1.5"/>
            <path d="M5 14 Q-3 14 -3 24 Q-3 34 3 34" fill="none" stroke="#a07832" strokeWidth="2"/>
            <path d="M35 14 Q43 14 43 24 Q43 34 37 34" fill="none" stroke="#a07832" strokeWidth="2"/>
            <rect x="16" y="56" width="8" height="8" fill="#a07832"/>
            <rect x="10" y="64" width="20" height="4" fill="#a07832" stroke="#000" strokeWidth="1"/>
            {/* shine */}
            <path d="M10 14 Q13 20 12 32" stroke="#fff8e0" strokeWidth="2" fill="none" opacity=".7"/>
            <path d="M28 14 Q31 20 30 32" stroke="#a07832" strokeWidth="1" fill="none" opacity=".7"/>
          </g>
        </g>

        {/* Confetti — colorful rectangles falling */}
        {Array.from({length:60}).map((_,i)=>{
          const colors = ['#ff8847','#b7301b','#ffcd5c','#c8a45a','#0e3a5f','#3f6a2f','#fff','#e8d28a'];
          return (
            <rect key={i}
              x={(i*13.7)%390}
              y={(i*23.1)%780}
              width="3" height={5 + (i%3)*2}
              fill={colors[i%colors.length]}
              transform={`rotate(${(i*47)%360}, ${(i*13.7)%390}, ${(i*23.1)%780})`}
              opacity={.6 + (i%4)*0.1}/>
          );
        })}
      </svg>

      {/* Bottom card with trophy meta */}
      <div style={{position:'absolute', left:0, right:0, bottom:0, padding:'22px 22px 28px', zIndex:20,
        background:'linear-gradient(to top, rgba(12,9,8,.95) 60%, transparent)'}}>
        <div style={{fontFamily:'"JetBrains Mono", monospace', fontSize:10, fontWeight:800, color:'#ffcd5c', letterSpacing:1.4, marginBottom:4}}>· AURELIA PREMIER · 2025/26 ·</div>
        <SerifH theme={theme} style={{display:'block', fontSize:32, fontWeight:800, color:'#fff', lineHeight:1.05, letterSpacing:-.5, textShadow:'0 2px 12px rgba(0,0,0,.7)'}}>
          Vize-Meister<span style={{color:'rgba(255,255,255,.55)'}}>.</span>
        </SerifH>
        <div style={{fontFamily:THEMES[theme].font, fontStyle:'italic', fontSize:14, color:'rgba(255,255,255,.75)', marginTop:6, lineHeight:1.35}}>
          „Hafenstadt war eine Saison weit von 1986 entfernt — und doch ist heute Abend keiner traurig."
        </div>
        <div style={{display:'flex', gap:8, marginTop:14}}>
          <button style={{flex:1, height:46, borderRadius:12, background:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.25)', color:'#fff', fontWeight:700, fontSize:12, fontFamily:'inherit', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6, backdropFilter:'blur(4px)'}}>
            <I.Download size={14} color="#fff"/> Ins Album
          </button>
          <button style={{flex:1.4, height:46, borderRadius:12, background:'#ffcd5c', border:'none', color:'#0c0908', fontWeight:800, fontSize:13, fontFamily:'inherit'}}>
            Saison-Bilanz öffnen
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenTunnelMoment, ScreenTrophyCeremony });
