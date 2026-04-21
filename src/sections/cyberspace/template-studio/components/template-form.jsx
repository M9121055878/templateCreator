'use client';

import { Icon } from '@iconify/react';
import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { ImageCropModal } from '../../../../components/image-crop-modal/image-crop-modal';

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function TemplateForm({
  templates,
  activeTemplateId,
  values,
  onTemplateChange,
  onInputChange,
  onResetValues,
}) {
  const getInputKey = (input) => input.name ?? input.key;
  const [selectedCategory, setSelectedCategory] = useState({ label: 'همه دسته‌ها', value: null });
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState('');
  const [currentInputName, setCurrentInputName] = useState('');
  const [currentAspectRatio, setCurrentAspectRatio] = useState(undefined);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(templates.map((t) => t.category))];
    return [
      { label: 'همه دسته‌ها', value: null },
      ...uniqueCategories.map((cat) => ({ label: cat, value: cat }))
    ];
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    if (!selectedCategory || selectedCategory.value === null) return templates;
    return templates.filter((t) => t.category === selectedCategory.value);
  }, [templates, selectedCategory]);

  const activeTemplate = useMemo(
    () => templates.find((template) => template.id === activeTemplateId),
    [activeTemplateId, templates]
  );

  const selectedTemplateOption = useMemo(
    () => filteredTemplates.find((t) => t.id === activeTemplateId) || null,
    [filteredTemplates, activeTemplateId]
  );

  const handleFileChange = async (event, inputName) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const dataUrl = await readFileAsDataUrl(file);
    setCurrentImageSrc(dataUrl);
    setCurrentInputName(inputName);

    // Calculate aspect ratio from input configuration
    const input = activeTemplate?.inputs?.find((i) => getInputKey(i) === inputName);
    const aspectRatio = input?.width && input?.height ? input.width / input.height : undefined;
    setCurrentAspectRatio(aspectRatio);

    setCropModalOpen(true);
  };

  const handleCropComplete = (croppedImageSrc) => {
    onInputChange(currentInputName, croppedImageSrc);
    setCurrentImageSrc('');
    setCurrentInputName('');
  };

  const handleCropModalClose = () => {
    setCropModalOpen(false);
    setCurrentImageSrc('');
    setCurrentInputName('');
    setCurrentAspectRatio(undefined);
  };

  return (
    <>
      <Card>
        <CardContent>
          <Stack spacing={2.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">تنظیمات تمپلیت</Typography>
              <IconButton 
                onClick={() => setResetDialogOpen(true)} 
                color="error"
                title="پاک کردن داده‌ها"
              >
                <Icon icon="solar:trash-bin-trash-bold" width={20} />
              </IconButton>
            </Box>

            <Autocomplete
              fullWidth
              options={categories}
              value={selectedCategory}
              onChange={(event, newValue) => {
                setSelectedCategory(newValue || { label: 'همه دسته‌ها', value: null });
                // Reset template selection when category changes
                if (newValue && filteredTemplates.length > 0) {
                  const firstTemplateInCategory = templates.find((t) => t.category === newValue.value);
                  if (firstTemplateInCategory) {
                    onTemplateChange(firstTemplateInCategory.id);
                  }
                } else if (!newValue) {
                  // If "All Categories" is selected, select the first template
                  if (templates.length > 0) {
                    onTemplateChange(templates[0].id);
                  }
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="انتخاب دسته‌بندی" placeholder="جستجو در دسته‌بندی‌ها" />
              )}
            />

            <Autocomplete
              fullWidth
              options={filteredTemplates}
              getOptionLabel={(option) => option.name}
              value={selectedTemplateOption}
              onChange={(event, newValue) => {
                if (newValue) {
                  onTemplateChange(newValue.id);
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="انتخاب تمپلیت" placeholder="جستجو در تمپلیت‌ها" />
              )}
            />

            {activeTemplate && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {activeTemplate.description}
              </Typography>
            )}

            {activeTemplate?.inputs?.map((input) => {
              const inputKey = getInputKey(input);
              if (input.type === 'image') {
                return (
                  <Stack key={inputKey} spacing={1}>
                    <Typography variant="subtitle2">{input.label}</Typography>
                    <Button component="label" variant="outlined">
                      آپلود تصویر
                      <input
                        accept={input.accept ?? 'image/*'}
                        hidden
                        onChange={(event) => handleFileChange(event, inputKey)}
                        type="file"
                      />
                    </Button>
                    <TextField
                      fullWidth
                      label="یا لینک تصویر"
                      onChange={(event) => onInputChange(inputKey, event.target.value)}
                      placeholder={input.default ?? ''}
                      value={values[inputKey] ?? ''}
                    />
                  </Stack>
                );
              }

              if (input.type === 'select') {
                return (
                  <FormControl fullWidth key={inputKey}>
                    <InputLabel id={`${inputKey}-label`}>{input.label}</InputLabel>
                    <Select
                      label={input.label}
                      labelId={`${inputKey}-label`}
                      onChange={(event) => onInputChange(inputKey, event.target.value)}
                      value={values[inputKey] ?? input.default ?? ''}
                    >
                      {(input.options ?? []).map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                );
              }

              return (
                <TextField
                  fullWidth
                  key={inputKey}
                  label={input.label}
                  onChange={(event) => onInputChange(inputKey, event.target.value)}
                  placeholder={input.placeholder ?? ''}
                  required={Boolean(input.required)}
                  value={values[inputKey] ?? ''}
                />
              );
            })}
          </Stack>
        </CardContent>
      </Card>

      <ImageCropModal
        open={cropModalOpen}
        onClose={handleCropModalClose}
        onCropComplete={handleCropComplete}
        imageSrc={currentImageSrc}
        aspectRatio={currentAspectRatio}
      />

      <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)}>
        <DialogTitle>تایید پاک کردن داده‌ها</DialogTitle>
        <DialogContent>
          <Typography>
            آیا از پاک کردن تمام داده‌ها و بازگشت به مقادیر پیشفرض اطمینان دارید؟
            این عمل قابل بازگشت نیست.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogOpen(false)} variant="outlined">
            انصراف
          </Button>
          <Button 
            onClick={() => {
              onResetValues();
              setResetDialogOpen(false);
            }} 
            variant="contained" 
            color="error"
          >
            پاک کردن داده‌ها
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
