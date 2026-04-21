'use client';

import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { DSL_NODE_TYPES } from 'src/features/templates/model/node-types';

import { Iconify } from 'src/components/iconify';

import { StyleEditor } from './style-editor';

const NODE_TYPE_OPTIONS = Object.values(DSL_NODE_TYPES);

export function PropertiesTab({
  activeNode,
  document,
  validationErrors,
  onNodeFieldChange,
}) {
  const isRoot = useMemo(() => {
    if (!activeNode || !document) return false;
    return activeNode.id === document.layout?.root?.id;
  }, [activeNode, document]);

  const nodeType = activeNode?.type || '';

  const handlePositionChange = (field, value) => {
    const num = Number(value);
    if (Number.isFinite(num)) {
      onNodeFieldChange(field, num);
    }
  };

  const handleStyleChange = (newStyle) => {
    onNodeFieldChange('style', newStyle);
  };

  if (!activeNode) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          نودی انتخاب نشده است
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
          روی بوم کلیک کنید یا از لیست نودها انتخاب کنید
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {validationErrors.length > 0 && (
        <Box sx={{ p: 1.5, bgcolor: 'error.lighter', borderRadius: 1 }}>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}>
            <Iconify icon="solar:danger-circle-bold-duotone" width={16} color="error" />
            <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 500 }}>
              {validationErrors.length} خطا
            </Typography>
          </Stack>
          {validationErrors.slice(0, 2).map((err, i) => (
            <Typography key={i} variant="caption" sx={{ color: 'error.main', display: 'block' }}>
              {err}
            </Typography>
          ))}
        </Box>
      )}

      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
          شناسه و نوع
        </Typography>
        <Stack spacing={1}>
          <TextField
            fullWidth
            size="small"
            label="Node ID"
            value={activeNode.id}
            disabled
          />
          <TextField
            fullWidth
            select
            size="small"
            label="نوع"
            value={nodeType}
            onChange={(e) => onNodeFieldChange('type', e.target.value)}
            disabled={isRoot}
            helperText={isRoot ? 'نوع root قابل تغییر نیست' : ''}
          >
            {NODE_TYPE_OPTIONS.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Box>

      <Divider />

      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
          موقعیت
        </Typography>
        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            label="X"
            type="number"
            value={activeNode.x ?? 0}
            onChange={(e) => handlePositionChange('x', e.target.value)}
            sx={{ flex: 1 }}
          />
          <TextField
            size="small"
            label="Y"
            type="number"
            value={activeNode.y ?? 0}
            onChange={(e) => handlePositionChange('y', e.target.value)}
            sx={{ flex: 1 }}
          />
        </Stack>
      </Box>

      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
          اندازه
        </Typography>
        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            label="Width"
            type="number"
            value={activeNode.w ?? 0}
            onChange={(e) => handlePositionChange('w', e.target.value)}
            sx={{ flex: 1 }}
          />
          <TextField
            size="small"
            label="Height"
            type="number"
            value={activeNode.h ?? 0}
            onChange={(e) => handlePositionChange('h', e.target.value)}
            sx={{ flex: 1 }}
          />
        </Stack>
      </Box>

      <Divider />

      <StyleEditor style={activeNode.style || {}} onChange={handleStyleChange} />
    </Stack>
  );
}
