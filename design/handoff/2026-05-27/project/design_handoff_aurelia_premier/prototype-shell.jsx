// prototype-shell.jsx — generic clickable-prototype host.
// Pass a flow array to <PrototypeApp> and you get tap-to-advance, keyboard
// nav, progress pills, and a step-narration header for free.
//
// Each flow step:
//   { id, name, title, sub, render: () => <ReactNode/>, hint?:{x,y,label,dir} }

function PrototypeHint({ x, y, label, dir }) {
  const flagBelow = dir === 'down';
  return (
    <div
      className="proto-hint"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        zIndex: 25,
        pointerEvents: 'none',
      }}
    >
      <span className="proto-pulse"></span>
      <span className="proto-pulse proto-pulse-2"></span>
      <span className="proto-dot"></span>
      <span
        className="proto-flag"
        style={{
          position: 'absolute',
          left: '50%',
          top: flagBelow ? 'calc(100% + 8px)' : 'auto',
          bottom: flagBelow ? 'auto' : 'calc(100% + 8px)',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </div>
  );
}

function PrototypeApp({ flow, kicker = 'Clickable Prototype', overviewHref = 'Handoff Overview.html' }) {
  usePrefs();
  useT();

  const [idx, setIdx] = React.useState(0);
  const [transitioning, setTransitioning] = React.useState(false);
  const step = flow[idx];

  const advance = React.useCallback(() => {
    setTransitioning(true);
    setTimeout(() => {
      setIdx((i) => (i + 1) % flow.length);
      setTransitioning(false);
    }, 200);
  }, [flow.length]);

  const back = React.useCallback(() => {
    if (idx === 0) return;
    setTransitioning(true);
    setTimeout(() => {
      setIdx((i) => Math.max(0, i - 1));
      setTransitioning(false);
    }, 200);
  }, [idx]);

  const reset = () => setIdx(0);

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      if (e.key === ' ' || e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        advance();
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        e.preventDefault();
        back();
      } else if (e.key === 'r' || e.key === 'R') {
        reset();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [advance, back]);

  const nextStep = flow[(idx + 1) % flow.length];

  return (
    <div className="proto-root">
      <header className="proto-head">
        <div className="proto-edition">
          <span className="proto-mark">AP</span>
          <div>
            <div className="proto-edition-title">Aurelia <em>Premier</em></div>
            <div className="proto-edition-sub">{kicker}</div>
          </div>
        </div>
        <div className="proto-step">
          <div className="proto-step-num">
            <span className="proto-step-now">{String(idx + 1).padStart(2, '0')}</span>
            <span className="proto-step-of">/ {String(flow.length).padStart(2, '0')}</span>
          </div>
          <div className="proto-step-body">
            <div className="proto-step-name">{step.title}</div>
            <div className="proto-step-sub">{step.sub}</div>
          </div>
        </div>
        <div className="proto-actions">
          <button className="proto-btn" onClick={back} disabled={idx === 0} aria-label="Zurück">←</button>
          <button className="proto-btn" onClick={reset} aria-label="Neu starten">↺</button>
          <a className="proto-btn proto-btn-link" href={overviewHref}>Übersicht</a>
        </div>
      </header>

      <div className="proto-stage">
        <div
          className={'proto-phone-wrap' + (transitioning ? ' is-fading' : '')}
          onClick={advance}
          role="button"
          tabIndex={0}
          aria-label={`Weiter zum nächsten Schritt: ${nextStep.name}`}
        >
          <PhoneFrame theme="A" scheme="light">
            {step.render()}
            {step.hint && <PrototypeHint {...step.hint} />}
          </PhoneFrame>
        </div>
      </div>

      <footer className="proto-foot">
        <div className="proto-dots">
          {flow.map((s, i) => (
            <button
              key={s.id}
              className={'proto-dot-btn' + (i === idx ? ' is-active' : i < idx ? ' is-done' : '')}
              onClick={() => setIdx(i)}
              aria-label={`Schritt ${i + 1}: ${s.name}`}
            >
              <span className="proto-dot-mark"></span>
              <span className="proto-dot-label">
                <span className="proto-dot-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="proto-dot-name">{s.name}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="proto-hint-bar">
          <kbd>Tippe</kbd> oder <kbd>Leertaste</kbd> für weiter ·
          <kbd>←</kbd> zurück · <kbd>R</kbd> Neustart
        </div>
      </footer>
    </div>
  );
}

function mountPrototype(flow, opts = {}) {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<PrototypeApp flow={flow} {...opts} />);
}

Object.assign(window, { PrototypeApp, PrototypeHint, mountPrototype });
