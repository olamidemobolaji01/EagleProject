const THRESHOLD = 0.15;
const ROOT_MARGIN = '0px 0px -10%';

export function mountReveal(root = document) {
  const targets = [...root.querySelectorAll('[data-reveal]')];
  if (!targets.length) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced || !('IntersectionObserver' in window)) {
    for (const target of targets) target.classList.add('is-visible');
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { threshold: THRESHOLD, rootMargin: ROOT_MARGIN }
  );

  for (const target of targets) observer.observe(target);
}
