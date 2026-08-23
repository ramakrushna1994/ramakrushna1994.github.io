/* ============================================================
   RAMAKRUSHNA DASH — PORTFOLIO INTERACTIONS
   Counters, scroll reveals, particles, active nav, parallax
   ============================================================ */

// ----- DOM REFS -----
const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('#nav');
const themeToggle = document.querySelector('.theme-toggle');
const header = document.querySelector('.header');
const backToTop = document.querySelector('.back-to-top');

// ----- THEME -----
const applyTheme = (night) => {
  document.body.classList.toggle('night', night);
  themeToggle.setAttribute('aria-pressed', String(night));
  themeToggle.setAttribute('aria-label', night ? 'Switch to light mode' : 'Switch to dark mode');
  themeToggle.querySelector('span').textContent = night ? 'Day' : 'Night';
  themeToggle.querySelector('i').textContent = night ? '☀' : '☾';
};

const getStoredTheme = () => {
  try { return localStorage.getItem('portfolio-theme'); } catch { return null; }
};

const storeTheme = (theme) => {
  try { localStorage.setItem('portfolio-theme', theme); } catch {}
};

const storedTheme = getStoredTheme();
const prefersNight = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
applyTheme(storedTheme ? storedTheme === 'night' : prefersNight);

themeToggle.addEventListener('click', () => {
  const night = !document.body.classList.contains('night');
  applyTheme(night);
  storeTheme(night ? 'night' : 'day');
});

// ----- MOBILE MENU -----
menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

// ----- SCROLL: HEADER SHADOW + BACK-TO-TOP -----
let lastScrollY = 0;
const onScroll = () => {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 40);
  if (backToTop) backToTop.classList.toggle('visible', y > 600);
  lastScrollY = y;
};

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Hero stamp scroll
const heroStamp = document.querySelector('.hero-stamp');
if (heroStamp) {
  heroStamp.addEventListener('click', () => {
    const stats = document.querySelector('.stats') || document.querySelector('#case');
    if (stats) stats.scrollIntoView({ behavior: 'smooth' });
  });
}

// ----- ACTIVE NAV HIGHLIGHTING -----
const sections = document.querySelectorAll('section[id]');
const navLinks = navigation.querySelectorAll('a:not(.nav-button)');

const updateActiveNav = () => {
  const scrollPos = window.scrollY + 120;
  let currentId = '';

  sections.forEach((section) => {
    if (section.offsetTop <= scrollPos) {
      currentId = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      link.classList.toggle('active', href === '#' + currentId);
    }
  });
};

window.addEventListener('scroll', updateActiveNav, { passive: true });

// ----- SCROLL REVEAL -----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal-group').forEach((g) => revealObserver.observe(g));
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
document.querySelectorAll('.case-line').forEach((el) => revealObserver.observe(el));

// ----- STATS: STAGGERED REVEAL + COUNTER ANIMATION -----
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const stats = entry.target.querySelectorAll('.stat');
      stats.forEach((stat, i) => {
        setTimeout(() => {
          stat.classList.add('visible');
          animateCounter(stat.querySelector('.stat-number'));
        }, i * 150);
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) statObserver.observe(statsGrid);

function animateCounter(el) {
  if (!el) return;
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();

  const tick = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out quint
    const eased = 1 - Math.pow(1 - progress, 5);
    const current = Math.round(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

// ----- PARTICLE CANVAS -----
const canvas = document.querySelector('.hero-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;
  const PARTICLE_COUNT = 55;

  const resize = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  };

  const createParticles = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }
  };

  const draw = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      ctx.fill();
    });

    // Draw connections
    const maxDist = 100;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  };

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  // Pause particles when not visible
  const heroArt = document.querySelector('.hero-art');
  const heroObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!animId) draw();
    } else {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }, { threshold: 0 });
  heroObserver.observe(heroArt);
}
