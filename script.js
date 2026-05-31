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

  /* Contact form — Web3Forms (FormSubmit was returning 521) */
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');
  const contactError = document.getElementById('contactError');
  const contactErrorText = document.getElementById('contactErrorText');
  const contactSubmit = document.getElementById('contactSubmit');
  const contactConfig = window.SYNTERVO_CONTACT || {};
  const PLACEHOLDER_KEY = 'REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY';

  function showContactSuccess() {
    if (!contactForm || !contactSuccess) return;
    contactForm.hidden = true;
    if (contactError) contactError.hidden = true;
    contactSuccess.hidden = false;
  }

  function showContactError(message) {
    if (!contactError) return;
    if (contactErrorText && message) contactErrorText.textContent = message;
    contactError.hidden = false;
    if (contactSuccess) contactSuccess.hidden = true;
  }

  function setContactSubmitting(isSubmitting) {
    if (!contactSubmit) return;
    contactSubmit.disabled = isSubmitting;
    contactSubmit.classList.toggle('btn--loading', isSubmitting);
    contactSubmit.textContent = isSubmitting ? 'Sending…' : 'Send message';
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const accessKey = (contactConfig.accessKey || '').trim();
      if (!accessKey || accessKey === PLACEHOLDER_KEY) {
        showContactError(
          'The contact form is not configured yet. Please email us at Syntevo@gmail.com.'
        );
        return;
      }

      const honeypot = contactForm.querySelector('[name="botcheck"]');
      if (honeypot && honeypot.checked) return;

      const name = contactForm.querySelector('[name="name"]');
      const email = contactForm.querySelector('[name="email"]');
      const message = contactForm.querySelector('[name="message"]');

      if (!name || !email || !message) return;

      if (contactError) contactError.hidden = true;
      setContactSubmitting(true);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: 'New inquiry from Syntervo website',
          from_name: 'Syntervo Website',
          name: name.value.trim(),
          email: email.value.trim(),
          message: message.value.trim()
        })
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          if (result.ok && result.data && result.data.success) {
            showContactSuccess();
            contactForm.reset();
            return;
          }
          throw new Error(
            (result.data && result.data.message) || 'The form service returned an error.'
          );
        })
        .catch(function () {
          showContactError(
            'Something went wrong sending your message. Please try again, or email Syntevo@gmail.com directly.'
          );
        })
        .finally(function () {
          setContactSubmitting(false);
        });
    });
  }

  if (contactForm && contactSuccess && window.location.search.includes('sent=1')) {
    showContactSuccess();
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
