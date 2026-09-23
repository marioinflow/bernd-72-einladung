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
const deadlineFull = format(event.rsvpDeadline, { day: 'numeric', month: 'long', year: 'numeric' });
const dayNumber = format(event.date, { day: 'numeric' }).replace('.', '');
const year = format(event.date, { year: 'numeric' });
if (!/^\d{2}:\d{2}$/.test(event.time)) throw new Error('Uhrzeit muss HH:MM sein.');
if (!event.mapsUrl.startsWith('https://maps.app.goo.gl/')) throw new Error('Maps-Link prüfen.');
if (data.publicUrl && !/^https:\/\/[^/]+\/?$/.test(data.publicUrl)) throw new Error('publicUrl benötigt eine vollständige HTTPS-Origin ohne Unterpfad.');
if (rsvp.confirmed && !/^\+[1-9]\d{7,14}$/.test(rsvp.phone || '')) throw new Error('Bestätigter RSVP-Kontakt benötigt eine internationale Nummer, z. B. +49…, ohne Leerzeichen.');
const rsvpReady = rsvp.confirmed === true && Boolean(rsvp.phone);
const eventDay = format(event.date, { day: 'numeric', month: 'long' });
const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5"/></svg>';
const waIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8.7 7.6c.2-.4.5-.4.8-.4h.5c.2 0 .4.1.5.4l.7 1.7c.1.2 0 .5-.1.6l-.5.6c-.1.2-.1.4 0 .5.6 1.1 1.5 2 2.6 2.6.2.1.4.1.5 0l.6-.6c.2-.2.4-.2.6-.1l1.7.8c.2.1.3.3.3.5v.5c0 .3-.1.6-.4.8-.5.4-1.2.6-1.9.5-2.9-.5-5.2-2.8-5.7-5.7-.1-.6.1-1.3.5-1.8z" fill="currentColor"/></svg>';
// The message is assembled in the browser from count + names; nothing is sent or stored by the site.
const rsvpButton = rsvpReady
  ? `<form class="rsvp-form" data-phone="${e(rsvp.phone.slice(1))}" data-day="${e(eventDay)}" novalidate>
          <fieldset class="rsvp-count">
            <legend class="visually-hidden">Wie viele kommen?</legend>
            <label><input type="radio" name="count" value="1" checked><span>Ich komme allein</span></label>
            <label><input type="radio" name="count" value="2"><span>Wir kommen zu zweit</span></label>
          </fieldset>
          <div class="rsvp-names">
            <label class="field"><span>Dein Name</span><input name="name1" autocomplete="name" enterkeyhint="done" required></label>
            <label class="field" data-second hidden><span>Name der Begleitung</span><input name="name2" enterkeyhint="done"></label>
          </div>
          <p class="rsvp-error" role="alert" hidden>Bitte tragt eure Namen ein.</p>
          <button class="btn btn-primary btn-large btn-wa" type="submit">Per WhatsApp zusagen <span class="ico">${waIcon}</span></button>
        </form>`
  : `<button class="btn btn-primary btn-large" type="button" disabled>WhatsApp-Zusage folgt <span class="ico">${arrow}</span></button>`;
const dist = path.join(root, 'dist');
await mkdir(dist, { recursive: true });
await cp(path.join(root, 'assets'), path.join(dist, 'assets'), { recursive: true, filter: source => !source.endsWith('.ttf') });
await rm(path.join(dist, 'assets/fonts/cormorant-garamond.ttf'), { force: true });
await Promise.all(['styles.css', 'app.js'].map(file => cp(path.join(root, file), path.join(dist, file))));
await cp(path.join(root, 'vendor'), path.join(dist, 'vendor'), { recursive: true });
await cp(path.join(root, 'components'), path.join(dist, 'components'), { recursive: true });
for (const [key, asset] of Object.entries(media)) {
  if (key === 'slides') {
    for (const slide of asset) {
      if (!/^[a-z-]+$/.test(slide.name)) throw new Error(`Ungültiger Diashow-Name: ${slide.name}`);
      for (const width of [600, 900]) await access(path.join(root, `assets/sayuko-dia-${slide.name}-${width}.webp`));
    }
    continue;
  }
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
const introImages = [media.fatherSonSmall, ...gallery.map(image => image.small)];
const introHeroTileIndex = 15;
const introTileMarkup = Array.from({ length: 24 }, (_, index) => {
  const isHeroTile = index === introHeroTileIndex;
  const source = isHeroTile ? media.heroBgSmall : introImages[index % introImages.length];
  return `<span class="intro-tile${isHeroTile ? ' intro-tile--hero' : ''}"><img src="${e(source)}" alt="" decoding="async"></span>`;
}).join('');
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
  <meta property="og:image:alt" content="Die Pepperls laden ein: Bernd mit seiner Frau und Fabian, Einladung zu Bernds 72. Geburtstag am 14. November 2026">
  ${data.publicUrl ? `<meta property="og:url" content="${e(data.publicUrl)}">` : ''}
  ${data.publicUrl ? `<link rel="canonical" href="${e(data.publicUrl)}">` : ''}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${e(data.title)}">
  <meta name="twitter:description" content="${e(data.description)}">
  <meta name="twitter:image" content="${e(socialImage)}">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="preload" href="assets/fonts/cormorant-garamond-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="${e(media.heroBgSmall)}" as="image" media="(max-width: 700px)">
  <link rel="preload" href="${e(media.heroBg)}" as="image" media="(min-width: 701px)">
  <link rel="preload" href="assets/familie-freigestellt-640.webp" as="image" media="(max-width: 700px)">
  <link rel="preload" href="assets/familie-freigestellt-1152.webp" as="image" media="(min-width: 701px)">
  <link rel="preload" href="${e(media.logo)}" as="image">
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

  <section class="access-confirmation" hidden aria-label="Einladung geöffnet" aria-live="polite">
    <div class="access-confirmation-mark" aria-hidden="true"><img src="${e(media.logo)}" width="862" height="1023" alt=""></div>
    <p class="access-confirmation-copy"><span>Come in.</span><span>Feel at home.</span></p>
  </section>

  <section class="intro" hidden aria-label="Bernd wird 72">
    <figure class="intro-hero-bridge" aria-hidden="true"><img src="${e(media.heroBg)}" srcset="${e(media.heroBgSmall)} 700w, ${e(media.heroBg)} 1264w" sizes="100vw" alt=""></figure>
    <div class="intro-tiles" aria-hidden="true">${introTileMarkup}</div>
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
      <div class="hero-bg" aria-hidden="true"><img src="${e(media.heroBg)}" srcset="${e(media.heroBgSmall)} 700w, ${e(media.heroBg)} 1264w" sizes="100vw" alt="" decoding="async"></div>
      <div class="hero-dust" aria-hidden="true">${Array.from({ length: 14 }, (_, i) => `<i style="--x:${(i * 37) % 100}%;--y:${(i * 53) % 90}%;--s:${2 + (i % 4)}px;--d:${9 + (i % 5) * 2}s;--o:${-i * 1.3}s"></i>`).join('')}</div>
      <div class="hero-stage">
        <h1 id="hero-heading" class="hero-title"><span class="visually-hidden">Die </span><span class="hero-word gold-text">Pepperls</span> <span class="hero-invite">…&nbsp;laden ein</span></h1>
        <img class="hero-family" src="assets/familie-freigestellt-1152.webp" srcset="assets/familie-freigestellt-640.webp 640w, assets/familie-freigestellt-1152.webp 1152w" sizes="(max-width: 700px) 96vw, 980px" width="1152" height="829" alt="Bernd mit seiner Frau und Fabian, lachend mit Sonnenbrillen" fetchpriority="high">
      </div>
      <div class="hero-bottom">
        <p class="hero-sub">Wir haben gleich zweimal Grund zu feiern.<br>72 Jahre Geschichten und eine, die gerade erst beginnt.<br>Ein Einblick, was euch erwartet.</p>
        <p class="hero-meta"><time datetime="${e(event.date)}T${e(event.time)}">${e(day)}, ${e(eventDay)} · ab ${e(event.time)} Uhr</time><span class="hero-meta-dot" aria-hidden="true"></span><span>Sayuko, Obrigheim</span></p>
        <a class="hero-discover" href="#grund-1">Den Abend entdecken <span aria-hidden="true">↓</span></a>
      </div>
    </section>

    <div class="journey journey-short" aria-hidden="true"><i></i></div>
    <section class="birthday-banner" id="grund-1" aria-label="Der erste Grund zu feiern: Bernds 72. Geburtstag">
      <p class="eyebrow banner-reason">Der erste Grund zu feiern</p>
      <div class="birthday-banner-stage">
        <figure><img src="${e(media.loginBanner)}" width="1088" height="608" alt="Einladung zu Bernds 72. Geburtstag am 14. November 2026" loading="lazy" decoding="async"></figure>
      </div>
    </section>

    <div class="journey journey-short" aria-hidden="true"><i></i></div>
    <section class="adoption" aria-labelledby="adoption-heading">
      <div class="wrap adoption-grid">
        <div class="adoption-copy" data-reveal-group>
          <p class="eyebrow" data-reveal>${e(copy.adoptionLabel)}</p>
          <div class="adoption-badge" data-reveal aria-hidden="true">
            <svg viewBox="0 0 200 190" role="presentation">
              <defs>
                <linearGradient id="badge-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7ecd0"/><stop offset=".4" stop-color="#e2c68e"/><stop offset=".72" stop-color="#b8955a"/><stop offset="1" stop-color="#e9d4a3"/></linearGradient>
                <linearGradient id="badge-band" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ecd7a4"/><stop offset="1" stop-color="#b08c52"/></linearGradient>
                <path id="badge-arc" d="M40 146 Q100 166 160 146"/>
              </defs>
              <circle cx="100" cy="86" r="76" fill="none" stroke="url(#badge-gold)" stroke-width="5"/>
              <circle cx="100" cy="86" r="67" fill="none" stroke="#cfb27a" stroke-opacity=".45" stroke-width="1"/>
              <text x="100" y="124" text-anchor="middle" fill="url(#badge-gold)" font-family="Cormorant, Georgia, serif" font-size="112" font-weight="500" style="font-variant-numeric:lining-nums">3</text>
              <path d="M14 136 L34 132 L28 146 L34 160 L14 156 L22 146 Z M186 136 L166 132 L172 146 L166 160 L186 156 L178 146 Z" fill="#9c7e4a"/>
              <path d="M30 130 Q100 152 170 130 L170 156 Q100 178 30 156 Z" fill="url(#badge-band)"/>
              <text font-family="Cormorant, Georgia, serif" font-size="15" font-weight="700" letter-spacing="2.2" fill="#2a1f0e" text-anchor="middle"><textPath href="#badge-arc" startOffset="50%">ANNIVERSARY</textPath></text>
            </svg>
            <span class="adoption-badge-line"></span>
            <p class="adoption-badge-name gold-text">Vater &amp; Sohn&nbsp;Pepperl</p>
          </div>
          <h2 id="adoption-heading" data-reveal>${e(copy.adoptionHeading)}</h2>
          <blockquote data-reveal><p>${e(copy.adoptionQuote)}</p><p>${e(copy.adoptionRestaurant)}</p><cite>${e(copy.adoptionAttribution)}</cite></blockquote>
        </div>
        <figure class="adoption-photo" data-clip>
          <div class="parallax"><img src="${e(media.fatherSon)}" srcset="${e(media.fatherSonSmall)} 640w, ${e(media.fatherSon)} 1280w" sizes="(max-width: 800px) 88vw, 46vw" width="1280" height="960" alt="Bernd und Fabian sitzen lächelnd nebeneinander an einem Esstisch" loading="lazy" decoding="async"></div>
          <figcaption>Bernd &amp; Fabian</figcaption>
        </figure>
      </div>
    </section>

    <div class="journey" aria-hidden="true"><i></i></div>
    <section class="together" id="gemeinsam" data-pin aria-labelledby="together-heading">
      <div class="wrap together-grid">
        <figure class="together-photo" data-clip>
          <img src="${e(media.together)}" srcset="${e(media.togetherSmall)} 640w, ${e(media.together)} 850w" sizes="(max-width: 800px) 80vw, 34vw" width="850" height="1063" alt="Gedeckter Tisch mit Kerzenlicht an der Fensterfront des Sayuko" loading="lazy" decoding="async">
          <figcaption>Am liebsten mit euch.</figcaption>
        </figure>
        <div class="together-head">
          <p class="eyebrow">Gemeinsam feiern</p>
          <h2 id="together-heading" data-brighten>${words(copy.togetherHeading)}</h2>
        </div>
        <div class="together-copy">
          <ol class="together-list">
            ${copy.together.split(/(?<=\.)\s+/).map((line, i) => `<li><span class="together-num" aria-hidden="true">0${i + 1}</span><p data-brighten>${e(line)}</p></li>`).join('')}
          </ol>
          <p class="together-close" data-brighten>${words(copy.personal)}</p>
          <p class="signoff">Schön, wenn ihr diesen Abend mit uns teilt.</p>
        </div>
      </div>
    </section>

    <div class="journey" aria-hidden="true"><i></i></div>
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

    <div class="journey" aria-hidden="true"><i></i></div>
    <section class="evening" id="abend" aria-labelledby="evening-heading">
      <div class="bloom-stage">
        <logo-bloom class="sayuko-bloom" src="${e(media.logo)}" label="Sayuko-Blüte neu aussäen"></logo-bloom>
        <div class="bloom-copy" data-reveal-group>
          <img class="bloom-logo" data-reveal src="${e(media.logo)}" width="72" height="86" alt="Sayuko – Logo" loading="lazy">
          <p class="eyebrow" data-reveal>Unser Ort für diesen Abend</p>
          <h2 id="evening-heading" data-reveal>${e(copy.venueHeading)}</h2>
        </div>
      </div>

      <div class="evening-film">
        <div class="evening-film-bg" aria-hidden="true"><canvas class="evening-canvas" data-frames="61" width="540" height="860"></canvas></div>
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
              <figure data-clip><img src="${e(media.fabian)}" srcset="${e(media.fabianSmall)} 640w, ${e(media.fabian)} 1040w" sizes="(max-width: 800px) 44vw, 24vw" alt="Fabian bereitet im Sayuko Sushi zu" width="1040" height="1387" loading="lazy"><figcaption>Fabian in seinem Element.</figcaption></figure>
            </div>
          </div>
        </article>

        <article class="step">
          <span class="step-dot" aria-hidden="true"></span>
          <p class="step-num">02 · Einblicke</p>
          <div class="step-grid step-grid-film">
            <div data-reveal-group>
              <h3 data-reveal>Ein Blick hinein.</h3>
              <p class="muted" data-reveal>Ein kleiner Blick ins Sayuko und auf die Atmosphäre einer früheren Veranstaltung.</p>
            </div>
            <div class="film slides" data-clip role="group" aria-roledescription="Diashow" aria-label="Einblicke ins Sayuko">
              ${media.slides.map((slide, index) => `<img class="slide${index ? '' : ' is-active'}" src="assets/sayuko-dia-${e(slide.name)}-900.webp" srcset="assets/sayuko-dia-${e(slide.name)}-600.webp 600w, assets/sayuko-dia-${e(slide.name)}-900.webp 900w" sizes="(max-width: 800px) 86vw, 360px" width="900" height="1200" alt="${e(slide.alt)}" loading="lazy" decoding="async">`).join('\n              ')}
              <div class="slides-dots" aria-hidden="true">${media.slides.map(() => '<i></i>').join('')}</div>
              <button class="slides-toggle" type="button" aria-label="Diashow pausieren" aria-pressed="false"><span aria-hidden="true"></span></button>
            </div>
          </div>
        </article>

        <article class="step step-band">
          <span class="step-dot" aria-hidden="true"></span>
          <p class="step-num">03 · Musik für den Abend</p>
          <div class="band" data-clip>
            <div class="band-media"><video class="band-video" muted loop playsinline preload="none" poster="${e(media.bandBackgroundPoster)}" aria-hidden="true" tabindex="-1"><source data-src="${e(media.bandBackground)}" type="video/mp4"></video></div>
            <div class="band-copy">
              <p class="band-live"><span class="band-eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>Live am Abend</p>
              <h3 class="band-name">${e(event.band)}</h3>
              <p class="band-text">${e(copy.music)}</p>
              <ul class="band-tags"><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>Live-Band</li><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg>Im Sayuko, Obrigheim</li></ul>
            </div>
          </div>
        </article>
      </div>
      <div class="evening-film-hold" aria-hidden="true"></div>
      </div>
    </section>

    <div class="journey" aria-hidden="true"><i></i></div>
    <section class="details" id="details" aria-labelledby="details-heading">
      <div class="wrap">
        <p class="eyebrow">Ein Abend für Bernd.</p>
        <h2 id="details-heading" class="details-heading">Am 14. November wird gefeiert.</h2>
        <div class="facts event-cards">
          <article class="fact event-card event-card-date"><div class="event-card-head"><span class="event-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg></span><p class="event-card-label">Der Anlass</p></div><time class="event-card-value event-date" datetime="${e(event.date)}"><span class="mask"><span>${e(dayNumber)}</span></span><small>${e(month)}</small></time><p class="event-card-meta">${e(day)} · ${e(year)}</p></article>
          <article class="fact event-card event-card-time"><div class="event-card-head"><span class="event-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg></span><p class="event-card-label">Auftakt</p></div><p class="event-card-value event-time"><span class="mask"><span>${e(event.time)}</span></span><small>Uhr</small></p><p class="event-card-meta">Ankommen, anstoßen, zusammen sein.</p></article>
          <article class="fact event-card event-card-note"><div class="event-card-head"><span class="event-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h14l-7 8zM12 12v8M8 20h8"/></svg></span><p class="event-card-label">Was uns erwartet</p></div><p class="event-card-value event-note">Sushi &amp; Drinks</p><p class="event-card-meta">Und gute Geschichten.</p></article>
          <article class="fact event-card event-card-place"><div class="event-card-head"><span class="event-card-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg></span><p class="event-card-label">Der Ort</p></div><address><strong class="event-card-value">Sayuko</strong><span class="event-card-meta">${e(event.street)}<br>${e(event.city)}</span></address><a class="btn btn-secondary" href="${e(event.mapsUrl)}" target="_blank" rel="noopener noreferrer"><span>Anfahrt<span class="hide-sm"> öffnen</span></span> <span class="ico">${arrow}</span></a></article>
        </div>
        <div class="aftermovie-pin"><figure class="details-photo event-keyvisual" data-clip><video class="aftermovie-video" muted playsinline preload="none" poster="assets/aftermovie-72-start-1280.webp" data-end-poster="assets/aftermovie-72-end-1280.webp" data-src="assets/aftermovie-72-1280.mp4" data-src-small="assets/aftermovie-72-720.mp4" width="1280" height="720" aria-label="Feuerwerk über dem beleuchteten Sayuko, am Himmel leuchtet die 72"></video><figcaption class="event-keyvisual-copy"><p><time datetime="${e(event.date)}">${e(dayNumber)}. ${e(month)} ${e(year)}</time> · ab ${e(event.time)} Uhr</p><h3>Für einen unvergesslichen Abend fehlt nur noch eure Zusage.</h3><p class="event-keyvisual-line">Kommt vorbei und genießt eine gute Zeit im Kreis wunderbarer Menschen. Wir freuen uns auf jeden Einzelnen von euch.</p><a class="btn btn-primary" href="#zusage">Wir kommen gern <span class="ico">${arrow}</span></a></figcaption></figure></div>
      </div>
    </section>

    <div class="journey" aria-hidden="true"><i></i></div>
    <section class="rsvp" id="zusage" aria-labelledby="rsvp-heading">
      <div class="wrap rsvp-inner" data-reveal-group>
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
