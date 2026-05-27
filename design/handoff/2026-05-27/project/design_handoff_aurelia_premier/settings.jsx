// settings.jsx — single settings screen (per brief: "one summary settings screen is enough")
// Reads live from the global prefs store (Tweaks panel writes here) and from useT() for locale.

function ScreenSettings({theme, scheme}){
  const t = THEMES[theme][scheme];
  const tr = useT();
  const prefs = usePrefs();
  const isDe = getLocale() === 'de';

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

  // Cloud-sync pill: reflects live `prefs.cloud` (set via Tweaks panel)
  const cloudMeta = {
    synced:   { tone:t.ok,     dot:t.ok,     label: isDe ? 'Synchronisiert · vor 12 Min.' : 'Synced · 12 min ago',     sub: isDe ? 'Letzte Karriere-Sicherung gerade abgeglichen' : 'Last career save just synced' },
    syncing:  { tone:t.warn,   dot:t.warn,   label: isDe ? 'Synchronisiert…' : 'Syncing…',                              sub: isDe ? 'Karriere wird hochgeladen' : 'Uploading career' },
    offline:  { tone:t.inkMute,dot:t.inkSoft,label: isDe ? 'Offline · nur lokal' : 'Offline · local only',              sub: isDe ? 'Letzter Sync vor 3 Std.' : 'Last synced 3 h ago' },
    conflict: { tone:t.danger, dot:t.danger, label: isDe ? 'Konflikt · Karriere klären' : 'Conflict · resolve save',    sub: isDe ? 'Zwei Geräte haben unterschiedlich gespeichert' : 'Two devices saved differently' },
  };
  const cm = cloudMeta[prefs.cloud] || cloudMeta.synced;

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{padding:'4px 16px 8px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <button aria-label={tr('common.back')} style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.ChevronLeft color={t.ink} size={18}/></button>
          <SerifH theme={theme} style={{fontSize:18, fontWeight:700, color:t.ink}}>{tr('settings.title')}</SerifH>
          <div style={{width:36}}></div>
        </div>
      </header>

      <div style={{flex:1, overflowY:'auto', padding:'8px 16px 20px'}}>
        {/* Manager card */}
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'12px 14px', display:'flex', alignItems:'center', gap:12, marginBottom:14}}>
          <div style={{width:48, height:48, borderRadius:99, background:t.accentSoft, color:t.accent, display:'grid', placeItems:'center', fontFamily:THEMES[theme].font, fontWeight:800, fontSize:22, border:`2px solid ${t.accent}`}}>JL</div>
          <div style={{flex:1}}>
            <SerifH theme={theme} style={{fontSize:16, fontWeight:700, color:t.ink, lineHeight:1.05}}>Julia Lindquist</SerifH>
            <div style={{fontSize:11, color:t.inkMute, marginTop:2}}>FC Hafenstadt · {isDe ? 'Saison' : 'Season'} 2026/27</div>
          </div>
          <I.ChevronRight size={16} color={t.inkSoft}/>
        </div>

        {/* Cloud-sync banner (UI-only demo — toggled via Tweaks) */}
        <div style={{
          background:t.card, border:`1px solid ${t.rule}`, borderRadius:14,
          padding:'10px 14px', display:'flex', alignItems:'center', gap:10, marginBottom:14,
          position:'relative',
        }}>
          <span style={{width:8, height:8, borderRadius:99, background:cm.dot, flex:'0 0 8px',
            boxShadow: prefs.cloud==='syncing' ? `0 0 0 0 ${cm.dot}80` : 'none',
            animation: prefs.cloud==='syncing' ? 'pulse 1.4s ease-in-out infinite' : 'none',
          }}/>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:12, fontWeight:700, color:cm.tone, lineHeight:1.1}}>{cm.label}</div>
            <div style={{fontSize:10.5, color:t.inkSoft, marginTop:2}}>{cm.sub}</div>
          </div>
          <span style={{
            fontSize:9, fontWeight:800, letterSpacing:.6, textTransform:'uppercase',
            color:t.inkSoft, padding:'2px 6px', border:`1px dashed ${t.rule}`, borderRadius:99,
          }}>{isDe ? 'UI-Demo' : 'UI demo'}</span>
        </div>

        <Group l={tr('settings.section.cloud').replace(/^[a-z]/, c => c.toUpperCase())}>
          <Toggle
            k={isDe ? 'Cloud-Sync aktivieren' : 'Enable cloud sync'}
            sub={isDe ? 'Anonyme Karriere-ID · End-to-End-verschlüsselt' : 'Anonymous career ID · end-to-end encrypted'}
            on={prefs.cloud !== 'offline'}/>
          <Row glyph={<I.Wifi color={t.ink} size={16}/>}
               k={isDe ? 'Jetzt synchronisieren' : 'Sync now'}
               sub={isDe ? 'Manueller Push der aktiven Karriere' : 'Push the active career manually'}
               v="" last/>
        </Group>

        <Group l="Klub">
          <Row glyph={<Crest {...crestFor('FC Hafenstadt')} size={26}/>}
               k={isDe ? 'Wappen & Trikot' : 'Crest & kit'}
               sub={isDe ? 'Schildform, Tinkturen, Motto, Trikotmuster' : 'Shield, tinctures, motto, kit pattern'}
               v={isDe ? 'bearbeiten' : 'edit'} last/>
        </Group>

        <Group l={isDe ? 'Spiel' : 'Gameplay'}>
          <Row glyph={<I.Globe color={t.ink} size={16}/>}
               k={tr('tweaks.lang')}
               sub={isDe ? 'Anrede, Tonalität, Datumsformat' : 'Form of address, tone, date format'}
               v={isDe ? 'Deutsch' : 'English'}/>
          <Row glyph={<I.Settings color={t.ink} size={16}/>}
               k={tr('tweaks.density')}
               sub={isDe ? 'Kompakt oder Profi-Modus mit 1–20-Attributen' : 'Compact or Pro mode with 1–20 attributes'}
               v={prefs.density === 'pro' ? tr('settings.density.pro') : tr('settings.density.compact')}/>
          <Row glyph={<I.Calendar color={t.ink} size={16}/>}
               k={isDe ? 'Spieltempo' : 'Game pace'}
               sub={isDe ? 'Tagesoffset beim ‚Weiter\u2018-Knopf' : 'Day offset on the Advance button'}
               v={isDe ? '3 Tage' : '3 days'}/>
          <Row glyph={<I.Whistle color={t.ink} size={16}/>}
               k={isDe ? 'Spielreportage' : 'Match presentation'}
               sub={isDe ? 'Standard-Tier bei neuem Spiel' : 'Default tier for new matches'}
               v={tr('match.tab.feed')} last/>
        </Group>

        <Group l={tr('settings.section.appearance')}>
          <Row glyph={<span style={{fontSize:13, fontWeight:800, color:t.ink}}>A</span>}
               k={tr('tweaks.scheme')}
               sub={isDe ? 'Hell, dunkel oder automatisch' : 'Light, dark or automatic'}
               v={prefs.scheme === 'light' ? tr('settings.scheme.light')
                : prefs.scheme === 'dark'  ? tr('settings.scheme.dark')
                                           : tr('settings.scheme.auto')}/>
          <Row glyph={<span style={{width:14, height:14, borderRadius:99, background:t.accent, display:'inline-block'}}/>}
               k={isDe ? 'Vereinsfarben übernehmen' : 'Use club colours'}
               sub={isDe ? 'Akzent folgt der Klubfarbe' : 'Accent follows the club colour'}
               v={isDe ? 'An' : 'On'}/>
          <Toggle k={isDe ? 'Bewegungs­effekte' : 'Motion effects'}
                  sub={isDe ? 'Folgt prefers-reduced-motion' : 'Respects prefers-reduced-motion'}
                  on={prefs.motion === 'full'}/>
          <Toggle k={isDe ? 'Tabellen statt Karten' : 'Tables instead of cards'}
                  sub={isDe ? 'Profi-Wunsch: kompakte Listen statt Karten-Layouts' : 'Pro request: dense lists instead of card layouts'}
                  on={prefs.density === 'pro'} last/>
        </Group>

        <Group l={isDe ? 'Daten · Offline' : 'Data · Offline'}>
          <Row glyph={<I.CloudOff color={t.ink} size={16}/>}
               k={isDe ? 'Speicherverbrauch' : 'Storage used'}
               sub={isDe ? 'Karriere · Saison-Snapshots · Cache' : 'Career · season snapshots · cache'}
               v="77 / 250 MB"/>
          <Row glyph={<I.Download color={t.ink} size={16}/>}
               k={isDe ? 'Karriere exportieren' : 'Export career'}
               sub={isDe ? '.save · per Datei-Share teilbar' : '.save · share via file'}
               v=""/>
          <Row glyph={<I.Upload color={t.ink} size={16}/>}
               k={isDe ? 'Karriere importieren' : 'Import career'}
               sub={isDe ? 'ersetzt einen freien Slot' : 'replaces an empty slot'}
               v=""/>
          <Toggle k={isDe ? 'Automatische Saison-Snapshots' : 'Automatic season snapshots'}
                  sub={isDe ? 'vor jedem Spieltag · drei Stück rotierend' : 'before every matchday · 3 rolling slots'}
                  on={true} last/>
        </Group>

        <Group l={isDe ? 'Mitteilungen' : 'Notifications'}>
          <Toggle k={tr('inbox.tone.board')}    sub={isDe ? 'Druck-Warnungen, Saisonziele' : 'Pressure warnings, season targets'} on={true}/>
          <Toggle k={tr('inbox.tone.media')}    sub={isDe ? 'Vor und nach Spielen' : 'Before and after matches'} on={true}/>
          <Toggle k={tr('inbox.tone.sponsor')}  sub={isDe ? 'Angebote, Auszahlungen' : 'Offers, payouts'} on={true}/>
          <Toggle k={tr('inbox.tone.fan')}      sub={isDe ? 'Petitionen, Stimmungswandel' : 'Petitions, mood shifts'} on={false} last/>
        </Group>

        <Group l={isDe ? 'Info' : 'About'}>
          <Row glyph={<I.Mail color={t.ink} size={16}/>}
               k={isDe ? 'Hilfe & Feedback' : 'Help & feedback'} v=""/>
          <Row k={isDe ? 'Über die App' : 'About the app'}
               sub="Version 0.9.4 · Build 2026.05.16" v="" last/>
        </Group>

        <button style={{
          width:'100%', height:48, marginTop:8, borderRadius:12,
          background:'transparent', border:`1px solid ${t.danger}40`, color:t.danger,
          fontWeight:700, fontSize:13, fontFamily:'inherit'
        }}>{isDe ? 'Diese Karriere löschen' : 'Delete this career'}</button>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenSettings });
