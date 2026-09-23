// Vogel phyllotaxis bloom around the Sayuko logo.
// Mechanics after 21st.dev "Phyllotaxis Bloom" (daiv09, MIT): the spiral turns slowly,
// the pointer grows it (x = density, y = spacing), a click sends a pulse that fades out.
// Touch devices have no hover, so there scroll position drives the same two values.
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const LOGO_SEEDS = 72;

class LogoBloom extends HTMLElement {
  connectedCallback() {
    if (!this.canvas) this.initialize();
    this.events = new AbortController();
    const options = { signal: this.events.signal, passive: true };
    this.reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
    this.finePointer = matchMedia('(hover: hover) and (pointer: fine)');

    this.image.addEventListener('load', () => this.draw(0), options);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this);
    this.visibilityObserver = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      this.sync();
    }, { rootMargin: '80px 0px' });
    this.visibilityObserver.observe(this);

    this.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse') return;
      const box = this.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width;
      const y = (event.clientY - box.top) / box.height;
      this.pointer.vx = x - this.pointer.tx;
      this.pointer.tx = x;
      this.pointer.ty = y;
    }, options);
    this.addEventListener('pointerleave', () => { this.pointer.tx = .5; this.pointer.ty = .5; }, options);
    this.addEventListener('click', () => this.pulse(), options);
    this.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      this.pulse();
    }, { signal: this.events.signal });
    window.addEventListener('scroll', () => this.followScroll(), options);
    this.reduceMotion.addEventListener('change', () => this.sync(), options);
    document.addEventListener('visibilitychange', () => this.sync(), options);
    this.resize();
  }

  initialize() {
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('aria-hidden', 'true');
    this.append(this.canvas);
    this.setAttribute('role', 'button');
    this.setAttribute('tabindex', '0');
    this.setAttribute('aria-label', this.getAttribute('label') || 'Blüte neu aussäen');
    this.image = new Image();
    this.image.decoding = 'async';
    this.image.src = this.getAttribute('src') || '';
    this.pointer = { x: .5, y: .5, tx: .5, ty: .5, vx: 0 };
    this.burst = 0;
    this.seed = 0;
    this.time = 0;
    this.ratio = 1;
    this.frame = 0;
    this.visible = false;
  }

  disconnectedCallback() {
    this.resizeObserver?.disconnect();
    this.visibilityObserver?.disconnect();
    this.events?.abort();
    cancelAnimationFrame(this.frame);
    this.frame = 0;
  }

  get running() {
    return this.isConnected && this.visible && !document.hidden && !this.reduceMotion.matches;
  }

  sync() {
    if (!this.running) {
      cancelAnimationFrame(this.frame);
      this.frame = 0;
      this.draw(0);
      return;
    }
    if (this.frame) return;
    let last = performance.now();
    const tick = now => {
      if (!this.running) { this.frame = 0; return; }
      const dt = Math.min((now - last) / 1000, .1);
      last = now;
      this.draw(dt);
      this.frame = requestAnimationFrame(tick);
    };
    this.frame = requestAnimationFrame(tick);
  }

  followScroll() {
    if (this.finePointer.matches || !this.visible) return;
    const box = this.getBoundingClientRect();
    const progress = Math.min(Math.max((innerHeight - box.top) / (innerHeight + box.height), 0), 1);
    this.pointer.tx = .25 + progress * .5;
    this.pointer.ty = .2 + progress * .6;
  }

  pulse() {
    this.burst = 1.2;
    this.seed += GOLDEN_ANGLE * (.6 + Math.random() * .8);
    if (!this.running) this.draw(0);
  }

  resize() {
    const box = this.getBoundingClientRect();
    this.ratio = Math.min(devicePixelRatio || 1, 2);
    this.width = box.width;
    this.height = box.height;
    this.canvas.width = Math.max(1, Math.round(box.width * this.ratio));
    this.canvas.height = Math.max(1, Math.round(box.height * this.ratio));
    this.canvas.style.width = `${box.width}px`;
    this.canvas.style.height = `${box.height}px`;
    this.draw(0);
  }

  draw(dt) {
    if (!this.canvas?.width || !this.width) return;
    const context = this.canvas.getContext('2d');
    const { width, height, pointer } = this;
    this.time += dt;
    this.burst *= Math.pow(.05, dt);
    const follow = 1 - Math.pow(.1, dt);
    pointer.x += (pointer.tx - pointer.x) * follow;
    pointer.y += (pointer.ty - pointer.y) * follow;
    pointer.vx *= Math.pow(.2, dt);

    context.setTransform(this.ratio, 0, 0, this.ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height * .52;
    const unit = Math.min(width, height) / (width < 600 ? 640 : 900);
    const count = Math.floor(300 + pointer.x * 420);
    const spacing = (10 + pointer.y * 8) * unit * (1 + this.burst * .4);
    const turn = this.time * .12 + pointer.x * .8 + pointer.vx * 5 + this.seed;
    const logoReady = this.image.complete && this.image.naturalWidth > 0;

    for (let index = count - 1; index >= 0; index -= 1) {
      const angle = index * GOLDEN_ANGLE + turn;
      const distance = spacing * Math.sqrt(index);
      const x = cx + Math.cos(angle) * distance;
      const y = cy + Math.sin(angle) * distance * .92;
      if (x < -30 || x > width + 30 || y < -30 || y > height + 30) continue;
      const depth = index / count;
      const shimmer = Math.sin(this.time * .8 + index * .02);

      if (index < LOGO_SEEDS && logoReady) {
        const size = (26 - depth * 70) * unit * 2.2 * (1 + this.burst * .35);
        if (size <= 2) continue;
        context.save();
        context.translate(x, y);
        context.rotate(angle + Math.PI / 2);
        context.globalAlpha = .9;
        context.drawImage(this.image, -size * .42, -size * .5, size * .84, size);
        context.restore();
        continue;
      }
      // Coral from the logo at the heart, champagne gold towards the rim.
      const hue = (352 + depth * 50 + shimmer * 7 + this.burst * 18) % 360;
      const radius = Math.max(.5, (1 + (1 - depth) * 3.2 + this.burst * 1.6) * unit * 1.6);
      context.globalAlpha = .35 + (1 - depth) * .6;
      context.fillStyle = `hsl(${hue.toFixed(1)}, ${62 - depth * 14}%, ${56 + (1 - depth) * 14}%)`;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }
    context.globalAlpha = 1;
  }
}

if (!customElements.get('logo-bloom')) customElements.define('logo-bloom', LogoBloom);
