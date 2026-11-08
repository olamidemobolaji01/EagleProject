import { iconSvg } from './icons.js';

const SITE = {
  name: 'Eagle Generation Bible School',
  short: 'Eagle Generation',
  phone: '+1 416 616 2425',
  phoneHref: 'tel:+14166162425',
  phoneNg: '+234 806 049 9030',
  phoneNgHref: 'tel:+2348060499030',
  email: 'study@EagleGenBibleSchool.com',
  address: ['94 Kenhar Drive Unit #22', 'North York, Ontario M9L 1N2', 'Canada'],
};

const NAV = [
  { label: 'Home', href: 'index.html' },
  { label: 'About Us', href: 'about.html', menu: [{ label: 'Faculty', href: 'our-faculty.html' }] },
  { label: 'Programs', href: 'courses.html' },
  { label: 'Admissions', href: 'admissions.html' },
  { label: 'Resources', href: 'resources.html', menu: [{ label: 'FAQs', href: 'faq.html' }] },
  { label: 'Contact', href: 'contact.html' },
];

const FOOTER_LINKS = [
  { label: 'Programs', href: 'courses.html' },
  { label: 'About Us', href: 'about.html' },
  { label: 'Admissions', href: 'admissions.html' },
  { label: 'Resources', href: 'resources.html' },
  { label: 'FAQs', href: 'faq.html' },
  { label: 'Contact', href: 'contact.html' },
];

const MARK =
  '<svg class="brand__mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" ' +
  'fill="currentColor" aria-hidden="true" focusable="false">' +
  '<path d="M24 4c-1.9 0-3.6 1-4.6 2.6L17 11l-2.4-1.6a1.6 1.6 0 0 0-2.4 1.8l1.3 4.6-11.1 9.5a1.6 1.6 0 0 0 1.3 2.8l9.6-1.6-6 8.9a1.6 1.6 0 0 0 2 2.3l12.1-5.4c.9-.4 1.9-.4 2.8 0l12.1 5.4a1.6 1.6 0 0 0 2-2.3l-6-8.9 9.6 1.6a1.6 1.6 0 0 0 1.3-2.8l-11.1-9.5 1.3-4.6a1.6 1.6 0 0 0-2.4-1.8L31 11l-2.4-4.4A5.3 5.3 0 0 0 24 4z"/>' +
  '<path d="M24 30.5c-.8 0-1.5.5-1.8 1.2l-3.6 9.1a1.3 1.3 0 0 0 1.8 1.6l3.6-1.9 3.6 1.9a1.3 1.3 0 0 0 1.8-1.6l-3.6-9.1a1.9 1.9 0 0 0-1.8-1.2z"/>' +
  '</svg>';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

function currentPage() {
  const last = location.pathname.split('/').pop();
  return last === '' ? 'index.html' : last;
}

function current(href, page) {
  return href === page ? ' aria-current="page"' : '';
}

function brand(href = 'index.html') {
  return `<a class="brand" href="${href}">
        ${MARK}
        <span class="brand__text">
          <span class="brand__name">${SITE.short}</span>
          <span class="brand__sub">Bible School</span>
        </span>
      </a>`;
}

function navItem(item, page) {
  if (!item.menu) {
    return `<li class="nav__item">
            <a class="nav__link" href="${item.href}"${current(item.href, page)}>${item.label}</a>
          </li>`;
  }

  const id = `nav-menu-${item.href.replace('.html', '')}`;
  const subs = item.menu
    .map(
      (sub) => `<li>
                <a class="nav__sublink" href="${sub.href}"${current(sub.href, page)}>${sub.label}</a>
              </li>`
    )
    .join('');

  return `<li class="nav__item nav__item--menu" data-dropdown>
            <a class="nav__link" href="${item.href}"${current(item.href, page)}>${item.label}</a>
            <button class="nav__chevron" type="button" aria-expanded="false" aria-controls="${id}" data-dropdown-toggle>
              <span class="visually-hidden">${item.label} submenu</span>
              ${iconSvg('chevron-down', 'icon nav__chevron-icon')}
            </button>
            <ul class="nav__dropdown" id="${id}">${subs}</ul>
          </li>`;
}

function headerMarkup(page) {
  return `<div class="announce">
    <div class="container announce__inner">
      ${iconSvg('calendar', 'icon')}
      <p class="announce__text"><strong>Apply for the November 2026 Intake</strong><span>Applications close October 30, 2026</span></p>
      <a class="btn btn--gold btn--sm" href="admissions.html">Apply Now${iconSvg('arrow-right')}</a>
    </div>
  </div>
  <header class="site-header" data-header>
    <div class="container site-header__inner">
      ${brand()}
      <div class="site-nav" id="site-nav" data-nav>
        <nav class="nav" aria-label="Primary">
          <ul class="nav__list">
            ${NAV.map((item) => navItem(item, page)).join('')}
          </ul>
        </nav>
        <div class="nav__actions">
          <a class="btn btn--gold" href="#" data-unavailable aria-disabled="true" title="The student portal is not available in this static replica">Student Portal</a>
          <a class="btn btn--dark" href="admissions.html">Apply Now</a>
        </div>
      </div>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-nav-toggle>
        <span class="visually-hidden">Menu</span>
        ${iconSvg('menu', 'icon nav-toggle__open')}
        ${iconSvg('x', 'icon nav-toggle__close')}
      </button>
    </div>
  </header>`;
}

function footerMarkup(page) {
  const links = FOOTER_LINKS
    .map(
      (item) => `<li>
              <a href="${item.href}"${current(item.href, page)}>${item.label}</a>
            </li>`
    )
    .join('');

  return `<footer class="site-footer grain">
    <div class="container site-footer__inner">
      <div class="site-footer__brand">
        ${brand()}
        <p class="site-footer__blurb">Equipping believers to soar into their divine purpose through Spirit-filled, grace-based biblical education.</p>
      </div>

      <nav class="site-footer__col" aria-label="Footer">
        <h2 class="site-footer__heading">Explore</h2>
        <ul class="site-footer__links">${links}</ul>
      </nav>

      <div class="site-footer__col">
        <h2 class="site-footer__heading">Contact</h2>
        <ul class="site-footer__contact">
          <li>${iconSvg('map-pin')}<span>${SITE.address.join('<br>')}</span></li>
          <li>${iconSvg('mail')}<a href="mailto:${SITE.email}">${SITE.email}</a></li>
          <li>${iconSvg('phone')}<span><a href="${SITE.phoneHref}">${SITE.phone}</a><small>Canada</small></span></li>
          <li>${iconSvg('phone')}<span><a href="${SITE.phoneNgHref}">${SITE.phoneNg}</a><small>Nigeria</small></span></li>
        </ul>
      </div>

      <div class="site-footer__col">
        <h2 class="site-footer__heading">Newsletter</h2>
        <p class="site-footer__blurb">Receive updates on programs, events and inspiration.</p>
        <form class="newsletter" data-newsletter novalidate>
          <label class="visually-hidden" for="newsletter-email">Email address</label>
          <input class="newsletter__input" id="newsletter-email" name="email" type="email" autocomplete="email" placeholder="Your email address" required>
          <button class="newsletter__submit" type="submit">
            <span class="visually-hidden">Subscribe</span>
            ${iconSvg('arrow-right')}
          </button>
          <p class="newsletter__status" id="newsletter-status" data-newsletter-status role="status"></p>
        </form>
      </div>
    </div>

    <div class="container site-footer__bottom">
      <p>&copy; ${new Date().getFullYear()} ${SITE.name}. All rights reserved.</p>
      <ul class="site-footer__legal">
        <li><a href="terms.html"${current('terms.html', page)}>Terms of Service</a></li>
        <li><a href="privacy.html"${current('privacy.html', page)}>Privacy Policy</a></li>
      </ul>
    </div>
  </footer>`;
}

function wireScrollState() {
  const header = document.querySelector('[data-header]');
  let queued = false;

  const update = () => {
    queued = false;
    header.toggleAttribute('data-scrolled', window.scrollY > 8);
  };

  addEventListener(
    'scroll',
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    },
    { passive: true }
  );

  update();
}

function wireMobileNav() {
  const toggle = document.querySelector('[data-nav-toggle]');
  const panel = document.querySelector('[data-nav]');
  const desktop = matchMedia('(min-width: 1024px)');
  const root = document.documentElement;

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    panel.toggleAttribute('data-open', open);
    root.classList.toggle('is-nav-open', open);
  };

  toggle.addEventListener('click', () => {
    const next = !isOpen();
    setOpen(next);
    if (next) panel.querySelector(FOCUSABLE)?.focus();
  });

  panel.addEventListener('click', (event) => {
    if (event.target.closest('a[href]')) setOpen(false);
  });

  addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !isOpen()) return;
    setOpen(false);
    toggle.focus();
  });

  panel.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab' || !isOpen()) return;

    const stops = [toggle, ...panel.querySelectorAll(FOCUSABLE)].filter(
      (el) => el.offsetWidth || el.offsetHeight
    );
    const first = stops[0];
    const last = stops[stops.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  desktop.addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}

function wireDropdowns() {
  const items = [...document.querySelectorAll('[data-dropdown]')];
  const pointer = matchMedia('(hover: hover)');
  const desktop = matchMedia('(min-width: 1024px)');

  const inside = (item, node) => node instanceof Node && item.contains(node);

  const close = (item) => {
    item.removeAttribute('data-open');
    item.querySelector('[data-dropdown-toggle]').setAttribute('aria-expanded', 'false');
  };

  const open = (item) => {
    for (const other of items) if (other !== item) close(other);
    item.setAttribute('data-open', '');
    item.querySelector('[data-dropdown-toggle]').setAttribute('aria-expanded', 'true');
  };

  for (const item of items) {
    const toggle = item.querySelector('[data-dropdown-toggle]');

    toggle.addEventListener('click', () => {
      if (item.hasAttribute('data-open')) close(item);
      else open(item);
    });

    item.addEventListener('mouseenter', () => {
      if (pointer.matches && desktop.matches) open(item);
    });

    item.addEventListener('mouseleave', () => {
      if (pointer.matches && desktop.matches) close(item);
    });

    item.addEventListener('focusout', (event) => {
      if (!inside(item, event.relatedTarget)) close(item);
    });
  }

  addEventListener('pointerdown', (event) => {
    for (const item of items) if (!inside(item, event.target)) close(item);
  });

  addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    for (const item of items) {
      if (!item.hasAttribute('data-open')) continue;
      close(item);
      item.querySelector('[data-dropdown-toggle]').focus();
    }
  });
}

function wirePortalStub() {
  document.querySelector('[data-unavailable]')?.addEventListener('click', (event) => {
    event.preventDefault();
  });
}

export function mountChrome() {
  const page = currentPage();
  const header = document.querySelector('[data-chrome="header"]');
  const footer = document.querySelector('[data-chrome="footer"]');

  if (footer) footer.innerHTML = footerMarkup(page);
  if (!header) return;

  header.innerHTML = headerMarkup(page);
  wireScrollState();
  wireMobileNav();
  wireDropdowns();
  wirePortalStub();
}
