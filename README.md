# Bernds 72. Geburtstag – Einladungswebsite

Eigenständige statische One-Page. Keine Datenbank, kein Tracking, keine extern geladenen Schriften. Die bestehende Sayuko-Materialsammlung und das Remotion-Projekt bleiben erhalten. Live unter https://bernd-72-einladung.vercel.app (Stand und Regeln: `HANDOFF.md`).

Die Komponente `components/logo-bloom.js` (`<logo-bloom src="…" label="…">`) zeichnet eine Vogel-Phyllotaxis nach 21st.dev „Phyllotaxis Bloom“ (MIT): kleine Sayuko-Logos im Zentrum, Punkte von Koralle zu Gold. Maus steuert Dichte und Weite, auf Touch-Geräten der Scroll; Klick, Enter oder Leertaste senden einen Impuls. Läuft nur im sichtbaren Bereich, bei reduzierter Bewegung statisch. Scroll-Effekte: GSAP + ScrollTrigger + Lenis, lokal unter `vendor/`.

## Lokal ansehen

Im Verzeichnis dieser README:

```sh
npm run dev
```

Danach `http://127.0.0.1:4173` öffnen. Node.js ab Version 20 genügt; es gibt keine zu installierenden npm-Abhängigkeiten. Der aktuelle Vorschau-Server läuft bereits auf diesem Port. Nach Änderungen `npm run build` ausführen und den Browser neu laden. Änderungen werden nicht automatisch übernommen.

## Texte und Veranstaltungsdaten ändern

`content.json` ist die zentrale Inhaltsdatei:

- `event`: Datum, Uhrzeit, Zeitzone, Frist, Adresse, Maps-Link, Bandname.
- `copy`: Einladung und Abschnittstexte.
- `media`: vorhandene Bild- und Videodateien unter `assets/`.
- `rsvp`: bestätigter Kontakt und vorbereitete Nachricht.
- `publicUrl`: endgültige HTTPS-Adresse der Website für die Linkvorschau; bis zur Veröffentlichung `null`.

Layout und Farben: `styles.css`. Bedienung und Animation: `app.js`. HTML-Vorlage: `scripts/build.mjs`. Generiertes HTML in `dist/` nicht direkt bearbeiten, da ein Build es neu erzeugt.

```sh
npm run check
```

Der Befehl prüft JavaScript-Syntax und baut die statische Seite. Browserprüfung und aktuelle Einschränkungen stehen in `VERIFICATION.md`, sobald die Abnahme abgeschlossen ist.

## WhatsApp-Zusage

Aktiv seit 23.09.2026 (Nummer von Mario freigegeben): `rsvp.phone` = `+491748207000`, `rsvp.confirmed` = `true`. Gäste wählen „allein“ oder „zu zweit“, tragen Namen ein, und `setupRsvp()` in `app.js` öffnet WhatsApp mit fertiger Nachricht an Bernd. Die Website speichert und sendet nichts, die Gäste schicken die Nachricht in WhatsApp selbst ab. Nummer ändern: `rsvp.phone` (international, mit `+`, ohne Leerzeichen) und neu bauen. `confirmed: false` schaltet den Button wieder ab.

## Verwendetes Material

| Website | Tatsächliche Quelle / Verarbeitung |
|---|---|
| Bernds Schwarz-Weiß-Porträt | `/Users/marioalbrecht/Downloads/dd83563c-394b-418c-a8d1-328503cdcfb9.JPG`; rechteckiger Fotoausschnitt x=575 bis 1054, y=145 bis 1280. Politische Texte/Logos liegen außerhalb. Keine generative Bearbeitung oder Gesichtsänderung. |
| Familienfoto | Anhang `42B74208-8747-436A-865B-0693ABA544F1.jpeg` aus der Aufgabe „Geburtstagseinladung Text“; echte Aufnahme mit drei Personen. |
| Sayuko-Zeichen | `../Sayuko/Projekt/public/logo/mark.png`, unverzerrt. |
| Sushi | `../Sayuko/Projekt/public/fotos/sushi-quer2.jpg`. |
| Ambiente | Neuzugang vom 22.09.: `WhatsApp Image 2026-09-22 at 20.31.15 (3).jpeg`. |
| Außenansicht | `../Sayuko/Projekt/public/fotos/aussen.jpg`. |
| Diashow Einblicke | Ersetzt seit 23.09. den Eventfilm (Film + Teaser in `../_archive/bernd-72-unused-assets/`). 6 Bilder aus `~/Downloads/Sayuko_Bilder_Update`, als `assets/sayuko-dia-<name>-600/900.webp` (3:4), Reihenfolge und Alt-Texte in `content.json` `media.slides`. Weiche Überblendung mit Ken-Burns, läuft nur im Sichtbereich, Pause-Knopf, bei reduzierter Bewegung erst auf Tipp. |
| Fabian | `assets/fabian-sushi-640/1040.webp` (Bild 63202765, nur zugeschnitten) ersetzt das Ambiente-Foto in „01 · Der Ort“. |
| Live-Band-Hintergrund | Pexels-Video [„A Music Band Performing on Stage“](https://www.pexels.com/video/a-music-band-performing-on-stage-8041841/) von Tima Miroshnichenko. Gemäß [Pexels-Lizenz](https://www.pexels.com/license/) kostenlos nutzbar und bearbeitbar. Für die Website stumm, schwarz-weiß, weichgezeichnet und auf 1280 × 674 Pixel optimiert; Original unter `../Sayuko/Originalmaterial/Bernd-Geburtstag/external/pexels-8041841-original.mp4`. |
| Schrift | Cormorant Garamond, Google Fonts, lokal gespeicherter lateinischer WOFF2-Subset; Lizenz unter `assets/fonts/OFL.txt`. Sans-Serif nutzt die Systemschrift. |

Die persönlichen Originale sind dauerhaft unter `../Sayuko/Originalmaterial/Bernd-Geburtstag/` archiviert und werden nicht mit der Website ausgeliefert. Die unbearbeitete Porträtkarte gehört nicht in `assets/` oder `dist/`.

Die vorhandenen fertigen REWE-/Feier-Filme wurden geprüft. Sie enthalten Verkaufsbotschaften, Weihnachtsfeier-Werbung und eine Restaurant-Anfragenummer. Deshalb zeigt die private Einladung den Eventfilm als Einblick in frühere Sayuko-Veranstaltungen. Frühere Veranstaltungsdekoration wird nicht als zugesagtes Geburtstagsprogramm dargestellt.

Der neue Textabschnitt erklärt in Bernds persönlicher Stimme, dass der 14. November zugleich drei Jahre seit der Adoption von Fabian markiert. Das Sayuko wird seit der Copy-Überarbeitung (23.09.) nur noch als Fabians Restaurant beschrieben, ohne Leistungskatalog. Das vom Nutzer beschriebene Foto mit Fabian in roter Schürze ist noch nicht als zugängliche Datei bestätigt und wird daher nicht erfunden oder durch ein anderes Fabian-Foto ersetzt.

Die früheren Luxury-Einladungsbilder waren in der alten Aufgabe erwähnt, aber nicht als zugängliche Bilddateien vorhanden. Der Webentwurf folgt deshalb der ausdrücklich beschriebenen Schwarz-Gold-Richtung. Die neue Linkvorschau wird passend zur Website mit dem vorhandenen Porträt gesetzt; sie ist keine Kopie einer wiedergefundenen Einladungsvorlage. Der Claim „Come in. Feel at home.“ wurde mangels Bestätigung nicht verwendet.

## Nach Freigabe auf Vercel veröffentlichen

1. RSVP-Kontakt bestätigen und aktivieren, Entwurf freigeben. Falls die Original-Luxury-Dateien geliefert werden, Vorschau und Gestaltung nochmals abgleichen.
2. Für diese Website ein **neues** Vercel-Projekt anlegen. Als Projektwurzel dieses Verzeichnis wählen; keine vorhandene Live-Seite überschreiben.
3. Die mitgelieferte `vercel.json` setzt Build auf `npm run build` und Ausgabe auf `dist`. Framework: `Other`/statisch. Es gibt keine Umgebungsvariablen oder Schlüssel.
4. Die vorgesehene endgültige HTTPS-Adresse als `publicUrl` in `content.json` setzen und neu bauen. Dadurch erhält die Open-Graph-Vorschau eine absolute Bildadresse.
5. Erst nach Freigabe deployen, anschließend Bild-/Videolinks, WhatsApp-Ziel und Maps auf der veröffentlichten URL prüfen. Die tatsächliche WhatsApp-Linkvorschau kann erst mit einer erreichbaren URL abschließend geprüft werden.

**Privatsphäre:** HTML-Metadaten, `robots.txt` und Vercel-Header verlangen keine Indexierung. Das ist kein Zugriffsschutz. Wer die URL kennt, kann die Seite und ihre Medien abrufen. Ein echter Zugangsschutz muss separat eingerichtet werden, wenn gewünscht.
