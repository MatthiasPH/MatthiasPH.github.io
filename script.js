/* Matthias Paterson-Hawes Portfolio — no dependencies. */
(() => {
  document.body.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menuButton = document.querySelector('.mobile-toggle');
  const mobileMenu = document.getElementById('mobile-navigation');
  if (menuButton && mobileMenu) {
    const closeMenu = () => { menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Open navigation'); mobileMenu.hidden = true; };
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      menuButton.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
      mobileMenu.hidden = expanded;
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 700) closeMenu(); });
  }
  const reveals = [...document.querySelectorAll('.reveal')];
  if (reduceMotion || !('IntersectionObserver' in window)) reveals.forEach(el => el.classList.add('in-view'));
  else {
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); io.unobserve(entry.target); }
    }), {threshold: .09, rootMargin: '0px 0px -5% 0px'});
    reveals.forEach(el => io.observe(el));
  }
  requestAnimationFrame(() => document.body.classList.add('is-ready'));

  // Page transitions for internal navigation. Works with file:// and GitHub Pages.
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (!/^((index|projects|about|experience)\.html)(#.*)?$/.test(href) || reduceMotion) return;
    a.addEventListener('click', e => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault(); document.body.classList.add('is-leaving');
      setTimeout(() => { location.href = href; }, 240);
    });
  });
  addEventListener('pageshow', () => document.body.classList.remove('is-leaving'));

  // Projects: smooth, demonstrable scroll-position-controlled crossfade.
  // On desktop all seven project panels occupy the SAME stage; no scrolling individual cards.
  const reel = document.querySelector('.projects-reel');
  const panels = [...document.querySelectorAll('.project-panel')];
  if (!reel || panels.length === 0) return;
  const mobile = window.matchMedia('(max-width:700px)');
  const current = document.getElementById('reel-current');
  const meter = document.getElementById('reel-meter-fill');
  let frame = null;
  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  function updateCrossfade() {
    frame = null;
    const small = mobile.matches;
    if (small) {
      panels.forEach(panel => {
        // On phones use gentle scroll fading without concealing any text permanently.
        if (reduceMotion) { panel.style.opacity = '1'; panel.style.transform = ''; return; }
        const rect = panel.getBoundingClientRect();
        const vh = window.innerHeight;
        const appearing = clamp((vh - rect.top)/(vh*.42), .18, 1);
        const leaving = clamp(rect.bottom/(vh*.45), .18, 1);
        panel.style.opacity = String(Math.min(appearing,leaving));
        panel.style.transform = `translateY(${Math.round((1-appearing)*22)}px)`;
        panel.style.visibility = 'visible';
        panel.style.pointerEvents = 'auto';
      });
      return;
    }
    const rect = reel.getBoundingClientRect();
    const available = Math.max(1, reel.offsetHeight - (window.innerHeight - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header'))));
    const distance = clamp(-rect.top, 0, available);
    const progress = distance / available;
    const position = progress * (panels.length - 1);
    panels.forEach((panel, i) => {
      // Adjacent panels sum to 100% opacity for a true crossfade.
      const opacity = clamp(1 - Math.abs(position-i), 0, 1);
      panel.style.opacity = opacity.toFixed(4);
      panel.style.visibility = opacity > .001 ? 'visible' : 'hidden';
      panel.classList.toggle('is-active', opacity > .001);
      panel.style.pointerEvents = opacity > .51 ? 'auto' : 'none';
      panel.setAttribute('aria-hidden', opacity < .51 ? 'true' : 'false');
    });
    if (current) current.textContent = String(Math.round(position) + 1).padStart(2,'0');
    if (meter) meter.style.width = `${Math.round(progress*100)}%`;
  }
  const scheduleUpdate = () => {if (!frame) frame = requestAnimationFrame(updateCrossfade);};
  addEventListener('scroll',scheduleUpdate,{passive:true});
  addEventListener('resize',scheduleUpdate);
  mobile.addEventListener('change',scheduleUpdate);
  updateCrossfade();

  // The fade preview visibly animates between the first and second panel.
  // Using native scrolling means this is exactly the same effect as manual scrolling.
  document.querySelector('.demo-fade')?.addEventListener('click', () => {
    if (mobile.matches) {panels[0]?.scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'start'});return;}
    const startY = reel.getBoundingClientRect().top + scrollY;
    const length = reel.offsetHeight - (innerHeight - 82);
    const from = startY;
    const to = startY + length/(panels.length-1);
    scrollTo({top:from,behavior:'instant'});
    if (reduceMotion) {scrollTo({top:to,behavior:'instant'});return;}
    const t0 = performance.now();
    const duration = 2300;
    function tick(now) {const t=clamp((now-t0)/duration,0,1);const eased=t*t*(3-2*t);scrollTo({top:from+(to-from)*eased,behavior:'instant'});if(t<1)requestAnimationFrame(tick);}
    requestAnimationFrame(tick);
  });
  // Follow direct links from the homepage's project list to a project position.
  if (location.hash && /^#project-0[1-7]$/.test(location.hash) && !mobile.matches) {
    const targetNumber=Number(location.hash.slice(-1))-1;
    const move=()=>{const start=reel.getBoundingClientRect().top+scrollY;const travel=reel.offsetHeight-(innerHeight-82);scrollTo({top:start+travel*targetNumber/(panels.length-1),behavior:'instant'});scheduleUpdate();};
    addEventListener('load',()=>setTimeout(move,80),{once:true});
  }
})();
