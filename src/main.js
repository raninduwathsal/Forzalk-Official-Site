import './index.css';

console.log('FORZALK Official Site initialized');

// Auto-scroll to Featured Work after content loads (cancelled if user scrolls/interacts)
(function initAutoScrollToFeaturedWork() {
  // If user opened page with a target hash (e.g. #services), don't override scroll
  if (window.location.hash && window.location.hash !== '#' && window.location.hash !== '#hero') {
    return;
  }

  let userInteracted = false;

  function markUserInteraction() {
    userInteracted = true;
    removeListeners();
  }

  function onScrollCheck() {
    if (window.scrollY > 20) {
      userInteracted = true;
      removeListeners();
    }
  }

  const events = ['wheel', 'touchmove', 'touchstart', 'keydown', 'mousedown', 'pointerdown'];

  function addListeners() {
    events.forEach(evt => {
      window.addEventListener(evt, markUserInteraction, { passive: true, once: true });
    });
    window.addEventListener('scroll', onScrollCheck, { passive: true });
  }

  function removeListeners() {
    events.forEach(evt => {
      window.removeEventListener(evt, markUserInteraction);
    });
    window.removeEventListener('scroll', onScrollCheck);
  }

  addListeners();

  function attemptAutoScroll() {
    if (userInteracted) return;

    // Verify user is still near top of page
    if (window.scrollY > 50) return;

    const workSection = document.getElementById('work');
    if (workSection && !userInteracted) {
      workSection.scrollIntoView({ behavior: 'smooth' });
    }
    removeListeners();
  }

  function waitForImagesInWork() {
    const workSection = document.getElementById('work');
    if (!workSection) return Promise.resolve();

    const imgs = Array.from(workSection.querySelectorAll('img'));
    const promises = imgs.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      });
    });

    return Promise.all(promises);
  }

  function onReady() {
    waitForImagesInWork().then(() => {
      // 600ms delay to let user see hero section before smooth scrolling
      setTimeout(() => {
        attemptAutoScroll();
      }, 600);
    });
  }

  if (document.readyState === 'complete') {
    onReady();
  } else {
    window.addEventListener('load', onReady, { once: true });
  }
})();
