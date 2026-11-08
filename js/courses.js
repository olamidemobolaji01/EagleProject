import { iconSvg } from './icons.js';
import { mountReveal } from './reveal.js';

const DATA_URL = 'data/courses.json';
const SITE_URL = 'https://eaglegenbibleschool.com/';
const SITE_NAME = 'Eagle Generation Bible School';

function esc(value) {
  return String(value).replace(/[&<>"]/g, (ch) => `&#${ch.charCodeAt(0)};`);
}

function attr(selector, name, value) {
  document.querySelector(selector)?.setAttribute(name, value);
}

function programmeCard(programme) {
  return `<article class="card" data-reveal>
      <span class="icon-tile">${iconSvg(programme.icon)}</span>
      <h3 class="card__title">${esc(programme.title)}</h3>
      <p>${esc(programme.summary)}</p>
      <p class="card__meta"><span>${esc(programme.duration)}</span></p>
      <a class="link-arrow" href="course.html?id=${encodeURIComponent(programme.id)}">Learn more${iconSvg('arrow-right')}</a>
    </article>`;
}

function roadmapCard(semester, index) {
  return `<li class="step" data-reveal style="--i: ${index}">
      <span class="step__num">${index + 1}</span>
      <h3 class="step__title">${esc(semester.label)}</h3>
      <p class="course-roadmap__programme">${esc(semester.programme)}</p>
      <p>${esc(semester.summary)}</p>
    </li>`;
}

function renderIndex(root, data) {
  const mount = root.querySelector('[data-course-list]') ?? root;
  const roadmap = document.querySelector('[data-roadmap]');
  const status = document.querySelector('[data-course-status]');

  mount.innerHTML = `<div class="grid grid--3">${data.programmes.map(programmeCard).join('')}</div>`;
  mountReveal(mount);

  if (roadmap) {
    roadmap.innerHTML = data.semesters.map(roadmapCard).join('');
    mountReveal(roadmap);
  }

  if (status) {
    status.textContent = `${data.programmes.length} programmes across ${data.semesters.length} semesters.`;
  }
}

function setDetailMeta(programme) {
  const title = `${programme.title} — ${SITE_NAME}`;
  const url = `${SITE_URL}course.html?id=${encodeURIComponent(programme.id)}`;

  document.title = title;
  attr('meta[name="description"]', 'content', programme.summary);
  attr('link[rel="canonical"]', 'href', url);
  attr('meta[property="og:title"]', 'content', title);
  attr('meta[property="og:description"]', 'content', programme.summary);
  attr('meta[property="og:url"]', 'content', url);
  attr('meta[name="twitter:title"]', 'content', title);
  attr('meta[name="twitter:description"]', 'content', programme.summary);
}

function tuitionMarkup(programme) {
  if (programme.included) {
    return `<p class="course__tuition">Included</p>
      <p class="card__meta">Runs alongside both years at no extra cost</p>`;
  }

  const ngn = programme.tuitionNgn ? `<span>${esc(programme.tuitionNgn)}</span>` : '';
  return `<p class="course__tuition">$${programme.tuitionUsd.toLocaleString('en-US')}</p>
    <p class="card__meta">${ngn}</p>
    <p>Paid by bank transfer before the semester opens. Instalments are available.</p>`;
}

function detailMarkup(programme) {
  const outcomes = programme.outcomes
    .map((outcome) => `<li>${iconSvg('check')}<span>${esc(outcome)}</span></li>`)
    .join('');

  const modules = programme.modules
    .map(
      (module) => `<li>
          <h3>${esc(module.title)}</h3>
          <ul class="course-module__lessons" role="list">${module.lessons
            .map((lesson) => `<li>${esc(lesson)}</li>`)
            .join('')}</ul>
        </li>`
    )
    .join('');

  const lessonCount = programme.modules.reduce((total, module) => total + module.lessons.length, 0);

  return `<div class="container">
      <p class="course__breadcrumb"><a href="courses.html">${iconSvg('arrow-left')}Back to Programs</a></p>
      <p class="eyebrow">${esc(programme.category)}</p>
      <h1>${esc(programme.title)}</h1>
      <p class="lede">${esc(programme.description)}</p>
      <ul class="course__badges" role="list">
        <li class="badge">${iconSvg('clock')}${esc(programme.duration)}</li>
        <li class="badge">${iconSvg('book-open')}${lessonCount} lessons</li>
        <li class="badge">${iconSvg('globe')}${esc(programme.format)}</li>
      </ul>
      <div class="course__body">
        <section class="course__main">
          <h2>What you will study</h2>
          <ol class="course-modules" role="list">${modules}</ol>
          <h2>Learning outcomes</h2>
          <ul class="checklist" role="list">${outcomes}</ul>
        </section>
        <aside class="card course__aside">
          <h2 class="card__title">Tuition</h2>
          ${tuitionMarkup(programme)}
          <a class="btn btn--dark" href="admissions.html">Apply now${iconSvg('arrow-right')}</a>
          <p class="card__meta">Email study@EagleGenBibleSchool.com for current fees</p>
        </aside>
      </div>
    </div>`;
}

function renderDetail(root, data) {
  const id = new URLSearchParams(location.search).get('id');
  const programme = data.programmes.find((candidate) => candidate.id === id);

  if (!programme) {
    location.replace('404.html');
    return;
  }

  setDetailMeta(programme);
  root.innerHTML = detailMarkup(programme);
  mountReveal(root);
}

function renderError(root) {
  root.innerHTML = `<div class="container">
      <p class="course-error">The programmes could not be loaded. Please refresh the page, or <a href="contact.html">contact us</a> if it keeps happening.</p>
    </div>`;
}

export async function mountCourses() {
  const index = document.querySelector('[data-courses]');
  const detail = document.querySelector('[data-course]');
  const root = index ?? detail;
  if (!root) return;

  const list = index?.querySelector('[data-course-list]');
  if (list) list.innerHTML = '<p class="course-empty">Loading programmes…</p>';

  let data;

  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(String(response.status));
    data = await response.json();
  } catch {
    renderError(root);
    return;
  }

  if (index) renderIndex(index, data);
  else renderDetail(detail, data);
}
