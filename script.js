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
