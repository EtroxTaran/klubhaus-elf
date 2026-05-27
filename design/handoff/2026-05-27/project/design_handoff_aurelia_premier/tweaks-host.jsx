// tweaks-host.jsx — mounts the Tweaks panel into its own React root, so
// app.jsx stays untouched. Reads/writes the global `setPrefs` + `setLocale`
// from system.jsx.
//
// ─── Persistence round-trip ───────────────────────────────────────
// 1. User changes a control → handler calls `setPrefs(patch)` and
//    `setLocale(l)` so the live UI updates immediately.
// 2. Handler also posts `{type:'__edit_mode_set_keys', edits: patch}` to the
//    host. The host parses the EDITMODE-BEGIN/END JSON block below, merges
//    `edits`, and rewrites THIS file on disk.
// 3. On the next reload, this file's `DEFAULTS` already has the saved values
//    baked in, and the first-mount useEffect seeds them into the system.
//
// The local `__savedAt` ref + `Gespeichert`-flash gives the user immediate
// feedback that the round-trip was triggered — it's a UX promise, not a
// guarantee of disk-write success.

function TweaksHost(){
  const t = useT();
  const prefs = usePrefs();
  const [locale, setLocaleState] = React.useState(getLocale());
  const [savedFlash, setSavedFlash] = React.useState(0);

  // Mirror locale changes from other places (so the radio stays in sync).
  React.useEffect(() => subscribeLocale(setLocaleState), []);

  // Persisted defaults block — host overwrites JSON between markers.
  const DEFAULTS = /*EDITMODE-BEGIN*/{
    "clubId": "hafenstadt",
    "scheme": "light",
    "density": "compact",
    "motion": "full",
    "cloud": "synced",
    "locale": "de"
  }/*EDITMODE-END*/;

  // First-mount: hydrate from defaults block (in case the host has saved
  // user changes between sessions). Apply club color explicitly so the
  // first paint doesn't show the stock scarlet — setPrefs's change-detection
  // would otherwise skip the color sync since prev === next.
  React.useEffect(() => {
    setPrefs({
      clubId: DEFAULTS.clubId,
      scheme: DEFAULTS.scheme,
      density: DEFAULTS.density,
      motion: DEFAULTS.motion,
      cloud:  DEFAULTS.cloud,
    });
    applyClubColor(DEFAULTS.clubId);
    setLocale(DEFAULTS.locale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-dismiss "Gespeichert" badge after 1.4s.
  React.useEffect(() => {
    if (!savedFlash) return;
    const id = setTimeout(() => setSavedFlash(0), 1400);
    return () => clearTimeout(id);
  }, [savedFlash]);

  // Club options — derived from CLUB_REGISTRY so there's no drift between
  // the Tweaks panel and the rest of the system.
  const CLUB_OPTS = ['hafenstadt','auerbach','kaltenbach','sauveterre']
    .map(id => CLUB_REGISTRY[id])
    .filter(Boolean)
    .map(c => ({ id: c.id, label: c.name, a: c.primary }));

  const writeAndPersist = (patch) => {
    setPrefs(patch);
    // Persist via the host protocol so reloads keep the state.
    try { window.parent.postMessage({ type:'__edit_mode_set_keys', edits: patch }, '*'); }
    catch (e) { /* sandboxed iframe — no-op */ }
    setSavedFlash(Date.now());
  };
  const writeLocale = (l) => {
    setLocale(l);
    try { window.parent.postMessage({ type:'__edit_mode_set_keys', edits: { locale:l } }, '*'); }
    catch (e) { /* sandboxed iframe — no-op */ }
    setSavedFlash(Date.now());
  };

  return (
    <TweaksPanel title={t('tweaks.title')}>
      {savedFlash > 0 && (
        <div style={{
          position:'absolute', top:8, right:32, zIndex:5,
          padding:'2px 7px', borderRadius:99,
          background:'rgba(46,109,72,.18)', color:'#2e6d48',
          fontSize:9.5, fontWeight:800, letterSpacing:.4, textTransform:'uppercase',
          pointerEvents:'none',
          animation:'twkSaved .25s ease-out',
        }}>
          {getLocale() === 'de' ? '✓ Gespeichert' : '✓ Saved'}
        </div>
      )}
      <style>{`@keyframes twkSaved { from { opacity:0; transform:translateY(-3px); } to { opacity:1; transform:none; } }`}</style>
      <TweakSection label={t('tweaks.section.theme')}/>
      <TweakColor
        label={t('tweaks.club')}
        value={CLUB_OPTS.find(c => c.id === prefs.clubId)?.a || CLUB_OPTS[0].a}
        options={CLUB_OPTS.map(c => c.a)}
        onChange={(hex) => {
          const club = CLUB_OPTS.find(c => c.a === hex) || CLUB_OPTS[0];
          writeAndPersist({ clubId: club.id });
        }}
      />
      <TweakRadio
        label={t('tweaks.scheme')}
        value={prefs.scheme}
        options={[
          { value:'light', label:t('settings.scheme.light') },
          { value:'dark',  label:t('settings.scheme.dark') },
          { value:'auto',  label:t('settings.scheme.auto') },
        ]}
        onChange={(v) => writeAndPersist({ scheme: v })}
      />

      <TweakSection label={t('tweaks.section.system')}/>
      <TweakRadio
        label={t('tweaks.lang')}
        value={locale}
        options={[
          { value:'de', label:'Deutsch' },
          { value:'en', label:'English' },
        ]}
        onChange={writeLocale}
      />
      <TweakRadio
        label={t('tweaks.density')}
        value={prefs.density}
        options={[
          { value:'compact', label:t('settings.density.compact') },
          { value:'pro',     label:t('settings.density.pro') },
        ]}
        onChange={(v) => writeAndPersist({ density: v })}
      />
      <TweakRadio
        label={t('tweaks.motion')}
        value={prefs.motion}
        options={[
          { value:'full',    label:t('settings.motion.full') },
          { value:'reduced', label:t('settings.motion.reduced') },
        ]}
        onChange={(v) => writeAndPersist({ motion: v })}
      />
      <TweakSelect
        label={t('tweaks.cloud_demo')}
        value={prefs.cloud}
        options={[
          { value:'synced',     label:'Synchronisiert / Synced' },
          { value:'syncing',    label:'Synchronisiert… / Syncing…' },
          { value:'offline',    label:'Offline' },
          { value:'conflict',   label:'Konflikt / Conflict' },
        ]}
        onChange={(v) => writeAndPersist({ cloud: v })}
      />

      <TweakSection label={t('tweaks.section.preview')}/>
      <TweaksPreview prefs={prefs}/>
      <div style={{
        fontSize:10, lineHeight:1.35, color:'rgba(41,38,27,.55)',
        marginTop:2, padding:'6px 0 0',
      }}>
        {t('tweaks.note')}
      </div>
    </TweaksPanel>
  );
}

// TweaksPreview — a tiny pill-row that confirms the current tweak state
// is wired through. Shows the accent swatch, current locale, density, etc.
function TweaksPreview({prefs}){
  const t = useT();
  const CLUB_LABELS = {
    hafenstadt:'Hafenstadt', auerbach:'Auerbach',
    kaltenbach:'Kaltenbach', sauveterre:'Sauveterre',
  };
  const CLUB_HEX = {
    hafenstadt:'#0e3a5f', auerbach:'#2b6b3f',
    kaltenbach:'#4a2a2a', sauveterre:'#1f4a3a',
  };
  const CLOUD_LABEL = {
    synced:   getLocale() === 'de' ? 'Synchronisiert' : 'Synced',
    syncing:  getLocale() === 'de' ? 'Synchronisiert…' : 'Syncing…',
    offline:  'Offline',
    conflict: getLocale() === 'de' ? 'Konflikt' : 'Conflict',
  };
  const CLOUD_COLOR = {
    synced:'#3f6a2f', syncing:'#a3680f', offline:'#5a4f44', conflict:'#9b1f0a',
  };
  return (
    <div style={{
      display:'flex', flexWrap:'wrap', gap:5,
      padding:8, borderRadius:8,
      background:'rgba(255,255,255,.55)',
      border:'.5px solid rgba(0,0,0,.08)',
    }}>
      <PreviewPill swatch={CLUB_HEX[prefs.clubId]} label={CLUB_LABELS[prefs.clubId] || prefs.clubId}/>
      <PreviewPill label={prefs.scheme === 'light' ? '☀ '+t('settings.scheme.light')
                       : prefs.scheme === 'dark'  ? '☾ '+t('settings.scheme.dark')
                                                  : '⟳ '+t('settings.scheme.auto')}/>
      <PreviewPill label={getLocale().toUpperCase()}/>
      <PreviewPill label={prefs.density === 'pro' ? 'Profi/Pro' : 'Kompakt/Compact'}/>
      <PreviewPill label={prefs.motion === 'full' ? '▶︎' : '◦◦'}/>
      <PreviewPill swatch={CLOUD_COLOR[prefs.cloud]} label={CLOUD_LABEL[prefs.cloud]}/>
    </div>
  );
}

function PreviewPill({swatch, label}){
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:5,
      padding:'3px 7px',
      borderRadius:99,
      background:'rgba(255,255,255,.85)',
      border:'.5px solid rgba(0,0,0,.1)',
      fontSize:10, fontWeight:600,
      color:'#29261b',
    }}>
      {swatch ? <span style={{
        width:8, height:8, borderRadius:'50%', background:swatch,
        boxShadow:'inset 0 0 0 1px rgba(0,0,0,.08)',
      }}/> : null}
      {label}
    </span>
  );
}

// Mount into its own root, separate from the design canvas.
(function mountTweaksHost(){
  // Wait one tick to ensure system.jsx + tweaks-panel.jsx have registered
  // their globals.
  const start = () => {
    if (typeof TweaksPanel === 'undefined' || typeof useT === 'undefined') {
      // Not ready yet — try again next frame
      requestAnimationFrame(start);
      return;
    }
    let mount = document.getElementById('__tweaks-host');
    if (!mount) {
      mount = document.createElement('div');
      mount.id = '__tweaks-host';
      document.body.appendChild(mount);
    }
    ReactDOM.createRoot(mount).render(<TweaksHost/>);
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    requestAnimationFrame(start);
  }
})();
