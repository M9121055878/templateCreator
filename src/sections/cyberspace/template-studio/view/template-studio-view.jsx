'use client';

import { useRef, useMemo, useState } from 'react';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import { DashboardContent } from 'src/layouts/dashboard';
import { PageHeader } from 'src/components/page-header';
import {
  TEMPLATE_ENGINES,
  getTemplateRegistry,
  renderTemplateContent,
  resolveTemplateRuntime,
  buildInitialValuesFromTemplate,
} from 'src/features/templates';

import { TemplateForm } from '../components/template-form';
import { ExportActions } from '../components/export-actions';
import { TemplatePreview } from '../components/template-preview';

export function TemplateStudioView() {
  const templates = useMemo(() => getTemplateRegistry(), []);
  const [activeTemplateId, setActiveTemplateId] = useState(templates[0].id);
  const [templateValues, setTemplateValues] = useState(() =>
    buildInitialValuesFromTemplate(templates[0].document)
  );
  const exportNodeRef = useRef(null);

  const activeTemplate = useMemo(
    () => templates.find((template) => template.id === activeTemplateId) ?? templates[0],
    [activeTemplateId, templates]
  );

  const runtimeData = useMemo(
    () => resolveTemplateRuntime(activeTemplate.document, templateValues),
    [activeTemplate, templateValues]
  );

  const renderedContent = useMemo(
    () => renderTemplateContent(activeTemplate, runtimeData),
    [activeTemplate, runtimeData]
  );

  const handleTemplateChange = (templateId) => {
    const nextTemplate = templates.find((template) => template.id === templateId);
    if (!nextTemplate) return;

    setActiveTemplateId(nextTemplate.id);
    setTemplateValues(buildInitialValuesFromTemplate(nextTemplate.document));
  };

  const handleInputChange = (inputName, value) => {
    setTemplateValues((prev) => ({ ...prev, [inputName]: value }));
  };

  const handleResetValues = () => {
    setTemplateValues(buildInitialValuesFromTemplate(activeTemplate.document));
  };

  return (
    <DashboardContent maxWidth="xl">
      <Stack spacing={3}>
        <PageHeader
          title="عکس ساز"
          subtitle="با وارد کردن مقادیر، پیش‌نمایش زنده می‌بینید و خروجی PNG یا JPG دانلود می‌کنید."
          action={{
            label: 'ذخیره تصویر',
            icon: 'mingcute:download-2-line',
            onClick: () => {
              // This will be handled by ExportActions component
              const exportButton = document.querySelector('[data-export-trigger]');
              if (exportButton) exportButton.click();
            },
          }}
        />

        <ExportActions exportRef={exportNodeRef} template={activeTemplate} />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TemplateForm
              activeTemplateId={activeTemplateId}
              onInputChange={handleInputChange}
              onResetValues={handleResetValues}
              onTemplateChange={handleTemplateChange}
              templates={templates}
              values={templateValues}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <TemplatePreview
              engine={activeTemplate.engine ?? TEMPLATE_ENGINES.LEGACY_HTML}
              exportRef={exportNodeRef}
              renderedContent={renderedContent}
              template={activeTemplate}
            />
          </Grid>
        </Grid>
      </Stack>
    </DashboardContent>
  );
}
