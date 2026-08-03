import './index.css';

console.log('FORZALK Official Site initialized');

// Apple-style smooth scroll logic for Featured Work section
(function initAutoScrollToFeaturedWork() {
  // If user opened page with a target anchor (e.g. #services), don't auto scroll
  if (window.location.hash && window.location.hash !== '#' && window.location.hash !== '#hero') {
    return;
  }

  let userInteracted = false;
  let scrollAnimFrame = null;
  let isAutoScrolling = false;

  function markUserInteraction() {
    userInteracted = true;
    if (scrollAnimFrame) {
      cancelAnimationFrame(scrollAnimFrame);
      scrollAnimFrame = null;
    }
    removeListeners();
  }

  function onScrollCheck() {
    // If scroll event occurred while NOT auto-scrolling, mark user interaction
    if (!isAutoScrolling && window.scrollY > 15) {
      markUserInteraction();
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

  // Apple-style quartic ease-out deceleration curve (mimics iOS/macOS smooth inertia scroll)
  function appleEaseOut(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function smoothScrollAppleStyle(targetElement, duration = 1600) {
    if (userInteracted) return;

    const startPosition = window.pageYOffset || document.documentElement.scrollTop;
    const targetPosition = targetElement.getBoundingClientRect().top + startPosition;
    const distance = targetPosition - startPosition;
    let startTime = null;
    isAutoScrolling = true;

    function step(currentTime) {
      if (userInteracted) {
        isAutoScrolling = false;
        return;
      }

      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easedProgress = appleEaseOut(progress);

      window.scrollTo(0, startPosition + distance * easedProgress);

      if (progress < 1) {
        scrollAnimFrame = requestAnimationFrame(step);
      } else {
        isAutoScrolling = false;
        scrollAnimFrame = null;
        removeListeners();
      }
    }

    scrollAnimFrame = requestAnimationFrame(step);
  }

  function attemptAutoScroll() {
    if (userInteracted) return;
    if (window.scrollY > 50) return;

    const workSection = document.getElementById('work');
    if (workSection && !userInteracted) {
      smoothScrollAppleStyle(workSection, 1600);
    }
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
      // 500ms (half-second) delay before scroll initiates
      setTimeout(() => {
        attemptAutoScroll();
      }, 500);
    });
  }

  if (document.readyState === 'complete') {
    onReady();
  } else {
    window.addEventListener('load', onReady, { once: true });
  }
})();
