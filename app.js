const menuButton = document.querySelector('[data-menu-button]');
const primaryNav = document.querySelector('[data-primary-nav]');

function setMenu(open) {
  if (!menuButton || !primaryNav) return;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  primaryNav.dataset.open = String(open);
  document.body.classList.toggle('menu-open', open);
}

menuButton?.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});

primaryNav?.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});

setMenu(false);
