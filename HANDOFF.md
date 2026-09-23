# Übergabe – Stand 23.09.2026 (nach Redesign)

## Ziel / bindend
Private, responsive Einladungs-One-Page zu Bernds 72. Geburtstag. Sa 14.11.2026 ab 18:00, Sayuko – The Sushi Lounge, Friedhofstraße 26, 74847 Obrigheim. Zusage bis 15.10.2026, Band Pinball Wizard. Wir-Ansprache, Luxus/professionell (schwarz, navy, champagner-gold). Keine politischen Inhalte, erfundenen Programmpunkte, Gesichtsänderungen, Autoplay mit Ton, Tracking oder Backend. Keine Veröffentlichung ohne Freigabe. WhatsApp nur mit bestätigter RSVP-Nummer.

## Aufbau (statisch, kein Framework)
- `content.json` Inhalte · `scripts/build.mjs` HTML-Vorlage → `dist/` · `styles.css` · `app.js` · `components/logo-bloom.js` · `vendor/` (GSAP 3.15 + ScrollTrigger, Lenis 1.3.23, lokal, keine CDN-Aufrufe).
- Referenzen für Motion/Buttons: md-one (`~/Kunden/MD-One/code/md-one`, `lib/motion.ts`, `StickyStack.tsx`) und domisum-relaunch (`components/ui/TextReveal.tsx`, `ScrollMorphHero.tsx`).
- Sayuko-Blüte nach 21st.dev „Phyllotaxis Bloom“ (daiv09, MIT), als Web Component nachgebaut.

## Sektionen
Code-Sperre (Banner bleibt exakt) → Intro (~13 s, Fotos → „72“ → Porträt → Schrift) → Hero (freigestelltes Familienfoto zwischen „Bernd“ | „72“, nach Referenz-Split-Titel) → Pepperl-Banner (wächst auf volle Breite) → Zusammen (Wort-Aufhellen) → 3 Jahre Vater & Sohn → Galerie (Sticky-Stack + Lightbox) → Sayuko-Blüte + Leit-Linie (Ort, Film, Band) → Auf einen Blick → Zusage.

## Offen
- Hero-Freistellung: `assets/familie-freigestellt-*.webp`, lokal per macOS Vision (JXA) aus `../Sayuko/Originalmaterial/Bernd-Geburtstag/familie-original.jpeg`, Haarsaum entfärbt; Farbstimmung nur per CSS.
- RSVP-Nummer fehlt (`phone: null`, `confirmed: false` beibehalten).
- Test auf echtem Handy (Touch-Gesten, iOS Safari), siehe `VERIFICATION.md`.
- Domain/Veröffentlichung erst nach Freigabe. Projekt liegt im Codex-Ordner, kein Git.
- Ungenutzte Flyer-Headline liegt in `../_archive/bernd-72-unused-assets/`.
