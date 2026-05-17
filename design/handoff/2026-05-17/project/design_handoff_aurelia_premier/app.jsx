// app.jsx — assembles everything into DesignCanvas sections.

const SCREENS_A = [
  { id:'A-hub-light',     label:'01 · Office Hub · hell',         comp: ScreenHub,  scheme:'light' },
  { id:'A-hub-dark',      label:'01 · Office Hub · dunkel',       comp: ScreenHub,  scheme:'dark'  },
  { id:'A-inbox-light',   label:'02 · Posteingang · hell',        comp: ScreenInbox,scheme:'light' },
  { id:'A-inbox-dark',    label:'02 · Posteingang · dunkel',      comp: ScreenInbox,scheme:'dark'  },
  { id:'A-squad-light',   label:'03 · Kader · hell',              comp: ScreenSquad,scheme:'light' },
  { id:'A-squad-dark',    label:'03 · Kader · dunkel',            comp: ScreenSquad,scheme:'dark'  },
  { id:'A-pre-light',     label:'04 · Vor dem Anpfiff · hell',    comp: ScreenPreMatch, scheme:'light' },
  { id:'A-pre-dark',      label:'04 · Vor dem Anpfiff · dunkel',  comp: ScreenPreMatch, scheme:'dark'  },
  { id:'A-match-light',   label:'05 · Spiel · Reportage · hell',  comp: ScreenMatchFeed, scheme:'light' },
  { id:'A-match-dark',    label:'05 · Spiel · Reportage · dunkel',comp: ScreenMatchFeed, scheme:'dark'  },
  { id:'A-half-light',    label:'06 · Halbzeit · hell',           comp: ScreenHalftime,  scheme:'light' },
  { id:'A-half-dark',     label:'06 · Halbzeit · dunkel',         comp: ScreenHalftime,  scheme:'dark'  },
  { id:'A-fin-light',     label:'07 · Finanzen · hell',           comp: ScreenFinance,   scheme:'light' },
  { id:'A-fin-dark',      label:'07 · Finanzen · dunkel',         comp: ScreenFinance,   scheme:'dark'  },
  { id:'A-stad-light',    label:'08 · Stadionausbau · hell',      comp: ScreenStadium,   scheme:'light' },
  { id:'A-stad-dark',     label:'08 · Stadionausbau · dunkel',    comp: ScreenStadium,   scheme:'dark'  },
];
const SCREENS_ONBOARD = [
  { id:'A-onb1-light', label:'09a · Land & Liga · hell',   comp: ScreenOnboardingCountry, scheme:'light' },
  { id:'A-onb1-dark',  label:'09a · Land & Liga · dunkel', comp: ScreenOnboardingCountry, scheme:'dark'  },
  { id:'A-onb2-light', label:'09b · Verein · hell',         comp: ScreenOnboardingClub,    scheme:'light' },
  { id:'A-onb2-dark',  label:'09b · Verein · dunkel',       comp: ScreenOnboardingClub,    scheme:'dark'  },
  { id:'A-onb3-light', label:'09c · Manager · hell',        comp: ScreenOnboardingManager, scheme:'light' },
  { id:'A-onb3-dark',  label:'09c · Manager · dunkel',      comp: ScreenOnboardingManager, scheme:'dark'  },
  { id:'A-save-light', label:'10 · Karrieren · hell',       comp: ScreenSaves,             scheme:'light' },
  { id:'A-save-dark',  label:'10 · Karrieren · dunkel',     comp: ScreenSaves,             scheme:'dark'  },
];

const SCREENS_NEG = [
  { id:'A-neg1-light', label:'11 · Spielervertrag · hell',   comp: ScreenPlayerNeg,       scheme:'light' },
  { id:'A-neg1-dark',  label:'11 · Spielervertrag · dunkel', comp: ScreenPlayerNeg,       scheme:'dark'  },
  { id:'A-neg2-light', label:'12 · Vorstandsvertrauen · hell',   comp: ScreenBoardConfidence, scheme:'light' },
  { id:'A-neg2-dark',  label:'12 · Vorstandsvertrauen · dunkel', comp: ScreenBoardConfidence, scheme:'dark'  },
  { id:'A-neg3-light', label:'13 · Sponsoren · hell',   comp: ScreenSponsorNeg,     scheme:'light' },
  { id:'A-neg3-dark',  label:'13 · Sponsoren · dunkel', comp: ScreenSponsorNeg,     scheme:'dark'  },
  { id:'A-neg4-light', label:'14 · Presse-Interview · hell',   comp: ScreenPressInterview, scheme:'light' },
  { id:'A-neg4-dark',  label:'14 · Presse-Interview · dunkel', comp: ScreenPressInterview, scheme:'dark'  },
];

const SCREENS_TACT = [
  { id:'A-tac1-light', label:'15 · Taktik · hell',         comp: ScreenTactics, scheme:'light' },
  { id:'A-tac1-dark',  label:'15 · Taktik · dunkel',       comp: ScreenTactics, scheme:'dark'  },
  { id:'A-tac2-light', label:'16 · Aufstellung · hell',    comp: ScreenLineup,  scheme:'light' },
  { id:'A-tac2-dark',  label:'16 · Aufstellung · dunkel',  comp: ScreenLineup,  scheme:'dark'  },
  { id:'A-tac3-light', label:'17 · Statistiken · hell',    comp: ScreenStats,   scheme:'light' },
  { id:'A-tac3-dark',  label:'17 · Statistiken · dunkel',  comp: ScreenStats,   scheme:'dark'  },
];

const SCREENS_TEAM = [
  { id:'A-pl-light',   label:'18 · Spielerdetail · hell',   comp: ScreenPlayerDetail,       scheme:'light' },
  { id:'A-pl-dark',    label:'18 · Spielerdetail · dunkel', comp: ScreenPlayerDetail,       scheme:'dark'  },
  { id:'A-tr-light',   label:'19 · Training · hell',         comp: ScreenTraining,           scheme:'light' },
  { id:'A-tr-dark',    label:'19 · Training · dunkel',       comp: ScreenTraining,           scheme:'dark'  },
  { id:'A-itr-light',  label:'20 · Einzeltraining · hell',   comp: ScreenIndividualTraining, scheme:'light' },
  { id:'A-itr-dark',   label:'20 · Einzeltraining · dunkel', comp: ScreenIndividualTraining, scheme:'dark'  },
  { id:'A-med-light',  label:'21 · Krankenstation · hell',   comp: ScreenMedical,            scheme:'light' },
  { id:'A-med-dark',   label:'21 · Krankenstation · dunkel', comp: ScreenMedical,            scheme:'dark'  },
  { id:'A-sc-light',   label:'22 · Scouting · hell',         comp: ScreenScouting,           scheme:'light' },
  { id:'A-sc-dark',    label:'22 · Scouting · dunkel',       comp: ScreenScouting,           scheme:'dark'  },
  { id:'A-tms-light',  label:'23 · Mannschaften · hell',     comp: ScreenTeams,              scheme:'light' },
  { id:'A-tms-dark',   label:'23 · Mannschaften · dunkel',   comp: ScreenTeams,              scheme:'dark'  },
  { id:'A-staff-light',label:'24 · Mitarbeiter · hell',      comp: ScreenStaff,              scheme:'light' },
  { id:'A-staff-dark', label:'24 · Mitarbeiter · dunkel',    comp: ScreenStaff,              scheme:'dark'  },
];

const SCREENS_COMPARE = [
  { id:'A-cmpP-light',  label:'25 · Spielervergleich · hell',   comp: ScreenPlayerCompare,    scheme:'light' },
  { id:'A-cmpP-dark',   label:'25 · Spielervergleich · dunkel', comp: ScreenPlayerCompare,    scheme:'dark'  },
  { id:'A-cmpT-light',  label:'26 · Mannschaftsvergleich · hell',   comp: ScreenTeamCompare,  scheme:'light' },
  { id:'A-cmpT-dark',   label:'26 · Mannschaftsvergleich · dunkel', comp: ScreenTeamCompare,  scheme:'dark'  },
  { id:'A-pro-light',   label:'27 · Spielerdetail · Profi-Modus · hell',   comp: ScreenPlayerDetailPro, scheme:'light' },
  { id:'A-pro-dark',    label:'27 · Spielerdetail · Profi-Modus · dunkel', comp: ScreenPlayerDetailPro, scheme:'dark'  },
  { id:'A-role-light',  label:'28 · Rollen-Editor · hell',   comp: ScreenRoleEditor,         scheme:'light' },
  { id:'A-role-dark',   label:'28 · Rollen-Editor · dunkel', comp: ScreenRoleEditor,         scheme:'dark'  },
];

const SCREENS_MORE = [
  { id:'A-trans-light', label:'29 · Transferb\u00fcro · hell',   comp: ScreenTransfers,    scheme:'light' },
  { id:'A-trans-dark',  label:'29 · Transferb\u00fcro · dunkel', comp: ScreenTransfers,    scheme:'dark'  },
  { id:'A-tbl-light',   label:'30 · Liga-Tabelle · hell',   comp: ScreenLeagueTable,  scheme:'light' },
  { id:'A-tbl-dark',    label:'30 · Liga-Tabelle · dunkel', comp: ScreenLeagueTable,  scheme:'dark'  },
  { id:'A-cup-light',   label:'31 · Pokalbaum · hell',   comp: ScreenCupBracket,   scheme:'light' },
  { id:'A-cup-dark',    label:'31 · Pokalbaum · dunkel', comp: ScreenCupBracket,   scheme:'dark'  },
  { id:'A-tick-light',  label:'32 · 2D-Ticker · hell',   comp: ScreenTicker,       scheme:'light' },
  { id:'A-tick-dark',   label:'32 · 2D-Ticker · dunkel', comp: ScreenTicker,       scheme:'dark'  },
  { id:'A-line2-light', label:'33 · Aufstellung mit Rollen · hell',   comp: ScreenLineupRoles, scheme:'light' },
  { id:'A-line2-dark',  label:'33 · Aufstellung mit Rollen · dunkel', comp: ScreenLineupRoles, scheme:'dark'  },
  { id:'A-set-light',   label:'34 · Einstellungen · hell',   comp: ScreenSettings,     scheme:'light' },
  { id:'A-set-dark',    label:'34 · Einstellungen · dunkel', comp: ScreenSettings,     scheme:'dark'  },
];

// Club-theme adaptive showcase: same hub, three different club identities.
const SCREENS_CLUBS = [
  { id:'CT-hafenstadt', label:'Hafenstadt \u00b7 marineblau + gold',  clubId:'hafenstadt'  },
  { id:'CT-kaltenbach', label:'Kaltenbach \u00b7 weinrot + creme',    clubId:'kaltenbach'  },
  { id:'CT-sauveterre', label:'Sauveterre \u00b7 tannengr\u00fcn + senf', clubId:'sauveterre'  },
  { id:'CT-auerbach',   label:'Auerbach \u00b7 wiesengr\u00fcn + butter', clubId:'auerbach'    },
];

// Desktop-Showcase artboards
const DESKTOP_SCREENS = [
  { id:'D-hub-light',     w:1440, h:900, label:'Desktop · B\u00fcro · 1440\u00d7900',           comp: DesktopHub,     scheme:'light' },
  { id:'D-hub-dark',      w:1440, h:900, label:'Desktop · B\u00fcro · dunkel',                  comp: DesktopHub,     scheme:'dark'  },
  { id:'D-match-light',   w:1440, h:900, label:'Desktop · Spielreportage',                       comp: DesktopMatch,   scheme:'light' },
  { id:'D-squad-light',   w:1440, h:900, label:'Desktop · Kader (Filter-Rail)',                   comp: DesktopSquad,   scheme:'light' },
  { id:'D-tact-light',    w:1440, h:900, label:'Desktop · Taktik (Pitch + Hebel)',                comp: DesktopTactics, scheme:'light' },
  { id:'D-fin-light',     w:1440, h:900, label:'Desktop · Finanzen (Charts)',                     comp: DesktopFinance, scheme:'light' },
  { id:'T-hub-light',     w:1024, h:768, label:'Tablet · B\u00fcro · 1024\u00d7768',              comp: TabletHub,      scheme:'light' },
];

// Depth-of-play screens (T1.1–T1.4)
const SCREENS_DEPTH = [
  { id:'A-tab-l',  label:'35 · Tabloid-Cover · Sieg · hell',     comp: ()=> <ScreenTabloidCover theme="A" scheme="light" tone="triumph"/> },
  { id:'A-tab-d',  label:'35 · Tabloid-Cover · Krise · hell',    comp: ()=> <ScreenTabloidCover theme="A" scheme="light" tone="storm"/> },
  { id:'A-tab-dd', label:'35 · Tabloid-Cover · Sieg · dunkel',   comp: ()=> <ScreenTabloidCover theme="A" scheme="dark"  tone="triumph"/> },
  { id:'A-prs-l',  label:'36 · Pressekonferenz · hell',           comp: ()=> <ScreenPressConference theme="A" scheme="light"/> },
  { id:'A-prs-d',  label:'36 · Pressekonferenz · dunkel',         comp: ()=> <ScreenPressConference theme="A" scheme="dark"/> },
  { id:'A-hbz-l',  label:'37 · Halbzeit-Sprechblasen · hell',     comp: ()=> <ScreenHalftimeBubbles theme="A" scheme="light"/> },
  { id:'A-hbz-d',  label:'37 · Halbzeit-Sprechblasen · dunkel',   comp: ()=> <ScreenHalftimeBubbles theme="A" scheme="dark"/> },
  { id:'A-trn-l',  label:'38 · Transfer · Gegenangebot · hell',   comp: ()=> <ScreenTransferNeg theme="A" scheme="light"/> },
  { id:'A-trn-d',  label:'38 · Transfer · Gegenangebot · dunkel', comp: ()=> <ScreenTransferNeg theme="A" scheme="dark"/> },
];

const SCREENS_DATA_DEPTH = [
  { id:'A-htm-l', label:'39 · Heatmap · Brody · hell',     comp: ScreenPlayerHeatmap, scheme:'light' },
  { id:'A-htm-d', label:'39 · Heatmap · Brody · dunkel',   comp: ScreenPlayerHeatmap, scheme:'dark'  },
  { id:'A-arc-l', label:'40 · Karrierebogen · hell',        comp: ScreenCareerArc,     scheme:'light' },
  { id:'A-arc-d', label:'40 · Karrierebogen · dunkel',      comp: ScreenCareerArc,     scheme:'dark'  },
  { id:'A-alb-l', label:'41 · Saison-Album · hell',         comp: ScreenSeasonAlbum,   scheme:'light' },
  { id:'A-alb-d', label:'41 · Saison-Album · dunkel',       comp: ScreenSeasonAlbum,   scheme:'dark'  },
];

const SCREENS_FINAL = [
  { id:'A-a11y-l', label:'42 · A11y-Audit · hell',           comp: ScreenA11yAudit,        scheme:'light' },
  { id:'A-a11y-d', label:'42 · A11y-Audit · dunkel',         comp: ScreenA11yAudit,        scheme:'dark'  },
  { id:'A-spn-l',  label:'43 · Sponsoren-Pyramide · hell',   comp: ScreenSponsorPyramid,   scheme:'light' },
  { id:'A-spn-d',  label:'43 · Sponsoren-Pyramide · dunkel', comp: ScreenSponsorPyramid,   scheme:'dark'  },
  { id:'A-tnl',    label:'44 · Tunnel-Moment',                comp: ScreenTunnelMoment,     scheme:'light' },
  { id:'A-trf',    label:'45 · Siegerehrung',                 comp: ScreenTrophyCeremony,   scheme:'light' },
];

function App(){
  return (
    <DesignCanvas>
      <DCSection id="crests"
        title="Wappen-Grammatik"
        subtitle="shape × 2 Tinkturen × charge × optionales Motto — deterministisch je Klub.">
        <DCArtboard id="crests-1" label="8 Klubs · prozedural" width={720} height={460}>
          <div style={{padding:20, background:'#fbf6ea'}}>
            <CrestGrammar/>
          </div>
        </DCArtboard>
      </DCSection>

      <DCSection id="identity"
        title="Klub-Identität · Wappen- & Trikot-Generator"
        subtitle="Interaktives Studio + Phone-Screen. Zwei Tinkturen, vier Schildformen, zehn Symbole, sechs Trikot-Muster — wirkt sofort auf Aufstellung, Tabelle und 2D-Ticker.">
        <DCArtboard id="identity-studio" label="Studio · Heim/Auswärts/Drittes · 1200×860" width={1200} height={860}>
          <IdentityStudio/>
        </DCArtboard>
        <DCArtboard id="identity-phone-light" label="Phone · Klub-Identität · hell" width={410} height={864}>
          <div style={{display:'grid', placeItems:'center', padding:10, background:'#f0eee9', height:'100%'}}>
            <PhoneFrame theme="A" scheme="light">
              <ScreenIdentity theme="A" scheme="light"/>
            </PhoneFrame>
          </div>
        </DCArtboard>
        <DCArtboard id="identity-phone-dark" label="Phone · Klub-Identität · dunkel" width={410} height={864}>
          <div style={{display:'grid', placeItems:'center', padding:10, background:'#f0eee9', height:'100%'}}>
            <PhoneFrame theme="A" scheme="dark">
              <ScreenIdentity theme="A" scheme="dark"/>
            </PhoneFrame>
          </div>
        </DCArtboard>
        <DCArtboard id="identity-welcome-hafenstadt" label="Welcome-Moment · Hafenstadt · hell" width={410} height={864}>
          <div style={{display:'grid', placeItems:'center', padding:10, background:'#f0eee9', height:'100%'}}>
            <PhoneFrame theme="A" scheme="light">
              <ScreenIdentityWelcome theme="A" scheme="light" clubId="hafenstadt" mgrName="Julia Lindquist" mgrInitials="JL"/>
            </PhoneFrame>
          </div>
        </DCArtboard>
        <DCArtboard id="identity-welcome-kaltenbach" label="Welcome-Moment · Kaltenbach · hell" width={410} height={864}>
          <div style={{display:'grid', placeItems:'center', padding:10, background:'#f0eee9', height:'100%'}}>
            <PhoneFrame theme="A" scheme="light">
              <ScreenIdentityWelcome theme="A" scheme="light" clubId="kaltenbach" mgrName="Marek Brody" mgrInitials="MB"/>
            </PhoneFrame>
          </div>
        </DCArtboard>
        <DCArtboard id="identity-welcome-sauveterre-dark" label="Welcome-Moment · Sauveterre · dunkel" width={410} height={864}>
          <div style={{display:'grid', placeItems:'center', padding:10, background:'#f0eee9', height:'100%'}}>
            <PhoneFrame theme="A" scheme="dark">
              <ScreenIdentityWelcome theme="A" scheme="dark" clubId="sauveterre" mgrName="Élise Vannier" mgrInitials="EV"/>
            </PhoneFrame>
          </div>
        </DCArtboard>
      </DCSection>

      <DCSection id="screens-a"
        title="Schlüsselscreens · Richtung A (empfohlen)"
        subtitle="Portrait 390×844 · hell + dunkel nebeneinander. Posteingang, Kader, Spiel, Halbzeit, Finanzen, Stadion.">
        {SCREENS_A.map(s => (
          <DCArtboard key={s.id} id={s.id} label={s.label} width={410} height={864}>
            <div style={{display:'grid', placeItems:'center', padding:10, background:'#f0eee9', height:'100%'}}>
              <PhoneFrame theme="A" scheme={s.scheme}>
                <s.comp theme="A" scheme={s.scheme}/>
              </PhoneFrame>
            </div>
          </DCArtboard>
        ))}
      </DCSection>

      <DCSection id="screens-final"
        title="A11y, Sponsoren & Kino-Momente"
        subtitle="Barrierefreiheits-Audit als Screen, Sponsor-Pyramide mit Vertrags-Gantt, Tunnel-Moment vor Anpfiff und Siegerehrung als Cover-Animation.">
        {SCREENS_FINAL.map(s => (
          <DCArtboard key={s.id} id={s.id} label={s.label} width={410} height={864}>
            <div style={{display:'grid', placeItems:'center', padding:10, background:'#f0eee9', height:'100%'}}>
              <PhoneFrame theme="A" scheme={s.scheme}>
                <s.comp theme="A" scheme={s.scheme}/>
              </PhoneFrame>
            </div>
          </DCArtboard>
        ))}
      </DCSection>

      <DCSection id="library"
        title="Komponenten­bibliothek"
        subtitle="Sieben Kategorien, alle Composites mit Datei, Props und Varianten. Engineering-Handoff für die shadcn-Implementierung — Begleitdokument: COMPONENTS.md.">
        <DCArtboard id="lib-brand"     label="Marken-Atome"          width={1200} height={760}><LibBrand/></DCArtboard>
        <DCArtboard id="lib-atoms"     label="Daten-Atome"           width={1200} height={780}><LibDataAtoms/></DCArtboard>
        <DCArtboard id="lib-chips"     label="Chips & Pills"         width={1200} height={780}><LibChips/></DCArtboard>
        <DCArtboard id="lib-inputs"    label="Eingabe"                width={1200} height={780}><LibInputs/></DCArtboard>
        <DCArtboard id="lib-cards"     label="Karten-Composites"      width={1200} height={1280}><LibCards/></DCArtboard>
        <DCArtboard id="lib-pitch"     label="Spielfeld & Stadion"    width={1200} height={1180}><LibPitch/></DCArtboard>
        <DCArtboard id="lib-stats"     label="Statistik & Daten"     width={1200} height={820}><LibStats/></DCArtboard>
      </DCSection>

      <DCSection id="screens-data-depth"
        title="Daten-Tiefe & Saison-Archiv"
        subtitle="Heatmap pro Spieler-Spiel, vertikaler Karrierebogen wie ein Lebenslauf, Saison-Album im Vintage-Stil.">
        {SCREENS_DATA_DEPTH.map(s => (
          <DCArtboard key={s.id} id={s.id} label={s.label} width={410} height={864}>
            <div style={{display:'grid', placeItems:'center', padding:10, background:'#f0eee9', height:'100%'}}>
              <PhoneFrame theme="A" scheme={s.scheme}>
                <s.comp theme="A" scheme={s.scheme}/>
              </PhoneFrame>
            </div>
          </DCArtboard>
        ))}
      </DCSection>

      <DCSection id="live"
        title="Live-Demo · Tokens bei der Arbeit"
        subtitle="Tippe einen Verein, ein Schema oder eine Datendichte. Der gleiche Code rendert neu — beweist die Adaptierbarkeit.">
        <DCArtboard id="live-demo" label="Tweakable Hub" width={920} height={900}>
          <LiveThemeDemo/>
        </DCArtboard>
      </DCSection>

      <DCSection id="screens-depth"
        title="Anstoss-Tiefe · Tabloid, Pressekonferenz, Halbzeit, Verhandlung"
        subtitle="Vier Screens, die das Anstoss-Gefühl konkret machen: Spiel-Cover, verzweigte PK, Halbzeit als Spielerstimmen, Transfer als Gegenangebot-Loop.">
        {SCREENS_DEPTH.map(s => (
          <DCArtboard key={s.id} id={s.id} label={s.label} width={410} height={864}>
            <div style={{display:'grid', placeItems:'center', padding:10, background:'#f0eee9', height:'100%'}}>
              <div className="phone-frame">
                <div className="phone-screen" style={{ background: THEMES.A.light.bg, color: THEMES.A.light.ink, fontFamily: THEMES.A.ui }}>
                  <div className="phone-notch"></div>
                  <div className="phone-status" style={{ color: THEMES.A.light.ink }}>
                    <span>09:41</span>
                    <span className="sig" style={{display:'flex',gap:6,alignItems:'center'}}>
                      <I.CloudOff size={14} sw={2} color={THEMES.A.light.ink}/>
                      <I.Battery size={20} sw={1.5} color={THEMES.A.light.ink}/>
                    </span>
                  </div>
                  <div className="phone-content">
                    <s.comp/>
                  </div>
                </div>
              </div>
            </div>
          </DCArtboard>
        ))}
      </DCSection>

      <DCSection id="responsive"
        title="Responsive \u00b7 Desktop & Tablet"
        subtitle="Selber React-Code, neu komponiert. 1440\u00d7900 mit linker Nav, rechtem Kontext-Rail, 4-Spalten-KPI-Grid. 1024 als Zwischenstufe.">
        {DESKTOP_SCREENS.map(s => (
          <DCArtboard key={s.id} id={s.id} label={s.label} width={s.w} height={s.h}>
            <div style={{width:'100%', height:'100%', overflow:'hidden'}}>
              <s.comp theme="A" scheme={s.scheme}/>
            </div>
          </DCArtboard>
        ))}
      </DCSection>

      <DCSection id="screens-clubs"
        title="Vereins-Theming \u00b7 adaptive Akzentfarbe"
        subtitle="Selber Hub-Screen, vier Vereine. Token-System l\u00f6st --accent / --accent-soft aus CLUB_REGISTRY auf.">
        {SCREENS_CLUBS.map(s => (
          <DCArtboard key={s.id} id={s.id} label={s.label} width={410} height={864}>
            <div style={{display:'grid', placeItems:'center', padding:10, background:'#f0eee9', height:'100%'}}>
              <div className="phone-frame">
                <div className="phone-screen" style={{ background: THEMES['A_'+s.clubId].light.bg, color: THEMES['A_'+s.clubId].light.ink, fontFamily: THEMES.A.ui }}>
                  <div className="phone-notch"></div>
                  <div className="phone-status" style={{ color: THEMES['A_'+s.clubId].light.ink }}>
                    <span>09:41</span>
                    <span className="sig" style={{display:'flex',gap:6,alignItems:'center'}}>
                      <I.CloudOff size={14} sw={2} color={THEMES['A_'+s.clubId].light.ink}/>
                      <I.Battery size={20} sw={1.5} color={THEMES['A_'+s.clubId].light.ink}/>
                    </span>
                  </div>
                  <div className="phone-content">
                    <ClubHub clubId={s.clubId} scheme="light"/>
                  </div>
                </div>
              </div>
            </div>
          </DCArtboard>
        ))}
      </DCSection>

      <DCSection id="screens-more"
        title="Transfer, Tabelle, Pokal, Ticker, Rollen, Einstellungen"
        subtitle="Sechs weitere Screens \u2014 vom Transferb\u00fcro bis zur Einstellungs-Seite.">
        {SCREENS_MORE.map(s => (
          <DCArtboard key={s.id} id={s.id} label={s.label} width={410} height={864}>
            <div style={{display:'grid', placeItems:'center', padding:10, background:'#f0eee9', height:'100%'}}>
              <PhoneFrame theme="A" scheme={s.scheme}>
                <s.comp theme="A" scheme={s.scheme}/>
              </PhoneFrame>
            </div>
          </DCArtboard>
        ))}
      </DCSection>

      <DCSection id="screens-cmp"
        title="Vergleiche & Profi-Modus"
        subtitle="Spieler an Spieler, Klub an Klub, vollständige Attributtabelle, Rollen-Editor mit Trequartista/Abräumer/Libero & Co.">
        {SCREENS_COMPARE.map(s => (
          <DCArtboard key={s.id} id={s.id} label={s.label} width={410} height={864}>
            <div style={{display:'grid', placeItems:'center', padding:10, background:'#f0eee9', height:'100%'}}>
              <PhoneFrame theme="A" scheme={s.scheme}>
                <s.comp theme="A" scheme={s.scheme}/>
              </PhoneFrame>
            </div>
          </DCArtboard>
        ))}
      </DCSection>

      <DCSection id="screens-team"
        title="Spieler, Training, Medizin, Scouting, Mannschaften & Stab"
        subtitle="Sieben Screens für die Tiefe: Spielerprofil, Wochentraining, Einzeltraining, Krankenstation, Scouting-Netz, drei Mannschaften, Mitarbeiterübersicht.">
        {SCREENS_TEAM.map(s => (
          <DCArtboard key={s.id} id={s.id} label={s.label} width={410} height={864}>
            <div style={{display:'grid', placeItems:'center', padding:10, background:'#f0eee9', height:'100%'}}>
              <PhoneFrame theme="A" scheme={s.scheme}>
                <s.comp theme="A" scheme={s.scheme}/>
              </PhoneFrame>
            </div>
          </DCArtboard>
        ))}
      </DCSection>

      <DCSection id="screens-tact"
        title="Taktik, Aufstellung & Statistik"
        subtitle="Detaillierte Taktikgruppen, Aufstellung mit Tausch-Interaktion, mehrstufiges Statistik-Dashboard.">
        {SCREENS_TACT.map(s => (
          <DCArtboard key={s.id} id={s.id} label={s.label} width={410} height={864}>
            <div style={{display:'grid', placeItems:'center', padding:10, background:'#f0eee9', height:'100%'}}>
              <PhoneFrame theme="A" scheme={s.scheme}>
                <s.comp theme="A" scheme={s.scheme}/>
              </PhoneFrame>
            </div>
          </DCArtboard>
        ))}
      </DCSection>

      <DCSection id="screens-neg"
        title="Verhandlungen & Stimmung"
        subtitle="Anstoss-Stimmung: Porträts, Stimmungsgesichter, Vertrauensbarometer. Vier Schlüsselszenen.">
        {SCREENS_NEG.map(s => (
          <DCArtboard key={s.id} id={s.id} label={s.label} width={410} height={864}>
            <div style={{display:'grid', placeItems:'center', padding:10, background:'#f0eee9', height:'100%'}}>
              <PhoneFrame theme="A" scheme={s.scheme}>
                <s.comp theme="A" scheme={s.scheme}/>
              </PhoneFrame>
            </div>
          </DCArtboard>
        ))}
      </DCSection>

      <DCSection id="screens-onb"
        title="Onboarding & Karriereverwaltung"
        subtitle="60 Sekunden bis zum ersten Spieltag. Slots, Export/Import, iOS-Installations­hinweis.">
        {SCREENS_ONBOARD.map(s => (
          <DCArtboard key={s.id} id={s.id} label={s.label} width={410} height={864}>
            <div style={{display:'grid', placeItems:'center', padding:10, background:'#f0eee9', height:'100%'}}>
              <PhoneFrame theme="A" scheme={s.scheme}>
                <s.comp theme="A" scheme={s.scheme}/>
              </PhoneFrame>
            </div>
          </DCArtboard>
        ))}
      </DCSection>

      <DCSection id="tokens"
        title="Tokens & Komponenten"
        subtitle="tailwind.config.ts, components.json, shadcn-Primitive & eigene Komposita.">
        <DCArtboard id="tokens-card" label="Code & Inventar" width={820} height={1480}>
          <div style={{padding:20, background:'#f0eee9'}}>
            <TokensPanel/>
          </div>
        </DCArtboard>
      </DCSection>

      <DCSection id="rationale"
        title="Rationale"
        subtitle="Designabsicht, Richtungs- & Screen-Begründung und Empfehlung.">
        <DCArtboard id="rationale-card" label="Markdown · Lesefassung" width={780} height={1840}>
          <RationaleDoc/>
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

function RationaleDoc(){
  return (
    <div style={{padding:'28px 36px', background:'#fbf6ea', color:'#1a1410',
      fontFamily:'Newsreader, Georgia, serif', lineHeight:1.55, fontSize:15}}>
      <style>{`
        .r h1{font:700 30px/1.05 Newsreader,Georgia,serif;margin:0 0 4px}
        .r .kicker{font:700 11px/1.2 Inter;letter-spacing:1.4px;text-transform:uppercase;color:#b7301b;margin-bottom:10px}
        .r h2{font:700 22px/1.1 Newsreader,Georgia,serif;margin:24px 0 6px;padding-top:10px;border-top:1px solid #d9cdb4}
        .r h3{font:700 16px/1.15 Newsreader,Georgia,serif;margin:18px 0 4px;color:#1a1410}
        .r p, .r li{font:400 14.5px/1.55 Newsreader,Georgia,serif;color:#2a221c}
        .r ul{padding-left:20px;margin:4px 0 8px}
        .r b, .r strong{font-weight:700}
        .r .dropcap{float:left;font-size:54px;line-height:.85;font-weight:700;color:#b7301b;padding:6px 8px 0 0}
        .r .verdict{background:#f4ede0;border:1px solid #d9cdb4;border-left:4px solid #b7301b;border-radius:10px;padding:14px 16px;margin-top:14px}
        .r .verdict h2{border:0;padding:0;margin:0 0 4px;color:#b7301b}
        .r .small{font:500 12px/1.4 Inter;color:#5a4f44}
        .r kbd{font:600 11px/1 "JetBrains Mono",monospace;background:#ece2cf;padding:2px 5px;border-radius:4px;color:#1a1410}
      `}</style>
      <div className="r">
        <div className="kicker">Aurelia Premier · Design-Rationale · Mai 2026</div>
        <h1>„Karte, nicht Tabelle. Anpfiff, nicht Start."</h1>
        <p style={{marginTop:10}}>
          <span className="dropcap">A</span>
          Aurelia Premier ist ein Trainerspiel für die Hosentasche und das Sofa — und beide Sitzungen sollen sich gleich gut anfühlen. Die gesamte Sprache des Interfaces ist auf einen einzigen Verb-Loop ausgelegt: <b>weiter zum nächsten Termin</b>. Alles, was nicht diesen Loop bedient — eine Karte beantworten, einen Wechsel bestätigen, einen Anpfiff geben — wird in den Hintergrund gerückt. Wir entscheiden uns gegen die FM-Tabellenwand und gegen die Top-Eleven-Buntheit. Wir spielen ein Tabloid: warm, ernst, mit trockenem Witz in der Kopie und ruhigem Chrom im Layout.
        </p>

        <h2>Die Richtung</h2>

        <h3>Sonntagszeitung</h3>
        <p>
          Cremepapier (<kbd>#f4ede0</kbd>), dunkle Tinte (<kbd>#1a1410</kbd>), ein einziger scharlachroter Akzent (<kbd>#b7301b</kbd>). Newsreader für Schlagzeilen, Inter für UI, JetBrains Mono für Zahlen. Trifft die Anstoss-DNA frontal: die Schlagzeile macht den Witz, das Layout bleibt streng. Geringe Sättigung, hohe Lesbarkeit, druckreif. Risiko: könnte zu „erwachsen" wirken — wir kompensieren mit kursivem Zitat-Kicker auf dem Hub und Schwarzweißfotostil bei späteren Pressebildern.
        </p>

        <h2>Per Schlüsselscreen — was wir machen und warum</h2>

        <h3>01 · Office Hub</h3>
        <p>Tabloid-Zitat oben als Kicker, prominente Nächster-Termin-Karte, vier Hub-Kacheln (Training, Transfer, Vorstand, Finanzen) mit kurzer „Flag"-Zeile in Scharlach für aktuelle Reibung. Der Advance-Button füllt die untere Daumenzone, zeigt links den Tagesoffset (<kbd>+3 Tage</kbd>), damit klar ist, wieviel Zeit vergeht. Bewusst <b>kein</b> Bottom-Tab-Bar — sie würde mit dem einzigen wichtigen Button kollidieren.</p>

        <h3>02 · Posteingang</h3>
        <p>Karten statt Listenzeilen, eine Glyphe pro Absender­typ (Vorstand §, Presse ¶, Sponsor €, Scout ◎, Fans ♪) zusätzlich zur Farbe — Pflicht wegen WCAG. Aktionen sind <b>immer dieselben vier Pillen</b>: Annehmen / Vertagen / Ablehnen / [Mehr]. Lange Pressetext-Modi öffnen erst beim Long-Press, damit der Daumen-Flow nicht unterbrochen wird.</p>

        <h3>03 · Kader</h3>
        <p>Wir bestrafen FM-Datendichte. Statt 1–20 Attribut­gitter: 1–10 Stärkebalken (mit numerischer Ziffer daneben — <b>nie nur Farbe</b>), 4 Talent-Sterne, Form als Dezimalzahl, Vertragsdatum mit Punkt-Glyphe vor Auslauf-Spielern. Sort-Chips oben. Schwerer Headerblock, leichte Karten.</p>

        <h3>04 · Vor dem Anpfiff</h3>
        <p>Side-by-side Statstrip, akzentuierte Spalte für den Underdog-Effekt. Schlüssel­spieler­karten — eine davon „in Form" mit scharlachrotem Rand. Direktvergleich mit fünf farbig-glyph-codierten Kacheln (S/U/N), darunter eine kursive Sonntagszeitungs-Zeile als Erzähl-Anker. Der Anpfiff-CTA ist <b>der einzige scharlachrote Block der App</b> — er gewinnt jeden Vergleich.</p>

        <h3>05 · Spielreportage</h3>
        <p>Newspaper-Typo (Newsreader), Minute links, Glyph in der Mitte, Schlagzeile + Untertitel rechts. Tore sind 17px serif, alles andere 14px. Tab-Wechsel oben zwischen Reportage und 2D-Ticker — der Ticker ist die zweite Tier, nicht der Default. Mini-Pitch-Icon bei Standards. Tempo-Button in der unteren Daumenzone, Pause-Button daneben.</p>

        <h3>06 · Halbzeit (Bottom Sheet)</h3>
        <p>Drei Pflicht-Knöpfe: Formation (horizontal scroll, fünf Optionen), Mentalität (Sichern / Ausgeglichen / Drücken), vorgeschlagener Wechsel (Co-Trainer-Empfehlung mit „warum?"). „Mehr Taktik" als Expander — versteckt komplexere FM-Hebel für Spieler, die sie suchen, ohne sie als Default zu zeigen.</p>

        <h3>07 · Finanzen</h3>
        <p>Zwei-Layer P&L mit segmentierten Tabs (Betrieb / Investition / Verlauf). Die Verbandsabgabe ist <b>oben rechts persistent</b> als LevyChip — sie ist die laufende Reibung, die der Spieler nie vergessen darf. Drei Slider mit Live-Tooltip in Euro/Saison, nicht in Prozent. Monatssaldo prominent serif.</p>

        <h3>08 · Stadionausbau</h3>
        <p>Heraldischer Iso-Plot mit fünf Slot-Pins (✓ vs +). Slot-Karten sind Karten, keine Tabellenzeilen — ROI in Grün, Kosten in Grau, Status rechts. Klubdisco mit „Imagerisiko"-Hinweis (kein Ärger mit dem Vorstand, aber wir benennen die Reibung).</p>

        <h3>09 · Onboarding</h3>
        <p>Drei Screens, je 15–25 Sek.: Land (echt) → Klub (prozedural gewürfelt aus 6, mit Würfeln-Button für Neuwurf) → Manager (Initialen-Chip, keine Foto-Uploads). Fortschrittsbalken oben. Der „Karriere starten"-Button ist <b>schwarz</b> auf Creme — das ist der einzige Moment, an dem wir den Akzent nicht brauchen, weil der Klub-Akzent gleich übernimmt.</p>

        <h3>10 · Karriereverwaltung</h3>
        <p>Drei Slot-Karten, eine als Plus-Tile leer. Pro Slot: Quotenbalken (<kbd>navigator.storage.estimate()</kbd>), explizite Export/Import/Lösch-Knöpfe — alle 44×44px. Persistent offline-Hinweis oben. Eigene scharlachrote Banner-Karte für iOS-Spieler, die noch nicht installiert haben — mit Safari-Share-Glyphe.</p>

        <h2>Empfehlung</h2>
        <div className="verdict">
          <h2>Sonntagszeitung — die einzige Richtung.</h2>
          <p>Sie trägt die Anstoss-DNA, <b>ohne</b> Football Managers Kälte zu kopieren oder in Top-Eleven-Buntheit abzurutschen. Newsreader-Schlagzeilen + Cremepapier sind unser Schutzschild gegen den „SaaS-Look", den die Aufgabe ausdrücklich verbietet. Der einzelne Akzent (<kbd>#b7301b</kbd>) verhindert Akzent-Inflation und gibt dem Anpfiff-Button eine seltene, fast feierliche Bedeutung. Dark Mode ist hier kein Afterthought — wir verschieben das Papier ins Sepia-Schwarz, behalten den Ink-Akzent.</p>
          <p style={{marginTop:8}}><b>Was ich streichen würde:</b> Das „Klubdisco"-Slot. Auch wenn wir es höflich formulieren, riecht es nach den Anstoss-Tropes (schwarzes Konto, Doping), die wir laut Brief explizit nicht haben wollen. Wir ersetzen es durch <i>Konferenzräume</i> (Sponsoring-Auftritt) oder <i>Multifunktions-Arena</i> (Konzerte) — beides Tabloid-tauglich, beides ohne PR-Risiko.</p>
          <p style={{marginTop:8}}><b>Was als Nächstes wackelt:</b> der 2D-Ticker (Inhalt = post-MVP) und der Cup-Bracket — den haben wir absichtlich aus dem Brief gelassen. Beides bekommt eine eigene Runde.</p>
        </div>

        <h2>Zugänglichkeit — Stichproben</h2>
        <ul>
          <li>Body-Kontrast Ink/Paper: ≈ 14:1 (AA bestanden, AAA möglich).</li>
          <li>Scharlach/Paper: ≈ 5.3:1 → für ≥ 14pt fettes Body und für Buttons mit weißem Text auf Scharlach (≈ 5.8:1).</li>
          <li>Form-S/N/U und Inbox-Glyphen sind doppelt codiert: Farbe + Buchstabe/Symbol.</li>
          <li>Alle primären Aktionen ≥ 44×44 px, Advance-Button 56 px hoch.</li>
          <li>Hub, Posteingang, Spiel, Halbzeit, Finanzen, Stadion und Saves vertikal scrollbar bei 200 % Zoom (keine horizontalen Overflow-Falle in den oberen 60 %).</li>
          <li>Animationen ≤ 220 ms, alle <kbd>motion-safe:</kbd>-gegated.</li>
        </ul>

        <h2>Sprache</h2>
        <ul>
          <li>Anpfiff (nie „Start Match"), Posteingang (nie „Notifications"), Vorstandsvertrauen (nie „Board Confidence"), Verbandsabgabe (nie „Tax"), Anbau (nie „Module").</li>
          <li>Schlagzeilen-Stil: 4–8 Wörter, Aktiv, kein Doppelpunkt-Header („Brody schießt sich in die Herzen", nicht „Spieler-News: Brody"). </li>
          <li>Zahlen: <kbd>12.500 €</kbd>, <kbd>2,4 Mio. €</kbd>, Form als Komma-Dezimal („7,4").</li>
        </ul>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
