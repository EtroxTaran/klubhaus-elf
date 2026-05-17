// identity.jsx — Klub-Identitäts-Studio.
// Two surfaces:
//   1. ScreenIdentity        — phone-portrait screen (Wappen / Trikot tabs)
//   2. IdentityStudio        — wide artboard, interactive editor + preview
//
// Closes the open TASKS item T3.4 (Trikot-Designer · heraldisch) and adds the
// missing Logo-Generator UI on top of the existing CrestGrammar engine.

// ---------------- Shared tincture palette ----------------
// Drawn from CLUB_REGISTRY tones so colour-mixing always feels "in world".
const IDENT_TINCT = [
  { id:'navy',     hex:'#0e3a5f', name:'Marineblau' },
  { id:'wine',     hex:'#7a1a1a', name:'Weinrot'    },
  { id:'forest',   hex:'#1f4a3a', name:'Tannengrün' },
  { id:'meadow',   hex:'#2b6b3f', name:'Wiesengrün' },
  { id:'liver',    hex:'#4a2a2a', name:'Leberbraun' },
  { id:'graphite', hex:'#262626', name:'Graphit'    },
  { id:'gold',     hex:'#c8a45a', name:'Altgold'    },
  { id:'brass',    hex:'#c97a2a', name:'Messing'    },
  { id:'butter',   hex:'#f4e4b8', name:'Butter'     },
  { id:'cream',    hex:'#f0e8d8', name:'Cremepapier'},
  { id:'sand',     hex:'#d8c8a8', name:'Sand'       },
  { id:'paper',    hex:'#fbf6ea', name:'Papier'     },
];

const IDENT_SHAPES   = ['heater','iberian','gonfalon','roundel'];
const IDENT_SHAPE_LABEL = { heater:'Heater', iberian:'Iberisch', gonfalon:'Gonfalon', roundel:'Rundschild' };
const IDENT_CHARGES  = ['ship','lion','eagle','tower','sword','cog','cross','star','wave','ball'];
const IDENT_CHARGE_LABEL = {
  ship:'Schiff', lion:'Löwe', eagle:'Adler', tower:'Turm', sword:'Schwert',
  cog:'Zahnrad', cross:'Kreuz', star:'Stern', wave:'Welle', ball:'Ball'
};

const IDENT_PATTERNS = [
  { id:'solid',     name:'Uni'         },
  { id:'stripes',   name:'Streifen'    },
  { id:'hoops',     name:'Querstreifen'},
  { id:'sash',      name:'Schärpe'     },
  { id:'split',     name:'Halbiert'    },
  { id:'chevron',   name:'Spitze'      },
];

// ---------------- Procedural jersey ----------------
// Single SVG, deterministic by (pattern, a, b, sleeveAccent, crest, number).
// viewBox 120×120. Crest sits on chest at (50, 56).
function Jersey({
  pattern='stripes', a='#0e3a5f', b='#c8a45a',
  sleeveAccent=true, crest=null, number='9', name='BRODY',
  showBack=false, size=200,
}){
  // Body outline (front-on shirt with raglan sleeves)
  const BODY = "M30 22 L14 18 L8 20 L4 38 L24 44 L30 38 L30 112 L90 112 L90 38 L96 44 L116 38 L112 20 L106 18 L90 22 Q60 30 30 22 Z";
  // Sleeve cuff regions (for accent fill) — taken from corners of the body path
  const CUFF_L = "M4 38 L24 44 L22 50 L4 46 Z";
  const CUFF_R = "M116 38 L96 44 L98 50 L116 46 Z";
  // Collar
  const COLLAR = "M44 22 Q60 30 76 22 L72 28 Q60 33 48 28 Z";

  const clipId = `jc-${pattern}-${a.replace('#','')}-${b.replace('#','')}-${showBack?'b':'f'}`.toLowerCase();

  // Pattern fills are rendered *inside* the body clip.
  function PatternFill(){
    switch(pattern){
      case 'solid':
        return <rect x="0" y="0" width="120" height="120" fill={a}/>;
      case 'stripes': {
        // 6 vertical stripes alternating a/b
        return (
          <g>
            <rect x="0" y="0" width="120" height="120" fill={a}/>
            {[1,3,5].map(i=>(
              <rect key={i} x={i*20-2} y="0" width="14" height="120" fill={b}/>
            ))}
          </g>
        );
      }
      case 'hoops': {
        return (
          <g>
            <rect x="0" y="0" width="120" height="120" fill={a}/>
            {[0,1,2,3].map(i=>(
              <rect key={i} x="0" y={28+i*18} width="120" height="9" fill={b}/>
            ))}
          </g>
        );
      }
      case 'sash':
        return (
          <g>
            <rect x="0" y="0" width="120" height="120" fill={a}/>
            <polygon points="0,72 0,52 120,12 120,32" fill={b}/>
          </g>
        );
      case 'split':
        return (
          <g>
            <rect x="0" y="0" width="60" height="120" fill={a}/>
            <rect x="60" y="0" width="60" height="120" fill={b}/>
          </g>
        );
      case 'chevron':
        return (
          <g>
            <rect x="0" y="0" width="120" height="120" fill={a}/>
            <polygon points="0,30 60,60 120,30 120,52 60,82 0,52" fill={b}/>
          </g>
        );
      default:
        return <rect x="0" y="0" width="120" height="120" fill={a}/>;
    }
  }

  // Pick a sensible text colour against pattern A.
  const inkOn = (hex) => {
    // Quick luminance approximation
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), bl = parseInt(hex.slice(5,7),16);
    const L = (0.299*r + 0.587*g + 0.114*bl)/255;
    return L > 0.55 ? '#11100e' : '#fbf6ea';
  };
  const ink = inkOn(a);
  const accent = sleeveAccent ? b : a;

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{display:'block'}}>
      <defs>
        <clipPath id={clipId}><path d={BODY}/></clipPath>
        <linearGradient id={`${clipId}-sh`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0"  stopColor="#000" stopOpacity="0"/>
          <stop offset="1"  stopColor="#000" stopOpacity=".18"/>
        </linearGradient>
      </defs>

      {/* Body fill with pattern */}
      <g clipPath={`url(#${clipId})`}>
        <PatternFill/>
        {/* subtle shadow */}
        <rect x="0" y="0" width="120" height="120" fill={`url(#${clipId}-sh)`}/>
      </g>

      {/* Sleeve accent stripes (cuffs) */}
      {sleeveAccent && (
        <g>
          <path d={CUFF_L} fill={accent} opacity=".95"/>
          <path d={CUFF_R} fill={accent} opacity=".95"/>
        </g>
      )}

      {/* Collar */}
      <path d={COLLAR} fill={accent}/>

      {/* Body outline */}
      <path d={BODY} fill="none" stroke="#11100e" strokeWidth="1.4" strokeLinejoin="round"/>

      {/* Front: crest + sponsor placeholder. Back: number + name. */}
      {!showBack && (
        <g>
          {crest && (
            <g transform="translate(38, 44) scale(0.22)">
              <Crest {...crest} size={100}/>
            </g>
          )}
          {/* sponsor strip — kept as a placeholder marker for sponsor flow */}
          <rect x="44" y="78" width="32" height="6" rx="1" fill={ink} opacity=".14"/>
          <text x="60" y="83" textAnchor="middle" fontSize="4.5"
                fontFamily="JetBrains Mono, monospace" fontWeight="700"
                fill={ink} opacity=".5">SPONSOR</text>
        </g>
      )}
      {showBack && (
        <g>
          <text x="60" y="50" textAnchor="middle" fontSize="9"
                fontFamily="Inter, sans-serif" fontWeight="800"
                fill={ink} letterSpacing="1">{name.toUpperCase()}</text>
          <text x="60" y="86" textAnchor="middle" fontSize="34"
                fontFamily="Inter, sans-serif" fontWeight="800"
                fill={ink}>{number}</text>
        </g>
      )}
    </svg>
  );
}

// ---------------- Shield silhouette (picker thumb) ----------------
function ShapeThumb({shape, color='#1a1410', size=28}){
  return (
    <svg width={size} height={size*1.2} viewBox="0 0 100 120">
      <path d={shieldPath(shape)} fill={color}/>
    </svg>
  );
}

// ---------------- Charge chip ----------------
// `Charge` itself isn't exported from ui.jsx — we reuse Crest with a flat
// background to render the symbol alone.
function ChargeChip({kind, fg='#1a1410', bg='#fbf6ea', size=44, active=false, onClick}){
  return (
    <button onClick={onClick} style={{
      width:size, height:size, borderRadius:8,
      background: active ? fg : bg,
      border:`1.5px solid ${active ? fg : '#d9cdb4'}`,
      display:'grid', placeItems:'center', cursor:'pointer', padding:0
    }} title={IDENT_CHARGE_LABEL[kind]}>
      <Crest shape="roundel" a={active?fg:bg} b={active?fg:bg} charge={kind} size={size-12}/>
    </button>
  );
}

// ---------------- Swatch button ----------------
function Swatch({hex, name, active, onClick, size=32, label=true, theme, scheme}){
  const t = THEMES[theme][scheme];
  return (
    <button onClick={onClick} style={{
      display:'flex', flexDirection:'column', alignItems:'center', gap:4,
      background:'transparent', border:'none', cursor:'pointer', padding:0,
    }} title={name}>
      <span style={{
        width:size, height:size, borderRadius:8,
        background: hex,
        border: active ? `2.5px solid ${t.ink}` : `1px solid ${t.rule}`,
        boxShadow: active ? `0 0 0 2px ${t.bg}` : 'none',
        display:'block',
      }}/>
      {label && <span style={{fontSize:9.5, color:t.inkMute, fontWeight:600, letterSpacing:.2}}>{name}</span>}
    </button>
  );
}

// ---------------- Segment (Tabs) ----------------
function IdentSegment({options, value, onChange, theme, scheme}){
  const t = THEMES[theme][scheme];
  return (
    <div style={{
      display:'flex', background:t.bgInk, padding:3, borderRadius:10,
      border:`1px solid ${t.rule}`
    }}>
      {options.map(o=>{
        const on = o.id===value;
        return (
          <button key={o.id} onClick={()=>onChange(o.id)} style={{
            flex:1, height:32, borderRadius:8, border:'none',
            background: on ? t.card : 'transparent',
            color: on ? t.ink : t.inkMute,
            fontWeight:700, fontSize:12, fontFamily:'inherit',
            boxShadow: on ? `0 1px 0 ${t.rule}` : 'none',
            cursor:'pointer',
          }}>{o.label}</button>
        );
      })}
    </div>
  );
}

// ---------------- The mobile screen ----------------
function ScreenIdentity({theme, scheme}){
  const t = THEMES[theme][scheme];
  const [tab, setTab]       = React.useState('crest'); // crest | jersey
  const [shape, setShape]   = React.useState('heater');
  const [tincA, setTincA]   = React.useState('#0e3a5f');
  const [tincB, setTincB]   = React.useState('#c8a45a');
  const [charge, setCharge] = React.useState('ship');
  const [motto, setMotto]   = React.useState('Per mare ad astra');
  const [pattern, setPattern] = React.useState('stripes');
  const [sleeveAccent, setSleeveAccent] = React.useState(true);
  const [showBack, setShowBack] = React.useState(false);

  const crest = { shape, a:tincA, b:tincB, charge, motto: motto || undefined };

  const SectionLabel = ({children, hint}) => (
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginTop:14, marginBottom:8}}>
      <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>{children}</div>
      {hint && <div style={{fontSize:10, color:t.inkSoft}}>{hint}</div>}
    </div>
  );

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      {/* Top bar */}
      <header style={{padding:'4px 16px 8px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center', cursor:'pointer'}}>
            <I.ChevronLeft color={t.ink} size={18}/>
          </button>
          <div style={{textAlign:'center'}}>
            <SerifH theme={theme} style={{fontSize:17, fontWeight:700, color:t.ink, display:'block', lineHeight:1}}>Klub-Identität</SerifH>
            <div style={{fontSize:10, color:t.inkSoft, marginTop:2, letterSpacing:.4}}>Wappen · Trikot · Vorschau</div>
          </div>
          <button style={{width:36,height:36,borderRadius:10,background:t.accent,border:'none',display:'grid',placeItems:'center', cursor:'pointer'}}>
            <I.Check color="#fff" size={18}/>
          </button>
        </div>
      </header>

      {/* Big preview */}
      <div style={{
        position:'relative', margin:'0 16px',
        background:t.card, border:`1px solid ${t.rule}`, borderRadius:14,
        padding:'14px 12px 10px',
      }}>
        {/* sepia paper backdrop */}
        <div style={{
          position:'absolute', inset:8, borderRadius:10,
          background:`repeating-linear-gradient(0deg, ${t.bgInk} 0 1px, transparent 1px 6px)`,
          opacity:.45, pointerEvents:'none',
        }}/>
        <div style={{position:'relative', display:'flex', alignItems:'center', justifyContent:'center', gap:14, minHeight:188}}>
          {tab==='crest' ? (
            <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
              <Crest {...crest} size={140}/>
              <div style={{marginTop:6, fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>
                {IDENT_SHAPE_LABEL[shape]} · {IDENT_CHARGE_LABEL[charge]}
              </div>
            </div>
          ) : (
            <div style={{display:'flex', alignItems:'center', gap:18}}>
              <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                <Jersey pattern={pattern} a={tincA} b={tincB} sleeveAccent={sleeveAccent}
                        crest={crest} number="9" name="BRODY"
                        showBack={showBack} size={160}/>
                <div style={{marginTop:4, fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>
                  {showBack ? 'Rückseite' : 'Vorderseite'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* mini lineup preview */}
        <div style={{position:'relative', marginTop:6, paddingTop:8, borderTop:`1px dashed ${t.rule}`,
                     display:'flex', alignItems:'center', justifyContent:'center', gap:6}}>
          {[0,1,2,3,4].map(i=>(
            <Jersey key={i} pattern={pattern} a={tincA} b={tincB}
                    sleeveAccent={sleeveAccent} crest={null} size={28}/>
          ))}
          <span style={{fontSize:9.5, color:t.inkMute, marginLeft:6, letterSpacing:.4, fontWeight:700, textTransform:'uppercase'}}>2D-Ticker · Aufstellung</span>
        </div>
      </div>

      {/* Tab segment */}
      <div style={{padding:'12px 16px 0'}}>
        <IdentSegment
          theme={theme} scheme={scheme} value={tab} onChange={setTab}
          options={[{id:'crest', label:'Wappen'}, {id:'jersey', label:'Trikot'}]}/>
      </div>

      {/* Scrollable controls */}
      <div style={{flex:1, overflowY:'auto', padding:'0 16px 20px'}}>
        {tab==='crest' && (
          <>
            <SectionLabel hint="4 Formen">Schildform</SectionLabel>
            <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:8}}>
              {IDENT_SHAPES.map(s=>{
                const on = s===shape;
                return (
                  <button key={s} onClick={()=>setShape(s)} style={{
                    display:'flex', flexDirection:'column', alignItems:'center', gap:4,
                    padding:'10px 4px', borderRadius:10, cursor:'pointer',
                    background: on ? t.bgInk : t.card,
                    border: `1.5px solid ${on ? t.ink : t.rule}`,
                    fontFamily:'inherit',
                  }}>
                    <ShapeThumb shape={s} color={t.ink} size={26}/>
                    <span style={{fontSize:10, color:t.ink, fontWeight:600, letterSpacing:.2}}>{IDENT_SHAPE_LABEL[s]}</span>
                  </button>
                );
              })}
            </div>

            <SectionLabel hint="Hauptfarbe">Tinktur A</SectionLabel>
            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:8, justifyItems:'center'}}>
              {IDENT_TINCT.map(c=>(
                <Swatch key={c.id} hex={c.hex} name={c.name}
                        active={tincA===c.hex} onClick={()=>setTincA(c.hex)}
                        size={30} label={false} theme={theme} scheme={scheme}/>
              ))}
            </div>

            <SectionLabel hint="Zweitfarbe">Tinktur B</SectionLabel>
            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:8, justifyItems:'center'}}>
              {IDENT_TINCT.map(c=>(
                <Swatch key={c.id} hex={c.hex} name={c.name}
                        active={tincB===c.hex} onClick={()=>setTincB(c.hex)}
                        size={30} label={false} theme={theme} scheme={scheme}/>
              ))}
            </div>

            <SectionLabel hint="10 Symbole">Wappensymbol</SectionLabel>
            <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:8, justifyItems:'center'}}>
              {IDENT_CHARGES.map(k=>(
                <ChargeChip key={k} kind={k}
                            active={charge===k}
                            fg={t.ink} bg={t.card}
                            onClick={()=>setCharge(k)}/>
              ))}
            </div>

            <SectionLabel hint="optional, max. 32 Zeichen">Motto</SectionLabel>
            <input value={motto} onChange={e=>setMotto(e.target.value.slice(0,32))}
                   placeholder="Per mare ad astra"
                   style={{
                     width:'100%', height:40, borderRadius:10,
                     background:t.card, border:`1px solid ${t.rule}`,
                     padding:'0 12px', fontSize:13, color:t.ink,
                     fontFamily:THEMES[theme].font, fontStyle:'italic',
                     outline:'none',
                   }}/>
          </>
        )}

        {tab==='jersey' && (
          <>
            <SectionLabel hint="6 Muster">Trikotmuster</SectionLabel>
            <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8}}>
              {IDENT_PATTERNS.map(p=>{
                const on = p.id===pattern;
                return (
                  <button key={p.id} onClick={()=>setPattern(p.id)} style={{
                    display:'flex', flexDirection:'column', alignItems:'center', gap:4,
                    padding:'8px 4px 6px', borderRadius:10, cursor:'pointer',
                    background: on ? t.bgInk : t.card,
                    border: `1.5px solid ${on ? t.ink : t.rule}`,
                    fontFamily:'inherit',
                  }}>
                    <Jersey pattern={p.id} a={tincA} b={tincB} sleeveAccent={sleeveAccent} crest={null} size={42}/>
                    <span style={{fontSize:10, color:t.ink, fontWeight:600}}>{p.name}</span>
                  </button>
                );
              })}
            </div>

            <SectionLabel hint="übernimmt Wappen-Tinktur A">Hauptfarbe</SectionLabel>
            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:8, justifyItems:'center'}}>
              {IDENT_TINCT.map(c=>(
                <Swatch key={c.id} hex={c.hex} name={c.name}
                        active={tincA===c.hex} onClick={()=>setTincA(c.hex)}
                        size={30} label={false} theme={theme} scheme={scheme}/>
              ))}
            </div>

            <SectionLabel hint="Streifen, Kragen, Stutzen">Zweitfarbe</SectionLabel>
            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:8, justifyItems:'center'}}>
              {IDENT_TINCT.map(c=>(
                <Swatch key={c.id} hex={c.hex} name={c.name}
                        active={tincB===c.hex} onClick={()=>setTincB(c.hex)}
                        size={30} label={false} theme={theme} scheme={scheme}/>
              ))}
            </div>

            <SectionLabel>Details</SectionLabel>
            <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'4px 12px'}}>
              <ToggleRow theme={theme} scheme={scheme}
                k="Ärmel-Akzent" sub="Kragen + Stutzen in Tinktur B"
                on={sleeveAccent} onChange={()=>setSleeveAccent(v=>!v)}/>
              <ToggleRow theme={theme} scheme={scheme}
                k="Rückseite zeigen" sub="Spielername + Nummer im Profi-Stil"
                on={showBack} onChange={()=>setShowBack(v=>!v)} last/>
            </div>
          </>
        )}
      </div>

      {/* Footer CTA */}
      <div style={{padding:'8px 16px 14px', borderTop:`1px solid ${t.rule}`, background:t.bg}}>
        <button style={{
          width:'100%', height:48, borderRadius:12,
          background:t.accent, color:'#fff',
          border:'none', fontWeight:700, fontSize:14, fontFamily:'inherit',
          letterSpacing:.2, cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', gap:8,
        }}>
          <I.Check size={16} color="#fff"/>
          Auf Klub anwenden
        </button>
        <div style={{textAlign:'center', fontSize:10, color:t.inkSoft, marginTop:6, letterSpacing:.3}}>
          Wirkt sofort auf 2D-Ticker, Aufstellung & Liga-Tabelle.
        </div>
      </div>
    </div>
  );
}

// Small toggle row, local to this screen
function ToggleRow({k, sub, on, onChange, last, theme, scheme}){
  const t = THEMES[theme][scheme];
  return (
    <button onClick={onChange} style={{
      width:'100%', display:'flex', alignItems:'center', gap:10,
      padding:'10px 0', background:'transparent',
      border:'none', borderBottom: last?'none':`1px solid ${t.rule}`,
      cursor:'pointer', fontFamily:'inherit', textAlign:'left',
    }}>
      <div style={{flex:1}}>
        <div style={{fontSize:12.5, fontWeight:700, color:t.ink}}>{k}</div>
        {sub && <div style={{fontSize:10.5, color:t.inkSoft, marginTop:2}}>{sub}</div>}
      </div>
      <div style={{width:38, height:22, borderRadius:99, background: on ? t.accent : t.bgInk, position:'relative', transition:'background .15s'}}>
        <span style={{position:'absolute', top:2, left: on ? 18 : 2, width:18, height:18, borderRadius:99, background:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,.2)', transition:'left .15s'}}/>
      </div>
    </button>
  );
}

// ================================================================
// IdentityStudio — wide artboard, two-column live editor
// ================================================================
function IdentityStudio(){
  const theme  = 'A';
  const scheme = 'light';
  const t = THEMES[theme][scheme];

  const [shape, setShape]   = React.useState('gonfalon');
  const [tincA, setTincA]   = React.useState('#7a1a1a');
  const [tincB, setTincB]   = React.useState('#f0e8d8');
  const [charge, setCharge] = React.useState('lion');
  const [motto, setMotto]   = React.useState('Cor leonis');
  const [pattern, setPattern] = React.useState('hoops');
  const [sleeveAccent, setSleeveAccent] = React.useState(true);

  const crest = { shape, a:tincA, b:tincB, charge, motto: motto || undefined };

  const Panel = ({title, hint, children}) => (
    <div style={{marginBottom:14}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6}}>
        <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.8, textTransform:'uppercase'}}>{title}</div>
        {hint && <div style={{fontSize:10, color:t.inkSoft}}>{hint}</div>}
      </div>
      {children}
    </div>
  );

  const presetClubs = [
    { id:'hafenstadt', label:'Hafenstadt' },
    { id:'kaltenbach', label:'Kaltenbach' },
    { id:'sauveterre', label:'Sauveterre' },
    { id:'valguarda',  label:'Valguarda'  },
    { id:'northbridge',label:'Northbridge'},
    { id:'auerbach',   label:'Auerbach'   },
  ];
  const applyPreset = (id) => {
    const c = CLUB_REGISTRY[id];
    if(!c) return;
    setShape(c.crest.shape);
    setTincA(c.crest.a);
    setTincB(c.crest.b);
    setCharge(c.crest.charge);
    setMotto('');
  };

  return (
    <div style={{padding:24, background:'#fbf6ea', height:'100%', display:'flex', flexDirection:'column', fontFamily:THEMES[theme].ui, color:t.ink}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', borderBottom:`1px solid ${t.rule}`, paddingBottom:14, marginBottom:18}}>
        <div>
          <div style={{fontSize:11, color:t.accent, fontWeight:800, letterSpacing:1.6, textTransform:'uppercase'}}>Studio · interaktiv</div>
          <SerifH theme={theme} style={{display:'block', fontSize:28, fontWeight:700, color:t.ink, marginTop:2}}>Klub-Identität entwerfen</SerifH>
          <div style={{fontSize:12.5, color:t.inkMute, marginTop:4, maxWidth:540}}>
            Wappen-Grammatik und Trikot-Muster teilen sich zwei Tinkturen.
            Jeder Klick aktualisiert beide Vorschauen sowie die Lineup-Reihe unten.
          </div>
        </div>
        <div style={{display:'flex', gap:6, flexWrap:'wrap', justifyContent:'flex-end', maxWidth:380}}>
          {presetClubs.map(p=>(
            <button key={p.id} onClick={()=>applyPreset(p.id)} style={{
              height:28, padding:'0 10px', borderRadius:99,
              background:t.card, border:`1px solid ${t.rule}`,
              color:t.ink, fontSize:11, fontWeight:600, cursor:'pointer',
              fontFamily:'inherit',
            }}>{p.label}</button>
          ))}
        </div>
      </header>

      <div style={{display:'grid', gridTemplateColumns:'minmax(0,1fr) 360px', gap:24, flex:1, minHeight:0}}>
        {/* Left: previews */}
        <div style={{display:'flex', flexDirection:'column', gap:18, minWidth:0}}>
          {/* Crest + Jersey side-by-side */}
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14}}>
            <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:16, display:'flex', flexDirection:'column', alignItems:'center', gap:8}}>
              <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.8, textTransform:'uppercase', alignSelf:'flex-start'}}>Wappen</div>
              <Crest {...crest} size={150}/>
              <div style={{fontSize:11, color:t.inkSoft, marginTop:'auto'}}>{IDENT_SHAPE_LABEL[shape]} · {IDENT_CHARGE_LABEL[charge]}</div>
            </div>
            <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:16, display:'flex', flexDirection:'column', alignItems:'center', gap:8}}>
              <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.8, textTransform:'uppercase', alignSelf:'flex-start'}}>Heim-Trikot · vorne</div>
              <Jersey pattern={pattern} a={tincA} b={tincB} sleeveAccent={sleeveAccent} crest={crest} size={170}/>
              <div style={{fontSize:11, color:t.inkSoft, marginTop:'auto'}}>{IDENT_PATTERNS.find(p=>p.id===pattern)?.name}</div>
            </div>
            <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:16, display:'flex', flexDirection:'column', alignItems:'center', gap:8}}>
              <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.8, textTransform:'uppercase', alignSelf:'flex-start'}}>Heim-Trikot · hinten</div>
              <Jersey pattern={pattern} a={tincA} b={tincB} sleeveAccent={sleeveAccent} showBack number="9" name="Brody" size={170}/>
              <div style={{fontSize:11, color:t.inkSoft, marginTop:'auto'}}>#9 · Brody</div>
            </div>
          </div>

          {/* Lineup row */}
          <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'14px 18px'}}>
            <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.8, textTransform:'uppercase', marginBottom:10}}>
              Anwendungen · so erscheint die Identität im Spiel
            </div>
            <div style={{display:'flex', alignItems:'center', gap:18}}>
              {/* Lineup mini */}
              <div style={{flex:1, display:'flex', alignItems:'flex-end', gap:6}}>
                {Array.from({length:11}).map((_,i)=>(
                  <div key={i} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:3}}>
                    <Jersey pattern={pattern} a={tincA} b={tincB}
                            sleeveAccent={sleeveAccent} crest={null} size={34}/>
                    <span style={{fontSize:9, color:t.inkMute, fontFamily:'JetBrains Mono, monospace', fontWeight:700}}>{i+1}</span>
                  </div>
                ))}
              </div>
              <div style={{width:1, height:54, background:t.rule}}/>
              {/* League-table row */}
              <div style={{display:'flex', alignItems:'center', gap:10, minWidth:0}}>
                <Crest {...crest} size={42}/>
                <div style={{minWidth:0}}>
                  <SerifH theme={theme} style={{fontSize:14, fontWeight:700, color:t.ink, display:'block', lineHeight:1.1}}>
                    {motto ? 'Klubname' : 'Dein Klub'}
                  </SerifH>
                  <div style={{fontSize:11, color:t.inkMute, fontStyle:'italic'}}>{motto || '—'}</div>
                </div>
              </div>
              <div style={{width:1, height:54, background:t.rule}}/>
              {/* Tabloid headline */}
              <div style={{maxWidth:240}}>
                <div style={{fontSize:9.5, color:t.accent, fontWeight:800, letterSpacing:1.2, textTransform:'uppercase'}}>Tabloid-Cover</div>
                <SerifH theme={theme} style={{display:'block', fontSize:18, lineHeight:1.05, fontWeight:700, color:t.ink, marginTop:2}}>
                  Brody schießt sich in die Herzen
                </SerifH>
              </div>
            </div>
          </div>
        </div>

        {/* Right: controls */}
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:18, overflowY:'auto'}}>
          <Panel title="Schildform" hint="4 Formen">
            <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:6}}>
              {IDENT_SHAPES.map(s=>{
                const on = s===shape;
                return (
                  <button key={s} onClick={()=>setShape(s)} style={{
                    display:'flex', flexDirection:'column', alignItems:'center', gap:3,
                    padding:'8px 2px', borderRadius:8, cursor:'pointer',
                    background: on ? t.bgInk : t.bg,
                    border: `1.5px solid ${on ? t.ink : t.rule}`,
                    fontFamily:'inherit',
                  }}>
                    <ShapeThumb shape={s} color={t.ink} size={24}/>
                    <span style={{fontSize:10, color:t.ink, fontWeight:600}}>{IDENT_SHAPE_LABEL[s]}</span>
                  </button>
                );
              })}
            </div>
          </Panel>

          <Panel title="Tinktur A · Hauptfarbe">
            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:6, justifyItems:'center'}}>
              {IDENT_TINCT.map(c=>(
                <Swatch key={c.id} hex={c.hex} name={c.name}
                        active={tincA===c.hex} onClick={()=>setTincA(c.hex)}
                        size={28} label={false} theme={theme} scheme={scheme}/>
              ))}
            </div>
          </Panel>

          <Panel title="Tinktur B · Zweitfarbe">
            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:6, justifyItems:'center'}}>
              {IDENT_TINCT.map(c=>(
                <Swatch key={c.id} hex={c.hex} name={c.name}
                        active={tincB===c.hex} onClick={()=>setTincB(c.hex)}
                        size={28} label={false} theme={theme} scheme={scheme}/>
              ))}
            </div>
          </Panel>

          <Panel title="Wappensymbol" hint="10 Symbole">
            <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:6, justifyItems:'center'}}>
              {IDENT_CHARGES.map(k=>(
                <ChargeChip key={k} kind={k}
                            active={charge===k}
                            fg={t.ink} bg={t.bg}
                            onClick={()=>setCharge(k)} size={40}/>
              ))}
            </div>
          </Panel>

          <Panel title="Motto" hint="optional">
            <input value={motto} onChange={e=>setMotto(e.target.value.slice(0,32))}
                   placeholder="Per mare ad astra"
                   style={{
                     width:'100%', height:36, borderRadius:8,
                     background:t.bg, border:`1px solid ${t.rule}`,
                     padding:'0 10px', fontSize:13, color:t.ink,
                     fontFamily:THEMES[theme].font, fontStyle:'italic',
                     outline:'none',
                   }}/>
          </Panel>

          <div style={{height:1, background:t.rule, margin:'14px 0'}}/>

          <Panel title="Trikotmuster" hint="6 Muster">
            <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:6}}>
              {IDENT_PATTERNS.map(p=>{
                const on = p.id===pattern;
                return (
                  <button key={p.id} onClick={()=>setPattern(p.id)} style={{
                    display:'flex', flexDirection:'column', alignItems:'center', gap:2,
                    padding:'6px 2px 4px', borderRadius:8, cursor:'pointer',
                    background: on ? t.bgInk : t.bg,
                    border: `1.5px solid ${on ? t.ink : t.rule}`,
                    fontFamily:'inherit',
                  }}>
                    <Jersey pattern={p.id} a={tincA} b={tincB} sleeveAccent={sleeveAccent} crest={null} size={36}/>
                    <span style={{fontSize:9.5, color:t.ink, fontWeight:600}}>{p.name}</span>
                  </button>
                );
              })}
            </div>
          </Panel>

          <Panel title="Details">
            <ToggleRow theme={theme} scheme={scheme}
              k="Ärmel-Akzent" sub="Kragen + Stutzen in Tinktur B"
              on={sleeveAccent} onChange={()=>setSleeveAccent(v=>!v)} last/>
          </Panel>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  ScreenIdentity, IdentityStudio, Jersey,
  IDENT_TINCT, IDENT_SHAPES, IDENT_CHARGES, IDENT_PATTERNS,
});
