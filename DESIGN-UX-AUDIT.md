# Design- und UX-Audit: Bernds 72. Geburtstag

Stand: 22. September 2026  
Prüfumfang: vorhandene Desktop- und Mobile-Screenshots, Flyer, HTML-Struktur, CSS, Animationen, Medienstrategie und Build. Inhalte, Daten und Dramaturgie bleiben unverändert.

## Gesamturteil

Die Seite wirkt bereits persönlich, hochwertig und deutlich individueller als eine übliche Event-Landingpage. Schwarz, Navy, Champagnergold, Bernds Porträt und die privaten Bilder ergeben eine stimmige Welt. Die nächste Qualitätsstufe entsteht durch Konzentration: ein dominanter Einstieg, ruhigere Folgeabschnitte und weniger gleichzeitig aktive Gestaltungsideen.

| Bereich | Einschätzung | Begründung |
|---|---:|---|
| Persönlichkeit und Geschichte | 9/10 | Echte Bilder, Vater-Sohn-Geschichte und Sayuko-Bezug wirken glaubwürdig. |
| Visuelle Hierarchie | 8/10 | Hero und Termine sind klar; kleine Kapitelpunkte und dauerhafte CTA-Leiste konkurrieren auf Mobilgeräten. |
| Typografie | 8/10 | Cormorant und Sans funktionieren; die Flyer-Headline besitzt mehr Eigenständigkeit und Materialität. |
| Mobile UX | 7.5/10 | Gut lesbar und berührbar; feste Zusageleiste nimmt dauerhaft Raum ein, Kapitelpunkte sind zu klein. |
| Bewegung | 7/10 | Intro-Idee stark; zusätzliche Reveals, Logo-Blüte und Video können den Haupteffekt verwässern. |
| Barrierefreiheit | 8/10 | Semantik, Alternativtexte, Fokus und Reduced Motion sind vorhanden; einige Meta-Texte sind sehr klein. |
| Performance | 8/10 | Bilder responsiv, Videos sparsam geladen; das neue Intro-Motiv sollte noch stärker komprimiert werden. |

## Flyeranalyse

Der Flyer kombiniert drei Ebenen:

1. **Bodoni-/Didot-artige Display-Serife:** sehr hoher Strichkontrast, schmale Haarlinien, monumentale Ziffern.
2. **Materialgold:** unregelmäßige Metalltextur, helle Kanten, dunkle Kontur und wenige gezielte Lichtsterne.
3. **Warme Nachtaufnahme:** Schwarz und Navy werden durch Restaurantlicht, Kerzen und kleine Goldreflexe lebendig.

Die Wirkung kommt vor allem aus der großen „72“ und dem gestapelten Schriftzug „JAHRE / BERND“. Kalender, Adresse und Zusagekasten sind funktionaler und sollen diese Headline unterstützen. Für die Website sollte deshalb die Flyer-Headline den einzigen großen Showmoment bilden. Goldtextur und Lichtsterne sparsam wiederholen.

## Priorität A: größter Effekt bei kleinem Eingriff

### 1. Einen einzigen Signature-Moment festlegen

Empfehlung: Code-Eingabe → Bilder sammeln sich zur 72 → exakte Flyer-Headline erscheint → kurzer Lichtlauf → Zoom in den Hero. Danach ruhige Seite. Scroll-Reveals nur noch sehr dezent; Logo-Blüte ausschließlich nach Berührung oder Klick.

### 2. Mobile Kapitelpunkte entfernen

Die Kreise „01–05“ sind im mobilen Hero kaum lesbar und wirken wie technische Navigation. Auf Mobilgeräten ausblenden. Desktop-Seitenleiste kann bleiben, weil dort genug Raum vorhanden ist.

### 3. Zusageleiste kontextabhängig anzeigen

Die feste Leiste ist nützlich, steht aber permanent über Bildern und Übergängen. Erst nach dem Hero einblenden; im eigentlichen Zusagebereich wieder ausblenden. Höhe auf etwa 64–70 px begrenzen. Der Inhalt bleibt unverändert.

### 4. Goldsystem vereinheitlichen

Für Intro, Hero-72, feine Linien und Frist denselben Goldverlauf verwenden. Metalltextur nur auf Intro und großer 72. Alle anderen Goldflächen flach und ruhig halten. So wirkt Gold wertvoller.

## Priorität B: redaktioneller Feinschliff

### 5. Galerie stärker kuratieren

Mobil: horizontales Scroll-Snap mit sichtbarem Anschnitt des nächsten Fotos und kleiner Positionsanzeige. Desktop: bestehende asymmetrische Bildfolge behalten. Wenige, konkrete Bildunterschriften; keine Beschriftung für jedes Foto.

### 6. Vater-Sohn-Abschnitt als emotionalen Ruhepunkt behandeln

Foto und Zitat erhalten mehr vertikalen Raum. Keine zusätzliche Animation außer sanftem Einblenden. Dieser Abschnitt soll intimer wirken als das Sayuko- und Musik-Kapitel.

### 7. Sayuko-Farbwechsel präziser führen

Übergang von Schwarz-Weiß zu warmen Farben beibehalten. Original-Logo klar sichtbar lassen. Logo-Blüte als optionale Interaktion behandeln, damit sie nicht mit dem Eventvideo konkurriert.

### 8. Live-Musik visueller, aber nicht lauter

Bandvideo bleibt unscharf, monochrom und stumm. Etwas mehr erkennbare Bewegung hinter dem Bandnamen, zugleich stärkere dunkle Fläche direkt hinter der Schrift. Keine zusätzlichen Equalizer- oder Notenanimationen.

## Priorität C: Detailqualität

- Kritische UI-Texte mindestens 14–16 px; winzige Kapitelziffern nur dekorativ oder entfernen.
- Begriffe vereinheitlichen: bevorzugt „Zusage“ für Navigation und Abschluss statt wechselnd „Dabei sein“/„Zusage“.
- Intro-Headline von derzeit rund 368 KB auf etwa 100–180 KB reduzieren, ohne sichtbaren Qualitätsverlust.
- Auf kurzen Smartphone-Displays prüfen: 320×700, 360×800 und Querformat 844×390.
- Share-Thumbnail bei WhatsApp mit neuer Dateiadresse testen; Messenger-Caches können ältere Vorschauen behalten.

## Bewusst nicht empfohlen

- Weitere Partikel-, Parallax- oder Cursor-Effekte.
- Mehr Goldornamente oder zusätzliche Schriftarten.
- Automatisch startende Musik.
- Umbau der Inhalte, neue Programmpunkte oder eine neue Seitenstruktur.
- Vollflächige Verwendung des Flyers als Website-Hintergrund.

## Empfohlener nächster Umsetzungsschritt

Ein kompakter Refinement-Pass: mobile Kapitelpunkte entfernen, Zusageleiste kontextabhängig machen, Bewegungen reduzieren und Goldbehandlung angleichen. Danach gezielte Browserprüfung auf Mobilgerät und Desktop. Dieser Pass verbessert Ruhe, Wertigkeit und Bedienung, ohne den aufgebauten Kontext zu verändern.

## Prüfstatus

- `npm run check`: erfolgreich.
- Responsive Bilder und Lazy Loading: vorhanden.
- Videos: kein ungefragter Ton, `preload="none"`.
- Reduced Motion: vorhanden.
- RSVP bleibt bis zur bestätigten Telefonnummer deaktiviert.
- Automatischer neuer Browserlauf war in dieser Sitzung durch einen belegten Browser-Prozess und die lokale Sandbox gesperrt; vorhandene Mobile- und Desktop-Screenshots wurden visuell geprüft.

