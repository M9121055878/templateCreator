/**
 * Future editor store contract.
 */
export function createEditorStore() {
  return {
    selectedNodeId: null,
    hoveredNodeId: null,
    history: [],
    setSelectedNode(nodeId) {
      this.selectedNodeId = nodeId;
    },
  };
}
