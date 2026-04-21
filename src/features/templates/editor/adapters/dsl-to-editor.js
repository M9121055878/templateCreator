export function mapDslToEditorState(templateDocument) {
  return {
    rootId: templateDocument?.layout?.root?.id ?? null,
    nodes: templateDocument?.layout?.nodes ?? {},
  };
}
