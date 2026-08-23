const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('#nav');
const themeToggle = document.querySelector('.theme-toggle');

const applyTheme = (night) => {
  document.body.classList.toggle('night', night);
  themeToggle.setAttribute('aria-pressed', String(night));
  themeToggle.setAttribute('aria-label', night ? 'Switch to light mode' : 'Switch to dark mode');
  themeToggle.querySelector('span').textContent = night ? 'Day' : 'Night';
  themeToggle.querySelector('i').textContent = night ? '☀' : '☾';
};

const storedTheme = localStorage.getItem('portfolio-theme');
applyTheme(storedTheme ? storedTheme === 'night' : window.matchMedia('(prefers-color-scheme: dark)').matches);

themeToggle.addEventListener('click', () => {
  const night = !document.body.classList.contains('night');
  applyTheme(night);
  localStorage.setItem('portfolio-theme', night ? 'night' : 'day');
});

menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal-group').forEach((group) => observer.observe(group));
