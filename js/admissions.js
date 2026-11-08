const STEP_FIELDS = [
  ['full_name', 'email', 'phone', 'country'],
  ['church', 'education'],
  ['statement_of_faith'],
  ['program'],
];

const MESSAGES = {
  full_name: 'Enter your full name.',
  email: 'Enter your email address.',
  phone: 'Enter a phone number we can reach you on.',
  country: 'Tell us which country and city you are in.',
  church: 'Tell us your home church or ministry.',
  education: 'Tell us about your studies or ministry experience.',
  statement_of_faith: 'Share your testimony and why you want to study with us.',
  program: 'Choose a program.',
};

function reference() {
  const n = Math.floor(Math.random() * 36 ** 5).toString(36).toUpperCase().padStart(5, '0');
  return `EGBS-${new Date().getFullYear()}-${n}`;
}

function messageFor(input) {
  if (input.validity.typeMismatch) return 'Enter a valid email address.';
  return MESSAGES[input.name] ?? 'This field is required.';
}

export function mountAdmissions(root = document) {
  const wrap = root.querySelector('[data-apply]');
  if (!wrap) return;

  const form = wrap.querySelector('[data-apply-form]');
  const done = wrap.querySelector('[data-apply-done]');
  const status = wrap.querySelector('[data-apply-status]');
  const back = wrap.querySelector('[data-apply-back]');
  const next = wrap.querySelector('[data-apply-next]');
  const submit = wrap.querySelector('[data-apply-submit]');
  const panels = [...wrap.querySelectorAll('[data-step]')];
  const dots = [...wrap.querySelectorAll('[data-step-dot]')];
  if (!form || !panels.length) return;

  let current = 0;

  const fieldOf = (name) => ({
    input: form.querySelector(`[name="${name}"]`),
    error: form.querySelector(`[data-field-error="${name}"]`),
  });

  for (const name of STEP_FIELDS.flat()) {
    const { input, error } = fieldOf(name);
    if (!input || !error) continue;
    input.setAttribute('aria-describedby', error.id);
    const clear = () => {
      if (input.getAttribute('aria-invalid') !== 'true') return;
      input.setCustomValidity('');
      input.removeAttribute('aria-invalid');
      error.textContent = '';
    };
    input.addEventListener('input', clear);
    input.addEventListener('change', clear);
  }

  function validateStep(index) {
    const invalid = [];

    for (const name of STEP_FIELDS[index]) {
      const { input, error } = fieldOf(name);
      if (!input || !error) continue;
      input.setCustomValidity('');

      if (input.value.trim() && input.checkValidity()) {
        input.removeAttribute('aria-invalid');
        error.textContent = '';
        continue;
      }

      const message = messageFor(input);
      input.setCustomValidity(message);
      input.setAttribute('aria-invalid', 'true');
      error.textContent = message;
      invalid.push(input);
    }

    return invalid;
  }

  function show(index, moveFocus = true) {
    current = index;

    panels.forEach((panel, i) => panel.toggleAttribute('hidden', i !== index));
    dots.forEach((dot, i) => {
      dot.toggleAttribute('data-complete', i < index);
      if (i === index) dot.setAttribute('aria-current', 'step');
      else dot.removeAttribute('aria-current');
    });

    const last = index === panels.length - 1;
    back.disabled = index === 0;
    next.hidden = last;
    submit.hidden = !last;
    status.textContent = '';
    status.removeAttribute('data-state');

    if (moveFocus) panels[index].querySelector('input, textarea, select')?.focus();
  }

  function advance() {
    const invalid = validateStep(current);
    if (invalid.length) {
      status.textContent = 'Please complete the highlighted fields.';
      status.dataset.state = 'error';
      invalid[0].focus();
      return false;
    }
    return true;
  }

  next.addEventListener('click', () => {
    if (advance()) show(current + 1);
  });

  back.addEventListener('click', () => {
    if (current > 0) show(current - 1);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!advance()) return;

    const stillInvalid = STEP_FIELDS.flatMap((_, i) => validateStep(i));
    if (stillInvalid.length) {
      const step = STEP_FIELDS.findIndex((names) => names.includes(stillInvalid[0].name));
      show(step);
      status.textContent = 'Please complete the highlighted fields.';
      status.dataset.state = 'error';
      stillInvalid[0].focus();
      return;
    }

    wrap.querySelector('[data-apply-ref]').textContent = reference();
    form.hidden = true;
    wrap.querySelector('.stepper').hidden = true;
    done.hidden = false;
    done.focus?.();
  });

  show(0, false);
}
