# Übergabe – Stand 23.09.2026 (live, an Bernd verschickt)

## Ziel / bindend
Private Einladungs-One-Page zu Bernds 72. Geburtstag. Sa 14.11.2026 ab 18:00, Sayuko – The Sushi Lounge, Friedhofstraße 26, 74847 Obrigheim. Zusage bis 15.10.2026, Band Pinball Wizard. Versand per WhatsApp → Phone-Ansicht hat Vorrang.
- Ansprache „ihr“, Familie spricht als „wir“, Bernds Abschnitt in Ich-Form. Keine Gedankenstriche in Copy (Ausnahme Eigenname „Sayuko – The Sushi Lounge“).
- Keine erfundenen Programmpunkte/Fakten, keine Gesichtsänderung, kein Autoplay mit Ton, kein Tracking, kein Backend, keine externen CDNs/Fonts.
- RSVP aktiv seit 23.09. (Nummer von Mario freigegeben, `content.json` `rsvp`). Beim Testen nie echte WhatsApp-Links öffnen: Überraschung, die Nachricht ginge an Bernd.
- Deploy nur mit Marios ausdrücklichem Go. Vor jeder Änderung Backup `../bernd-72-before-<thema>-<datum>.tar.gz`, Ungenutztes nach `../_archive/`, nie löschen. `dist/` nie direkt bearbeiten. `prefers-reduced-motion` muss funktionieren.
- Mobil: keine Einzelwort-Zeilen. `p` hat `text-wrap:balance` (Chrome nur ≤6 Zeilen), sonst geschützte Leerzeichen ` ` in `content.json`.

## Live
https://bernd-72-einladung.vercel.app (Code `Bernd72!`, nur Optik, kein Schutz). Vercel-Projekt `bernd-72-einladung`, Deploy per CLI: `cd <dieser Ordner> && vercel deploy --prod --yes`. Git: github.com/marioinflow/bernd-72-einladung (privat, `main`).

## Aufbau (statisch, kein Framework)
`content.json` (Texte, Daten, Medien) → `scripts/build.mjs` (HTML-Vorlage, einige Texte fest im Template: Hero-Satz, Kicker, Signoff, Film-Text) → `dist/`. `styles.css`, `app.js` (Gate, GSAP/ScrollTrigger/Lenis aus `vendor/`), `components/logo-bloom.js`. Prüfen: `npm run check`, Vorschau `npm run dev` → http://127.0.0.1:4173.

## Sektionen
Code-Sperre → Hero „PEPPERLS … laden ein“ + „zweimal Grund zu feiern“ → Banner (erster Grund, 72) → 3 Jahre Vater & Sohn (zweiter Grund) → Gemeinsam feiern → Galerie (6 Bilder, Lightbox) → Sayuko-Blüte → Leit-Linie Ort/Film/Band mit Sayuko-Logo-Reveal als Scroll-Canvas im Hintergrund → Auf einen Blick → Zusage.

## Stand live (23.09. 12:40, `elulkjd2s`, committet)
Live = lokal = Git `main`. Enthält: „72“-Intro + Login-Banner, Hero-Zeile „72 Jahre Geschichten und eine, die gerade erst beginnt. Ein Einblick, was euch erwartet.“, Band als kompakte Karte (Live-Badge, Equalizer, Chips, Text „Sie sorgen für die Musik, ihr für die gute Laune.“), 4 Cards einheitlich (Apple-Stil), Aftermovie am Seitenende (einmal, lautlos, stoppt auf „72“, KI-Wasserzeichen per delogo weg) mit Scroll-Halt (`.aftermovie-pin`, sticky + `::after`-Spacer), Overlay „Für einen unvergesslichen Abend fehlt nur noch eure Zusage.“ + Button „Wir kommen gern“. Linkvorschau neu: `assets/einladung-pepperls-og.jpg` aus `scripts/og-preview.html` (rendern über den Dev-Server, nicht per file://, sonst fehlen die Fonts).
Link ging am 23.09. per WhatsApp an Bernd (`/?v=3`, WhatsApp cacht Vorschau pro URL). Warten auf sein Feedback.

## Offen
- Bernds Feedback einarbeiten.
- Echter iPhone-Test (iOS Safari, Touch). Band-Video ist weichgezeichnetes Hintergrundmaterial, echtes Material gibt es nicht.
- Claim „Come in. Feel at home.“ steht schwach im letzten Reveal-Frame, Bestätigung fehlt. Logo-Treue gegen `mark.png` prüfen.
- Reduzierte Bewegung: Reveal-Hintergrund fehlt ganz (evtl. statisches Endbild).
- Wortwiederholung „diesen Abend“ (Hero, Gemeinsam, Zitat, Sayuko) und „Schön, wenn ihr …“ (Signoff + Zusage) aus der Copy-Runde, von Mario noch nicht bewertet.

Verlauf und Belege: `VERIFICATION.md`.
