// depth.jsx — depth-of-play screens:
//   35  Tabloid-Cover (T1.1)
//   36  Pressekonferenz mit Verzweigungen (T1.3)
//   37  Halbzeit-Sprechblasen (T1.4)
//   38  Transfer-Gegenangebot-Loop (T1.2)
//   + LiveXgStrip helper (T2.3) used by match header

// =================================================================
// 35 — TABLOID COVER
// Full-bleed newspaper-style cover. Used as a post-match special.
// =================================================================
function ScreenTabloidCover({theme='A', scheme='light', tone='triumph'}){
  const t = THEMES[theme][scheme];
  // Two preset stories — 'triumph' (win) or 'storm' (crisis)
  const STORY = tone === 'storm' ? {
    masthead:'DER HAFEN-BOTE',
    date:'Montag · 25. Mai 2026',
    edition:'Nr. 132 · 1,80 €',
    kicker:'KRISE IM VORSTAND',
    headline:'„Drei Wochen, dann fällt die Geduld."',
    sub:'Aufsichtsrat zieht die Daumenschrauben an — der Trainerin bleibt wenig Zeit.',
    facts:[
      { l:'Letztes Spiel',  v:'1:3 in Northbridge' },
      { l:'Tabelle',        v:'auf Rang 4 abgerutscht' },
      { l:'Stimmung',       v:'„angespannt"' },
      { l:'Vorstandsfrist', v:'21 Tage' },
    ],
    quote:'„Ich respektiere den Druck. Er gehört zum Beruf."',
    quoteWho:'— Julia Lindquist, Cheftrainerin',
    stamp:'EILMELDUNG',
  } : {
    masthead:'DER HAFEN-BOTE',
    date:'Montag · 25. Mai 2026',
    edition:'Nr. 132 · 1,80 €',
    kicker:'POKAL-VIERTELFINALE',
    headline:'„Brody schießt sich in die Herzen."',
    sub:'2:1 in Northbridge — Hafenstadt stürmt ins Viertelfinale, die Tribünen singen den Spielmacher hoch.',
    facts:[
      { l:'Endstand',  v:'Northbridge 1 : 2 Hafenstadt' },
      { l:'Torschützen', v:'Wieser 34\' · Brody 82\'' },
      { l:'Spieler des Spiels', v:'Marek Brody · 8,7' },
      { l:'Zuschauer', v:'27.412 in der Northbridge Arena' },
    ],
    quote:'„Diese Stadt hat zwei Jahre auf so einen Abend gewartet."',
    quoteWho:'— Marek Brody, OM',
    stamp:'BESTE AUSGABE SEIT 2018',
  };

  return (
    <div style={{
      display:'flex', flexDirection:'column', height:'100%',
      background:t.bg, color:t.ink, fontFamily:THEMES[theme].font,
      position:'relative', overflow:'hidden'
    }}>
      <ThemeCss theme={theme} scheme={scheme}/>
      {/* Close button overlay */}
      <button aria-label="Schließen" style={{
        position:'absolute', top:8, right:12, zIndex:20,
        width:36, height:36, borderRadius:99,
        background:t.card, border:`1px solid ${t.rule}`,
        display:'grid', placeItems:'center', cursor:'pointer'
      }}><I.X color={t.ink} size={16}/></button>

      {/* Newspaper page */}
      <div style={{
        flex:1, overflowY:'auto',
        padding:'18px 22px 90px',
        background: scheme === 'light' ? '#f0e8d0' : '#1f1812',
        // subtle paper texture using gradient
        backgroundImage: scheme === 'light'
          ? 'radial-gradient(circle at 20% 30%, rgba(0,0,0,.025) 0%, transparent 60%), radial-gradient(circle at 80% 70%, rgba(0,0,0,.03) 0%, transparent 60%)'
          : 'radial-gradient(circle at 20% 30%, rgba(255,255,255,.02) 0%, transparent 60%), radial-gradient(circle at 80% 70%, rgba(255,255,255,.025) 0%, transparent 60%)'
      }}>
        {/* Masthead */}
        <div style={{
          textAlign:'center', borderBottom:`2px solid ${t.ink}`,
          paddingBottom:8, marginBottom:12
        }}>
          <div style={{
            fontFamily:THEMES[theme].font,
            fontSize:34, fontWeight:800, color:t.ink, letterSpacing:-1.5,
            lineHeight:1
          }}>{STORY.masthead}</div>
          <div style={{
            display:'flex', justifyContent:'space-between',
            fontFamily:THEMES[theme].ui, fontSize:9.5, color:t.inkMute,
            letterSpacing:.6, textTransform:'uppercase', marginTop:6, fontWeight:700
          }}>
            <span>{STORY.date}</span>
            <span style={{fontStyle:'italic', fontFamily:THEMES[theme].font, textTransform:'none', letterSpacing:0}}>
              „Wahrheit, Witz und ein wenig Wehmut."
            </span>
            <span>{STORY.edition}</span>
          </div>
        </div>

        {/* Kicker */}
        <div style={{
          fontFamily:THEMES[theme].ui, fontSize:10.5,
          fontWeight:800, color:tone==='storm'?t.danger:t.accent,
          letterSpacing:1.4, marginBottom:4
        }}>· {STORY.kicker} ·</div>

        {/* Headline */}
        <h1 style={{
          fontFamily:THEMES[theme].font, fontSize:34, fontWeight:800,
          color:t.ink, lineHeight:1.04, letterSpacing:-0.8,
          margin:'0 0 8px', textWrap:'balance'
        }}>{STORY.headline}</h1>
        <p style={{
          fontFamily:THEMES[theme].font, fontStyle:'italic', fontSize:15,
          color:t.inkMute, lineHeight:1.35, margin:'0 0 16px'
        }}>{STORY.sub}</p>

        {/* Photo placeholder — high-contrast SVG, half-tone-ish */}
        <div style={{
          background:t.ink, color:t.bg, borderRadius:4,
          position:'relative', overflow:'hidden',
          margin:'0 -4px 12px',
          aspectRatio:'16/9'
        }}>
          <svg viewBox="0 0 320 180" style={{width:'100%', height:'100%', display:'block'}}>
            <defs>
              <pattern id="dots" x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r=".6" fill="#fff" opacity=".25"/>
              </pattern>
            </defs>
            <rect width="320" height="180" fill="#0b0808"/>
            <rect width="320" height="180" fill="url(#dots)"/>
            {/* stadium silhouette */}
            <path d="M0 165 L60 140 L80 130 L120 122 L160 118 L200 122 L240 130 L260 140 L320 165 L320 180 L0 180 Z" fill="#1a1410" opacity=".9"/>
            {/* crowd silhouette */}
            <g fill="#fff" opacity=".18">
              {Array.from({length:50}).map((_,i)=>(
                <circle key={i} cx={6 + i*6.4} cy={155 + (i%3)*4} r="2.8"/>
              ))}
            </g>
            {/* foreground figure — running silhouette */}
            <g fill="#fff" opacity=".95">
              <circle cx="160" cy="80" r="10"/>
              <path d="M152 90 L168 90 L172 130 L156 130 Z"/>
              <path d="M152 90 L138 110 L142 116 L156 100 Z"/>
              <path d="M168 90 L182 96 L186 84 L170 80 Z"/>
              <path d="M156 130 L148 158 L156 158 L162 134 Z"/>
              <path d="M172 130 L184 155 L176 158 L168 134 Z"/>
            </g>
            {/* caption */}
            <text x="12" y="173" fontFamily="Inter" fontSize="6" fontWeight="700" letterSpacing="1" fill="#fff" opacity=".6">FOTO · S. KAUFMANN / HAFEN-BOTE</text>
          </svg>
          {/* corner stamp */}
          <div style={{
            position:'absolute', top:10, right:10,
            transform:'rotate(8deg)',
            padding:'5px 10px',
            border:`2px solid ${tone==='storm'?t.danger:t.accent}`,
            color:tone==='storm'?t.danger:t.accent,
            background:'#fff', fontFamily:THEMES[theme].ui,
            fontSize:9.5, fontWeight:900, letterSpacing:1.5,
          }}>{STORY.stamp}</div>
        </div>

        {/* Body 2-col layout: facts + dropcap paragraph */}
        <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:14, marginBottom:14}}>
          <div>
            <p style={{
              fontFamily:THEMES[theme].font, fontSize:14, color:t.ink,
              lineHeight:1.55, margin:0, textIndent:0
            }}>
              <span style={{
                float:'left', fontSize:46, lineHeight:.85, fontWeight:800,
                marginRight:6, marginTop:3, color: tone==='storm'?t.danger:t.accent,
                fontFamily:THEMES[theme].font
              }}>{tone==='storm'?'D':'H'}</span>
              {tone === 'storm'
                ? 'er Aufsichtsrat tagte am Sonntagabend — und stand danach vor der Presse. Es war kein guter Auftritt. Ungewöhnlich knapp gehalten, ungewöhnlich kalt im Ton. Was sich abzeichnet, hätte vor drei Monaten noch niemand für möglich gehalten.'
                : 'afenstadt ist wieder Hafenstadt. Wer den Vortag in der Nordbridge-Arena verbracht hat, wird das Singen lange in den Ohren behalten. Und mittendrin, mit Tor und Vorlage und einem Lächeln, das aussah, als hätte er nie weggehört: Marek Brody.'}
            </p>
            <blockquote style={{
              fontFamily:THEMES[theme].font, fontStyle:'italic',
              borderLeft:`3px solid ${t.accent}`, paddingLeft:10, marginTop:10,
              fontSize:13, color:t.inkMute, lineHeight:1.45
            }}>
              {STORY.quote}
              <div style={{fontStyle:'normal', fontSize:11, fontFamily:THEMES[theme].ui, color:t.inkSoft, marginTop:4}}>{STORY.quoteWho}</div>
            </blockquote>
          </div>
          <div style={{borderLeft:`1px solid ${t.rule}`, paddingLeft:12}}>
            <div style={{fontSize:10, fontWeight:800, color:t.inkMute, letterSpacing:.8, textTransform:'uppercase', marginBottom:6}}>Auf einen Blick</div>
            {STORY.facts.map((f,i)=>(
              <div key={i} style={{padding:'7px 0', borderBottom: i<STORY.facts.length-1?`1px dashed ${t.rule}`:'none'}}>
                <div style={{fontSize:9.5, color:t.inkSoft, fontWeight:700, letterSpacing:.3, textTransform:'uppercase', fontFamily:THEMES[theme].ui}}>{f.l}</div>
                <div style={{fontSize:12.5, color:t.ink, fontWeight:700, marginTop:1}}>{f.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Continuation teaser */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, paddingTop:12, borderTop:`2px solid ${t.ink}`}}>
          {[
            { kicker:'SEITE 3', t:'Wer wechselt im Sommer?', s:'Drei Namen, ein Verdacht.' },
            { kicker:'SEITE 5', t:'Northbridges Trainer geht', s:'„Die Niederlage war zu viel."' },
          ].map((c,i)=>(
            <div key={i}>
              <div style={{fontSize:9.5, fontWeight:800, color:t.accent, letterSpacing:.8, fontFamily:THEMES[theme].ui}}>{c.kicker}</div>
              <SerifH theme={theme} style={{display:'block', fontSize:14, fontWeight:700, color:t.ink, lineHeight:1.2, marginTop:2}}>{c.t}</SerifH>
              <div style={{fontSize:11, color:t.inkMute, fontStyle:'italic', marginTop:2}}>{c.s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTAs */}
      <div style={{position:'absolute', left:0, right:0, bottom:0, padding:'10px 16px 20px', display:'flex', gap:8, background:`linear-gradient(to top, ${t.bg} 80%, transparent)`}}>
        <button style={{flex:1, height:48, borderRadius:12, background:t.card, border:`1px solid ${t.rule}`, color:t.ink, fontWeight:700, fontSize:12, fontFamily:THEMES[theme].ui, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6}}>
          <I.Download size={15} color={t.ink}/> Ins Album
        </button>
        <button style={{flex:1, height:48, borderRadius:12, background:t.card, border:`1px solid ${t.rule}`, color:t.ink, fontWeight:700, fontSize:12, fontFamily:THEMES[theme].ui, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6}}>
          <I.ShareIos size={15} color={t.ink}/> Teilen
        </button>
        <button style={{flex:1.6, height:48, borderRadius:12, background:t.ink, border:'none', color:t.bg, fontWeight:800, fontSize:13, fontFamily:THEMES[theme].ui}}>
          Weiter zum Termin
        </button>
      </div>
    </div>
  );
}

// =================================================================
// 36 — PRESSEKONFERENZ MIT VERZWEIGUNGEN
// Five-question flow. Each answer shows predicted outcome pills.
// =================================================================
function ScreenPressConference({theme='A', scheme='light'}){
  const t = THEMES[theme][scheme];
  const QUESTIONS = [
    {
      who:'Auerbach-Zeitung', whoTag:'Hauptblatt',
      q:'Hafenstadt zwei Punkte hinter Riverdale. Was sagen Sie zum Titelrennen?',
      answers:[
        { l:'Wir konzentrieren uns auf das nächste Spiel.', tone:'höflich',
          predict:[{w:'Vorstand', d:0},{w:'Fans', d:-1},{w:'Sponsor', d:0}] },
        { l:'Wir holen Riverdale. Punkt.', tone:'kantig',
          predict:[{w:'Vorstand', d:+1},{w:'Fans', d:+2},{w:'Sponsor', d:+1}] },
        { l:'Die Tabelle interessiert nur Statistiker.', tone:'sarkasmus',
          predict:[{w:'Vorstand', d:-1},{w:'Fans', d:0},{w:'Sponsor', d:-1}] },
      ],
    },
    {
      who:'Sport-Echo', whoTag:'Sportblatt',
      q:'Brody wird mit Riverdale in Verbindung gebracht. Bestätigen Sie das?',
      answers:[
        { l:'Marek bleibt bis 2027 — Punkt.', tone:'höflich',
          predict:[{w:'Vorstand', d:0},{w:'Brody', d:+1},{w:'Fans', d:+1}] },
        { l:'Ich kommentiere keine Gerüchte.', tone:'neutral',
          predict:[{w:'Vorstand', d:0},{w:'Brody', d:0},{w:'Fans', d:0}] },
        { l:'Wer ihn will, soll zahlen.', tone:'kantig',
          predict:[{w:'Vorstand', d:-1},{w:'Brody', d:-2},{w:'Fans', d:-1}] },
      ],
    },
    {
      who:'Tageskurier', whoTag:'Boulevard',
      q:'Das Klubhotel macht Verluste. Hat sich der Vorstand verkalkuliert?',
      answers:[
        { l:'Das ist Sache des Aufsichtsrats.', tone:'höflich',
          predict:[{w:'Vorstand', d:+1},{w:'Fans', d:0}] },
        { l:'Der Plan ist langfristig — geben Sie ihm Zeit.', tone:'höflich',
          predict:[{w:'Vorstand', d:+2},{w:'Fans', d:0}] },
        { l:'Hätten Sie das Geld besser in Spieler gesteckt?', tone:'kantig',
          predict:[{w:'Vorstand', d:-2},{w:'Fans', d:+2}] },
      ],
    },
  ];
  const [idx, setIdx] = React.useState(0);  // current question
  const [picked, setPicked] = React.useState(null); // chosen answer index for current Q
  const total = QUESTIONS.length;
  const q = QUESTIONS[idx];

  const next = () => {
    if (idx < total-1) { setIdx(i=>i+1); setPicked(null); }
    else { setIdx(0); setPicked(null); }
  };

  return (
    <div style={{display:'flex', flexDirection:'column', height:'100%', position:'relative'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{padding:'4px 16px 8px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.ChevronLeft color={t.ink} size={18}/></button>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>Pressekonferenz</div>
            <SerifH theme={theme} style={{fontSize:16, fontWeight:700, color:t.ink}}>Vor Northbridge</SerifH>
          </div>
          <span style={{fontSize:10, fontWeight:700, color:t.inkMute, fontFamily:'JetBrains Mono', minWidth:36, textAlign:'right'}}>{idx+1}/{total}</span>
        </div>
        {/* Progress bar */}
        <div style={{display:'flex', gap:5, marginTop:8}}>
          {QUESTIONS.map((_,i)=>(
            <span key={i} style={{flex:1, height:4, borderRadius:99, background: i<=idx ? t.accent : t.rule}}/>
          ))}
        </div>
      </header>

      <div style={{flex:1, overflowY:'auto', padding:'12px 16px 16px'}}>
        {/* Question card */}
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'14px 16px', marginBottom:14}}>
          <div style={{display:'flex', gap:10, alignItems:'flex-start'}}>
            <Portrait name={q.who} theme={theme} scheme={scheme} size={36}/>
            <div style={{flex:1}}>
              <div style={{display:'flex', alignItems:'baseline', gap:6}}>
                <span style={{fontSize:11, fontWeight:800, color:t.ink}}>{q.who}</span>
                <span style={{fontSize:10, color:t.inkSoft, fontWeight:600}}>{q.whoTag}</span>
              </div>
              <SerifH theme={theme} style={{display:'block', fontSize:17, fontWeight:700, color:t.ink, lineHeight:1.25, marginTop:5}}>„{q.q}"</SerifH>
            </div>
          </div>
        </div>

        {/* Answer choices */}
        {!picked && (
          <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', marginBottom:6}}>Ihre Antwort</div>
        )}
        {picked === null && q.answers.map((a,i)=>(
          <button key={i} onClick={()=>setPicked(i)} style={{
            display:'block', width:'100%', textAlign:'left', cursor:'pointer',
            background:t.card, border:`1px solid ${t.rule}`, borderRadius:14,
            padding:'12px 14px', marginBottom:8, fontFamily:'inherit'
          }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6}}>
              <span style={{fontSize:9.5, fontWeight:800, color:t.accent, letterSpacing:.8, textTransform:'uppercase'}}>{a.tone}</span>
              <span style={{fontSize:10, color:t.inkSoft}}>vorhergesagte Wirkung</span>
            </div>
            <SerifH theme={theme} style={{display:'block', fontSize:14, fontWeight:700, color:t.ink, lineHeight:1.3}}>„{a.l}"</SerifH>
            <div style={{display:'flex', gap:5, marginTop:8, flexWrap:'wrap'}}>
              {a.predict.map((p,j)=>(
                <OutcomeChip key={j} theme={theme} scheme={scheme} who={p.w} d={p.d}/>
              ))}
            </div>
          </button>
        ))}

        {/* Chosen answer + feedback */}
        {picked !== null && (
          <>
            <div style={{background:t.accentSoft, border:`1px solid ${t.accent}`, borderRadius:14, padding:'12px 14px', marginBottom:14}}>
              <div style={{fontSize:9.5, fontWeight:800, color:t.accent, letterSpacing:.8, textTransform:'uppercase', marginBottom:4}}>Sie haben gesagt · {q.answers[picked].tone}</div>
              <SerifH theme={theme} style={{display:'block', fontSize:16, fontWeight:700, color:t.ink, lineHeight:1.3}}>„{q.answers[picked].l}"</SerifH>
            </div>
            <div style={{fontSize:11, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', marginBottom:6}}>Reaktion im Raum</div>
            <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:14, padding:'14px 16px', marginBottom:14}}>
              <div style={{display:'flex', flexDirection:'column', gap:8}}>
                {q.answers[picked].predict.map((p,i)=>(
                  <ReactionRow key={i} theme={theme} scheme={scheme} who={p.w} d={p.d}/>
                ))}
              </div>
              <div style={{fontSize:12, color:t.inkMute, marginTop:10, padding:'8px 10px', background:t.bgInk, borderRadius:8, fontFamily:THEMES[theme].font, fontStyle:'italic'}}>
                {q.answers[picked].tone==='kantig'   && '„Eine ungewöhnlich offene Antwort." — Auerbach-Zeitung'}
                {q.answers[picked].tone==='höflich'  && '„Routiniert und ausweichend." — Sport-Echo'}
                {q.answers[picked].tone==='sarkasmus'&& '„Riskanter Auftritt." — Tageskurier'}
                {q.answers[picked].tone==='neutral'  && '„Souverän, aber wenig konkret." — Sport-Echo'}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom action */}
      {picked !== null && (
        <div style={{padding:'10px 16px 20px', borderTop:`1px solid ${t.rule}`, background:t.bg}}>
          <button onClick={next} style={{
            width:'100%', height:50, borderRadius:14, background:t.ink, color:t.bg,
            border:'none', fontWeight:800, fontSize:14, fontFamily:'inherit',
            display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8
          }}>
            {idx < total-1 ? 'Nächste Frage' : 'Konferenz beenden'}
            <I.ArrowRight size={18} color={t.bg}/>
          </button>
        </div>
      )}
    </div>
  );
}
function OutcomeChip({theme, scheme, who, d}){
  const t = THEMES[theme][scheme];
  const c = d>0 ? t.ok : d<0 ? t.danger : t.inkMute;
  const sign = d>0 ? '▲' : d<0 ? '▼' : '=';
  const abs = Math.abs(d);
  return (
    <span style={{display:'inline-flex', alignItems:'center', gap:4,
      padding:'3px 8px', borderRadius:99, background: c+'18', color:c,
      fontSize:10.5, fontWeight:800, fontFamily:'Inter'}}>
      {who} <span style={{letterSpacing:1}}>{sign.repeat(Math.max(1,abs))}</span>
    </span>
  );
}
function ReactionRow({theme, scheme, who, d}){
  const t = THEMES[theme][scheme];
  const c = d>0 ? t.ok : d<0 ? t.danger : t.inkMute;
  const label = d>0 ? `+ ${d}` : d<0 ? `${d}` : '±0';
  const verb = d>0 ? 'freut sich' : d<0 ? 'wirkt verstimmt' : 'bleibt neutral';
  return (
    <div style={{display:'flex', alignItems:'center', gap:10}}>
      <span style={{width:40, fontSize:11.5, fontWeight:700, color:t.ink}}>{who}</span>
      <div style={{flex:1, position:'relative', height:6, background:t.bgInk, borderRadius:99, overflow:'hidden'}}>
        <span style={{position:'absolute', left:'50%', top:0, bottom:0, width:1, background:t.inkSoft, opacity:.5}}/>
        <div style={{
          position:'absolute', top:0, bottom:0,
          left: d>=0 ? '50%' : `${50 + d*10}%`,
          width: `${Math.abs(d)*10}%`,
          background: c
        }}/>
      </div>
      <span style={{fontSize:10.5, color:c, fontFamily:'JetBrains Mono', fontWeight:800, width:40, textAlign:'right'}}>{label}</span>
      <span style={{fontSize:10, color:t.inkMute, fontStyle:'italic', fontFamily:THEMES[theme].font, width:88}}>{verb}</span>
    </div>
  );
}

// =================================================================
// 37 — HALBZEIT-SPRECHBLASEN
// Bottom-sheet style; replaces the slider-heavy halftime as a sibling.
// =================================================================
function ScreenHalftimeBubbles({theme='A', scheme='light'}){
  const t = THEMES[theme][scheme];
  const VOICES = [
    {
      name:'Marek Brody', pos:'OM', form:8.6,
      mood:'energie',
      line:'„Die Lücke zwischen ihren Sechsern wird größer. Lass mich tiefer fallen — ich finde den Pass."',
      reactions:[
        { l:'Mehr Mut', e:'+ Risiko · + 0,2 Form' },
        { l:'Bleib in der Zehn', e:'= sicher' },
        { l:'Du bist mein Kapitän heute', e:'+ Moral · + Mannschaft' },
      ]
    },
    {
      name:'Aleksy Wieser', pos:'ST', form:7.2,
      mood:'frust',
      line:'„Die Bälle kommen nicht. Ihr seid am Sechserdreieck zu langsam — die kriegen mich nie frei."',
      reactions:[
        { l:'Halt dich auf dem Platz', e:'= Geduld' },
        { l:'Wechsel in den Halbraum', e:'+ neue Rolle' },
        { l:'Du wechselst', e:'– Stürmer-Moral' },
      ]
    },
    {
      name:'Sven Holtmann', pos:'DM', form:6.4,
      mood:'erschöpft',
      line:'„Mein Hüftbeuger zwickt seit der 30. Ich bringe es nicht über 90."',
      reactions:[
        { l:'Beiß durch · bis 60', e:'+ Verletzungs­risiko' },
        { l:'Velten wärmt sich auf', e:'frischer Mann ab 46\'' },
        { l:'Sofortwechsel', e:'Velten kommt jetzt' },
      ]
    },
  ];

  return (
    <div style={{display:'flex', flexDirection:'column', height:'100%', position:'relative', background:t.bg}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      {/* Dim backdrop with mini score */}
      <div style={{padding:'18px 16px', opacity:.5}}>
        <SerifH theme={theme} style={{display:'block', fontSize:11, fontWeight:700, color:t.inkMute, letterSpacing:.6, textTransform:'uppercase'}}>Halbzeit · 45'</SerifH>
        <SerifH theme={theme} style={{display:'block', fontSize:28, fontWeight:800, color:t.ink, lineHeight:1.05}}>Northbridge 0 : 1 Hafenstadt</SerifH>
        <div style={{fontSize:12, color:t.inkMute, marginTop:4, fontFamily:THEMES[theme].font, fontStyle:'italic'}}>
          Wieser 34' · Ballbesitz 58% · Schüsse 4:9
        </div>
      </div>
      <div style={{position:'absolute', inset:0, background:`${t.ink}55`, backdropFilter:'blur(2px)'}}/>

      {/* Sheet */}
      <div style={{
        position:'absolute', left:0, right:0, bottom:0, top:96,
        background:t.card, borderTopLeftRadius:24, borderTopRightRadius:24,
        boxShadow:`0 -10px 30px -10px ${t.ink}40`,
        padding:'10px 16px 100px',
        display:'flex', flexDirection:'column',
        overflow:'hidden'
      }}>
        <div style={{width:42, height:4, borderRadius:99, background:t.rule, margin:'4px auto 8px'}}/>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
          <div>
            <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>Kabinenansprache</div>
            <SerifH theme={theme} style={{display:'block', fontSize:22, fontWeight:700, color:t.ink, lineHeight:1.05}}>Was hörst du?</SerifH>
          </div>
          <span style={{fontSize:11, color:t.accent, fontWeight:800, padding:'4px 8px', borderRadius:99, background:t.accentSoft}}>2:48 Pause</span>
        </div>
        <div style={{fontSize:12, color:t.inkMute, marginTop:4, fontFamily:THEMES[theme].font, fontStyle:'italic'}}>
          Drei Spieler melden sich zu Wort. Eine Reaktion pro Sprecher.
        </div>

        {/* Bubble list */}
        <div style={{flex:1, overflowY:'auto', marginTop:14, paddingRight:2}}>
          {VOICES.map((v,i)=>{
            const moodColor = v.mood==='energie' ? t.ok : v.mood==='frust' ? t.warn : t.danger;
            const moodGlyph = v.mood==='energie' ? '!' : v.mood==='frust' ? '?' : '~';
            return (
              <div key={i} style={{marginBottom:14}}>
                <div style={{display:'flex', alignItems:'flex-start', gap:8}}>
                  <div style={{position:'relative', flex:'0 0 38px'}}>
                    <Portrait name={v.name} theme={theme} scheme={scheme} size={38} variant="player"/>
                    <span style={{position:'absolute', bottom:-2, right:-2, width:18, height:18, borderRadius:99, background:moodColor, color:'#fff', display:'grid', placeItems:'center', fontSize:11, fontWeight:800, border:`2px solid ${t.card}`}}>{moodGlyph}</span>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:'flex', alignItems:'baseline', gap:6}}>
                      <span style={{fontSize:12, fontWeight:800, color:t.ink}}>{v.name}</span>
                      <PosPill pos={v.pos} theme={theme} scheme={scheme}/>
                      <span style={{fontFamily:'JetBrains Mono', fontSize:10.5, color:t.ok, fontWeight:700}}>{v.form.toString().replace('.', ',')}</span>
                    </div>
                    {/* Speech bubble */}
                    <div style={{
                      background:t.bgInk, borderRadius:'4px 14px 14px 14px',
                      padding:'9px 12px', marginTop:6, position:'relative'
                    }}>
                      <span style={{
                        position:'absolute', left:-7, top:0,
                        width:0, height:0,
                        borderTop:`8px solid ${t.bgInk}`,
                        borderLeft:'8px solid transparent'
                      }}/>
                      <span style={{fontFamily:THEMES[theme].font, fontSize:13.5, color:t.ink, lineHeight:1.35, fontStyle:'italic'}}>{v.line}</span>
                    </div>
                    {/* Reactions */}
                    <div style={{display:'flex', gap:5, marginTop:8, flexWrap:'wrap'}}>
                      {v.reactions.map((r,j)=>(
                        <button key={j} style={{
                          flex:'1 1 0', minWidth:0,
                          padding:'7px 8px',
                          background: j===0 ? t.card : t.bg,
                          border:`1px solid ${j===0 ? t.ink : t.rule}`,
                          borderRadius:9, fontFamily:'inherit', cursor:'pointer', textAlign:'left'
                        }}>
                          <div style={{fontSize:11.5, fontWeight:800, color:t.ink, lineHeight:1.15}}>{r.l}</div>
                          <div style={{fontSize:9.5, color:t.inkMute, marginTop:2}}>{r.e}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky bottom */}
      <div style={{position:'absolute', left:0, right:0, bottom:0, padding:'10px 16px 22px', display:'flex', gap:8, background:t.bg}}>
        <button style={{flex:1, height:50, borderRadius:14, background:t.card, border:`1px solid ${t.rule}`, color:t.ink, fontWeight:700, fontSize:13, fontFamily:'inherit'}}>Mehr Taktik</button>
        <button style={{flex:2, height:50, borderRadius:14, background:t.accent, color:'#fff', border:'none', fontWeight:800, fontSize:14, fontFamily:'inherit', boxShadow:`0 6px 14px -4px ${t.accent}80`}}>Anpfiff der 2. Hälfte</button>
      </div>
    </div>
  );
}

// =================================================================
// 38 — TRANSFER-VERHANDLUNG · Gegenangebot-Loop
// =================================================================
function ScreenTransferNeg({theme='A', scheme='light'}){
  const t = THEMES[theme][scheme];
  const target = {
    name:'Élise Vannier', age:19, pos:'OM', nat:'FR',
    club:'Olympique Sauveterre', str:6, tal:4,
  };
  // Conversation log so far
  const LOG = [
    { side:'them', who:'Sauveterre', when:'gestern · 16:42',
      offer:{ ablöse:3_200_000, bonus:0, klausel:null },
      msg:'„Élise gehört uns bis 2028. Ohne 3,2 Mio. plus Solidaritätsanteil reden wir nicht."',
      stress:0 },
    { side:'us',   who:'Hafenstadt', when:'heute · 09:14',
      offer:{ ablöse:1_800_000, bonus:200_000, klausel:null },
      msg:'„Wir bieten 1,8 plus Bonus bei 10 Einsätzen."',
      stress:25 },
    { side:'them', who:'Sauveterre', when:'heute · 10:02',
      offer:{ ablöse:2_900_000, bonus:300_000, klausel:null },
      msg:'„Bitte ernsthaft. 2,9 plus Bonus, sonst legen wir auf."',
      stress:25 },
    { side:'us',   who:'Hafenstadt', when:'heute · 10:48',
      offer:{ ablöse:2_300_000, bonus:300_000, klausel:6_000_000 },
      msg:'„2,3 plus Bonus, dafür 6 Mio. Weiterverkaufs­klausel."',
      stress:45 },
  ];
  // Current draft
  const [ablöse, setAblöse]   = React.useState(2_500_000);
  const [bonus,  setBonus]    = React.useState(400_000);
  const [klausel,setKlausel]  = React.useState(7_000_000);
  // current agent stress (would be derived from last offer in real impl)
  const stress = 45;
  const stressColor = stress>=70 ? t.danger : stress>=40 ? t.warn : t.ok;
  const stressLabel = stress>=70 ? 'fast Abbruch' : stress>=40 ? 'angespannt' : 'gelassen';

  return (
    <div style={{display:'flex', flexDirection:'column', height:'100%', position:'relative'}}>
      <ThemeCss theme={theme} scheme={scheme}/>
      <header style={{padding:'4px 16px 8px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.ChevronLeft color={t.ink} size={18}/></button>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:10, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>Verhandlung · Transfer</div>
            <SerifH theme={theme} style={{fontSize:16, fontWeight:700, color:t.ink}}>{target.name}</SerifH>
          </div>
          <button style={{width:36,height:36,borderRadius:10,background:t.card,border:`1px solid ${t.rule}`,display:'grid',placeItems:'center'}}><I.More color={t.ink} size={16}/></button>
        </div>
      </header>

      {/* Target identity strip */}
      <div style={{padding:'0 16px 8px'}}>
        <div style={{background:t.card, border:`1px solid ${t.rule}`, borderRadius:12, padding:'10px 14px', display:'flex', alignItems:'center', gap:10}}>
          <Portrait name={target.name} theme={theme} scheme={scheme} size={42} variant="player"/>
          <div style={{flex:1}}>
            <div style={{display:'flex', alignItems:'center', gap:5}}>
              <PosPill pos={target.pos} theme={theme} scheme={scheme}/>
              <span style={{fontSize:13, fontWeight:700, color:t.ink}}>{target.name}</span>
              <span style={{fontSize:10, color:t.inkSoft, fontFamily:'JetBrains Mono'}}>{target.nat}</span>
            </div>
            <div style={{fontSize:11, color:t.inkMute, marginTop:2}}>{target.age} J. · {target.club}</div>
          </div>
          <div>
            <StrBar n={target.str} theme={theme} scheme={scheme} w={42}/>
            <div style={{marginTop:3, display:'flex', justifyContent:'flex-end'}}><Talent n={target.tal} theme={theme} scheme={scheme}/></div>
          </div>
        </div>
      </div>

      {/* Agent stress bar */}
      <div style={{padding:'4px 16px 8px'}}>
        <div style={{background:t.bgInk, border:`1px solid ${t.rule}`, borderRadius:10, padding:'8px 12px'}}>
          <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between'}}>
            <span style={{fontSize:10.5, color:t.inkMute, fontWeight:700, letterSpacing:.4, textTransform:'uppercase'}}>Berater-Stress · {stressLabel}</span>
            <span style={{fontFamily:'JetBrains Mono', fontSize:12, color:stressColor, fontWeight:800}}>{stress} %</span>
          </div>
          <div style={{height:5, background:t.bg, borderRadius:99, marginTop:6, overflow:'hidden'}}>
            <div style={{width:stress+'%', height:'100%', background:stressColor}}/>
          </div>
          <div style={{fontSize:10.5, color:t.inkSoft, marginTop:5, fontFamily:THEMES[theme].font, fontStyle:'italic'}}>
            Noch ein Lowball, und sie legen auf.
          </div>
        </div>
      </div>

      {/* Conversation log */}
      <div style={{flex:1, overflowY:'auto', padding:'4px 16px', display:'flex', flexDirection:'column'}}>
        <div style={{fontSize:10.5, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase', margin:'4px 4px 8px'}}>Verlauf · 4 Schritte</div>
        {LOG.map((m,i)=>{
          const us = m.side === 'us';
          return (
            <div key={i} style={{
              alignSelf: us ? 'flex-end' : 'flex-start',
              maxWidth:'88%',
              marginBottom:8, display:'flex', flexDirection:'column', alignItems: us?'flex-end':'flex-start'
            }}>
              <div style={{fontSize:9.5, color:t.inkSoft, marginBottom:2, fontFamily:'JetBrains Mono'}}>
                {m.who} · {m.when}
              </div>
              <div style={{
                background: us ? t.ink : t.card,
                color: us ? t.bg : t.ink,
                border: us ? 'none' : `1px solid ${t.rule}`,
                borderRadius: us ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                padding:'10px 12px', fontFamily:THEMES[theme].font, fontStyle:'italic',
                fontSize:13, lineHeight:1.35
              }}>
                {m.msg}
                {/* Offer breakdown */}
                <div style={{display:'flex', gap:6, marginTop:8, flexWrap:'wrap'}}>
                  <OfferChip theme={theme} scheme={scheme} dark={us} k="Ablöse"  v={eurK(m.offer.ablöse)}/>
                  {m.offer.bonus > 0 && <OfferChip theme={theme} scheme={scheme} dark={us} k="Bonus" v={eurK(m.offer.bonus)}/>}
                  {m.offer.klausel && <OfferChip theme={theme} scheme={scheme} dark={us} k="Klausel" v={eurK(m.offer.klausel)}/>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compose */}
      <div style={{padding:'10px 16px 18px', background:t.card, borderTop:`1px solid ${t.rule}`}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6}}>
          <span style={{fontSize:10.5, color:t.inkMute, fontWeight:700, letterSpacing:.6, textTransform:'uppercase'}}>Ihr Gegenangebot</span>
          <span style={{fontSize:10.5, color:t.inkSoft, fontFamily:'JetBrains Mono'}}>Summe · {eurK(ablöse+bonus)}</span>
        </div>
        <Lever theme={theme} scheme={scheme} label="Ablöse"   value={ablöse}  min={1_000_000} max={4_000_000} step={100_000} onChange={setAblöse}/>
        <Lever theme={theme} scheme={scheme} label="Bonus"    value={bonus}   min={0} max={800_000}            step={50_000}  onChange={setBonus}/>
        <Lever theme={theme} scheme={scheme} label="Weiterverkauf-Klausel" value={klausel} min={0} max={12_000_000} step={500_000} onChange={setKlausel} last/>
        <div style={{display:'flex', gap:8, marginTop:10}}>
          <button style={{flex:1, height:46, borderRadius:12, background:t.bg, border:`1px solid ${t.rule}`, color:t.danger, fontWeight:700, fontSize:12.5, fontFamily:'inherit'}}>Aufgeben</button>
          <button style={{flex:2, height:46, borderRadius:12, background:t.ink, color:t.bg, border:'none', fontWeight:800, fontSize:13.5, fontFamily:'inherit'}}>Senden &nbsp;·&nbsp; {eurK(ablöse+bonus)}</button>
        </div>
      </div>
    </div>
  );
}
function OfferChip({theme, scheme, k, v, dark}){
  const t = THEMES[theme][scheme];
  return (
    <span style={{display:'inline-flex', alignItems:'baseline', gap:4,
      padding:'3px 8px', borderRadius:99,
      background: dark ? 'rgba(255,255,255,.10)' : t.bgInk,
      color: dark ? '#fff' : t.ink,
      fontFamily:'JetBrains Mono', fontSize:10.5, fontWeight:800, fontStyle:'normal'}}>
      <span style={{opacity:.7, fontWeight:600}}>{k}</span> {v}
    </span>
  );
}
function Lever({theme, scheme, label, value, min, max, step, onChange, last}){
  const t = THEMES[theme][scheme];
  const pct = ((value-min)/(max-min))*100;
  return (
    <div style={{padding:'7px 0', borderBottom: last?'none':`1px solid ${t.rule}`}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
        <span style={{fontSize:12, fontWeight:700, color:t.ink}}>{label}</span>
        <span style={{fontSize:12, color:t.accent, fontFamily:'JetBrains Mono', fontWeight:800}}>{eurK(value)}</span>
      </div>
      <div style={{position:'relative', height:24, marginTop:4}}>
        <div style={{position:'absolute', top:10, left:0, right:0, height:4, background:t.bgInk, borderRadius:99}}/>
        <div style={{position:'absolute', top:10, left:0, width:pct+'%', height:4, background:t.accent, borderRadius:99}}/>
        <div style={{position:'absolute', top:3, left:`calc(${pct}% - 9px)`, width:18, height:18, borderRadius:99, background:t.card, border:`2px solid ${t.accent}`}}/>
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e=>onChange(+e.target.value)}
          style={{position:'absolute', inset:0, opacity:0, cursor:'pointer'}}/>
      </div>
    </div>
  );
}

Object.assign(window, {
  ScreenTabloidCover, ScreenPressConference, ScreenHalftimeBubbles, ScreenTransferNeg,
  OutcomeChip, ReactionRow, OfferChip, Lever,
});
