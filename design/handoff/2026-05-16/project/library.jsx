// library.jsx — visual component library.
// One artboard per category, each containing component cards.
// LibraryCard renders the standard card frame; specs live in COMPONENTS.md.

const LIB_BG = '#f0eee9';
const LIB_PAPER = '#fbf6ea';
const LIB_RULE = '#d9cdb4';
const LIB_INK = '#1a1410';
const LIB_MUTE = '#5a4f44';
const LIB_SOFT = '#7a6f63';
const LIB_ACCENT = '#b7301b';

function LibraryCard({name, file, signature, note, children}){
  return (
    <div style={{
      background: LIB_PAPER, border:`1px solid ${LIB_RULE}`, borderRadius:14,
      padding:'16px 18px 18px',
      display:'flex', flexDirection:'column', gap:10,
      fontFamily:'Inter, system-ui, sans-serif',
      breakInside:'avoid'
    }}>
      <header style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:8}}>
        <span style={{fontFamily:'"JetBrains Mono", monospace', fontSize:14, fontWeight:800, color:LIB_INK, letterSpacing:.2}}>{name}</span>
        <span style={{fontFamily:'"JetBrains Mono", monospace', fontSize:10, color:LIB_SOFT, fontWeight:600}}>{file}</span>
      </header>
      {signature && (
        <code style={{
          display:'block', fontFamily:'"JetBrains Mono", monospace', fontSize:10.5,
          color:LIB_INK, background:'#ece2cf', borderRadius:6,
          padding:'7px 9px', lineHeight:1.4, whiteSpace:'pre-wrap', wordBreak:'break-word'
        }}>{signature}</code>
      )}
      <div style={{
        display:'flex', flexWrap:'wrap', gap:14, alignItems:'flex-start',
        padding:'8px 0 4px', borderTop:`1px dashed ${LIB_RULE}`
      }}>
        {children}
      </div>
      {note && (
        <p style={{fontFamily:'Newsreader, Georgia, serif', fontStyle:'italic', fontSize:12, color:LIB_MUTE, margin:0, lineHeight:1.4}}>{note}</p>
      )}
    </div>
  );
}
function LibrarySection({title, subtitle, cols=3, children}){
  return (
    <div style={{padding:'24px 28px 32px', background:LIB_BG}}>
      <div style={{borderBottom:`1.5px solid ${LIB_INK}`, paddingBottom:8, marginBottom:18}}>
        <div style={{fontSize:11, fontWeight:800, color:LIB_ACCENT, letterSpacing:1.4}}>KOMPONENTEN · KATEGORIE</div>
        <h1 style={{fontFamily:'Newsreader, Georgia, serif', fontSize:32, fontWeight:800, color:LIB_INK, margin:'4px 0 0', lineHeight:1.05}}>{title}</h1>
        {subtitle && <p style={{fontFamily:'Newsreader, Georgia, serif', fontStyle:'italic', fontSize:14, color:LIB_MUTE, margin:'6px 0 0', lineHeight:1.4}}>{subtitle}</p>}
      </div>
      <div style={{display:'grid', gridTemplateColumns:`repeat(${cols}, 1fr)`, gap:14}}>
        {children}
      </div>
    </div>
  );
}
// Side-by-side variant slot — small label + the rendered component
function V({label, children}){
  return (
    <div style={{display:'flex', flexDirection:'column', gap:5, alignItems:'flex-start'}}>
      {label && <span style={{fontSize:9, color:LIB_SOFT, fontWeight:700, letterSpacing:.5, textTransform:'uppercase', fontFamily:'Inter'}}>{label}</span>
      }
      <div>{children}</div>
    </div>
  );
}
// Wrapper to provide theme-local CSS variables for inner components
// (so things like ThemeCss inside them don't blow away the page bg)
function ThemeSlot({theme='A', scheme='light', bg, padding='10px 12px', children, width}){
  const t = THEMES[theme][scheme];
  return (
    <div style={{
      background: bg ?? t.bg, color: t.ink,
      borderRadius:10, padding,
      border:`1px solid ${LIB_RULE}`,
      width: width ?? 'auto', minWidth: width ?? 'auto',
      fontFamily: THEMES[theme].ui,
      position:'relative'
    }}>
      <style>{`.lib-themeslot-${theme}-${scheme}{${Object.entries(t).map(([k,v])=>`--${k}:${v};`).join('')}}`}</style>
      <div className={`lib-themeslot-${theme}-${scheme}`}>{children}</div>
    </div>
  );
}

// =================================================================
// L1 — MARKEN-ATOME
// =================================================================
function LibBrand(){
  return (
    <LibrarySection title="Marken-Atome" subtitle="Identität — Wappen, Porträts, Wortmarken." cols={2}>
      <LibraryCard name="Crest"
        file="ui.jsx"
        signature={`<Crest shape="heater" a="#0e3a5f" b="#c8a45a"
       charge="ship" size={56}/>`}
        note="Aus CLUB_REGISTRY ziehen: crestFor('FC Hafenstadt'). Vier Schild­formen × beliebige Tinkturen × 10 Wappentiere.">
        <V label="Heater"><Crest {...crestFor('FC Hafenstadt')} size={64}/></V>
        <V label="Roundel"><Crest {...crestFor('Northbridge City')} size={64}/></V>
        <V label="Gonfalon"><Crest {...crestFor('Sporting Kaltenbach')} size={64}/></V>
        <V label="Iberian"><Crest {...crestFor('Olympique Sauveterre')} size={64}/></V>
        <V label="Mit Motto"><Crest shape="heater" a="#0e3a5f" b="#c8a45a" charge="ship" motto="Per mare ad astra" size={72}/></V>
      </LibraryCard>

      <LibraryCard name="Portrait"
        file="ui.jsx"
        signature={`<Portrait name="Marek Brody" size={48}
          variant="player"/>`}
        note="Initialen-Avatar, kein Foto-Upload. variant='player' setzt einen Akzent­ring.">
        <V label="Staff · 32"><Portrait name="Werner Mertens" theme="A" scheme="light" size={32}/></V>
        <V label="Player · 48"><Portrait name="Marek Brody" theme="A" scheme="light" size={48} variant="player"/></V>
        <V label="Player · 72"><Portrait name="Élise Vannier" theme="A" scheme="light" size={72} variant="player"/></V>
        <V label="Dunkel"><ThemeSlot scheme="dark" padding="8px"><Portrait name="Kaito Furukawa" theme="A" scheme="dark" size={48} variant="player"/></ThemeSlot></V>
      </LibraryCard>

      <LibraryCard name="Wordmarks"
        file="directions.jsx"
        signature={`<WordmarkA size={28}/>
<WordmarkB size={24} ink accent/>
<WordmarkC size={24} ink accent/>`}
        note="Drei Direction-Schriftzüge. A wird empfohlen; B und C nur für Direction-Vergleich.">
        <V label="A · Sonntagszeitung"><WordmarkA size={26}/></V>
        <V label="B · Schalterhalle"><div style={{padding:'8px 10px', background:'#0a1422', borderRadius:6}}><WordmarkB size={20} ink="#e6ecf3" accent="#dcb15c"/></div></V>
        <V label="C · Hallenfunk"><div style={{padding:'8px 10px', background:'#0c0d10', borderRadius:6}}><WordmarkC size={22} ink="#eaecef" accent="#22ee8b"/></div></V>
      </LibraryCard>

      <LibraryCard name="PwaIcon"
        file="directions.jsx"
        signature={`<PwaIconA/>  <PwaIconB/>  <PwaIconC/>`}
        note="Square PWA installable icon pro Direction. 80×80, abgerundete Ecken, kein Foto.">
        <V label="A"><PwaIconA/></V>
        <V label="B"><PwaIconB/></V>
        <V label="C"><PwaIconC/></V>
      </LibraryCard>
    </LibrarySection>
  );
}

// =================================================================
// L2 — DATEN-ATOME
// =================================================================
function LibDataAtoms(){
  return (
    <LibrarySection title="Daten-Atome" subtitle="Numerische Stärke ohne FM-Tabellenwand. Glyph + Farbe + Ziffer immer doppelt codiert." cols={3}>
      <LibraryCard name="StrBar"
        file="ui.jsx"
        signature={`<StrBar n={7} max={10} w={72}
         theme="A" scheme="light"/>`}
        note="1-10-Stärke mit Ziffer + Glyphbar. Nie nur Farbe — Ziffer muss sichtbar bleiben.">
        <V label="n = 4"><StrBar n={4} theme="A" scheme="light"/></V>
        <V label="n = 7"><StrBar n={7} theme="A" scheme="light"/></V>
        <V label="n = 9"><StrBar n={9} theme="A" scheme="light"/></V>
      </LibraryCard>

      <LibraryCard name="Talent"
        file="ui.jsx"
        signature={`<Talent n={3} max={4}
          theme="A" scheme="light"/>`}
        note="Vier-Sterne-Talent. Bewusst eine Stufe gröber als FM (4 statt 5), damit Werte ablesbar bleiben.">
        <V label="1 / 4"><Talent n={1} theme="A" scheme="light"/></V>
        <V label="3 / 4"><Talent n={3} theme="A" scheme="light"/></V>
        <V label="4 / 4 · Top-Talent"><Talent n={4} theme="A" scheme="light"/></V>
      </LibraryCard>

      <LibraryCard name="FormStrip"
        file="ui.jsx"
        signature={`<FormStrip form="SSUNS"
          theme="A" scheme="light"/>`}
        note="Fünf farbig-glyph-codierte Form-Kacheln. Buchstabe S/U/N muss sichtbar sein (Pflicht WCAG).">
        <V label="Top-Form"><FormStrip form="SSSSS" theme="A" scheme="light"/></V>
        <V label="Gemischt"><FormStrip form="SUNSU" theme="A" scheme="light"/></V>
        <V label="Krise"><FormStrip form="NNUNN" theme="A" scheme="light"/></V>
      </LibraryCard>

      <LibraryCard name="PosPill"
        file="ui.jsx"
        signature={`<PosPill pos="OM"
         theme="A" scheme="light"/>`}
        note="Sechs Positionen mit semantischer Farbe. TW=orange, IV/AV=grün, DM/ZM=blau, OM=lila, ST=scharlach.">
        <V label="TW"><PosPill pos="TW" theme="A" scheme="light"/></V>
        <V label="IV"><PosPill pos="IV" theme="A" scheme="light"/></V>
        <V label="ZM"><PosPill pos="ZM" theme="A" scheme="light"/></V>
        <V label="OM"><PosPill pos="OM" theme="A" scheme="light"/></V>
        <V label="ST"><PosPill pos="ST" theme="A" scheme="light"/></V>
      </LibraryCard>

      <LibraryCard name="Sparkline"
        file="tactics.jsx"
        signature={`<Sparkline
   data={[320,410,...,632]}
   theme="A" scheme="light"/>`}
        note="Inline-Linie + 12 %-Fläche. Letzter Punkt fett. Kein Achsen­schmuck, kein Tooltip — Daten unten lesbar.">
        <V label="12 Monate Saldo"><div style={{width:240, padding:'4px 6px', background:LIB_PAPER, borderRadius:8, border:`1px solid ${LIB_RULE}`}}><Sparkline data={[320,410,285,480,510,420,540,360,410,580,620,632]} theme="A" scheme="light"/></div></V>
      </LibraryCard>

      <LibraryCard name="BreakBar"
        file="tactics.jsx"
        signature={`<BreakBar rows={[
  {l:'Sponsoring', v:43, c:accent},
  {l:'TV-Gelder',  v:27, c:ok}, ...
]}/>`}
        note="Gestapelter Horizontal-Balken + Legend-Grid. Summe muss 100 ergeben.">
        <V><div style={{width:280}}>
          <BreakBar theme="A" scheme="light" rows={[
            {l:'Sponsoring',v:43,c:LIB_ACCENT},
            {l:'TV-Gelder',v:27,c:'#3f6a2f'},
            {l:'Ticketing',v:24,c:'#a3680f'},
            {l:'Fanartikel',v:6,c:'#7a6f63'},
          ]}/>
        </div></V>
      </LibraryCard>

      <LibraryCard name="LiveXgStrip"
        file="live-demo.jsx"
        signature={`<LiveXgStrip a={1.1} b={1.8}
  aLabel="NBC" bLabel="FCH"
  points={[{min,a,b},...]}/>`}
        note="Live-xG unter dem Score. Akzent = Heim, Mute = Gast. Gestrichelte Halbzeit-Linie bei 45'.">
        <V><div style={{width:300, padding:8, background:LIB_PAPER, borderRadius:8, border:`1px solid ${LIB_RULE}`}}>
          <LiveXgStrip theme="A" scheme="light" a={1.1} b={1.8} aLabel="NBC" bLabel="FCH" points={[
            {min:1,a:0,b:0},{min:12,a:0,b:.2},{min:24,a:.3,b:.5},{min:34,a:.4,b:.9},{min:45,a:.5,b:1.0},
            {min:58,a:1.0,b:1.0},{min:71,a:1.0,b:1.4},{min:82,a:1.0,b:1.7},{min:90,a:1.1,b:1.8}
          ]}/>
        </div></V>
      </LibraryCard>
    </LibrarySection>
  );
}

// =================================================================
// L3 — CHIPS & PILLS
// =================================================================
function LibChips(){
  return (
    <LibrarySection title="Chips & Pills" subtitle="Status, Aktion und Vorhersage als runde Hinweise." cols={3}>
      <LibraryCard name="PillBtn"
        file="ui.jsx"
        signature={`<PillBtn intent="accept"
  icon={<Check/>} theme scheme>
  Annehmen
</PillBtn>`}
        note="Inbox-Aktion. 36 px hoch, ≥ 44 px Tap-Hit. Vier Intents.">
        <V label="Accept"><PillBtn theme="A" scheme="light" intent="accept" icon={<I.Check size={13} color="#fff"/>}>Annehmen</PillBtn></V>
        <V label="Neutral"><PillBtn theme="A" scheme="light" intent="neutral" icon={<I.X size={13} color={LIB_INK}/>}>Ablehnen</PillBtn></V>
        <V label="Soft"><PillBtn theme="A" scheme="light" intent="soft" icon={<I.Clock size={13} color={LIB_INK}/>}>Vertagen</PillBtn></V>
      </LibraryCard>

      <LibraryCard name="LevyChip"
        file="ui.jsx"
        signature={`<LevyChip theme="A" scheme="light"/>`}
        note="Persistent in Finanzen + Hub. Erinnert den Spieler an die Verbandsabgabe.">
        <V><LevyChip theme="A" scheme="light"/></V>
      </LibraryCard>

      <LibraryCard name="TraitPill"
        file="team.jsx"
        signature={`<TraitPill label="Anführer"
          tone="accent"/>`}
        note="Persönlichkeit. Vier Töne: accent, ok, warn, neutral. Bullet links als Glyph.">
        <V label="Accent"><TraitPill theme="A" scheme="light" label="Anführer" tone="accent"/></V>
        <V label="Ok"><TraitPill theme="A" scheme="light" label="Heimkind" tone="ok"/></V>
        <V label="Warn"><TraitPill theme="A" scheme="light" label="Druckanfällig" tone="warn"/></V>
      </LibraryCard>

      <LibraryCard name="OutcomeChip"
        file="depth.jsx"
        signature={`<OutcomeChip who="Vorstand"
          d={+2}/>`}
        note="Pressekonferenz-Vorhersage. d ∈ [-2..+2]. Glyph wiederholt sich für Intensität.">
        <V label="+2"><OutcomeChip theme="A" scheme="light" who="Vorstand" d={2}/></V>
        <V label="±0"><OutcomeChip theme="A" scheme="light" who="Fans" d={0}/></V>
        <V label="-1"><OutcomeChip theme="A" scheme="light" who="Sponsor" d={-1}/></V>
      </LibraryCard>

      <LibraryCard name="OfferChip"
        file="depth.jsx"
        signature={`<OfferChip k="Ablöse"
          v="2,3 Mio. €" dark/>`}
        note="Transfer-Angebot-Bestandteil im Mono. `dark` invertiert für eigene Bubble.">
        <V label="Light"><OfferChip theme="A" scheme="light" k="Ablöse" v="2,3 Mio. €"/></V>
        <V label="Dark"><div style={{padding:'6px 8px', background:LIB_INK, borderRadius:8}}><OfferChip theme="A" scheme="light" k="Klausel" v="6 Mio. €" dark/></div></V>
      </LibraryCard>

      <LibraryCard name="Kpi · Stat · Sum"
        file="tactics.jsx, depth-data.jsx"
        signature={`<Kpi k="Punkte" v="62" trend="↑ 1"/>
<Stat k="Tore" v={9} accent tile/>
<Sum k="Profispiele" v="113"/>`}
        note="Drei Größen für Daten-Tiles. Alle zeigen Wert in Mono.">
        <V label="Kpi"><div style={{width:130}}><Kpi theme="A" scheme="light" k="Tabellenplatz" v="2." trend="↑ 1"/></div></V>
        <V label="Stat tile"><Stat theme="A" scheme="light" k="Tore" v={14} accent tile/></V>
        <V label="Sum"><Sum theme="A" scheme="light" k="Profispiele" v="113"/></V>
      </LibraryCard>
    </LibrarySection>
  );
}

// =================================================================
// L4 — EINGABE
// =================================================================
function LibInputs(){
  const [v1,setV1]=React.useState(64);
  const [v2,setV2]=React.useState(2_300_000);
  const [seg,setSeg]=React.useState('mittel');
  const [tog,setTog]=React.useState(true);
  return (
    <LibrarySection title="Eingabe" subtitle="Slider, Segments, Switches. Keine Dropdown-Sümpfe." cols={2}>
      <LibraryCard name="TSlider"
        file="tactics.jsx"
        signature={`<TSlider label="Tempo"
  value={64} onChange leftL rightL
  hint="ausgewogen" mid={false}/>`}
        note="Taktik-Slider. Werte 0-100. `mid` setzt einen Mittelstrich für ±-Bereiche.">
        <V><div style={{width:360, padding:'0 14px', background:LIB_PAPER, borderRadius:10, border:`1px solid ${LIB_RULE}`}}>
          <TSlider theme="A" scheme="light" label="Tempo im Angriff" value={v1} onChange={setV1} leftL="kontrolliert" rightL="direkt" hint={v1>70?'sehr direkt':v1>40?'ausgewogen':'kontrolliert'}/>
        </div></V>
      </LibraryCard>

      <LibraryCard name="Seg"
        file="tactics.jsx"
        signature={`<Seg label="Pressing"
  value={seg} onChange={setSeg}
  opts={[{id,l},...]}/>`}
        note="Segmented Control für 2-4 Optionen. Bei mehr → Dropdown.">
        <V><div style={{width:360, padding:'0 14px', background:LIB_PAPER, borderRadius:10, border:`1px solid ${LIB_RULE}`}}>
          <Seg theme="A" scheme="light" label="Pressing-Auslöser" value={seg} onChange={setSeg}
            opts={[{id:'gegner',l:'Gegnerhälfte'},{id:'mittel',l:'Mittellinie'},{id:'eigen',l:'Eigenhälfte'}]}/>
        </div></V>
      </LibraryCard>

      <LibraryCard name="TacticToggle"
        file="tactics.jsx"
        signature={`<TacticToggle
  label="Abseitsfalle"
  on={true} onChange
  hint="nur mit hoher Linie"/>`}
        note="iOS-Switch mit Erklärungs­zeile. Pflicht für binäre Hebel.">
        <V><div style={{width:360, padding:'0 14px', background:LIB_PAPER, borderRadius:10, border:`1px solid ${LIB_RULE}`}}>
          <TacticToggle theme="A" scheme="light" label="Abseitsfalle" on={tog} onChange={setTog} hint="Funktioniert nur mit hoher Linie und Konzentration"/>
        </div></V>
      </LibraryCard>

      <LibraryCard name="Lever"
        file="depth.jsx"
        signature={`<Lever label="Ablöse"
  value={2_300_000}
  min={1_000_000} max={4_000_000}
  step={100_000} onChange/>`}
        note="Slider mit Euro-Wert direkt im Header. Native-Range-Input für A11y.">
        <V><div style={{width:360, padding:'12px 14px', background:LIB_PAPER, borderRadius:10, border:`1px solid ${LIB_RULE}`}}>
          <Lever theme="A" scheme="light" label="Ablöse" value={v2} onChange={setV2} min={1_000_000} max={4_000_000} step={100_000} last/>
        </div></V>
      </LibraryCard>
    </LibrarySection>
  );
}

// =================================================================
// L5 — KARTEN-COMPOSITES
// =================================================================
function LibCards(){
  return (
    <LibrarySection title="Karten-Composites" subtitle="Aus Atomen gebaut. Liste der Composites, die in mehreren Screens auftauchen — empfohlen für die Engineering-Extraktion." cols={2}>
      <LibraryCard name="PlayerCard"
        file="screens-part1.jsx"
        signature={`<PlayerCard p={{
  n, pos, age, str, tal, form,
  contract, nat, shirt
}}/>`}
        note="Voll­ständige Spielerkarte. Nutzt PosPill, StrBar, Talent. Vertragsdatum bekommt einen scharlach­roten Punkt, wenn auslaufend.">
        <V label="Stammspieler"><div style={{width:380}}><PlayerCard theme="A" scheme="light" p={SQUAD[8]}/></div></V>
        <V label="Vertrag läuft aus"><div style={{width:380}}><PlayerCard theme="A" scheme="light" p={SQUAD[5]}/></div></V>
        <V label="Junges Talent"><div style={{width:380}}><PlayerCard theme="A" scheme="light" p={SQUAD[3]}/></div></V>
      </LibraryCard>

      <LibraryCard name="InboxCard (inline)"
        file="screens-part1.jsx"
        signature={`{tone, from, title, body, time,
 actions: PillBtnProps[]}`}
        note="Aktuell als Inline-Markup. Empfohlen für Extraktion zu eigenständigem Composite. Fünf Tones: board · media · sponsor · scout · fan.">
        <V><div style={{width:380, background:'#fbf6ea', border:`1px solid ${LIB_RULE}`, borderRadius:14, padding:12}}>
          <div style={{display:'flex',gap:10,alignItems:'flex-start'}}>
            <div style={{width:36,height:36,borderRadius:10,background:'#f6dcd5',color:LIB_ACCENT,display:'grid',placeItems:'center',fontWeight:800,fontSize:16,fontFamily:'Newsreader'}}>§</div>
            <div style={{flex:1, minWidth:0}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
                <span style={{fontSize:11, fontWeight:700, color:LIB_ACCENT, letterSpacing:.3, textTransform:'uppercase'}}>Vorstand · von Heimann</span>
                <span style={{fontSize:10, color:LIB_SOFT}}>08:14</span>
              </div>
              <div style={{fontFamily:'Newsreader', fontSize:17, fontWeight:700, color:LIB_INK, lineHeight:1.2, marginTop:2}}>Drei Punkte — oder es wird ungemütlich.</div>
              <div style={{fontSize:13, color:LIB_MUTE, marginTop:4, lineHeight:1.35}}>„Wir erwarten am Sonntag in Northbridge einen Sieg."</div>
            </div>
          </div>
          <div style={{display:'flex', gap:6, marginTop:10}}>
            <PillBtn theme="A" scheme="light" intent="accept" icon={<I.Check size={14} color="#fff"/>}>Annehmen</PillBtn>
            <PillBtn theme="A" scheme="light" intent="soft" icon={<I.Clock size={13} color={LIB_INK}/>}>Vertagen</PillBtn>
            <PillBtn theme="A" scheme="light" intent="neutral" icon={<I.X size={13} color={LIB_INK}/>}>Ablehnen</PillBtn>
          </div>
        </div></V>
      </LibraryCard>

      <LibraryCard name="HubTile (inline)"
        file="screens-part1.jsx"
        signature={`{icon, label, sub, flag?}`}
        note="Hub-Kachel mit Icon-Box, Titel, Untertitel und optionaler scharlach­roter Flag-Zeile am Boden.">
        <V><div style={{width:160, background:'#fbf6ea', border:`1px solid ${LIB_RULE}`, borderRadius:14, padding:12, minHeight:96, display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <div style={{width:32,height:32,borderRadius:10,background:'#ece2cf',display:'grid',placeItems:'center'}}><I.Wallet size={20} color={LIB_INK}/></div>
            <I.ChevronRight size={14} color={LIB_SOFT}/>
          </div>
          <div>
            <div style={{fontSize:13, fontWeight:700, color:LIB_INK, lineHeight:1.15}}>Finanzen</div>
            <div style={{fontSize:11, color:LIB_MUTE, marginTop:2}}>+ 632.000 € / Monat</div>
            <div style={{fontSize:10, color:LIB_ACCENT, marginTop:4, fontWeight:600}}>· Verbandsabgabe fällig</div>
          </div>
        </div></V>
      </LibraryCard>

      <LibraryCard name="MatchEvent (inline)"
        file="screens-part2.jsx"
        signature={`{min, kind, t, s, score?}`}
        note="kind ∈ goal · card · sub · chance · set · whistle. In drei Screens dupliziert — Extraktion empfohlen.">
        <V><div style={{width:340, background:'#fbf6ea', border:`1px solid ${LIB_RULE}`, borderRadius:10, padding:'8px 12px'}}>
          <div style={{display:'flex', gap:10, alignItems:'flex-start'}}>
            <div style={{flex:'0 0 44px', textAlign:'right'}}>
              <div style={{fontFamily:'JetBrains Mono', fontSize:11, fontWeight:700, color:LIB_MUTE}}>82'</div>
              <div style={{fontFamily:'JetBrains Mono', fontSize:10, fontWeight:700, color:LIB_ACCENT, marginTop:2}}>2:1</div>
            </div>
            <div style={{flex:'0 0 22px', display:'flex', alignItems:'center'}}>
              <span style={{display:'inline-block', width:22, height:22, borderRadius:6, background:LIB_ACCENT+'22', color:LIB_ACCENT, fontWeight:800, fontSize:11, textAlign:'center', lineHeight:'22px'}}>⚽</span>
            </div>
            <div style={{flex:1}}>
              <div style={{fontFamily:'Newsreader', fontSize:17, fontWeight:800, color:LIB_ACCENT, lineHeight:1.15}}>TOR! Brody (Hafenstadt)</div>
              <div style={{fontFamily:'Newsreader', fontSize:12, color:LIB_MUTE, marginTop:1}}>Volley aus 14 Metern, unhaltbar.</div>
            </div>
          </div>
        </div></V>
      </LibraryCard>

      <LibraryCard name="Workload"
        file="team.jsx"
        signature={`<Workload label="Erschöpfung"
  value={62} note="leicht erhöht"/>`}
        note="Belastungsbalken. Ampel: ≥70 rot, ≥50 gelb, sonst grün.">
        <V><div style={{width:340, padding:'10px 14px', background:'#fbf6ea', border:`1px solid ${LIB_RULE}`, borderRadius:10}}>
          <Workload theme="A" scheme="light" label="Mannschaftserschöpfung" value={62} note="leicht erhöht — eine Einheit lockerer planen"/>
        </div></V>
      </LibraryCard>

      <LibraryCard name="ArcEvent"
        file="depth-data.jsx"
        signature={`<ArcEvent e={{
  kind:'transfer', y:2024, ...
}}/>`}
        note="Karrierebogen-Marker plus Karte. Fünf Event-Typen: season · transfer · injury · award · debut.">
        <V><div style={{width:340, position:'relative', paddingLeft:24, background:LIB_BG, borderRadius:10, padding:'10px 14px 10px 30px'}}>
          <div style={{position:'absolute', left:14, top:6, bottom:6, width:2, background:LIB_RULE, borderRadius:99}}/>
          <ArcEvent theme="A" scheme="light" e={{kind:'transfer', y:2024, from:'Riverdale Athletic', to:'FC Hafenstadt', fee:'4,2 Mio. €', note:'Wechselt für eine Rekordablöse.'}}/>
        </div></V>
      </LibraryCard>
    </LibrarySection>
  );
}

// =================================================================
// L6 — SPIELFELD & STADION
// =================================================================
function LibPitch(){
  const exampleStand = STANDS[0];
  return (
    <LibrarySection title="Spielfeld & Stadion" subtitle="Eigene SVG-Vokabel. Niemals lucide-Icon für Tribünen-Glyphen verwenden." cols={2}>
      <LibraryCard name="FormationPitch"
        file="ui.jsx"
        signature={`<FormationPitch formation="4-3-3"
       theme="A" scheme="light"/>`}
        note="Vertikales Spielfeld mit 11 Knoten. Fünf Formationen vorgegeben — Custom über prop ergänzbar.">
        <V label="4-3-3"><div style={{width:140}}><FormationPitch theme="A" scheme="light" formation="4-3-3"/></div></V>
        <V label="4-2-3-1"><div style={{width:140}}><FormationPitch theme="A" scheme="light" formation="4-2-3-1"/></div></V>
        <V label="3-5-2"><div style={{width:140}}><FormationPitch theme="A" scheme="light" formation="3-5-2"/></div></V>
      </LibraryCard>

      <LibraryCard name="StadiumPlot"
        file="ui.jsx"
        signature={`<StadiumPlot
   theme="A" scheme="light"/>`}
        note="Top-down Stadion­plan mit benannten Blöcken (N/O/S/W), Flutlicht­masten an den Ecken, Slot-Pins für Anbauten.">
        <V><div style={{width:360, padding:8, background:'#fbf6ea', border:`1px solid ${LIB_RULE}`, borderRadius:10}}><StadiumPlot theme="A" scheme="light"/></div></V>
      </LibraryCard>

      <LibraryCard name="StandSideView"
        file="stadium.jsx"
        signature={`<StandSideView stand={{
  id, cap, seats, standing, vip,
  roof, rows, blocks, ...
}}/>`}
        note="Tribünen-Seitenansicht. Rasenheizung, treppenförmige Ränge, Dach-Variante, VIP-Logen, Flutlichtmast.">
        <V><div style={{width:340, padding:8, background:'#fbf6ea', border:`1px solid ${LIB_RULE}`, borderRadius:10}}><StandSideView stand={exampleStand} theme="A" scheme="light"/></div></V>
      </LibraryCard>

      <LibraryCard name="StadiumTypePlan"
        file="stadium.jsx"
        signature={`<StadiumTypePlan type={{
  id:'standard', ...
}}/>`}
        note="Mini-Plan für den Stadiontyp-Pfad: Dorfplatz → Klubgarten → Standard → Hufeisen → Arena.">
        <div style={{display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:6, width:'100%'}}>
          {STADIUM_TYPES.map(tp=>(
            <V key={tp.id} label={tp.name}><div style={{background:'#fbf6ea', border:`1px solid ${LIB_RULE}`, borderRadius:8, overflow:'hidden'}}><StadiumTypePlan type={tp} theme="A" scheme="light"/></div></V>
          ))}
        </div>
      </LibraryCard>

      <LibraryCard name="Glyphen"
        file="stadium.jsx"
        signature={`<GlyphRoof/> <GlyphSeat/>
<GlyphStand/> <GlyphFloodlight/>
<GlyphHeating/> <GlyphVIP/>`}
        note="Bespoke SVG-Glyphen für die Stadion-UI. Wenn lucide nicht hinreichend ist, hier ergänzen — nie auf lucide-Override gehen.">
        <V label="Dach voll"><GlyphRoof size={28} color={LIB_INK}/></V>
        <V label="Dach teilw."><GlyphRoofPartial size={28} color={LIB_INK}/></V>
        <V label="Dach offen"><GlyphRoofOpen size={28} color={LIB_INK}/></V>
        <V label="Sitz"><GlyphSeat size={28} color={LIB_INK}/></V>
        <V label="Steh"><GlyphStand size={28} color={LIB_INK}/></V>
        <V label="VIP"><GlyphVIP size={28} color={LIB_INK}/></V>
        <V label="Flutlicht"><GlyphFloodlight size={28} color={'#a3680f'}/></V>
        <V label="Heizung"><GlyphHeating size={28} color={LIB_ACCENT}/></V>
      </LibraryCard>

      <LibraryCard name="MiniPitch · MoodFace"
        file="ui.jsx, ui.jsx"
        signature={`<MiniPitch size={22}/>
<MoodFace mood={1} size={32}/>`}
        note="Kleine, hochfrequente Glyphen. MiniPitch für Standards im Match-Feed; MoodFace für Stab/Spieler-Stimmung.">
        <V label="MiniPitch"><MiniPitch size={26} color={LIB_INK}/></V>
        <V label="Mood +1"><MoodFace mood={1} size={32} theme="A" scheme="light"/></V>
        <V label="Mood 0"><MoodFace mood={0} size={32} theme="A" scheme="light"/></V>
        <V label="Mood -1"><MoodFace mood={-1} size={32} theme="A" scheme="light"/></V>
      </LibraryCard>
    </LibrarySection>
  );
}

// =================================================================
// L7 — STATISTIK & DATEN
// =================================================================
function LibStats(){
  return (
    <LibrarySection title="Statistik & Daten" subtitle="Zwei Datendichten gleichberechtigt: kompakt (1-10) und Profi (1-20)." cols={2}>
      <LibraryCard name="AttrBar"
        file="team.jsx"
        signature={`<AttrBar label="Spielaufbau"
  value={8.4} max={10}
  hint="liest das Mittelfeld"
  accentHi/>`}
        note="Kompakte 1-10-Attribut­zeile mit Ziffer + Glyphbar. Optionaler italic-Hinweis darunter.">
        <V><div style={{width:340, padding:'0 14px', background:'#fbf6ea', border:`1px solid ${LIB_RULE}`, borderRadius:10}}>
          <AttrBar theme="A" scheme="light" label="Spielaufbau" value={8.4} hint="liest das Mittelfeld"/>
          <AttrBar theme="A" scheme="light" label="Abschluss" value={8.1}/>
          <AttrBar theme="A" scheme="light" label="Defensive" value={4.5} hint="arbeitet selten zurück"/>
        </div></V>
      </LibraryCard>

      <LibraryCard name="Attr20"
        file="compare.jsx"
        signature={`<Attr20 label="Übersicht"
   value={18}/>`}
        note="Profi-Modus, 1-20. Vier Farb­stufen: <9 rot · <13 orange · <17 ink · ≥17 grün.">
        <V><div style={{width:340, padding:'4px 12px', background:'#fbf6ea', border:`1px solid ${LIB_RULE}`, borderRadius:10}}>
          <Attr20 theme="A" scheme="light" label="Übersicht" value={18}/>
          <Attr20 theme="A" scheme="light" label="Passspiel" value={17}/>
          <Attr20 theme="A" scheme="light" label="Geschwindigkeit" value={14}/>
          <Attr20 theme="A" scheme="light" label="Aggression" value={9}/>
          <Attr20 theme="A" scheme="light" label="Kopfball" value={6} last/>
        </div></V>
      </LibraryCard>

      <LibraryCard name="TeamRadar"
        file="compare.jsx"
        signature={`<TeamRadar
   theme="A" scheme="light"/>`}
        note="6-Achsen-Radar. Aktuell auf zwei feste Datensätze hartkodiert — Refactor zu `data:{a,b}` empfohlen.">
        <V><TeamRadar theme="A" scheme="light"/></V>
      </LibraryCard>

      <LibraryCard name="CapacityBar"
        file="stadium.jsx"
        signature={`<CapacityBar stand={STANDS[0]}/>`}
        note="Tribünen-Kapazitäts-Aufteilung in Steh/Sitz/VIP. Glyph + Anzahl unter dem Balken.">
        <V><div style={{width:340, padding:'12px 14px', background:'#fbf6ea', border:`1px solid ${LIB_RULE}`, borderRadius:10}}>
          <CapacityBar stand={STANDS[0]} theme="A" scheme="light"/>
        </div></V>
      </LibraryCard>
    </LibrarySection>
  );
}

Object.assign(window, {
  LibraryCard, LibrarySection, LibBrand, LibDataAtoms, LibChips,
  LibInputs, LibCards, LibPitch, LibStats, V,
});
