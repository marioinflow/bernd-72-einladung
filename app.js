const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const hasGsap = () => typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
let lenis = null;
let pageStarted = false;
let heroEntrance = null;

/* ---------- Access gate ---------- */
// Static gate only: keeps the invitation out of casual view, it is not authentication.
$('#access-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const input = $('#access-code');
  const error = $('#access-error');
  const code = input.value.replace(/\s+/g, '').toLocaleLowerCase('de-DE');
  if (code !== 'bernd72!') {
    error.textContent = 'Der Code stimmt noch nicht. Bitte prüft eure WhatsApp-Nachricht.';
    input.setAttribute('aria-invalid', 'true');
    input.focus();
    return;
  }
  input.value = '';
  openAccessConfirmation();
});
$('#access-code')?.addEventListener('input', event => {
  event.target.removeAttribute('aria-invalid');
  $('#access-error').textContent = '';
});

/* ---------- Confirmation: Sayuko mark opens the invitation ---------- */
function openAccessConfirmation() {
  const confirmation = $('.access-confirmation');
  document.activeElement?.blur();
  $('.access-gate').hidden = true;
  document.body.classList.remove('is-locked');

  if (!confirmation) { openIntro(); return; }
  const mark = $('.access-confirmation-mark', confirmation);
  const lines = $$('.access-confirmation-copy span', confirmation);
  confirmation.hidden = false;
  const finish = () => {
    confirmation.hidden = true;
    openIntro();
  };

  if (reducedMotion.matches || !hasGsap()) {
    window.setTimeout(finish, 650);
    return;
  }

  const { gsap } = window;
  gsap.timeline({ onComplete: finish })
    .fromTo(mark, { opacity: 0, scale: .92 }, { opacity: 1, scale: 1, duration: .56, ease: 'power3.out' })
    .fromTo(lines, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .46, ease: 'power3.out', stagger: .09 }, .32)
    .to(confirmation, { opacity: 0, duration: .32, ease: 'power2.inOut' }, 1.42);
}

/* ---------- Intro: family moments briefly gather into 72 ---------- */
const introTargets = [
  [-.42, -.28], [-.34, -.28], [-.26, -.28], [-.18, -.28], [-.10, -.28],
  [-.12, -.15], [-.16, 0], [-.20, .15], [-.24, .30], [-.28, .43],
  [.08, -.20], [.14, -.28], [.24, -.31], [.34, -.27], [.39, -.17],
  [.40, -.05], [.35, .05], [.28, .14], [.20, .23], [.12, .32],
  [.08, .42], [.18, .42], [.30, .42], [.41, .42]
];

function openIntro() {
  const intro = $('.intro');
  const content = $('#invitation-content');
  const skip = $('.intro-skip');
  // Close the phone keyboard and drop the scroll offset it caused, so the page appears at the top, not mid-way.
  document.activeElement?.blur();
  $('.access-gate').hidden = true;
  window.scrollTo(0, 0);
  document.body.classList.remove('is-locked');

  if (!intro || reducedMotion.matches || !hasGsap()) { openInvitation(); return; }

  let done = false;
  let timeline = null;
  const finish = () => {
    if (done) return;
    done = true;
    timeline?.kill();
    document.removeEventListener('keydown', onKey);
    intro.hidden = true;
    content.inert = false;
    document.body.classList.remove('intro-playing');
    openInvitation();
  };
  const onKey = event => { if (event.key === 'Escape') finish(); };

  content.hidden = false;
  content.inert = true;
  document.body.classList.add('intro-playing');
  intro.hidden = false;
  skip.addEventListener('click', finish, { once: true });
  document.addEventListener('keydown', onKey);
  skip.focus({ preventScroll: true });
  // Build the page while the intro is still dark: the heavy ScrollTrigger setup must not land mid-fade.
  startInvitation();
  window.scrollTo(0, 0);
  lenis?.scrollTo(0, { immediate: true });

  const { gsap } = window;
  const isCompact = innerWidth < 700;
  const spread = Math.min(innerWidth, innerHeight) * (isCompact ? .82 : .7);
  const tileSize = Math.round(spread * (isCompact ? .12 : .088));
  const tiles = $$('.intro-tile', intro);
  const bridge = $('.intro-hero-bridge', intro);
  const groupZoomScale = isCompact ? 3.35 : 2.65;
  tiles.forEach(tile => tile.style.setProperty('--tile', `${tileSize}px`));

  timeline = gsap.timeline({ onComplete: finish });
  timeline.fromTo(tiles, {
    x: i => Math.cos(i * 2.4) * innerWidth * (.28 + (i % 4) * .05),
    y: i => Math.sin(i * 2.4) * innerHeight * (.26 + (i % 3) * .05),
    rotation: i => ((i % 7) - 3) * 4,
    scale: 2.1, opacity: 0
  }, {
    scale: 1, opacity: 1, duration: .88, ease: 'power2.out', stagger: .022
  })
    .to(tiles, {
      x: i => introTargets[i][0] * spread,
      y: i => introTargets[i][1] * spread,
      rotation: 0, duration: .92, ease: 'power3.inOut', stagger: { each: .01, from: 'random' }
    }, .46)
    .to('.intro-tiles', { x: innerWidth * (isCompact ? -.035 : -.025), y: innerHeight * -.018, scale: groupZoomScale, duration: 1.08, ease: 'power3.inOut' }, 1.66)
    .fromTo(bridge, { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1.12, duration: .86, ease: 'power3.inOut' }, 2.02)
    .call(() => heroEntrance?.play(), [], 2.3)
    .to('.intro-tiles', { opacity: 0, duration: .6, ease: 'sine.inOut' }, 2.3)
    .to(intro, { opacity: 0, duration: 1, ease: 'sine.inOut' }, 2.45);
}

/* ---------- Open the invitation ---------- */
function openInvitation() {
  $('.access-gate').hidden = true;
  document.body.classList.remove('is-locked');
  $('#invitation-content').hidden = false;
  window.scrollTo(0, 0);
  startInvitation();
  heroEntrance?.play();
  const heading = $('#hero-heading');
  heading.setAttribute('tabindex', '-1');
  heading.focus({ preventScroll: true });
}

function startInvitation() {
  if (pageStarted) return;
  pageStarted = true;
  startPage();
}

/* ---------- Party glitter: faint gold/blue sparkles drifting over the whole page ---------- */
function glitter() {
  if (reducedMotion.matches) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'glitter';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.append(canvas);
  const ctx = canvas.getContext('2d');
  const colors = ['#f7e6b5', '#e2c68e', '#cfb27a', '#8fb0ff', '#6d8cff'];
  let w = 0, h = 0, dpr = 1, parts = [];
  const spawn = (y = Math.random() * h) => ({
    x: Math.random() * w, y, r: .6 + Math.random() * 1.6,
    vy: -(4 + Math.random() * 10), vx: (Math.random() - .5) * 4,
    tw: .6 + Math.random() * 1.6, ph: Math.random() * Math.PI * 2,
    c: colors[Math.random() * colors.length | 0], star: Math.random() < .12
  });
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // ponytail: density scales with area, capped so phones stay light
    const count = Math.min(120, Math.round(w * h / 11000));
    parts = Array.from({ length: count }, () => spawn());
  };
  resize();
  addEventListener('resize', resize);
  let last = performance.now(), raf = 0;
  const frame = now => {
    const dt = Math.min((now - last) / 1000, .05); last = now;
    ctx.clearRect(0, 0, w, h);
    for (const p of parts) {
      p.y += p.vy * dt; p.x += p.vx * dt;
      if (p.y < -10) Object.assign(p, spawn(h + 10));
      const a = Math.max(0, Math.sin(now / 1000 * p.tw + p.ph)) ** 3;
      if (a < .02) continue;
      ctx.globalAlpha = a * .8;
      ctx.fillStyle = ctx.strokeStyle = p.c;
      ctx.shadowColor = p.c; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      if (p.star && a > .5) {
        const l = p.r * 6 * a;
        ctx.lineWidth = .6; ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.moveTo(p.x - l, p.y); ctx.lineTo(p.x + l, p.y); ctx.moveTo(p.x, p.y - l); ctx.lineTo(p.x, p.y + l); ctx.stroke();
      }
    }
    if (!document.hidden) raf = requestAnimationFrame(frame);
  };
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(frame); } });
  raf = requestAnimationFrame(frame);
}

/* ---------- Page ---------- */
function startPage() {
  setupRsvp();
  const slides = setupSlides();
  setupBand();
  setupAftermovie();
  setupLightbox();
  setupHeader();
  glitter();
  if (reducedMotion.matches || !hasGsap()) return;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  if (typeof window.Lenis !== 'undefined') {
    lenis = new window.Lenis({ duration: 1.25, easing: t => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  $$('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
    const target = $(link.getAttribute('href'));
    if (!target || !lenis) return;
    event.preventDefault();
    lenis.scrollTo(target, { offset: link.getAttribute('href') === '#anfang' ? -200 : -70, duration: 1.6 });
  }));

  const ease = 'power3.out';
  gsap.to('.scroll-progress i', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });

  // Blur reveal, grouped children stagger (md-one preset).
  $$('[data-reveal-group]').forEach(group => {
    gsap.fromTo($$('[data-reveal]', group), { y: 40, opacity: 0, filter: 'blur(8px)' }, {
      y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.1, ease, stagger: .12,
      scrollTrigger: { trigger: group, start: 'top 82%', once: true }
    });
  });

  // Images open like a curtain and settle from a slight zoom.
  $$('[data-clip]').forEach(figure => {
    const img = $('img', figure);
    const tl = gsap.timeline({ scrollTrigger: { trigger: figure, start: 'top 85%', once: true } });
    tl.fromTo(figure, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' });
    if (img && !img.closest('.parallax, .slides')) tl.fromTo(img, { scale: 1.2 }, { scale: 1, duration: 1.9, ease: 'expo.out' }, .15);
  });

  $$('.parallax').forEach(layer => {
    gsap.fromTo(layer, { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: layer.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // Hero entrance: the name rises out of the lounge, the family comes up in front of it.
  heroEntrance = gsap.timeline({ paused: document.body.classList.contains('intro-playing'), defaults: { ease: 'expo.out' } });
  heroEntrance.fromTo('.hero-bg img', { scale: 1.12 }, { scale: 1.06, duration: 1.25, ease: 'power2.out' }, 0)
    .fromTo('.hero-word', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, .08)
    .fromTo('.hero-family', { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 1.15 }, .18)
    .fromTo('.hero-invite', { opacity: 0, x: 12 }, { opacity: 1, x: 0, duration: .9 }, .62)
    .fromTo('.hero-bottom > *', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .85, stagger: .1 }, .56);
  // On scroll the name drifts up behind the family, which comes a touch closer.
  const heroOut = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('.hero-word', { yPercent: -18, ease: 'none', scrollTrigger: heroOut });
  gsap.to('.hero-family', { scale: 1.06, yPercent: 6, ease: 'none', transformOrigin: '50% 100%', scrollTrigger: heroOut });
  gsap.to('.hero-bg img', { yPercent: 8, ease: 'none', scrollTrigger: heroOut });

  // Words brighten one after another; on wide screens the section holds still meanwhile.
  const words = $$('[data-brighten]').flatMap(element => {
    element.innerHTML = element.textContent.split(/(\s+)/).map(part => /^\s+$/.test(part) ? part : `<span class="wrd">${part}</span>`).join('');
    return $$('.wrd', element);
  });
  if (words.length) {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1001px)', () => {
      gsap.fromTo(words, { opacity: .18 }, { opacity: 1, ease: 'none', duration: .3, stagger: .7, scrollTrigger: { trigger: '.together', start: 'center center', end: '+=900', pin: true, scrub: .8, anticipatePin: 1 } });
    });
    mm.add('(max-width: 1000px)', () => {
      gsap.fromTo(words, { opacity: .18 }, { opacity: 1, ease: 'none', duration: .3, stagger: .7, scrollTrigger: { trigger: '.together-grid', start: 'top 75%', end: 'bottom 55%', scrub: .8 } });
    });
  }
  gsap.fromTo('.signoff', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.2, ease, scrollTrigger: { trigger: '.signoff', start: 'top 90%', once: true } });

  // Sticky stack: earlier photos step back as the next one arrives.
  const cards = $$('.stack-card');
  if (cards.length > 1) {
    const tl = gsap.timeline({ scrollTrigger: { trigger: '.stack', start: 'top 110px', end: 'bottom bottom', scrub: .4 } });
    cards.forEach((card, i) => {
      const target = Math.max(.78, 1 - (cards.length - i - 1) * .035);
      if (i < cards.length - 1) tl.fromTo(card, { scale: 1, filter: 'brightness(1)' }, { scale: target, filter: 'brightness(0.62)', ease: 'none', duration: 1 - i / cards.length }, i / cards.length);
    });
  }

  // The film step holds briefly while the film grows, so it is not scrolled past.
  // Created in page order (after the together pin, before the line/band triggers) so offsets stay right.
  const filmStep = $('.step-grid-film')?.closest('.step');
  if (filmStep) {
    // The section holds while scrolling walks through the photos one by one.
    slides?.scrollDriven();
    const perSlide = () => Math.min(innerHeight * .55, 480);
    gsap.fromTo('.film', { scale: .86 }, { scale: 1.06, ease: 'none', scrollTrigger: {
      trigger: '.film', start: 'center center', end: () => `+=${perSlide() * (slides?.count || 1)}`, pin: filmStep, scrub: .6, invalidateOnRefresh: true,
      onUpdate: self => slides?.go(Math.floor(self.progress * slides.count * .999))
    } });
  }

  // Guiding line through the evening; each point lights up as the line reaches it.
  const line = $('[data-line]');
  if (line) {
    const steps = $$('.step', line);
    gsap.fromTo('.steps-line-fill', { scaleY: 0 }, {
      scaleY: 1, ease: 'none',
      scrollTrigger: {
        trigger: line, start: 'top 70%', end: 'bottom 60%', scrub: 1.2,
        onUpdate: self => steps.forEach((step, i) => step.classList.toggle('lit', self.progress >= i / steps.length + .02))
      }
    });
    gsap.fromTo('.band-name', { letterSpacing: '.08em', opacity: 0 }, { letterSpacing: '-.04em', opacity: 1, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: '.band', start: 'top 70%', once: true } });
  }

  // Sayuko logo reveal builds up behind the evening as you scroll towards the band.
  const film = eveningFilm();
  if (film) {
    // The reveal runs through the band and ends only in the following hold.
    const finalFrame = $('.evening-canvas');
    ScrollTrigger.create({ trigger: '.evening-film', start: 'top 70%', endTrigger: '.evening-film-hold', end: 'top 15%', onUpdate: self => film.show(self.progress) });
    ScrollTrigger.create({
      trigger: '.evening-film-hold',
      start: 'top 15%',
      onEnter: () => finalFrame?.classList.add('is-final'),
      onLeaveBack: () => finalFrame?.classList.remove('is-final')
    });
  }

  // Big numbers rise out of a mask.
  gsap.fromTo('.mask > span', { yPercent: 105 }, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: .14, scrollTrigger: { trigger: '.facts', start: 'top 80%', once: true } });
  gsap.fromTo('.details-heading', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.1, ease, scrollTrigger: { trigger: '.details-heading', start: 'top 85%', once: true } });

  // Journey threads draw between sections; created last so the pins above are already measured.
  $$('.journey').forEach(thread => {
    gsap.fromTo(thread, { '--p': 0 }, { '--p': 1, ease: 'none', scrollTrigger: { trigger: thread, start: 'top 90%', end: 'bottom 50%', scrub: .5 } });
  });

  addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  reducedMotion.addEventListener('change', event => { if (event.matches) location.reload(); });
}

// Frame sequence on a canvas: scrubbing a <video> stutters on iOS, still images do not.
function eveningFilm() {
  const canvas = $('.evening-canvas');
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');
  const count = Number(canvas.dataset.frames);
  const frames = [];
  let target = 0;
  const ready = i => frames[i]?.complete && frames[i].naturalWidth > 0;
  const draw = () => {
    let i = target;
    while (i > 0 && !ready(i)) i -= 1; // nearest loaded frame at or before the target
    if (ready(i)) ctx.drawImage(frames[i], 0, 0, canvas.width, canvas.height);
  };
  const load = () => {
    for (let i = 0; i < count; i += 1) {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => { if (i <= target) draw(); };
      img.src = `assets/sayuko-reveal/f${String(i).padStart(3, '0')}.webp`;
      frames[i] = img;
    }
  };
  new IntersectionObserver((entries, observer) => {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();
    load();
  }, { rootMargin: '600px 0px' }).observe(canvas);
  return { show(progress) { target = Math.round(progress * (count - 1)); draw(); } };
}

function setupHeader() {
  const header = $('.site-header');
  const sync = () => header.classList.toggle('is-scrolled', scrollY > 40);
  addEventListener('scroll', sync, { passive: true });
  sync();
}

/* ---------- RSVP: builds the WhatsApp message from count + names; the guest sends it there ---------- */
function rsvpMessage(names, day) {
  const us = names.length > 1 ? 'uns' : 'mir';
  return `Hey Bernd, nochmal vielen Dank für die Einladung! Du kannst am ${day} mit ${us} rechnen. Liebe Grüße, ${names.join(' und ')}`;
}

function setupRsvp() {
  const form = $('.rsvp-form');
  if (!form) return;
  const second = $('[data-second]', form);
  const error = $('.rsvp-error', form);
  form.addEventListener('change', event => {
    if (event.target.name !== 'count') return;
    second.hidden = event.target.value !== '2';
    error.hidden = true;
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const count = Number(form.elements.count.value);
    const fields = [form.elements.name1, form.elements.name2].slice(0, count);
    const names = fields.map(field => field.value.trim().replace(/\s+/g, ' '));
    const empty = fields.find((field, i) => !names[i]);
    error.hidden = !empty;
    if (empty) { empty.focus(); return; }
    const link = document.createElement('a');
    link.href = `https://wa.me/${form.dataset.phone}?text=${encodeURIComponent(rsvpMessage(names, form.dataset.day))}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  });
}

// Cross-fades the Sayuko photos while in view; pausable, and with reduced motion it waits for a tap.
function setupSlides() {
  const box = $('.slides');
  if (!box) return;
  const slides = $$('.slide', box);
  const dots = $$('.slides-dots i', box);
  const toggle = $('.slides-toggle', box);
  let index = 0;
  let timer = null;
  let visible = false;
  let paused = reducedMotion.matches;
  const show = next => {
    slides[index].classList.remove('is-active');
    dots[index].classList.remove('is-active');
    index = next % slides.length;
    slides[index].classList.add('is-active');
    dots[index].classList.add('is-active');
  };
  const sync = () => {
    clearInterval(timer);
    timer = visible && !paused && !document.hidden ? setInterval(() => show(index + 1), 4200) : null;
    toggle.setAttribute('aria-pressed', String(paused));
  };
  dots[0].classList.add('is-active');
  const go = next => { if (next !== index) show(next); };
  toggle.addEventListener('click', () => { paused = !paused; if (!paused) show(index + 1); sync(); });
  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .4 }).observe(box);
  else { visible = true; sync(); }
  // With scroll animation the page scroll picks the photo; timer and pause button step aside.
  return { count: slides.length, go, scrollDriven: () => { paused = true; sync(); toggle.hidden = true; } };
}

function setupBand() {
  const video = $('.band-video');
  if (!video || reducedMotion.matches || !('IntersectionObserver' in window)) return;
  const source = $('source[data-src]', video);
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (source?.dataset.src) { source.src = source.dataset.src; delete source.dataset.src; video.load(); }
      video.play().catch(() => {});
    } else video.pause();
  }, { rootMargin: '150px 0px' }).observe(video);
}

// Aftermovie: starts once the section is reached, plays silently once and holds on the fireworks "72".
function setupAftermovie() {
  const video = $('.aftermovie-video');
  if (!video) return;
  if (reducedMotion.matches || !('IntersectionObserver' in window)) { video.poster = video.dataset.endPoster; return; }
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (video.dataset.src) {
        video.src = matchMedia('(max-width: 800px)').matches ? video.dataset.srcSmall : video.dataset.src;
        delete video.dataset.src;
      }
      if (!video.ended) video.play().catch(() => {});
    } else video.pause();
  }, { threshold: .5 }).observe(video);
}

/* ---------- Lightbox: 1:1 drag, flick to change, pull down to close ---------- */
function setupLightbox() {
  const dialog = $('.lightbox');
  const img = $('.lightbox-img');
  const count = $('.lightbox-count');
  const track = $('.lightbox-track');
  const photos = JSON.parse($('#gallery-data').textContent);
  let index = 0;
  let opener = null;

  const show = (next, direction = 0) => {
    index = (next + photos.length) % photos.length;
    img.src = photos[index].src;
    img.alt = photos[index].alt;
    count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
    if (direction && !reducedMotion.matches) {
      img.animate([{ transform: `translateX(${direction * 60}px)`, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 380, easing: 'cubic-bezier(.23,1,.32,1)' });
    }
  };
  const close = () => { dialog.close(); };
  dialog.addEventListener('close', () => { lenis?.start(); opener?.focus(); });

  $$('.stack-open').forEach(button => button.addEventListener('click', () => {
    opener = button;
    show(Number(button.dataset.index));
    lenis?.stop();
    dialog.showModal();
  }));
  $('.lightbox-close').addEventListener('click', close);
  $('.lightbox-prev').addEventListener('click', () => show(index - 1, -1));
  $('.lightbox-next').addEventListener('click', () => show(index + 1, 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') show(index - 1, -1);
    if (event.key === 'ArrowRight') show(index + 1, 1);
  });

  let drag = null;
  track.addEventListener('pointerdown', event => {
    if (drag) return; // ignore a second finger
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, t: performance.now(), dx: 0, dy: 0 };
    track.setPointerCapture(event.pointerId);
    img.getAnimations().forEach(animation => animation.cancel());
  });
  track.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    drag.dx = event.clientX - drag.x;
    drag.dy = Math.max(0, event.clientY - drag.y);
    const vertical = drag.dy > Math.abs(drag.dx);
    img.style.transform = vertical ? `translateY(${drag.dy}px) scale(${1 - Math.min(drag.dy / 1600, .12)})` : `translateX(${drag.dx}px)`;
    dialog.style.backgroundColor = vertical ? `rgba(5,7,11,${1 - Math.min(drag.dy / 700, .5)})` : '';
  });
  const release = event => {
    if (!drag || event.pointerId !== drag.id) return;
    const elapsed = Math.max(performance.now() - drag.t, 1);
    const vx = drag.dx / elapsed;
    const vy = drag.dy / elapsed;
    const from = img.style.transform || 'none';
    img.style.transform = '';
    dialog.style.backgroundColor = '';
    if (drag.dy > Math.abs(drag.dx) && (drag.dy > 140 || vy > .5)) close();
    else if (Math.abs(drag.dx) > 90 || Math.abs(vx) > .45) show(index + (drag.dx < 0 ? 1 : -1), drag.dx < 0 ? 1 : -1);
    else if (Math.abs(drag.dx) + drag.dy < 6 && event.target === track) close();
    else img.animate([{ transform: from }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.32,.72,0,1)' });
    drag = null;
  };
  track.addEventListener('pointerup', release);
  track.addEventListener('pointercancel', release);
}
