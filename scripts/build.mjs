import { readFile, writeFile, mkdir, cp, access, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(await readFile(path.join(root, 'content.json'), 'utf8'));
const { event, rsvp, copy, media, gallery } = data;
const e = (value) => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const format = (date, options) => new Intl.DateTimeFormat('de-DE', { timeZone: event.timezone, ...options }).format(new Date(`${date}T12:00:00Z`));
const day = format(event.date, { weekday: 'long' });
const month = format(event.date, { month: 'long' });
const dateFull = format(event.date, { day: 'numeric', month: 'long', year: 'numeric' });
const deadline = format(event.rsvpDeadline, { day: 'numeric', month: 'long' });
const deadlineFull = format(event.rsvpDeadline, { day: 'numeric', month: 'long', year: 'numeric' });
const dayNumber = format(event.date, { day: 'numeric' }).replace('.', '');
const year = format(event.date, { year: 'numeric' });
if (!/^\d{2}:\d{2}$/.test(event.time)) throw new Error('Uhrzeit muss HH:MM sein.');
if (!event.mapsUrl.startsWith('https://maps.app.goo.gl/')) throw new Error('Maps-Link prüfen.');
if (data.publicUrl && !/^https:\/\/[^/]+\/?$/.test(data.publicUrl)) throw new Error('publicUrl benötigt eine vollständige HTTPS-Origin ohne Unterpfad.');
if (rsvp.confirmed && !/^\+[1-9]\d{7,14}$/.test(rsvp.phone || '')) throw new Error('Bestätigter RSVP-Kontakt benötigt eine internationale Nummer, z. B. +49…, ohne Leerzeichen.');
const rsvpReady = rsvp.confirmed === true && Boolean(rsvp.phone);
const rsvpUrl = rsvpReady ? `https://wa.me/${rsvp.phone.slice(1)}?text=${encodeURIComponent(rsvp.message)}` : null;
const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5"/></svg>';
const rsvpButton = rsvpReady
  ? `<a class="btn btn-primary btn-large" href="${e(rsvpUrl)}" target="_blank" rel="noopener noreferrer">Per WhatsApp zusagen <span class="ico">${arrow}</span></a>`
  : `<button class="btn btn-primary btn-large" type="button" disabled>WhatsApp-Zusage folgt <span class="ico">${arrow}</span></button>`;
const dist = path.join(root, 'dist');
await mkdir(dist, { recursive: true });
await cp(path.join(root, 'assets'), path.join(dist, 'assets'), { recursive: true, filter: source => !source.endsWith('.ttf') });
await rm(path.join(dist, 'assets/fonts/cormorant-garamond.ttf'), { force: true });
await Promise.all(['styles.css', 'app.js'].map(file => cp(path.join(root, file), path.join(dist, file))));
await cp(path.join(root, 'vendor'), path.join(dist, 'vendor'), { recursive: true });
await cp(path.join(root, 'components'), path.join(dist, 'components'), { recursive: true });
for (const [key, asset] of Object.entries(media)) {
  if (!asset.startsWith('assets/') || asset.includes('..')) throw new Error(`Ungültiger Medienpfad: ${key}`);
  if (key !== 'socialPreview') await access(path.join(root, asset));
}
if (!Array.isArray(gallery) || gallery.length === 0) throw new Error('Die Bildergalerie darf nicht leer sein.');
for (const [index, image] of gallery.entries()) {
  for (const key of ['src', 'small']) {
    const asset = image[key];
    if (!asset.startsWith('assets/') || asset.includes('..')) throw new Error(`Ungültiger Galeriepfad: ${index + 1}/${key}`);
    await access(path.join(root, asset));
  }
  if (!Number.isInteger(image.width) || !Number.isInteger(image.height)) throw new Error(`Ungültige Bildgröße in Galerieeintrag ${index + 1}.`);
}
const pad = n => String(n).padStart(2, '0');
const galleryMarkup = gallery.map((image, index) => `<li class="stack-card" style="--i:${index}">
          <button class="stack-open" type="button" data-index="${index}" aria-label="Foto ${index + 1} von ${gallery.length} groß ansehen: ${e(image.alt)}">
            <img class="stack-backdrop" src="${e(image.small)}" alt="" loading="lazy" decoding="async" aria-hidden="true">
            <img class="stack-photo" src="${e(image.src)}" srcset="${e(image.small)} 640w, ${e(image.src)} ${e(image.width)}w" sizes="(max-width: 800px) 92vw, 58vw" width="${e(image.width)}" height="${e(image.height)}" alt="${e(image.alt)}" loading="lazy" decoding="async">
          </button>
          <p class="stack-index"><span>${pad(index + 1)}</span> / ${pad(gallery.length)}</p>
        </li>`).join('\n        ');
const introImages = [media.fatherSonSmall, media.familySmall, ...gallery.map(image => image.small)];
const introTileMarkup = Array.from({ length: 24 }, (_, index) => `<span class="intro-tile"><img src="${e(introImages[index % introImages.length])}" alt="" decoding="async"></span>`).join('');
const socialImage = data.publicUrl ? new URL(media.socialPreview, data.publicUrl).href : `/${media.socialPreview}`;
const words = text => e(text);
const html = `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${e(data.title)}</title>
  <meta name="description" content="${e(data.description)}">
  <meta name="robots" content="noindex, nofollow, noarchive, noimageindex">
  <meta name="theme-color" content="#07090e">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="de_DE">
  <meta property="og:site_name" content="Bernds 72. Geburtstag">
  <meta property="og:title" content="${e(data.title)}">
  <meta property="og:description" content="${e(data.description)}">
  <meta property="og:image" content="${e(socialImage)}">
  <meta property="og:image:secure_url" content="${e(socialImage)}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Bernds Porträt und die Einladung zum 72. Geburtstag am 14. November 2026">
  ${data.publicUrl ? `<meta property="og:url" content="${e(data.publicUrl)}">` : ''}
  ${data.publicUrl ? `<link rel="canonical" href="${e(data.publicUrl)}">` : ''}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${e(data.title)}">
  <meta name="twitter:description" content="${e(data.description)}">
  <meta name="twitter:image" content="${e(socialImage)}">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="preload" href="assets/fonts/cormorant-garamond-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="styles.css">
  <script src="vendor/gsap.min.js" defer></script>
  <script src="vendor/ScrollTrigger.min.js" defer></script>
  <script src="vendor/lenis.min.js" defer></script>
  <script src="components/logo-bloom.js" defer></script>
  <script src="app.js" defer></script>
</head>
<body class="is-locked">
  <section class="access-gate" aria-labelledby="access-title">
    <figure class="access-photo"><img src="${e(media.loginBanner)}" sizes="(max-width: 700px) 100vw, 50vw" alt="Bernds 72. Geburtstag – goldene Einladung vor dem Mannheimer Wasserturm" width="1088" height="608"></figure>
    <div class="access-content"><div class="access-form-wrap">
      <p class="section-label">Eine persönliche Einladung</p><h1 id="access-title">Schön, dass<br>ihr da seid.</h1><p class="access-intro">Gebt den Einladungscode aus unserer WhatsApp-Nachricht ein, um die Einladung zu öffnen.</p>
      <form id="access-form"><label for="access-code">Einladungscode</label><input id="access-code" type="password" autocomplete="off" autocapitalize="none" spellcheck="false" required aria-describedby="access-error"><p id="access-error" role="alert"></p><button type="submit" class="btn btn-primary btn-block">Einladung öffnen <span class="ico">${arrow}</span></button></form>
      <noscript>Bitte aktiviert JavaScript, um die Einladung mit eurem Code zu öffnen.</noscript>
    </div><p class="access-footer">14. November 2026 · Sayuko, Obrigheim</p></div>
  </section>

  <section class="intro" hidden aria-label="Willkommen zu Bernds 72. Geburtstag">
    <figure class="intro-portrait"><img src="${e(media.portrait)}" srcset="${e(media.portraitSmall)} 640w, ${e(media.portrait)} 1053w" sizes="(max-width: 800px) 100vw, 50vw" alt="" width="1053" height="1492"></figure>
    <div class="intro-tiles" aria-hidden="true">${introTileMarkup}</div>
    <div class="intro-type">
      <p class="intro-eyebrow">Ein besonderer Geburtstag</p>
      <p class="intro-title" aria-hidden="true"><span class="intro-name">Bernd</span><span class="intro-line"><span class="intro-wird">wird</span> <span class="intro-72 gold-text">72</span></span></p>
      <p class="intro-date">${e(day)}, ${e(dateFull)} · ${e(event.location.split(' – ')[0])}, Obrigheim</p>
    </div>
    <button class="intro-skip" type="button">Überspringen <span aria-hidden="true">→</span></button>
  </section>

  <div id="invitation-content" hidden>
  <a class="skip-link" href="#inhalt">Zum Inhalt</a>
  <div class="scroll-progress" aria-hidden="true"><i></i></div>
  <header class="site-header">
    <a class="signature" href="#anfang" aria-label="Bernds 72. Geburtstag, zum Anfang">Bernd<span>72</span></a>
    <nav aria-label="Seitennavigation">
      <a href="#abend">Der Abend</a><a href="#details">Wann &amp; wo</a>
      <a class="btn btn-primary btn-nav" href="#zusage">Zusagen <span class="ico">${arrow}</span></a>
    </nav>
  </header>

  <main id="inhalt">
    <section class="hero" id="anfang" aria-labelledby="hero-heading">
      <div class="hero-bg" aria-hidden="true"><img src="${e(media.roomSmall)}" alt="" decoding="async"></div>
      <div class="hero-dust" aria-hidden="true">${Array.from({ length: 14 }, (_, i) => `<i style="--x:${(i * 37) % 100}%;--y:${(i * 53) % 90}%;--s:${2 + (i % 4)}px;--d:${9 + (i % 5) * 2}s;--o:${-i * 1.3}s"></i>`).join('')}</div>
      <div class="hero-stage">
        <h1 id="hero-heading" class="hero-title">
          <span class="hero-side hero-side-left"><span class="hero-kicker">Ein besonderer Geburtstag</span><span class="hero-word gold-text">Bernd</span></span>
          <span class="visually-hidden"> wird </span>
          <span class="hero-side hero-side-right"><span class="hero-kicker">wird zweiundsiebzig</span><span class="hero-word gold-text">72</span></span>
        </h1>
        <img class="hero-family" src="assets/familie-freigestellt-1152.webp" srcset="assets/familie-freigestellt-640.webp 640w, assets/familie-freigestellt-1152.webp 1152w" sizes="(max-width: 700px) 96vw, 980px" width="1152" height="829" alt="Bernd mit seiner Frau und Fabian, lachend mit Sonnenbrillen" fetchpriority="high">
      </div>
      <div class="hero-bottom">
        <p class="hero-sub">Wir laden euch herzlich<br>zu Bernds 72. Geburtstag ein.</p>
        <div class="hero-cta">
          <a class="btn btn-primary btn-large" href="#zusage">Zusagen bis ${e(deadline)} <span class="ico">${arrow}</span></a>
          <p class="hero-pill"><time datetime="${e(event.date)}T${e(event.time)}">${e(day)}, ${e(dateFull)} · ab ${e(event.time)} Uhr</time></p>
        </div>
        <p class="hero-note">${e(event.location)}, Obrigheim · <a href="${e(event.mapsUrl)}" target="_blank" rel="noopener noreferrer">Anfahrt</a></p>
      </div>
      <a class="scroll-cue" href="#gemeinsam" aria-label="Weiter zur Einladung"><span></span></a>
    </section>

    <section class="banner" aria-label="Die Pepperls laden ein">
      <figure class="banner-frame"><img src="${e(media.hero)}" width="1280" height="720" alt="Bernd, seine Familie und Freunde laden in goldener Kulisse zum 72. Geburtstag ein" loading="lazy" decoding="async"></figure>
    </section>

    <section class="together" id="gemeinsam" data-pin aria-labelledby="together-heading">
      <div class="wrap together-grid">
        <figure class="together-photo" data-clip>
          <img src="${e(media.together)}" srcset="${e(media.togetherSmall)} 640w, ${e(media.together)} 1280w" sizes="(max-width: 800px) 88vw, 38vw" width="1280" height="960" alt="Bernd und seine Frau bei einer Feier im Freien" loading="lazy" decoding="async">
          <figcaption>Am liebsten mit euch.</figcaption>
        </figure>
        <div class="together-copy">
          <p class="eyebrow">Gemeinsam feiern</p>
          <h2 id="together-heading" data-brighten>${words(copy.togetherHeading)}</h2>
          <p class="lead" data-brighten>${words(copy.together)} ${words(copy.personal)}</p>
          <p class="signoff">Wir freuen uns auf euch.</p>
        </div>
      </div>
    </section>

    <section class="adoption" aria-labelledby="adoption-heading">
      <div class="wrap adoption-grid">
        <div class="adoption-copy" data-reveal-group>
          <p class="eyebrow" data-reveal>${e(copy.adoptionLabel)}</p>
          <p class="adoption-number" data-reveal aria-hidden="true"><span class="gold-text">3</span><small>Jahre<br>Vater &amp; Sohn</small></p>
          <h2 id="adoption-heading" data-reveal>${e(copy.adoptionHeading)}</h2>
          <blockquote data-reveal><p>${e(copy.adoptionQuote)}</p><p>${e(copy.adoptionRestaurant)}</p><cite>${e(copy.adoptionAttribution)}</cite></blockquote>
        </div>
        <figure class="adoption-photo" data-clip>
          <div class="parallax"><img src="${e(media.fatherSon)}" srcset="${e(media.fatherSonSmall)} 640w, ${e(media.fatherSon)} 1280w" sizes="(max-width: 800px) 88vw, 46vw" width="1280" height="960" alt="Bernd und Fabian sitzen lächelnd nebeneinander an einem Esstisch" loading="lazy" decoding="async"></div>
          <figcaption>Bernd &amp; Fabian</figcaption>
        </figure>
      </div>
    </section>

    <section class="memories" aria-labelledby="memories-heading">
      <div class="wrap memories-grid">
        <div class="memories-intro">
          <p class="eyebrow">${e(copy.galleryLabel)}</p>
          <h2 id="memories-heading">${e(copy.galleryHeading)}</h2>
          <p class="muted">${e(copy.galleryText)}</p>
          <p class="hint">Zum Vergrößern antippen</p>
        </div>
        <ol class="stack" aria-label="Persönliche Bildergalerie">
        ${galleryMarkup}
        </ol>
      </div>
    </section>

    <section class="evening" id="abend" aria-labelledby="evening-heading">
      <div class="bloom-stage">
        <logo-bloom class="sayuko-bloom" src="${e(media.logo)}" label="Sayuko-Blüte neu aussäen"></logo-bloom>
        <div class="bloom-copy" data-reveal-group>
          <img class="bloom-logo" data-reveal src="${e(media.logo)}" width="72" height="86" alt="Sayuko – Logo" loading="lazy">
          <p class="eyebrow" data-reveal>Unser Ort für diesen Abend</p>
          <h2 id="evening-heading" data-reveal>${e(copy.venueHeading)}</h2>
          <p class="bloom-hint" data-reveal aria-hidden="true">Antippen, um die Blüte neu zu säen</p>
        </div>
      </div>

      <div class="wrap steps" data-line>
        <div class="steps-line" aria-hidden="true"><i class="steps-line-fill"></i></div>

        <article class="step">
          <span class="step-dot" aria-hidden="true"></span>
          <p class="step-num">01 · Der Ort</p>
          <div class="step-grid">
            <div data-reveal-group>
              <h3 data-reveal>Sayuko – The Sushi Lounge</h3>
              <p class="muted" data-reveal>${e(copy.venueText)}</p>
            </div>
            <div class="step-photos">
              <figure data-clip><img src="${e(media.food)}" srcset="${e(media.foodSmall)} 640w, ${e(media.food)} 1280w" sizes="(max-width: 800px) 44vw, 24vw" alt="Frisch angerichtetes Sushi im Sayuko" width="1600" height="1066" loading="lazy"><figcaption>Für die Vorfreude.</figcaption></figure>
              <figure data-clip><img src="${e(media.room)}" srcset="${e(media.roomSmall)} 640w, ${e(media.room)} 1280w" sizes="(max-width: 800px) 44vw, 24vw" alt="Vorbereitete Lounge mit Spieltisch und warmem Licht im Sayuko" width="1200" height="1600" loading="lazy"><figcaption>Raum für einen schönen Abend.</figcaption></figure>
            </div>
          </div>
        </article>

        <article class="step">
          <span class="step-dot" aria-hidden="true"></span>
          <p class="step-num">02 · Einblicke</p>
          <div class="step-grid step-grid-film">
            <div data-reveal-group>
              <h3 data-reveal>Ein Blick hinein.</h3>
              <p class="muted" data-reveal>Einblicke in Sayuko-Events. Die Aufnahme zeigt eine frühere Veranstaltung und das Ambiente, sie beschreibt kein Programm der Geburtstagsfeier.</p>
            </div>
            <div class="film" data-clip>
              <video id="venue-video" playsinline preload="none" muted poster="${e(media.videoPoster)}" width="480" height="848" aria-label="Einblicke in Sayuko-Events, 53 Sekunden, startet ohne Ton">
                <source src="${e(media.video)}" type="video/mp4">
                Euer Browser unterstützt dieses Video nicht. <a href="${e(media.video)}">Video öffnen</a>.
              </video>
              <button class="film-play" type="button" aria-label="Einblicke in Sayuko-Events abspielen, 53 Sekunden, startet ohne Ton"><span class="film-play-ring" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg></span><span>Film ansehen<small>53 Sekunden · Ton über die Steuerung</small></span></button>
            </div>
          </div>
        </article>

        <article class="step step-band">
          <span class="step-dot" aria-hidden="true"></span>
          <p class="step-num">03 · Live mit uns</p>
          <div class="band" data-clip>
            <video class="band-video" muted loop playsinline preload="none" poster="${e(media.bandBackgroundPoster)}" aria-hidden="true" tabindex="-1"><source data-src="${e(media.bandBackground)}" type="video/mp4"></video>
            <div class="band-copy">
              <h3 class="band-name">${e(event.band)}</h3>
              <p>${e(copy.music)}</p>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="details" id="details" aria-labelledby="details-heading">
      <div class="wrap">
        <p class="eyebrow">Wir sehen uns hier</p>
        <h2 id="details-heading" class="details-heading">Der Abend auf einen Blick.</h2>
        <div class="facts">
          <div class="fact"><p class="fact-big"><span class="mask"><span>${e(dayNumber)}.</span></span></p><p class="fact-label">${e(month)} ${e(year)}<br>${e(day)}</p></div>
          <div class="fact"><p class="fact-big"><span class="mask"><span>${e(event.time)}</span></span></p><p class="fact-label">Uhr<br>Beginn des Abends</p></div>
          <div class="fact fact-place"><p class="fact-place-name"><span class="mask"><span>Sayuko</span></span></p><address class="fact-label">${e(event.street)}<br>${e(event.city)}</address>
            <a class="btn btn-secondary" href="${e(event.mapsUrl)}" target="_blank" rel="noopener noreferrer">Anfahrt öffnen <span class="ico">${arrow}</span></a></div>
        </div>
        <figure class="details-photo" data-clip><div class="parallax"><img src="${e(media.exterior)}" srcset="${e(media.exteriorSmall)} 640w, ${e(media.exterior)} 1280w" sizes="(max-width: 800px) 92vw, 80vw" alt="Das Sayuko-Gebäude mit Eingang an der Friedhofstraße in Obrigheim" width="2048" height="1152" loading="lazy"></div><figcaption>Sayuko, Obrigheim</figcaption></figure>
      </div>
    </section>

    <section class="rsvp" id="zusage" aria-labelledby="rsvp-heading">
      <div class="wrap rsvp-inner" data-reveal-group>
        <p class="eyebrow" data-reveal>Ein Abend, auf den wir uns freuen</p>
        <h2 id="rsvp-heading" data-reveal>${e(copy.closing)}</h2>
        <p class="rsvp-deadline" data-reveal>Bitte zusagen bis <time datetime="${e(event.rsvpDeadline)}">${e(deadlineFull)}</time></p>
        <div data-reveal>${rsvpButton}</div>
        <p class="rsvp-help" data-reveal>${e(rsvpReady ? copy.rsvpNotice : copy.rsvpPending)}</p>
        <a class="back-top" href="#anfang">Zurück nach oben ↑</a>
      </div>
    </section>
  </main>
  <footer class="site-footer wrap"><span>Bernds 72. Geburtstag</span><span>${e(dateFull)} · ${e(event.time)} Uhr</span></footer>

  <dialog class="lightbox" aria-label="Foto groß ansehen">
    <div class="lightbox-track"><img class="lightbox-img" alt=""></div>
    <p class="lightbox-count"></p>
    <button class="lightbox-btn lightbox-close" type="button" aria-label="Schließen">✕</button>
    <button class="lightbox-btn lightbox-prev" type="button" aria-label="Vorheriges Foto">←</button>
    <button class="lightbox-btn lightbox-next" type="button" aria-label="Nächstes Foto">→</button>
  </dialog>
  <script type="application/json" id="gallery-data">${JSON.stringify(gallery.map(g => ({ src: g.src, alt: g.alt }))).replace(/</g, '\\u003c')}</script>
  </div>
</body>
</html>`;
await writeFile(path.join(dist, 'index.html'), html);
await writeFile(path.join(dist, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
await writeFile(path.join(dist, 'favicon.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#07090e"/><text x="32" y="46" font-family="Georgia,serif" font-size="44" fill="#d8bd85" text-anchor="middle">72</text></svg>');
console.log(`Built static invitation. RSVP ${rsvpReady ? 'enabled with confirmed contact' : 'disabled – contact not confirmed'}. ${deadlineFull}.`);
