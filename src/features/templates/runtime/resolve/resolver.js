import { resolveTokenValue } from './tokens';
import { parseTemplateDocument } from '../../schema/template.schema';
import { createUserInputSchemaFromTemplate } from '../../schema/input.schema';

function getInputDefaults(templateDocument) {
  return (templateDocument.inputs ?? []).reduce((acc, input) => {
    acc[input.key] = input.default ?? '';
    return acc;
  }, {});
}

export function resolveTemplateRuntime(templateDocument, rawUserInputs = {}) {
  const parsedTemplate = parseTemplateDocument(templateDocument);
  const defaults = getInputDefaults(parsedTemplate);
  const mergedInputs = { ...defaults, ...rawUserInputs };

  const inputSchema = createUserInputSchemaFromTemplate(parsedTemplate);
  const validatedInputs = inputSchema.parse(mergedInputs);

  return {
    template: parsedTemplate,
    inputs: validatedInputs,
    assets: parsedTemplate.assets ?? {},
  };
}

export function resolveDslNode(node, runtimeData) {
  if (!node) return node;

  return {
    ...node,
    text: resolveTokenValue(node.text, runtimeData),
    src: resolveTokenValue(node.src, runtimeData),
    style: Object.fromEntries(
      Object.entries(node.style ?? {}).map(([key, value]) => [
        key,
        typeof value === 'string' ? resolveTokenValue(value, runtimeData) : value,
      ])
    ),
  };
}
