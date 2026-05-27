// negotiations.jsx — Anstoss-style negotiation & sentiment visuals.
// Procedural portrait placeholders (SVG), MoodFace (5 levels), satisfaction
// meters, plus four screens: player contract, board confidence, sponsor
// negotiation, media interview. Loaded after stadium.jsx, before screens.

// ---------- 5-LEVEL MOOD FACE ----------
// -2 angry, -1 grumpy, 0 neutral, +1 content, +2 delighted.
// Always paired with a label or numeric score elsewhere — never colour-only.
function MoodFace({mood=0, size=44, ring=true, theme, scheme}){
  const t = THEMES[theme][scheme];
  const palette = {
    [-2]: { bg:'#fde2dc', stroke:t.danger, name:'wütend' },
    [-1]: { bg:'#fdecd0', stroke:t.warn,   name:'unzufrieden' },
     [0]: { bg:t.bgInk,   stroke:t.inkMute,name:'neutral' },
     [1]: { bg:'#dce8d2', stroke:t.ok,     name:'zufrieden' },
     [2]: { bg:'#cfe7d8', stroke:t.ok,     name:'begeistert' },
  };
  const p = palette[mood] || palette[0];
  // mouth path per mood (in 24x24 viewBox)
  const mouth = {
    [-2]: 'M8 17 Q12 13 16 17',          // big frown
    [-1]: 'M8 16 Q12 14.5 16 16',        // small frown
     [0]: 'M8 16 L16 16',                // flat
     [1]: 'M8 15 Q12 17 16 15',          // small smile
     [2]: 'M7 14 Q12 19 17 14',          // big smile
  }[mood];
  // eyebrows per mood
  const browL = {
    [-2]:'M7 9 L11 11',  [-1]:'M7 10 L11 10.6', [0]:'M7 10 L11 10',
     [1]:'M7 10 L11 9.6', [2]:'M7 10 L11 9.4',
  }[mood];
  const browR = {
    [-2]:'M13 11 L17 9', [-1]:'M13 10.6 L17 10', [0]:'M13 10 L17 10',
     [1]:'M13 9.6 L17 10', [2]:'M13 9.4 L17 10',
  }[mood];
  // eyes: angry mood gets slits; delighted gets curved happy eyes
  const eyes = mood === 2 ? (
    <g stroke={p.stroke} strokeWidth="1.5" strokeLinecap="round" fill="none">
      <path d="M8.5 12.5 Q10 11 11.5 12.5"/>
      <path d="M12.5 12.5 Q14 11 15.5 12.5"/>
    </g>
  ) : mood === -2 ? (
    <g fill={p.stroke}>
      <circle cx="10" cy="12.5" r="1.1"/>
      <circle cx="14" cy="12.5" r="1.1"/>
    </g>
  ) : (
    <g fill={p.stroke}>
      <circle cx="10" cy="12.5" r="0.95"/>
      <circle cx="14" cy="12.5" r="0.95"/>
    </g>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
         role="img" aria-label={`Stimmung: ${p.name}`}>
      {ring && <circle cx="12" cy="12" r="11" fill={p.bg} stroke={p.stroke} strokeWidth="1.2"/>}
      <g stroke={p.stroke} strokeWidth="1.5" strokeLinecap="round" fill="none">
        <path d={browL}/><path d={browR}/>
      </g>
      {eyes}
      <path d={mouth} stroke={p.stroke} strokeWidth="1.6" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

// ---------- PROCEDURAL PORTRAIT ----------
// SVG placeholder, seeded by initials → palette + body/face combo.
// No photos. Reads as "press-card line drawing", deliberately on-brand.
function Portrait({name='??', role, theme, scheme, size=72, variant}){
  const t = THEMES[theme][scheme];
  // Deterministic hash
  const seed = [...name].reduce((a,c)=>a + c.charCodeAt(0), 0);
  const initials = name.split(' ').slice(0,2).map(p=>p[0]).join('').toUpperCase();
  // Two skintones + ink hair palette
  const skin = ['#e6c9aa','#d2a679','#bb8a5e','#7e553a','#3b2719'][seed % 5];
  const suitColors = ['#1a1410', '#2a3344', '#3b2419', '#1f2e1d', '#36202b'];
  const suit = suitColors[(seed >> 1) % suitColors.length];
  const tieColors = [t.accent, '#c8a45a', '#2b6b3f', '#7a1a1a', '#1f4a3a'];
  const tie = variant==='player' ? null : tieColors[(seed >> 2) % tieColors.length];
  // Hair shape (0..3) + facial hair flag
  const hair = (seed >> 3) % 4;
  const beard = ((seed >> 4) & 1) === 1 && variant !== 'reporter';
  const glasses = ((seed >> 5) & 1) === 1;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80"
         role="img" aria-label={`Porträt-Platzhalter: ${name}${role?', '+role:''}`}>
      <defs>
        <clipPath id={`pc-${seed}`}><circle cx="40" cy="40" r="38"/></clipPath>
      </defs>
      <g clipPath={`url(#pc-${seed})`}>
        {/* background paper */}
        <rect width="80" height="80" fill={t.bgInk}/>
        {/* shoulders / jacket */}
        {variant==='player' ? (
          <g>
            {/* football jersey: round neck */}
            <path d="M8 80 L8 64 Q20 56 32 56 L48 56 Q60 56 72 64 L72 80 Z" fill={t.accent}/>
            <path d="M32 56 Q40 62 48 56" fill={skin}/>
          </g>
        ) : (
          <g>
            <path d="M6 80 L6 66 Q14 58 28 56 L52 56 Q66 58 74 66 L74 80 Z" fill={suit}/>
            {/* shirt triangle */}
            <path d="M32 56 L40 70 L48 56 Q48 64 40 66 Q32 64 32 56 Z" fill="#f4ede0"/>
            {/* tie */}
            {tie && <path d="M37 56 L40 62 L43 56 L42 72 L38 72 Z" fill={tie}/>}
          </g>
        )}
        {/* neck */}
        <rect x="34" y="50" width="12" height="8" fill={skin}/>
        {/* head */}
        <ellipse cx="40" cy="38" rx="16" ry="18" fill={skin}/>
        {/* hair */}
        {hair===0 && <path d="M24 36 Q24 18 40 18 Q56 18 56 36 Q52 26 40 24 Q28 26 24 36 Z" fill={t.ink}/>}
        {hair===1 && <path d="M22 38 Q22 20 40 20 Q58 20 58 38 L56 32 Q54 26 50 24 L46 28 Q42 24 36 26 Q30 30 26 36 Z" fill={t.ink}/>}
        {hair===2 && <path d="M26 30 Q30 16 50 18 Q56 22 58 32 L54 28 Q44 22 32 28 Z" fill={t.ink}/>}
        {hair===3 && null /* bald-ish */}
        {/* eyes */}
        <g fill={t.ink}>
          <circle cx="34" cy="38" r="1.3"/>
          <circle cx="46" cy="38" r="1.3"/>
        </g>
        {/* eyebrows */}
        <g stroke={t.ink} strokeWidth="1.4" strokeLinecap="round">
          <line x1="31" y1="34" x2="37" y2="34"/>
          <line x1="43" y1="34" x2="49" y2="34"/>
        </g>
        {/* nose */}
        <path d="M40 39 L38 44 L41 45" fill="none" stroke={t.ink} strokeWidth="1" strokeLinecap="round" opacity=".6"/>
        {/* mouth */}
        <path d="M36 48 Q40 50 44 48" fill="none" stroke={t.ink} strokeWidth="1.4" strokeLinecap="round"/>
        {/* beard */}
        {beard && (
          <path d="M30 44 Q30 56 40 56 Q50 56 50 44 Q46 48 40 50 Q34 48 30 44 Z" fill={t.ink} opacity=".85"/>
        )}
        {/* glasses */}
        {glasses && (
          <g fill="none" stroke={t.ink} strokeWidth="1.4">
            <circle cx="34" cy="38" r="4"/>
            <circle cx="46" cy="38" r="4"/>
            <line x1="38" y1="38" x2="42" y2="38"/>
          </g>
        )}
      </g>
      <circle cx="40" cy="40" r="38" fill="none" stroke={t.ink} strokeWidth="1.2"/>
      {/* initials chip bottom-right */}
      <g>
        <circle cx="64" cy="64" r="11" fill={t.bg} stroke={t.ink} strokeWidth="1"/>
        <text x="64" y="68" textAnchor="middle" fontFamily="Newsreader, Georgia, serif" fontWeight="700" fontSize="12" fill={t.ink}>{initials}</text>
      </g>
    </svg>
  );
}

// ---------- 5-SEGMENT SATISFACTION METER ----------
// Discrete, 5 cells, labelled, with a triangle pointer at the current value.
// value ∈ [-2..+2]. Use for: Vorstand, Sponsor, Fans, Spielerseite.
function SentimentMeter({value=0, label, theme, scheme, accent}){
  const t = THEMES[theme][scheme];
  const cells = [-2,-1,0,1,2];
  const colors = ['#d05541', '#c98a08', t.inkMute, '#5d8e44', t.ok];
  return (
    <div>
      {label && <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
        <span style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.5, textTransform:'uppercase'}}>{label}</span>
        <span style={{fontSize:11, color: value>=1?t.ok : value<=-1?t.danger : t.inkMute, fontWeight:800, fontFamily:'JetBrains Mono'}}>
          {value>0?'+':''}{value} / 2
        </span>
      </div>}
      <div style={{position:'relative', marginTop:6}}>
        <div style={{display:'flex', gap:3}}>
          {cells.map((c,i)=>(
            <div key={c} style={{
              flex:1, height:10, borderRadius:3,
              background: i <= value+2 ? colors[i] : `${colors[i]}33`,
              border:`1px solid ${i <= value+2 ? colors[i] : 'transparent'}`,
            }}/>
          ))}
        </div>
        {/* pointer triangle */}
        <div style={{
          position:'absolute',
          left:`calc(${((value+2)/4)*100}% - 5px)`,
          top:11,
          width:0, height:0,
          borderLeft:'5px solid transparent',
          borderRight:'5px solid transparent',
          borderTop:`6px solid ${t.ink}`,
        }}/>
      </div>
      <div style={{display:'flex', justifyContent:'space-between', marginTop:10, fontSize:9, color:t.inkSoft, fontWeight:600}}>
        <span>wütend</span><span>unzufrieden</span><span>neutral</span><span>zufrieden</span><span>begeistert</span>
      </div>
    </div>
  );
}

// ---------- VERTICAL GAUGE / "BAROMETER" ----------
// For board confidence (Vorstandsvertrauen) — a vertical mercury column,
// 0..10, with a face icon at the top.
function ConfidenceGauge({value=7, max=10, theme, scheme, label='Vertrauen'}){
  const t = THEMES[theme][scheme];
  const mood = value>=8 ? 2 : value>=6 ? 1 : value>=4 ? 0 : value>=2 ? -1 : -2;
  const pct = (value/max)*100;
  return (
    <div style={{display:'flex', gap:14, alignItems:'stretch'}}>
      {/* gauge */}
      <div style={{position:'relative', width:32, height:120, background:t.bgInk, borderRadius:99, border:`1px solid ${t.rule}`, overflow:'hidden'}}>
        {/* fill */}
        <div style={{
          position:'absolute', left:0, right:0, bottom:0, height:pct+'%',
          background:`linear-gradient(to top, ${mood>=1?t.ok : mood<=-1?t.danger : t.warn}, ${mood>=1?t.ok+'aa' : mood<=-1?t.danger+'aa' : t.warn+'aa'})`,
        }}/>
        {/* tick marks */}
        {[2,4,6,8].map(v=>(
          <div key={v} style={{position:'absolute', left:0, right:0, bottom:(v/max)*100+'%', height:1, background:t.bg, opacity:.7}}/>
        ))}
        {/* numeric label inside */}
        <div style={{position:'absolute', left:0, right:0, top:6, textAlign:'center', color:'#fff', fontFamily:'JetBrains Mono', fontSize:11, fontWeight:800, textShadow:'0 1px 2px rgba(0,0,0,.3)'}}>{value}</div>
      </div>
      <div style={{display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
        <MoodFace mood={mood} size={40} theme={theme} scheme={scheme}/>
        <div>
          <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.5, textTransform:'uppercase'}}>{label}</div>
          <SerifH theme={theme} style={{fontSize:18, fontWeight:700, color:t.ink, lineHeight:1}}>{value}<span style={{color:t.inkSoft, fontSize:13, fontWeight:500}}>/{max}</span></SerifH>
        </div>
      </div>
    </div>
  );
}

// ---------- SHARED SCREEN HEADER ----------
// Now delegates to the global ScreenHeader so negotiation screens also get
// the club crest + shortcode framing.
function NegHeader({theme, scheme, kicker, title, right}){
  return (
    <ScreenHeader theme={theme} scheme={scheme}
      kicker={kicker} title={title} right={right}/>
  );
}

// =================================================================
// 11. PLAYER CONTRACT NEGOTIATION
// =================================================================
function ScreenPlayerNeg({theme, scheme}){
  const t = THEMES[theme][scheme];
  const tr = useT();
  const isDe = getLocale() === 'de';
  // Sliders mirror anstoss-style: salary, length, sign-on bonus, goal bonus.
  const [salary, setSalary] = React.useState(38);    // % of slider (range 50–250k/Monat)
  const [years,  setYears]  = React.useState(40);    // 1..5
  const [signon, setSignon] = React.useState(25);
  const [goalb,  setGoalb]  = React.useState(45);
  // derived live mood
  const playerMood  = salary > 60 || (salary>40 && years>40) ? 1 : salary<25 ? -2 : salary<40?-1: 0;
  const agentMood   = (salary + signon/2 + goalb/3) > 80 ? 2 : (salary + signon/2 + goalb/3) > 55 ? 1 : (salary + signon/2 + goalb/3) > 35 ? 0 : -1;
  const boardMood   = salary > 70 ? -2 : salary > 55 ? -1 : salary > 40 ? 0 : 1;
  // €/Monat
  const salaryEur   = Math.round(50_000 + (salary/100)*200_000);
  const signonEur   = Math.round((signon/100) * 1_500_000);
  const yearsN      = Math.max(1, Math.round((years/100)*5));

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%', position:'relative'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <NegHeader theme={theme} scheme={scheme}
        kicker={(isDe ? 'Vertragsverhandlung' : 'Contract negotiation') + ' · Marek Brody'}
        title={isDe ? 'Am Tisch sitzt der Berater.' : 'The agent has taken his seat.'}
        right={<button aria-label={tr('common.close')} style={{width:36, height:36, borderRadius:10, background:t.card, border:`1px solid ${t.rule}`, display:'grid', placeItems:'center'}}><I.X size={16} color={t.ink}/></button>}/>

      {/* Triptych: player · agent · ledger */}
      <div style={{padding:'0 16px'}}>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'12px 14px'}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
            {/* Player */}
            <div style={{display:'flex', alignItems:'center', gap:10}}>
              <Portrait name="Marek Brody" theme={theme} scheme={scheme} size={56} variant="player"/>
              <div>
                <SerifH theme={theme} style={{fontSize:14, fontWeight:700, color:t.ink, lineHeight:1}}>Marek Brody</SerifH>
                <div style={{fontSize:10.5, color:t.inkMute, marginTop:2}}>OM · 26 J. · Stärke 8</div>
                <div style={{marginTop:5}}><MoodFace mood={playerMood} size={26} theme={theme} scheme={scheme}/></div>
              </div>
            </div>
            {/* Agent */}
            <div style={{display:'flex', alignItems:'center', gap:10}}>
              <Portrait name="Hubertus Klug" theme={theme} scheme={scheme} size={56}/>
              <div>
                <SerifH theme={theme} style={{fontSize:14, fontWeight:700, color:t.ink, lineHeight:1}}>Hubertus Klug</SerifH>
                <div style={{fontSize:10.5, color:t.inkMute, marginTop:2}}>Berater · streng kalkulierend</div>
                <div style={{marginTop:5}}><MoodFace mood={agentMood} size={26} theme={theme} scheme={scheme}/></div>
              </div>
            </div>
          </div>

          {/* Speech card */}
          <div style={{marginTop:12, padding:'10px 12px', background:t.bgInk, borderRadius:10, fontFamily:THEMES[theme].font, fontStyle:'italic', fontSize:13, color:t.ink, lineHeight:1.4, position:'relative'}}>
            <span style={{position:'absolute', top:-6, left:14, width:12, height:12, background:t.bgInk, transform:'rotate(45deg)'}}/>
            {agentMood >= 1
              ? '„Damit könnten wir leben, Herr Trainer. Mein Mandant hört auf Argumente."'
              : agentMood === 0
              ? '„Hmm. Wir nehmen das mit nach Hause und reden mit den Eltern."'
              : '„Sie scherzen, oder? Halb Aurelia würde mehr bieten."'}
          </div>
        </div>
      </div>

      {/* Live offer summary + sliders */}
      <div style={{flex:1, overflowY:'auto', padding:'12px 16px 110px'}}>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'10px 14px', marginBottom:12}}>
          <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between'}}>
            <span style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>Aktuelles Angebot</span>
            <span style={{fontSize:11, color:t.accent, fontWeight:800}}>jährlich {new Intl.NumberFormat('de-DE').format(salaryEur*12)} €</span>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginTop:8}}>
            <Pill v={`${new Intl.NumberFormat('de-DE').format(salaryEur)} €`} k="pro Monat" theme={theme} scheme={scheme}/>
            <Pill v={`${yearsN} Jahre`} k="Laufzeit" theme={theme} scheme={scheme}/>
            <Pill v={`${new Intl.NumberFormat('de-DE').format(signonEur)} €`} k="Handgeld" theme={theme} scheme={scheme}/>
          </div>
        </div>

        <NegSlider theme={theme} scheme={scheme} label="Grundgehalt"     value={salary} onChange={setSalary} leftL="50.000 €/Mon" rightL="250.000 €/Mon" hint={`${new Intl.NumberFormat('de-DE').format(salaryEur)} €`}/>
        <NegSlider theme={theme} scheme={scheme} label="Laufzeit"        value={years}  onChange={setYears}  leftL="1 J."        rightL="5 J."         hint={`${yearsN} Jahre`}/>
        <NegSlider theme={theme} scheme={scheme} label="Handgeld"        value={signon} onChange={setSignon} leftL="0 €"         rightL="1,5 Mio. €"   hint={`${new Intl.NumberFormat('de-DE').format(signonEur)} €`}/>
        <NegSlider theme={theme} scheme={scheme} label="Torprämie"       value={goalb}  onChange={setGoalb}  leftL="0 €"         rightL="50.000 € / Tor" hint={`${Math.round((goalb/100)*50_000).toLocaleString('de-DE')} €`}/>

        {/* Stakeholder reactions */}
        <div style={{marginTop:14, background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'10px 14px'}}>
          <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', marginBottom:8}}>Reaktionen</div>
          <ReactionRow theme={theme} scheme={scheme} who="Spieler"  detail="Wechselt gerne, aber nicht zu jedem Preis." mood={playerMood}/>
          <ReactionRow theme={theme} scheme={scheme} who="Berater"  detail="Provision 10 %. Will Familienbonus." mood={agentMood}/>
          <ReactionRow theme={theme} scheme={scheme} who="Vorstand" detail="Lohnkostenquote nähert sich der Schmerzgrenze." mood={boardMood} last/>
        </div>
      </div>

      {/* Sticky actions */}
      <div style={{position:'absolute', left:0, right:0, bottom:0, padding:'10px 16px 22px', background:`linear-gradient(to top, ${t.bg} 80%, transparent)`, display:'flex', gap:8}}>
        <button style={{flex:1, height:50, borderRadius:14, background:'transparent', border:`1px solid ${t.rule}`, color:t.ink, fontWeight:700, fontSize:13, fontFamily:'inherit'}}>Vertagen</button>
        <button style={{flex:1, height:50, borderRadius:14, background:t.bg, border:`1px solid ${t.danger}`, color:t.danger, fontWeight:700, fontSize:13, fontFamily:'inherit'}}>Abbrechen</button>
        <button style={{flex:2, height:50, borderRadius:14, background:t.accent, color:'#fff', border:'none', fontWeight:800, fontSize:14, fontFamily:'inherit', boxShadow:`0 6px 14px -4px ${t.accent}80`}}>Angebot abgeben</button>
      </div>
    </div>
  );
}

function Pill({v, k, theme, scheme}){
  const t = THEMES[theme][scheme];
  return (
    <div style={{background:t.bg, border:`1px solid ${t.rule}`, borderRadius:10, padding:'8px 10px', textAlign:'center'}}>
      <div style={{fontFamily:'JetBrains Mono', fontSize:12, fontWeight:800, color:t.ink, lineHeight:1.1}}>{v}</div>
      <div style={{fontSize:10, color:t.inkMute, fontWeight:600, marginTop:2}}>{k}</div>
    </div>
  );
}

function NegSlider({theme, scheme, label, value, onChange, leftL, rightL, hint}){
  const t = THEMES[theme][scheme];
  return (
    <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'10px 14px', marginBottom:8}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
        <span style={{fontSize:12.5, fontWeight:700, color:t.ink}}>{label}</span>
        <span style={{fontSize:12, color:t.accent, fontFamily:'JetBrains Mono', fontWeight:700}}>{hint}</span>
      </div>
      <div style={{position:'relative', height:30, marginTop:6}}>
        <div style={{position:'absolute', top:13, left:0, right:0, height:4, background:t.bgInk, borderRadius:99}}/>
        <div style={{position:'absolute', top:13, left:0, width:value+'%', height:4, background:t.accent, borderRadius:99}}/>
        <div style={{position:'absolute', top:6, left:`calc(${value}% - 9px)`, width:18, height:18, borderRadius:99, background:t.card, border:`2px solid ${t.accent}`, boxShadow:`0 1px 3px ${t.ink}30`}}/>
        <input type="range" min="0" max="100" value={value} onChange={e=>onChange(+e.target.value)}
          style={{position:'absolute', inset:0, opacity:0, cursor:'pointer'}}/>
      </div>
      <div style={{display:'flex', justifyContent:'space-between', fontSize:10, color:t.inkSoft, marginTop:2}}>
        <span>{leftL}</span><span>{rightL}</span>
      </div>
    </div>
  );
}

function ReactionRow({who, detail, mood, theme, scheme, last}){
  const t = THEMES[theme][scheme];
  return (
    <div style={{display:'flex', alignItems:'center', gap:10, padding:'7px 0', borderBottom: last?'none':`1px solid ${t.rule}`}}>
      <MoodFace mood={mood} size={32} theme={theme} scheme={scheme}/>
      <div style={{flex:1}}>
        <div style={{fontSize:12.5, fontWeight:700, color:t.ink}}>{who}</div>
        <div style={{fontSize:11, color:t.inkMute, lineHeight:1.3, fontFamily:THEMES[theme].font, fontStyle:'italic'}}>{detail}</div>
      </div>
    </div>
  );
}

// =================================================================
// 12. VORSTANDSVERTRAUEN — board confidence dashboard
// =================================================================
function ScreenBoardConfidence({theme, scheme}){
  const t = THEMES[theme][scheme];
  const tr = useT();
  const isDe = getLocale() === 'de';
  const board = [
    { n:'Dr. Reiner Stahl',  role:'Präsident',         conf:6, mood:0,  q:'„Die Tabelle stimmt — der Stil noch nicht."' },
    { n:'Margit Hoyer',      role:'Schatzmeisterin',   conf:8, mood:1,  q:'„Solide Zahlen. Bitte so weiter."' },
    { n:'Bernd Walther',     role:'Sportvorstand',     conf:5, mood:0,  q:'„Wir brauchen einen Außenverteidiger. Sofort."' },
    { n:'Yvonne Korn',       role:'Marketing',         conf:9, mood:2,  q:'„Brody verkauft sich wie warme Brezeln."' },
    { n:'Lutz Penner',       role:'Aufsichtsrat',      conf:4, mood:-1, q:'„Northbridge ist Pflicht. Punkt."' },
  ];
  const avg = (board.reduce((a,b)=>a+b.conf,0) / board.length);
  const objectives = [
    { l:'Klassenerhalt', tgt:'Pflicht', state:'gesichert', ok:true,  pct:100 },
    { l:'Top 6 erreichen', tgt:'Soll',  state:'2. Platz', ok:true,   pct:88 },
    { l:'Confederation-Cup-Achtelfinale', tgt:'Kann', state:'erreicht', ok:true, pct:100 },
    { l:'Lohnkostenquote unter 55 %', tgt:'Soll', state:'aktuell 58 %', ok:false, pct:42 },
  ];
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <NegHeader theme={theme} scheme={scheme}
        kicker={isDe ? 'Vorstandssitzung · 18. Mai' : 'Board meeting · 18 May'}
        title={tr('board.title')}/>

      {/* Aggregate barometer */}
      <div style={{padding:'0 16px'}}>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'14px'}}>
          <div style={{display:'flex', alignItems:'center', gap:16}}>
            <ConfidenceGauge theme={theme} scheme={scheme} value={Math.round(avg)} label="Vertrauen · Ø"/>
            <div style={{flex:1, fontFamily:THEMES[theme].font, fontStyle:'italic', fontSize:13, color:t.ink, lineHeight:1.4}}>
              „Der Vorstand bleibt geduldig — vorerst. Eine Niederlage in Northbridge, und die Stimmung kippt."
            </div>
          </div>
          <div style={{marginTop:10}}>
            <SentimentMeter theme={theme} scheme={scheme} value={avg>=8?2:avg>=6?1:avg>=4?0:avg>=2?-1:-2} label="Gesamtstimmung"/>
          </div>
        </div>
      </div>

      {/* Per-member cards */}
      <div style={{flex:1, overflowY:'auto', padding:'14px 16px 20px'}}>
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', marginBottom:6}}>Stimmen aus dem Vorstand</div>
        {board.map((m,i)=>(
          <div key={i} style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'10px 12px', marginBottom:8, display:'flex', gap:10, alignItems:'flex-start'}}>
            <Portrait name={m.n} role={m.role} theme={theme} scheme={scheme} size={48}/>
            <div style={{flex:1, minWidth:0}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                <div>
                  <SerifH theme={theme} style={{fontSize:14, fontWeight:700, color:t.ink, lineHeight:1.05}}>{m.n}</SerifH>
                  <div style={{fontSize:10.5, color:t.inkMute}}>{m.role}</div>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:6}}>
                  <MoodFace mood={m.mood} size={26} theme={theme} scheme={scheme}/>
                  <span style={{fontFamily:'JetBrains Mono', fontSize:13, fontWeight:800, color: m.conf>=7?t.ok : m.conf<=4?t.danger : t.warn}}>{m.conf}<span style={{color:t.inkSoft, fontWeight:500, fontSize:11}}>/10</span></span>
                </div>
              </div>
              <div style={{fontSize:11.5, color:t.inkMute, marginTop:6, fontFamily:THEMES[theme].font, fontStyle:'italic', lineHeight:1.35}}>{m.q}</div>
            </div>
          </div>
        ))}

        {/* Objectives */}
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'14px 2px 6px'}}>Saisonziele</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'2px 12px'}}>
          {objectives.map((o,i)=>(
            <div key={i} style={{padding:'10px 0', borderBottom: i<objectives.length-1?`1px solid ${t.rule}`:'none'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                <div style={{display:'flex', gap:6, alignItems:'baseline'}}>
                  <span style={{fontSize:9, fontWeight:800, color:t.inkSoft, letterSpacing:.5, textTransform:'uppercase'}}>{o.tgt}</span>
                  <span style={{fontSize:13, fontWeight:700, color:t.ink}}>{o.l}</span>
                </div>
                <span style={{fontSize:11, fontWeight:700, color: o.ok?t.ok:t.danger, display:'inline-flex', alignItems:'center', gap:4}}>
                  {o.ok ? <I.Check size={13} color={t.ok}/> : <span style={{width:12, height:2, background:t.danger}}/>}
                  {o.state}
                </span>
              </div>
              <div style={{height:5, marginTop:6, background:t.bgInk, borderRadius:99, overflow:'hidden'}}>
                <div style={{width:o.pct+'%', height:'100%', background: o.ok?t.ok:t.danger}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =================================================================
// 13. SPONSOR NEGOTIATION
// =================================================================
function ScreenSponsorNeg({theme, scheme}){
  const t = THEMES[theme][scheme];
  const tr = useT();
  const isDe = getLocale() === 'de';
  // Active sponsor portfolio
  const sponsors = [
    { id:'shirt',  type:'Trikot',     name:'Volta Bank',     value: 1_800_000, until:'2027', mood: 1, fit:'hoch', logo:{a:'#0e3a5f', b:'#c8a45a', glyph:'V'} },
    { id:'sleeve', type:'Ärmel',      name:'Lumin Telekom',  value:   420_000, until:'2026', mood: 0, fit:'mittel', logo:{a:'#7a1a1a', b:'#f0e8d8', glyph:'L'} },
    { id:'arena',  type:'Stadion',    name:'Nordis Air',     value: 2_400_000, until:'2028', mood: 2, fit:'hoch', logo:{a:'#1f4a3a', b:'#e8d28a', glyph:'N'} },
    { id:'back',   type:'Rückseite',  name:'Slot frei',      value: 0,         until:'–',    mood: null, fit:'–', logo:null },
  ];
  // Current open negotiation
  const [exposure, setExposure] = React.useState(60);    // % brand exposure
  const [length,   setLength]   = React.useState(40);    // 1..4 Jahre
  const [perf,     setPerf]     = React.useState(35);    // erfolgsabhängig
  const sponsorMood = exposure>40 ? (perf>30?1:0) : -1;
  const fanMood     = exposure>70 ? -1 : exposure>50 ? 0 : 1;
  const yearN = Math.max(1, Math.round((length/100)*4));
  const offerEur = Math.round(800_000 + (exposure/100)*1_200_000 + (perf/100)*400_000);

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%', position:'relative'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <NegHeader theme={theme} scheme={scheme}
        kicker={isDe ? 'Sponsoring · Vertragsgespräch' : 'Sponsor · deal talks'}
        title="Korex Mobil"
        right={<span style={{fontSize:10, fontWeight:800, color:t.accent, padding:'4px 8px', background:t.accentSoft, borderRadius:99}}>{isDe ? 'RÜCKSEITE' : 'SLEEVE'}</span>}/>

      {/* Sponsor introduction */}
      <div style={{padding:'0 16px'}}>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'12px 14px'}}>
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <SponsorLogo a="#262626" b="#c97a2a" glyph="K" size={56}/>
            <div style={{flex:1, minWidth:0}}>
              <SerifH theme={theme} style={{fontSize:16, fontWeight:700, color:t.ink, lineHeight:1.05}}>Korex Mobil AG</SerifH>
              <div style={{fontSize:11, color:t.inkMute, marginTop:2}}>Telekommunikation · Hafenstadt</div>
              <div style={{marginTop:6, display:'flex', alignItems:'center', gap:6}}>
                <MoodFace mood={sponsorMood} size={26} theme={theme} scheme={scheme}/>
                <span style={{fontSize:11, color:t.inkMute, fontFamily:THEMES[theme].font, fontStyle:'italic'}}>„Wir sind interessiert. Markenfit wäre da."</span>
              </div>
            </div>
          </div>
          {/* Brand fit row */}
          <div style={{marginTop:10, padding:'8px 10px', background:t.bgInk, borderRadius:10, display:'flex', alignItems:'center', gap:10}}>
            <span style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.4, textTransform:'uppercase'}}>Markenfit</span>
            <div style={{flex:1, display:'flex', gap:3}}>
              {[1,2,3,4,5].map(i=>(
                <div key={i} style={{flex:1, height:6, borderRadius:2, background: i<=4 ? t.accent : t.rule}}/>
              ))}
            </div>
            <span style={{fontSize:11, color:t.accent, fontWeight:800, fontFamily:'JetBrains Mono'}}>4/5</span>
          </div>
        </div>
      </div>

      {/* Live offer */}
      <div style={{flex:1, overflowY:'auto', padding:'12px 16px 110px'}}>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'10px 14px', marginBottom:12}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
            <span style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>Korex zahlt</span>
            <span style={{fontSize:13, color:t.accent, fontWeight:800, fontFamily:'JetBrains Mono'}}>{new Intl.NumberFormat('de-DE').format(offerEur)} € / Saison</span>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:8}}>
            <Pill v={`${yearN} Saison${yearN>1?'s':''}`} k="Laufzeit" theme={theme} scheme={scheme}/>
            <Pill v={`+ ${Math.round((perf/100)*400_000).toLocaleString('de-DE')} €`} k="bei Top-3-Platzierung" theme={theme} scheme={scheme}/>
          </div>
        </div>

        <NegSlider theme={theme} scheme={scheme} label="Markenpräsenz"   value={exposure} onChange={setExposure} leftL="dezent"      rightL="omnipräsent" hint={`${exposure}%`}/>
        <NegSlider theme={theme} scheme={scheme} label="Laufzeit"        value={length}   onChange={setLength}   leftL="1 Saison"    rightL="4 Saisons"   hint={`${yearN} Saison${yearN>1?'s':''}`}/>
        <NegSlider theme={theme} scheme={scheme} label="Erfolgsabhängig" value={perf}     onChange={setPerf}     leftL="Festbetrag"  rightL="hoher Bonus" hint={`${Math.round(perf)} %`}/>

        {/* Stakeholder reactions */}
        <div style={{marginTop:14, background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'10px 14px'}}>
          <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', marginBottom:8}}>Wer schaut zu</div>
          <ReactionRow theme={theme} scheme={scheme} who="Korex Mobil" detail={sponsorMood>=1?'„Faires Paket. Wir bringen unsere Werbeagentur mit."':'„Zu wenig Schaufenster für unser Geld."'} mood={sponsorMood}/>
          <ReactionRow theme={theme} scheme={scheme} who="Stammfans"   detail={fanMood<=-1?'„Noch ein Werbe-Patch — wo ist eigentlich das Wappen?"':'„Solange das Trikot atmet, ist alles fein."'} mood={fanMood}/>
          <ReactionRow theme={theme} scheme={scheme} who="Vorstand"    detail="Mehr Geld bitte, weniger Schweißfleck." mood={1} last/>
        </div>

        {/* Portfolio overview */}
        <div style={{marginTop:14}}>
          <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'2px 2px 6px'}}>Aktuelles Portfolio</div>
          {sponsors.map((s,i)=>{
            const open = !s.logo;
            return (
              <div key={i} style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'10px 12px', display:'flex', alignItems:'center', gap:10, marginBottom:6}}>
                {open
                  ? <div style={{width:38, height:38, borderRadius:9, border:`1.5px dashed ${t.rule}`, display:'grid', placeItems:'center', flex:'0 0 38px'}}><I.Plus size={16} color={t.inkMute}/></div>
                  : <SponsorLogo a={s.logo.a} b={s.logo.b} glyph={s.logo.glyph} size={38}/>}
                <div style={{flex:1, minWidth:0}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:6}}>
                    <SerifH theme={theme} style={{fontSize:13.5, fontWeight:700, color:open?t.inkMute:t.ink, lineHeight:1.05}}>{s.name}</SerifH>
                    <span style={{fontSize:10, color:t.inkSoft, fontWeight:700}}>{s.type}</span>
                  </div>
                  <div style={{fontSize:11, color:t.inkMute, marginTop:2, fontFamily:'JetBrains Mono'}}>
                    {s.value ? `${new Intl.NumberFormat('de-DE').format(s.value)} €/Saison` : 'verhandelbar'} · bis {s.until}
                  </div>
                </div>
                {s.mood!==null && <MoodFace mood={s.mood} size={24} theme={theme} scheme={scheme}/>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky actions */}
      <div style={{position:'absolute', left:0, right:0, bottom:0, padding:'10px 16px 22px', background:`linear-gradient(to top, ${t.bg} 80%, transparent)`, display:'flex', gap:8}}>
        <button style={{flex:1, height:50, borderRadius:14, background:'transparent', border:`1px solid ${t.rule}`, color:t.ink, fontWeight:700, fontSize:13, fontFamily:'inherit'}}>Vertagen</button>
        <button style={{flex:2, height:50, borderRadius:14, background:t.accent, color:'#fff', border:'none', fontWeight:800, fontSize:14, fontFamily:'inherit', boxShadow:`0 6px 14px -4px ${t.accent}80`}}>Unterschreiben</button>
      </div>
    </div>
  );
}

function SponsorLogo({a, b, glyph='V', size=44}){
  return (
    <svg width={size} height={size} viewBox="0 0 44 44">
      <rect x="2" y="2" width="40" height="40" rx="7" fill={a} stroke="#0c0a08" strokeWidth="1"/>
      <rect x="2" y="22" width="40" height="20" rx="0" fill={b}/>
      <rect x="2" y="22" width="40" height="20" fill="none" clipPath="inset(0)"/>
      <rect x="2" y="2" width="40" height="40" rx="7" fill="none" stroke="#0c0a08" strokeWidth="1"/>
      <text x="22" y="29" textAnchor="middle" fontFamily="Newsreader, Georgia, serif" fontWeight="800" fontSize="22" fill="#0c0a08">{glyph}</text>
    </svg>
  );
}

// =================================================================
// 14. PRESS INTERVIEW (bonus — Anstoss-style 4-answer pick)
// =================================================================
function ScreenPressInterview({theme, scheme}){
  const t = THEMES[theme][scheme];
  const tr = useT();
  const isDe = getLocale() === 'de';
  const [pick, setPick] = React.useState(1);
  const A = [
    { tone:'Demütig',       text:'„Wir nehmen jeden Gegner ernst — auch Northbridge."',           board: 0, fans: 0,  player: 1 },
    { tone:'Selbstbewusst', text:'„Wir fahren hin, um zu gewinnen. Punkt."',                      board: 1, fans: 2,  player: 1 },
    { tone:'Provokant',     text:'„Northbridge wird sich noch wundern."',                         board:-1, fans: 1,  player:-1 },
    { tone:'Ausweichend',   text:'„Dazu möchte ich mich heute nicht äußern."',                    board: 0, fans:-1,  player: 0 },
  ];
  const chosen = A[pick];
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%', position:'relative'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <NegHeader theme={theme} scheme={scheme}
        kicker={isDe ? 'Auerbach-Zeitung · Mittwochsausgabe' : 'Auerbach Times · Wednesday edition'}
        title={isDe ? 'Interview vor Northbridge' : 'Interview ahead of Northbridge'}/>

      <div style={{padding:'0 16px'}}>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'12px 14px', display:'flex', gap:12, alignItems:'flex-start'}}>
          <Portrait name="Theresa Voss" theme={theme} scheme={scheme} size={52} variant="reporter"/>
          <div style={{flex:1}}>
            <SerifH theme={theme} style={{fontSize:14, fontWeight:700, color:t.ink, lineHeight:1.05}}>Theresa Voss</SerifH>
            <div style={{fontSize:11, color:t.inkMute, marginTop:1}}>Sportreporterin · Auerbach-Zeitung</div>
            <div style={{marginTop:8, padding:'10px 12px', background:t.bgInk, borderRadius:10, fontFamily:THEMES[theme].font, fontStyle:'italic', fontSize:13, color:t.ink, lineHeight:1.4, position:'relative'}}>
              <span style={{position:'absolute', top:-6, left:14, width:12, height:12, background:t.bgInk, transform:'rotate(45deg)'}}/>
              „Herr Trainer — Northbridge stellt sich am Sonntag in die Auslage. Wie nüchtern fahren Sie hin?"
            </div>
          </div>
        </div>
      </div>

      <div style={{flex:1, overflowY:'auto', padding:'14px 16px 110px'}}>
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', marginBottom:6}}>Ihre Antwort</div>
        {A.map((a,i)=>(
          <button key={i} onClick={()=>setPick(i)} style={{
            display:'block', width:'100%', textAlign:'left',
            background: pick===i ? t.accentSoft : t.card,
            border:`1px solid ${pick===i ? t.accent : t.rule}`,
            borderRadius:12, padding:'10px 12px', marginBottom:8,
            fontFamily:'inherit', cursor:'pointer'
          }}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
              <span style={{fontSize:10.5, fontWeight:800, letterSpacing:.5, color: pick===i ? t.accent : t.inkMute, textTransform:'uppercase'}}>{a.tone}</span>
              {pick===i && <I.Check size={14} color={t.accent}/>}
            </div>
            <div style={{fontFamily:THEMES[theme].font, fontStyle:'italic', fontSize:13.5, color:t.ink, marginTop:4, lineHeight:1.35}}>{a.text}</div>
          </button>
        ))}

        {/* Expected impact */}
        <div style={{marginTop:6, background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'10px 14px'}}>
          <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', marginBottom:8}}>Erwartete Wirkung</div>
          <ReactionRow theme={theme} scheme={scheme} who="Vorstand" detail={chosen.board>=1?'„Klare Kante. Das mögen wir."':chosen.board<=-1?'„Das wird uns Punkte kosten, falls es schiefgeht."':'„Solide formuliert."'} mood={chosen.board}/>
          <ReactionRow theme={theme} scheme={scheme} who="Fans"     detail={chosen.fans>=1?'„Hand vom Hafen, ihr habt es noch drauf!"':chosen.fans<=-1?'„Sagen Sie doch endlich mal etwas Konkretes."':'„Geht in Ordnung."'} mood={chosen.fans}/>
          <ReactionRow theme={theme} scheme={scheme} who="Mannschaft" detail={chosen.player>=1?'„Der Trainer steht hinter uns."':chosen.player<=-1?'„War das nötig, vor dem Spiel?"':'„Routine-Interview."'} mood={chosen.player} last/>
        </div>
      </div>

      {/* Sticky actions */}
      <div style={{position:'absolute', left:0, right:0, bottom:0, padding:'10px 16px 22px', background:`linear-gradient(to top, ${t.bg} 80%, transparent)`, display:'flex', gap:8}}>
        <button style={{flex:1, height:50, borderRadius:14, background:'transparent', border:`1px solid ${t.rule}`, color:t.ink, fontWeight:700, fontSize:13, fontFamily:'inherit'}}>„Kein Kommentar"</button>
        <button style={{flex:2, height:50, borderRadius:14, background:t.ink, color:t.bg, border:'none', fontWeight:800, fontSize:14, fontFamily:'inherit'}}>Antwort geben</button>
      </div>
    </div>
  );
}

Object.assign(window, {
  MoodFace, Portrait, SentimentMeter, ConfidenceGauge, SponsorLogo,
  ScreenPlayerNeg, ScreenBoardConfidence, ScreenSponsorNeg, ScreenPressInterview,
});
