// settings.jsx — single settings screen (per brief: "one summary settings screen is enough")

function ScreenSettings({theme, scheme}){
  const t = THEMES[theme][scheme];
  const Row = ({glyph, k, v, sub, last, onClick}) => (
    <button onClick={onClick} style={{
      width:'100%', display:'flex', alignItems:'center', gap:10,
      padding:'12px 0', background:'transparent',
      border:'none', borderBottom: last?'none':`1px solid ${t.rule}`,
      cursor:'pointer', fontFamily:'inherit', textAlign:'left'
    }}>
      {glyph && <div style={{width:32, height:32, borderRadius:8, background:t.bgInk, display:'grid', placeItems:'center', flex:'0 0 32px'}}>{glyph}</div>}
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontSize:13, fontWeight:700, color:t.ink}}>{k}</div>
        {sub && <div style={{fontSize:11, color:t.inkSoft, marginTop:2}}>{sub}</div>}
      </div>
      <span style={{fontSize:12, color:t.inkMute, fontWeight:600, fontFamily:'JetBrains Mono'}}>{v}</span>
      <I.ChevronRight size={14} color={t.inkSoft}/>
    </button>
  );
  const Toggle = ({k, sub, on, last}) => (
    <div style={{display:'flex', alignItems:'center', gap:10, padding:'12px 0', borderBottom: last?'none':`1px solid ${t.rule}`}}>
      <div style={{flex:1}}>
        <div style={{fontSize:13, fontWeight:700, color:t.ink}}>{k}</div>
        {sub && <div style={{fontSize:11, color:t.inkSoft, marginTop:2}}>{sub}</div>}
      </div>
      <div style={{width:42, height:24, borderRadius:99, background: on ? t.accent : t.bgInk, position:'relative'}}>
        <span style={{position:'absolute', top:2, left: on ? 20 : 2, width:20, height:20, borderRadius:99, background:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,.2)'}}/>
      </div>
    </div>
  );
  const Group = ({l, children}) => (
    <div style={{marginBottom:14}}>
      <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', padding:'2px 4px 6px'}}>{l}</div>
      <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'0 14px'}}>{children}</div>
    </div>
  );

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{padding:'4px 16px 8px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.ChevronLeft color={t.ink} size={18}/></button>
          <SerifH theme={theme} style={{fontSize:18, fontWeight:700, color:t.ink}}>Einstellungen</SerifH>
          <div style={{width:36}}></div>
        </div>
      </header>

      <div style={{flex:1, overflowY:'auto', padding:'8px 16px 20px'}}>
        {/* Manager card */}
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'12px 14px', display:'flex', alignItems:'center', gap:12, marginBottom:14}}>
          <div style={{width:48, height:48, borderRadius:99, background:t.accentSoft, color:t.accent, display:'grid', placeItems:'center', fontFamily:THEMES[theme].font, fontWeight:800, fontSize:22, border:`2px solid ${t.accent}`}}>JL</div>
          <div style={{flex:1}}>
            <SerifH theme={theme} style={{fontSize:16, fontWeight:700, color:t.ink, lineHeight:1.05}}>Julia Lindquist</SerifH>
            <div style={{fontSize:11, color:t.inkMute, marginTop:2}}>FC Hafenstadt · Saison 2026/27</div>
          </div>
          <I.ChevronRight size={16} color={t.inkSoft}/>
        </div>

        <Group l="Spiel">
          <Row glyph={<I.Globe color={t.ink} size={16}/>}    k="Sprache"        sub="Anrede, Tonalität, Datumsformat" v="Deutsch"/>
          <Row glyph={<I.Settings color={t.ink} size={16}/>}  k="Datendichte"    sub="Kompakt oder Profi-Modus mit 1–20-Attributen" v="Kompakt"/>
          <Row glyph={<I.Calendar color={t.ink} size={16}/>}  k="Spieltempo"     sub="Tagesoffset beim ‚Weiter'-Knopf" v="3 Tage"/>
          <Row glyph={<I.Whistle color={t.ink} size={16}/>}   k="Spielreportage" sub="Standard-Tier bei neuem Spiel" v="Reportage" last/>
        </Group>

        <Group l="Darstellung">
          <Row glyph={<span style={{fontSize:13, fontWeight:800, color:t.ink}}>A</span>} k="Schema" sub="Hell, dunkel oder automatisch" v="Automatisch"/>
          <Row glyph={<span style={{width:14, height:14, borderRadius:99, background:t.accent, display:'inline-block'}}/>} k="Vereinsfarben übernehmen" sub="Akzent folgt der Klubfarbe" v="An"/>
          <Toggle k="Bewegungs­effekte" sub="Folgt prefers-reduced-motion" on={true}/>
          <Toggle k="Tabellen statt Karten" sub="Profi-Wunsch: kompakte Listen statt Karten-Layouts" on={false} last/>
        </Group>

        <Group l="Daten · Offline">
          <Row glyph={<I.CloudOff color={t.ink} size={16}/>}  k="Speicherverbrauch" sub="Karriere · Saison-Snapshots · Cache" v="77 / 250 MB"/>
          <Row glyph={<I.Download color={t.ink} size={16}/>}  k="Karriere exportieren" sub=".save · per Datei-Share teilbar" v=""/>
          <Row glyph={<I.Upload color={t.ink} size={16}/>}    k="Karriere importieren" sub="ersetzt einen freien Slot" v=""/>
          <Toggle k="Automatische Saison-Snapshots" sub="vor jedem Spieltag · drei Stück rotierend" on={true} last/>
        </Group>

        <Group l="Mitteilungen">
          <Toggle k="Vorstand"   sub="Druck-Warnungen, Saisonziele" on={true}/>
          <Toggle k="Presse"     sub="Vor und nach Spielen" on={true}/>
          <Toggle k="Sponsor"    sub="Angebote, Auszahlungen" on={true}/>
          <Toggle k="Fanclub"    sub="Petitionen, Stimmungswandel" on={false} last/>
        </Group>

        <Group l="Info">
          <Row glyph={<I.Mail color={t.ink} size={16}/>} k="Hilfe & Feedback" v=""/>
          <Row k="Über die App" sub="Version 0.9.4 · Build 2026.05.16" v="" last/>
        </Group>

        <button style={{
          width:'100%', height:48, marginTop:8, borderRadius:12,
          background:'transparent', border:`1px solid ${t.danger}40`, color:t.danger,
          fontWeight:700, fontSize:13, fontFamily:'inherit'
        }}>Diese Karriere löschen</button>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenSettings });
