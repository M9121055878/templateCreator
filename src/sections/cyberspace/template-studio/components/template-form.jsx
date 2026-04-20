'use client';

import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';

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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState('');
  const [currentInputName, setCurrentInputName] = useState('');
  const [currentAspectRatio, setCurrentAspectRatio] = useState(undefined);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(templates.map((t) => t.category))];
    return uniqueCategories.map((cat) => ({ label: cat, value: cat }));
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    if (!selectedCategory) return templates;
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
    const input = activeTemplate?.inputs?.find(i => i.name === inputName);
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
            <Typography variant="h6">تنظیمات تمپلیت</Typography>

            <Autocomplete
              fullWidth
              options={categories}
              value={selectedCategory}
              onChange={(event, newValue) => {
                setSelectedCategory(newValue);
                // Reset template selection when category changes
                if (newValue && filteredTemplates.length > 0) {
                  const firstTemplateInCategory = templates.find((t) => t.category === newValue.value);
                  if (firstTemplateInCategory) {
                    onTemplateChange(firstTemplateInCategory.id);
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
              if (input.type === 'image') {
                return (
                  <Stack key={input.name} spacing={1}>
                    <Typography variant="subtitle2">{input.label}</Typography>
                    <Button component="label" variant="outlined">
                      آپلود تصویر
                      <input
                        accept={input.accept ?? 'image/*'}
                        hidden
                        onChange={(event) => handleFileChange(event, input.name)}
                        type="file"
                      />
                    </Button>
                    <TextField
                      fullWidth
                      label="یا لینک تصویر"
                      onChange={(event) => onInputChange(input.name, event.target.value)}
                      placeholder={input.default ?? ''}
                      value={values[input.name] ?? ''}
                    />
                  </Stack>
                );
              }

              if (input.type === 'select') {
                return (
                  <FormControl fullWidth key={input.name}>
                    <InputLabel id={`${input.name}-label`}>{input.label}</InputLabel>
                    <Select
                      label={input.label}
                      labelId={`${input.name}-label`}
                      onChange={(event) => onInputChange(input.name, event.target.value)}
                      value={values[input.name] ?? input.default ?? ''}
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
                  key={input.name}
                  label={input.label}
                  onChange={(event) => onInputChange(input.name, event.target.value)}
                  placeholder={input.placeholder ?? ''}
                  required={Boolean(input.required)}
                  value={values[input.name] ?? ''}
                />
              );
            })}

            <Box sx={{ pt: 1 }}>
              <Button onClick={onResetValues} variant="soft">
                بازنشانی مقادیر
              </Button>
            </Box>
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
    </>
  );
}
