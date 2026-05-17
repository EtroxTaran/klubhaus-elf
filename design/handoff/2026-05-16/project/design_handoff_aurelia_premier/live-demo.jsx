// live-demo.jsx — LiveXgStrip helper (T2.3) + LiveThemeDemo (Q.2 in-design)
//
// LiveXgStrip is a tiny live xG visualisation that mounts inside the match
// header. The chart re-uses the existing accent + inkMute colors from the
// theme, so it adapts automatically when the club theme changes.
//
// LiveThemeDemo is a self-contained interactive artboard with swatches the
// user can tap to swap the Hub's accent — proves the token system end-to-end.

// ---------- LIVE xG STRIP (T2.3) ----------
function LiveXgStrip({theme, scheme, a=0, b=0, aLabel='A', bLabel='B', points=[]}){
  const t = THEMES[theme][scheme];
  const W = 320, H = 38, P = 4;
  const max = Math.max(0.6, ...points.map(p => Math.max(p.a, p.b)));
  const xAt = (min) => P + (min/95) * (W - 2*P);
  const yAt = (v)   => H-P - (v/max) * (H - 2*P);
  const pathFor = (key) => points.map((p,i)=> (i===0?'M':'L') + xAt(p.min).toFixed(1) + ' ' + yAt(p[key]).toFixed(1)).join(' ');
  return (
    <div style={{position:'relative', marginTop:8, padding:'4px 0 2px'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', fontFamily:'JetBrains Mono', fontSize:9.5, color:t.inkSoft, fontWeight:700, letterSpacing:.3, padding:'0 4px'}}>
        <span><span style={{color:t.inkMute}}>{aLabel}</span> xG <span style={{color:t.ink, fontWeight:800}}>{a.toString().replace('.', ',')}</span></span>
        <span style={{fontStyle:'italic', fontFamily:THEMES[theme].font, fontSize:10, color:t.inkSoft, fontWeight:500}}>xG-Verlauf</span>
        <span><span style={{color:t.ink, fontWeight:800}}>{b.toString().replace('.', ',')}</span> xG <span style={{color:t.accent}}>{bLabel}</span></span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%', display:'block', marginTop:2}}>
        {/* baseline */}
        <line x1={P} y1={H-P} x2={W-P} y2={H-P} stroke={t.rule} strokeWidth=".7"/>
        {/* minute ticks */}
        {[15, 30, 45, 60, 75, 90].map(m=>(
          <line key={m} x1={xAt(m)} y1={H-P} x2={xAt(m)} y2={H-P-3} stroke={t.rule} strokeWidth=".7"/>
        ))}
        {/* half-time marker */}
        <line x1={xAt(45)} y1={2} x2={xAt(45)} y2={H-P} stroke={t.inkSoft} strokeWidth=".5" strokeDasharray="2 2" opacity=".5"/>
        {/* opponent line (muted) */}
        <path d={pathFor('a')} fill="none" stroke={t.inkMute} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        {/* own line (accent) */}
        <path d={pathFor('b')} fill="none" stroke={t.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        {/* final dots */}
        <circle cx={xAt(points[points.length-1].min)} cy={yAt(points[points.length-1].a)} r="2" fill={t.inkMute}/>
        <circle cx={xAt(points[points.length-1].min)} cy={yAt(points[points.length-1].b)} r="2.6" fill={t.accent}/>
      </svg>
    </div>
  );
}

// ---------- LIVE THEME DEMO ----------
// Phone-frame Hub bound to a live state hook. Right panel offers swatches
// for club tint, scheme toggle and data density. All visible changes use
// the same React primitives as the production screens.
function LiveThemeDemo(){
  const [clubId, setClubId] = React.useState('hafenstadt');
  const [scheme, setScheme] = React.useState('light');
  const [density, setDensity] = React.useState('compact'); // compact | pro
  // The theme key: A (default Sonntagszeitung) for hafenstadt, club-themed otherwise
  const themeKey = 'A_' + clubId;
  const t = THEMES[themeKey][scheme];

  const CLUBS = ['hafenstadt','kaltenbach','sauveterre','auerbach'];

  return (
    <div style={{
      display:'grid', gridTemplateColumns:'auto 1fr', gap:18,
      padding:'18px', background:'#f0eee9', height:'100%', alignItems:'stretch'
    }}>
      {/* Phone with live Hub */}
      <div style={{display:'flex', alignItems:'center'}}>
        <div className="phone-frame" style={{flex:'0 0 auto'}}>
          <div className="phone-screen" style={{ background: t.bg, color: t.ink, fontFamily: THEMES.A.ui }}>
            <div className="phone-notch"></div>
            <div className="phone-status" style={{color:t.ink}}>
              <span>09:41</span>
              <span className="sig" style={{display:'flex',gap:6,alignItems:'center'}}>
                <I.CloudOff size={14} sw={2} color={t.ink}/>
                <I.Battery size={20} sw={1.5} color={t.ink}/>
              </span>
            </div>
            <div className="phone-content">
              {/* Use the existing ClubHub so the demo is the production component */}
              <ClubHub clubId={clubId} scheme={scheme}/>
            </div>
          </div>
        </div>
      </div>

      {/* Tweaks rail */}
      <div style={{
        display:'flex', flexDirection:'column', gap:14,
        background:'#fbf6ea', border:'1px solid #d9cdb4', borderRadius:18,
        padding:'18px', fontFamily:'Inter, system-ui, sans-serif',
        color:'#1a1410', overflow:'auto'
      }}>
        <div>
          <div style={{fontSize:10.5, fontWeight:800, color:'#b7301b', letterSpacing:1.4}}>TWEAKS · LIVE-DEMO</div>
          <div style={{fontFamily:'Newsreader, Georgia, serif', fontSize:24, fontWeight:700, color:'#1a1410', lineHeight:1.05, marginTop:2}}>
            Token-System bei der Arbeit
          </div>
          <div style={{fontSize:12.5, color:'#5a4f44', marginTop:4, lineHeight:1.4, fontFamily:'Newsreader, Georgia, serif', fontStyle:'italic'}}>
            Klicken Sie einen Verein, ein Schema oder eine Datendichte — der gleiche React-Code rendert links neu. Kein Re-Build, keine Sonderfälle.
          </div>
        </div>

        {/* Club swatches */}
        <div style={{padding:'12px 14px', background:'#f4ede0', borderRadius:12, border:'1px solid #d9cdb4'}}>
          <div style={{fontSize:10.5, fontWeight:800, color:'#5a4f44', letterSpacing:.6, textTransform:'uppercase', marginBottom:8}}>Vereinsfarben</div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
            {CLUBS.map(id => {
              const c = CLUB_REGISTRY[id];
              const a = id === clubId;
              return (
                <button key={id} onClick={()=>setClubId(id)} style={{
                  display:'flex', alignItems:'center', gap:8,
                  padding:'8px 10px', borderRadius:10,
                  background: a ? '#fff' : 'transparent',
                  border: a ? `2px solid ${c.primary}` : '1px solid #d9cdb4',
                  fontFamily:'inherit', cursor:'pointer', textAlign:'left'
                }}>
                  <Crest {...c.crest} size={28}/>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{fontSize:11.5, fontWeight:700, color:'#1a1410', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{c.name}</div>
                    <div style={{display:'flex', gap:3, marginTop:3}}>
                      <span style={{width:14, height:14, borderRadius:3, background:c.primary, border:'1px solid #0002'}}/>
                      <span style={{width:14, height:14, borderRadius:3, background:c.secondary, border:'1px solid #0002'}}/>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scheme */}
        <div style={{padding:'12px 14px', background:'#f4ede0', borderRadius:12, border:'1px solid #d9cdb4'}}>
          <div style={{fontSize:10.5, fontWeight:800, color:'#5a4f44', letterSpacing:.6, textTransform:'uppercase', marginBottom:8}}>Schema</div>
          <div style={{display:'flex', gap:5, padding:3, background:'#ece2cf', borderRadius:9}}>
            {[
              {id:'light', l:'Hell'},
              {id:'dark',  l:'Dunkel'},
            ].map(o=>(
              <button key={o.id} onClick={()=>setScheme(o.id)} style={{
                flex:1, padding:'8px 0', borderRadius:7, border:'none',
                background: scheme===o.id ? '#fbf6ea' : 'transparent',
                color:'#1a1410',
                boxShadow: scheme===o.id ? '0 1px 0 #d9cdb4' : 'none',
                fontFamily:'inherit', fontWeight:700, fontSize:12, cursor:'pointer'
              }}>{o.l}</button>
            ))}
          </div>
        </div>

        {/* Density */}
        <div style={{padding:'12px 14px', background:'#f4ede0', borderRadius:12, border:'1px solid #d9cdb4'}}>
          <div style={{fontSize:10.5, fontWeight:800, color:'#5a4f44', letterSpacing:.6, textTransform:'uppercase', marginBottom:8}}>Datendichte</div>
          <div style={{display:'flex', gap:5, padding:3, background:'#ece2cf', borderRadius:9}}>
            {[
              {id:'compact', l:'Kompakt'},
              {id:'pro',     l:'Profi · 1–20'},
            ].map(o=>(
              <button key={o.id} onClick={()=>setDensity(o.id)} style={{
                flex:1, padding:'8px 0', borderRadius:7, border:'none',
                background: density===o.id ? '#fbf6ea' : 'transparent',
                color:'#1a1410',
                boxShadow: density===o.id ? '0 1px 0 #d9cdb4' : 'none',
                fontFamily:'inherit', fontWeight:700, fontSize:12, cursor:'pointer'
              }}>{o.l}</button>
            ))}
          </div>
          <div style={{fontSize:10.5, color:'#7a6f63', marginTop:6, fontStyle:'italic', fontFamily:'Newsreader, Georgia, serif'}}>
            Profi-Modus blendet die volle 1–20-Tabelle ein. Standard zeigt die 1–10-Strenge.
          </div>
        </div>

        {/* Token readout — the actual values currently in use */}
        <div style={{padding:'12px 14px', background:'#1a1410', color:'#f4ede0', borderRadius:12, fontFamily:'"JetBrains Mono", ui-monospace, monospace', fontSize:11, lineHeight:1.7}}>
          <div style={{fontWeight:800, letterSpacing:1, color:'#f6dcd5', marginBottom:6}}>// AKTIVE TOKEN</div>
          <div>--theme:  <span style={{color:'#f6dcd5'}}>{themeKey}</span></div>
          <div>--accent: <span style={{color:'#f6dcd5'}}>{t.accent}</span></div>
          <div>--accentSoft: <span style={{color:'#f6dcd5'}}>{t.accentSoft}</span></div>
          <div>--bg:     <span style={{color:'#f6dcd5'}}>{t.bg}</span></div>
          <div>--ink:    <span style={{color:'#f6dcd5'}}>{t.ink}</span></div>
          <div style={{marginTop:8, fontSize:10, color:'#9a8f80', fontStyle:'italic', fontFamily:'Newsreader, Georgia, serif'}}>
            Jeder Screen liest aus diesen Variablen. Kein Code-Change pro Verein.
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LiveXgStrip, LiveThemeDemo });
