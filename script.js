/* Matthias Paterson-Hawes — portfolio interactions. No external JavaScript dependencies. */
(() => {
  'use strict';
  const menuButton = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  function closeMenu() {
    mobileMenu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
  }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    mobileMenu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (innerWidth > 600) closeMenu(); });

  // Click-to-expand education, jobs and awards. Multiple entries may stay open.
  document.querySelectorAll('.exp-trigger, .award-trigger').forEach(button => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(expanded));
      button.closest('.experience-row, .award')?.classList.toggle('expanded', expanded);
    });
  });

  // Fade/blur/slide-up reveal on entry. Respects reduced motion and always leaves
  // content visible if JS or IntersectionObserver is unavailable.
  const motionAllowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = Array.from(document.querySelectorAll('.reveal'));
  if (motionAllowed && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-motion');
    const observer = new IntersectionObserver((entries, io) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(element => observer.observe(element));
  } else {
    targets.forEach(el => el.classList.add('revealed'));
  }

  // TRUE SCROLL CROSSFADE — five panels share a sticky stage.
  // The reel's scroll distance maps onto four transitions. Each transition
  // overlaps the outgoing and incoming project with complementary opacity.
  const reel = document.querySelector('.project-reel');
  const chapters = Array.from(document.querySelectorAll('.project-stage .project-chapter'));
  const chapterLinks = Array.from(document.querySelectorAll('.project-chapter-nav a'));
  if (reel && chapters.length === 5 && motionAllowed && 'requestAnimationFrame' in window) {
    document.documentElement.classList.add('js-crossfade');
    const sticky = reel.querySelector('.project-reel-sticky');
    const eased = x => {
      const clamped = Math.min(1, Math.max(0, x));
      return clamped * clamped * (3 - 2 * clamped);
    };
    const clamp = (min, value, max) => Math.min(max, Math.max(min, value));
    let queued = false;
    let lastActive = -1;
    function updateSlides() {
      queued = false;
      const top = reel.getBoundingClientRect().top + window.scrollY;
      const runway = Math.max(1, reel.offsetHeight - sticky.offsetHeight);
      const progress = clamp(0, (window.scrollY - top) / runway, 1);
      const position = progress * (chapters.length - 1);
      const current = Math.min(chapters.length - 1, Math.floor(position));
      const local = position - current;
      // Each card holds still and fully visible before a long, clear dissolve.
      const dissolve = eased((local - .36) / .56);
      const opacities = chapters.map((_, i) =>
        i === current ? 1 - dissolve : i === current + 1 ? dissolve : 0
      );
      if (current === chapters.length - 1) opacities[current] = 1;
      const active = clamp(0, (dissolve > .5 ? current + 1 : current), chapters.length - 1);
      chapters.forEach((chapter, index) => {
        const opacity = opacities[index];
        chapter.style.setProperty('--panel-opacity', opacity.toFixed(4));
        const interactive = index === active;
        chapter.classList.toggle('is-interactive', interactive);
        chapter.classList.toggle('is-on-screen', opacity > .001 && !interactive);
        // Prevent keyboard tabbing into invisible cards.
        chapter.inert = !interactive;
        chapter.setAttribute('aria-hidden', interactive ? 'false' : 'true');
      });
      chapterLinks.forEach((link, index) => {
        link.classList.toggle('is-current', index === active);
        if (index === active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      reel.style.setProperty('--story-progress', progress.toFixed(4));
      if (lastActive !== active) {
        lastActive = active;
        const footer = reel.querySelector('.project-reel-footer');
        if (footer) footer.firstChild.textContent = `SCROLL TO CROSSFADE  /  ${String(active + 1).padStart(2,'0')} — 05`;
      }
    }
    function requestSlides() {
      if (!queued) { queued = true; requestAnimationFrame(updateSlides); }
    }
    function scrollToProject(index, addHistory=true) {
      const top = reel.getBoundingClientRect().top + window.scrollY;
      const runway = Math.max(0, reel.offsetHeight - sticky.offsetHeight);
      // At the start of a panel's segment it is fully visible.
      const destination = top + runway * index / (chapters.length - 1);
      if (addHistory) history.pushState(null, '', `#project-${String(index + 1).padStart(2,'0')}`);
      window.scrollTo({top:destination, behavior:'smooth'});
    }
    document.querySelectorAll('a[href^="#project-0"]').forEach(anchor => {
      anchor.addEventListener('click', event => {
        const match = anchor.getAttribute('href').match(/^#project-0([1-5])$/);
        if (!match) return;
        event.preventDefault();
        scrollToProject(Number(match[1]) - 1);
      });
    });
    window.addEventListener('scroll', requestSlides, {passive:true});
    window.addEventListener('resize', requestSlides);
    window.addEventListener('pageshow', requestSlides);
    requestAnimationFrame(() => {
      const match = location.hash.match(/^#project-0([1-5])$/);
      if (match) scrollToProject(Number(match[1]) - 1, false);
      else updateSlides();
    });
  }

  // Thin cyan-violet reading progress bar.
  const progress = document.getElementById('scroll-progress');
  let waiting = false;
  function updateProgress() {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0})`;
    waiting = false;
  }
  window.addEventListener('scroll', () => {
    if (!waiting) { waiting = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  // Current-section highlight in desktop navigation.
  if ('IntersectionObserver' in window) {
    const links = document.querySelectorAll('.desktop-links a');
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(a => a.classList.toggle('active', a.hash === '#' + entry.target.id));
        }
      });
    }, { rootMargin: '-20% 0px -65% 0px' });
    document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
  }
  const year = document.getElementById('current-year');
  if (year) year.textContent = new Date().getFullYear();
})();
