import { renderTemplateHtml } from 'src/sections/cyberspace/template-studio/lib/render-template';

import { renderDslToReact } from './jsx-renderer';
import { TEMPLATE_ENGINES } from '../../model/node-types';

export function renderTemplateContent(studioTemplate, runtimeData) {
  if (!studioTemplate?.document) return null;

  if (studioTemplate.engine === TEMPLATE_ENGINES.LEGACY_HTML) {
    return renderTemplateHtml(studioTemplate.document, runtimeData.inputs);
  }

  return renderDslToReact(studioTemplate.document, runtimeData);
}
