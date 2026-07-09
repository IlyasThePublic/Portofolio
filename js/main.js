/* ============================================================
   PORTFOLIO — JavaScript
   Features: Theme Toggle, Typing Effect, Scroll Reveal,
             Dynamic Clock, Magnetic Buttons
   ============================================================ */

(() => {
  'use strict';

  /* ══════════════════════════════════════════
     1. THEME MANAGEMENT
  ══════════════════════════════════════════ */
  const ThemeManager = (() => {
    const HTML = document.documentElement;
    const STORAGE_KEY = 'portfolio-theme';
    const LIGHT = 'light';
    const DARK  = 'dark';

    const getSystemTheme = () =>
      window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;

    const getSavedTheme = () => localStorage.getItem(STORAGE_KEY);

    const applyTheme = (theme) => {
      HTML.setAttribute('data-bs-theme', theme);
      updateToggleIcon(theme);
    };

    const updateToggleIcon = (theme) => {
      const icon = document.querySelector('#themeToggle i');
      if (!icon) return;
      if (theme === DARK) {
        icon.className = 'bi bi-sun-fill';
      } else {
        icon.className = 'bi bi-moon-fill';
      }
    };

    const init = () => {
      const saved = getSavedTheme();
      applyTheme(saved || getSystemTheme());

      // Watch OS preference change
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!getSavedTheme()) applyTheme(e.matches ? DARK : LIGHT);
      });
    };

    const toggle = () => {
      const current = HTML.getAttribute('data-bs-theme');
      const next = current === DARK ? LIGHT : DARK;
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
    };

    return { init, toggle };
  })();

  /* ══════════════════════════════════════════
     2. TYPING EFFECT
  ══════════════════════════════════════════ */
  const TypingEffect = (() => {
    const STRINGS = [
      'Front-End Developer',
      'UI/UX Enthusiast',
      'Bootstrap Specialist',
      'Creative Problem Solver',
      'Open Source Contributor',
    ];

    let strIdx   = 0;
    let charIdx  = 0;
    let deleting = false;
    let el       = null;
    let timer    = null;

    const TYPE_SPEED   = 80;
    const DELETE_SPEED = 45;
    const PAUSE_END    = 1800;
    const PAUSE_START  = 400;

    const tick = () => {
      const current = STRINGS[strIdx];

      if (deleting) {
        charIdx--;
        el.textContent = current.substring(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          strIdx = (strIdx + 1) % STRINGS.length;
          timer = setTimeout(tick, PAUSE_START);
          return;
        }
      } else {
        charIdx++;
        el.textContent = current.substring(0, charIdx);
        if (charIdx === current.length) {
          timer = setTimeout(() => { deleting = true; tick(); }, PAUSE_END);
          return;
        }
      }

      timer = setTimeout(tick, deleting ? DELETE_SPEED : TYPE_SPEED);
    };

    const init = () => {
      el = document.getElementById('typingText');
      if (!el) return;
      tick();
    };

    return { init };
  })();

  /* ══════════════════════════════════════════
     3. SCROLL REVEAL (IntersectionObserver)
  ══════════════════════════════════════════ */
  const ScrollReveal = (() => {
    const init = () => {
      const targets = document.querySelectorAll('.reveal');
      if (!targets.length) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      targets.forEach(el => observer.observe(el));
    };

    return { init };
  })();

  /* ══════════════════════════════════════════
     4. DYNAMIC CLOCK
  ══════════════════════════════════════════ */
  const LocalClock = (() => {
    let el = null;

    const update = () => {
      if (!el) return;
      const now  = new Date();
      const h    = String(now.getHours()).padStart(2, '0');
      const m    = String(now.getMinutes()).padStart(2, '0');
      const s    = String(now.getSeconds()).padStart(2, '0');
      el.textContent = `${h}:${m}:${s}`;
    };

    const init = () => {
      el = document.getElementById('localTime');
      if (!el) return;
      update();
      setInterval(update, 1000);
    };

    return { init };
  })();

  /* ══════════════════════════════════════════
     5. NAVBAR SCROLL EFFECT
  ══════════════════════════════════════════ */
  const NavbarScroll = (() => {
    const init = () => {
      const navbar = document.querySelector('.portfolio-navbar');
      if (!navbar) return;

      const handler = () => {
        if (window.scrollY > 30) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      };

      window.addEventListener('scroll', handler, { passive: true });
      handler();
    };

    return { init };
  })();

  /* ══════════════════════════════════════════
     6. DYNAMIC YEAR IN FOOTER
  ══════════════════════════════════════════ */
  const DynamicYear = (() => {
    const init = () => {
      const el = document.getElementById('currentYear');
      if (el) el.textContent = new Date().getFullYear();
    };

    return { init };
  })();

  /* ══════════════════════════════════════════
     7. MAGNETIC BUTTON EFFECT
  ══════════════════════════════════════════ */
  const MagneticButtons = (() => {
    const init = () => {
      const btns = document.querySelectorAll('.btn-magnetic');
      if (!btns.length) return;

      btns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width  / 2;
          const y = e.clientY - rect.top  - rect.height / 2;
          btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });

        btn.addEventListener('mouseleave', () => {
          btn.style.transform = '';
        });
      });
    };

    return { init };
  })();

  /* ══════════════════════════════════════════
     8. CONTRIBUTION GRID GENERATOR
  ══════════════════════════════════════════ */
  const ContribGrid = (() => {
    const init = () => {
      const grid = document.getElementById('contribGrid');
      if (!grid) return;

      const days = 70;
      const levels = [0, 1, 2, 3, 4];
      const weights = [30, 20, 20, 20, 10]; // probability weights

      const pick = () => {
        const r = Math.random() * 100;
        let acc = 0;
        for (let i = 0; i < weights.length; i++) {
          acc += weights[i];
          if (r < acc) return levels[i];
        }
        return 0;
      };

      const fragment = document.createDocumentFragment();
      for (let i = 0; i < days; i++) {
        const div = document.createElement('div');
        const lvl = pick();
        div.className = `contrib-day${lvl > 0 ? ` level-${lvl}` : ''}`;
        div.title = `${lvl} contributions`;
        fragment.appendChild(div);
      }
      grid.appendChild(fragment);
    };

    return { init };
  })();

  /* ══════════════════════════════════════════
     9. SMOOTH SCROLL FOR NAV LINKS
  ══════════════════════════════════════════ */
  const SmoothScroll = (() => {
    const init = () => {
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
          const target = document.querySelector(link.getAttribute('href'));
          if (!target) return;
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });

          // Close mobile navbar if open
          const collapse = document.querySelector('.navbar-collapse.show');
          if (collapse) {
            const toggler = document.querySelector('.navbar-toggler');
            toggler && toggler.click();
          }
        });
      });
    };

    return { init };
  })();

  /* ══════════════════════════════════════════
     10. COUNT-UP ANIMATION FOR STATS
  ══════════════════════════════════════════ */
  const CountUp = (() => {
    const animate = (el, target, duration = 1500) => {
      const start    = performance.now();
      const startVal = 0;

      const step = (timestamp) => {
        const progress = Math.min((timestamp - start) / duration, 1);
        const ease     = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(startVal + (target - startVal) * ease);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };

      requestAnimationFrame(step);
    };

    const init = () => {
      const counters = document.querySelectorAll('[data-count]');
      if (!counters.length) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.count, 10);
            animate(entry.target, target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      counters.forEach(el => observer.observe(el));
    };

    return { init };
  })();

  /* ══════════════════════════════════════════
     INIT — DOMContentLoaded
  ══════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    TypingEffect.init();
    ScrollReveal.init();
    LocalClock.init();
    NavbarScroll.init();
    DynamicYear.init();
    MagneticButtons.init();
    ContribGrid.init();
    SmoothScroll.init();
    CountUp.init();

    // Theme toggle button click
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', ThemeManager.toggle);
    }
  });

})();
