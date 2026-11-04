(() => {
  const body = document.body;
  body.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // mobile nav
  const menuButton = document.querySelector('.mobile-toggle');
  const mobileMenu = document.getElementById('mobile-nav');
  if (menuButton && mobileMenu) {
    const closeMenu = () => {
      menuButton.setAttribute('aria-expanded', 'false');
      mobileMenu.hidden = true;
    };
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      mobileMenu.hidden = expanded;
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => { if (window.innerWidth > 820) closeMenu(); });
  }

  // reveal
  const reveals = [...document.querySelectorAll('.reveal')];
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('in-view'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    reveals.forEach(el => io.observe(el));
  }

  // project book data
  const book = document.getElementById('projectBook');
  if (!book) return;
  const projects = [
    {
      number: '01 / 09',
      category: 'ROBOTICS / EMBEDDED SYSTEMS',
      title: 'Quadruped Robot — Version 2',
      summary: 'I redesigned my first walking robot into an eight-servo quadruped with independently controlled hip and knee joints. An ESP32-C3 coordinates the gait, while onboard sensing provides a platform for obstacle detection and future autonomous behaviour.',
      challenge: 'Coordinate two joints per leg while keeping the chassis and electronics practical to assemble, calibrate and debug.',
      action: 'Developed multi-servo gait sequences, calibrated servo centres and travel limits, and refined power distribution and cable routing.',
      outcome: 'A more capable second-generation walking platform with greater control over foot placement, body motion and later sensor experiments.',
      tags: ['ESP32-C3', 'Embedded C/C++', '8-servo gait', '3D printing'],
      media: [{type:'image', src:'assets/quadruped.webp', caption:'Assembled second-version quadruped prototype.'}]
    },
    {
      number: '02 / 09',
      category: 'MECHANICAL DESIGN / DRIVETRAIN',
      title: 'Custom RC Car',
      summary: 'I designed and built a custom RC car around a 3D-printed chassis and electric drivetrain. The project involved CAD modelling, drivetrain layout, gearing calculations, printed gearbox and motor mounts, shaft support, assembly and repeated testing.',
      challenge: 'Package a compact geartrain while keeping shafts aligned, moving parts supported and friction under control.',
      action: 'Calculated gear ratios and centre distances, worked through backlash and bearing support, and revised printed mounts using assembly tests.',
      outcome: 'A modular drivetrain prototype that made the effects of tolerances, stiffness and print orientation visible in real hardware.',
      tags: ['CAD', 'Geartrain design', '3D printing', 'Testing'],
      media: [{type:'image', src:'assets/rc-car.webp', caption:'Printed chassis and drivetrain assembly.'}]
    },
    {
      number: '03 / 09',
      category: 'PARAMETRIC CAD / PROTOTYPING',
      title: 'Modular Dowel Storage Mounts',
      summary: 'I created a family of 3D-printed mounts that locate 20 mm wooden dowels and turn them into a modular storage structure. Multiple geometries were developed so the same dowel size could be used in different support and bracing arrangements.',
      challenge: 'Achieve reliable locating and holding fits despite dimensional variation in FDM-printed parts.',
      action: 'Iterated small fit-test pieces, varied clearances and print orientation, and used wall thickness, fillets and braces to improve the load path.',
      outcome: 'Repeatable mount geometries with practical slip and interference fit tolerances, reducing wasted prints during development.',
      tags: ['Tolerance design', 'Parametric CAD', 'Fit testing', 'Design for FDM'],
      media: [{type:'image', src:'assets/dowel-mounts.webp', caption:'CAD models of alternative dowel mount geometries.'}]
    },
    {
      number: '04 / 09',
      category: 'UNIVERSITY / DESIGN PROJECT',
      title: 'Warman Project Robot',
      summary: 'For a university Warman design project, I developed a detailed CAD concept combining a mobile chassis, collection hopper and multi-link arm with a gripper. The concept was not selected for the final build, but it was a strong exercise in mechanism layout and system integration. This spread also shows the physical Warman machine and a short demonstration clip.',
      challenge: 'Fit multiple moving subsystems into one machine envelope without ignoring assembly clearances or access.',
      action: 'Built the mechanical assembly, checked interfaces and interference, and considered fasteners, supports and manufacturing sequence.',
      outcome: 'A coherent concept useful for evaluating reach, packaging and integration risks before physical fabrication.',
      tags: ['SolidWorks', 'Mechanism layout', 'Design for assembly', 'Packaging'],
      media: [
        {type:'image', src:'assets/warman-build.webp', caption:'Physical Warman machine on display.'},
        {type:'video', src:'assets/warman-demo.mp4', poster:'assets/warman-demo-poster.webp', caption:'Demonstration video of the Warman project.'}
      ]
    },
    {
      number: '05 / 09',
      category: 'ROCKETRY / PROTOTYPING',
      title: 'Modular Two-Stage Rocket',
      summary: 'This was my first iteration of a small modular two-stage rocket. The first stage uses fins for passive stability, while the second-stage concept was intended to use gyroscope-controlled thrust vectoring. I modelled the components in Fusion 360 and assembled a full-size printed prototype.',
      challenge: 'Create repeatable interfaces and package nested sections while balancing stability concepts with manufacturability.',
      action: 'Modelled the modular components, tuned mating clearances and checked physical fit and scale with printed assemblies.',
      outcome: 'A full-size prototype that exposed tolerance stack-up and assembly issues before any advanced sensing or control work.',
      tags: ['Fusion 360', 'Modular design', 'Tolerance stack-up', '3D printing'],
      media: [{type:'image', src:'assets/modular-rocket.webp', caption:'Modular CAD components and the assembled printed prototype.'}]
    },
    {
      number: '06 / 09',
      category: 'ARDUINO / PRODUCT PROTOTYPE',
      title: 'Automatic Rubbish Bin',
      summary: 'I built a touch-free rubbish bin using an Arduino, an IR proximity sensor, a display and an SG90 servo. When a user is detected, the servo opens the lid and the control logic keeps it open for approximately two seconds before closing.',
      challenge: 'Make a reliable hands-free mechanism with simple electronics while reducing missed detections and unwanted triggers.',
      action: 'Integrated sensing, display and actuation using event-driven timing, then refined sensor placement, servo travel and enclosure access.',
      outcome: 'A compact practical prototype for hygienic 3D-printing waste disposal in my workspace.',
      tags: ['Arduino', 'IR sensing', 'Servo actuation', 'Control logic'],
      media: [{type:'image', src:'assets/automatic-bin.webp', caption:'Enclosure CAD model and electronics test setup.'}]
    },
    {
      number: '07 / 09',
      category: 'ELECTRONICS / INTEGRATION',
      title: 'Modular Electronics Control Board',
      summary: 'I designed and soldered a compact control board integrating an Arduino Uno, two motor-driver modules, a 5 V buck converter and removable connectors. The board consolidated a larger wiring arrangement while keeping major components replaceable.',
      challenge: 'Distribute regulated power and route control signals cleanly while keeping higher-current modules serviceable.',
      action: 'Planned electrical integration and connector access, soldered the board, and used continuity checks and multimeter testing to isolate faults.',
      outcome: 'A neater, more serviceable control assembly with clearer cable management and easier troubleshooting.',
      tags: ['Arduino Uno', 'Motor drivers', 'Buck conversion', 'Troubleshooting'],
      media: [{type:'image', src:'assets/control-board.webp', caption:'Hand-assembled control board during integration and testing.'}]
    },
    {
      number: '08 / 09',
      category: 'PLACEHOLDER / ROCKETRY',
      title: 'Level 1 Rocket Launch',
      summary: 'Placeholder for a future project page covering a Level 1 rocket launch, the design decisions behind it, launch preparation, flight results and lessons learned.',
      challenge: 'Project details to be added later.',
      action: 'You will add the real information and media once ready.',
      outcome: 'This slot is reserved so the redesign already has space for the upcoming launch project.',
      tags: ['Coming soon', 'Rocket launch', 'Placeholder'],
      media: [{type:'placeholder', heading:'Level 1 Rocket Launch', text:'Reserved for launch photos, flight details, build notes and results.'}]
    },
    {
      number: '09 / 09',
      category: 'PLACEHOLDER / MECHANICAL DESIGN',
      title: 'Gearbox Design',
      summary: 'Placeholder for a future gearbox design project page, intended for the concept, design process, calculations, CAD, manufacture and testing outcomes.',
      challenge: 'Project details to be added later.',
      action: 'You will add the real information and media once ready.',
      outcome: 'This slot is reserved so the book already supports the extra project when you send the full details.',
      tags: ['Coming soon', 'Gearbox', 'Placeholder'],
      media: [{type:'placeholder', heading:'Gearbox Design', text:'Reserved for CAD renders, calculations, prototype images and performance discussion.'}]
    }
  ];

  const leftPageContent = document.getElementById('leftPageContent');
  const rightPageContent = document.getElementById('rightPageContent');
  const flipSheet = document.getElementById('flipSheet');
  const flipFront = document.getElementById('flipFront');
  const flipBack = document.getElementById('flipBack');
  const counter = document.getElementById('bookCounter');
  const titleHint = document.getElementById('bookTitleHint');
  const toc = document.getElementById('bookToc');
  const prevButton = document.getElementById('prevProject');
  const nextButton = document.getElementById('nextProject');
  const cover = document.getElementById('bookCover');
  const coverOpenButton = document.getElementById('coverOpenButton');
  const openBookButton = document.getElementById('openBookButton');
  const closeBookButton = document.getElementById('closeBookButton');
  const goFirstButton = document.getElementById('goFirstButton');
  const bookHint = document.getElementById('bookHint');
  const bookStage = document.querySelector('.book-stage');
  const compact = window.matchMedia('(max-width:820px)');
  const openDuration = reduceMotion ? 0 : 1580;
  const turnDuration = reduceMotion ? 0 : 1320;
  let currentIndex = 0;
  let isAnimating = false;
  let isOpen = false;
  let openingPromise = null;
  let lastWheelAt = 0;
  let wheelAccum = 0;
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  function leftHTML(project) {
    return `
      <div class="project-kicker"><span>${project.number}</span><span>${project.category}</span></div>
      <h2>${project.title}</h2>
      <p class="book-summary">${project.summary}</p>
      <div class="book-notes">
        <div class="book-note"><span>THE CHALLENGE</span><p>${project.challenge}</p></div>
        <div class="book-note"><span>WHAT I DID</span><p>${project.action}</p></div>
        <div class="book-note"><span>THE OUTCOME</span><p>${project.outcome}</p></div>
      </div>
      <div class="book-tags">${project.tags.map(tag => `<span>${tag}</span>`).join('')}</div>
    `;
  }

  function mediaMarkup(item) {
    if (item.type === 'image') {
      return `<div class="media-frame media-primary"><img loading="lazy" src="${item.src}" alt="${item.caption}"></div><p class="media-caption">${item.caption}</p>`;
    }
    if (item.type === 'video') {
      return `<div class="media-frame media-primary"><video controls playsinline preload="metadata" poster="${item.poster || ''}"><source src="${item.src}" type="video/mp4">Your browser does not support video.</video></div><p class="media-caption">${item.caption}</p><a class="video-link" href="${item.src}" target="_blank" rel="noopener noreferrer">Open video in new tab ↗</a>`;
    }
    return `<div class="media-frame media-primary placeholder"><div class="placeholder-card"><p class="tiny-label">COMING SOON</p><h3>${item.heading}</h3><p>${item.text}</p></div></div>`;
  }
  function rightHTML(project) {
    if (project.media.length === 1) return `<div class="media-block">${mediaMarkup(project.media[0])}</div>`;
    const [first, second] = project.media;
    return `
      <div class="media-block warman-media">
        <div class="media-item">${mediaMarkup(first)}</div>
        <div class="media-item">${mediaMarkup(second)}</div>
      </div>
    `;
  }

  function updateToolbar() {
    const project = projects[currentIndex];
    counter.textContent = project.number;
    titleHint.textContent = project.title;
    prevButton.disabled = currentIndex === 0 || isAnimating || !isOpen;
    nextButton.disabled = currentIndex === projects.length - 1 || isAnimating || !isOpen;
    document.querySelectorAll('.toc-item').forEach((item, i) => {
      item.classList.toggle('active', currentIndex === i);
      item.setAttribute('aria-current', currentIndex === i ? 'page' : 'false');
    });
  }
  function renderProject() {
    leftPageContent.innerHTML = leftHTML(projects[currentIndex]);
    rightPageContent.innerHTML = rightHTML(projects[currentIndex]);
    updateToolbar();
  }

  function openBook() {
    if (isOpen) return Promise.resolve();
    if (openingPromise) return openingPromise;
    bookHint.textContent = 'OPENING THE PORTFOLIO…';
    // Dolly-in: pan the viewport to the book while its 3D camera transforms
    // from a smaller angled cover to a full-size open spread.
    const stageTop = window.scrollY + bookStage.getBoundingClientRect().top;
    const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header')) || 76;
    window.scrollTo({ top: Math.max(0, stageTop - headerOffset - 18), behavior: reduceMotion ? 'instant' : 'smooth' });
    book.classList.add('is-open');
    book.classList.remove('is-closed');
    cover.classList.add('open');
    openBookButton.textContent = 'Book opened ✓';
    openBookButton.disabled = true;
    coverOpenButton.disabled = true;
    // Camera pulls in as the front cover turns around the spine.
    openingPromise = sleep(openDuration).then(() => {
      isOpen = true;
      cover.classList.add('is-rested');
      closeBookButton.hidden = false;
      openBookButton.hidden = true;
      bookHint.textContent = 'SCROLL · CLICK THE ARROWS · USE ← → KEYS';
      book.setAttribute('aria-label', 'Open project portfolio');
      updateToolbar();
      openingPromise = null;
    });
    return openingPromise;
  }
  async function replayOpen() {
    if (isAnimating || openingPromise) return;
    isOpen = false;
    cover.classList.remove('is-rested','open');
    book.classList.remove('is-open');
    book.classList.add('is-closed');
    openBookButton.hidden = false;
    openBookButton.disabled = false;
    openBookButton.textContent = 'Open book';
    closeBookButton.hidden = true;
    coverOpenButton.disabled = false;
    bookHint.textContent = 'CLOSED · CLICK THE COVER TO OPEN';
    updateToolbar();
    await sleep(reduceMotion ? 0 : 800);
    await openBook();
  }

  function pauseVideo() {
    rightPageContent.querySelectorAll('video').forEach(v => v.pause());
  }
  // The sheet sits ABOVE both pages, rather than inside the right page.
  // Its front holds the old visible page, and its reverse holds the new page.
  async function turnTo(index) {
    if (index < 0 || index >= projects.length || index === currentIndex || isAnimating) return;
    if (!isOpen) await openBook();
    if (isAnimating || index === currentIndex) return;
    isAnimating = true;
    updateToolbar();
    pauseVideo();
    const direction = index > currentIndex ? 'next' : 'prev';
    const newProject = projects[index];
    if (reduceMotion) {
      currentIndex = index;
      renderProject();
      isAnimating = false;
      updateToolbar();
      return;
    }
    if (compact.matches) {
      // A noticeable two-phase card turn for stacked pages on mobile/tablets.
      const spread = book.querySelector('.book-pages');
      const sign = direction === 'next' ? -1 : 1;
      const retreat = spread.animate([
        {transform:'rotateY(0deg) scale(1)',opacity:1},
        {transform:`rotateY(${sign * 32}deg) translateX(${sign * 24}px) scale(.965)`,opacity:.18}
      ],{duration:490,fill:'forwards',easing:'cubic-bezier(.32,0,.78,.56)'});
      await retreat.finished.catch(()=>{});
      retreat.cancel();
      currentIndex = index;
      renderProject();
      const arrive = spread.animate([
        {transform:`rotateY(${-sign * 32}deg) translateX(${-sign * 24}px) scale(.965)`,opacity:.18},
        {transform:'rotateY(0deg) translateX(0) scale(1)',opacity:1}
      ],{duration:540,fill:'forwards',easing:'cubic-bezier(.18,.72,.2,1)'});
      await arrive.finished.catch(()=>{});
      arrive.cancel();
      isAnimating = false;
      updateToolbar();
      return;
    }
    const movingFront = direction === 'next' ? rightPageContent.innerHTML : leftPageContent.innerHTML;
    const movingBack = direction === 'next' ? leftHTML(newProject) : rightHTML(newProject);
    flipSheet.classList.toggle('turn-next',direction === 'next');
    flipSheet.classList.toggle('turn-prev',direction === 'prev');
    flipFront.innerHTML = `<div class="page-content">${movingFront}</div>`;
    flipBack.innerHTML = `<div class="page-content">${movingBack}</div>`;
    flipSheet.classList.add('turning');
    // New page beneath sheet is visible progressively as the physical sheet turns.
    if (direction === 'next') rightPageContent.innerHTML = rightHTML(newProject);
    else leftPageContent.innerHTML = leftHTML(newProject);
    const animation = flipSheet.animate([
      {transform:'rotateY(0deg)',offset:0},
      {transform:`rotateY(${direction === 'next' ? '-13deg' : '13deg'})`,offset:.12},
      {transform:`rotateY(${direction === 'next' ? '-93deg' : '93deg'})`,offset:.53},
      {transform:`rotateY(${direction === 'next' ? '-180deg' : '180deg'})`,offset:1}
    ],{duration:turnDuration,easing:'cubic-bezier(.42,.04,.17,1)',fill:'forwards'});
    await sleep(turnDuration * .54);
    if (direction === 'next') leftPageContent.innerHTML = leftHTML(newProject);
    else rightPageContent.innerHTML = rightHTML(newProject);
    await animation.finished.catch(() => {});
    animation.cancel();
    flipSheet.classList.remove('turning','turn-next','turn-prev');
    flipFront.innerHTML='';flipBack.innerHTML='';
    currentIndex=index;
    isAnimating=false;
    updateToolbar();
  }

  function buildToc() {
    toc.innerHTML = projects.map((p,i) => `
      <button class="toc-item ${i===0?'active':''}" type="button" data-index="${i}">
      <strong>${String(i+1).padStart(2,'0')} — ${p.title}</strong><span>${p.category}</span></button>`
    ).join('');
    toc.querySelectorAll('.toc-item').forEach(button => {
      button.addEventListener('click', async () => { await openBook(); turnTo(Number(button.dataset.index)); });
    });
  }
  // Wheel turns ONE PAGE at a time, with a threshold and cooldown so trackpads
  // cannot accidentally skip through several projects.
  book.addEventListener('wheel', e => {
    if (compact.matches || e.target.closest('video')) return;
    // If a long page or the Warman media column needs internal scrolling,
    // allow that first instead of turning the book prematurely.
    const scrollArea = e.target.closest('.warman-media, .page-content');
    if (scrollArea && scrollArea.scrollHeight > scrollArea.clientHeight + 3) {
      const canScrollUp = scrollArea.scrollTop > 2;
      const canScrollDown = scrollArea.scrollTop + scrollArea.clientHeight < scrollArea.scrollHeight - 2;
      if ((e.deltaY < 0 && canScrollUp) || (e.deltaY > 0 && canScrollDown)) return;
    }
    const dir = Math.sign(e.deltaY);
    if (Math.abs(e.deltaY) < 1 || e.ctrlKey) return;
    if (isOpen && ((dir < 0 && currentIndex === 0) || (dir > 0 && currentIndex === projects.length-1))) return;
    e.preventDefault();
    if (openingPromise || isAnimating) return;
    wheelAccum += e.deltaY;
    if (Math.abs(wheelAccum) < 60) return;
    const now = performance.now();
    if (now-lastWheelAt < 1200) return;
    const turnDir = Math.sign(wheelAccum);
    wheelAccum = 0;
    lastWheelAt=now;
    if (!isOpen) openBook();
    else turnTo(currentIndex+turnDir);
  },{passive:false});
  let touchStart=null;
  bookStage.addEventListener('touchstart',e=>{
    if(e.target.closest('video,button,a'))return;
    const t=e.changedTouches[0];touchStart={x:t.clientX,y:t.clientY};
  },{passive:true});
  bookStage.addEventListener('touchend',e=>{
    if(!touchStart||e.target.closest('video,button,a'))return;
    const t=e.changedTouches[0];const dx=t.clientX-touchStart.x;const dy=t.clientY-touchStart.y;
    touchStart=null;
    if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.4)turnTo(currentIndex+(dx<0?1:-1));
  },{passive:true});
  document.addEventListener('keydown',e=>{
    if (e.altKey||e.ctrlKey||e.metaKey || /^(INPUT|TEXTAREA|SELECT|VIDEO)$/.test(document.activeElement?.tagName||''))return;
    if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();turnTo(currentIndex+1);}
    if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();turnTo(currentIndex-1);}
  });

  prevButton.addEventListener('click',()=>turnTo(currentIndex-1));
  nextButton.addEventListener('click',()=>turnTo(currentIndex+1));
  coverOpenButton.addEventListener('click',openBook);
  cover.addEventListener('click',e=>{if(e.target.closest('button'))return;openBook();});
  openBookButton.addEventListener('click',openBook);
  closeBookButton.addEventListener('click',replayOpen);
  goFirstButton.addEventListener('click',async()=>{await openBook();turnTo(0);});
  book.classList.add('is-closed');
  buildToc();
  renderProject();
  if (reduceMotion) openBook();
})();
