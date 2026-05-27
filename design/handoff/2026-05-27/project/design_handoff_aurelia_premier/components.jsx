// components.jsx — Reusable App-Composites
//
// Extracted from inline screen markup per plan.md §4.2. Each composite is
// production-ready: typed props (via JSDoc), single concern, no theme-prop
// drilling beyond what its parent already passes.
//
// Story metadata is in JSDoc comments above each function — these double as
// Storybook autodocs once we migrate (plan §14d).
//
// Load order: AFTER ui.jsx (needs I, Crest, FormStrip, PillBtn, SerifH,
// THEMES) and AFTER system.jsx (needs useT, getLocale, EngineMockStamp).
// Load BEFORE the screen files so the screens can reference these names.

// ─────────────────────────────────────────────────────────────────
// HubTile — 2×N Hub-Kachel mit Icon, Titel, Subtitle und Flag
// ─────────────────────────────────────────────────────────────────
/**
 * @param {object}   p
 * @param {ReactNode} p.icon       Lucide-style icon node (sized by caller)
 * @param {string}   p.label       Big card label (translation key already resolved)
 * @param {string}   p.sub         One-line context line
 * @param {string}   [p.flag]      Scarlet accent flag, if non-empty
 * @param {string}   p.theme       Theme key (e.g. 'A', 'A_hafenstadt')
 * @param {string}   p.scheme      'light' | 'dark'
 * @param {function} [p.onClick]
 *
 * @story HubTile/Default       — icon, label, sub
 * @story HubTile/WithFlag      — adds scarlet accent line
 * @story HubTile/NoFlag        — quieter variant
 *
 * @migration  CSS-vars · uses `var(--card)`/`var(--ink)`/`var(--accent)` so a
 *             tweaks panel changing `--accent` updates the tile in place
 *             without re-rendering. theme/scheme props remain so the parent's
 *             ThemeCss/ThemeRoot scope picks up.
 */
function HubTile({ icon, label, sub, flag, theme, scheme, onClick }){
  return (
    <button onClick={onClick} style={{
      background:'var(--card)', border:'1px solid var(--rule)', borderRadius:14, padding:12,
      minHeight:96, display:'flex', flexDirection:'column', justifyContent:'space-between',
      textAlign:'left', cursor:'pointer', fontFamily:'inherit', color:'var(--ink)',
    }}>
      <div style={{display:'flex', justifyContent:'space-between'}}>
        <div style={{width:32, height:32, borderRadius:10, background:'var(--bgInk)', display:'grid', placeItems:'center'}}>{icon}</div>
        <I.ChevronRight size={14} color="currentColor" style={{color:'var(--inkSoft)'}}/>
      </div>
      <div>
        <div style={{fontSize:13, fontWeight:700, color:'var(--ink)', lineHeight:1.15}}>{label}</div>
        <div style={{fontSize:11, color:'var(--inkMute)', marginTop:2}}>{sub}</div>
        {flag && <div style={{fontSize:10, color:'var(--accent)', marginTop:4, fontWeight:600}}>· {flag}</div>}
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────
// InboxCard — Posteingang-Karte mit Tone-Glyph + 4 Aktionen
// ─────────────────────────────────────────────────────────────────
/**
 * @param {object}   p
 * @param {'board'|'media'|'sponsor'|'scout'|'fan'} p.tone
 * @param {string}   p.from       Absender / source
 * @param {string}   p.title      Subject (rendered in serif headline)
 * @param {string}   p.body       2–3 lines preview
 * @param {string}   p.time       Relative time (e.g. "vor 4 Min.")
 * @param {function} [p.onAccept]
 * @param {function} [p.onDefer]
 * @param {function} [p.onDecline]
 * @param {function} [p.onMore]
 * @param {string}   p.theme
 * @param {string}   p.scheme
 *
 * @story InboxCard/Board        — accent tone for board notices
 * @story InboxCard/Press        — neutral tone
 * @story InboxCard/Sponsor      — warm yellow tone
 * @story InboxCard/Scout        — green tone
 * @story InboxCard/Fan          — muted tone
 */
function InboxCard({ tone='board', from, title, body, time,
                     onAccept, onDefer, onDecline, onMore,
                     theme, scheme }){
  const tr = useT();
  // Tone-specific glyph/colour map. Reads CSS vars at use-site; only the
  // accent-driven backgrounds stay JS-derived since they need rgba blends.
  const t = THEMES[theme][scheme];
  const TONES = {
    board:   { bg: t.accentSoft, fgVar: 'var(--accent)',  label: tr('inbox.tone.board'),   glyph:'§' },
    media:   { bg: t.bgInk,      fgVar: 'var(--ink)',     label: tr('inbox.tone.media'),   glyph:'¶' },
    sponsor: { bg: '#e8d28a55',  fgVar: 'var(--warn)',    label: tr('inbox.tone.sponsor'), glyph:'€' },
    scout:   { bg: '#cfe0d255',  fgVar: 'var(--ok)',      label: tr('inbox.tone.scout'),   glyph:'◎' },
    fan:     { bg: t.bgInk,      fgVar: 'var(--inkMute)', label: tr('inbox.tone.fan'),     glyph:'♪' },
  };
  const tn = TONES[tone] || TONES.board;
  return (
    <article style={{background:'var(--card)', border:'1px solid var(--rule)', borderRadius:14, padding:12, marginBottom:10}}>
      <div style={{display:'flex',gap:10,alignItems:'flex-start'}}>
        <div style={{width:36,height:36,borderRadius:10,background:tn.bg,color:tn.fgVar,display:'grid',placeItems:'center',fontWeight:800,fontSize:16,flex:'0 0 36px',fontFamily:THEMES[theme].font}}>{tn.glyph}</div>
        <div style={{flex:1, minWidth:0}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',gap:8}}>
            <span style={{fontSize:11, fontWeight:700, color:tn.fgVar, letterSpacing:.3, textTransform:'uppercase'}}>{tn.label} · {from}</span>
            <span style={{fontSize:10, color:'var(--inkSoft)', whiteSpace:'nowrap'}}>{time}</span>
          </div>
          <SerifH theme={theme} style={{display:'block', fontSize:17, fontWeight:700, color:'var(--ink)', lineHeight:1.2, marginTop:2}}>{title}</SerifH>
          <div style={{fontSize:13, color:'var(--inkMute)', marginTop:4, lineHeight:1.35}}>{body}</div>
        </div>
      </div>
      <div style={{display:'flex', gap:6, marginTop:10}}>
        <PillBtn theme={theme} scheme={scheme} intent="accept"  icon={<I.Check size={14} color="#fff"/>} onClick={onAccept}>{tr('inbox.action.accept')}</PillBtn>
        <PillBtn theme={theme} scheme={scheme} intent="soft"    icon={<I.Clock size={13} color={t.ink}/>} onClick={onDefer}>{tr('inbox.action.defer')}</PillBtn>
        <PillBtn theme={theme} scheme={scheme} intent="neutral" icon={<I.X size={13} color={t.ink}/>}    onClick={onDecline}>{tr('inbox.action.decline')}</PillBtn>
        <button onClick={onMore} aria-label={tr('common.more')} style={{flex:'0 0 36px',height:36,width:36,borderRadius:999,border:'1px solid var(--rule)',background:'transparent',display:'grid',placeItems:'center', cursor:'pointer', color:'var(--ink)'}}><I.More color={t.ink} size={16}/></button>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────
// MatchEvent — Eine Zeile im Reportage-Feed
// ─────────────────────────────────────────────────────────────────
/**
 * @param {object} p
 * @param {string} p.min                  Minute label ("12'", "45+2'", "HZ")
 * @param {'goal'|'chance'|'card'|'sub'|'set'|'whistle'} p.kind
 * @param {string} p.title                Headline (serif, accent if goal)
 * @param {string} p.sub                  Italic detail line
 * @param {string} [p.score]              Optional score chip ("2:1")
 * @param {string} p.theme
 * @param {string} p.scheme
 * @param {boolean} [p.last]              Suppresses bottom border
 *
 * @story MatchEvent/Goal              — accent goal headline
 * @story MatchEvent/Chance            — warm chance
 * @story MatchEvent/SetPiece          — uses MiniPitch glyph
 * @story MatchEvent/Whistle           — neutral whistle
 */
function MatchEvent({ min, kind, title, sub, score, theme, scheme, last }){
  const isGoal = kind === 'goal';
  const META = {
    goal:    { c:'var(--accent)',  letter:'⚽' },
    chance:  { c:'var(--warn)',    letter:'⟶' },
    card:    { c:'var(--warn)',    letter:'▮' },
    sub:     { c:'var(--inkMute)', letter:'⇅' },
    set:     { c:'var(--inkMute)', letter:'⌖' },
    whistle: { c:'var(--inkSoft)', letter:'❘' },
  };
  const k = META[kind] || META.set;
  // Tint background still needs hex+alpha (color-mix not yet idiomatic here).
  const t = THEMES[theme][scheme];
  const tintMap = { goal:t.accent, chance:t.warn, card:t.warn, sub:t.inkMute, set:t.inkMute, whistle:t.inkSoft };
  const tint = (tintMap[kind] || tintMap.set) + '22';
  return (
    <div style={{display:'flex', gap:10, padding:'10px 0', borderBottom: last?'none':'1px solid var(--rule)'}}>
      <div style={{flex:'0 0 44px', textAlign:'right'}}>
        <div style={{fontFamily:'JetBrains Mono', fontSize:13, fontWeight:700, color:'var(--inkMute)', fontVariantNumeric:'tabular-nums'}}>{min}</div>
        {score && <div style={{fontFamily:'JetBrains Mono', fontSize:10, fontWeight:700, color:'var(--accent)', marginTop:2}}>{score}</div>}
      </div>
      <div style={{flex:'0 0 22px', display:'flex', flexDirection:'column', alignItems:'center', paddingTop:3}}>
        {kind === 'set'
          ? <MiniPitch size={20} color={t.inkMute}/>
          : <span style={{display:'inline-block', width:22, height:22, borderRadius:6, background:tint, color:k.c, fontWeight:800, fontSize:11, textAlign:'center', lineHeight:'22px'}}>{k.letter}</span>}
      </div>
      <div style={{flex:1}}>
        <SerifH theme={theme} style={{display:'block', fontSize: isGoal?17:14, fontWeight: isGoal?800:700, color: isGoal?'var(--accent)':'var(--ink)', lineHeight:1.15}}>{title}</SerifH>
        <div style={{fontSize:12, color:'var(--inkMute)', marginTop:1, fontFamily:THEMES[theme].font, fontStyle: isGoal?'normal':'italic'}}>{sub}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// StatStrip — Gegenüberliegende Werte mit Gewinner-Akzent
// ─────────────────────────────────────────────────────────────────
/**
 * @param {object} p
 * @param {string} p.label
 * @param {string|ReactNode} p.a
 * @param {string|ReactNode} p.b
 * @param {'a'|'b'} [p.accentSide]  Highlights one side with accent color
 * @param {string} [p.hint]         Italic centered hint line below
 * @param {boolean} [p.mono]        Mono font for numeric a/b. Default true.
 * @param {boolean} [p.last]
 * @param {string} p.theme
 * @param {string} p.scheme
 *
 * @story StatStrip/Default        — numeric a/b, no hint
 * @story StatStrip/WinnerAccent   — accent on side b
 * @story StatStrip/WithHint       — italic hint line below
 * @story StatStrip/NonNumeric     — accepts ReactNode for a/b (e.g. FormStrip)
 */
function StatStrip({ label, a, b, accentSide, hint, mono=true, last, theme, scheme }){
  // Pure CSS-vars — no JS theme reads needed.
  return (
    <div style={{padding:'10px 0', borderBottom: last?'none':'1px solid var(--rule)'}}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:8}}>
        <div style={{fontFamily: mono?'JetBrains Mono':'inherit', fontSize:14, fontWeight:700, color: accentSide==='a' ? 'var(--accent)' : 'var(--ink)', minWidth:64}}>{a}</div>
        <div style={{fontSize:10, color:'var(--inkSoft)', letterSpacing:.6, textTransform:'uppercase', fontWeight:700}}>{label}</div>
        <div style={{fontFamily: mono?'JetBrains Mono':'inherit', fontSize:14, fontWeight:700, color: accentSide==='b' ? 'var(--accent)' : 'var(--ink)', minWidth:64, display:'flex', justifyContent:'flex-end'}}>{b}</div>
      </div>
      {hint && <div style={{fontSize:10, color:'var(--inkSoft)', textAlign:'center', marginTop:2, fontStyle:'italic', fontFamily: theme ? THEMES[theme].font : 'Newsreader, Georgia, serif'}}>{hint}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// AdvanceButton — Großer Hub-CTA mit Tages-Offset-Stempel
// ─────────────────────────────────────────────────────────────────
/**
 * @param {object} p
 * @param {string|ReactNode} p.label    Localized main label
 * @param {number} [p.daysOffset]       Days advanced — rendered as stamp top-left
 * @param {function} [p.onClick]
 * @param {string} p.theme
 * @param {string} p.scheme
 *
 * @story AdvanceButton/Default     — 3 days
 * @story AdvanceButton/NoStamp     — no daysOffset
 * @story AdvanceButton/Long        — multi-day jump
 */
function AdvanceButton({ label, daysOffset, onClick, theme, scheme }){
  const tr = useT();
  return (
    <button onClick={onClick} style={{
      width:'100%', height:56, borderRadius:16, border:'none',
      background:'var(--ink)', color:'var(--bg)', fontWeight:700, fontSize:16,
      display:'flex', alignItems:'center', justifyContent:'center', gap:10,
      fontFamily:'inherit', position:'relative', cursor:'pointer',
      boxShadow:'0 8px 20px -8px rgba(0,0,0,.5)'
    }}>
      {typeof daysOffset === 'number' && (
        <span style={{position:'absolute',left:14,top:7,fontSize:9,fontWeight:700,color:'var(--bgInk)',letterSpacing:.8,opacity:.8}}>
          {tr('hub.advance_days', {n:daysOffset}).toUpperCase()}
        </span>
      )}
      {label}
      <I.ArrowRight size={20} color="currentColor" style={{color:'var(--bg)'}}/>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────
// NextMatchCard — Hub-Tile mit Kicker, Score-Strip und Form
// ─────────────────────────────────────────────────────────────────
/**
 * @param {object} p
 * @param {string} p.home           Home team display name
 * @param {string} p.away           Away team display name
 * @param {string} p.dateLine       e.g. "So 24. Mai · 15:30"
 * @param {string} p.metaLine       e.g. "Aurelia Premier · 32. Spieltag · Heim"
 * @param {string} p.theme
 * @param {string} p.scheme
 * @param {ReactNode} [p.aside]     Optional right-hand insert (xG, kickoff timer)
 *
 * @story NextMatchCard/Default
 * @story NextMatchCard/WithCountdown
 */
function NextMatchCard({ home, away, dateLine, metaLine, theme, scheme, aside }){
  const isDe = getLocale() === 'de';
  return (
    <div style={{background:'var(--card)', border:'1px solid var(--rule)', borderRadius:16, padding:'14px 14px 12px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
        <span style={{fontSize:10, fontWeight:800, letterSpacing:1.2, color:'var(--accent)'}}>{(isDe ? 'Nächster Termin' : 'Next match').toUpperCase()}</span>
        <span style={{fontSize:11, color:'var(--inkMute)', fontVariantNumeric:'tabular-nums'}}>{dateLine}</span>
      </div>
      <SerifH theme={theme} style={{display:'block', fontSize:22, fontWeight:700, lineHeight:1.1, marginTop:6, color:'var(--ink)'}}>
        {home} <span style={{color:'var(--inkSoft)'}}>vs.</span> {away}
      </SerifH>
      <div style={{fontSize:12, color:'var(--inkMute)', marginTop:4}}>{metaLine}</div>
      {aside ? <div style={{marginTop:10}}>{aside}</div> : null}
    </div>
  );
}

// Mark all extracted composites as Storybook-ready by tagging them on the
// global so a future build step can scan for them.
Object.assign(window, {
  HubTile, InboxCard, MatchEvent, StatStrip, AdvanceButton, NextMatchCard,
});

// ─────────────────────────────────────────────────────────────────
// PressAnswerCard — Pressekonferenz-Antwort mit Outcome-Pills
// ─────────────────────────────────────────────────────────────────
/**
 * @param {object}   p
 * @param {string}   p.tone         Tonalität ('höflich' | 'kantig' | 'sarkasmus' | 'neutral')
 * @param {string}   p.quote        Antwort-Text (wird in Anführungszeichen + Serif gerendert)
 * @param {Array<{w:string,d:number}>} p.predict   Outcome-Vorhersagen — `w`=Wer, `d`=Stimmungsdelta
 * @param {function} [p.onPick]
 * @param {string}   p.theme
 * @param {string}   p.scheme
 *
 * @story PressAnswerCard/Polite       — höfliche Tonalität
 * @story PressAnswerCard/Sharp        — kantige Tonalität, höheres Risiko
 * @story PressAnswerCard/Sarcastic    — sarkastische Tonalität
 * @story PressAnswerCard/Neutral      — neutrale Tonalität
 */
function PressAnswerCard({ tone, quote, predict, onPick, theme, scheme }){
  const tr = useT();
  const isDe = getLocale() === 'de';
  return (
    <button onClick={onPick} style={{
      display:'block', width:'100%', textAlign:'left', cursor:'pointer',
      background:'var(--card)', border:'1px solid var(--rule)', borderRadius:14,
      padding:'12px 14px', marginBottom:8, fontFamily:'inherit'
    }}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6}}>
        <span style={{fontSize:9.5, fontWeight:800, color:'var(--accent)', letterSpacing:.8, textTransform:'uppercase'}}>{tone}</span>
        <span style={{fontSize:10, color:'var(--inkSoft)'}}>{isDe ? 'vorhergesagte Wirkung' : 'predicted impact'}</span>
      </div>
      <SerifH theme={theme} style={{display:'block', fontSize:14, fontWeight:700, color:'var(--ink)', lineHeight:1.3}}>{isDe ? `„${quote}"` : `"${quote}"`}</SerifH>
      <div style={{display:'flex', gap:5, marginTop:8, flexWrap:'wrap'}}>
        {predict.map((p,j)=>(
          <OutcomeChip key={j} theme={theme} scheme={scheme} who={p.w} d={p.d}/>
        ))}
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────
// PlayerBubble — Halbzeit-Sprechblase mit Spieler-Porträt + Reaktionen
// ─────────────────────────────────────────────────────────────────
/**
 * @param {object} p
 * @param {{name:string, pos:string, form:number}} p.player
 * @param {'energie'|'frust'|'erschöpft'|'cool'|'angeschlagen'} p.mood
 * @param {string} p.line                  Spieler-Zitat (italic, Serif)
 * @param {Array<{l:string, e:string, onSelect?:function}>} p.reactions  Reaktions-Optionen
 * @param {string} p.theme
 * @param {string} p.scheme
 *
 * @story PlayerBubble/Energie       — positiver Spieler-Hinweis
 * @story PlayerBubble/Frust         — frustrierter Stürmer
 * @story PlayerBubble/Erschoepft    — Wechselbitte
 */
function PlayerBubble({ player, mood, line, reactions, theme, scheme }){
  const isDe = getLocale() === 'de';
  const MOOD = {
    'energie':      { face:+2, c:'var(--ok)' },
    'cool':         { face:+1, c:'var(--ok)' },
    'frust':        { face:-1, c:'var(--warn)' },
    'erschöpft':    { face:-1, c:'var(--warn)' },
    'angeschlagen': { face:-2, c:'var(--danger)' },
  };
  const m = MOOD[mood] || MOOD['cool'];
  return (
    <div style={{
      background:'var(--card)', border:'1px solid var(--rule)', borderRadius:14,
      padding:'12px 14px', marginBottom:10
    }}>
      <div style={{display:'flex', alignItems:'flex-start', gap:10}}>
        <Portrait name={player.name} theme={theme} scheme={scheme} size={40} variant="player"/>
        <div style={{flex:1, minWidth:0}}>
          <div style={{display:'flex', alignItems:'center', gap:6}}>
            <SerifH theme={theme} style={{fontSize:14.5, fontWeight:700, color:'var(--ink)', lineHeight:1.05}}>{player.name}</SerifH>
            <PosPill pos={player.pos} theme={theme} scheme={scheme}/>
          </div>
          <div style={{fontSize:10.5, color:'var(--inkMute)', marginTop:2, fontFamily:'JetBrains Mono', fontVariantNumeric:'tabular-nums'}}>
            {isDe ? 'Form' : 'Form'} {String(player.form).replace('.', isDe ? ',' : '.')}
          </div>
        </div>
        <MoodFace mood={m.face} size={32} theme={theme} scheme={scheme}/>
      </div>
      <SerifH theme={theme} style={{
        display:'block', fontSize:14, fontWeight:600, color:'var(--ink)', marginTop:10,
        fontStyle:'italic', lineHeight:1.4, paddingLeft:8, borderLeft:`2px solid ${m.c}`
      }}>{line}</SerifH>
      <div style={{display:'flex', gap:6, marginTop:10, flexWrap:'wrap'}}>
        {reactions.map((r,i)=>(
          <button key={i} onClick={r.onSelect} style={{
            flex:'1 1 auto', minWidth:90,
            padding:'8px 10px', borderRadius:10,
            background:'var(--bg)', border:'1px solid var(--rule)',
            color:'var(--ink)', fontFamily:'inherit', cursor:'pointer',
            textAlign:'left',
          }}>
            <div style={{fontSize:11.5, fontWeight:700, color:'var(--ink)', lineHeight:1.15}}>{r.l}</div>
            <div style={{fontSize:9.5, color:m.c, fontWeight:700, marginTop:3, fontFamily:'JetBrains Mono'}}>{r.e}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// NegotiationMessage — Chat-bubble für Transfer-Loop
// ─────────────────────────────────────────────────────────────────
/**
 * @param {object} p
 * @param {'us'|'them'} p.side
 * @param {string} p.who                       Klubname / Berater
 * @param {string} p.when                      Zeitstempel
 * @param {string} p.msg                       Bubble-Text (italic)
 * @param {{ablöse:number, bonus?:number, klausel?:number}} p.offer
 * @param {string} p.theme
 * @param {string} p.scheme
 *
 * @story NegotiationMessage/Them      — Bubble vom Gegenüber (links)
 * @story NegotiationMessage/Us        — Bubble von uns (rechts, dunkler)
 * @story NegotiationMessage/Lowball   — niedriges Angebot
 */
function NegotiationMessage({ side, who, when, msg, offer, theme, scheme }){
  const isDe = getLocale() === 'de';
  const us = side === 'us';
  return (
    <div style={{
      alignSelf: us ? 'flex-end' : 'flex-start',
      maxWidth:'88%',
      marginBottom:8, display:'flex', flexDirection:'column', alignItems: us?'flex-end':'flex-start'
    }}>
      <div style={{fontSize:9.5, color:'var(--inkSoft)', marginBottom:2, fontFamily:'JetBrains Mono'}}>
        {who} · {when}
      </div>
      <div style={{
        background: us ? 'var(--ink)' : 'var(--card)',
        color:      us ? 'var(--bg)'  : 'var(--ink)',
        border:     us ? 'none' : '1px solid var(--rule)',
        borderRadius: us ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
        padding:'10px 12px', fontFamily:THEMES[theme].font, fontStyle:'italic',
        fontSize:13, lineHeight:1.35
      }}>
        {msg}
        {offer && (
          <div style={{display:'flex', gap:6, marginTop:8, flexWrap:'wrap'}}>
            {typeof offer.ablöse === 'number' && (
              <OfferChip theme={theme} scheme={scheme} dark={us}
                k={isDe ? 'Ablöse' : 'Fee'} v={eurK(offer.ablöse)}/>
            )}
            {offer.bonus > 0 && (
              <OfferChip theme={theme} scheme={scheme} dark={us}
                k={isDe ? 'Bonus' : 'Bonus'} v={eurK(offer.bonus)}/>
            )}
            {offer.klausel && (
              <OfferChip theme={theme} scheme={scheme} dark={us}
                k={isDe ? 'Klausel' : 'Clause'} v={eurK(offer.klausel)}/>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, {
  PressAnswerCard, PlayerBubble, NegotiationMessage,
});
