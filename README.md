# Bernds 72. Geburtstag – Einladungswebsite

Eigenständige statische One-Page. Keine Datenbank, kein Tracking, keine extern geladenen Schriften. Die bestehende Sayuko-Materialsammlung und das Remotion-Projekt bleiben erhalten. Bisher nicht veröffentlicht.

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

Der Kontakt ist noch nicht bestätigt. Daher stehen `rsvp.phone` auf `null` und `rsvp.confirmed` auf `false`; es gibt keinen WhatsApp-Link. Die mobile Leiste führt zum Zusageabschnitt.

Erst nach ausdrücklicher Bestätigung der RSVP-Nummer: die internationale Telefonnummer mit führendem `+` und ohne Leerzeichen in `rsvp.phone` eintragen und `rsvp.confirmed` auf `true` setzen. Anschließend neu bauen. Die Restaurantnummer darf nicht automatisch übernommen werden.

Die Funktion öffnet WhatsApp mit einer vorbereiteten Nachricht. Die Gäste ergänzen Name und Personenzahl und senden die Nachricht dort selbst. Die Website erfasst keine Zusagen und zeigt keine Erfolgsbestätigung.

## Verwendetes Material

| Website | Tatsächliche Quelle / Verarbeitung |
|---|---|
| Bernds Schwarz-Weiß-Porträt | `/Users/marioalbrecht/Downloads/dd83563c-394b-418c-a8d1-328503cdcfb9.JPG`; rechteckiger Fotoausschnitt x=575 bis 1054, y=145 bis 1280. Politische Texte/Logos liegen außerhalb. Keine generative Bearbeitung oder Gesichtsänderung. |
| Familienfoto | Anhang `42B74208-8747-436A-865B-0693ABA544F1.jpeg` aus der Aufgabe „Geburtstagseinladung Text“; echte Aufnahme mit drei Personen. |
| Sayuko-Zeichen | `../Sayuko/Projekt/public/logo/mark.png`, unverzerrt. |
| Sushi | `../Sayuko/Projekt/public/fotos/sushi-quer2.jpg`. |
| Ambiente | Neuzugang vom 22.09.: `WhatsApp Image 2026-09-22 at 20.31.15 (3).jpeg`. |
| Außenansicht | `../Sayuko/Projekt/public/fotos/aussen.jpg`. |
| Eventfilm | Neuzugang `WhatsApp Video 2026-09-22 at 20.31.16 (1).mp4`, als 53-Sekunden-Webfassung `assets/sayuko-events.mp4` mit 480 × 848 Pixeln exportiert. Das Video enthält die Originaltonspur, ist aber standardmäßig stumm und startet erst nach Klick. Der goldene Vorhang aus dem angehängten Vorschaubild ist der erste Frame. Quelle bleibt erhalten. |
| Live-Band-Hintergrund | Pexels-Video [„A Music Band Performing on Stage“](https://www.pexels.com/video/a-music-band-performing-on-stage-8041841/) von Tima Miroshnichenko. Gemäß [Pexels-Lizenz](https://www.pexels.com/license/) kostenlos nutzbar und bearbeitbar. Für die Website stumm, schwarz-weiß, weichgezeichnet und auf 1280 × 674 Pixel optimiert; Original unter `../Sayuko/Originalmaterial/Bernd-Geburtstag/external/pexels-8041841-original.mp4`. |
| Schrift | Cormorant Garamond, Google Fonts, lokal gespeicherter lateinischer WOFF2-Subset; Lizenz unter `assets/fonts/OFL.txt`. Sans-Serif nutzt die Systemschrift. |

Die persönlichen Originale sind dauerhaft unter `../Sayuko/Originalmaterial/Bernd-Geburtstag/` archiviert und werden nicht mit der Website ausgeliefert. Die unbearbeitete Porträtkarte gehört nicht in `assets/` oder `dist/`.

Die vorhandenen fertigen REWE-/Feier-Filme wurden geprüft. Sie enthalten Verkaufsbotschaften, Weihnachtsfeier-Werbung und eine Restaurant-Anfragenummer. Deshalb zeigt die private Einladung den Eventfilm als Einblick in frühere Sayuko-Veranstaltungen. Frühere Veranstaltungsdekoration wird nicht als zugesagtes Geburtstagsprogramm dargestellt.

Der neue Textabschnitt erklärt in Bernds persönlicher Stimme, dass der 14. November zugleich drei Jahre seit der Adoption von Fabian markiert. Die Beschreibung von Fabians Sayuko-Arbeit bleibt bei den im Material belegten Bereichen: Sushi, Buffet/Fingerfood, Catering, Sushi-Kurse, private Feiern und Firmenveranstaltungen. Das vom Nutzer beschriebene Foto mit Fabian in roter Schürze ist noch nicht als zugängliche Datei bestätigt und wird daher nicht erfunden oder durch ein anderes Fabian-Foto ersetzt.

Die früheren Luxury-Einladungsbilder waren in der alten Aufgabe erwähnt, aber nicht als zugängliche Bilddateien vorhanden. Der Webentwurf folgt deshalb der ausdrücklich beschriebenen Schwarz-Gold-Richtung. Die neue Linkvorschau wird passend zur Website mit dem vorhandenen Porträt gesetzt; sie ist keine Kopie einer wiedergefundenen Einladungsvorlage. Der Claim „Come in. Feel at home.“ wurde mangels Bestätigung nicht verwendet.

## Nach Freigabe auf Vercel veröffentlichen

1. RSVP-Kontakt bestätigen und aktivieren, Entwurf freigeben. Falls die Original-Luxury-Dateien geliefert werden, Vorschau und Gestaltung nochmals abgleichen.
2. Für diese Website ein **neues** Vercel-Projekt anlegen. Als Projektwurzel dieses Verzeichnis wählen; keine vorhandene Live-Seite überschreiben.
3. Die mitgelieferte `vercel.json` setzt Build auf `npm run build` und Ausgabe auf `dist`. Framework: `Other`/statisch. Es gibt keine Umgebungsvariablen oder Schlüssel.
4. Die vorgesehene endgültige HTTPS-Adresse als `publicUrl` in `content.json` setzen und neu bauen. Dadurch erhält die Open-Graph-Vorschau eine absolute Bildadresse.
5. Erst nach Freigabe deployen, anschließend Bild-/Videolinks, WhatsApp-Ziel und Maps auf der veröffentlichten URL prüfen. Die tatsächliche WhatsApp-Linkvorschau kann erst mit einer erreichbaren URL abschließend geprüft werden.

**Privatsphäre:** HTML-Metadaten, `robots.txt` und Vercel-Header verlangen keine Indexierung. Das ist kein Zugriffsschutz. Wer die URL kennt, kann die Seite und ihre Medien abrufen. Ein echter Zugangsschutz muss separat eingerichtet werden, wenn gewünscht.
