/* ============================================================
   PORTFOLIO — Minimalist Doc-Style Script
   Live clock, scroll reveals, experience toggle, marquee
   ============================================================ */

(function () {
  'use strict';

  // ── Live Clock ─────────────────────────────────────────────
  const clockEl = document.getElementById('live-clock');

  function updateClock() {
    const now = new Date();
    let h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    clockEl.textContent = `${String(h).padStart(2, '0')}:${m}:${s} ${ampm}`;
  }

  updateClock();
  setInterval(updateClock, 1000);

  // ── Experience Toggle ──────────────────────────────────────
  window.toggleExp = function (id) {
    const details = document.getElementById(id + '-details');
    const toggle = document.querySelector(`#${id} .exp-entry__toggle`);

    if (details.classList.contains('open')) {
      details.classList.remove('open');
      toggle.textContent = '▾';
    } else {
      details.classList.add('open');
      toggle.textContent = '▴';
    }
  };

  // ── Scroll Reveal ──────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  // ── Sidebar Index Scroll-Spy & Smooth Scroll ───────────────
  const sidebarLinks = document.querySelectorAll('.sidebar-index__link');
  const sections = ['skills', 'experience', 'education', 'achievements', 'projects', 'connect'];
  let isSmoothScrolling = false;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const targetId = href.replace('#', '');
        // Highlight clicked item immediately
        sidebarLinks.forEach((link) => {
          link.classList.toggle('active', link.dataset.section === targetId);
        });

        isSmoothScrolling = true;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Re-enable scroll spy after scroll animation finishes
        setTimeout(() => {
          isSmoothScrolling = false;
          updateSidebar();
        }, 850);
      }
    });
  });

  function updateSidebar() {
    if (isSmoothScrolling) return;

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Highlight last item if at bottom of page
    if (window.innerHeight + scrollY >= documentHeight - 60) {
      const lastSection = sections[sections.length - 1];
      sidebarLinks.forEach((link) => {
        link.classList.toggle('active', link.dataset.section === lastSection);
      });
      return;
    }

    // Highlight active section based on scroll position
    let current = '';
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= windowHeight * 0.35) {
          current = id;
        }
      }
    });

    sidebarLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  window.addEventListener('scroll', updateSidebar, { passive: true });
  updateSidebar();

})();
