'use client';

import Box from '@mui/material/Box';

import { pickAllowedStyles } from './style-map';
import { resolveDslNode } from '../resolve/resolver';
import { DSL_NODE_TYPES } from '../../model/node-types';

function toAbsoluteBoxStyle(node) {
  return {
    position: 'absolute',
    left: node.x,
    top: node.y,
    width: node.w,
    height: node.h,
    ...pickAllowedStyles(node.style),
  };
}

function renderNode(node, allNodes, runtimeData) {
  const resolvedNode = resolveDslNode(node, runtimeData);
  const childrenIds = resolvedNode.children ?? [];
  const childNodes = childrenIds
    .map((childId) => allNodes[childId])
    .filter(Boolean)
    .map((childNode) => renderNode(childNode, allNodes, runtimeData));

  if (resolvedNode.type === DSL_NODE_TYPES.TEXT) {
    return (
      <Box key={resolvedNode.id} sx={toAbsoluteBoxStyle(resolvedNode)}>
        {resolvedNode.text ?? ''}
      </Box>
    );
  }

  if (resolvedNode.type === DSL_NODE_TYPES.IMAGE) {
    return (
      <Box
        key={resolvedNode.id}
        component="img"
        src={resolvedNode.src ?? ''}
        alt={resolvedNode.id}
        sx={{
          ...toAbsoluteBoxStyle(resolvedNode),
          display: 'block',
        }}
      />
    );
  }

  return (
    <Box key={resolvedNode.id} sx={toAbsoluteBoxStyle(resolvedNode)}>
      {childNodes}
    </Box>
  );
}

export function renderDslToReact(templateDocument, runtimeData) {
  const layout = templateDocument.layout;
  if (!layout?.root) return null;

  return renderNode(layout.root, layout.nodes ?? {}, runtimeData);
}
