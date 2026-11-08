import { hydrateIcons } from './icons.js';
import { mountChrome } from './chrome.js';
import { mountReveal } from './reveal.js';

mountChrome();
hydrateIcons();
mountReveal();

if (document.querySelector('[data-courses], [data-course]')) {
  const { mountCourses } = await import('./courses.js');
  await mountCourses();
}

if (document.querySelector('[data-contact-form], [data-newsletter]')) {
  const { mountForms } = await import('./forms.js');
  mountForms();
}

if (document.querySelector('[data-map]')) {
  const { mountMap } = await import('./map.js');
  mountMap();
}

if (document.querySelector('[data-apply]')) {
  const { mountAdmissions } = await import('./admissions.js');
  mountAdmissions();
}
