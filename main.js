/* ==========================================================
   CARLES MECA — PORTFOLIO · main.js
========================================================== */

/* ----------------------------------------------------------
   DOM REFERENCES
---------------------------------------------------------- */
const nav        = document.getElementById('nav');
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

/* ----------------------------------------------------------
   NAVIGATION — scroll state
---------------------------------------------------------- */
function updateNav() {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav(); // run once on load

/* ----------------------------------------------------------
   MOBILE MENU
---------------------------------------------------------- */
hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  mobileMenu.setAttribute('aria-hidden', !isOpen);
});

// Close mobile menu on link click
document.querySelectorAll('.nav__mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

/* ----------------------------------------------------------
   SMOOTH SCROLL (offset by nav height)
---------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ----------------------------------------------------------
   REVEAL ANIMATIONS — IntersectionObserver
---------------------------------------------------------- */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

// Stagger siblings inside grid/flex containers
document.querySelectorAll(
  '.about__cards, .skills__grid, .projects__grid'
).forEach(container => {
  container.querySelectorAll('.reveal').forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.10}s`;
  });
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ----------------------------------------------------------
   ACTIVE NAV LINK — highlight on scroll
---------------------------------------------------------- */
const navLinks = document.querySelectorAll('.nav__links a');

const activeObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${entry.target.id}`
        );
      });
    });
  },
  { threshold: 0.45, rootMargin: '-15% 0px -15% 0px' }
);

document.querySelectorAll('section[id]').forEach(s => activeObserver.observe(s));

/* ----------------------------------------------------------
   PROJECT CARDS — inject --c CSS custom property from data-color
---------------------------------------------------------- */
document.querySelectorAll('.project-card[data-color]').forEach(card => {
  card.style.setProperty('--c', card.dataset.color);
});

/* ----------------------------------------------------------
   BLOB PARALLAX — subtle mouse-follow on hero (desktop only)
---------------------------------------------------------- */
const blobYellow = document.querySelector('.blob--yellow');
const blobPurple = document.querySelector('.blob--purple');

if (blobYellow && blobPurple && window.matchMedia('(pointer: fine)').matches) {
  let mx = 0, my = 0;
  let cx = 0, cy = 0;
  let rafId = null;

  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
    if (!rafId) rafId = requestAnimationFrame(animateBlobs);
  }, { passive: true });

  function animateBlobs() {
    cx += (mx - cx) * 0.055;
    cy += (my - cy) * 0.055;
    blobYellow.style.transform = `translate(${cx * 22}px, ${cy * 22}px)`;
    blobPurple.style.transform = `translate(${-cx * 16}px, ${-cy * 16}px)`;
    rafId = requestAnimationFrame(animateBlobs);
  }
}

/* ----------------------------------------------------------
   STATS COUNTER ANIMATION
   Counts up when the hero section enters the viewport
---------------------------------------------------------- */
const statNums = document.querySelectorAll('.hero__stat-num');

function animateCounter(el, target, suffix, duration = 1200) {
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
    el.textContent = Math.round(ease * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const heroSection = document.querySelector('.hero');
let countersDone = false;

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersDone) {
      countersDone = true;
      statNums.forEach(el => {
        const raw    = el.textContent.replace(/\D/g, '');
        const suffix = el.textContent.replace(/[\d]/g, ''); // e.g. "+"
        animateCounter(el, parseInt(raw, 10), suffix, 1400);
      });
    }
  });
}, { threshold: 0.4 });

if (heroSection) counterObserver.observe(heroSection);
