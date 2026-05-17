// ui.jsx — phone frame, icon set (lucide-style), procedural crest generator,
// shared primitives + Direction A token CSS.

// ---------- THEME TOKENS ----------
// Direction A — Sonntagszeitung (RECOMMENDED)
const TOKENS_A_LIGHT = {
  bg:        '#f4ede0',  // paper
  bgInk:     '#ece2cf',  // softer paper / dividers
  card:      '#fbf6ea',  // raised paper
  ink:       '#1a1410',  // body
  inkMute:   '#5a4f44',  // secondary text
  inkSoft:   '#7a6f63',
  rule:      '#d9cdb4',  // hairline
  accent:    '#b7301b',  // scarlet ink
  accentSoft:'#f6dcd5',
  ok:        '#3f6a2f',
  warn:      '#a3680f',
  danger:    '#9b1f0a',
};
const TOKENS_A_DARK = {
  bg:        '#16110d',
  bgInk:     '#1f1812',
  card:      '#221a13',
  ink:       '#f3e8d4',
  inkMute:   '#b4a896',
  inkSoft:   '#8a8072',
  rule:      '#3b3024',
  accent:    '#e8553b',
  accentSoft:'#3a1c15',
  ok:        '#7da868',
  warn:      '#d9a04c',
  danger:    '#e8553b',
};
const THEMES = {
  A: { light: TOKENS_A_LIGHT, dark: TOKENS_A_DARK, name:'Sonntagszeitung',
       font:'Newsreader, "Source Serif 4", Georgia, serif',
       ui:'Inter, system-ui, sans-serif', radius:'14px' },
};

// ---------- ICONS (lucide-react look) ----------
// Stroke 1.75, round line caps. We render inline SVGs.
const ICON = (d, opts={}) => ({size=18, color='currentColor', sw=1.75, ...rest}={}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
       {...rest}>{d}</svg>
);
const I = {
  Inbox:     ICON(<><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5 4h14l3 8v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7Z"/></>),
  Users:     ICON(<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>),
  Wallet:    ICON(<><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></>),
  Trophy:    ICON(<><path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/><path d="M6 5h12v6a6 6 0 0 1-12 0V5z"/><path d="M9 21h6"/><path d="M12 17v4"/></>),
  Calendar:  ICON(<><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>),
  ChevronRight: ICON(<path d="m9 6 6 6-6 6"/>),
  ChevronLeft:  ICON(<path d="m15 6-6 6 6 6"/>),
  ChevronDown:  ICON(<path d="m6 9 6 6 6-6"/>),
  ArrowRight:   ICON(<><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>),
  Plus:      ICON(<><path d="M12 5v14"/><path d="M5 12h14"/></>),
  Wifi:      ICON(<><path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><line x1="12" y1="20" x2="12" y2="20"/></>),
  Battery:   ICON(<><rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 11v2"/><rect x="4" y="9" width="13" height="6" rx="1" fill="currentColor" stroke="none"/></>),
  Bell:      ICON(<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>),
  Whistle:   ICON(<><circle cx="9" cy="12" r="5"/><path d="m14 12 8-3v6Z"/></>),
  Goal:      ICON(<><circle cx="12" cy="12" r="9"/><path d="m12 3 2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z" /></>),
  Card:      ICON(<rect x="6" y="3" width="12" height="18" rx="1"/>),
  Wifi0:     ICON(<><path d="M5 13a10 10 0 0 1 14 0" opacity=".3"/><path d="M8.5 16.5a5 5 0 0 1 7 0" opacity=".3"/><line x1="2" y1="2" x2="22" y2="22"/></>),
  CloudOff:  ICON(<><path d="M2 2l20 20"/><path d="M5.78 5.78A7 7 0 0 0 9 19h8.5"/><path d="M22 16a4 4 0 0 0-3.62-3.98"/></>),
  Settings:  ICON(<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.06.07a2 2 0 1 1-2.83 2.83l-.07-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.07.06A2 2 0 1 1 4.3 16.93l.06-.07A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.06-.07A2 2 0 1 1 7.07 4.3l.07.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1A1.7 1.7 0 0 0 15 4.6a1.7 1.7 0 0 0 1.8-.3l.07-.06A2 2 0 1 1 19.7 7.07l-.06.07A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1A1.7 1.7 0 0 0 19.4 15z"/></>),
  Mail:      ICON(<><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></>),
  Send:      ICON(<><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>),
  Megaphone: ICON(<><path d="m3 11 18-5v12L3 13Z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></>),
  Search:    ICON(<><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>),
  Filter:    ICON(<path d="M22 3H2l8 10v6l4 2v-8z"/>),
  Star:      ICON(<path d="m12 2 3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="currentColor"/>),
  StarO:     ICON(<path d="m12 2 3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>),
  Building:  ICON(<><rect x="3" y="2" width="18" height="20" rx="1"/><path d="M9 22V12h6v10M9 6h.01M15 6h.01M9 10h.01M15 10h.01"/></>),
  Coins:     ICON(<><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18M7 6h1v4M16.71 13.88 18 15l2-2"/></>),
  Slider:    ICON(<><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></>),
  Upload:    ICON(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/></>),
  Download:  ICON(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></>),
  Trash:     ICON(<><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>),
  ShareIos:  ICON(<><path d="M12 16V3"/><path d="m7 8 5-5 5 5"/><path d="M5 12v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8"/></>),
  More:      ICON(<><circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/></>),
  Pitch:     ICON(<><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M12 3v18M2 9h4v6H2M22 9h-4v6h4"/><circle cx="12" cy="12" r="2.5"/></>),
  Flag:      ICON(<><path d="M4 22V4"/><path d="M4 4h13l-2 4 2 4H4"/></>),
  Tag:       ICON(<><path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1.5"/></>),
  TrendUp:   ICON(<><path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/></>),
  TrendDown: ICON(<><path d="m3 7 6 6 4-4 8 8"/><path d="M14 17h7v-7"/></>),
  Globe:     ICON(<><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></>),
  Check:     ICON(<path d="m5 13 4 4L19 7"/>),
  X:         ICON(<><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>),
  Clock:     ICON(<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>),
  AddHome:   ICON(<><path d="M3 11 12 3l9 8"/><path d="M5 10v10h6v-6h2v6h6V10"/><path d="M18 3v4M16 5h4"/></>),
};

// ---------- PHONE FRAME ----------
function PhoneFrame({ children, theme, scheme='light', label, time='09:41' }) {
  const t = THEMES[theme][scheme];
  const bg = t.bg;
  const ink = t.ink;
  return (
    <div className="phone-frame">
      <div className="phone-screen" style={{ background: bg, color: ink, fontFamily: THEMES[theme].ui }}>
        <div className="phone-notch"></div>
        <div className="phone-status" style={{ color: ink }}>
          <span>{time}</span>
          <span className="sig" style={{ display:'flex', gap:6, alignItems:'center'}}>
            <I.CloudOff size={14} sw={2} color={ink} />
            <I.Battery size={20} sw={1.5} color={ink} />
          </span>
        </div>
        <div className="phone-content">
          {children}
        </div>
      </div>
    </div>
  );
}

// ---------- SHARED ATOMS (themed) ----------
function ThemeCss({ theme, scheme }) {
  const t = THEMES[theme][scheme];
  // CSS variables scoped to nearest .phone-screen
  const css = Object.entries(t).map(([k,v])=>`--${k}:${v};`).join('');
  return <style>{`.phone-screen{${css}}`}</style>;
}
// Convenience hook to read theme tokens
const useTokens = (theme, scheme) => THEMES[theme][scheme];

// Pill button (used for inbox actions)
function PillBtn({children, intent='neutral', icon, theme, scheme, ...rest}){
  const t = THEMES[theme][scheme];
  const map = {
    accept:   { bg:t.accent, fg:'#fff', bd:t.accent },
    neutral:  { bg:'transparent', fg:t.ink, bd:t.rule },
    soft:     { bg:t.bgInk, fg:t.ink, bd:'transparent' },
    danger:   { bg:'transparent', fg:t.danger, bd:t.rule },
  };
  const s = map[intent] || map.neutral;
  return (
    <button {...rest} style={{
      display:'inline-flex',alignItems:'center',justifyContent:'center',gap:4,
      height:36, padding:'0 12px', minWidth:44,
      borderRadius:999, fontSize:12.5, fontWeight:600,
      background:s.bg, color:s.fg, border:`1px solid ${s.bd}`,
      cursor:'pointer', whiteSpace:'nowrap', flex:'1 1 0', fontFamily:'inherit',
    }}>{icon}{children}</button>
  );
}

// Strength bar (1–10)
function StrBar({n=7, max=10, theme, scheme, w=72}){
  const t = THEMES[theme][scheme];
  return (
    <div style={{display:'flex', gap:2, alignItems:'center'}}>
      <span style={{fontFamily:'JetBrains Mono, ui-monospace, monospace', fontWeight:600, fontSize:12, color:t.ink, marginRight:4, fontVariantNumeric:'tabular-nums'}}>{n}</span>
      <div style={{display:'flex', gap:2, width:w}}>
        {Array.from({length:max}).map((_,i)=>(
          <div key={i} style={{flex:1, height:6, borderRadius:1,
            background: i < n ? t.ink : t.rule }} />
        ))}
      </div>
    </div>
  );
}

// 4-tier talent stars
function Talent({n=3, max=4, theme, scheme}){
  const t = THEMES[theme][scheme];
  return (
    <span style={{display:'inline-flex', gap:1, color:t.accent}}>
      {Array.from({length:max}).map((_,i)=> i<n
        ? <I.Star key={i} size={11} color={t.accent} />
        : <I.StarO key={i} size={11} color={t.rule} />)}
    </span>
  );
}

// Position pill
function PosPill({pos, theme, scheme}){
  const t = THEMES[theme][scheme];
  const color = {TW:'#a3680f', IV:'#3f6a2f', AV:'#3f6a2f', DM:'#1f6f9a', ZM:'#1f6f9a', OM:'#7a3a8a', FL:'#7a3a8a', ST:t.accent}[pos] || t.ink;
  return (
    <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',
      minWidth:30, height:22, padding:'0 8px',
      fontSize:11, fontWeight:700, letterSpacing:.5,
      borderRadius:6, color, background:`color-mix(in oklab, ${color} 12%, transparent)`,
      border:`1px solid color-mix(in oklab, ${color} 22%, transparent)`,
      fontFamily:'JetBrains Mono, ui-monospace, monospace'}}>{pos}</span>
  );
}

// Form indicator — 5 letters (S=Sieg N=Niederlage U=Unentschieden), color + glyph
function FormStrip({form='SSUNS', theme, scheme}){
  const t = THEMES[theme][scheme];
  const tone = (c) => c==='S' ? t.ok : c==='N' ? t.danger : t.warn;
  return (
    <div style={{display:'flex', gap:3}}>
      {form.split('').map((c,i)=>(
        <span key={i} title={c} style={{
          width:18, height:18, borderRadius:5, display:'inline-flex',
          alignItems:'center', justifyContent:'center',
          fontSize:10, fontWeight:800, color:'#fff',
          background:tone(c), fontFamily:'JetBrains Mono, ui-monospace, monospace'
        }}>{c}</span>
      ))}
    </div>
  );
}

// Levy chip (Verbandsabgabe)
function LevyChip({theme, scheme}){
  const t = THEMES[theme][scheme];
  return (
    <span style={{
      display:'inline-flex',alignItems:'center',gap:6,
      padding:'4px 10px',borderRadius:999,
      background:t.accentSoft, color:t.accent,
      fontSize:11, fontWeight:700, letterSpacing:.3
    }}>
      <span style={{width:6,height:6,borderRadius:99,background:t.accent}}></span>
      Verbandsabgabe · 300.000 €
    </span>
  );
}

// ---------- PROCEDURAL CREST ----------
// Composable shield + charge SVG. Deterministic by (shape, a, b, charge).
function shieldPath(shape){
  // 100x120 viewBox baseline
  switch(shape){
    case 'iberian':  return 'M10 8 H90 V60 C90 92 60 110 50 116 C40 110 10 92 10 60 Z';
    case 'gonfalon': return 'M10 8 H90 V90 L70 78 L50 96 L30 78 L10 90 Z';
    case 'roundel':  return 'M50 6 a50 50 0 1 0 0.001 0 Z';
    case 'heater':
    default:         return 'M10 8 H90 V52 C90 86 70 106 50 116 C30 106 10 86 10 52 Z';
  }
}
function Charge({kind, color}){
  // Each charge: 100x100 viewBox, single tincture
  const c = color;
  const stroke = c, fill = c;
  switch(kind){
    case 'lion': return (
      <g fill={fill} stroke={stroke} strokeWidth="2" strokeLinejoin="round">
        <path d="M22 70 Q24 50 38 46 L42 38 L48 44 L56 38 L60 46 Q76 50 78 70 L72 72 Q72 60 60 58 L56 70 L54 60 L46 60 L44 70 L40 58 Q28 60 28 72 Z"/>
        <circle cx="42" cy="40" r="1.5" fill="#fff" stroke="none"/>
        <circle cx="58" cy="40" r="1.5" fill="#fff" stroke="none"/>
      </g>
    );
    case 'eagle': return (
      <g fill={fill} stroke={stroke} strokeWidth="2" strokeLinejoin="round">
        <path d="M50 30 L40 38 L18 36 L36 50 L24 64 L42 60 L40 78 L50 70 L60 78 L58 60 L76 64 L64 50 L82 36 L60 38 Z"/>
      </g>
    );
    case 'ship': return (
      <g fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 70 H84 L78 80 H22 Z" fill={fill}/>
        <path d="M50 70 V30"/>
        <path d="M50 32 L72 52 L50 52 Z" fill={fill}/>
        <path d="M50 36 L30 52 L50 52 Z" fill={fill}/>
      </g>
    );
    case 'wave': return (
      <g fill="none" stroke={stroke} strokeWidth="4" strokeLinecap="round">
        <path d="M14 46 Q26 36 38 46 T62 46 T86 46"/>
        <path d="M14 60 Q26 50 38 60 T62 60 T86 60"/>
        <path d="M14 74 Q26 64 38 74 T62 74 T86 74"/>
      </g>
    );
    case 'tower': return (
      <g fill={fill} stroke={stroke} strokeWidth="2" strokeLinejoin="round">
        <path d="M28 36 H36 V42 H44 V36 H52 V42 H60 V36 H68 V42 H72 V52 H24 V42 H28 Z"/>
        <rect x="28" y="52" width="40" height="32"/>
        <rect x="42" y="62" width="12" height="22" fill={stroke==="#fff"?"#000":"#fff"}/>
      </g>
    );
    case 'sword': return (
      <g stroke={stroke} strokeWidth="3" strokeLinecap="round" fill={fill}>
        <path d="M50 18 L56 76 H44 Z"/>
        <rect x="34" y="74" width="32" height="5"/>
        <rect x="47" y="76" width="6" height="14"/>
      </g>
    );
    case 'cog': return (
      <g fill={fill} stroke={stroke} strokeWidth="2">
        <path d="M50 20 L54 28 L62 26 L62 34 L70 36 L66 44 L70 52 L62 54 L62 62 L54 60 L50 68 L46 60 L38 62 L38 54 L30 52 L34 44 L30 36 L38 34 L38 26 L46 28 Z"/>
        <circle cx="50" cy="44" r="6" fill="#fff" stroke={stroke}/>
      </g>
    );
    case 'cross': return (
      <g fill={fill}><rect x="44" y="22" width="12" height="56"/><rect x="22" y="44" width="56" height="12"/></g>
    );
    case 'star': return (
      <g fill={fill}><polygon points="50,22 58,42 80,44 62,58 68,80 50,68 32,80 38,58 20,44 42,42"/></g>
    );
    case 'ball':
    default: return (
      <g fill={fill} stroke={stroke} strokeWidth="2">
        <circle cx="50" cy="50" r="22" fill="#fff" stroke={stroke}/>
        <polygon points="50,38 60,46 56,58 44,58 40,46" fill={stroke}/>
      </g>
    );
  }
}

function Crest({ shape='heater', a='#0e3a5f', b='#c8a45a', charge='ship', motto, size=88 }){
  const sid = `m-${shape}-${a}-${b}-${charge}`.replace(/[^a-z0-9-]/gi,'');
  return (
    <svg width={size} height={size*1.2} viewBox="0 0 100 120">
      <defs>
        <clipPath id={sid}><path d={shieldPath(shape)} /></clipPath>
      </defs>
      <g clipPath={`url(#${sid})`}>
        <rect x="0" y="0" width="100" height="120" fill={a}/>
        {/* per pale or per fess split — alternates with shape */}
        {shape==='gonfalon' && <rect x="0" y="60" width="100" height="60" fill={b}/>}
        {shape==='iberian' && <rect x="50" y="0" width="50" height="120" fill={b}/>}
        {shape==='roundel' && <circle cx="50" cy="60" r="32" fill={b}/>}
        {shape==='heater'  && <rect x="0" y="0" width="100" height="44" fill={b}/>}
      </g>
      {/* Charge centered on shield */}
      <g transform={`translate(0,${shape==='roundel'?10:6})`}>
        <Charge kind={charge} color={shape==='gonfalon' ? a : b==='#fff' ? a : '#11100e'} />
      </g>
      <path d={shieldPath(shape)} fill="none" stroke="#11100e" strokeWidth="2"/>
      {motto && (
        <g>
          <path d="M12 108 Q50 118 88 108 L84 116 Q50 122 16 116 Z" fill="#e8ddc5" stroke="#11100e" strokeWidth="1"/>
          <text x="50" y="116" textAnchor="middle" fontSize="6" fontFamily="Newsreader, Georgia, serif" fontStyle="italic" fill="#11100e">{motto}</text>
        </g>
      )}
    </svg>
  );
}

// Mini pitch icon for set pieces
function MiniPitch({size=22, color='currentColor'}){
  return (
    <svg width={size} height={size*0.65} viewBox="0 0 100 65" fill="none" stroke={color} strokeWidth="3">
      <rect x="2" y="2" width="96" height="61" rx="2"/>
      <line x1="50" y1="2" x2="50" y2="63"/>
      <circle cx="50" cy="32" r="8"/>
      <rect x="2" y="18" width="14" height="29"/>
      <rect x="84" y="18" width="14" height="29"/>
    </svg>
  );
}

// Pitch / formation visualization (for halftime)
function FormationPitch({theme, scheme, formation='4-3-3'}){
  const t = THEMES[theme][scheme];
  // y from top in 100x140 viewBox; coords for 4-3-3
  const rows = {
    '4-3-3': [[50],[20,40,60,80],[28,50,72],[20,50,80]],
    '4-4-2': [[50],[20,40,60,80],[20,40,60,80],[35,65]],
    '3-5-2': [[50],[30,50,70],[15,30,50,70,85],[35,65]],
    '5-3-2': [[50],[15,32,50,68,85],[28,50,72],[35,65]],
    '4-2-3-1':[[50],[20,40,60,80],[35,65],[20,50,80],[50]],
  }[formation] || [[50],[20,40,60,80],[28,50,72],[20,50,80]];
  const stripes = Array.from({length:8}).map((_,i)=>i);
  return (
    <svg viewBox="0 0 100 140" style={{width:'100%', maxWidth:240, display:'block'}}>
      <defs>
        <linearGradient id="g-pitch" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={t.ok} stopOpacity=".55"/>
          <stop offset="1" stopColor={t.ok} stopOpacity=".4"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="96" height="136" rx="3" fill="url(#g-pitch)" stroke={t.ink} strokeWidth=".5"/>
      {stripes.map(i=>(<rect key={i} x="2" y={2+i*17} width="96" height="8.5" fill="#fff" opacity={i%2?.07:0}/>))}
      <line x1="2" y1="70" x2="98" y2="70" stroke="#fff" strokeWidth=".5" opacity=".55"/>
      <circle cx="50" cy="70" r="10" fill="none" stroke="#fff" strokeWidth=".5" opacity=".55"/>
      <rect x="30" y="2" width="40" height="14" fill="none" stroke="#fff" strokeWidth=".5" opacity=".55"/>
      <rect x="30" y="124" width="40" height="14" fill="none" stroke="#fff" strokeWidth=".5" opacity=".55"/>
      {rows.map((row, ri) => {
        const y = 132 - ri * (124 / (rows.length-1));
        return row.map((x, xi)=>(
          <g key={`${ri}-${xi}`}>
            <circle cx={x} cy={y} r="4.5" fill={t.card} stroke={t.ink} strokeWidth=".7"/>
            <text x={x} y={y+1.6} textAnchor="middle" fontSize="4.5" fontWeight="700" fill={t.ink} fontFamily="Inter">{ri===0?'1':''}</text>
          </g>
        ));
      })}
    </svg>
  );
}

// Stadium plot — top-down. Rectangular pitch, 4 rectangular stand blocks
// (roofed = darker fill + thin roof-line offset), 4 corner floodlight masts,
// outside the ground a ring of small amenity buildings with clear pins.
function StadiumPlot({theme, scheme}){
  const t = THEMES[theme][scheme];
  // Pitch dims (top-down). The whole ground sits in a 360×220 viewbox.
  const PX=132, PY=78, PW=96, PH=64; // pitch rect
  const STAND_INSET = 14; // stand thickness
  // Stand rects wrap the pitch:
  const stands = [
    { id:'N', x: PX-6, y: PY-STAND_INSET-2, w: PW+12, h: STAND_INSET, roof:true,  label:'NORD'  },
    { id:'S', x: PX-6, y: PY+PH+2,          w: PW+12, h: STAND_INSET, roof:false, label:'SÜD'   },
    { id:'O', x: PX+PW+2, y: PY-6,          w: STAND_INSET, h: PH+12, roof:true,  label:'OST'   },
    { id:'W', x: PX-STAND_INSET-2, y: PY-6, w: STAND_INSET, h: PH+12, roof:true,  label:'WEST'  },
  ];
  // 4 floodlight masts at corners of the ground
  const lights = [
    {x: PX-STAND_INSET-8,  y: PY-STAND_INSET-8},
    {x: PX+PW+STAND_INSET+8, y: PY-STAND_INSET-8},
    {x: PX-STAND_INSET-8,  y: PY+PH+STAND_INSET+8},
    {x: PX+PW+STAND_INSET+8, y: PY+PH+STAND_INSET+8},
  ];
  // Amenity buildings — small rect with leader line + dot
  const amen = [
    { x: 14,  y: 18,  w: 56, h: 26, label:'Klubhotel',        ok:true  },
    { x: 90,  y: 14,  w: 70, h: 22, label:'Nachwuchszentrum', ok:true  },
    { x: 200, y: 14,  w: 56, h: 22, label:'Fanshop',          ok:true  },
    { x: 290, y: 18,  w: 56, h: 26, label:'Klubhaus',         ok:true  },
    { x: 14,  y: 174, w: 56, h: 26, label:'Bierstände ×14',   ok:true  },
    { x: 90,  y: 178, w: 70, h: 22, label:'Würstchenbude ×9', ok:true  },
    { x: 200, y: 178, w: 56, h: 22, label:'VIP-Catering',     ok:true  },
    { x: 290, y: 174, w: 56, h: 26, label:'Vereinsrestaurant',ok:false },
  ];
  const stripe = (x,y,w,h,n=8)=>Array.from({length:n}).map((_,i)=>(
    <rect key={i} x={x} y={y+i*(h/n)} width={w} height={h/n/2} fill="#fff" opacity={i%2?0.06:0}/>
  ));
  return (
    <svg viewBox="0 0 360 220" style={{width:'100%', display:'block'}}>
      <defs>
        <linearGradient id="sp-pitch" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={t.ok} stopOpacity=".68"/>
          <stop offset="1" stopColor={t.ok} stopOpacity=".48"/>
        </linearGradient>
      </defs>
      {/* outer concourse */}
      <rect x="2" y="2" width="356" height="216" rx="10" fill={t.bgInk} stroke={t.rule} strokeWidth="1"/>

      {/* concourse ring around stadium */}
      <rect x={PX-STAND_INSET-12} y={PY-STAND_INSET-12} width={PW+STAND_INSET*2+24} height={PH+STAND_INSET*2+24} rx="6"
        fill={t.card} stroke={t.rule} strokeWidth=".8"/>

      {/* stands — roof first (slightly larger, lighter), then seating block on top */}
      {stands.map(s=>(
        <g key={s.id}>
          {s.roof && (
            <rect x={s.x-1.5} y={s.y-1.5} width={s.w+3} height={s.h+3} rx="2"
              fill="none" stroke={t.ink} strokeWidth=".8" strokeDasharray="1.5 1.5" opacity=".55"/>
          )}
          <rect x={s.x} y={s.y} width={s.w} height={s.h} rx="1.5"
            fill={s.roof ? t.ink : t.inkMute}
            stroke={t.ink} strokeWidth=".5"/>
          {/* seat rows hint */}
          {Array.from({length: s.w>s.h ? 3 : 0}).map((_,i)=>(
            <line key={i} x1={s.x+2} x2={s.x+s.w-2}
              y1={s.y + (s.h/4)*(i+1)} y2={s.y + (s.h/4)*(i+1)}
              stroke={t.bg} strokeWidth=".4" opacity=".5"/>
          ))}
          {Array.from({length: s.h>s.w ? 3 : 0}).map((_,i)=>(
            <line key={i} y1={s.y+2} y2={s.y+s.h-2}
              x1={s.x + (s.w/4)*(i+1)} x2={s.x + (s.w/4)*(i+1)}
              stroke={t.bg} strokeWidth=".4" opacity=".5"/>
          ))}
          <text x={s.x+s.w/2} y={s.y+s.h/2+2} textAnchor="middle"
            fontSize="6" fontWeight="800" fill={t.bg} fontFamily="Inter" letterSpacing=".8">{s.label}</text>
        </g>
      ))}

      {/* pitch */}
      <g>
        <rect x={PX} y={PY} width={PW} height={PH} fill="url(#sp-pitch)" stroke={t.ink} strokeWidth=".6"/>
        {stripe(PX, PY, PW, PH, 8)}
        {/* midline + center circle */}
        <line x1={PX+PW/2} y1={PY} x2={PX+PW/2} y2={PY+PH} stroke="#fff" strokeWidth=".6" opacity=".7"/>
        <circle cx={PX+PW/2} cy={PY+PH/2} r="7" fill="none" stroke="#fff" strokeWidth=".6" opacity=".7"/>
        <circle cx={PX+PW/2} cy={PY+PH/2} r=".8" fill="#fff" opacity=".8"/>
        {/* penalty boxes */}
        <rect x={PX} y={PY+PH/2-14} width="14" height="28" fill="none" stroke="#fff" strokeWidth=".6" opacity=".7"/>
        <rect x={PX+PW-14} y={PY+PH/2-14} width="14" height="28" fill="none" stroke="#fff" strokeWidth=".6" opacity=".7"/>
        {/* six-yard boxes */}
        <rect x={PX} y={PY+PH/2-8} width="5" height="16" fill="none" stroke="#fff" strokeWidth=".5" opacity=".6"/>
        <rect x={PX+PW-5} y={PY+PH/2-8} width="5" height="16" fill="none" stroke="#fff" strokeWidth=".5" opacity=".6"/>
        {/* goals */}
        <rect x={PX-1.4} y={PY+PH/2-3} width="1.4" height="6" fill="#fff" opacity=".9"/>
        <rect x={PX+PW} y={PY+PH/2-3} width="1.4" height="6" fill="#fff" opacity=".9"/>
      </g>

      {/* floodlight masts (4 corners) — small pole + radiating fan */}
      {lights.map((l,i)=>(
        <g key={i}>
          <path d={`M${l.x} ${l.y} L${PX+PW/2} ${PY+PH/2}`} stroke="#fff" strokeWidth=".4" opacity=".15"/>
          <circle cx={l.x} cy={l.y} r="3.2" fill={t.warn} stroke={t.ink} strokeWidth=".7"/>
          <circle cx={l.x} cy={l.y} r="1.2" fill="#fff"/>
        </g>
      ))}

      {/* corner floodlight label, top-left only */}
      <text x={lights[0].x-2} y={lights[0].y-6} fontSize="6" fontWeight="700" fill={t.inkMute} fontFamily="Inter" textAnchor="start">Flutlicht · 4 Masten</text>

      {/* Roof-coverage hint above the pitch — small legend */}
      <g transform="translate(166, 56)">
        <rect width="28" height="9" rx="2" fill={t.card} stroke={t.rule} strokeWidth=".6"/>
        <text x="14" y="6" textAnchor="middle" fontSize="5.5" fontWeight="700" fill={t.inkMute} fontFamily="Inter">3/4 gedeckt</text>
      </g>

      {/* Pitch heating glyph — small wavy line under pitch */}
      <g transform={`translate(${PX+PW/2-12}, ${PY+PH+3})`} opacity=".7">
        <path d="M0 2 Q3 -1 6 2 T12 2 T18 2 T24 2" fill="none" stroke={t.accent} strokeWidth=".7"/>
        <text x="12" y="9" textAnchor="middle" fontSize="4.5" fontWeight="700" fill={t.accent} fontFamily="Inter" letterSpacing=".3">RASENHEIZUNG</text>
      </g>

      {/* Amenity buildings around the concourse */}
      {amen.map((a,i)=>(
        <g key={i}>
          <rect x={a.x} y={a.y} width={a.w} height={a.h} rx="3"
            fill={a.ok ? t.card : 'transparent'}
            stroke={a.ok ? t.ink : t.rule}
            strokeWidth=".8"
            strokeDasharray={a.ok ? null : '2 2'}/>
          <text x={a.x+a.w/2} y={a.y+a.h/2+2.5} textAnchor="middle"
            fontSize="6.5" fontWeight={a.ok?700:600}
            fill={a.ok ? t.ink : t.inkSoft}
            fontFamily="Inter">{a.label}</text>
          {/* leader dot toward stadium */}
          <circle
            cx={a.x + a.w/2}
            cy={a.y < 80 ? a.y + a.h + 3 : a.y - 3}
            r="1.6"
            fill={a.ok ? t.accent : t.rule}/>
        </g>
      ))}
    </svg>
  );
}

Object.assign(window, {
  THEMES, TOKENS_A_LIGHT, TOKENS_A_DARK,
  I, PhoneFrame, ThemeCss, useTokens,
  PillBtn, StrBar, Talent, PosPill, FormStrip, LevyChip,
  Crest, shieldPath, MiniPitch, FormationPitch, StadiumPlot,
  ScreenHeader,
});

// ---------- SHARED SCREEN HEADER ----------
// Every screen's top section. Always shows the user's club crest + shortcode
// in the kicker, then the screen's own title. Optional right-slot for actions
// (chips, buttons, badges) and optional children for filter rows below.
//
// Usage:
//   <ScreenHeader theme={theme} scheme={scheme}
//     kicker="Kader · 14 Spieler" title="Erste Mannschaft"
//     right={<button>…</button>}>
//     <FilterChips/>
//   </ScreenHeader>
//
// Pass `club={null}` to drop the crest (e.g. Onboarding before a club exists).
function ScreenHeader({ theme, scheme, kicker, title, right, club='FC Hafenstadt', children, crestSize=30 }) {
  const t = THEMES[theme][scheme];
  const c = club ? (clubByName ? clubByName(club) : null) : null;
  return (
    <header style={{padding:'6px 16px 8px'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:10}}>
        <div style={{display:'flex', alignItems:'center', gap:10, minWidth:0, flex:1}}>
          {c && <Crest {...c.crest} size={crestSize}/>}
          <div style={{minWidth:0}}>
            <div style={{fontSize:10.5, color:t.inkMute, fontWeight:600, letterSpacing:.4, textTransform:'uppercase', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
              {c ? <><span style={{color:t.ink, fontWeight:700}}>{c.short}</span> · </> : null}{kicker}
            </div>
            <SerifH theme={theme} style={{display:'block', fontSize:24, fontWeight:700, color:t.ink, lineHeight:1.05, marginTop:1}}>{title}</SerifH>
          </div>
        </div>
        {right && <div style={{flex:'0 0 auto'}}>{right}</div>}
      </div>
      {children}
    </header>
  );
}
