export function mapEditorStateToDsl(editorState, templateDocument) {
  return {
    ...templateDocument,
    layout: {
      ...templateDocument.layout,
      nodes: editorState.nodes,
    },
  };
}
