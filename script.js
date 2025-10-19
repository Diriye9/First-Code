const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('#nav-menu');
const yearEl = document.getElementById('year');

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('show');
  });
}
