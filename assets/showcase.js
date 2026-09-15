'use strict';
(() => {
  const dialog = document.createElement('dialog');
  dialog.className = 'app-showcase';
  dialog.setAttribute('aria-labelledby', 'app-story-title');
  dialog.innerHTML = `<button class="showcase-close" aria-label="关闭产品介绍">×</button>
  <div class="showcase-layout">
    <div class="phone-preview" role="img" aria-label="MOTO NAV 手机应用示意：连接设备，在地图上规划到悉尼歌剧院的路线">
      <div class="phone-status"><b>03:17</b><span>▴ ▰ ▰</span></div>
      <div class="phone-title">MOTO NAV <span>➤</span></div>
      <div class="phone-connect"><i></i><div>Ready to go<small>Connect device</small></div><svg class="bluetooth-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7L17 17L12 22V2L17 7L7 17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <svg class="phone-map" viewBox="0 0 340 345" aria-hidden="true">
        <defs><pattern id="map-grid" width="17" height="19" patternUnits="userSpaceOnUse" patternTransform="rotate(-17)"><rect width="17" height="19" fill="#eeeee5"/><path d="M0 0H17V19H0Z M8 0V19" fill="none" stroke="#d1d1c9" stroke-width="1"/></pattern></defs>
        <rect width="340" height="345" fill="url(#map-grid)"/>
        <path d="M0 22L58 9L97 56L141 27L185 44L190 0H340V80L291 103L266 78L239 136L207 126L190 85L160 97L115 77L73 104L38 66L0 99Z" fill="#91d7e7"/>
        <path d="M10 200L39 190L62 219L43 241L15 231ZM166 137L181 109L207 135L197 160ZM266 237L293 225L309 279L281 287ZM65 48L85 66L67 79L47 62ZM6 282L39 266L49 306L13 322Z" fill="#b2d992"/>
        <g fill="none" stroke="#a4a8aa" stroke-width="8"><path d="M-20 148Q44 123 78 156T173 148T287 93L304 -10"/><path d="M89 -10Q83 61 153 85T213 186T183 359"/><path d="M-20 207L70 205L169 186L268 174L360 202"/><path d="M304 79Q282 131 313 178T303 346"/></g>
        <g fill="none" stroke="#d9dcdd" stroke-width="4"><path d="M-20 148Q44 123 78 156T173 148T287 93L304 -10"/><path d="M89 -10Q83 61 153 85T213 186T183 359"/><path d="M-20 207L70 205L169 186L268 174L360 202"/></g>
        <path class="demo-route" d="M32 296L61 266L65 226L91 218L99 185L152 178L210 141L203 129L234 108L259 107L262 83L276 85L285 41" fill="none" stroke="#ff9100" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>
        <g font-family="system-ui" fill="#444" font-weight="600"><text x="27" y="27" font-size="15">Drummoyne</text><text x="117" y="95" font-size="16">Rozelle</text><text x="200" y="137" font-size="33">Sydney</text><text x="24" y="288" font-size="18">Marrickville</text><text x="157" y="224" font-size="12" fill="#a86594">EORA NATION</text><text x="229" y="55" font-size="10">Opera House</text></g>
        <circle cx="32" cy="296" r="10" fill="#008cff" stroke="white" stroke-width="4"/><g class="demo-pin"><path d="M285 47Q266 27 285 21Q304 27 285 47" fill="#ff5361"/><circle cx="285" cy="29" r="4" fill="white"/></g>
        <circle class="tap-ring" cx="135" cy="110" r="10" fill="none" stroke="#ff721f" stroke-width="3"/>
        <g class="demo-hand" aria-hidden="true"><path d="M0 0C-5 -2 -8 2 -8 7V38L-16 30C-23 25 -29 32 -24 39L-8 60Q-2 67 10 67H23Q34 64 34 50V31Q32 24 26 27Q24 18 17 23Q14 14 8 20V7Q7 0 0 0Z" fill="#fff5ea" stroke="#242628" stroke-width="2.5" stroke-linejoin="round"/></g>
      </svg>
      <div class="phone-destination"><b>Destination</b><div class="destination-field"><span>⌕</span><div>Sydney Opera House<small>Bennelong Point</small></div><span>›</span></div><div class="connect-hint">➤　Connect navigation screen first</div></div>
      <div class="phone-home"></div>
    </div>
    <article class="app-story"><h2 id="app-story-title">下一程，<br>从这里开始。</h2><p class="story-lead">在手机上选好目的地，把沿途的方向交给 MOTOR NAV。</p><div class="story-features"><section><span>01</span><div><h3>规划你的下一站</h3><p>搜索目的地，在地图上查看路线，让每次出发都有方向。</p></div></section><section><span>02</span><div><h3>连接，即刻准备出发</h3><p>将手机与导航器连接，让路线规划与车把上的指引衔接起来。</p></div></section><section><span>03</span><div><h3>把注意力留给前方</h3><p>用清晰的转向与距离提示，陪你走过城市街角和下一段旅程。</p></div></section></div></article>
  </div><button class="showcase-next" type="button">继续 <span aria-hidden="true">↗</span></button>`;
  document.body.append(dialog);
  const next = dialog.querySelector('.showcase-next');
  const route = dialog.querySelector('.demo-route');
  const pin = dialog.querySelector('.demo-pin');
  const hand = dialog.querySelector('.demo-hand');
  const ring = dialog.querySelector('.tap-ring');
  const storyPanel = dialog.querySelector('.app-story');
  const originalStory = storyPanel.innerHTML;
  const originalRoute = route.getAttribute('d');
  const destination = dialog.querySelector('.destination-field > div');
  const originalDestination = destination.innerHTML;
  let demo;
  let animation;
  let previousOverflow;
  window.openMotorNav = () => {
    if (dialog.open) return;
    previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    const phone = dialog.querySelector('.phone-preview');
    const story = dialog.querySelector('.app-story');
    const mobile = matchMedia('(max-width:700px)').matches;
    const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
    animation?.kill();
    demo?.kill();
    storyPanel.innerHTML = originalStory;
    destination.innerHTML = originalDestination;
    route.setAttribute('d', originalRoute);
    next.disabled = false;
    gsap.set(next, {autoAlpha:0, y:30});
    gsap.set([hand,ring], {autoAlpha:0});
    gsap.set(pin, {x:0,y:0});
    animation = gsap.timeline();
    animation.fromTo(phone, { x: mobile ? 45 : innerWidth*.42, y: 24, autoAlpha: 0 }, { x: mobile ? 20 : innerWidth*.34, y: 0, autoAlpha: 1, duration: reduced ? 0 : .55, ease:'power2.out' })
      .to(phone, { x:0, duration:reduced ? 0 : .95, ease:'power3.inOut' }, reduced ? 0 : '+=.15')
      .fromTo(story, { y:20, autoAlpha:0 }, { y:0, autoAlpha:1, duration:reduced ? 0 : .6, ease:'power2.out' }, reduced ? 0 : '-=.35')
      .to(next, {autoAlpha:1,y:0,duration:reduced ? 0 : .4,ease:'power2.out'}, '+=0.5');
  };
  next.addEventListener('click', () => {
    if(next.disabled) return;
    next.disabled = true;
    const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
    if(matchMedia('(max-width:700px)').matches) dialog.scrollTo({top:0,behavior:'instant'});
    demo = gsap.timeline();
    demo.to(next,{autoAlpha:0,y:15,duration:reduced ? 0 : .2})
      .fromTo(hand,{x:195,y:175,autoAlpha:0},{x:135,y:110,autoAlpha:1,duration:reduced ? 0 : .65,ease:'power2.out'},0)
      .call(() => {
        route.setAttribute('d','M32 296L61 266L65 226L91 218L99 185L115 174L114 143L135 132L135 110');
        gsap.set(pin,{x:-150,y:69});
        destination.innerHTML = 'Rozelle<small>Selected on map</small>';
        storyPanel.innerHTML = '<h2 id="app-story-title">点哪，<br>就去哪。</h2><p class="story-lead">想换个目的地？在地图上轻点一下，新的路线即刻呈现。</p><div class="story-features"><section><span>01</span><div><h3>地图上的一点，就是下一站</h3><p>不必重新输入地址，直接选择你想去的位置。</p></div></section><section><span>02</span><div><h3>改变主意，路线跟着改变</h3><p>重新规划前往新目的地的路线，让临时起意也能成为旅程的一部分。</p></div></section></div>';
      })
      .fromTo(ring,{autoAlpha:1,scale:.5,svgOrigin:'135 110'},{autoAlpha:0,scale:2.4,duration:reduced ? 0 : .45})
      .to(hand,{autoAlpha:0,x:150,y:135,duration:reduced ? 0 : .35},'>-.15');
  });
  dialog.querySelector('.showcase-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{animation?.kill();demo?.kill();document.body.style.overflow=previousOverflow;document.querySelector('.learn-product')?.focus({preventScroll:true});});
})();
