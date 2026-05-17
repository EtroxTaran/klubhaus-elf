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
  const [crestA, setCrestA] = React.useState('#0e3a5f');
  const [crestB, setCrestB] = React.useState('#c8a45a');
  const [charge, setCharge] = React.useState('ship');
  const [motto, setMotto]   = React.useState('Per mare ad astra');
  const [showBack, setShowBack] = React.useState(false);

  // Three kit variants — defaults: home matches crest, away inverts, third = graphite
  const [variant, setVariant] = React.useState('home');
  const [kits, setKits] = React.useState({
    home:  { pattern:'stripes', a:'#0e3a5f', b:'#c8a45a', sleeveAccent:true },
    away:  { pattern:'solid',   a:'#c8a45a', b:'#0e3a5f', sleeveAccent:true },
    third: { pattern:'sash',    a:'#262626', b:'#c8a45a', sleeveAccent:true },
  });
  const kit = kits[variant];
  const updateKit = (changes) => setKits(k => ({...k, [variant]: {...k[variant], ...changes}}));

  const crest = { shape, a:crestA, b:crestB, charge, motto: motto || undefined };

  const VARIANT_LABEL = { home:'Heim', away:'Auswärts', third:'Drittes' };

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
                <Jersey pattern={kit.pattern} a={kit.a} b={kit.b} sleeveAccent={kit.sleeveAccent}
                        crest={crest} number="9" name="BRODY"
                        showBack={showBack} size={160}/>
                <div style={{marginTop:4, fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>
                  {VARIANT_LABEL[variant]} · {showBack ? 'Rückseite' : 'Vorderseite'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* mini lineup preview */}
        <div style={{position:'relative', marginTop:6, paddingTop:8, borderTop:`1px dashed ${t.rule}`,
                     display:'flex', alignItems:'center', justifyContent:'center', gap:6}}>
          {[0,1,2,3,4].map(i=>(
            <Jersey key={i} pattern={kit.pattern} a={kit.a} b={kit.b}
                    sleeveAccent={kit.sleeveAccent} crest={null} size={28}/>
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
                        active={crestA===c.hex} onClick={()=>setCrestA(c.hex)}
                        size={30} label={false} theme={theme} scheme={scheme}/>
              ))}
            </div>

            <SectionLabel hint="Zweitfarbe">Tinktur B</SectionLabel>
            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:8, justifyItems:'center'}}>
              {IDENT_TINCT.map(c=>(
                <Swatch key={c.id} hex={c.hex} name={c.name}
                        active={crestB===c.hex} onClick={()=>setCrestB(c.hex)}
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
            {/* Variant segment — three kits */}
            <div style={{marginTop:14}}>
              <IdentSegment
                theme={theme} scheme={scheme} value={variant} onChange={setVariant}
                options={[
                  {id:'home',  label:'Heim'},
                  {id:'away',  label:'Auswärts'},
                  {id:'third', label:'Drittes'},
                ]}/>
            </div>

            <SectionLabel hint="6 Muster">Trikotmuster · {VARIANT_LABEL[variant]}</SectionLabel>
            <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8}}>
              {IDENT_PATTERNS.map(p=>{
                const on = p.id===kit.pattern;
                return (
                  <button key={p.id} onClick={()=>updateKit({pattern:p.id})} style={{
                    display:'flex', flexDirection:'column', alignItems:'center', gap:4,
                    padding:'8px 4px 6px', borderRadius:10, cursor:'pointer',
                    background: on ? t.bgInk : t.card,
                    border: `1.5px solid ${on ? t.ink : t.rule}`,
                    fontFamily:'inherit',
                  }}>
                    <Jersey pattern={p.id} a={kit.a} b={kit.b} sleeveAccent={kit.sleeveAccent} crest={null} size={42}/>
                    <span style={{fontSize:10, color:t.ink, fontWeight:600}}>{p.name}</span>
                  </button>
                );
              })}
            </div>

            <SectionLabel hint="Trikot-Hauptfarbe">Hauptfarbe</SectionLabel>
            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:8, justifyItems:'center'}}>
              {IDENT_TINCT.map(c=>(
                <Swatch key={c.id} hex={c.hex} name={c.name}
                        active={kit.a===c.hex} onClick={()=>updateKit({a:c.hex})}
                        size={30} label={false} theme={theme} scheme={scheme}/>
              ))}
            </div>

            <SectionLabel hint="Streifen, Kragen, Stutzen">Zweitfarbe</SectionLabel>
            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:8, justifyItems:'center'}}>
              {IDENT_TINCT.map(c=>(
                <Swatch key={c.id} hex={c.hex} name={c.name}
                        active={kit.b===c.hex} onClick={()=>updateKit({b:c.hex})}
                        size={30} label={false} theme={theme} scheme={scheme}/>
              ))}
            </div>

            <SectionLabel>Details</SectionLabel>
            <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'4px 12px'}}>
              <ToggleRow theme={theme} scheme={scheme}
                k="Ärmel-Akzent" sub="Kragen + Stutzen in Tinktur B"
                on={kit.sleeveAccent} onChange={()=>updateKit({sleeveAccent: !kit.sleeveAccent})}/>
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
// Three kit variants (Heim / Auswärts / Drittes), shared crest.
// ================================================================
function IdentityStudio(){
  const theme  = 'A';
  const scheme = 'light';
  const t = THEMES[theme][scheme];

  // Crest is shared across all variants
  const [shape, setShape]   = React.useState('gonfalon');
  const [crestA, setCrestA] = React.useState('#7a1a1a');
  const [crestB, setCrestB] = React.useState('#f0e8d8');
  const [charge, setCharge] = React.useState('lion');
  const [motto, setMotto]   = React.useState('Cor leonis');

  // Three independent kits — defaults are an "invert" away + a "graphite" third
  const [variant, setVariant] = React.useState('home');
  const [kits, setKits] = React.useState({
    home:  { pattern:'hoops',   a:'#7a1a1a', b:'#f0e8d8', sleeveAccent:true },
    away:  { pattern:'solid',   a:'#f0e8d8', b:'#7a1a1a', sleeveAccent:true },
    third: { pattern:'sash',    a:'#262626', b:'#f0e8d8', sleeveAccent:true },
  });
  const kit = kits[variant];
  const updateKit = (changes) => setKits(k => ({...k, [variant]: {...k[variant], ...changes}}));

  const crest = { shape, a:crestA, b:crestB, charge, motto: motto || undefined };

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
    setCrestA(c.crest.a);
    setCrestB(c.crest.b);
    setCharge(c.crest.charge);
    setMotto('');
    // Derive three kits from the club registry
    setKits({
      home:  { pattern: c.kit?.pattern || 'solid',  a: c.crest.a, b: c.crest.b,  sleeveAccent: true },
      away:  { pattern: 'solid',                     a: c.crest.b, b: c.crest.a,  sleeveAccent: true },
      third: { pattern: c.kit?.pattern === 'hoops' ? 'sash' : 'hoops',
                                                     a:'#262626',  b: c.crest.b,  sleeveAccent: true },
    });
    setVariant('home');
  };

  const VARIANTS = [
    { id:'home',  label:'Heim',      sub:'Tinkturen wie Wappen' },
    { id:'away',  label:'Auswärts',  sub:'invertiert · sichtbar bei Auswärtsspiel' },
    { id:'third', label:'Drittes',   sub:'Pokal · Sondertrikot' },
  ];

  return (
    <div style={{padding:24, background:'#fbf6ea', height:'100%', display:'flex', flexDirection:'column', fontFamily:THEMES[theme].ui, color:t.ink}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', borderBottom:`1px solid ${t.rule}`, paddingBottom:14, marginBottom:18}}>
        <div>
          <div style={{fontSize:11, color:t.accent, fontWeight:800, letterSpacing:1.6, textTransform:'uppercase'}}>Studio · interaktiv</div>
          <SerifH theme={theme} style={{display:'block', fontSize:28, fontWeight:700, color:t.ink, marginTop:2}}>Klub-Identität entwerfen</SerifH>
          <div style={{fontSize:12.5, color:t.inkMute, marginTop:4, maxWidth:540}}>
            Ein Wappen, drei Trikot-Sets. Wechsle zwischen Heim, Auswärts und Drittem — die Bausteine bleiben gleich, nur Muster und Tinkturen variieren.
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
        <div style={{display:'flex', flexDirection:'column', gap:14, minWidth:0}}>
          {/* All-three kits row (small, always visible) + crest */}
          <div style={{display:'grid', gridTemplateColumns:'minmax(0, 240px) minmax(0, 1fr)', gap:14}}>
            {/* Crest card */}
            <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:14, display:'flex', flexDirection:'column', alignItems:'center', gap:8}}>
              <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.8, textTransform:'uppercase', alignSelf:'flex-start'}}>Wappen</div>
              <Crest {...crest} size={130}/>
              <div style={{fontSize:11, color:t.inkSoft, marginTop:'auto', textAlign:'center'}}>{IDENT_SHAPE_LABEL[shape]} · {IDENT_CHARGE_LABEL[charge]}</div>
            </div>

            {/* Three-kit comparison + variant tabs */}
            <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:14, display:'flex', flexDirection:'column'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
                <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.8, textTransform:'uppercase'}}>Trikot-Sets · klicken zum Bearbeiten</div>
                <div style={{fontSize:10, color:t.inkSoft}}>{VARIANTS.find(v=>v.id===variant)?.sub}</div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8, flex:1}}>
                {VARIANTS.map(v=>{
                  const k = kits[v.id];
                  const on = v.id === variant;
                  return (
                    <button key={v.id} onClick={()=>setVariant(v.id)} style={{
                      display:'flex', flexDirection:'column', alignItems:'center', gap:6,
                      padding:'10px 6px', borderRadius:12, cursor:'pointer',
                      background: on ? t.bgInk : t.bg,
                      border:`2px solid ${on ? t.ink : t.rule}`,
                      fontFamily:'inherit',
                    }}>
                      <Jersey pattern={k.pattern} a={k.a} b={k.b}
                              sleeveAccent={k.sleeveAccent} crest={on ? crest : null}
                              size={92}/>
                      <span style={{fontSize:11.5, color:t.ink, fontWeight:700}}>{v.label}</span>
                      <span style={{fontSize:9.5, color:t.inkSoft, textTransform:'uppercase', letterSpacing:.5, fontWeight:600}}>
                        {IDENT_PATTERNS.find(p=>p.id===k.pattern)?.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Front + Back of the active variant */}
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
            <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:14, display:'flex', flexDirection:'column', alignItems:'center', gap:6}}>
              <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.8, textTransform:'uppercase', alignSelf:'flex-start'}}>
                {VARIANTS.find(v=>v.id===variant)?.label}-Trikot · vorne
              </div>
              <Jersey pattern={kit.pattern} a={kit.a} b={kit.b}
                      sleeveAccent={kit.sleeveAccent} crest={crest} size={150}/>
            </div>
            <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:14, display:'flex', flexDirection:'column', alignItems:'center', gap:6}}>
              <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.8, textTransform:'uppercase', alignSelf:'flex-start'}}>
                {VARIANTS.find(v=>v.id===variant)?.label}-Trikot · hinten
              </div>
              <Jersey pattern={kit.pattern} a={kit.a} b={kit.b}
                      sleeveAccent={kit.sleeveAccent} showBack number="9" name="Brody" size={150}/>
            </div>
          </div>

          {/* Lineup row + tabloid */}
          <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'14px 18px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10}}>
              <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.8, textTransform:'uppercase'}}>
                Anwendungen · so erscheint die Identität im Spiel
              </div>
              <div style={{fontSize:10, color:t.accent, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>
                Vorschau: {VARIANTS.find(v=>v.id===variant)?.label}
              </div>
            </div>
            <div style={{display:'flex', alignItems:'center', gap:18}}>
              <div style={{flex:1, display:'flex', alignItems:'flex-end', gap:6}}>
                {Array.from({length:11}).map((_,i)=>(
                  <div key={i} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:3}}>
                    <Jersey pattern={kit.pattern} a={kit.a} b={kit.b}
                            sleeveAccent={kit.sleeveAccent} crest={null} size={32}/>
                    <span style={{fontSize:9, color:t.inkMute, fontFamily:'JetBrains Mono, monospace', fontWeight:700}}>{i+1}</span>
                  </div>
                ))}
              </div>
              <div style={{width:1, height:54, background:t.rule}}/>
              <div style={{display:'flex', alignItems:'center', gap:10, minWidth:0}}>
                <Crest {...crest} size={42}/>
                <div style={{minWidth:0}}>
                  <SerifH theme={theme} style={{fontSize:14, fontWeight:700, color:t.ink, display:'block', lineHeight:1.1}}>
                    {motto ? 'Klubname' : 'Dein Klub'}
                  </SerifH>
                  <div style={{fontSize:11, color:t.inkMute, fontStyle:'italic'}}>{motto || '—'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: controls */}
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:18, overflowY:'auto'}}>
          {/* ============ WAPPEN block ============ */}
          <div style={{fontSize:11, color:t.accent, fontWeight:800, letterSpacing:1.4, textTransform:'uppercase', marginBottom:10}}>Wappen</div>

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

          <Panel title="Tinktur A · Hauptfarbe Wappen">
            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:6, justifyItems:'center'}}>
              {IDENT_TINCT.map(c=>(
                <Swatch key={c.id} hex={c.hex} name={c.name}
                        active={crestA===c.hex} onClick={()=>setCrestA(c.hex)}
                        size={28} label={false} theme={theme} scheme={scheme}/>
              ))}
            </div>
          </Panel>

          <Panel title="Tinktur B · Zweitfarbe Wappen">
            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:6, justifyItems:'center'}}>
              {IDENT_TINCT.map(c=>(
                <Swatch key={c.id} hex={c.hex} name={c.name}
                        active={crestB===c.hex} onClick={()=>setCrestB(c.hex)}
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

          {/* ============ TRIKOT block ============ */}
          <div style={{height:1, background:t.rule, margin:'14px 0'}}/>
          <div style={{fontSize:11, color:t.accent, fontWeight:800, letterSpacing:1.4, textTransform:'uppercase', marginBottom:10, display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
            <span>Trikot · {VARIANTS.find(v=>v.id===variant)?.label}</span>
            <span style={{fontSize:9.5, color:t.inkSoft, letterSpacing:.4, fontWeight:600}}>oben Set wechseln</span>
          </div>

          <Panel title="Trikotmuster" hint="6 Muster">
            <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:6}}>
              {IDENT_PATTERNS.map(p=>{
                const on = p.id===kit.pattern;
                return (
                  <button key={p.id} onClick={()=>updateKit({pattern:p.id})} style={{
                    display:'flex', flexDirection:'column', alignItems:'center', gap:2,
                    padding:'6px 2px 4px', borderRadius:8, cursor:'pointer',
                    background: on ? t.bgInk : t.bg,
                    border: `1.5px solid ${on ? t.ink : t.rule}`,
                    fontFamily:'inherit',
                  }}>
                    <Jersey pattern={p.id} a={kit.a} b={kit.b} sleeveAccent={kit.sleeveAccent} crest={null} size={36}/>
                    <span style={{fontSize:9.5, color:t.ink, fontWeight:600}}>{p.name}</span>
                  </button>
                );
              })}
            </div>
          </Panel>

          <Panel title="Trikot-Hauptfarbe">
            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:6, justifyItems:'center'}}>
              {IDENT_TINCT.map(c=>(
                <Swatch key={c.id} hex={c.hex} name={c.name}
                        active={kit.a===c.hex} onClick={()=>updateKit({a:c.hex})}
                        size={28} label={false} theme={theme} scheme={scheme}/>
              ))}
            </div>
          </Panel>

          <Panel title="Trikot-Zweitfarbe" hint="Kragen, Stutzen, Streifen">
            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:6, justifyItems:'center'}}>
              {IDENT_TINCT.map(c=>(
                <Swatch key={c.id} hex={c.hex} name={c.name}
                        active={kit.b===c.hex} onClick={()=>updateKit({b:c.hex})}
                        size={28} label={false} theme={theme} scheme={scheme}/>
              ))}
            </div>
          </Panel>

          <Panel title="Details">
            <ToggleRow theme={theme} scheme={scheme}
              k="Ärmel-Akzent" sub="Kragen + Stutzen in Tinktur B"
              on={kit.sleeveAccent} onChange={()=>updateKit({sleeveAccent: !kit.sleeveAccent})} last/>
          </Panel>
        </div>
      </div>
    </div>
  );
}

// ================================================================
// PlayerToken — used on every pitch/lineup screen.
// Stacks: club jersey (SVG) + shirt number badge.
// Default size 36 reads well at 2D-pitch density.
// ================================================================
function PlayerToken({kit, a, b, shirt, highlight=false, accent='#b7301b', size=36, ring=null}){
  // accept either kit object or loose a/b/pattern props
  const pattern = kit?.pattern || 'solid';
  const sleeveAccent = kit?.sleeveAccent !== false;
  const colA = a || kit?.a || '#0e3a5f';
  const colB = b || kit?.b || '#c8a45a';

  // luminance pick for shirt number text
  const lumA = (() => {
    const r = parseInt(colA.slice(1,3),16), g = parseInt(colA.slice(3,5),16), bl = parseInt(colA.slice(5,7),16);
    return (0.299*r + 0.587*g + 0.114*bl)/255;
  })();
  const numColor = lumA > 0.55 ? '#11100e' : '#ffffff';

  return (
    <div style={{
      position:'relative',
      width:size, height:size,
      display:'inline-flex', alignItems:'center', justifyContent:'center',
      filter: highlight ? `drop-shadow(0 0 6px ${accent})` : 'none',
    }}>
      <Jersey pattern={pattern} a={colA} b={colB}
              sleeveAccent={sleeveAccent} crest={null}
              size={size}/>
      {/* Highlight ring under the shirt number */}
      <span style={{
        position:'absolute',
        top:size*0.38, left:'50%', transform:'translateX(-50%)',
        minWidth:size*0.46, height:size*0.36, padding:'0 3px',
        borderRadius:4,
        background: highlight ? accent : 'transparent',
        display:'grid', placeItems:'center',
        fontFamily:'JetBrains Mono, monospace', fontWeight:800,
        fontSize: size*0.32, lineHeight:1,
        color: highlight ? '#fff' : numColor,
        letterSpacing:'-.5px',
        pointerEvents:'none',
      }}>{shirt}</span>
      {ring && (
        <span style={{
          position:'absolute', inset:-3, borderRadius:'50%',
          border:`2px solid ${ring}`, pointerEvents:'none',
        }}/>
      )}
    </div>
  );
}

Object.assign(window, {
  ScreenIdentity, IdentityStudio, Jersey, PlayerToken, ScreenIdentityWelcome,
  IDENT_TINCT, IDENT_SHAPES, IDENT_CHARGES, IDENT_PATTERNS,
});

// ================================================================
// ScreenIdentityWelcome — cinematic "Tabloid front-page" moment
// between Manager-Onboarding and the first Hub.
// Reveals: club crest + home kit + motto + the manager's appointment.
// Treats the player's first sitting as a Sunday-paper announcement.
// ================================================================
function ScreenIdentityWelcome({theme='A', scheme='light', clubId='hafenstadt', mgrName='Julia Lindquist', mgrInitials='JL'}){
  const t = THEMES[theme][scheme];
  const club = CLUB_REGISTRY[clubId] || CLUB_REGISTRY.hafenstadt;
  const crest = club.crest;
  const kit   = club.kit || {pattern:'solid', sleeveAccent:true};

  // Newsprint vertical hatch — pure CSS
  const newsprint = `
    repeating-linear-gradient(0deg, ${t.bgInk}30 0 1px, transparent 1px 7px),
    repeating-linear-gradient(90deg, ${t.bgInk}10 0 1px, transparent 1px 9px)
  `;

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%', position:'relative', background:t.bg, overflow:'hidden'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      {/* Subtle paper texture */}
      <div style={{position:'absolute', inset:0, background:newsprint, opacity:.5, pointerEvents:'none'}}/>
      {/* Skip control — keeps the brief's skippable-cover rule */}
      <button style={{
        position:'absolute', top:10, right:10, zIndex:20,
        padding:'6px 12px', borderRadius:99,
        background:'transparent', border:`1px solid ${t.rule}`,
        color:t.inkMute, fontFamily:'inherit', fontWeight:700, fontSize:11,
        cursor:'pointer',
      }}>Überspringen</button>

      {/* Masthead */}
      <header style={{padding:'8px 18px 6px', borderBottom:`2px solid ${t.ink}`, marginTop:6, position:'relative', zIndex:5}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
          <span style={{fontSize:9.5, color:t.inkMute, fontWeight:700, letterSpacing:1.6, textTransform:'uppercase', fontFamily:'JetBrains Mono, monospace'}}>Nr. 142 · Mo 18. Mai 2026 · 1,40 €</span>
          <span style={{fontSize:9.5, color:t.inkMute, fontWeight:700, letterSpacing:1.2, textTransform:'uppercase'}}>Sportteil</span>
        </div>
        <SerifH theme={theme} style={{display:'block', fontSize:34, fontWeight:800, color:t.ink, letterSpacing:-1, lineHeight:1, marginTop:2, fontStyle:'italic'}}>
          Aurelia Times
        </SerifH>
        <div style={{fontSize:10, color:t.accent, fontWeight:700, letterSpacing:1.4, marginTop:4, textTransform:'uppercase'}}>
          ★ ★ ★ Klub-Sonderausgabe ★ ★ ★
        </div>
      </header>

      {/* Headline */}
      <div style={{padding:'14px 18px 8px', position:'relative', zIndex:5}}>
        <div style={{fontSize:10, color:t.accent, fontWeight:800, letterSpacing:1.8, textTransform:'uppercase'}}>Exklusiv · Trainerwechsel</div>
        <SerifH theme={theme} style={{display:'block', fontSize:34, fontWeight:800, color:t.ink, lineHeight:.95, marginTop:4, letterSpacing:-.5}}>
          {mgrName.split(' ').slice(-1)[0]}<br/>
          <span style={{color:t.accent, fontStyle:'italic'}}>übernimmt</span><br/>
          den {club.short}.
        </SerifH>
        <div style={{fontSize:12, color:t.inkMute, marginTop:8, fontFamily:THEMES[theme].font, fontStyle:'italic', lineHeight:1.35, paddingLeft:8, borderLeft:`2px solid ${t.accent}`}}>
          „Wir spielen mit ruhiger Hand. <br/>Drei Punkte, dann reden wir." <span style={{color:t.inkSoft}}>— {mgrName}, gestern Abend</span>
        </div>
      </div>

      {/* Hero block — crest + jersey side by side, in a paper card */}
      <div style={{
        margin:'10px 18px 0', padding:'18px 14px 16px',
        background:t.card, border:`1px solid ${t.rule}`, borderRadius:6,
        boxShadow:`0 1px 0 ${t.rule}`,
        position:'relative', zIndex:5,
      }}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-around', gap:8}}>
          <Crest {...crest} motto={undefined} size={120}/>
          <Jersey pattern={kit.pattern} a={crest.a} b={crest.b}
                  sleeveAccent={kit.sleeveAccent} crest={crest} size={120}/>
        </div>
        <div style={{textAlign:'center', marginTop:10, paddingTop:10, borderTop:`1px dashed ${t.rule}`}}>
          <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:1.6, textTransform:'uppercase'}}>Verein</div>
          <SerifH theme={theme} style={{display:'block', fontSize:22, fontWeight:700, color:t.ink, lineHeight:1.05, marginTop:2}}>{club.name}</SerifH>
          <div style={{fontSize:11, color:t.accent, fontWeight:700, marginTop:4, letterSpacing:.8, textTransform:'uppercase'}}>Saison 2026 / 27 · Aurelia Premier</div>
        </div>
      </div>

      {/* Manager footer card */}
      <div style={{
        margin:'12px 18px 0', padding:'10px 12px',
        display:'flex', alignItems:'center', gap:10,
        background:'transparent', borderTop:`1px solid ${t.rule}`, borderBottom:`1px solid ${t.rule}`,
        position:'relative', zIndex:5,
      }}>
        <div style={{
          width:42, height:42, borderRadius:'50%',
          background:t.accentSoft, color:t.accent,
          display:'grid', placeItems:'center',
          fontFamily:THEMES[theme].font, fontWeight:800, fontSize:18,
          border:`2px solid ${t.accent}`,
        }}>{mgrInitials}</div>
        <div style={{flex:1, minWidth:0}}>
          <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>Neuer Trainer</div>
          <SerifH theme={theme} style={{display:'block', fontSize:15, fontWeight:700, color:t.ink, lineHeight:1.1}}>{mgrName}</SerifH>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>Vertrag</div>
          <SerifH theme={theme} style={{display:'block', fontSize:14, fontWeight:700, color:t.ink, fontFamily:'JetBrains Mono, monospace'}}>3 Saisons</SerifH>
        </div>
      </div>

      <div style={{flex:1}}/>

      {/* CTA */}
      <div style={{padding:'10px 18px 24px', position:'relative', zIndex:5}}>
        <button style={{
          width:'100%', height:56, borderRadius:14, border:'none',
          background:t.accent, color:'#fff', fontWeight:800, fontSize:16,
          display:'flex', alignItems:'center', justifyContent:'center', gap:10,
          fontFamily:'inherit',
          boxShadow:`0 8px 20px -6px ${t.accent}80`, cursor:'pointer',
        }}>
          <I.Whistle size={20} color="#fff" sw={2.2}/>
          Erste Saison antreten
        </button>
        <div style={{textAlign:'center', fontSize:10, color:t.inkSoft, marginTop:8, letterSpacing:.4, textTransform:'uppercase', fontWeight:700}}>
          ↓ wischen, um den ganzen Bericht zu lesen
        </div>
      </div>
    </div>
  );
}
