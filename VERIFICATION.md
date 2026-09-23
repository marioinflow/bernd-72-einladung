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

## Nicht geprüft
- Echte Touch-Gesten (Wischen/Runterziehen in der Lightbox) auf einem echten Handy.
- `prefers-reduced-motion` im Browser emuliert: Code-Pfad vorhanden (kein Intro, kein Lenis, keine GSAP-Effekte, Blüte statisch), aber nicht live gesehen.
- Safari/iOS, Querformat, Tablet 768.
