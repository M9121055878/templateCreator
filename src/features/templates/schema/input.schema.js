import { z } from 'zod';

export const InputTypeSchema = z.enum(['text', 'image', 'select', 'color']);

export const InputDefinitionSchema = z.object({
  key: z.string().regex(/^[a-z0-9_]+$/),
  type: InputTypeSchema,
  label: z.string().min(1),
  placeholder: z.string().optional(),
  required: z.boolean().default(false),
  default: z.any().optional(),
  maxLength: z.number().int().positive().optional(),
  accept: z.string().optional(),
  crop: z
    .object({
      w: z.number().positive(),
      h: z.number().positive(),
    })
    .optional(),
  options: z
    .array(
      z.object({
        label: z.string().min(1),
        value: z.string().min(1),
      })
    )
    .optional(),
});

export function createUserInputSchemaFromTemplate(templateDocument) {
  const shape = {};

  for (const input of templateDocument.inputs ?? []) {
    let schema = z.any();

    if (input.type === 'text' || input.type === 'color') {
      schema = z.string();
      if (input.maxLength) schema = schema.max(input.maxLength);
    }

    if (input.type === 'image') {
      schema = z.string();
    }

    if (input.type === 'select') {
      const optionValues = (input.options ?? []).map((option) => option.value);
      schema = optionValues.length ? z.enum(optionValues) : z.string();
    }

    if (!input.required) {
      schema = schema.optional();
    }

    shape[input.key] = schema;
  }

  return z.object(shape);
}

export function buildInitialValuesFromTemplate(templateDocument) {
  return (templateDocument.inputs ?? []).reduce((acc, input) => {
    acc[input.key] = input.default ?? '';
    return acc;
  }, {});
}
