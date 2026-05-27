// system.jsx — i18n + TbdStamp + system-wide hooks.
//
// One small file for the bits the Tweaks panel + plan.md call out as
// "system layer":
//   • I18N store + useT() hook
//   • setLocale / getLocale + ↓ subscribe so every screen re-renders on switch
//   • EngineMockStamp — rotated scarlet stamp for sim-engine-mocked screens
//   • TbdStamp — neutral outline pill for "indicated only" features
//
// Strings live inline (no fetch — Babel-Standalone has no FS access). DE is
// the source of truth; EN is curated for the screens called out in plan.md
// §14a. Untranslated keys fall back to DE then to the key string itself.

// ───────────── I18N ─────────────

const I18N = {
  // Common UI verbs
  'app.tagline':                  { de:'Sonntagszeitung des Fußballs.', en:'The Sunday paper of football.' },
  'common.advance':               { de:'Anpfiff', en:'Kick-off' },
  'common.next':                  { de:'Weiter', en:'Next' },
  'common.back':                  { de:'Zurück', en:'Back' },
  'common.cancel':                { de:'Abbrechen', en:'Cancel' },
  'common.save':                  { de:'Speichern', en:'Save' },
  'common.delete':                { de:'Löschen', en:'Delete' },
  'common.confirm':               { de:'Bestätigen', en:'Confirm' },
  'common.skip':                  { de:'Überspringen', en:'Skip' },
  'common.close':                 { de:'Schließen', en:'Close' },
  'common.more':                  { de:'Mehr', en:'More' },
  'common.search':                { de:'Suchen', en:'Search' },
  'common.filter':                { de:'Filter', en:'Filter' },
  'common.sort':                  { de:'Sortieren', en:'Sort' },
  'common.today':                 { de:'Heute', en:'Today' },
  'common.yesterday':             { de:'Gestern', en:'Yesterday' },
  'common.now':                   { de:'jetzt', en:'now' },
  'common.minutes_ago':           { de:'vor {n} Min.', en:'{n} min ago' },
  'common.hours_ago':             { de:'vor {n} Std.', en:'{n} h ago' },
  'common.days_ago':              { de:'vor {n} Tagen', en:'{n} d ago' },

  // Hub
  'hub.kicker':                   { de:'Sonntagszeitung des Fußballs.', en:'The Sunday paper of football.' },
  'hub.title':                    { de:'Büro', en:'Office' },
  'hub.next_match':               { de:'Nächstes Spiel', en:'Next match' },
  'hub.advance':                  { de:'Weiter', en:'Advance' },
  'hub.advance_days':             { de:'+{n} Tage', en:'+{n} days' },
  'hub.tile.inbox':               { de:'Posteingang', en:'Inbox' },
  'hub.tile.squad':               { de:'Kader', en:'Squad' },
  'hub.tile.tactics':             { de:'Taktik', en:'Tactics' },
  'hub.tile.training':            { de:'Training', en:'Training' },
  'hub.tile.transfers':           { de:'Transferbüro', en:'Transfer Office' },
  'hub.tile.board':               { de:'Vorstand', en:'Board' },
  'hub.tile.finance':             { de:'Finanzen', en:'Finance' },
  'hub.tile.stadium':             { de:'Stadion', en:'Stadium' },
  'hub.flag.new_messages':        { de:'{n} neue Nachrichten', en:'{n} new messages' },
  'hub.flag.contract_expiring':   { de:'2 Verträge laufen aus', en:'2 contracts expiring' },
  'hub.flag.board_meeting':       { de:'Vorstandssitzung Di.', en:'Board meeting Tue.' },
  'hub.flag.match_close':         { de:'Anpfiff in {time}', en:'Kick-off in {time}' },

  // Inbox
  'inbox.title':                  { de:'Posteingang', en:'Inbox' },
  'inbox.empty.title':             { de:'Alles erledigt.', en:'All done.' },
  'inbox.empty.body':             { de:'Schalte fünf Minuten ab. Wir holen Dich ab.', en:'Take five. We\u2019ll fetch you when something happens.' },
  'inbox.action.accept':          { de:'Annehmen', en:'Accept' },
  'inbox.action.defer':           { de:'Vertagen', en:'Defer' },
  'inbox.action.decline':         { de:'Ablehnen', en:'Decline' },
  'inbox.tone.board':             { de:'Vorstand', en:'Board' },
  'inbox.tone.media':             { de:'Presse', en:'Press' },
  'inbox.tone.sponsor':           { de:'Sponsor', en:'Sponsor' },
  'inbox.tone.scout':             { de:'Scout', en:'Scout' },
  'inbox.tone.fan':               { de:'Fanclub', en:'Fans' },

  // Squad
  'squad.title':                  { de:'Kader', en:'Squad' },
  'squad.first_team':             { de:'Erste Mannschaft', en:'First team' },
  'squad.col.name':               { de:'Name', en:'Name' },
  'squad.col.pos':                { de:'Pos', en:'Pos' },
  'squad.col.age':                { de:'Alter', en:'Age' },
  'squad.col.str':                { de:'Stärke', en:'Strength' },
  'squad.col.tal':                { de:'Talent', en:'Talent' },
  'squad.col.form':               { de:'Form', en:'Form' },
  'squad.col.contract':           { de:'Vertrag', en:'Contract' },
  'squad.pos.tw':                 { de:'TW', en:'GK' },
  'squad.pos.iv':                 { de:'IV', en:'CB' },
  'squad.pos.av':                 { de:'AV', en:'FB' },
  'squad.pos.dm':                 { de:'DM', en:'DM' },
  'squad.pos.zm':                 { de:'ZM', en:'CM' },
  'squad.pos.om':                 { de:'OM', en:'AM' },
  'squad.pos.st':                 { de:'ST', en:'ST' },

  // Match
  'match.kickoff':                { de:'Anpfiff', en:'Kick-off' },
  'match.halftime':               { de:'Halbzeit', en:'Half-time' },
  'match.fulltime':               { de:'Abpfiff', en:'Full-time' },
  'match.tab.feed':               { de:'Reportage', en:'Match Report' },
  'match.tab.ticker':             { de:'2D-Ticker', en:'2D Pitch' },
  'match.tab.lineup':             { de:'Aufstellung', en:'Line-up' },
  'match.tempo':                  { de:'Tempo', en:'Tempo' },
  'match.tempo.x1':               { de:'1×', en:'1×' },
  'match.tempo.x2':               { de:'2×', en:'2×' },
  'match.tempo.x4':               { de:'4×', en:'4×' },
  'match.pause':                  { de:'Pause', en:'Pause' },
  'match.substitute':             { de:'Wechsel', en:'Substitute' },
  'match.event.goal':             { de:'TOR!', en:'GOAL!' },
  'match.event.chance':           { de:'Chance', en:'Chance' },
  'match.event.card':             { de:'Karte', en:'Card' },
  'match.event.sub':              { de:'Wechsel', en:'Sub' },
  'match.event.set':              { de:'Standard', en:'Set piece' },

  // Halftime
  'halftime.formation':           { de:'Formation', en:'Formation' },
  'halftime.mentality':           { de:'Mentalität', en:'Mentality' },
  'halftime.mentality.safe':      { de:'Sichern', en:'Defend' },
  'halftime.mentality.balanced':  { de:'Ausgeglichen', en:'Balanced' },
  'halftime.mentality.press':     { de:'Drücken', en:'Push' },
  'halftime.suggest_sub':         { de:'Wechsel-Vorschlag', en:'Sub suggestion' },
  'halftime.more_tactics':        { de:'Mehr Taktik', en:'More tactics' },

  // Finance
  'finance.title':                { de:'Finanzen', en:'Finance' },
  'finance.tab.operations':       { de:'Betrieb', en:'Operations' },
  'finance.tab.investment':       { de:'Investition', en:'Investment' },
  'finance.tab.history':          { de:'Verlauf', en:'History' },
  'finance.levy':                 { de:'Verbandsabgabe', en:'League Levy' },
  'finance.balance':              { de:'Monatssaldo', en:'Monthly P&L' },

  // Stadium
  'stadium.title':                { de:'Stadion', en:'Stadium' },
  'stadium.addon':                { de:'Anbau', en:'Stand upgrade' },
  'stadium.capacity':             { de:'Kapazität', en:'Capacity' },
  'stadium.seats':                { de:'Sitzplätze', en:'Seats' },
  'stadium.standing':             { de:'Stehplätze', en:'Standing' },
  'stadium.vip':                  { de:'VIP', en:'VIP' },
  'stadium.roi':                  { de:'Amortisation', en:'Payback' },

  // Board / Press / Negotiation
  'board.title':                  { de:'Vorstandsvertrauen', en:'Board Confidence' },
  'board.confidence':             { de:'Vertrauen', en:'Confidence' },
  'press.title':                  { de:'Pressekonferenz', en:'Press Conference' },
  'press.tone.polite':            { de:'höflich', en:'polite' },
  'press.tone.sharp':             { de:'kantig', en:'sharp' },
  'press.tone.sarcasm':           { de:'sarkastisch', en:'sarcastic' },
  'press.tone.boardquote':        { de:'Vorstandszitat', en:'Quote board' },
  'press.outcome.board':          { de:'Vorstand', en:'Board' },
  'press.outcome.fans':           { de:'Fans', en:'Fans' },
  'press.outcome.sponsor':        { de:'Sponsor', en:'Sponsor' },
  'transfer.title':               { de:'Spielervertrag', en:'Player Contract' },
  'transfer.salary':              { de:'Gehalt', en:'Salary' },
  'transfer.duration':            { de:'Laufzeit', en:'Duration' },
  'transfer.bonus':               { de:'Bonus', en:'Bonus' },
  'transfer.release_clause':      { de:'Ausstiegsklausel', en:'Release clause' },
  'transfer.counter_offer':       { de:'Gegenangebot', en:'Counter-offer' },

  // Settings & tweaks
  'settings.title':               { de:'Einstellungen', en:'Settings' },
  'settings.section.appearance':  { de:'Darstellung', en:'Appearance' },
  'settings.section.language':    { de:'Sprache', en:'Language' },
  'settings.section.gameplay':    { de:'Spielmechanik', en:'Gameplay' },
  'settings.section.account':     { de:'Konto', en:'Account' },
  'settings.section.cloud':       { de:'Cloud-Sync', en:'Cloud sync' },
  'settings.section.privacy':     { de:'Datenschutz', en:'Privacy' },
  'settings.scheme.light':        { de:'Hell', en:'Light' },
  'settings.scheme.dark':         { de:'Dunkel', en:'Dark' },
  'settings.scheme.auto':         { de:'Automatisch', en:'Automatic' },
  'settings.density.compact':     { de:'Kompakt', en:'Compact' },
  'settings.density.pro':         { de:'Profi', en:'Pro' },
  'settings.motion.full':         { de:'Volle Animationen', en:'Full motion' },
  'settings.motion.reduced':      { de:'Reduzierte Animationen', en:'Reduced motion' },
  'settings.cloud.synced':        { de:'Letzter Sync vor {n} Min.', en:'Last synced {n} min ago' },
  'settings.cloud.conflict':      { de:'Konflikt – Karriere klären', en:'Conflict — resolve save' },

  // Tweaks panel
  'tweaks.title':                 { de:'Tweaks', en:'Tweaks' },
  'tweaks.section.preview':       { de:'Vorschau', en:'Preview' },
  'tweaks.section.theme':         { de:'Theme', en:'Theme' },
  'tweaks.section.system':        { de:'System', en:'System' },
  'tweaks.club':                  { de:'Klubfarbe', en:'Club colour' },
  'tweaks.scheme':                { de:'Schema', en:'Scheme' },
  'tweaks.lang':                  { de:'Sprache', en:'Language' },
  'tweaks.density':               { de:'Datendichte', en:'Density' },
  'tweaks.motion':                { de:'Animationen', en:'Motion' },
  'tweaks.cloud_demo':            { de:'Cloud-Sync (Demo)', en:'Cloud sync (demo)' },
  'tweaks.note':                  { de:'Tweaks beeinflussen die Vorschau-Banner. Im Production-App wirken sie auf alle Screens.',
                                    en:'Tweaks affect the preview banners. In the production app they apply to every screen.' },

  // Onboarding
  'onboarding.country':           { de:'Land & Liga', en:'Country & league' },
  'onboarding.club':              { de:'Verein', en:'Club' },
  'onboarding.manager':           { de:'Manager', en:'Manager' },
  'onboarding.start':             { de:'Karriere starten', en:'Start career' },
  'onboarding.dice':              { de:'Würfeln', en:'Roll' },

  // Tabloid headlines (curated EN — Sun/Mirror register, not literal)
  'tabloid.triumph.headline':     { de:'Brody schießt sich in die Herzen',           en:'Brody banged in goals — and our hearts' },
  'tabloid.triumph.sub':          { de:'Vom Mittelmaß zum Vizemeister in 38 Spielen.', en:'Mid-table no more — 38 games, second place, one cracking story.' },
  'tabloid.storm.headline':       { de:'Drei in Folge — der Trainer wankt',          en:'Three on the trot — gaffer in the firing line' },
  'tabloid.storm.sub':            { de:'Vorstand schweigt. Fanclub murrt. Sonntag muss er liefern.', en:'Board silent. Fans fuming. Sunday is do-or-die.' },
  'tabloid.routine.headline':     { de:'Pflichtsieg, kein Glanz',                    en:'Job done, no fireworks' },
  'tabloid.skandal.headline':     { de:'Stürmer fehlt beim Mannschaftsbus',          en:'Striker missed the team bus' },

  // System stamps
  'stamp.engine_mock':            { de:'Engine · Mock', en:'Engine · Mock' },
  'stamp.engine_mock_sub':        { de:'Simulations-Tick gemockt, UI komplett',
                                    en:'Match tick is mocked — UI is complete' },
  'stamp.tbd':                    { de:'In Arbeit', en:'TBD' },
};

// Active locale + subscribers (so the whole tree re-renders on switch)
const __locale = { current: 'de', listeners: new Set() };
const getLocale = () => __locale.current;
const setLocale = (l) => {
  if (l !== 'de' && l !== 'en') return;
  if (__locale.current === l) return;
  __locale.current = l;
  document.documentElement.setAttribute('lang', l);
  __locale.listeners.forEach(fn => { try { fn(l); } catch{} });
};
const subscribeLocale = (fn) => {
  __locale.listeners.add(fn);
  return () => __locale.listeners.delete(fn);
};

// useT — returns a t(key, vars?) function that re-renders on locale change.
function useT(){
  const [, setN] = React.useReducer(x => x+1, 0);
  React.useEffect(() => subscribeLocale(() => setN()), []);
  return React.useCallback((key, vars) => {
    const row = I18N[key];
    const raw = (row && (row[__locale.current] || row.de)) || key;
    if (!vars) return raw;
    return Object.keys(vars).reduce((s,k) => s.replaceAll('{'+k+'}', String(vars[k])), raw);
  }, []);
}

// Plain getter for one-off lookups outside React.
function tStatic(key, vars){
  const row = I18N[key];
  const raw = (row && (row[__locale.current] || row.de)) || key;
  if (!vars) return raw;
  return Object.keys(vars).reduce((s,k) => s.replaceAll('{'+k+'}', String(vars[k])), raw);
}

// ───────────── EngineMockStamp ─────────────
// Rotated scarlet tabloid stamp. Use on match-feed, 2D-ticker, halftime,
// KI-reaction screens — anywhere the live sim is currently mocked.

function EngineMockStamp({ corner='br', label, sub, size='md' }){
  const t = useT();
  const txt    = label || t('stamp.engine_mock');
  // Sub-text suppressed by default now — keeps the stamp out of the way of
  // headers and other chrome. Pass `sub` explicitly to show extra text.
  const subTxt = sub;
  const pos = ({
    tl: { top:6,  left:6 },
    tr: { top:6,  right:6 },
    bl: { bottom:6, left:6 },
    br: { bottom:6, right:6 },
  })[corner] || { bottom:6, right:6 };
  const scale = size === 'sm' ? 0.72 : size === 'lg' ? 1.0 : 0.86;
  return (
    <div style={{
      position:'absolute', ...pos, zIndex:50,
      pointerEvents:'none',
      transform:`rotate(-4deg) scale(${scale})`,
      transformOrigin: corner.endsWith('l') ? 'left top' : 'right top',
      opacity:.82,
    }}>
      <div style={{
        display:'inline-flex', flexDirection:'column', alignItems:'flex-start',
        padding:'3px 7px 4px',
        border:'1.5px solid #b7301b',
        borderRadius:4,
        background:'rgba(246,220,213,.78)',
        fontFamily:'Inter, system-ui, sans-serif',
        color:'#b7301b',
      }}>
        <span style={{
          fontSize:8.5, fontWeight:800, letterSpacing:'.16em',
          textTransform:'uppercase', lineHeight:1,
        }}>{txt}</span>
        {subTxt ? (
          <span style={{
            fontSize:7.5, fontWeight:600, letterSpacing:'.08em',
            color:'#7a2515', marginTop:2, lineHeight:1.1,
            textTransform:'uppercase', maxWidth:160,
          }}>{subTxt}</span>
        ) : null}
      </div>
    </div>
  );
}

// ───────────── TbdStamp ─────────────
// Neutral outline pill — for "indicated only" UI bits inside a screen.

function TbdStamp({ label, style }){
  const t = useT();
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6,
      padding:'2px 8px',
      borderRadius:99,
      border:'1px dashed #7a6f63',
      color:'#7a6f63',
      fontSize:9.5, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase',
      fontFamily:'Inter, system-ui, sans-serif',
      background:'rgba(255,255,255,.5)',
      ...style,
    }}>
      <span style={{
        width:5, height:5, borderRadius:'50%', background:'#7a6f63',
      }}/>
      {label || t('stamp.tbd')}
    </span>
  );
}

// Helper — paint the global Direction-A theme with a club's primary color.
// We mutate THEMES.A in place; components that read `t.accent` will pick up
// the new value on next render (App() calls usePrefs() so the whole tree
// re-renders when the Tweaks panel writes a new clubId).
//
// Note: only THEMES.A.{light,dark} are mutated. THEMES.A_hafenstadt and the
// other registered club themes stay frozen — the ClubHub showcase relies on
// them keeping their original tints.
function applyClubColor(clubId){
  if (typeof CLUB_REGISTRY === 'undefined' || typeof THEMES === 'undefined') return;
  const c = CLUB_REGISTRY[clubId];
  if (!c) return;
  // Normalize to 7-char #RRGGBB before appending alpha — defensive against
  // accidental 3-char (#fff) or 8-char (#RRGGBBAA) primaries, which would
  // otherwise yield invalid 10-char hex when we append '1f'.
  const normalize = (hex) => {
    if (!hex || typeof hex !== 'string') return '#000000';
    let h = hex.trim();
    if (!h.startsWith('#')) h = '#' + h;
    if (h.length === 4) {
      // #rgb → #rrggbb
      h = '#' + h[1]+h[1] + h[2]+h[2] + h[3]+h[3];
    } else if (h.length === 9) {
      // #RRGGBBAA → strip existing alpha
      h = h.slice(0, 7);
    }
    return h.slice(0, 7);
  };
  const base = normalize(c.primary);
  const alpha = (hex, a) => hex + a;
  THEMES.A.light.accent     = base;
  THEMES.A.light.accentSoft = alpha(base, '1f');
  THEMES.A.dark.accent      = base;
  THEMES.A.dark.accentSoft  = alpha(base, '33');
}

// ───────────── System-wide preference store ─────────────
// One simple subscribable object. The Tweaks panel writes; preview banners +
// individual screens (later) can read. We keep this minimal — full per-screen
// reaction is a Phase-1 task in plan.md.

const __prefs = {
  state: { clubId:'hafenstadt', scheme:'light', density:'compact', motion:'full', cloud:'synced' },
  listeners: new Set(),
};
const getPrefs = () => __prefs.state;
const setPrefs = (patch) => {
  const prev = __prefs.state;
  __prefs.state = { ...prev, ...patch };
  // Side-effects:
  document.documentElement.classList.toggle('motion-reduce', __prefs.state.motion === 'reduced');
  if (patch.clubId && patch.clubId !== prev.clubId) applyClubColor(patch.clubId);
  __prefs.listeners.forEach(fn => { try { fn(__prefs.state); } catch{} });
};
const subscribePrefs = (fn) => {
  __prefs.listeners.add(fn);
  return () => __prefs.listeners.delete(fn);
};
function usePrefs(){
  const [s, setS] = React.useState(__prefs.state);
  React.useEffect(() => subscribePrefs((next) => setS(next)), []);
  return s;
}

Object.assign(window, {
  I18N, useT, tStatic, getLocale, setLocale, subscribeLocale,
  EngineMockStamp, TbdStamp,
  getPrefs, setPrefs, subscribePrefs, usePrefs,
  applyClubColor,
  useFocusTrap,
});

// ─────────────────────────────────────────────────────────────────
// useFocusTrap — Keyboard focus management for dialog-like surfaces.
//
// Pattern (plan.md §10): every <Sheet>, <Dialog>, and <Popover> on the
// screen MUST keep keyboard focus inside until the user closes it. The hook
// returns a ref that, when attached to the modal root, traps Tab/Shift+Tab
// inside the modal's focusable descendants and restores focus on unmount.
//
// Usage:
//   function MyDialog({open, onClose}) {
//     const ref = useFocusTrap(open, onClose);
//     return open && (
//       <div ref={ref} role="dialog" aria-modal="true">…</div>
//     );
//   }
// ─────────────────────────────────────────────────────────────────
function useFocusTrap(active, onEscape){
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!active || !ref.current) return;
    const node = ref.current;
    const previouslyFocused = document.activeElement;
    const SELECTOR = [
      'a[href]','button:not([disabled])','textarea:not([disabled])',
      'input:not([disabled]):not([type="hidden"])','select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');
    const getFocusables = () => Array.from(node.querySelectorAll(SELECTOR))
      .filter(el => !el.hasAttribute('aria-hidden') && el.offsetParent !== null);
    // Move focus into the node on mount
    const first = getFocusables()[0];
    if (first) first.focus();
    const onKey = (e) => {
      if (e.key === 'Escape' && onEscape) { e.stopPropagation(); onEscape(); return; }
      if (e.key !== 'Tab') return;
      const items = getFocusables();
      if (!items.length) return;
      const firstEl = items[0];
      const lastEl  = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault(); lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault(); firstEl.focus();
      }
    };
    node.addEventListener('keydown', onKey);
    return () => {
      node.removeEventListener('keydown', onKey);
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [active, onEscape]);
  return ref;
}
