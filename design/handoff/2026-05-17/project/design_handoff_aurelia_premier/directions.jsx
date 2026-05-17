// directions.jsx — three visual-direction comparison frames.
// Each frame: wordmark + square icon, palette swatches, type pairing,
// sample PlayerCard + sample InboxCard in that direction.

// ------------------------------------------------------------------
// WORDMARKS (24px and large) — three propositions
// ------------------------------------------------------------------
function WordmarkA({ size=28, ink='#1a1410', accent='#b7301b', mono=false }){
  // "Aurelia Premier" in Newsreader, with a small scarlet drop-cap underline
  return (
    <div style={{display:'inline-flex',alignItems:'baseline',gap:8}}>
      <span style={{
        fontFamily:'Newsreader, Georgia, serif', fontWeight:700,
        fontSize:size, color:ink, letterSpacing:-0.2, lineHeight:1
      }}>
        <span style={{position:'relative'}}>
          A
          <span style={{position:'absolute', left:0, right:0, bottom:-2, height:2, background:accent}}/>
        </span>
        urelia&thinsp;<span style={{fontStyle:'italic', fontWeight:500}}>Premier</span>
      </span>
      {!mono && <span style={{fontSize:size*0.36, color:accent, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', fontFamily:'Inter'}}>26/27</span>}
    </div>
  );
}

// Square PWA icon
function PwaIconA(){
  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <rect width="80" height="80" rx="16" fill="#f4ede0"/>
      <rect x="4" y="4" width="72" height="72" rx="13" fill="none" stroke="#1a1410" strokeWidth="1"/>
      <text x="40" y="46" textAnchor="middle" fontFamily="Newsreader, Georgia, serif" fontWeight="700" fontSize="40" fill="#1a1410">A</text>
      <rect x="22" y="50" width="36" height="3" fill="#b7301b"/>
      <text x="40" y="64" textAnchor="middle" fontFamily="Inter" fontWeight="700" fontSize="9" letterSpacing="2" fill="#b7301b">PREMIER</text>
    </svg>
  );
}

// ------------------------------------------------------------------
// Sample player card (compact, direction-specific styling)
// ------------------------------------------------------------------
function SamplePlayerCard({theme, scheme}){
  const p = SQUAD[8]; // Brody
  return <PlayerCard p={p} theme={theme} scheme={scheme}/>;
}

// Sample inbox card
function SampleInboxCard({theme, scheme}){
  const t = THEMES[theme][scheme];
  const c = INBOX[0];
  return (
    <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:12}}>
      <div style={{display:'flex',gap:10,alignItems:'flex-start'}}>
        <div style={{width:34,height:34,borderRadius:10,background:t.accentSoft,color:t.accent,display:'grid',placeItems:'center',fontWeight:800,fontSize:16,flex:'0 0 34px',fontFamily:THEMES[theme].font}}>§</div>
        <div style={{flex:1, minWidth:0}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',gap:8}}>
            <span style={{fontSize:10, fontWeight:700, color:t.accent, letterSpacing:.3, textTransform:'uppercase'}}>Vorstand</span>
            <span style={{fontSize:10, color:t.inkSoft}}>{c.time}</span>
          </div>
          <SerifH theme={theme} style={{display:'block', fontSize:14, fontWeight:700, color:t.ink, lineHeight:1.2, marginTop:2}}>{c.title}</SerifH>
          <div style={{fontSize:11, color:t.inkMute, marginTop:3, lineHeight:1.3}}>Sieg in Northbridge erwartet. Sie wissen, was auf dem Spiel steht.</div>
        </div>
      </div>
      <div style={{display:'flex', gap:5, marginTop:9}}>
        <PillBtn theme={theme} scheme={scheme} intent="accept">Annehmen</PillBtn>
        <PillBtn theme={theme} scheme={scheme} intent="soft">Vertagen</PillBtn>
        <PillBtn theme={theme} scheme={scheme} intent="neutral">Ablehnen</PillBtn>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Procedural crest grammar showcase
// ------------------------------------------------------------------
function CrestGrammar(){
  const items = [
    { name:'FC Hafenstadt',       shape:'heater',   a:'#0e3a5f', b:'#c8a45a', charge:'ship',  motto:'Per mare ad astra' },
    { name:'Sporting Kaltenbach', shape:'gonfalon', a:'#4a2a2a', b:'#d8c8a8', charge:'sword', motto:'Ferro et igni' },
    { name:'Olympique Sauveterre',shape:'iberian',  a:'#1f4a3a', b:'#e8d28a', charge:'eagle', motto:'Salva terra mea' },
    { name:'SV Auerbach 02',      shape:'iberian',  a:'#2b6b3f', b:'#f4e4b8', charge:'wave',  motto:'Aqua vincit' },
    { name:'AC Valguarda',        shape:'gonfalon', a:'#7a1a1a', b:'#f0e8d8', charge:'lion',  motto:'Cor leonis' },
    { name:'Riverdale Athletic',  shape:'roundel',  a:'#262626', b:'#c97a2a', charge:'tower', motto:'Stat firma turris' },
    { name:'Northbridge City',    shape:'heater',   a:'#142a44', b:'#f4ede0', charge:'cross', motto:'Pons et urbs' },
    { name:'Oakport United FC',   shape:'gonfalon', a:'#2a221c', b:'#c97a2a', charge:'cog',   motto:'Labore vincimus' },
  ];
  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16, padding:8}}>
      {items.map((c,i)=>(
        <div key={i} style={{textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center'}}>
          <Crest {...c} size={120}/>
          <div style={{fontFamily:'Newsreader, Georgia, serif', fontWeight:700, fontSize:13, color:'#1a1410', marginTop:6}}>{c.name}</div>
          <div style={{fontFamily:'JetBrains Mono', fontSize:9, color:'#7a6f63', marginTop:2}}>
            shape:{c.shape} · a:{c.a} · b:{c.b} · charge:{c.charge}
          </div>
        </div>
      ))}
    </div>
  );
}

// Tokens & components reference panel
function TokensPanel(){
  const Code = ({children}) => (
    <pre style={{
      background:'#1a1410', color:'#f4ede0', padding:'14px 16px', borderRadius:12,
      fontFamily:'JetBrains Mono, ui-monospace, monospace', fontSize:11,
      lineHeight:1.55, overflowX:'auto', margin:'8px 0 14px'
    }}>{children}</pre>
  );
  return (
    <div style={{padding:16, maxWidth:780, background:'#fbf6ea', border:'1px solid #d9cdb4', borderRadius:18}}>
      <div style={{fontFamily:'Newsreader, Georgia, serif', fontWeight:700, fontSize:24, color:'#1a1410'}}>tailwind.config.ts — Direction A (empfohlen)</div>
      <Code>{`import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Semantic — driven by CSS vars (shadcn-style). Light + dark in
        // app/globals.css via :root and .dark.
        border: 'hsl(var(--border))',
        input:  'hsl(var(--input))',
        ring:   'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card:        { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover:     { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary:     { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary:   { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted:       { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent:      { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        // Raw brand ramp — only when a semantic token won't do
        brand: {
          paper:  '#f4ede0',
          paper2: '#fbf6ea',
          ink:    '#1a1410',
          inkMute:'#5a4f44',
          rule:   '#d9cdb4',
          scarlet:'#b7301b',
          scarletSoft:'#f6dcd5',
          ok:     '#3f6a2f',
          warn:   '#a3680f',
          danger: '#9b1f0a',
        },
      },
      fontFamily: {
        // Display / narrative — Newsreader (optical-size capable serif)
        display: ['Newsreader','"Source Serif 4"','Georgia','serif'],
        // UI body — Inter with cv11/ss01 tabular for prices and scores
        sans:    ['Inter','system-ui','sans-serif'],
        // Numbers & code (transfer fees, save sizes, ticker)
        mono:    ['"JetBrains Mono"','ui-monospace','monospace'],
      },
      fontFeatureSettings: {
        tabular: '"tnum","cv11","ss01"',
      },
      borderRadius: {
        // Softer than default shadcn
        sm: 'calc(var(--radius) - 6px)',
        md: 'calc(var(--radius) - 4px)',
        lg: 'var(--radius)',         // 14px
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 10px)',
      },
      spacing: {
        // Thumb-zone reserve at viewport bottom (bottom 40% rule)
        'thumb': '12rem',     // 192px
        // Hub tile minimum height
        'hub':   '7rem',      // 112px
        // 44px touch target (WCAG 2.2 AA)
        'tap':   '2.75rem',
      },
      keyframes: {
        'event-in':      { '0%': {opacity:0, transform:'translateY(6px)'}, '100%': {opacity:1, transform:'translateY(0)'} },
        'cheer':         { '0%,100%': {transform:'scale(1)'}, '50%': {transform:'scale(1.06)'} },
        'ticker-slide':  { '0%': {transform:'translateX(0)'}, '100%': {transform:'translateX(-50%)'} },
      },
      animation: {
        // All animations are short and gated by motion-safe in components
        'event-in':     'event-in .22s ease-out both',
        'cheer':        'cheer .35s ease-out',
        'ticker-slide': 'ticker-slide 28s linear infinite',
      },
      boxShadow: {
        'paper': '0 1px 0 rgba(255,255,255,.6) inset, 0 1px 2px rgba(26,20,16,.06)',
        'lift':  '0 8px 22px -8px rgba(26,20,16,.40)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
} satisfies Config`}</Code>

      <div style={{fontFamily:'Newsreader, Georgia, serif', fontWeight:700, fontSize:18, color:'#1a1410', marginTop:8}}>app/globals.css — CSS variables</div>
      <Code>{`@layer base {
  :root {
    --background: 39 38% 92%;     /* #f4ede0 paper */
    --foreground: 22 22% 8%;      /* #1a1410 ink */
    --card: 41 50% 95%;           /* #fbf6ea */
    --card-foreground: 22 22% 8%;
    --popover: 41 50% 95%;
    --popover-foreground: 22 22% 8%;
    --primary: 22 22% 8%;         /* ink button background */
    --primary-foreground: 39 38% 92%;
    --secondary: 38 28% 86%;
    --secondary-foreground: 22 22% 8%;
    --muted: 38 28% 86%;
    --muted-foreground: 30 12% 31%;
    --accent: 8 76% 41%;          /* #b7301b scarlet */
    --accent-foreground: 0 0% 100%;
    --destructive: 8 88% 33%;
    --destructive-foreground: 0 0% 100%;
    --success: 105 38% 30%;
    --warning: 36 84% 35%;
    --border: 39 32% 78%;
    --input:  39 32% 78%;
    --ring:   8 76% 41%;
    --radius: 14px;
  }
  .dark {
    --background: 28 28% 7%;      /* #16110d */
    --foreground: 40 60% 90%;
    --card: 27 32% 11%;
    --card-foreground: 40 60% 90%;
    --popover: 27 32% 11%;
    --popover-foreground: 40 60% 90%;
    --primary: 40 60% 90%;
    --primary-foreground: 22 22% 8%;
    --secondary: 27 22% 16%;
    --secondary-foreground: 40 60% 90%;
    --muted: 27 22% 16%;
    --muted-foreground: 32 14% 65%;
    --accent: 12 78% 57%;          /* #e8553b */
    --accent-foreground: 0 0% 100%;
    --destructive: 12 78% 57%;
    --destructive-foreground: 0 0% 100%;
    --success: 95 27% 53%;
    --warning: 36 65% 57%;
    --border: 28 24% 18%;
    --input:  28 24% 18%;
    --ring:   12 78% 57%;
  }
}`}</Code>

      <div style={{fontFamily:'Newsreader, Georgia, serif', fontWeight:700, fontSize:18, color:'#1a1410'}}>components.json — shadcn-Patch</div>
      <Code>{`{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "stone",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}`}</Code>

      <div style={{fontFamily:'Newsreader, Georgia, serif', fontWeight:700, fontSize:18, color:'#1a1410'}}>shadcn-Primitive (MVP)</div>
      <ul style={{fontFamily:'Inter', fontSize:12.5, color:'#1a1410', lineHeight:1.7, columns:2, columnGap:24}}>
        <li>Card</li><li>Button</li><li>Badge</li><li>Tabs</li>
        <li>Sheet</li><li>Dialog</li><li>ScrollArea</li><li>Toast</li>
        <li>Skeleton</li><li>Slider</li><li>Switch</li><li>Toggle</li>
        <li>DropdownMenu</li><li>Tooltip</li><li>Avatar</li><li>Progress</li>
        <li>Separator</li>
      </ul>

      <div style={{fontFamily:'Newsreader, Georgia, serif', fontWeight:700, fontSize:18, color:'#1a1410', marginTop:6}}>Eigene Komposita</div>
      <ul style={{fontFamily:'Inter', fontSize:12.5, color:'#1a1410', lineHeight:1.7, columns:2, columnGap:24}}>
        <li><code>PlayerCard</code> — Card + StrengthBar + TalentStars + PosPill</li>
        <li><code>InboxCard</code> — Card + ToneBadge + PillActions</li>
        <li><code>MatchEvent</code> — minute + glyph + serif headline + sub</li>
        <li><code>StatStrip</code> — gegenüberliegende Werte mit Akzentseite</li>
        <li><code>HubTile</code> — Card mit Icon + Label + Subtitle + Flag-Zeile</li>
        <li><code>LevyChip</code> — persistent sichtbare Verbandsabgabe</li>
        <li><code>FormStrip</code> — 5×SNU mit Glyph + Farbe (nie nur Farbe)</li>
        <li><code>CrestSVG</code> — shape + tinctures + charge, deterministisch</li>
        <li><code>StadiumPlot</code> — isometrische Anlage mit Slot-Pins</li>
        <li><code>FormationPitch</code> — 4-3-3 etc. als kompaktes Diagramm</li>
        <li><code>AdvanceButton</code> — "Weiter zum nächsten Termin" mit Tagesoffset</li>
      </ul>
    </div>
  );
}

Object.assign(window, {
  WordmarkA, PwaIconA,
  SamplePlayerCard, SampleInboxCard,
  CrestGrammar, TokensPanel
});
