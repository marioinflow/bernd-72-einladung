# Verification — 23. September 2026 (Redesign)

Stand nach dem Neuaufbau (Layout, Buttons, Scroll-Motion, Intro, Sayuko-Blüte). Vorheriger Stand: `../bernd-72-before-redesign-20260923-015237.tar.gz`.

## Geprüft
- `npm run check` grün (Syntax Build/Server/Client, Build erzeugt `dist/`).
- Browser-Konsole: 0 Fehler auf frischer Seite, nach Intro und nach Scroll durch alle Sektionen.
- Kein horizontaler Überlauf: 1440×900, 375×812, 320×700 (`scrollWidth === innerWidth`, Gate und Seite).
- Code-Sperre: falscher Code zeigt Inline-Fehler, `Bernd72!` startet Intro. Login-Banner unverändert.
- Intro (Desktop 1440 + Mobil 375): Fotos schweben ein → formen „72“ → Porträt blendet auf → „Bernd wird 72“ als echte Schrift, Buchstabe für Buchstabe. „Überspringen“ und Escape beenden sofort.
- Scroll-Effekte sichtbar geprüft: Hero-Reveal, Banner wächst auf volle Breite, Wort-Aufhellen (Desktop gepinnt, Mobil ohne Pin), Clip-Reveals, Sticky-Stack der Galerie, Leit-Linie mit Punkten, Zahlen aus Maske.
- Galerie-Lightbox: öffnet per Klick mit Zähler, schließt per Button; Fokus kehrt zurück.
- Eventfilm: vor Klick `paused`, `preload="none"`, `autoplay: false`, keine MP4-Anfrage.
- Sayuko-Blüte: läuft nur sichtbar im Viewport, Maus (Desktop) bzw. Scroll (Touch) steuert Dichte/Weite, Klick = Impuls.
- RSVP bleibt deaktiviert (`rsvp.confirmed: false`, `phone: null`).

## Nachtrag 23.09.2026: Foto „Zusammen“
Backup: `../bernd-72-before-zusammen-foto-20260923.tar.gz`. Familienfoto nur noch im Hero (und als Intro-Kachel); „Zusammen“ zeigt `galerie-feier-aussen` (Ausschnitt `object-position: 28% 50%`, Bernd + Frau im Bild), aus der Galerie entfernt (jetzt 6 Bilder).
- `npm run check` grün · kein Überlauf 1440/375/320 · Konsole 0 Fehler · Bild lädt, kommt nur einmal vor.
- Offen: Sichtung durch Mario.

## Nachtrag 23.09.2026: Zeilenumbrüche (Phone)
Backup: `../bernd-72-before-zeilenumbruch-20260923.tar.gz`. `p,figcaption{text-wrap:balance}` (vorher `pretty`), geschützte Leerzeichen in `content.json` (adoptionQuote, galleryLabel, venueText, closing), Sushi-Bildunterschrift einzeilig (`.step-photos figcaption`).
- Gemessen per Skript (Wörter je Zeile): 375 px keine Einzelwort-Zeile außer „Momente, / die bleiben.“ (bewusst, auf allen Breiten gleich). 320 px zusätzlich „Schön, / wenn ihr / dabei seid!“ und „Pinball / Wizard“.
- `npm run check` grün · kein Überlauf 1440/375/320 · Konsole 0 Fehler.
- Nicht geprüft: iOS Safari (balance ab iOS 17.4).

## Deploy 23.09.2026 (Commit 370da66)
Live: https://bernd-72-einladung.vercel.app (Vercel `dpl_DXYSfaNSkjVhX1xNoEXwbJMR51vv`, von Mario per CLI ausgelöst). Ersetzt den alten Stand vor dem Redesign.
- `index.html`, `styles.css`, `app.js`, `logo-bloom.js` live identisch mit lokalem Build.
- Live bei 375 px: falscher Code zeigt Fehler, `Bernd72!` startet Intro, Überspringen geht, kein Überlauf, keine kaputten Bilder, Konsole 0 Fehler, Video pausiert/kein Autoplay, Maps-Link korrekt, RSVP deaktiviert, `X-Robots-Tag: noindex`.
- Bekannt: ungenutzte Assets (u. a. `sayuko-rundgang.mp4`) liegen mit auf dem Server.

## Nachtrag 23.09.2026: Hero-Schrift
Backup: `../bernd-72-before-hero-text-20260923.tar.gz`, alte Schrift in `../_archive/bernd-72-font-before-lnum/`.
- Gold-Rahmen um „Bernd 72“ war der Fokus-Rahmen nach dem Intro → `.hero-title:focus{outline:none}`.
- Titel liegt jetzt vor dem Familienfoto (`z-index:3`).
- „72“ hing tiefer (Mediävalziffern) → Schrift-Subset neu mit `lnum`, `font-variant-numeric:lining-nums` am Titel. Unterkanten Bernd/72 gleich (1440, 375).
- Mobil (≤700): eine zentrierte Zeile „Ein besonderer Geburtstag“ statt zwei Seiten-Kicker, doppelte Größenregel (`.19!important`) entfernt; „Bernd“ nicht mehr am Rand.
- `npm run check` grün · kein Überlauf 1440/375/320 · Konsole 0 Fehler. Noch nicht deployt.

## Nachtrag 23.09.2026: Hero-Variante „Pepperls … laden ein“
Backup (Bernd|72-Stand): `../bernd-72-before-hero-pepperls-20260923.tar.gz`.
- Hintergrund: Gemini-Lounge (nur Bokeh, ohne Personen/Schrift) → `assets/hero-lounge-{1264,700}.webp`.
- „PEPPERLS“ als echte Schrift (Bodoni Moda, OFL, lokal `assets/fonts/bodoni-moda-caps.woff2`, nur A–Z) hinter dem freigestellten Familienfoto; „… laden ein“ in Cormorant Italic (Desktop neben dem Wort, Mobil darunter rechtsbündig). Gesichter unverändert (bestehende Freistellung).
- Bernd|72-Titel-CSS entfernt, GSAP-Hero auf `.hero-word`/`.hero-invite` umgestellt.
- `npm run check` grün · kein Überlauf 1440/375/320 · Konsole 0 Fehler/Warnungen · Wort vollständig lesbar, kein Gesicht verdeckt. Noch nicht deployt.

## Nachtrag 23.09.2026: Pepperl-Banner entfernt
Backup: `../bernd-72-before-banner-weg-20260923.tar.gz`. Banner wiederholte „Die Pepperls laden ein“ direkt unter dem Hero → Markup, GSAP-Tweens, CSS und `media.hero` entfernt, `hero-pepperl.jpg` nach `../_archive/bernd-72-unused-assets/`. Nach dem Hero folgt „Zusammen“. Check grün, 375 px ohne Überlauf, Konsole 0 Fehler/Warnungen.

## Nachtrag 23.09.2026: Intro entfernt
Backup: `../bernd-72-before-intro-weg-20260923.tar.gz`. Nach dem Code geht es direkt in den Pepperls-Hero (`openInvitation` in `app.js`). Intro-Markup, -Timeline und -CSS entfernt; nur dort genutzte Bilder (`bernd-wasserturm-*`, `familie-600/1000`) nach `../_archive/bernd-72-unused-assets/`. Linkvorschau (`einladung-bernd-72-wasserturm.jpg`) bleibt.
- Check grün · Code → Hero sofort, Fokus auf Überschrift · 375 px ohne Überlauf · Konsole 0 Fehler/Warnungen.

## Nachtrag 23.09.2026: Sayuko-Logo-Reveal als Scroll-Hintergrund
Backup: `../bernd-72-before-sayuko-reveal-20260923.tar.gz`. Quelle: KI-Video (8 s), Original in `../Sayuko/Originalmaterial/Bernd-Geburtstag/sayuko-logo-reveal-original.mov`. „Ai“-Kennzeichen oben weggeschnitten, 61 Einzelbilder `assets/sayuko-reveal/f000–f060.webp` (500 KB, ohne Ton).
- Sticky-Canvas hinter „01 Der Ort“ bis „03 Live“ (`.evening-film`), Fortschritt = Scroll von Abschnittsbeginn bis Band (`eveningFilm()` in `app.js`), Bilder laden erst 600 px vor dem Abschnitt. Deckkraft 30 %, Ränder radial ausgeblendet.
- Reduzierte Bewegung / ohne GSAP: kein Hintergrund (bewusst statisch).
- Check grün · 375 + 1440 ohne Überlauf · Konsole 0 Fehler/Warnungen · Text bleibt lesbar.
- Offen: Logo-Treue gegen `mark.png` prüfen; Claim „Come in. Feel at home.“ steht im letzten Bild (schwach sichtbar), Bestätigung fehlt.

## Nicht geprüft
- Familien-Hero wiederhergestellt: „PEPPERLS … laden ein“ und das Dreierfoto bleiben der Einstieg. Der Anlass liegt danach in einem eigenen Banner mit „72 Jahre Bernd“ und vorhandenem Porträt `assets/bernd-480.webp`. Backup: `../bernd-72-before-hero-restore-and-reveal-cleanup-20260923.tar.gz`. `npm run check` grün; visuelle Abnahme in der lokalen Vorschau steht aus.
- 72-Intro wiederhergestellt und geglättet: 24 vorhandene Familien- und Galeriebilder formen nach dem Code für rund drei Sekunden eine 72 und gehen dann direkt in den Familien-Hero über. Der Intro-Blur ist entfernt; Hero-Bilder werden vorgeladen und die Hero-Animation ist verkürzt. Die Hauptseite startet 0,24 Sekunden vor dem Ende des Intros, damit die Übergabe nicht stockt. Backup: `../bernd-72-before-intro-handoff-20260923.tar.gz`. `npm run check` grün; visuelle Prüfung in der lokalen Vorschau steht aus.
- Letzter Sayuko-Reveal-Frame nach dem Band: Endframe liegt weiter unten im Haltebereich und zeigt ohne Rand-Vignette. `npm run check` grün; visuelle Prüfung im Browser noch offen.
- Echte Touch-Gesten (Wischen/Runterziehen in der Lightbox) auf einem echten Handy.
- `prefers-reduced-motion` im Browser emuliert: Code-Pfad vorhanden (kein Intro, kein Lenis, keine GSAP-Effekte, Blüte statisch), aber nicht live gesehen.
- Safari/iOS, Querformat, Tablet 768.

## Nachtrag 23.09.2026: Copy-Überarbeitung (Sprache, Ton) + Deploy
Backup: `../bernd-72-before-copy-ueberarbeitung-20260923.tar.gz`. Texte nach Marios Briefing: Hero-Satz, Gemeinsam feiern (Headline, Lead, Signoff), Vater & Sohn (Kicker, Zitat, Restaurant), Galerie (Kicker, Text), Sayuko (Headline, Ort-Text ohne Leistungskatalog), Film-Text, Band-Kicker, Zusage (Kicker, Headline ohne „!“). Blüten-Hinweis entfernt (Markup + CSS), Interaktion bleibt.
- Geschützte Leerzeichen: „Manche Abende“, „schöner, wenn“, „packen lässt.“
- 375 px: keine Einzelwort-Zeile. 320 px: „miteinander“/„teilt.“ und „gehört“ allein, nicht lösbar ohne kleinere Schrift (gemessen: „miteinander teilt.“ 281 px bei 266 px Platz, „gehört ins Sayuko.“ 348/305 px).
- Check grün · kein Überlauf 1440/375/320 · Konsole 0 Fehler/Warnungen.
- Deploy `dpl_Adz52G8XrUH2Nj75VnXdJLxk4Utc` (per CLI mit Marios Go), live `index.html`/CSS/JS identisch mit lokal, live 375 px: Code → Hero, neue Texte, kein Überlauf, Konsole 0, `X-Robots-Tag: noindex`.

## Nachtrag 23.09.2026: Goldener Rahmen-Lichtstreifen am Geburtstags-Banner (lokal)
Backup: `../bernd-72-before-banner-border-beam-20260923.tar.gz`. Schräger Lichtschein (`birthday-light-sweep`) ersetzt durch Lichtstreifen, der dauerhaft um die Karte läuft (7 s Loop, `conic-gradient` + `@property --beam`, Ring per Maske; `::after` 2 px Linie, `::before` weicher Schein 12 px außen). Beschnitt der Bild-Atmung von der Karte aufs `figure` verlegt, damit der Schein außen sichtbar ist. Mobil 16 px Seitenrand, damit der Rahmen rundum sichtbar ist. Reduzierte Bewegung: Streifen steht.
- Check grün · 1440/375/320 ohne Überlauf · Konsole 0 · Screenshots `../_scratch-bernd/banner-beam-*.png`. Nicht deployt.

## Nachtrag 23.09.2026: Sayuko-Bühne, „3“, Tafel-Bild (lokal)
Backups: `../bernd-72-before-bloom-heading-3-20260923.tar.gz`, `../bernd-72-before-tafel-bild-20260923.tar.gz`.
- „3“ bei Vater & Sohn war Mediävalziffer (unten/links angeschnitten) → `lining-nums` + `padding-left:.04em`.
- „Dieser Abend gehört ins Sayuko.“ lief einzeilig über die volle Breite und über der Blüte → `max-width:7.5em`, `balance`, Schrift `clamp(52px,6.4vw,100px)`; Blüten-Canvas `inset:22% 0 0` (Kern unter der Headline), Bühne `min(90svh,820px)`, min. 600 px. 320 px: „gehört“ weiter allein (Wortbreite).
- „Gemeinsam feiern“: Bild jetzt `assets/feier-tafel-{1080,640}.webp` aus `../Sayuko/Projekt/public/fotos/feier-tafel.jpg`, 4:5 zugeschnitten (Person am rechten Rand entfernt). `galerie-feier-aussen-*` nach `../_archive/bernd-72-unused-assets/`.
- Check grün · 1440/1070/375/320 ohne Überlauf · Konsole 0. Nicht deployt.
- Nachtrag: Tafel-Bild auf Marios Wunsch ersetzt durch Gästerunde (`assets/gaeste-abend-{1040,640}.webp` aus Neuzugang `WhatsApp Image 2026-09-22 at 20.31.13 (1).jpeg`, 4:5, weichgezeichnet, +18 % Helligkeit). Tafel-Bild nach `../_archive/bernd-72-unused-assets/`. Backup `../bernd-72-before-gaeste-bild-20260923.tar.gz`. 375 px ohne Überlauf, Konsole 0.
- Nachtrag: Gäste-Bild kleiner (`min(400px,86%)`, zentriert) mit Passepartout (10 px, dünne Goldlinie `#cfb27a80`, weicher Goldhalo) und warm-dunklem Verlauf darüber; Bildunterschrift nach innen versetzt. Backup `../bernd-72-before-gaeste-rahmen-20260923.tar.gz`. 1440/375 ohne Überlauf, Konsole 0.

## Nachtrag 23.09.2026: „Gemeinsam feiern“ neu angeordnet (lokal)
Backup: `../bernd-72-before-gemeinsam-redesign-20260923.tar.gz`. Desktop: Foto (Passepartout, Goldlinie) links über volle Höhe, rechts Kicker + Headline (3 Zeilen, `clamp(36px,3.6vw,54px)`), Lead als 3 Zeilen mit Goldlinien und 01/02/03 (aus `copy.together` nach Sätzen gesplittet, Text unverändert), Schlusssatz Gold-Kursiv, Signatur klein mit Goldstrich. Mobil (≤1000): Headline → Foto → Liste. Wort-Aufhellen bleibt (jeder Block eigenes `data-brighten`), Mobil-Trigger jetzt `.together-grid`.
- Check grün · 1440 (gepinnt, passt ins Fenster, 643 px) / 375 / 320 ohne Überlauf · keine Einzelwort-Zeilen 375/320 · Konsole 0. Nicht deployt.

## Nachtrag 23.09.2026: Glitzer über der ganzen Seite (lokal)
Backup: `../bernd-72-before-glitzer-20260923.tar.gz`. `glitter()` in `app.js`: fixe Canvas `.glitter` (z-index 6, `mix-blend-mode:screen`, `pointer-events:none`), Gold-/Blau-Funken steigen langsam, funkeln per Sinus, 12 % mit Sternkreuz. Dichte nach Fläche (max. 120, 375 px ≈ 28). Pausiert im Hintergrund-Tab (eine rAF-ID), aus bei reduzierter Bewegung.
- Check grün · 1440/375 ohne Überlauf · 1 Canvas · Klicks gehen durch · ~120 fps · Konsole 0. Nicht deployt.

## Nachtrag 23.09.2026: „3 Anniversary“-Abzeichen bei Vater & Sohn (lokal)
Backup: `../bernd-72-before-anniversary-badge-20260923.tar.gz`. Große „3 / Jahre Vater & Sohn“ ersetzt durch Inline-SVG nach Vorbild Login-Banner (Goldring, „3“ in Cormorant, Band „ANNIVERSARY“), Goldstrich, „Vater & Sohn Pepperl“ (Gold, `Sohn&nbsp;Pepperl`). Alte `.adoption-number`-Regeln entfernt. Bleibt `aria-hidden` (Headline trägt die Aussage).
- Check grün · 1440/375/320 ohne Überlauf, Name 2 Zeilen mobil · Konsole 0. Nicht deployt.

## Nachtrag 23.09.2026: Film bekommt Aufmerksamkeit (lokal)
Backup: `../bernd-72-before-film-teaser-20260923.tar.gz`. Auf Marios Wahl „Stopp + Zoom + stummer Teaser“:
- `assets/sayuko-events-teaser.mp4` (Sek. 33–39 des Eventfilms, 6 s, ohne Ton, 360×636, 230 KB) als `.film-teaser` über dem Poster; lädt/läuft erst bei 50 % Sichtbarkeit, pausiert außerhalb. Tippen = Teaser weg, ganzer Film wie bisher (stumm mit Steuerung). Kein Autoplay mit Ton; `sayuko-events.mp4` wird ohne Tippen nicht geladen (geprüft über Resource-Timing).
- Film-Schritt pinnt 520 px (`start: center center`), Film skaliert .86 → 1.06. Pin in Seitenreihenfolge angelegt (vor Leit-Linie/Band), sonst falsche Offsets. Abstände um `.pin-spacer` per CSS ergänzt. Play-Ring pulsiert (aus bei reduzierter Bewegung).
- Check grün · 1440/375 Film beim Pin mittig, kein Überlappen, kein Überlauf · Konsole 0. Nicht deployt.

## Nachtrag 23.09.2026: WhatsApp-Zusage aktiv + Hero-Unterteil (lokal)
Backup: `../bernd-72-before-whatsapp-zusage-20260923.tar.gz`. Nummer von Mario am 23.09. freigegeben: `rsvp.phone "+491748207000"`, `confirmed: true`; `rsvp.message` entfällt.
- Zusage-Formular: „Ich komme allein“ / „Wir kommen zu zweit“, Name(n), Button mit WhatsApp-Symbol. `setupRsvp()` baut `https://wa.me/491748207000?text=…` im Browser, öffnet es per Link-Klick; nichts wird gespeichert oder gesendet.
- Getestet OHNE Öffnen (Link-Klick abgefangen, Seite blieb auf localhost): leer → Fehler + Fokus Name 1; 1 Person → „…mit mir rechnen. Liebe Grüße, Anna Muster“ (Leerzeichen bereinigt); 2 Personen ohne Name 2 → Fehler + Fokus Name 2; 2 Personen → „…mit uns rechnen. Liebe Grüße, Anna Muster und Tom“. Zurück auf 1 blendet Feld 2 aus.
- Hero unten: großer Zusagen-Button + Datums-Pille + Scroll-Maus ersetzt durch Datumszeile (Datum · Uhrzeit, Ort) und „Den Abend entdecken ↓“. Zusage oben nur noch über „Zusagen“ im Header.
- Check grün · 1440/375/320 ohne Überlauf, Datumszeile und Auswahl einzeilig · Konsole 0. Nicht deployt.
- Hinweis: Mit dem Deploy steht die Nummer im Seitenquelltext (bei wa.me-Links unvermeidbar).

## Nachtrag 23.09.2026: Goldene Lichtspur zwischen den Abschnitten (lokal)
Backup: `../bernd-72-before-journey-line-20260923.tar.gz`. 7 Verbinder `.journey` vor Banner … Zusage (Template), mittig, halb in die Innenabstände beider Abschnitte gezogen. Linie + leuchtender Punkt wachsen mit dem Scrollen (`--p` 0→1, `scrub`), am Ende von `startPage()` angelegt (nach allen Pins). Ohne Animation stehen sie fertig. Länge `clamp(84px,14vw,220px)`, um das Banner kürzer (`.journey-short`). „Den Abend entdecken“ größer, gold, mit Pfeil-Kreis als Start. Banner mobil 48 px Innenabstand.
- Automatischer Kollisionstest (jede Spur gegen Text/Bild/Knopf/SVG): 1440/1070/375/320 keine Berührung, kein Überlauf · Konsole 0 · Check grün. Nicht deployt.

## 23.09. Hero-Tiefe mobil + weicher Intro-Übergang
- Backup `../bernd-72-before-hero-tiefe-uebergang-20260923.tar.gz`.
- Mobil: `.hero-family` margin-top −.12w (≤360: −.09w), Köpfe überlappen die untere Hälfte von „PEPPERLS“. (`drop-shadow` auf der Familie wieder entfernt: dunkler Balken über „PPER“, Marios Screenshot 08:17.)
- Intro: `startPage()` läuft jetzt vor dem Kachel-Intro (vorher mitten in der Überblendung bei 2,26 s → Ruckler). Hero-Einstieg als pausierte Timeline `heroEntrance`, startet bei 2,3 s; Intro blendet 1 s `sine.inOut` statt 0,3 s aus. Skip/Reduced Motion über `openInvitation()` → `heroEntrance.play()`.
- Geprüft: 390/320/1440 kein Überlauf, Konsole 0, Framezeiten im Intro ohne Einbruch (>40 ms: keine), `npm run check` grün.

## 23.09. Diashow statt Film + Fabian-Foto
- Backup `../bernd-72-before-diashow-fabian-20260923.tar.gz`. Film, Teaser, Poster, Ambiente-Foto nach `../_archive/bernd-72-unused-assets/`.
- „02 · Einblicke“: 6er-Diashow (Überblendung 1,8 s, Wechsel alle 4,2 s, Ken-Burns 7 s), Pin + Zoom beim Scrollen bleibt (`.film`). Pause-Knopf mit `aria-pressed`, stoppt außerhalb des Sichtbereichs und bei verstecktem Tab; reduzierte Bewegung = kein Autoplay.
- „01 · Der Ort“: Fabian beim Sushi statt Ambiente-Foto, Bildunterschriften dürfen umbrechen.
- Geprüft: Wechsel 0→1 nach 4,8 s, Pause hält; 320/390/1070/1440 kein Überlauf, Bildunterschriften ungeschnitten, Konsole 0, `npm run check` grün.

## 23.09. Zwei Gründe zu feiern
- Backup `../bernd-72-before-zwei-gruende-20260923.tar.gz`.
- Hero-Text (Marios Vorgabe, „dich“ → „euch“): „Wir haben gleich zweimal Grund zu feiern. Hiermit möchten wir euch schon einmal auf den Abend einstimmen.“ „Den Abend entdecken“ springt zu `#grund-1`.
- Banner mit Eyebrow „Der erste Grund zu feiern“; `adoptionLabel` → „Der zweite Grund zu feiern“. Reihenfolge jetzt Hero → Banner (72) → Vater & Sohn → Gemeinsam feiern → Galerie … Hintergründe getauscht (Adoption Verlauf ink→night, Gemeinsam night), keine Kante.
- Geprüft: 320/390/1070/1440 kein Überlauf, Sektionen lückenlos, Konsole 0, `npm run check` grün, Hero-Text mobil 4 bis 5 Zeilen ohne Einzelwort.

## 23.09. Diashow per Scroll
- Backup `../bernd-72-before-dia-scroll-20260923.tar.gz`.
- „02 · Einblicke“ hält jetzt an, bis alle 6 Bilder durchgescrollt sind: Pin-Länge 6 × min(55 svh, 480 px), `onUpdate` wählt das Bild, Zoom .86→1.06 bleibt. Timer + Pause-Knopf nur noch ohne GSAP/bei reduzierter Bewegung.
- Geprüft 390/1440: Bild 0→5 der Reihe nach, Film bleibt stehen, danach Abstand zur Band 77/136 px, kein Überlauf, Konsole 0, `npm run check` grün.

## 23.09. Neues Bild „Gemeinsam feiern“
- Backup `../bernd-72-before-gemeinsam-bild-neu-20260923.tar.gz`. Gäste-Foto (weichgezeichnet) war Mario zu verschwommen → `assets/tafel-fenster-640/850.webp` (Bild d29751f8, Ausschnitt ohne großen Würfel-Ballon, 4:5, scharf). Aus der Diashow entfernt (keine Doppelung, jetzt 5 Bilder). Alte Dateien in `../_archive/bernd-72-unused-assets/`.
- Geprüft 390/1440: Bild scharf, kein Überlauf, `npm run check` grün.

## 23.09. Sprung nach dem Intro (iPhone)
- Backup `../bernd-72-before-intro-sprung-20260923.tar.gz`. Marios Bildschirmvideo 08:40: bei 5,8 bis 6,4 s zeigt die Überblendung die Seite ~450 px tief gescrollt (Hero-Text + „Der erste Grund“), bei 6,6 s Sprung nach oben. Ursache: iOS-Tastatur am Code-Feld hinterlässt Scroll-Versatz.
- Fix `openIntro()`: Eingabefeld `blur()`, `scrollTo(0,0)` vor dem Intro und nach dem Seitenaufbau (inkl. Lenis `immediate`).
- Geprüft 390 px mit simuliertem Versatz 450 px: scrollY während des ganzen Intros 0, Konsole 0, `npm run check` grün. Echter iPhone-Test offen.
