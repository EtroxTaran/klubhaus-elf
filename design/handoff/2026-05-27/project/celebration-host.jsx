/* Host page: renders the panel of controls + <ChampionshipCelebration /> */

const { useState } = React;
const { createRoot } = ReactDOM;

const PRESETS = [
  { name: 'Crimson',  primary: '#E10F1A', secondary: '#FFFFFF', fan: '#3a2a8a', style: 'solid'   },
  { name: 'Azure',    primary: '#0B5FFF', secondary: '#FFC83A', fan: '#1a2b6b', style: 'stripes' },
  { name: 'Emerald',  primary: '#0E8F4E', secondary: '#FFFFFF', fan: '#0d2e1e', style: 'hoops'   },
  { name: 'Sunset',   primary: '#F26B1B', secondary: '#1a1a1a', fan: '#4a1f2e', style: 'solid'   },
];

const PRIMARY_SWATCHES   = ['#E10F1A', '#0B5FFF', '#0E8F4E', '#F26B1B', '#8a2bdc', '#1a1a1a'];
const SECONDARY_SWATCHES = ['#FFFFFF', '#FFC83A', '#1a1a1a', '#9ad6ff', '#e6e6e6', '#ff6bbd'];
const FAN_SWATCHES       = ['#3a2a8a', '#1a2b6b', '#0d2e1e', '#4a1f2e', '#252a35', '#6a1f7d'];

function Swatch({ color, active, onClick }) {
  return (
    <button
      className={'swatch' + (active ? ' active' : '')}
      style={{ background: color }}
      onClick={onClick}
      aria-label={color}
    />
  );
}

function ControlPanel({ state, set }) {
  return (
    <div className="panel">
      <h1>Team Kit</h1>

      <div className="row">
        <label>Primary <span style={{color: state.primary}}>{state.primary}</span></label>
        <div className="swatches">
          {PRIMARY_SWATCHES.map((c) => (
            <Swatch key={c} color={c} active={state.primary === c} onClick={() => set({ primary: c })} />
          ))}
        </div>
      </div>

      <div className="row">
        <label>Secondary <span style={{color: state.secondary}}>{state.secondary}</span></label>
        <div className="swatches">
          {SECONDARY_SWATCHES.map((c) => (
            <Swatch key={c} color={c} active={state.secondary === c} onClick={() => set({ secondary: c })} />
          ))}
        </div>
      </div>

      <div className="row">
        <label>Jersey Style</label>
        <div className="seg">
          {['solid','stripes','hoops'].map((s) => (
            <button key={s}
              className={state.style === s ? 'active' : ''}
              onClick={() => set({ style: s })}>{s}</button>
          ))}
        </div>
      </div>

      <div className="row">
        <label>Crowd Tone</label>
        <div className="swatches">
          {FAN_SWATCHES.map((c) => (
            <Swatch key={c} color={c} active={state.fan === c} onClick={() => set({ fan: c })} />
          ))}
        </div>
      </div>

      <div className="row">
        <div className={'toggle' + (state.celebrating ? ' on' : '')}
             onClick={() => set({ celebrating: !state.celebrating })}>
          <span>{state.celebrating ? 'Celebrating' : 'Paused'}</span>
          <div className="dot" />
        </div>
      </div>

      <div className="row">
        <label>Presets</label>
        <div className="preset-row">
          {PRESETS.map((p) => (
            <button key={p.name} className="preset"
              onClick={() => set({ primary: p.primary, secondary: p.secondary, fan: p.fan, style: p.style })}>
              <div className="chips">
                <div className="chip" style={{background: p.primary}} />
                <div className="chip" style={{background: p.secondary}} />
                <div className="chip" style={{background: p.fan}} />
              </div>
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [state, setState] = useState({
    primary: '#E10F1A',
    secondary: '#FFFFFF',
    style: 'solid',
    fan: '#3a2a8a',
    celebrating: true,
  });
  const set = (patch) => setState((s) => ({ ...s, ...patch }));

  return (
    <>
      <div className="stage">
        <ChampionshipCelebration
          primaryColor={state.primary}
          secondaryColor={state.secondary}
          jerseyStyle={state.style}
          fanColor={state.fan}
          isCelebrating={state.celebrating}
        />
      </div>
      <ControlPanel state={state} set={set} />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
