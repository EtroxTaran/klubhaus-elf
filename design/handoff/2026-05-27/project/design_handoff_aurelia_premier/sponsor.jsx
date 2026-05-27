// sponsor.jsx — Sponsor-Pyramide (Screen 42)
// 5-tier hierarchy visualised as a heraldic SVG pyramid + contract list.

function ScreenSponsorPyramid({theme='A', scheme='light'}){
  const t = THEMES[theme][scheme];
  const tr = useT();
  const isDe = getLocale() === 'de';
  // 5 tiers, top to bottom: prestige descending. Status keys stay German
  // internally (the SponsorRow renderer maps them to localised labels).
  const TIERS = [
    { id:'jersey',   tier:1, name: isDe ? 'Trikotsponsor'   : 'Shirt sponsor',   who:'Volta Bank',      value:1_800_000, period:'24/25 — 28/29', status:'aktiv', accent:true,
      desc: isDe ? 'Frontaler Brustsponsor · 5 Saisons'  : 'Front of shirt · 5 seasons' },
    { id:'sleeve',   tier:2, name: isDe ? 'Ärmelsponsor'    : 'Sleeve sponsor',  who:'Lumin Telekom',   value:420_000,   period:'25/26 — 27/28', status:'aktiv',
      desc: isDe ? 'Beide Ärmel · drei Saisons'         : 'Both sleeves · three seasons' },
    { id:'short',    tier:3, name: isDe ? 'Hosensponsor'    : 'Short sponsor',   who:'Korex Mobil',     value:180_000,   period:'26/27 — 26/27', status:'auslaufend',
      desc: isDe ? 'Saisonweise verlängert · läuft Sommer aus' : 'Season-by-season · expires this summer' },
    { id:'stadium',  tier:4, name: isDe ? 'Stadion-Naming'  : 'Stadium naming',  who: isDe ? 'frei · Angebot offen' : 'open · offer on the table', value:2_400_000, period:'27/28 — 31/32', status:'offen',
      desc: isDe ? 'Hafenstadt-Arena könnte „Nordis Air Arena" heißen'
                 : 'Hafenstadt Arena could be renamed "Nordis Air Arena"' },
    { id:'kit',      tier:5, name: isDe ? 'Ausrüster'       : 'Kit manufacturer', who:'Astra Versicherung',  value:680_000,   period:'24/25 — 30/31', status:'aktiv',
      desc: isDe ? 'Kit-Manufacturer · 7 Jahre · langläufig' : 'Kit manufacturer · 7 years · long runner' },
  ];
  const STATUS_LABEL = {
    aktiv:      isDe ? 'aktiv'      : 'active',
    auslaufend: isDe ? 'auslaufend' : 'expiring',
    offen:      isDe ? 'offen'      : 'open',
  };
  const TOTAL = TIERS.reduce((s,x)=>s + (x.status!=='offen'?x.value:0), 0);

  // Gantt-style months from June 2024 to June 2032 (8 years = 96 months)
  const TODAY_MONTH = 23; // May 2026 in offset since June 2024
  const TOTAL_MONTHS = 96;
  // Parse "MM/YY — MM/YY" -> [start, end] in months since 06/24
  const monthsFromStart = (mmyy) => {
    const [m,y] = mmyy.trim().split('/').map(Number);
    return (y - 24) * 12 + (m - 6);  // 06/24 = 0
  };
  const TIER_SPANS = TIERS.map(T => {
    const [s,e] = T.period.split('—').map(p=>p.trim());
    // turn '24/25' -> '08/24' (season start Aug)
    const seasonStart = (yyyy) => {
      const [y1] = yyyy.split('/').map(Number);
      return monthsFromStart(`08/${y1}`);
    };
    const seasonEnd = (yyyy) => {
      const [, y2] = yyyy.split('/').map(Number);
      return monthsFromStart(`06/${y2}`);
    };
    return { start: Math.max(0, seasonStart(s)), end: Math.min(TOTAL_MONTHS, seasonEnd(e)) };
  });

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <ScreenHeader theme={theme} scheme={scheme}
        kicker={isDe ? `5 Verträge · ${((TOTAL)/1_000_000).toFixed(1).replace('.', ',')} Mio. € pro Saison`
                     : `5 deals · €${((TOTAL)/1_000_000).toFixed(1)}M per season`}
        title={isDe ? 'Sponsoren-Pyramide' : 'Sponsor pyramid'}
        right={
          <button style={{height:34, padding:'0 12px', borderRadius:9, background:t.card, border:`1px solid ${t.rule}`, fontWeight:700, fontSize:11, color:t.ink, fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:5}}>
            <I.Plus size={13} color={t.ink}/> {isDe ? 'Anbahnen' : 'Approach'}
          </button>
        }/>

      <div style={{flex:1, overflowY:'auto', padding:'0 16px 20px'}}>
        {/* Pyramid SVG */}
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'14px 18px 10px'}}>
          <PyramidSvg theme={theme} scheme={scheme} tiers={TIERS}/>
        </div>

        {/* Gantt */}
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'14px 2px 6px'}}>{isDe ? 'Vertragslaufzeit · 8 Jahre' : 'Contract timeline · 8 years'}</div>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'12px 14px'}}>
          {/* Year axis */}
          <div style={{position:'relative', display:'flex', justifyContent:'space-between', padding:'0 0 4px', fontSize:9.5, color:t.inkSoft, fontFamily:'JetBrains Mono', fontWeight:700}}>
            {['24/25','25/26','26/27','27/28','28/29','29/30','30/31','31/32'].map((y,i)=>(
              <span key={y} style={{flex:1, textAlign:'left'}}>{y}</span>
            ))}
          </div>
          {TIERS.map((T,i)=>{
            const span = TIER_SPANS[i];
            const leftPct  = (span.start / TOTAL_MONTHS) * 100;
            const widthPct = ((span.end - span.start) / TOTAL_MONTHS) * 100;
            const color = T.status==='aktiv' ? (T.accent ? t.accent : t.ink)
                        : T.status==='auslaufend' ? t.warn
                        : t.inkSoft;
            return (
              <div key={T.id} style={{display:'flex', alignItems:'center', gap:8, padding:'5px 0'}}>
                <span style={{flex:'0 0 88px', fontSize:11, color:t.ink, fontWeight:700, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{T.name}</span>
                <div style={{position:'relative', flex:1, height:14}}>
                  <div style={{position:'absolute', inset:0, background:t.bgInk, borderRadius:99}}/>
                  <div style={{
                    position:'absolute',
                    left:`${leftPct}%`, width:`${widthPct}%`, top:0, bottom:0,
                    background: T.status==='offen' ? `repeating-linear-gradient(45deg, ${color}40, ${color}40 4px, transparent 4px, transparent 8px)` : color,
                    borderRadius:99,
                    display:'flex', alignItems:'center', justifyContent:'flex-start', padding:'0 6px'
                  }}>
                    <span style={{fontSize:9, fontWeight:800, color: T.status==='offen' ? color : '#fff', letterSpacing:.4, whiteSpace:'nowrap'}}>{T.who}</span>
                  </div>
                  {/* today marker */}
                  <div style={{position:'absolute', left:`${(TODAY_MONTH/TOTAL_MONTHS)*100}%`, top:-3, bottom:-3, width:2, background:t.accent}}/>
                </div>
              </div>
            );
          })}
          <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', marginTop:8, paddingTop:6, borderTop:`1px solid ${t.rule}`}}>
            <span style={{fontSize:10, color:t.accent, fontWeight:800, letterSpacing:.4}}>{isDe ? '● HEUTE · Mai 2026' : '● TODAY · May 2026'}</span>
            <span style={{fontSize:10, color:t.inkSoft, fontFamily:THEMES[theme].font, fontStyle:'italic'}}>{isDe ? 'Hosensponsor läuft im Sommer aus.' : 'Short sponsor expires this summer.'}</span>
          </div>
        </div>

        {/* Sponsor cards */}
        <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'14px 2px 6px'}}>{isDe ? 'Verträge im Detail' : 'Contracts in detail'}</div>
        {TIERS.map((T,i)=>(
          <SponsorRow key={T.id} T={T} statusLabel={STATUS_LABEL[T.status]} theme={theme} scheme={scheme}/>
        ))}
      </div>
    </div>
  );
}

function PyramidSvg({tiers, theme, scheme}){
  const t = THEMES[theme][scheme];
  const W = 320, H = 220;
  // 5 trapezoid bands, narrow at top
  const bandHeight = H / 5;
  const minW = 56, maxW = 280;
  const widthAt = (i) => minW + ((maxW - minW) * (i/4));
  return (
    <svg viewBox={`0 0 ${W} ${H + 18}`} style={{width:'100%', display:'block'}}>
      <defs>
        <linearGradient id="pyr-paper" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={t.bgInk}/>
          <stop offset="1" stopColor={t.bg}/>
        </linearGradient>
      </defs>
      {/* baseline */}
      <line x1="6" y1={H+2} x2={W-6} y2={H+2} stroke={t.ink} strokeWidth=".7"/>
      {tiers.map((T,i)=>{
        const wTop = widthAt(i);
        const wBot = widthAt(i+1);
        const yTop = i * bandHeight + 6;
        const yBot = yTop + bandHeight - 4;
        const xTopL = (W - wTop) / 2;
        const xTopR = xTopL + wTop;
        const xBotL = (W - wBot) / 2;
        const xBotR = xBotL + wBot;
        const isAccent = T.accent;
        const isOpen   = T.status === 'offen';
        const isExp    = T.status === 'auslaufend';
        const fill = isAccent ? t.accent : isOpen ? 'transparent' : isExp ? t.warn : t.ink;
        const text = isAccent ? '#fff' : isOpen ? t.inkMute : isExp ? '#fff' : t.bg;
        const stroke = isOpen ? t.rule : 'none';
        return (
          <g key={T.id}>
            <path
              d={`M${xTopL} ${yTop} L${xTopR} ${yTop} L${xBotR} ${yBot} L${xBotL} ${yBot} Z`}
              fill={fill}
              stroke={stroke}
              strokeWidth={isOpen?1.5:0}
              strokeDasharray={isOpen?'3 3':null}
            />
            {/* tier number + name in trapezoid */}
            <text x={W/2} y={yTop + (yBot-yTop)/2 + 2}
              textAnchor="middle" fontFamily="Inter" fontWeight="800"
              fontSize={i===0?11:10} fill={text} letterSpacing=".4">
              {T.name.toUpperCase()}
            </text>
            {/* tier sponsor name */}
            <text x={W/2} y={yTop + (yBot-yTop)/2 + 14}
              textAnchor="middle" fontFamily="Newsreader, serif" fontWeight="700"
              fontSize={i===0?13:11} fontStyle="italic" fill={isAccent?'#fff':isOpen?t.inkSoft:isExp?'#fff':t.bg}>
              {T.who.split('·')[0].trim()}
            </text>
            {/* € value right side */}
            {!isOpen && (
              <text x={xBotR + 4} y={yBot - 2}
                textAnchor="start" fontFamily='"JetBrains Mono", monospace' fontWeight="800"
                fontSize="9" fill={t.ink}>
                {(T.value/1_000_000).toFixed(2).replace('.', ',')} M
              </text>
            )}
          </g>
        );
      })}
      {/* Bottom label */}
      <text x={W/2} y={H+14} textAnchor="middle" fontFamily="Inter" fontWeight="600" fontSize="9" fill={t.inkSoft} letterSpacing=".5">{(typeof getLocale==='function' && getLocale()==='en') ? 'PRESTIGE ↑ · VALUE ↑' : 'PROMINENZ ↑ · WERT ↑'}</text>
    </svg>
  );
}

function SponsorRow({T, statusLabel, theme, scheme}){
  const t = THEMES[theme][scheme];
  const isDe = getLocale() === 'de';
  const open = T.status === 'offen';
  const expiring = T.status === 'auslaufend';
  const c = T.accent ? t.accent : open ? t.inkSoft : expiring ? t.warn : t.ok;
  return (
    <div style={{background:t.card, border:`1px solid ${T.accent?t.accent:t.rule}`, borderRadius:12, padding:'10px 12px', marginBottom:8, display:'flex', gap:10, alignItems:'center'}}>
      <div style={{flex:'0 0 40px', height:40, borderRadius:10, background:c+'1a', color:c, display:'grid', placeItems:'center', fontFamily:THEMES[theme].font, fontWeight:800, fontSize:16}}>
        {T.tier}
      </div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between'}}>
          <SerifH theme={theme} style={{fontSize:14, fontWeight:700, color:t.ink, lineHeight:1.1}}>{T.name}</SerifH>
          <span style={{fontSize:10, fontWeight:800, padding:'2px 7px', borderRadius:99, background:c+'18', color:c, letterSpacing:.5, textTransform:'uppercase'}}>{statusLabel || T.status}</span>
        </div>
        <div style={{fontSize:11, color:t.inkMute, marginTop:2}}>
          <b style={{color:t.ink}}>{T.who}</b> · {T.period}
        </div>
        <div style={{fontSize:10.5, color:t.inkSoft, marginTop:3, fontFamily:THEMES[theme].font, fontStyle:'italic', lineHeight:1.3}}>{T.desc}</div>
      </div>
      <div style={{textAlign:'right'}}>
        <div style={{fontFamily:'JetBrains Mono', fontSize:13, fontWeight:800, color:t.ink}}>{open ? '—' : (isDe ? (T.value/1_000_000).toFixed(2).replace('.', ',') + ' M €' : '€' + (T.value/1_000_000).toFixed(2) + 'M')}</div>
        <div style={{fontSize:9.5, color:t.inkSoft, fontWeight:700, letterSpacing:.4, marginTop:1}}>{isDe ? 'pro Saison' : 'per season'}</div>
      </div>
      <button aria-label="Details" style={{width:32, height:32, borderRadius:8, background:t.bg, border:`1px solid ${t.rule}`, display:'grid', placeItems:'center', flex:'0 0 32px'}}>
        <I.ChevronRight size={14} color={t.ink}/>
      </button>
    </div>
  );
}

Object.assign(window, { ScreenSponsorPyramid });
