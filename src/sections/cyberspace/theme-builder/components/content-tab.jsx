'use client';

import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

export function ContentTab({ activeNode, onNodeFieldChange }) {
  if (!activeNode) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          نودی انتخاب نشده است
        </Typography>
      </Box>
    );
  }

  const nodeType = activeNode.type;
  const showTextField = ['text', 'heading', 'paragraph', 'label', 'button'].includes(nodeType);
  const showSrcField = ['image', 'shape'].includes(nodeType);

  return (
    <Stack spacing={3}>
      {showTextField && (
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Iconify icon="solar:text-bold-duotone" width={18} />
            <Typography variant="subtitle2">متن</Typography>
          </Stack>
          <TextField
            fullWidth
            multiline
            rows={4}
            size="small"
            label="محتوای متن"
            value={activeNode.text || ''}
            onChange={(e) => onNodeFieldChange('text', e.target.value)}
            placeholder="متن نود را وارد کنید..."
          />
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
            می‌توانید از متغیرها با فرمت {'{{variable}}'} استفاده کنید
          </Typography>
        </Box>
      )}

      {showSrcField && (
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Iconify icon="solar:gallery-wide-bold-duotone" width={18} />
            <Typography variant="subtitle2">منبع تصویر</Typography>
          </Stack>
          <TextField
            fullWidth
            size="small"
            label="URL یا asset key"
            value={activeNode.src || ''}
            onChange={(e) => onNodeFieldChange('src', e.target.value)}
            placeholder="e.g., asset://background.jpg یا https://..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="solar:gallery-wide-bold-duotone" width={18} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}

      {!showTextField && !showSrcField && (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            این نود نیازی به محتوای متن یا تصویر ندارد
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
            نوع: {nodeType}
          </Typography>
        </Box>
      )}
    </Stack>
  );
}
