'use client';

import { useMemo, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

function getAllNodes(document) {
  if (!document?.layout) return [];
  const nodes = [];

  if (document.layout.root) {
    nodes.push({ ...document.layout.root, isRoot: true });
  }

  if (document.layout.nodes) {
    Object.values(document.layout.nodes).forEach((node) => {
      nodes.push({ ...node, isRoot: false });
    });
  }

  return nodes;
}

function findNodeAtPoint(document, x, y, scale = 1) {
  const nodes = getAllNodes(document);

  const hitNodes = nodes.filter((node) => {
    const nx = (node.x ?? 0) * scale;
    const ny = (node.y ?? 0) * scale;
    const nw = (node.w ?? 0) * scale;
    const nh = (node.h ?? 0) * scale;
    return x >= nx && x <= nx + nw && y >= ny && y <= ny + nh;
  });

  if (hitNodes.length === 0) return null;

  hitNodes.sort((a, b) => {
    const areaA = (a.w ?? 0) * (a.h ?? 0);
    const areaB = (b.w ?? 0) * (b.h ?? 0);
    return areaA - areaB;
  });

  return hitNodes[0];
}

export function Canvas({
  document,
  preview,
  selectedNodeId,
  dirty,
  onNodeSelect,
}) {
  const nodes = useMemo(() => getAllNodes(document), [document]);

  const handleCanvasClick = useCallback(
    (event) => {
      if (!document) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const hitNode = findNodeAtPoint(document, x, y);

      if (hitNode) {
        onNodeSelect(hitNode.id);
      }
    },
    [document, onNodeSelect]
  );

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const docSize = document?.meta?.size;

  return (
    <Stack spacing={2} sx={{ height: '100%' }}>
      <Box
        sx={{
          position: 'relative',
          flex: 1,
          minHeight: 300,
          bgcolor: 'background.neutral',
          borderRadius: 2,
          overflow: 'auto',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.shadows[2],
            ...(docSize && {
              width: Math.min(docSize.width, 600),
              aspectRatio: `${docSize.width} / ${docSize.height}`,
            }),
            ...(!docSize && {
              minWidth: 400,
              minHeight: 400,
            }),
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
            }}
          >
            {preview}
          </Box>

          <Box
            onClick={handleCanvasClick}
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 10,
              cursor: 'crosshair',
            }}
          />

          {selectedNode && (
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 1,
                height: 1,
                pointerEvents: 'none',
                zIndex: 20,
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: selectedNode.x,
                  top: selectedNode.y,
                  width: selectedNode.w,
                  height: selectedNode.h,
                  border: (theme) => `2px solid ${theme.palette.primary.main}`,
                  boxShadow: '0 0 0 4px rgba(25, 118, 210, 0.2)',
                  bgcolor: 'transparent',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -24,
                    left: 0,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    px: 0.75,
                    py: 0.25,
                    fontSize: 10,
                    borderRadius: 0.5,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {selectedNode.id} ({selectedNode.type})
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 1,
          py: 1,
          bgcolor: 'background.paper',
          borderRadius: 1,
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Iconify icon="solar:eye-bold-duotone" width={18} />
          <Typography variant="body2" noWrap>
            {document?.meta?.title || 'بدون عنوان'}
          </Typography>
          {dirty && (
            <Tooltip title="تغییرات ذخیره نشده">
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'warning.main',
                }}
              />
            </Tooltip>
          )}
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          {docSize && (
            <Tooltip title={`ابعاد: ${docSize.width}×${docSize.height}`}>
              <Chip
                size="small"
                icon={<Iconify icon="solar:ruler-angular-bold-duotone" width={16} />}
                label={`${docSize.width}×${docSize.height}`}
                variant="outlined"
              />
            </Tooltip>
          )}
          <Tooltip title={`${nodes.length} نود در تمپلیت`}>
            <Chip
              size="small"
              icon={<Iconify icon="solar:layers-bold-duotone" width={16} />}
              label={`${nodes.length} نود`}
              variant="outlined"
            />
          </Tooltip>
          {selectedNodeId && (
            <Chip
              size="small"
              color="primary"
              label={selectedNodeId === document?.layout?.root?.id ? 'Root' : selectedNodeId}
            />
          )}
        </Stack>
      </Box>
    </Stack>
  );
}
