'use strict';
// Lightweight geometric shell: real CSS 3D surfaces, no model download or render loop.
window.buildMotorNav = function buildMotorNav(front) {
  const shell = document.createElement('div');
  shell.className = 'device-shell';
  shell.setAttribute('aria-hidden', 'true');
  const count = 120;
  for (let i = 0; i < count; i++) {
    const facet = document.createElement('i');
    facet.className = 'metal-facet';
    const angle = i * 360 / count;
    const light = Math.round(70 + 100 * Math.pow(Math.abs(Math.cos((angle-35)*Math.PI/180)), 8));
    facet.style.setProperty('--angle', `${angle}deg`);
    facet.style.setProperty('--metal', `${light},${light+2},${light+4}`);
    const shade = a => { const v = Math.round(64+112*Math.pow(Math.abs(Math.cos((a-35)*Math.PI/180)),8)); return `rgb(${v},${v+2},${v+4})`; };
    facet.style.setProperty('--shade-start', shade(angle-1.5));
    facet.style.setProperty('--shade-end', shade(angle+1.5));
    shell.append(facet);
  }
  const back = document.createElement('div');
  back.className = 'device-back';
  const slots = Array.from({length:12},(_,i)=>`<path d="M-93 -456 Q0 -475 93 -456" transform="rotate(${i*30})" fill="none" stroke="#08090a" stroke-width="13" stroke-linecap="round"/>`).join('');
  const screws = [45,135,225,315].map(a=>`<g transform="rotate(${a}) translate(0 -353)"><circle r="11" fill="#090a0b"/><path d="M-5 0H5M0 -5V5" stroke="#454749" stroke-width="2"/></g>`).join('');
  back.innerHTML = `<svg viewBox="-550 -550 1100 1100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="back-metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e2e4e5"/><stop offset=".22" stop-color="#72777b"/><stop offset=".43" stop-color="#24292d"/><stop offset=".68" stop-color="#a6aaad"/><stop offset="1" stop-color="#45494c"/></linearGradient>
      <radialGradient id="back-case" cx=".35" cy=".24" r=".85"><stop stop-color="#424447"/><stop offset=".5" stop-color="#25272a"/><stop offset=".9" stop-color="#151719"/><stop offset="1" stop-color="#090a0b"/></radialGradient>
      <linearGradient id="mount-face" x2=".6" y2="1"><stop stop-color="#4b4d4e"/><stop offset=".45" stop-color="#292b2c"/><stop offset="1" stop-color="#17191a"/></linearGradient>
    </defs>
    <circle r="537" fill="url(#back-metal)"/><circle r="516" fill="#141719" stroke="#969a9c" stroke-width="3"/>
    <circle r="494" fill="url(#back-case)" stroke="#55585a" stroke-width="4"/>
    ${slots}<circle r="435" fill="url(#back-case)" stroke="#343638" stroke-width="4"/>
    <circle r="410" fill="none" stroke="#1b1d1f" stroke-width="3"/>
    <g fill="#b5a06b" stroke="#62583b" stroke-width="3"><circle cx="-115" cy="-363" r="19"/><circle cx="115" cy="363" r="19"/></g>
    ${screws}
    <text fill="#696c6f" font-family="system-ui,sans-serif" font-size="20" letter-spacing="9" text-anchor="middle" y="-349">MOTOR NAV</text>
    <path d="M-22 359a27 27 0 1 0 44 0M0 347v30" fill="none" stroke="#56595b" stroke-width="7" stroke-linecap="round"/>
    <circle r="241" fill="#0a0b0c" stroke="#101113" stroke-width="22"/>
    <circle cy="-9" r="225" fill="url(#mount-face)"/>
    <path d="M-87 -249Q0 -273 87 -249L88 -97L248 -86Q274 0 248 86L97 88L86 248Q0 274 -86 248L-88 97L-248 86Q-274 0 -248 -86L-97 -88Z" transform="translate(0 12)" fill="#08090a"/>
    <path d="M-87 -249Q0 -273 87 -249L88 -97L248 -86Q274 0 248 86L97 88L86 248Q0 274 -86 248L-88 97L-248 86Q-274 0 -248 -86L-97 -88Z" fill="url(#mount-face)" stroke="#424547" stroke-width="3"/>
    ${[0,90,180,270].map(a=>`<path transform="rotate(${a})" d="M-25 -220H25L12 -109H-12Z" fill="#090a0b" stroke="#303335" stroke-width="4"/>`).join('')}
    ${[-1,1].flatMap(x=>[-1,1].map(y=>`<circle cx="${x*56}" cy="${y*56}" r="7" fill="#090a0b"/>`)).join('')}
    <path d="M-13 -43L9 -50V-7L34 16V46L12 56L-14 32Z" fill="none" stroke="#111315" stroke-width="5"/>
  </svg>`;
  shell.append(back);
  // Extrude the quarter-turn mount, keeping actual thickness at a 90-degree view.
  const source = back.querySelector('svg');
  const mountStart = [...source.children].findIndex(node => node.tagName.toLowerCase() === 'circle' && node.getAttribute('r') === '241');
  const mountMarkup = [...source.children].slice(mountStart).map(node => node.outerHTML).join('');
  for (let i=1; i<=12; i++) {
    const mount = document.createElement('div');
    mount.className = 'raised-mount';
    mount.style.setProperty('--mount-step', i);
    mount.innerHTML = `<svg viewBox="-550 -550 1100 1100">${mountMarkup}</svg>`;
    shell.append(mount);
  }
  for (let i=0; i<72; i++) {
    const wall = document.createElement('i');
    wall.className = 'mount-wall';
    wall.style.setProperty('--angle', `${i*5}deg`);
    wall.style.background = `linear-gradient(to bottom,#46494b,#${i<36?'222527':'151719'})`;
    shell.append(wall);
  }
  front.append(shell);
};
