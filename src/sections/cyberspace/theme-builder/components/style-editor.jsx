'use client';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const COMMON_STYLE_FIELDS = [
  { key: 'backgroundColor', label: 'رنگ پس‌زمینه', type: 'color' },
  { key: 'color', label: 'رنگ متن', type: 'color' },
  { key: 'fontSize', label: 'اندازه فونت', type: 'text', placeholder: 'e.g., 16px, 1.2rem' },
  { key: 'fontWeight', label: 'وزن فونت', type: 'select', options: ['normal', 'bold', '300', '400', '500', '600', '700', '800'] },
  { key: 'textAlign', label: 'تراز متن', type: 'select', options: ['left', 'center', 'right', 'justify'] },
  { key: 'borderRadius', label: 'گردی گوشه', type: 'text', placeholder: 'e.g., 8px, 50%' },
  { key: 'padding', label: 'فاصله داخلی', type: 'text', placeholder: 'e.g., 16px, 8px 16px' },
  { key: 'border', label: 'حاشیه', type: 'text', placeholder: 'e.g., 1px solid #ccc' },
  { key: 'objectFit', label: 'Object Fit', type: 'select', options: ['cover', 'contain', 'fill', 'none', 'scale-down'] },
  { key: 'opacity', label: 'شفافیت', type: 'text', placeholder: '0-1, e.g., 0.8' },
];

export function StyleEditor({ style = {}, onChange }) {
  const handleFieldChange = (key, value) => {
    const nextStyle = { ...style };
    if (value === '' || value === undefined) {
      delete nextStyle[key];
    } else {
      nextStyle[key] = value;
    }
    onChange(nextStyle);
  };

  const getFieldValue = (key) => style?.[key] ?? '';

  return (
    <Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1.5, display: 'block' }}>
        استایل‌های رایج
      </Typography>

      <Stack spacing={1.5}>
        {COMMON_STYLE_FIELDS.map((field) => {
          const value = getFieldValue(field.key);

          if (field.type === 'color') {
            return (
              <Stack key={field.key} direction="row" spacing={1} alignItems="center">
                <TextField
                  fullWidth
                  size="small"
                  label={field.label}
                  value={value}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  placeholder="#ffffff, rgb(255,0,0), red"
                />
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    bgcolor: value || 'transparent',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    flexShrink: 0,
                  }}
                />
              </Stack>
            );
          }

          if (field.type === 'select') {
            return (
              <TextField
                key={field.key}
                fullWidth
                select
                size="small"
                label={field.label}
                value={value}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
              >
                <MenuItem value="">
                  <em>Default</em>
                </MenuItem>
                {field.options.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>
            );
          }

          return (
            <TextField
              key={field.key}
              fullWidth
              size="small"
              label={field.label}
              value={value}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder}
            />
          );
        })}
      </Stack>
    </Box>
  );
}

export function getUncommonStyles(style = {}) {
  const commonKeys = COMMON_STYLE_FIELDS.map((f) => f.key);
  return Object.entries(style).reduce((acc, [key, value]) => {
    if (!commonKeys.includes(key)) {
      acc[key] = value;
    }
    return acc;
  }, {});
}
