'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

const INPUT_TYPES = ['text', 'number', 'image', 'color', 'select', 'boolean', 'date'];

function InputForm({ input, onSave, onCancel, isNew = false }) {
  const [formData, setFormData] = useState({
    key: input?.key || '',
    label: input?.label || '',
    type: input?.type || 'text',
    default: input?.default ?? '',
    required: input?.required ?? false,
    options: input?.options || [],
    ...input,
  });

  const handleSave = () => {
    if (!formData.key.trim() || !formData.label.trim()) return;
    onSave({
      ...formData,
      key: formData.key.trim(),
    });
  };

  const isValid = formData.key.trim() && formData.label.trim();

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1}>
            <TextField
              size="small"
              label="Key"
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              disabled={!isNew}
              placeholder="e.g., userName"
              sx={{ flex: 1 }}
            />
            <TextField
              size="small"
              select
              label="نوع"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              sx={{ width: 100 }}
            >
              {INPUT_TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <TextField
            size="small"
            label="Label"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            placeholder="e.g., Username"
          />

          <TextField
            size="small"
            label="مقدار پیش‌فرض"
            value={formData.default}
            onChange={(e) => setFormData({ ...formData, default: e.target.value })}
            placeholder="e.g., Guest"
          />

          {formData.type === 'select' && (
            <TextField
              size="small"
              label="گزینه‌ها (با کاما جدا کنید)"
              value={formData.options?.join(', ') || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  options: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                })
              }
              placeholder="option1, option2, option3"
            />
          )}

          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={formData.required}
                onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
              />
            }
            label="اجباری"
          />

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button size="small" startIcon={<Iconify icon="solar:close-circle-bold-duotone" width={18} />} onClick={onCancel}>
              انصراف
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<Iconify icon="solar:check-circle-bold-duotone" width={18} />}
              onClick={handleSave}
              disabled={!isValid}
            >
              ذخیره
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function InputsEditor({ inputs = [], onChange }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (newInput) => {
    const exists = inputs.some((i) => i.key === newInput.key);
    if (exists) return;
    onChange([...inputs, newInput]);
    setIsAdding(false);
  };

  const handleUpdate = (index, updatedInput) => {
    const newInputs = [...inputs];
    newInputs[index] = updatedInput;
    onChange(newInputs);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    onChange(newInputs);
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:checklist-minimalistic-bold-duotone" width={20} color="action" />
          <Typography variant="subtitle2">
            ورودی‌ها ({inputs.length})
          </Typography>
        </Stack>
        {!isAdding && (
          <Button
            size="small"
            startIcon={<Iconify icon="solar:add-circle-bold-duotone" width={18} />}
            onClick={() => setIsAdding(true)}
          >
            افزودن
          </Button>
        )}
      </Stack>

      {isAdding && (
        <InputForm
          isNew
          onSave={handleAdd}
          onCancel={() => setIsAdding(false)}
        />
      )}

      <Stack spacing={1}>
        {inputs.map((input, index) => (
          <Box key={input.key}>
            {editingIndex === index ? (
              <InputForm
                input={input}
                onSave={(updated) => handleUpdate(index, updated)}
                onCancel={() => setEditingIndex(null)}
              />
            ) : (
              <Card variant="outlined">
                <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={1} flex={1} minWidth={0}>
                      <Typography variant="body2" fontWeight={500} noWrap>
                        {input.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                        ({input.key})
                      </Typography>
                      <Chip
                        size="small"
                        label={input.type}
                        sx={{ height: 18, fontSize: 10 }}
                      />
                      {input.required && (
                        <Chip
                          size="small"
                          label="اجباری"
                          color="primary"
                          sx={{ height: 18, fontSize: 10 }}
                        />
                      )}
                    </Stack>
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="ویرایش">
                        <IconButton size="small" onClick={() => setEditingIndex(index)}>
                          <Iconify icon="solar:pen-bold-duotone" width={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="حذف">
                        <IconButton size="small" color="error" onClick={() => handleDelete(index)}>
                          <Iconify icon="solar:trash-bin-trash-bold-duotone" width={18} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                  {input.default !== undefined && input.default !== '' && (
                    <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                      پیش‌فرض: {String(input.default)}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            )}
          </Box>
        ))}
      </Stack>

      {inputs.length === 0 && !isAdding && (
        <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'background.neutral', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            هنوز هیچ ورودی تعریف نشده است
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
            روی «افزودن» کلیک کنید تا ورودی جدید ایجاد کنید
          </Typography>
        </Box>
      )}
    </Box>
  );
}
