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

const newestFirst = (a, b) => (b.date || b.year).localeCompare(a.date || a.year) || b.title.localeCompare(a.title);

function createEvidenceCard(item) {
  const link = document.createElement('a');
  link.className = 'evidence-card';
  link.href = item.url || `/${item.image}`;
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.setAttribute('aria-label', `Open evidence preview: ${item.title}`);
  const figure = document.createElement('figure');
  const frame = document.createElement('div');
  frame.className = 'image-frame';
  const image = document.createElement('img');
  if (item.image) {
    image.src = `/${item.image}`;
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    frame.append(image);
  } else {
    frame.classList.add('external-evidence');
    frame.textContent = 'Credly badge';
  }
  const caption = document.createElement('figcaption');
  const year = document.createElement('span');
  year.textContent = item.year;
  const title = document.createElement('strong');
  title.textContent = item.title;
  caption.append(year, title);
  figure.append(frame, caption);
  link.append(figure);
  return link;
}

function renderArchive(target, items) {
  const groups = items.reduce((map, item) => map.set(item.year, [...(map.get(item.year) || []), item]), new Map());
  target.replaceChildren(...[...groups].map(([year, records]) => {
    const group = document.createElement('div');
    group.className = 'archive-year';
    const heading = document.createElement('strong');
    heading.textContent = year;
    const list = document.createElement('ul');
    records.forEach((item) => {
      const entry = document.createElement('li');
      const link = document.createElement('a');
      link.href = item.url || `/${item.image}`;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.textContent = item.title;
      entry.append(link);
      list.append(entry);
    });
    group.append(heading, list);
    return group;
  }));
}

async function loadRecognition() {
  const targets = [...document.querySelectorAll('[data-evidence-preview]')];
  if (!targets.length) return;
  try {
    const response = await fetch('/assets/recognition/manifest.json');
    if (!response.ok) throw new Error('Recognition manifest unavailable');
    const items = (await response.json()).sort(newestFirst);
    targets.forEach((target) => {
      const category = target.dataset.evidencePreview;
      const selected = items.filter((item) => item.category === category);
      target.replaceChildren(...selected.slice(0, 3).map(createEvidenceCard));
      const archive = document.querySelector(`[data-evidence-archive="${category}"]`);
      if (archive) renderArchive(archive, selected);
    });
  } catch {
    targets.forEach((target) => { target.textContent = 'Recognition previews are unavailable.'; });
  }
}

loadRecognition();
