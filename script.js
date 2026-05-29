/**
 * Syntervo — multi-page static site
 * No dependencies. Safe for GitHub Pages.
 */

(function () {
  'use strict';

  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav__link, .nav__cta, .footer__nav a, .logo');
  const revealEls = document.querySelectorAll('.reveal');
  const yearEl = document.getElementById('year');

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* Contact form — success state after FormSubmit redirect */
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');
  const formNext = document.getElementById('formNext');

  if (formNext) {
    const nextUrl = new URL('contact.html', window.location.href);
    nextUrl.searchParams.set('sent', '1');
    formNext.value = nextUrl.href;
  }

  if (contactForm && contactSuccess && window.location.search.includes('sent=1')) {
    contactForm.hidden = true;
    contactSuccess.hidden = false;
    if (history.replaceState) {
      history.replaceState(null, '', window.location.pathname);
    }
  }

  function updateHeader() {
    if (!header) return;
    header.classList.toggle('header--scrolled', window.scrollY > 24);
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  function closeNav() {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    navMenu.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      if (navMenu.classList.contains('is-open')) {
        closeNav();
      } else {
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.setAttribute('aria-label', 'Close menu');
        navMenu.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeNav();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  /* Scroll reveal */
  if ('IntersectionObserver' in window && revealEls.length) {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      revealEls.forEach(function (el) {
        el.classList.add('is-visible');
      });
    } else {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { root: null, rootMargin: '0px 0px -6% 0px', threshold: 0.08 }
      );

      revealEls.forEach(function (el) {
        observer.observe(el);
      });

      /* Above-the-fold: hero + page hero */
      const topReveals = document.querySelectorAll('.hero .reveal, .page-hero .reveal, .page-intro .reveal');
      requestAnimationFrame(function () {
        topReveals.forEach(function (el, i) {
          setTimeout(function () {
            el.classList.add('is-visible');
            observer.unobserve(el);
          }, 60 + i * 80);
        });
      });
    }
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }
})();
