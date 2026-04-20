const htmlEscapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(text) {
  return String(text ?? '').replace(/[&<>"']/g, (char) => htmlEscapeMap[char]);
}

function resolveInputValue(input, values) {
  const rawValue = values?.[input.name];

  if (rawValue === null || rawValue === undefined || rawValue === '') {
    return input.default ?? '';
  }

  return rawValue;
}

export function createInitialValues(template) {
  return (template?.inputs ?? []).reduce((acc, input) => {
    acc[input.name] = input.default ?? '';
    return acc;
  }, {});
}

export function renderTemplateHtml(template, values) {
  if (!template?.html) return '';

  const allowedInputNames = new Set((template.inputs ?? []).map((item) => item.name));

  return template.html.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, inputName) => {
    if (!allowedInputNames.has(inputName)) return '';

    const input = template.inputs.find((item) => item.name === inputName);
    const value = resolveInputValue(input, values);

    if (input.type === 'image') return String(value);

    return escapeHtml(value);
  });
}
