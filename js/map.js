const EMBED =
  'https://www.google.com/maps?q=94+Kenhar+Drive+Unit+22,+North+York,+Ontario+M9L+1N2,+Canada&output=embed';

const TITLE = 'Google Map showing 94 Kenhar Drive Unit #22, North York, Ontario M9L 1N2';

function load(container, placeholder) {
  const frame = document.createElement('iframe');
  frame.className = 'map__frame';
  frame.setAttribute('title', TITLE);
  frame.setAttribute('loading', 'lazy');
  frame.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
  frame.setAttribute('allowfullscreen', '');
  frame.setAttribute('src', EMBED);

  placeholder.remove();
  container.append(frame);
  frame.focus();
}

function mountOne(container) {
  const placeholder = container.querySelector('[data-map-placeholder]');
  const button = container.querySelector('[data-map-load]');
  if (!placeholder || !button) return;

  button.addEventListener('click', () => load(container, placeholder), { once: true });
}

export function mountMap(root = document) {
  for (const container of root.querySelectorAll('[data-map]')) mountOne(container);
}
