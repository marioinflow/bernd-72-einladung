const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const hasGsap = () => typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
let lenis = null;

/* ---------- Access gate ---------- */
// Static gate only: keeps the invitation out of casual view, it is not authentication.
$('#access-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const input = $('#access-code');
  const error = $('#access-error');
  if (input.value !== 'Bernd72!') {
    error.textContent = 'Der Code stimmt noch nicht. Bitte prüft eure WhatsApp-Nachricht.';
    input.setAttribute('aria-invalid', 'true');
    input.focus();
    return;
  }
  input.value = '';
  openIntro();
});
$('#access-code')?.addEventListener('input', event => {
  event.target.removeAttribute('aria-invalid');
  $('#access-error').textContent = '';
});

/* ---------- Intro: photos gather into 72, portrait and type take over ---------- */
const introTargets = [
  [-.42, -.28], [-.34, -.28], [-.26, -.28], [-.18, -.28], [-.10, -.28],
  [-.12, -.15], [-.16, 0], [-.20, .15], [-.24, .30], [-.28, .43],
  [.08, -.20], [.14, -.28], [.24, -.31], [.34, -.27], [.39, -.17],
  [.40, -.05], [.35, .05], [.28, .14], [.20, .23], [.12, .32],
  [.08, .42], [.18, .42], [.30, .42], [.41, .42]
];

function splitChars(element) {
  const gold = element.classList.contains('gold-text');
  element.classList.remove('gold-text');
  element.innerHTML = [...element.textContent].map(char => `<span class="char${gold ? ' gold-text' : ''}">${char}</span>`).join('');
  return $$('.char', element);
}

function openIntro() {
  const intro = $('.intro');
  const content = $('#invitation-content');
  const skip = $('.intro-skip');
  $('.access-gate').hidden = true;
  document.body.classList.remove('is-locked');
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
    window.scrollTo(0, 0);
    startPage();
    const heading = $('#hero-heading');
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  };
  const onKey = event => { if (event.key === 'Escape') finish(); };

  content.hidden = false;
  if (reducedMotion.matches || !hasGsap()) { finish(); return; }

  content.inert = true;
  document.body.classList.add('intro-playing');
  intro.hidden = false;
  skip.addEventListener('click', finish, { once: true });
  document.addEventListener('keydown', onKey);
  skip.focus({ preventScroll: true });

  const { gsap } = window;
  const w = innerWidth;
  const h = innerHeight;
  const mobile = w < 700;
  const spread = Math.min(w, h) * (mobile ? .82 : .7);
  const tileSize = Math.round(spread * .088);
  const tiles = $$('.intro-tile', intro);
  tiles.forEach(tile => tile.style.setProperty('--tile', `${tileSize}px`));
  const name = splitChars($('.intro-name', intro));
  const wird = splitChars($('.intro-wird', intro));
  const seventyTwo = splitChars($('.intro-72', intro));

  timeline = gsap.timeline({ onComplete: finish });
  // Act 1: photos float in one by one, large enough to recognise faces.
  timeline.fromTo(tiles, {
    x: i => Math.cos(i * 2.4) * w * (.28 + (i % 4) * .05),
    y: i => Math.sin(i * 2.4) * h * (.26 + (i % 3) * .05),
    rotation: i => ((i % 7) - 3) * 4,
    scale: 2.8, opacity: 0, filter: 'blur(12px)'
  }, {
    scale: 2.2, opacity: 1, filter: 'blur(0px)',
    duration: 1.3, ease: 'power2.out', stagger: .09
  }, .2);
  // Act 2: they settle calmly into the 72.
  timeline.to(tiles, {
    x: i => introTargets[i][0] * spread,
    y: i => introTargets[i][1] * spread,
    rotation: 0, scale: 1,
    duration: 2.2, ease: 'power3.inOut', stagger: { each: .025, from: 'random' }
  }, 3.3);
  // Act 3: the 72 dissolves, Bernd's portrait comes up bright.
  timeline.to(tiles, { opacity: 0, scale: .7, filter: 'blur(6px)', duration: 1.1, ease: 'power2.in', stagger: { each: .015, from: 'center' } }, 6.7);
  timeline.fromTo('.intro-portrait', { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1, duration: 3, ease: 'power2.out' }, 6.9);
  // Act 4: real type, letter by letter.
  timeline.fromTo('.intro-eyebrow', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .9, ease: 'power3.out' }, 8.1);
  timeline.fromTo(name, { opacity: 0, yPercent: 40, filter: 'blur(10px)' }, { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 1.2, ease: 'expo.out', stagger: .08 }, 8.4);
  timeline.fromTo(wird, { opacity: 0, yPercent: 40, filter: 'blur(8px)' }, { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 1, ease: 'expo.out', stagger: .06 }, 9.1);
  timeline.fromTo(seventyTwo, { opacity: 0, scale: .86, filter: 'blur(12px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.4, ease: 'expo.out', stagger: .12 }, 9.4);
  timeline.fromTo('.intro-date', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 10.2);
  // Hold, then hand over to the invitation.
  timeline.to(intro, { opacity: 0, duration: 1.1, ease: 'power2.inOut' }, 12.1);
}

/* ---------- Page ---------- */
function startPage() {
  setupVideo();
  setupBand();
  setupLightbox();
  setupHeader();
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
    if (img && !img.closest('.parallax')) tl.fromTo(img, { scale: 1.2 }, { scale: 1, duration: 1.9, ease: 'expo.out' }, .15);
  });

  $$('.parallax').forEach(layer => {
    gsap.fromTo(layer, { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: layer.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // Hero entrance: words glide in from the sides, the family rises between them.
  const heroIn = gsap.timeline({ defaults: { ease: 'expo.out' } });
  heroIn.fromTo('.hero-bg img', { scale: 1.16, opacity: 0 }, { scale: 1.06, opacity: 1, duration: 2.4, ease: 'power2.out' }, 0)
    .fromTo('.hero-side-left', { xPercent: -18, opacity: 0, filter: 'blur(10px)' }, { xPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 1.6 }, .2)
    .fromTo('.hero-side-right', { xPercent: 18, opacity: 0, filter: 'blur(10px)' }, { xPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 1.6 }, .2)
    .fromTo('.hero-family', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.8 }, .45)
    .fromTo('.hero-bottom > *', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: .12 }, 1);
  // On scroll the words drift apart and the family comes a touch closer.
  const heroOut = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('.hero-side-left > *', { xPercent: -14, ease: 'none', scrollTrigger: heroOut });
  gsap.to('.hero-side-right > *', { xPercent: 14, ease: 'none', scrollTrigger: heroOut });
  gsap.to('.hero-family', { scale: 1.06, yPercent: 6, ease: 'none', transformOrigin: '50% 100%', scrollTrigger: heroOut });
  gsap.to('.hero-bg img', { yPercent: 8, ease: 'none', scrollTrigger: heroOut });

  // Banner grows from an inset card to full bleed.
  gsap.fromTo('.banner-frame', { clipPath: 'inset(0% 5% 0% 5% round 28px)' }, {
    clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
    scrollTrigger: { trigger: '.banner', start: 'top 85%', end: 'top 15%', scrub: .6 }
  });
  gsap.fromTo('.banner-frame img', { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.banner', start: 'top bottom', end: 'bottom top', scrub: true } });

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
      gsap.fromTo(words, { opacity: .18 }, { opacity: 1, ease: 'none', duration: .3, stagger: .7, scrollTrigger: { trigger: '.together-copy', start: 'top 80%', end: 'bottom 45%', scrub: .8 } });
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

  // Big numbers rise out of a mask.
  gsap.fromTo('.mask > span', { yPercent: 105 }, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: .14, scrollTrigger: { trigger: '.facts', start: 'top 80%', once: true } });
  gsap.fromTo('.details-heading', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.1, ease, scrollTrigger: { trigger: '.details-heading', start: 'top 85%', once: true } });

  addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  reducedMotion.addEventListener('change', event => { if (event.matches) location.reload(); });
}

function setupHeader() {
  const header = $('.site-header');
  const sync = () => header.classList.toggle('is-scrolled', scrollY > 40);
  addEventListener('scroll', sync, { passive: true });
  sync();
}

function setupVideo() {
  const video = $('#venue-video');
  const play = $('.film-play');
  if (!video || !play) return;
  // Starts muted and only on request; native controls then allow sound.
  play.addEventListener('click', async () => {
    play.hidden = true;
    video.controls = true;
    try { await video.play(); } catch { /* controls stay usable */ }
    video.focus();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); });
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
