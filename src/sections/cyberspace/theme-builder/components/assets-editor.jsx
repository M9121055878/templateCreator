'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

export function AssetsEditor({ assets = {}, onChange }) {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const assetEntries = Object.entries(assets);

  const handleAdd = () => {
    const trimmedKey = newKey.trim();
    const trimmedValue = newValue.trim();
    if (!trimmedKey || !trimmedValue) return;
    if (Object.prototype.hasOwnProperty.call(assets, trimmedKey)) return;

    onChange({
      ...assets,
      [trimmedKey]: trimmedValue,
    });
    setNewKey('');
    setNewValue('');
    setIsAdding(false);
  };

  const handleDelete = (key) => {
    const { [key]: deletedKey, ...rest } = assets;
    onChange(rest);
  };

  const handleUpdate = (oldKey, updatedKey, updatedValue) => {
    const trimmedNewKey = updatedKey.trim();
    const trimmedValue = updatedValue.trim();
    if (!trimmedNewKey || !trimmedValue) return;

    const { [oldKey]: deletedKey, ...rest } = assets;
    onChange({
      ...rest,
      [trimmedNewKey]: trimmedValue,
    });
  };

  const getAssetType = (value) => {
    if (value?.startsWith('data:image')) return 'image';
    if (value?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return 'image';
    if (value?.startsWith('http')) return 'url';
    return 'other';
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:folder-with-files-bold-duotone" width={20} color="action" />
          <Typography variant="subtitle2">
            Assetها ({assetEntries.length})
          </Typography>
        </Stack>
        {!isAdding && (
          <Button size="small" startIcon={<Iconify icon="solar:add-circle-bold-duotone" width={18} />} onClick={() => setIsAdding(true)}>
            افزودن
          </Button>
        )}
      </Stack>

      {isAdding && (
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
            <Stack spacing={1.5}>
              <TextField
                size="small"
                label="کلید (Key)"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="e.g., logo.png"
                helperText="نام منحصربفرد برای این asset"
              />
              <TextField
                size="small"
                label="مقدار (Value)"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="e.g., asset://logo.png یا https://..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="solar:link-bold-duotone" width={18} />
                    </InputAdornment>
                  ),
                }}
              />
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button size="small" onClick={() => setIsAdding(false)}>
                  انصراف
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleAdd}
                  disabled={!newKey.trim() || !newValue.trim()}
                >
                  ذخیره
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}

      <Stack spacing={1}>
        {assetEntries.map(([key, value]) => (
          <AssetItem
            key={key}
            assetKey={key}
            assetValue={value}
            type={getAssetType(value)}
            onUpdate={(newKey, newValue) => handleUpdate(key, newKey, newValue)}
            onDelete={() => handleDelete(key)}
          />
        ))}
      </Stack>

      {assetEntries.length === 0 && !isAdding && (
        <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'background.neutral', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            هنوز هیچ asset تعریف نشده است
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
            Assetها برای تصاویر، آیکون‌ها و سایر منابع استفاده می‌شوند
          </Typography>
        </Box>
      )}
    </Box>
  );
}

function AssetItem({ assetKey, assetValue, type, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editKey, setEditKey] = useState(assetKey);
  const [editValue, setEditValue] = useState(assetValue);

  const handleSave = () => {
    if (editKey.trim() && editValue.trim()) {
      // onUpdate?.(editKey, editValue);
    }
    setIsEditing(false);
  };

  const iconName = type === 'image' ? 'solar:gallery-wide-bold-duotone' : 'solar:link-bold-duotone';

  if (isEditing) {
    return (
      <Card variant="outlined">
        <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
          <Stack spacing={1.5}>
            <TextField size="small" label="Key" value={editKey} onChange={(e) => setEditKey(e.target.value)} />
            <TextField size="small" label="Value" value={editValue} onChange={(e) => setEditValue(e.target.value)} />
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button size="small" onClick={() => setIsEditing(false)}>انصراف</Button>
              <Button size="small" variant="contained" onClick={handleSave}>ذخیره</Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined">
      <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon={iconName} width={20} color="action" sx={{ flexShrink: 0 }} />
          <Box flex={1} minWidth={0}>
            <Typography variant="body2" fontWeight={500} noWrap>
              {assetKey}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
              {assetValue.length > 40 ? assetValue.slice(0, 40) + '...' : assetValue}
            </Typography>
          </Box>
          <Tooltip title="حذف">
            <IconButton size="small" color="error" onClick={onDelete}>
              <Iconify icon="solar:trash-bin-trash-bold-duotone" width={18} />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
  );
}
