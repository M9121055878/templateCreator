'use client';

import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { toast } from 'src/components/snackbar';

import { exportTemplateNodeAsPng, exportTemplateNodeAsJpeg } from '../lib/export-image';

export function ExportActions({ exportNode, template }) {
  const [loadingType, setLoadingType] = useState('');

  const handleExport = async (type) => {
    if (!exportNode || !template) return;

    try {
      setLoadingType(type);

      if (type === 'png') {
        await exportTemplateNodeAsPng(exportNode, template);
      } else {
        await exportTemplateNodeAsJpeg(exportNode, template);
      }

      toast.success(`خروجی ${type.toUpperCase()} با موفقیت ذخیره شد`);
    } catch (error) {
      toast.error(error?.message ?? 'خطا در تولید تصویر');
    } finally {
      setLoadingType('');
    }
  };

  return (
    <Stack direction="row" spacing={1.5}>
      <LoadingButton
        loading={loadingType === 'png'}
        onClick={() => handleExport('png')}
        variant="contained"
      >
        ذخیره PNG
      </LoadingButton>

      <LoadingButton
        color="inherit"
        loading={loadingType === 'jpg'}
        onClick={() => handleExport('jpg')}
        variant="outlined"
      >
        ذخیره JPG
      </LoadingButton>

      <Button disabled variant="text">
        1920x1080
      </Button>
    </Stack>
  );
}
