import { z } from 'zod';

import { InputDefinitionSchema } from './input.schema';
import { SHAPE_TYPES, DSL_NODE_TYPES, TEMPLATE_STATUS, TEMPLATE_ENGINES } from '../model/node-types';

const NodeTypeSchema = z.enum(Object.values(DSL_NODE_TYPES));

const BaseNodeSchema = z.object({
  id: z.string().min(1),
  type: NodeTypeSchema,
  x: z.number(),
  y: z.number(),
  w: z.number().positive(),
  h: z.number().positive(),
  style: z.record(z.any()).optional(),
  children: z.array(z.string()).optional(),
});

const LayoutRootSchema = BaseNodeSchema.extend({
  type: z.enum([DSL_NODE_TYPES.FRAME, DSL_NODE_TYPES.GROUP]),
  children: z.array(z.string()),
});

const LayoutNodeSchema = BaseNodeSchema.extend({
  text: z.string().optional(),
  src: z.string().optional(),
  shape: z.enum(Object.values(SHAPE_TYPES)).optional(),
});

const LegacyTemplateSchema = z.object({
  html: z.string().min(1),
});

const DslTemplateSchema = z.object({
  layout: z.object({
    root: LayoutRootSchema,
    nodes: z.record(LayoutNodeSchema),
  }),
  assets: z.record(z.string()).default({}),
});

const TemplateMetaSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  size: z.object({
    width: z.number().positive(),
    height: z.number().positive(),
  }),
  recommendedFormat: z.enum(['jpg', 'png']).default('jpg'),
  hasTransparency: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

export const TemplateDocumentSchema = z
  .object({
    id: z.string().regex(/^tpl-\d+$/),
    version: z.string().regex(/^\d+\.\d+\.\d+$/),
    status: z.enum(Object.values(TEMPLATE_STATUS)).default(TEMPLATE_STATUS.ACTIVE),
    engine: z.enum(Object.values(TEMPLATE_ENGINES)),
    meta: TemplateMetaSchema,
    inputs: z.array(InputDefinitionSchema),
  })
  .and(z.union([LegacyTemplateSchema, DslTemplateSchema]));

export function parseTemplateDocument(templateDocument) {
  return TemplateDocumentSchema.parse(templateDocument);
}
