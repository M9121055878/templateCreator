import { TEMPLATE_STATUS, TEMPLATE_ENGINES } from '../model/node-types';

function toInputDefinition(input) {
  return {
    key: input.name,
    name: input.name,
    type: input.type,
    label: input.label,
    placeholder: input.placeholder,
    required: Boolean(input.required),
    default: input.default,
    maxLength: input.maxLength,
    accept: input.accept,
    crop:
      input.width && input.height
        ? {
            w: input.width,
            h: input.height,
          }
        : undefined,
    options: input.options,
  };
}

export function mapLegacyTemplateToDocument(legacyTemplate) {
  return {
    id: `tpl-${legacyTemplate.id}`,
    version: '1.0.0',
    status: TEMPLATE_STATUS.ACTIVE,
    engine: TEMPLATE_ENGINES.LEGACY_HTML,
    meta: {
      title: legacyTemplate.name,
      category: String(legacyTemplate.category ?? 'general').toLowerCase().replace(/\s+/g, '-'),
      size: {
        width: legacyTemplate.width,
        height: legacyTemplate.height,
      },
      recommendedFormat: legacyTemplate.recommendedFormat ?? 'jpg',
      hasTransparency: Boolean(legacyTemplate.hasTransparency),
      tags: [],
    },
    inputs: (legacyTemplate.inputs ?? []).map(toInputDefinition),
    html: legacyTemplate.html,
  };
}

export function mapLegacyTemplatesToDocuments(legacyTemplates) {
  return (legacyTemplates ?? []).map(mapLegacyTemplateToDocument);
}
