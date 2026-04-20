'use client';

import { useRef, useMemo, useState } from 'react';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { templateConfigs } from '../data/templates';
import { TemplateForm } from '../components/template-form';
import { ExportActions } from '../components/export-actions';
import { TemplatePreview } from '../components/template-preview';
import { renderTemplateHtml, createInitialValues } from '../lib/render-template';

export function TemplateStudioView() {
  const [activeTemplateId, setActiveTemplateId] = useState(templateConfigs[0].id);
  const [templateValues, setTemplateValues] = useState(() =>
    createInitialValues(templateConfigs[0])
  );
  const exportNodeRef = useRef(null);

  const activeTemplate = useMemo(
    () =>
      templateConfigs.find((template) => template.id === activeTemplateId) ?? templateConfigs[0],
    [activeTemplateId]
  );

  const renderedHtml = useMemo(
    () => renderTemplateHtml(activeTemplate, templateValues),
    [activeTemplate, templateValues]
  );

  const handleTemplateChange = (templateId) => {
    const nextTemplate = templateConfigs.find((template) => template.id === templateId);
    if (!nextTemplate) return;

    setActiveTemplateId(nextTemplate.id);
    setTemplateValues(createInitialValues(nextTemplate));
  };

  const handleInputChange = (inputName, value) => {
    setTemplateValues((prev) => ({ ...prev, [inputName]: value }));
  };

  const handleResetValues = () => {
    setTemplateValues(createInitialValues(activeTemplate));
  };

  return (
    <DashboardContent maxWidth="xl">
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4">استودیو تمپلیت تصویری</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            با وارد کردن مقادیر، پیش‌نمایش زنده می‌بینید و خروجی PNG یا JPG دانلود می‌کنید.
          </Typography>
        </Stack>

        <ExportActions exportRef={exportNodeRef} template={activeTemplate} />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TemplateForm
              activeTemplateId={activeTemplateId}
              onInputChange={handleInputChange}
              onResetValues={handleResetValues}
              onTemplateChange={handleTemplateChange}
              templates={templateConfigs}
              values={templateValues}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <TemplatePreview
              exportRef={exportNodeRef}
              renderedHtml={renderedHtml}
              template={activeTemplate}
            />
          </Grid>
        </Grid>
      </Stack>
    </DashboardContent>
  );
}
