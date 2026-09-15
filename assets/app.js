'use strict';

(async function initWorkbench() {
  const stage = document.querySelector('.workbench');
  const product = stage.querySelector('.product-layer');
  const photo = stage.querySelector('.product-photo');
  const front = stage.querySelector('.product-front');
  const desk = stage.querySelector('.desk-layer');
  const repair = stage.querySelector('.desk-repair');
  const plane = stage.querySelector('.scene-plane');
  const untraveled = stage.querySelector('.dial-untraveled');
  const outside = stage.querySelector('.outside-trail');
  const flight = stage.querySelector('.flight-mark');
  const arrow = stage.querySelector('.flying-arrow');
  const bird = stage.querySelector('.bird-parts');
  const trail = stage.querySelector('.dial-trail');
  const button = stage.querySelector('.learn-product');
  window.buildMotorNav(front);
  const dialCursor = stage.querySelector('.dial-cursor');
  if (!window.gsap || !window.ScrollTrigger || !window.MotionPathPlugin || !window.MorphSVGPlugin) return;

  // The original photograph renders immediately. Enhance only after both plates decode.
  try {
    await Promise.all([...stage.querySelectorAll('img')].map(image => image.decode()));
  } catch {
    return;
  }
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger, window.MotionPathPlugin, window.MorphSVGPlugin);
  const media = gsap.matchMedia();

  media.add({
    desktop: '(min-width: 701px)',
    mobile: '(max-width: 700px)',
    reduced: '(prefers-reduced-motion: reduce)'
  }, context => {
    if (context.conditions.reduced || navigator.connection?.saveData) return;
    stage.classList.add('is-ready');
    const progress = { inside: 0, outside: 0, morph: 0, fade: 0 };
    const length = trail.getTotalLength();
    const startDistance = 60;
    let geometry;
    function prepareFlight() {
      const w = stage.clientWidth, h = stage.clientHeight;
      const base = plane.clientWidth * .232;
      front.style.setProperty('--depth', `${base*.26}px`);
      front.style.setProperty('--radius', `${base*.488}px`);
      front.style.setProperty('--facet-width', `${base*.488*2*Math.PI/120+.4}px`);
      front.style.transformOrigin = `50% 50% ${-base*.13}px`;
      const settled = Math.min(w * (context.conditions.mobile ? .56 : .68), h * .60, 650);
      const logoSize = context.conditions.mobile ? 88 : 160;
      const x = w / 2 + settled * (539 / 1100 - .5);
      const y = h / 2 + settled * (163 / 1100 - .5);
      const endX = 20 + logoSize / 2, endY = 16 + logoSize / 2;
      outside.setAttribute('d', `M${x} ${y} C${x-settled*.06} ${y-settled*.06*74/38} ${endX} ${endY+100} ${endX} ${endY}`);
      const outsideLength = outside.getTotalLength();
      geometry = { w, h, settled, logoSize, outsideLength, baseSize: plane.clientWidth * .232 };
      untraveled.style.strokeDasharray = `${length} ${length}`;
      outside.style.strokeDasharray = `${outsideLength} ${outsideLength}`;
      outside.style.strokeWidth = settled * 34 / 1100;
    }
    function sample(path, distance, total) {
      const point = path.getPointAtLength(distance);
      const before = path.getPointAtLength(Math.max(0, distance - .1));
      const after = path.getPointAtLength(Math.min(total, distance + .1));
      return { x: point.x, y: point.y, rotation: Math.atan2(after.y-before.y, after.x-before.x)*180/Math.PI+90 };
    }
    function renderRoute() {
      const time = motion.time();
      const departed = time >= .88;
      const escaped = time >= 1.405;
      const distance = startDistance + progress.inside * (length-startDistance);
      untraveled.style.strokeDashoffset = -distance;
      outside.style.strokeDashoffset = geometry.outsideLength * (1-progress.outside);
      outside.style.opacity = escaped ? 1-progress.fade : 0;
      // Inside the dial, fading the traveled state restores the white road.
      // Only the trail outside the device disappears into the background.
      trail.style.stroke = gsap.utils.interpolate('#777b80', '#ffffff', progress.fade);
      gsap.set(dialCursor, { autoAlpha: departed ? 0 : 1 });
      if (!departed) { gsap.set(flight, { autoAlpha: 0 }); return; }
      const size = geometry.baseSize * gsap.getProperty(product, 'scale');
      let point = sample(trail, distance, length);
      point.x = geometry.w/2 + (point.x-550)*size/1100;
      point.y = geometry.h/2 + (point.y-550)*size/1100;
      if (escaped) point = sample(outside, progress.outside*geometry.outsideLength, geometry.outsideLength);
      // The SVG arrow is centered at (627,627), exactly the flight element's pivot.
      const scale = (escaped ? geometry.settled : size) / 1100 * 1254 / (120*8);
      gsap.set(flight, {
        autoAlpha: 1, x: point.x, y: point.y,
        rotation: point.rotation*(1-progress.morph),
        scale: scale+(geometry.logoSize/120-scale)*progress.morph
      });
    }
    prepareFlight();
    gsap.set(flight, { xPercent: -50, yPercent: -50 });
    const motion = gsap.timeline({
      defaults: { ease: 'none' },
      onUpdate: renderRoute,
      scrollTrigger: {
        id: 'workbench-lift',
        trigger: stage,
        start: 'top top',
        end: () => `+=${stage.clientHeight * 9.8}`,
        pin: true,
        scrub: 0.65,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefreshInit: prepareFlight,
        onUpdate: self => {
          if (self.isActive) {
            product.style.willChange = 'transform';
            desk.style.willChange = 'opacity';
          }
        },
        onScrubComplete: () => {
          product.style.removeProperty('will-change');
          desk.style.removeProperty('will-change');
        }
      }
    });
    motion.addLabel('on-desk', 0)
      .to(stage.querySelector('.cover-wordmark'), { autoAlpha: 0, y: -10, duration: .09, ease: 'power1.out' }, 0)
      .set(front, { rotation: 6, scaleY: .97 }, 0)
      // Erase the original device before the isolated layer leaves its position.
      .to(repair, { opacity: 1, duration: 0.09 }, 0)
      .addLabel('lift', 0.09)
      .to(product, {
        x: () => -plane.clientWidth * 0.005,
        y: () => -stage.clientHeight * (context.conditions.mobile ? 0.15 : 0.18),
        scale: 1.15,
        duration: 0.31,
        ease: 'sine.inOut'
      }, 'lift')
      .addLabel('front-view', 0.28)
      .to(front, { autoAlpha: 1, duration: 0.12, ease: 'sine.inOut' }, 'front-view')
      // Finish the image handoff before the large closeup; then gently straighten.
      .to(front, { rotation: 0, scaleY: 1, duration: .28, ease: 'sine.inOut' }, .40)
      // Keep the underlying product opaque until the new face covers it.
      .set(photo, { autoAlpha: 0 }, 0.40)
      .to(desk, { autoAlpha: 0, duration: 0.49, ease: 'power1.inOut' }, 0.09)
      .to(product, {
        x: () => -plane.clientWidth * 0.005,
        y: () => -plane.clientHeight * 0.045,
        scale: () => Math.min(stage.clientWidth * (context.conditions.mobile ? .66 : .82), stage.clientHeight * 0.78, 850) / (plane.clientWidth * 0.232),
        duration: 0.28,
        ease: 'sine.inOut'
      }, 0.40)
      .addLabel('center-closeup', 0.68)
      .to({}, { duration: 0.20 }, 'center-closeup')
      .addLabel('settle', 0.88)
      .to(product, {
        scale: () => Math.min(stage.clientWidth * (context.conditions.mobile ? .56 : .68), stage.clientHeight * 0.60, 650) / (plane.clientWidth * 0.232),
        duration: 0.24,
        ease: 'sine.inOut'
      }, 'settle')
      .addLabel('cursor-departure', 0.88)
      .to(progress, { inside: 1, duration: .525 }, 'cursor-departure')
      .to(progress, { outside: 1, duration: .31 }, 1.405)
      .addLabel('logo-arrival', 1.715)
      .to(progress, { morph: 1, duration: .26, ease: 'power2.inOut' }, 'logo-arrival')
      .to(arrow, {
        morphSVG: 'M411 684L679 605L485 833L512 712Z',
        fill: '#ff721f', strokeWidth: 0, duration: 0.26, ease: 'power2.inOut'
      }, 'logo-arrival')
      .fromTo(bird, { autoAlpha: 0, scale: 0.65, svgOrigin: '600 650' }, {
        autoAlpha: 1, scale: 1, duration: 0.28, ease: 'power2.out'
      }, 1.78)
      .addLabel('logo-complete', 2.06)
      .to({}, { duration: 0.14 })
      .addLabel('product-layout', 2.2)
      .to(progress, { fade: 1, duration: .4, ease: 'sine.inOut' }, 'product-layout')
      .to(product, {
        x: () => -plane.clientWidth*.005 - (context.conditions.mobile ? 0 : stage.clientWidth*.22),
        y: () => -plane.clientHeight*.045 - (context.conditions.mobile ? stage.clientHeight*.08 : 0),
        scale: () => Math.min(stage.clientWidth*(context.conditions.mobile ? .58 : .43),stage.clientHeight*.60,650)/(plane.clientWidth*.232),
        duration: .55, ease: 'sine.inOut'
      }, 'product-layout')
      .to(button, { autoAlpha: 1, duration: .28 }, 2.48)
      .addLabel('product-turn', 2.85)
      .to(front, { rotationY: -180, duration: 1.6 }, 'product-turn')
      .addLabel('product-back', 4.45)
      .to({}, { duration: .25 });
    const explore = () => window.openMotorNav();
    button.addEventListener('click', explore);

    renderRoute();
    return () => {
      untraveled.style.removeProperty('stroke-dashoffset');
      outside.style.opacity = 0;
      button.removeEventListener('click', explore);
      trail.style.removeProperty('stroke');
      stage.classList.remove('is-ready');
      product.style.removeProperty('will-change');
      desk.style.removeProperty('will-change');
    };
  }, stage);
  ScrollTrigger.refresh();
  // Keep BFCache restores intact, release GSAP on actual page disposal.
  window.addEventListener('pagehide', event => {
    if (!event.persisted) media.revert();
  });
})();
