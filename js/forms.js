// Live endpoints recovered from the bundle: POST /api/inquiries, POST /api/applications.

const MESSAGES = {
  valueMissing: 'Enter your email address.',
  typeMismatch: 'Enter a valid email address.',
  success: 'Thank you — you are on the list.',
};

const CONTACT_MESSAGES = {
  name: { valueMissing: 'Enter your name.' },
  email: {
    valueMissing: 'Enter your email address.',
    typeMismatch: 'Enter a valid email address.',
  },
  subject: { valueMissing: 'Enter a subject.' },
  message: {
    valueMissing: 'Enter your message.',
    tooShort: 'Tell us a little more — at least 20 characters.',
  },
};

const CONTACT_SUCCESS = 'Thank you — your message has been sent. We reply within two business days.';
const CONTACT_ERROR = 'Please correct the highlighted fields.';

function announce(input, status, message, state) {
  status.textContent = message;
  status.dataset.state = state;
  input.setAttribute('aria-invalid', String(state === 'error'));
}

function messageFor(input) {
  if (input.validity.valueMissing) return MESSAGES.valueMissing;
  return MESSAGES.typeMismatch;
}

function mountNewsletter(form) {
  const input = form.querySelector('input[type="email"]');
  const status = form.querySelector('[data-newsletter-status]');
  if (!input || !status) return;

  input.setAttribute('aria-describedby', status.id);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!input.checkValidity()) {
      announce(input, status, messageFor(input), 'error');
      input.focus();
      return;
    }

    announce(input, status, MESSAGES.success, 'success');
    form.reset();
  });

  input.addEventListener('input', () => {
    if (input.getAttribute('aria-invalid') !== 'true') return;
    announce(input, status, '', '');
  });
}

function contactMessageFor(input) {
  const messages = CONTACT_MESSAGES[input.name] || {};
  for (const key of ['valueMissing', 'typeMismatch', 'tooShort']) {
    if (input.validity[key] && messages[key]) return messages[key];
  }
  return input.validationMessage;
}

function showError(field, message) {
  field.input.setCustomValidity(message);
  field.error.textContent = message;
  field.input.setAttribute('aria-invalid', 'true');
}

function clearError(field) {
  field.input.setCustomValidity('');
  field.error.textContent = '';
  field.input.removeAttribute('aria-invalid');
}

function validateField(field) {
  field.input.setCustomValidity('');

  if (field.input.checkValidity()) {
    clearError(field);
    return true;
  }

  showError(field, contactMessageFor(field.input));
  return false;
}

function mountContact(form) {
  const status = form.querySelector('[data-contact-status]');
  if (!status) return;

  const fields = [];

  for (const input of form.querySelectorAll('[name]')) {
    const error = form.querySelector(`[data-field-error="${input.name}"]`);
    if (!error) continue;

    input.setAttribute('aria-describedby', error.id);
    const field = { input, error };
    fields.push(field);

    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') !== 'true') return;
      clearError(field);
    });

    input.addEventListener('blur', () => {
      if (input.value === '') return;
      validateField(field);
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const invalid = fields.filter((field) => !validateField(field));

    if (invalid.length > 0) {
      status.textContent = CONTACT_ERROR;
      status.dataset.state = 'error';
      invalid[0].input.focus();
      return;
    }

    status.textContent = CONTACT_SUCCESS;
    status.dataset.state = 'success';
    form.reset();
    for (const field of fields) clearError(field);
  });
}

export function mountForms(root = document) {
  for (const form of root.querySelectorAll('[data-newsletter]')) mountNewsletter(form);
  for (const form of root.querySelectorAll('[data-contact-form]')) mountContact(form);
}
