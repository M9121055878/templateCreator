import tpl110Meta from './tpl-110/meta.json';
import tpl120Meta from './tpl-120/meta.json';
import tpl130Meta from './tpl-130/meta.json';
import tpl131Meta from './tpl-131/meta.json';
import tpl110Assets from './tpl-110/assets.json';
import tpl110Layout from './tpl-110/layout.json';
import tpl110Schema from './tpl-110/schema.json';
import tpl120Assets from './tpl-120/assets.json';
import tpl120Layout from './tpl-120/layout.json';
import tpl120Schema from './tpl-120/schema.json';
import tpl130Assets from './tpl-130/assets.json';
import tpl130Layout from './tpl-130/layout.json';
import tpl130Schema from './tpl-130/schema.json';
import tpl131Assets from './tpl-131/assets.json';
import tpl131Layout from './tpl-131/layout.json';
import tpl131Schema from './tpl-131/schema.json';

function composeTemplateDocument(meta, schema, layout, assets) {
  return {
    ...meta,
    inputs: schema.inputs,
    layout,
    assets,
  };
}

export const dslTemplateDocumentsV1 = [
  composeTemplateDocument(tpl110Meta, tpl110Schema, tpl110Layout, tpl110Assets),
  composeTemplateDocument(tpl120Meta, tpl120Schema, tpl120Layout, tpl120Assets),
  composeTemplateDocument(tpl130Meta, tpl130Schema, tpl130Layout, tpl130Assets),
  composeTemplateDocument(tpl131Meta, tpl131Schema, tpl131Layout, tpl131Assets)
];
