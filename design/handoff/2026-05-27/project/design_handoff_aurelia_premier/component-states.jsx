// component-states.jsx — QA states sheet for the extracted composites.
// Renders each component in all its variant + implied states (default,
// hover, disabled, loading, empty, error). Loading/empty/error are mocked
// here since the prototypes don't ship those states yet — they document the
// engineering contract for the shadcn implementation.

const { useState } = React;

// ── State cell wrapper ───────────────────────────────────────────
function StateCell({ label, kind = 'variant', width, height, children, note }) {
  return (
    <div className="qa-cell" style={{ width: width || 280 }}>
      <div className="qa-cell-head">
        <span className={`qa-pill qa-pill-${kind}`}>{label}</span>
        {note && <span className="qa-cell-note">{note}</span>}
      </div>
      <div className="qa-cell-stage" style={{ minHeight: height || 'auto' }}>
        <ThemeRoot theme="A" scheme="light">
          {children}
        </ThemeRoot>
      </div>
    </div>
  );
}

// Skeleton bar — shimmering placeholder for loading states.
function Skel({ w = '100%', h = 14, br = 6, style }) {
  return (
    <div
      className="qa-skel"
      style={{ width: w, height: h, borderRadius: br, ...style }}
    />
  );
}

// Section + Component wrappers
function QASection({ id, title, sub, count, children }) {
  return (
    <section className="qa-section" id={id}>
      <header className="qa-sec-head">
        <div className="qa-sec-meta">
          <span className="qa-sec-kicker">§ {id}</span>
          {count && <span className="qa-sec-count">{count}</span>}
        </div>
        <h2>{title}</h2>
        <p>{sub}</p>
      </header>
      {children}
    </section>
  );
}

function QAComponent({ name, file, desc, props, children }) {
  return (
    <article className="qa-component">
      <header className="qa-comp-head">
        <div className="qa-comp-line">
          <h3>{name}</h3>
          <code className="qa-comp-file">{file}</code>
        </div>
        {desc && <p className="qa-comp-desc">{desc}</p>}
        {props && <code className="qa-comp-props">{props}</code>}
      </header>
      <div className="qa-states">{children}</div>
    </article>
  );
}

// ── Sample data ─────────────────────────────────────────────────
const SAMPLE_PLAYER = { name: 'Marek Brody', pos: 'ST', form: 7.4 };

// ─────────────────────────────────────────────────────────────────
// THE SHEET
// ─────────────────────────────────────────────────────────────────
function QASheet() {
  usePrefs();
  useT();

  return (
    <div className="qa-sheet">
      {/* Masthead */}
      <header className="qa-mast">
        <div className="qa-mast-left">
          <span className="qa-mark">AP</span>
          <div>
            <div className="qa-mast-title">Aurelia <em>Premier</em></div>
            <div className="qa-mast-sub">Component States Sheet · QA / Engineering Reference</div>
          </div>
        </div>
        <nav className="qa-mast-nav">
          <a href="#buttons">Buttons</a>
          <a href="#hub">Hub</a>
          <a href="#inbox">Inbox</a>
          <a href="#match">Match</a>
          <a href="#depth">Depth</a>
          <a href="#implied">Implied</a>
        </nav>
        <div className="qa-mast-meta">
          <a href="Handoff Overview.html" className="qa-mast-back">← Overview</a>
        </div>
      </header>

      {/* Strap */}
      <div className="qa-strap">
        <span><b>{NUM_COMPONENTS}</b> Komponenten</span>
        <span>·</span>
        <span><b>{NUM_STATES}</b> Zustands-Zellen</span>
        <span>·</span>
        <span>Direction <b>A · Sonntagszeitung</b></span>
        <span>·</span>
        <span>Themed via <code>ThemeRoot</code></span>
        <span className="qa-strap-spacer"></span>
        <span className="qa-strap-legend">
          <span className="qa-pill qa-pill-variant">Variant</span>
          <span className="qa-pill qa-pill-state">Live state</span>
          <span className="qa-pill qa-pill-mocked">Mocked</span>
        </span>
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* §1 — Buttons & Actions */}
      <QASection
        id="buttons"
        title="Buttons & Aktionen"
        sub="Der einzige scharlachrote Block ist der Anpfiff. Alles andere ist Ink oder Soft."
        count="3 Komponenten · 14 Zellen"
      >
        <QAComponent
          name="AdvanceButton"
          file="components.jsx"
          desc="Hub-CTA mit Tages-Offset-Stempel oben links. Die einzige Komponente, die voll-breit sitzt."
          props="{ label, daysOffset?, onClick, theme, scheme }"
        >
          <StateCell label="Default" kind="variant" width={300}>
            <AdvanceButton theme="A" scheme="light" label="Anpfiff" daysOffset={3} />
          </StateCell>
          <StateCell label="No stamp" kind="variant" width={300}>
            <AdvanceButton theme="A" scheme="light" label="Weiter" />
          </StateCell>
          <StateCell label="Long label" kind="variant" width={300}>
            <AdvanceButton theme="A" scheme="light" label="Saisonpause überspringen" daysOffset={14} />
          </StateCell>
          <StateCell label="Hover" kind="state" width={300} note="lift +2px shadow">
            <div className="qa-force-hover"><AdvanceButton theme="A" scheme="light" label="Anpfiff" daysOffset={3} /></div>
          </StateCell>
          <StateCell label="Disabled" kind="mocked" width={300} note="aria-disabled, .55 opacity">
            <div className="qa-force-disabled"><AdvanceButton theme="A" scheme="light" label="Anpfiff" daysOffset={0} /></div>
          </StateCell>
          <StateCell label="Loading" kind="mocked" width={300} note="shadcn Skeleton + spinner">
            <div style={{ width: '100%', height: 56, borderRadius: 16, background: '#1a1410', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <span className="qa-spinner"></span>
              <span style={{ color: '#f4ede0', fontSize: 13, fontWeight: 500, opacity: .65 }}>Saison wird berechnet …</span>
            </div>
          </StateCell>
        </QAComponent>

        <QAComponent
          name="PillBtn"
          file="ui.jsx"
          desc="Inbox-Aktions-Pille. ≥ 44 px Hit-Area via padding. Vier Intents."
          props="{ intent: 'accept'|'neutral'|'soft'|'danger', icon?, onClick, theme, scheme }"
        >
          <StateCell label="accept · default" kind="variant">
            <PillBtn theme="A" scheme="light" intent="accept" icon={<I.Check size={14} color="#fff" />}>Annehmen</PillBtn>
          </StateCell>
          <StateCell label="neutral · default" kind="variant">
            <PillBtn theme="A" scheme="light" intent="neutral" icon={<I.X size={13} color="#1a1410" />}>Ablehnen</PillBtn>
          </StateCell>
          <StateCell label="soft · default" kind="variant">
            <PillBtn theme="A" scheme="light" intent="soft" icon={<I.Clock size={13} color="#1a1410" />}>Vertagen</PillBtn>
          </StateCell>
          <StateCell label="danger · default" kind="variant">
            <PillBtn theme="A" scheme="light" intent="danger" icon={<I.Trash size={13} color="#fff" />}>Verwerfen</PillBtn>
          </StateCell>
          <StateCell label="disabled" kind="mocked" note="aria-disabled">
            <div className="qa-force-disabled"><PillBtn theme="A" scheme="light" intent="accept">Gesperrt</PillBtn></div>
          </StateCell>
          <StateCell label="loading" kind="mocked" note="spinner inside">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, background: '#3b6e3e', color: '#fff', fontSize: 13, fontWeight: 600 }}>
              <span className="qa-spinner qa-spinner-sm"></span>
              <span>Wird gesendet …</span>
            </div>
          </StateCell>
        </QAComponent>

        <QAComponent
          name="TabBtn (icon-only)"
          file="ui.jsx · inline pattern"
          desc="Icon-only kreisförmige Knöpfe. aria-label pflicht."
          props="{ icon, aria-label, onClick }"
        >
          <StateCell label="default" kind="variant">
            <button className="qa-iconbtn" aria-label="Zurück"><I.ChevronLeft size={16} color="#1a1410" /></button>
          </StateCell>
          <StateCell label="active" kind="state" note=".active = ink fill">
            <button className="qa-iconbtn is-active" aria-label="Mehr"><I.More size={16} color="#f4ede0" /></button>
          </StateCell>
          <StateCell label="disabled" kind="mocked">
            <button className="qa-iconbtn" disabled aria-label="Gesperrt"><I.ChevronRight size={16} color="#1a1410" /></button>
          </StateCell>
          <StateCell label="focus" kind="state" note=":focus-visible · 2px scarlet ring">
            <button className="qa-iconbtn qa-force-focus" aria-label="Filter"><I.Filter size={16} color="#1a1410" /></button>
          </StateCell>
        </QAComponent>
      </QASection>

      {/* ════════════════════════════════════════════════════════ */}
      {/* §2 — Hub-Composites */}
      <QASection
        id="hub"
        title="Hub-Composites"
        sub="Kacheln und Karten auf dem Office Hub. CSS-Variablen-basiert — Klubfarbe verändert sie in-place."
        count="2 Komponenten · 8 Zellen"
      >
        <QAComponent
          name="HubTile"
          file="components.jsx"
          desc="Icon + Titel + Subtitle + optionale Flag-Zeile in Scharlach."
          props="{ icon, label, sub, flag?, onClick, theme, scheme }"
        >
          <StateCell label="Default" kind="variant">
            <HubTile theme="A" scheme="light"
              icon={<I.Users size={18} color="#f4ede0" />}
              label="Training"
              sub="Mannschaft · 4 Einheiten"
            />
          </StateCell>
          <StateCell label="With flag" kind="variant" note="scarlet accent line">
            <HubTile theme="A" scheme="light"
              icon={<I.Wallet size={18} color="#f4ede0" />}
              label="Finanzen"
              sub="Monatssaldo · −12.500 €"
              flag="Vorstand verärgert"
            />
          </StateCell>
          <StateCell label="Hover" kind="state" note="lift +1, border darken">
            <div className="qa-force-hover">
              <HubTile theme="A" scheme="light"
                icon={<I.Trophy size={18} color="#f4ede0" />}
                label="Vorstand"
                sub="3 ungelesene Briefe"
              />
            </div>
          </StateCell>
          <StateCell label="Skeleton" kind="mocked" note="shadcn Skeleton">
            <div style={{ background: 'var(--card)', border: '1px solid var(--rule)', borderRadius: 14, padding: 12, minHeight: 96, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Skel w={32} h={32} br={10} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <Skel w="60%" h={12} />
                <Skel w="80%" h={10} />
              </div>
            </div>
          </StateCell>
        </QAComponent>

        <QAComponent
          name="NextMatchCard"
          file="components.jsx"
          desc="Hub-Headliner: Kicker · Score-Strip · Datum · Meta · optionales Aside."
          props="{ home, away, dateLine, metaLine, aside?, theme, scheme }"
        >
          <StateCell label="Default" kind="variant" width={320}>
            <NextMatchCard theme="A" scheme="light"
              home="Aurelia FC" away="Auerbach"
              dateLine="So 26. Mai · 15:30"
              metaLine="Aurelia Premier · 32. Spieltag · Heim"
            />
          </StateCell>
          <StateCell label="With aside" kind="variant" width={320} note="optional countdown / xG">
            <NextMatchCard theme="A" scheme="light"
              home="Aurelia FC" away="Northbridge"
              dateLine="Sa 01. Juni · 18:00"
              metaLine="Pokal · Achtelfinale · Auswärts"
              aside={<div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--inkMute)', display: 'flex', gap: 12 }}>
                <span>xG <b style={{ color: 'var(--ink)' }}>1.8 · 1.4</b></span>
                <span>Anpfiff in <b style={{ color: 'var(--accent)' }}>6 T 02:14</b></span>
              </div>}
            />
          </StateCell>
          <StateCell label="Empty · no fixture" kind="mocked" width={320} note="off-season">
            <div style={{ background: 'var(--card)', border: '1px dashed var(--rule)', borderRadius: 16, padding: '14px 14px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.2, color: 'var(--inkMute)' }}>SAISONPAUSE</div>
              <div style={{ fontFamily: 'Newsreader, serif', fontSize: 18, fontWeight: 700, marginTop: 6, color: 'var(--inkMute)', fontStyle: 'italic' }}>Keine Termine bis 12. August</div>
              <div style={{ fontSize: 12, color: 'var(--inkSoft)', marginTop: 4 }}>Vorbereitung &amp; Transfers nutzen</div>
            </div>
          </StateCell>
        </QAComponent>
      </QASection>

      {/* ════════════════════════════════════════════════════════ */}
      {/* §3 — Posteingang */}
      <QASection
        id="inbox"
        title="Posteingang"
        sub="Karten statt Listenzeilen. Pflicht: doppelte Codierung von Tone (Glyph + Farbe)."
        count="1 Komponente · 7 Tones + States"
      >
        <QAComponent
          name="InboxCard"
          file="components.jsx"
          desc="Tone-Glyph + Headline + Body + 4 Aktionen. Tones: board · media · sponsor · scout · fan."
          props="{ tone, from, title, body, time, on{Accept,Defer,Decline,More}, theme, scheme }"
        >
          <StateCell label="tone · board" kind="variant" width={360}>
            <InboxCard theme="A" scheme="light" tone="board" from="Vorstand"
              title="Drei Spieltage, drei Siege gefordert"
              body="Der Aufsichtsrat hat sich getroffen. Wir erwarten ein klares Zeichen vor der Länderspielpause."
              time="vor 12 Min."
            />
          </StateCell>
          <StateCell label="tone · media" kind="variant" width={360}>
            <InboxCard theme="A" scheme="light" tone="media" from="Tageszeitung"
              title="Brody schießt sich in die Herzen"
              body="Hatrick im Pokal — sind drei Tore das, was Aurelia gefehlt hat?"
              time="vor 1 Std."
            />
          </StateCell>
          <StateCell label="tone · sponsor" kind="variant" width={360}>
            <InboxCard theme="A" scheme="light" tone="sponsor" from="Hafenstadt-Werft"
              title="Vertrags­verlängerung im Brust-Slot"
              body="Wir würden gern ein Jahr verlängern. Konditionen sind verhandelbar."
              time="vor 3 Std."
            />
          </StateCell>
          <StateCell label="tone · scout" kind="variant" width={360}>
            <InboxCard theme="A" scheme="light" tone="scout" from="Scout · Nordregion"
              title="18-jähriger Innen­verteidiger entdeckt"
              body="Beobachtung über 6 Spiele. Empfehlung: Probetraining."
              time="vor 6 Std."
            />
          </StateCell>
          <StateCell label="tone · fan" kind="variant" width={360}>
            <InboxCard theme="A" scheme="light" tone="fan" from="Fankurve Nord"
              title="Choreo zum Derby?"
              body="Wir würden gern den Treppenaufgang Block N3 für eine Bahnen-Choreo nutzen."
              time="gestern"
            />
          </StateCell>
          <StateCell label="Empty inbox" kind="mocked" width={360} note="all-caught-up state">
            <div style={{ background: 'var(--card)', border: '1px dashed var(--rule)', borderRadius: 14, padding: 28, textAlign: 'center' }}>
              <div style={{ fontFamily: 'Newsreader, serif', fontSize: 36, fontStyle: 'italic', color: 'var(--accent)', marginBottom: 6 }}>¶</div>
              <div style={{ fontFamily: 'Newsreader, serif', fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>Posteingang aufgeräumt</div>
              <div style={{ fontSize: 12, color: 'var(--inkMute)', marginTop: 4, fontStyle: 'italic' }}>Keine ungelesenen Briefe. Tippe Anpfiff für den nächsten Termin.</div>
            </div>
          </StateCell>
          <StateCell label="Skeleton" kind="mocked" width={360} note="shimmer · 3 placeholders">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--rule)', borderRadius: 14, padding: 12, display: 'flex', gap: 10 }}>
                  <Skel w={36} h={36} br={10} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <Skel w="40%" h={10} />
                    <Skel w="85%" h={14} />
                    <Skel w="70%" h={10} />
                  </div>
                </div>
              ))}
            </div>
          </StateCell>
        </QAComponent>
      </QASection>

      {/* ════════════════════════════════════════════════════════ */}
      {/* §4 — Match */}
      <QASection
        id="match"
        title="Match · Reportage & Stats"
        sub="Newspaper-Typo trifft Datenstreifen. Glyph + Farbe immer doppelt codiert."
        count="2 Komponenten · 10 Zellen"
      >
        <QAComponent
          name="MatchEvent"
          file="components.jsx"
          desc="Eine Zeile im Reportage-Feed. Tore in Akzent-Serif, Set-Piece nutzt MiniPitch-Glyph."
          props="{ min, kind: 'goal'|'chance'|'card'|'sub'|'set'|'whistle', title, sub, score?, theme, scheme, last }"
        >
          <StateCell label="kind · goal" kind="variant" width={340}>
            <div style={{ padding: '0 8px' }}><MatchEvent theme="A" scheme="light" min="12'" kind="goal" title="Brody legt den Kopfball ins lange Eck" sub="Ecke von Vasco · 1:0" score="1:0" /></div>
          </StateCell>
          <StateCell label="kind · chance" kind="variant" width={340}>
            <div style={{ padding: '0 8px' }}><MatchEvent theme="A" scheme="light" min="23'" kind="chance" title="Lattenkracher von Auerbach" sub="Distanzschuss aus 22 Metern" /></div>
          </StateCell>
          <StateCell label="kind · card" kind="variant" width={340}>
            <div style={{ padding: '0 8px' }}><MatchEvent theme="A" scheme="light" min="38'" kind="card" title="Gelbe Karte für Vasco" sub="Foul im Mittelfeld" /></div>
          </StateCell>
          <StateCell label="kind · sub" kind="variant" width={340}>
            <div style={{ padding: '0 8px' }}><MatchEvent theme="A" scheme="light" min="62'" kind="sub" title="Wechsel: Lindquist für Karbo" sub="Frischer Sechser im Aufbau" /></div>
          </StateCell>
          <StateCell label="kind · set-piece" kind="variant" width={340} note="uses MiniPitch glyph">
            <div style={{ padding: '0 8px' }}><MatchEvent theme="A" scheme="light" min="71'" kind="set" title="Freistoß aus zentraler Position" sub="Vasco an der Mauer" /></div>
          </StateCell>
          <StateCell label="kind · whistle" kind="variant" width={340}>
            <div style={{ padding: '0 8px' }}><MatchEvent theme="A" scheme="light" min="HZ" kind="whistle" title="Halbzeitpfiff" sub="Aurelia führt 1:0" last /></div>
          </StateCell>
        </QAComponent>

        <QAComponent
          name="StatStrip"
          file="components.jsx"
          desc="Gegenüberliegende Werte mit Gewinner-Akzent. Akzeptiert ReactNode für a/b (FormStrip, Pitch-Glyph, …)."
          props="{ label, a, b, accentSide?, hint?, mono?, last?, theme, scheme }"
        >
          <StateCell label="Default" kind="variant" width={340}>
            <div style={{ padding: '0 8px' }}><StatStrip theme="A" scheme="light" label="BALLBESITZ" a="58%" b="42%" /></div>
          </StateCell>
          <StateCell label="WinnerAccent · a" kind="variant" width={340}>
            <div style={{ padding: '0 8px' }}><StatStrip theme="A" scheme="light" label="XG" a="1.84" b="0.62" accentSide="a" /></div>
          </StateCell>
          <StateCell label="WithHint" kind="variant" width={340}>
            <div style={{ padding: '0 8px' }}><StatStrip theme="A" scheme="light" label="ZWEIKÄMPFE" a="54%" b="46%" hint="Underdog im Mittelfeld stark" /></div>
          </StateCell>
          <StateCell label="NonNumeric · FormStrip" kind="variant" width={340} note="accepts ReactNode">
            <div style={{ padding: '0 8px' }}><StatStrip theme="A" scheme="light" mono={false} label="FORM (5)"
              a={<FormStrip theme="A" scheme="light" form="SSUSS" />}
              b={<FormStrip theme="A" scheme="light" form="UNSNU" />}
              last
            /></div>
          </StateCell>
        </QAComponent>
      </QASection>

      {/* ════════════════════════════════════════════════════════ */}
      {/* §5 — Verhandlung & Stimmung */}
      <QASection
        id="depth"
        title="Verhandlung & Stimmung"
        sub="Drei Anstoss-Bausteine: Presse-Antwort, Spielerstimme, Transfer-Chat."
        count="3 Komponenten · 11 Zellen"
      >
        <QAComponent
          name="PressAnswerCard"
          file="components.jsx"
          desc="Karte mit tonalitäts-Kicker, Zitat in Serif, Outcome-Pills (Vorstand/Fans/Mannschaft)."
          props="{ tone, quote, predict: [{w, d}], onPick, theme, scheme }"
        >
          <StateCell label="tone · höflich" kind="variant" width={360}>
            <PressAnswerCard theme="A" scheme="light"
              tone="höflich"
              quote="Wir haben heute viel gelernt — der Kader steht hinter mir."
              predict={[{ w: 'Vorstand', d: +1 }, { w: 'Fans', d: 0 }]}
            />
          </StateCell>
          <StateCell label="tone · kantig" kind="variant" width={360}>
            <PressAnswerCard theme="A" scheme="light"
              tone="kantig"
              quote="Drei Punkte sind drei Punkte. Wer Stil will, kauft sich ein Buch."
              predict={[{ w: 'Vorstand', d: -1 }, { w: 'Fans', d: +2 }]}
            />
          </StateCell>
          <StateCell label="tone · sarkasmus" kind="variant" width={360}>
            <PressAnswerCard theme="A" scheme="light"
              tone="sarkasmus"
              quote="Der Schiedsrichter hatte einen anstrengenden Tag."
              predict={[{ w: 'Vorstand', d: -2 }, { w: 'Fans', d: +1 }, { w: 'DFB', d: -1 }]}
            />
          </StateCell>
          <StateCell label="tone · neutral" kind="variant" width={360}>
            <PressAnswerCard theme="A" scheme="light"
              tone="neutral"
              quote="Wir analysieren in Ruhe und schauen nach vorn."
              predict={[{ w: 'Vorstand', d: 0 }, { w: 'Fans', d: 0 }]}
            />
          </StateCell>
        </QAComponent>

        <QAComponent
          name="PlayerBubble"
          file="components.jsx"
          desc="Halbzeit-Sprechblase. Portrait + Stimmungsgesicht + italic Quote mit border-left in Stimmungs-Farbe."
          props="{ player, mood, line, reactions: [{l, e}], theme, scheme }"
        >
          <StateCell label="mood · energie" kind="variant" width={380}>
            <PlayerBubble theme="A" scheme="light"
              player={SAMPLE_PLAYER} mood="energie"
              line="Geben Sie mir noch zwanzig Minuten — ich rieche das zweite Tor."
              reactions={[{ l: 'Weiter so', e: '+1 Form' }, { l: 'Beruhigen', e: '−0 Risiko' }]}
            />
          </StateCell>
          <StateCell label="mood · frust" kind="variant" width={380}>
            <PlayerBubble theme="A" scheme="light"
              player={{ name: 'Vasco Reiter', pos: 'OM', form: 5.8 }} mood="frust"
              line="Niemand spielt mich an, wenn ich frei stehe. Was soll ich da reißen?"
              reactions={[{ l: 'Anweisen', e: 'Tempo +1' }, { l: 'Auswechseln', e: 'Stamm −1' }]}
            />
          </StateCell>
          <StateCell label="mood · erschöpft" kind="variant" width={380}>
            <PlayerBubble theme="A" scheme="light"
              player={{ name: 'Élise Vannier', pos: 'IV', form: 7.0 }} mood="erschöpft"
              line="Coach, das Knie hält nicht mehr lange durch."
              reactions={[{ l: 'Wechseln', e: 'Risiko −2' }, { l: 'Durchziehen', e: 'Verletz. +60%' }]}
            />
          </StateCell>
        </QAComponent>

        <QAComponent
          name="NegotiationMessage"
          file="components.jsx"
          desc="Chat-Bubble für Transfer-Loop. them: Card-Hintergrund; us: Ink-Hintergrund."
          props="{ side: 'us'|'them', who, when, msg, offer: {ablöse, bonus?, klausel?}, theme, scheme }"
        >
          <StateCell label="side · them" kind="variant" width={400}>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 4px' }}>
              <NegotiationMessage theme="A" scheme="light"
                side="them" who="Berater · Northbridge" when="vor 3 Std."
                msg="Wir sind interessiert, aber das Erstangebot greift zu kurz."
                offer={{ ablöse: 1_400_000 }}
              />
            </div>
          </StateCell>
          <StateCell label="side · us" kind="variant" width={400}>
            <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 4px' }}>
              <NegotiationMessage theme="A" scheme="light"
                side="us" who="Aurelia FC" when="vor 2 Std."
                msg="Wir gehen auf zwei und einen Bonus für 15 Tore zu."
                offer={{ ablöse: 2_000_000, bonus: 250_000, klausel: 4_500_000 }}
              />
            </div>
          </StateCell>
          <StateCell label="state · lowball" kind="state" width={400} note="them with crap fee">
            <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 4px' }}>
              <NegotiationMessage theme="A" scheme="light"
                side="them" who="Auerbach" when="vor 1 Tag"
                msg="Das Beste, was wir bieten können — kein Verhandlungs­spielraum."
                offer={{ ablöse: 400_000 }}
              />
            </div>
          </StateCell>
          <StateCell label="thread" kind="variant" width={400} note="alternating exchange">
            <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 4px' }}>
              <NegotiationMessage theme="A" scheme="light" side="them" who="Northbridge" when="14:02"
                msg="Lassen Sie uns reden." offer={{ ablöse: 1_200_000 }} />
              <NegotiationMessage theme="A" scheme="light" side="us" who="Aurelia FC" when="14:18"
                msg="Wir gehen auf zwei. Letztes Wort." offer={{ ablöse: 2_000_000, bonus: 300_000 }} />
              <NegotiationMessage theme="A" scheme="light" side="them" who="Northbridge" when="15:40"
                msg="Treffen wir uns bei 1,75 + Bonus?" offer={{ ablöse: 1_750_000, bonus: 250_000 }} />
            </div>
          </StateCell>
        </QAComponent>
      </QASection>

      {/* ════════════════════════════════════════════════════════ */}
      {/* §6 — Implied states */}
      <QASection
        id="implied"
        title="Implied States · Skeleton, Empty, Error"
        sub="Diese drei Zustände sind im Prototyp nicht durchgängig implementiert. Das Engineering-Team mappt sie auf shadcn-Primitive — Patterns hier zum Anker."
        count="3 Patterns · 6 Zellen"
      >
        <QAComponent
          name="Skeleton (loading)"
          file="shadcn/skeleton.tsx"
          desc="Shimmer-Block mit der gleichen Geometrie wie der echte Inhalt. Niemals einen Spinner als Default — Skeleton bevorzugt."
          props="<Skeleton className=… />"
        >
          <StateCell label="Card-Skeleton" kind="mocked" width={300}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--rule)', borderRadius: 14, padding: 12, display: 'flex', gap: 10 }}>
              <Skel w={40} h={40} br={20} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <Skel w="70%" h={12} />
                <Skel w="90%" h={14} />
                <Skel w="50%" h={10} />
              </div>
            </div>
          </StateCell>
          <StateCell label="Stat-Skeleton" kind="mocked" width={300}>
            <div style={{ padding: '10px 12px', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <Skel w={60} h={14} />
                <Skel w={80} h={10} />
                <Skel w={60} h={14} />
              </div>
            </div>
          </StateCell>
        </QAComponent>

        <QAComponent
          name="Empty state"
          file="components/empty-state.tsx"
          desc="Glyph + Headline (Serif) + Body (italic) + optional CTA. Niemals leere Karten oder „No data“ mit Grau-in-Grau."
          props="{ glyph?, title, body, action? }"
        >
          <StateCell label="Squad empty" kind="mocked" width={340} note="no players yet">
            <div style={{ background: 'var(--card)', border: '1px dashed var(--rule)', borderRadius: 14, padding: 28, textAlign: 'center' }}>
              <div style={{ fontFamily: 'Newsreader, serif', fontSize: 38, color: 'var(--accent)', marginBottom: 6 }}>◌</div>
              <div style={{ fontFamily: 'Newsreader, serif', fontSize: 19, fontWeight: 700 }}>Noch kein Kader</div>
              <div style={{ fontSize: 12, color: 'var(--inkMute)', marginTop: 6, fontStyle: 'italic' }}>Dein Karriere-Start lädt — der Klub stellt elf Spieler an die Bande.</div>
              <button style={{ marginTop: 14, padding: '10px 16px', borderRadius: 999, border: '1.5px solid var(--ink)', background: 'transparent', color: 'var(--ink)', fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Zum Onboarding</button>
            </div>
          </StateCell>
          <StateCell label="Search empty" kind="mocked" width={340} note="no matches in filter">
            <div style={{ background: 'var(--card)', border: '1px dashed var(--rule)', borderRadius: 14, padding: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--inkMute)', letterSpacing: 1.4 }}>KEIN TREFFER</div>
              <div style={{ fontFamily: 'Newsreader, serif', fontSize: 17, fontWeight: 700, marginTop: 6 }}>Niemand passt zu „<i>Stürmer · Alter ≤ 22 · Talent 4★</i>"</div>
              <div style={{ fontSize: 12, color: 'var(--inkSoft)', marginTop: 6 }}>Erweitere das Alter oder senke die Talentstufe.</div>
            </div>
          </StateCell>
        </QAComponent>

        <QAComponent
          name="Error state"
          file="components/error-state.tsx"
          desc="Scharlachroter Akzent statt Glyph-Box. Klare Fehlersprache (Schreibfehler, nicht 500), immer eine Wieder­holungs-Aktion."
          props="{ title, body, retry?, onRetry }"
        >
          <StateCell label="Save corrupted" kind="mocked" width={340}>
            <div style={{ background: 'var(--card)', border: '1px solid #b7301b', borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#b7301b', letterSpacing: 1.4 }}>KARRIERE-DATEI</div>
              <div style={{ fontFamily: 'Newsreader, serif', fontSize: 19, fontWeight: 700, marginTop: 4 }}>Wir konnten Slot 02 nicht lesen.</div>
              <div style={{ fontSize: 12, color: 'var(--inkMute)', marginTop: 6, fontStyle: 'italic', lineHeight: 1.4 }}>Die Datei könnte beim letzten Beenden beschädigt worden sein. Stelle die letzte Sicherung wieder her oder starte einen neuen Slot.</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <button style={{ flex: 1, padding: '10px 14px', borderRadius: 999, border: 'none', background: '#b7301b', color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Sicherung laden</button>
                <button style={{ flex: 1, padding: '10px 14px', borderRadius: 999, border: '1.5px solid var(--ink)', background: 'transparent', color: 'var(--ink)', fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Neuer Slot</button>
              </div>
            </div>
          </StateCell>
          <StateCell label="Offline sync conflict" kind="mocked" width={340}>
            <div style={{ background: 'var(--card)', border: '1px solid #b7301b', borderRadius: 14, padding: 16 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <I.CloudOff size={22} color="#b7301b" sw={2} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Newsreader, serif', fontSize: 16, fontWeight: 700 }}>Cloud-Stand abweichend</div>
                  <div style={{ fontSize: 12, color: 'var(--inkMute)', marginTop: 4 }}>Auf einem anderen Gerät wurde später gespeichert. Wähle, welche Version weiterzieht.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--rule)', background: 'transparent', color: 'var(--ink)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Diese behalten</button>
                <button style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: 'none', background: 'var(--ink)', color: 'var(--bg)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Cloud laden</button>
              </div>
            </div>
          </StateCell>
        </QAComponent>
      </QASection>

      {/* Footer */}
      <footer className="qa-foot">
        <div className="qa-foot-cols">
          <div>
            <div className="qa-foot-kicker">QA Sheet · Edition 01</div>
            <div className="qa-foot-title">Aurelia <em>Premier</em></div>
            <div className="qa-foot-sub">Component States · 25. Mai 2026</div>
          </div>
          <div className="qa-foot-keys">
            <div className="qa-foot-key-row">
              <span className="qa-pill qa-pill-variant">Variant</span>
              <span>Echte Prop-Variante (im Code aktiv)</span>
            </div>
            <div className="qa-foot-key-row">
              <span className="qa-pill qa-pill-state">Live state</span>
              <span>UI-Zustand via CSS / Event (force-hover/focus simuliert)</span>
            </div>
            <div className="qa-foot-key-row">
              <span className="qa-pill qa-pill-mocked">Mocked</span>
              <span>Engineering-Vertrag — nicht im Prototyp, in shadcn umzusetzen</span>
            </div>
          </div>
          <div className="qa-foot-links">
            <a href="Handoff Overview.html">↗ Handoff Overview</a>
            <a href="index.html#library">↗ Komponenten-Library (Canvas)</a>
            <a href="COMPONENTS.md">↗ COMPONENTS.md</a>
            <a href="plan.md">↗ Migrations-Plan</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Approximate counts so the strap doesn't lie:
const NUM_COMPONENTS = 13;
const NUM_STATES = 58;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<QASheet />);
