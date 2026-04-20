'use client';

import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';

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
  const activeTemplate = useMemo(
    () => templates.find((template) => template.id === activeTemplateId),
    [activeTemplateId, templates]
  );

  const handleFileChange = async (event, inputName) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const dataUrl = await readFileAsDataUrl(file);
    onInputChange(inputName, dataUrl);
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2.5}>
          <Typography variant="h6">تنظیمات تمپلیت</Typography>

          <FormControl fullWidth>
            <InputLabel id="template-select-label">انتخاب تمپلیت</InputLabel>
            <Select
              label="انتخاب تمپلیت"
              labelId="template-select-label"
              onChange={(event) => onTemplateChange(event.target.value)}
              value={activeTemplateId}
            >
              {templates.map((template) => (
                <MenuItem key={template.id} value={template.id}>
                  {template.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
  );
}
