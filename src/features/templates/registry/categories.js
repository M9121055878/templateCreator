export function extractTemplateCategories(templates) {
  const categories = new Set((templates ?? []).map((template) => template.category).filter(Boolean));
  return Array.from(categories);
}
