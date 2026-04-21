import { templateConfigs } from 'src/sections/cyberspace/template-studio/data/templates';

import { dslTemplateDocumentsV1 } from '../templates/v1';
import { parseTemplateDocument } from '../schema/template.schema';
import { mapLegacyTemplatesToDocuments } from '../adapters/legacy-html-adapter';

function toStudioTemplate(templateDocument) {
  const parsed = parseTemplateDocument(templateDocument);

  return {
    id: parsed.id,
    name: parsed.meta.title,
    description: parsed.meta.tags?.join('، ') || parsed.meta.title,
    category: parsed.meta.category,
    width: parsed.meta.size.width,
    height: parsed.meta.size.height,
    hasTransparency: parsed.meta.hasTransparency,
    recommendedFormat: parsed.meta.recommendedFormat,
    inputs: (parsed.inputs ?? []).map((input) => ({
      ...input,
      name: input.key,
      width: input.crop?.w,
      height: input.crop?.h,
    })),
    engine: parsed.engine,
    version: parsed.version,
    status: parsed.status,
    document: parsed,
  };
}

export function getTemplateRegistry(options = {}) {
  const { includeLegacy = false } = options;

  const legacyTemplates = includeLegacy ? mapLegacyTemplatesToDocuments(templateConfigs) : [];
  const allDocuments = [...dslTemplateDocumentsV1, ...legacyTemplates];

  return allDocuments.map(toStudioTemplate);
}

export function getTemplateById(templateId, options = {}) {
  return getTemplateRegistry(options).find((template) => template.id === templateId) ?? null;
}
