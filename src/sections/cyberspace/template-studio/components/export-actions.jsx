'use client';

import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

import { toast } from 'src/components/snackbar';

import { exportTemplateNodeAsPng, exportTemplateNodeAsJpeg } from '../lib/export-image';

export function ExportActions({ exportRef, template }) {
  const [loadingType, setLoadingType] = useState('');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState(template?.recommendedFormat || 'jpg');
  const [jpgQuality, setJpgQuality] = useState(0.5);

  const handleExport = async (format, quality = 0.8) => {
    const exportNode = exportRef?.current;
    if (!exportNode || !template) return;

    try {
      setLoadingType(format);

      if (format === 'png') {
        await exportTemplateNodeAsPng(exportNode, template);
      } else {
        await exportTemplateNodeAsJpeg(exportNode, template, { quality });
      }

      toast.success(`خروجی ${format.toUpperCase()} با موفقیت ذخیره شد`);
      setExportDialogOpen(false);
    } catch (error) {
      toast.error(error?.message ?? 'خطا در تولید تصویر');
    } finally {
      setLoadingType('');
    }
  };

  const handleExportClick = () => {
    // Set default format based on template recommendation
    setExportFormat(template?.recommendedFormat || 'jpg');
    setExportDialogOpen(true);
  };

  return (
    <>
      <Stack direction="row" spacing={1.5}>
        <LoadingButton
          loading={loadingType !== ''}
          onClick={handleExportClick}
          variant="contained"
          startIcon="💾"
        >
          ذخیره تصویر
        </LoadingButton>
      </Stack>

      <Dialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>ذخیره تصویر</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {template.hasTransparency && (
              <Alert severity="info">
                طرح شما حاوی بخش‌های شفاف است. برای حفظ کیفیت، PNG توصیه می‌شود.
              </Alert>
            )}

            {template.recommendedFormat === 'png' && !template.hasTransparency && (
              <Alert severity="success">
                این طرح برای فرمت PNG بهینه شده است. کیفیت بالاتر و جزئیات دقیق‌تر.
              </Alert>
            )}

            {template.recommendedFormat === 'jpg' && !template.hasTransparency && (
              <Alert severity="warning">
                این طرح برای فرمت JPG بهینه شده است. حجم کمتر و مناسب وب.
              </Alert>
            )}

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>فرمت خروجی:</Typography>
              <RadioGroup
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
              >
                <FormControlLabel
                  value="jpg"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>JPG</span>
                      <Typography variant="caption" color="text.secondary">
                        (حجم کم، مناسب وب)
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="png"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>PNG</span>
                      <Typography variant="caption" color="text.secondary">
                        (کیفیت بالا، پشتیبانی از شفافیت)
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </Box>

            {exportFormat === 'jpg' && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  میزان کیفیت: {Math.round(jpgQuality * 100)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                 ⚠️ اگر با کیفیت‌های ذخیره‌سازی آشنایی ندارید، روی پیشفرض: معمولی (50%) بگذارید.
                </Typography>
                <Slider
                  value={jpgQuality}
                  onChange={(e, value) => setJpgQuality(value)}
                  min={0.3}
                  max={0.9}
                  step={0.1}
                  marks={[
                    { value: 0.3, label: 'کم' },
                    { value: 0.5, label: 'معمولی' },
                    { value: 0.7, label: 'زیاد' },
                    { value: 0.9, label: 'عالی' }
                  ]}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                />
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            ابعاد: {template.width} × {template.height} پیکسل
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            onClick={() => setExportDialogOpen(false)}
            variant="outlined"
          >
            انصراف
          </Button>
          <LoadingButton
            loading={loadingType !== ''}
            onClick={() => handleExport(exportFormat, jpgQuality)}
            variant="contained"
          >
            ذخیره {exportFormat.toUpperCase()}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
