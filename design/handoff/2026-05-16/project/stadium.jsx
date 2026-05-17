// stadium.jsx — bespoke glyphs, stand side-views, stadium-type gallery.
// Loaded after ui.jsx, before screens.

// ---------- BESPOKE STADIUM GLYPHS ----------
const GlyphRoof = ({size=22, color='currentColor', sw=1.6}) => (
  <svg width={size} height={size*0.7} viewBox="0 0 26 18" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11 L13 3 L23 11"/>
    <path d="M5 11 L5 15 M21 11 L21 15"/>
    <line x1="2" y1="15" x2="24" y2="15"/>
  </svg>
);
const GlyphRoofOpen = ({size=22, color='currentColor', sw=1.6}) => (
  <svg width={size} height={size*0.7} viewBox="0 0 26 18" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11 L13 3 L23 11" strokeDasharray="2 2"/>
    <line x1="2" y1="15" x2="24" y2="15"/>
  </svg>
);
const GlyphRoofPartial = ({size=22, color='currentColor', sw=1.6}) => (
  <svg width={size} height={size*0.7} viewBox="0 0 26 18" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 3 L23 11" strokeDasharray="2 2"/>
    <path d="M3 11 L13 3"/>
    <line x1="2" y1="15" x2="24" y2="15"/>
  </svg>
);
const GlyphSeat = ({size=22, color='currentColor', sw=1.6}) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 4 L6 13 L16 13"/>
    <path d="M16 13 L16 18"/>
    <path d="M6 13 L4 18"/>
  </svg>
);
const GlyphStand = ({size=22, color='currentColor', sw=1.6}) => (
  <svg width={size} height={size} viewBox="0 0 24 22" fill={color} stroke={color} strokeWidth={sw*.5} strokeLinejoin="round">
    <circle cx="6"  cy="6" r="2.2"/>
    <circle cx="12" cy="5" r="2.4"/>
    <circle cx="18" cy="6" r="2.2"/>
    <path d="M2 19 Q2 11 6 11 Q9 11 9 14 Q9 11 12 11 Q15 11 15 14 Q15 11 18 11 Q22 11 22 19 Z"/>
  </svg>
);
const GlyphFloodlight = ({size=22, color='currentColor', sw=1.6}) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20 L11 11"/>
    <path d="M7 11 L15 11 L17 5 L5 5 Z" fill={color} fillOpacity=".18"/>
    <line x1="3" y1="9" x2="7" y2="11"/>
    <line x1="19" y1="9" x2="15" y2="11"/>
    <line x1="11" y1="2" x2="11" y2="4"/>
  </svg>
);
const GlyphHeating = ({size=22, color='currentColor', sw=1.6}) => (
  <svg width={size} height={size*0.55} viewBox="0 0 28 16" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 5 Q5 1 8 5 T14 5 T20 5 T26 5"/>
    <path d="M2 12 Q5 8 8 12 T14 12 T20 12 T26 12"/>
  </svg>
);
const GlyphVIP = ({size=22, color='currentColor', sw=1.6}) => (
  <svg width={size} height={size*0.7} viewBox="0 0 22 16" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="18" height="9" rx="1"/>
    <line x1="6" y1="4" x2="6" y2="13"/>
    <line x1="11" y1="4" x2="11" y2="13"/>
    <line x1="16" y1="4" x2="16" y2="13"/>
    <path d="M2 4 L4 1 L18 1 L20 4" fill={color} fillOpacity=".15"/>
  </svg>
);

// ---------- TRIBÜNEN-SEITENANSICHT ----------
// Renders a side cross-section: pitch line at bottom, terrace stepping up,
// optional roof over the top, VIP box hint near the top row. Standing
// section drawn with little crowd silhouettes, seating with chair markers.
function StandSideView({stand, theme, scheme, height=110}){
  const t = THEMES[theme][scheme];
  // Geometry: viewBox 240x120, pitch at y=110, terrace builds up to ~y=20.
  // rows -> visual stairs. Standing fills the front (lower 35% of seats).
  const W = 240, H = 120;
  const PitchY = 108;
  const rows = Math.min(stand.rows, 12); // visual cap
  const stepW = 14;       // horizontal depth of each row
  const stepH = (PitchY - 22) / rows; // vertical pitch
  const baseX = 14;       // where terrace meets the pitch
  // standing share of the rows (front rows)
  const standingRows = Math.round(rows * (stand.standing / stand.cap));
  // build polygon path
  let d = `M${baseX} ${PitchY} `;
  for (let i=0;i<rows;i++){
    const x = baseX + i*stepW;
    const y = PitchY - i*stepH;
    d += `L${x} ${y} L${x+stepW} ${y} `;
  }
  d += `L${baseX + rows*stepW} ${PitchY} Z`;

  const roofTier = stand.roof; // 'full' | 'partial' | 'open'
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%', display:'block'}}>
      {/* sky */}
      <rect x="0" y="0" width={W} height={H} fill={t.bg}/>
      {/* pitch line + grass strip */}
      <rect x="0" y={PitchY} width={W} height={H-PitchY} fill={t.ok} opacity=".55"/>
      <line x1="0" y1={PitchY} x2={W} y2={PitchY} stroke={t.ink} strokeWidth=".6"/>
      {/* heating coils under the pitch */}
      <g opacity=".75" stroke={t.accent} strokeWidth=".8" fill="none">
        <path d={`M2 ${PitchY+5} Q6 ${PitchY+2} 10 ${PitchY+5} T18 ${PitchY+5} T26 ${PitchY+5} T34 ${PitchY+5} T42 ${PitchY+5}`}/>
      </g>
      {/* terrace block */}
      <path d={d} fill={t.card} stroke={t.ink} strokeWidth=".7" strokeLinejoin="round"/>
      {/* row by row: standing markers (front), seats behind, VIP box on top tier */}
      {Array.from({length: rows}).map((_,i)=>{
        const x = baseX + i*stepW;
        const y = PitchY - i*stepH;
        const isStanding = i < standingRows;
        const isVip = stand.vip > 0 && i === rows-1;
        if (isVip) {
          return (
            <g key={i}>
              <rect x={x+1} y={y-stepH+2} width={stepW-2} height={stepH-3} fill={t.warn} opacity=".18"/>
              <rect x={x+1} y={y-stepH+2} width={stepW-2} height={stepH-3} fill="none" stroke={t.warn} strokeWidth=".5"/>
              <text x={x+stepW/2} y={y-stepH/2+3} textAnchor="middle" fontSize="4.5" fontWeight="800" fill={t.warn} fontFamily="Inter">VIP</text>
            </g>
          );
        }
        // Draw 3 small markers on each step
        return (
          <g key={i}>
            {[0,1,2].map(j=>{
              const cx = x + 3 + j*4;
              const cy = y - 2;
              if (isStanding) {
                // standing: little vertical strokes (people)
                return <line key={j} x1={cx} y1={cy-3} x2={cx} y2={cy} stroke={t.inkMute} strokeWidth="1.1" strokeLinecap="round"/>;
              }
              // seating: tiny chair
              return (
                <g key={j} stroke={t.inkMute} strokeWidth=".8" fill="none">
                  <path d={`M${cx-1.4} ${cy-2.5} L${cx-1.4} ${cy-.5} L${cx+1.4} ${cy-.5}`}/>
                  <line x1={cx-1.4} y1={cy-.5} x2={cx-2} y2={cy+1}/>
                  <line x1={cx+1.4} y1={cy-.5} x2={cx+1.4} y2={cy+1}/>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* Roof — drawn above the top row */}
      {roofTier !== 'open' && (() => {
        const xTop = baseX;
        const yTop = PitchY - rows*stepH - 6;
        const wTop = rows*stepW;
        if (roofTier === 'full') {
          return (
            <g>
              <path d={`M${xTop-4} ${yTop+6} L${xTop+wTop+4} ${yTop+2} L${xTop+wTop+4} ${yTop-2} L${xTop-4} ${yTop+2} Z`}
                fill={t.ink} stroke={t.ink} strokeWidth=".5"/>
              {/* support strut */}
              <line x1={xTop+wTop/2} y1={yTop+4} x2={xTop+wTop/2} y2={PitchY-rows*stepH+2} stroke={t.ink} strokeWidth=".6" opacity=".4"/>
            </g>
          );
        }
        // partial: covers back rows only
        return (
          <g>
            <path d={`M${xTop+wTop*.4} ${yTop+5} L${xTop+wTop+4} ${yTop+2} L${xTop+wTop+4} ${yTop-2} L${xTop+wTop*.4} ${yTop+1} Z`}
              fill={t.ink} stroke={t.ink} strokeWidth=".5"/>
          </g>
        );
      })()}

      {/* small floodlight mast at the back */}
      <g>
        <line x1={baseX + rows*stepW + 10} y1={PitchY} x2={baseX + rows*stepW + 10} y2={20} stroke={t.inkMute} strokeWidth="1"/>
        <rect x={baseX + rows*stepW + 6} y={14} width={10} height={6} fill={t.warn} stroke={t.ink} strokeWidth=".5"/>
        <line x1={baseX + rows*stepW + 11} y1={18} x2={baseX + rows*stepW + 50} y2={32} stroke={t.warn} strokeWidth=".4" opacity=".4"/>
      </g>

      {/* on-image labels: Steh, Sitz, VIP positions */}
      <g fontFamily="Inter" fontWeight="800" fontSize="6" letterSpacing=".5">
        {stand.standing > 0 && (
          <text x={baseX + (standingRows*stepW)/2} y={PitchY-4} textAnchor="middle" fill={t.bg} stroke={t.ink} strokeWidth=".2">STEH</text>
        )}
        {stand.seats > stand.vip && (
          <text x={baseX + ((rows+standingRows)/2)*stepW} y={PitchY - rows*stepH + 4} textAnchor="middle" fill={t.ink}>SITZ</text>
        )}
      </g>
    </svg>
  );
}

// ---------- STADIUM TYPE MINI-PLAN ----------
// Tiny top-down silhouette per stadium type for the gallery.
function StadiumTypePlan({type, theme, scheme}){
  const t = THEMES[theme][scheme];
  const W=160, H=96;
  const PX=46, PY=30, PW=68, PH=36; // pitch
  const standFill = t.ink;
  const standOpen = t.inkMute;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%', display:'block'}}>
      <rect x="2" y="2" width={W-4} height={H-4} rx="8" fill={t.bg} stroke={t.rule}/>
      {/* pitch */}
      <rect x={PX} y={PY} width={PW} height={PH} fill={t.ok} opacity=".55" stroke={t.ink} strokeWidth=".5"/>
      <line x1={PX+PW/2} y1={PY} x2={PX+PW/2} y2={PY+PH} stroke="#fff" strokeWidth=".5" opacity=".7"/>
      <circle cx={PX+PW/2} cy={PY+PH/2} r="4" fill="none" stroke="#fff" strokeWidth=".5" opacity=".7"/>

      {/* stand placement per type */}
      {type.id === 'dorf' && (
        <rect x={PX-4} y={PY-8} width={PW+8} height={6} fill={standFill}/>
      )}
      {type.id === 'garten' && (<>
        <rect x={PX-4} y={PY-8} width={PW+8} height={6} fill={standFill}/>
        <rect x={PX-4} y={PY+PH+2} width={PW+8} height={6} fill={standOpen}/>
      </>)}
      {type.id === 'standard' && (<>
        <rect x={PX-4} y={PY-8} width={PW+8} height={6} fill={standFill}/>
        <rect x={PX-4} y={PY+PH+2} width={PW+8} height={6} fill={standFill}/>
        <rect x={PX-8} y={PY-4} width={6} height={PH+8} fill={standFill}/>
        <rect x={PX+PW+2} y={PY-4} width={6} height={PH+8} fill={standFill}/>
      </>)}
      {type.id === 'huf' && (<>
        <rect x={PX-4} y={PY-8} width={PW+8} height={6} fill={standFill}/>
        <rect x={PX-8} y={PY-4} width={6} height={PH+8} fill={standFill}/>
        <rect x={PX+PW+2} y={PY-4} width={6} height={PH+8} fill={standFill}/>
        {/* south side open: dashed */}
        <rect x={PX-4} y={PY+PH+2} width={PW+8} height={6} fill="none" stroke={t.rule} strokeDasharray="2 2"/>
      </>)}
      {type.id === 'arena' && (<>
        <rect x={PX-9} y={PY-9} width={PW+18} height={PH+18} rx="6" fill="none" stroke={standFill} strokeWidth="5"/>
      </>)}
      {/* floodlights — 4 corners */}
      {[[PX-12,PY-12],[PX+PW+12,PY-12],[PX-12,PY+PH+12],[PX+PW+12,PY+PH+12]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="2.2" fill={t.warn} stroke={t.ink} strokeWidth=".5"/>
      ))}
    </svg>
  );
}

// ---------- CAPACITY BREAKDOWN BAR ----------
// Stacked horizontal: standing | seating | vip. Always shows numbers AND
// glyphs — never colour-only.
function CapacityBar({stand, theme, scheme}){
  const t = THEMES[theme][scheme];
  const cap = stand.cap;
  const pct = (n) => (n/cap)*100;
  return (
    <div>
      <div style={{display:'flex', height:18, borderRadius:6, overflow:'hidden', border:`1px solid ${t.rule}`}}>
        {stand.standing > 0 && (
          <div style={{
            width:pct(stand.standing)+'%', background:t.accent, color:'#fff',
            display:'flex', alignItems:'center', justifyContent:'center', gap:3,
            fontSize:9, fontWeight:800, fontFamily:'Inter', letterSpacing:.4
          }}>
            <GlyphStand size={11} color="#fff"/> STEH
          </div>
        )}
        {(stand.seats - stand.vip) > 0 && (
          <div style={{
            width:pct(stand.seats - stand.vip)+'%', background:t.ink, color:t.bg,
            display:'flex', alignItems:'center', justifyContent:'center', gap:3,
            fontSize:9, fontWeight:800, fontFamily:'Inter', letterSpacing:.4
          }}>
            <GlyphSeat size={11} color={t.bg}/> SITZ
          </div>
        )}
        {stand.vip > 0 && (
          <div style={{
            width:pct(stand.vip)+'%', background:t.warn, color:'#fff',
            display:'flex', alignItems:'center', justifyContent:'center', gap:3,
            fontSize:9, fontWeight:800, fontFamily:'Inter', letterSpacing:.4
          }}>
            <GlyphVIP size={11} color="#fff"/> VIP
          </div>
        )}
      </div>
      <div style={{display:'flex', justifyContent:'space-between', marginTop:5, fontFamily:'JetBrains Mono', fontSize:10, color:t.inkMute, fontWeight:600}}>
        <span><GlyphStand size={10} color={t.accent} sw={1.2} style={{verticalAlign:'middle'}}/> {new Intl.NumberFormat('de-DE').format(stand.standing)}</span>
        <span>{new Intl.NumberFormat('de-DE').format(stand.seats - stand.vip)}</span>
        <span>{stand.vip ? new Intl.NumberFormat('de-DE').format(stand.vip) : '–'}</span>
      </div>
    </div>
  );
}

Object.assign(window, {
  GlyphRoof, GlyphRoofOpen, GlyphRoofPartial, GlyphSeat, GlyphStand,
  GlyphFloodlight, GlyphHeating, GlyphVIP,
  StandSideView, StadiumTypePlan, CapacityBar,
});
