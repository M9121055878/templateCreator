function cloneDocument(document) {
  return JSON.parse(JSON.stringify(document));
}

export function createEditorStore(initialDocument) {
  const snapshot = cloneDocument(initialDocument);

  return {
    document: snapshot,
    selectedNodeId: snapshot.layout?.root?.id ?? null,
    hoveredNodeId: null,
    dirty: false,
    validationErrors: [],
    history: [snapshot],
    setSelectedNode(nodeId) {
      this.selectedNodeId = nodeId;
    },
    setDocument(nextDocument) {
      this.document = cloneDocument(nextDocument);
      this.history = [...this.history, cloneDocument(nextDocument)].slice(-40);
      this.dirty = true;
    },
    setValidationErrors(errors) {
      this.validationErrors = errors ?? [];
    },
    markSaved() {
      this.dirty = false;
    },
    reset(nextDocument) {
      const fresh = cloneDocument(nextDocument);
      this.document = fresh;
      this.selectedNodeId = fresh.layout?.root?.id ?? null;
      this.hoveredNodeId = null;
      this.dirty = false;
      this.validationErrors = [];
      this.history = [fresh];
    },
  };
}
