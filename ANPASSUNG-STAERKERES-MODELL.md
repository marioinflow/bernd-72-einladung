# Anpassungsauftrag für das stärkere Modell

## Ausgangspunkt

Projekt: `/Users/marioalbrecht/Documents/Codex/2026-09-22/ich-x20/outputs/bernd-72`

Lokale Vorschau: `http://127.0.0.1:4174/`

Die Einladung ist eine statische Website für Bernds 72. Geburtstag. Der Code-Gate-Code für die lokale Prüfung ist `Bernd72!`. Es darf nichts deployed, gepusht oder in `dist/` manuell geändert werden.

## Bereits umgesetzt

- Der ursprüngliche Familien-Hero mit „Pepperls … laden ein“ bleibt erhalten.
- Nach dem Code-Gate formt eine Fotokachel-Collage eine große „72“.
- Die gesamte „72“ zoomt als Gruppe leicht diagonal und blendet danach in das Hero-Loungebild über.
- Die mobile Variante nutzt größere Kacheln und einen stärkeren Gruppenzoom.
- Der Geburtstagsbereich zeigt ausschließlich das originale Login-Banner, weil Text und Datum bereits im Bild enthalten sind.
- Das Bannerbild skaliert sehr leicht und hat einen dezenten goldenen Lichtschein als Dauerloop.
- Das Sayuko-Endframe bleibt weich maskiert und bekommt keinen harten rechteckigen Rahmen.

## Ziel des Feinschliffs

Bitte die bestehende Umsetzung visuell auf Apple-Niveau prüfen und nur gezielt nachschärfen:

1. Die komplette „72“ muss während des Zooms als zusammenhängende Form erkennbar bleiben. Keine einzelne Fotokachel darf sich herauslösen oder allein auf die Bildmitte zoomen.
2. Der Gruppenzoom soll ruhig, hochwertig und räumlich wirken. Auf kleinen Displays muss die „72“ groß genug bleiben, ohne die Kacheln zu hektisch oder zu lange zu zeigen.
3. Der Übergang vom Gruppenzoom zum Loungebild soll wie ein einziger Kamerazoom wirken. Kein sichtbarer harter Schnitt, kein schwarzer Zwischenframe und kein neuer Bildrahmen.
4. Das Login-Banner soll als Bild für sich wirken. Der Goldschein muss sehr subtil bleiben, darf die eingebettete Typografie nicht überstrahlen und soll beim Loop nicht auffällig springen.
5. Die bestehende Hero-Familie, Texte, Navigation, Galerie und Sayuko-Animation dürfen durch den Feinschliff nicht verschwinden oder in ihrer Reihenfolge verändert werden.

## Akzeptanzkriterien

- Desktop geprüft, mindestens etwa 1440 × 900.
- Mobil geprüft, mindestens etwa 390 × 844.
- Intro mit `Bernd72!` geöffnet und vollständig bis zum Hero abgespielt.
- Während des Intros bleibt die komplette „72“ sichtbar; der Übergang startet erst nach dem Gruppenzoom.
- Bei `prefers-reduced-motion: reduce` gibt es keinen starken Zoom- oder Lichtloop.
- Keine Console-Fehler, kein horizontales Überlaufen und keine blockierte Scrollposition nach dem Intro.
- `npm run check` und `git diff --check` laufen grün.
- Vor weiteren Änderungen ein neues Backup außerhalb von `dist/` anlegen.

## Arbeitsweise

Nur die relevanten Stellen in `app.js`, `scripts/build.mjs` und `styles.css` anfassen. Bestehende uncommittete Nutzeränderungen erhalten. Nach jeder Änderung lokal prüfen und erst nach sichtbarer Kontrolle als fertig melden. Nicht deployen.
