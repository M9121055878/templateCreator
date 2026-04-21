import { TEMPLATE_ENGINES } from './node-types';

export const DEFAULT_TEMPLATE_VERSION = '1.0.0';

export const DEFAULT_TEMPLATE_META = {
  recommendedFormat: 'jpg',
  hasTransparency: false,
  tags: [],
};

export const DEFAULT_TEMPLATE_ENGINE = TEMPLATE_ENGINES.DSL_V1;

export const DEFAULT_INPUT_TYPES = ['text', 'image', 'select', 'color'];
