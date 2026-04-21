'use client';

import { useState, useEffect } from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

function toPrettyJson(value) {
  return JSON.stringify(value ?? {}, null, 2);
}

function parseJsonOrNull(raw) {
  if (!raw?.trim()) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function JsonEditor({ label, value, onChange, error, helperText, rows = 8 }) {
  const [localValue, setLocalValue] = useState(value);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (newValue) => {
    setLocalValue(newValue);
    const parsed = parseJsonOrNull(newValue);
    setHasError(newValue.trim() && !parsed);
    if (parsed !== null || !newValue.trim()) {
      onChange?.(parsed);
    }
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Iconify icon="solar:code-square-bold-duotone" width={18} />
        <Typography variant="subtitle2">{label}</Typography>
        {hasError && (
          <Chip
            size="small"
            color="error"
            icon={<Iconify icon="solar:danger-circle-bold-duotone" width={16} />}
            label="نامعتبر"
            sx={{ height: 20, fontSize: 10 }}
          />
        )}
      </Stack>
      <TextField
        fullWidth
        multiline
        rows={rows}
        size="small"
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        error={hasError || error}
        helperText={helperText}
        sx={{
          '& .MuiInputBase-root': {
            fontFamily: 'monospace',
            fontSize: '0.85rem',
          },
        }}
      />
    </Box>
  );
}

export function AdvancedTab({
  document,
  activeNode,
  inputs,
  assets,
  onInputsChange,
  onAssetsChange,
  onNodeStyleChange,
  onDocumentJsonChange,
}) {
  const [activeAccordion, setActiveAccordion] = useState('node-style');

  const uncommonStyles = activeNode?.style
    ? Object.entries(activeNode.style).reduce((acc, [key, value]) => {
        const commonKeys = ['backgroundColor', 'color', 'fontSize', 'fontWeight', 'textAlign', 'borderRadius', 'padding', 'border', 'objectFit', 'opacity'];
        if (!commonKeys.includes(key)) {
          acc[key] = value;
        }
        return acc;
      }, {})
    : {};

  const hasUncommonStyles = Object.keys(uncommonStyles).length > 0;

  return (
    <Stack spacing={1}>
      <Alert severity="info" sx={{ fontSize: 12 }}>
        این بخش برای ویرایش خام JSON طراحی شده است. فقط در صورت نیاز به تغییرات پیشرفته استفاده کنید.
      </Alert>

      {activeNode && (
        <Accordion
          expanded={activeAccordion === 'node-style'}
          onChange={() => setActiveAccordion(activeAccordion === 'node-style' ? '' : 'node-style')}
        >
          <AccordionSummary expandIcon={<Iconify icon="solar:alt-arrow-down-bold-duotone" width={20} />}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle2">استایل نود انتخاب‌شده</Typography>
              {hasUncommonStyles && (
                <Chip size="small" label={`${Object.keys(uncommonStyles).length} غیرمعمول`} sx={{ height: 18, fontSize: 10 }} />
              )}
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <JsonEditor
              label={hasUncommonStyles ? 'استایل‌های غیرمعمول (raw)' : 'استایل (raw)'}
              value={toPrettyJson(hasUncommonStyles ? uncommonStyles : activeNode.style)}
              onChange={(parsed) => {
                if (hasUncommonStyles && parsed) {
                  const mergedStyle = { ...activeNode.style, ...parsed };
                  onNodeStyleChange?.(mergedStyle);
                } else {
                  onNodeStyleChange?.(parsed ?? {});
                }
              }}
              helperText="استایل‌های غیرمعمول که در Properties نیستند"
            />
          </AccordionDetails>
        </Accordion>
      )}

      <Accordion
        expanded={activeAccordion === 'inputs'}
        onChange={() => setActiveAccordion(activeAccordion === 'inputs' ? '' : 'inputs')}
      >
        <AccordionSummary expandIcon={<Iconify icon="solar:alt-arrow-down-bold-duotone" width={20} />}>
          <Typography variant="subtitle2">Inputs (JSON)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <JsonEditor
            label="Inputs Array"
            value={toPrettyJson(inputs)}
            onChange={(parsed) => {
              if (Array.isArray(parsed)) {
                onInputsChange?.(parsed);
              }
            }}
            helperText="باید یک آرایه باشد"
            rows={10}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={activeAccordion === 'assets'}
        onChange={() => setActiveAccordion(activeAccordion === 'assets' ? '' : 'assets')}
      >
        <AccordionSummary expandIcon={<Iconify icon="solar:alt-arrow-down-bold-duotone" width={20} />}>
          <Typography variant="subtitle2">Assets (JSON)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <JsonEditor
            label="Assets Object"
            value={toPrettyJson(assets)}
            onChange={(parsed) => {
              if (parsed && typeof parsed === 'object') {
                onAssetsChange?.(parsed);
              }
            }}
            helperText="باید یک object باشد"
            rows={8}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={activeAccordion === 'document'}
        onChange={() => setActiveAccordion(activeAccordion === 'document' ? '' : 'document')}
      >
        <AccordionSummary expandIcon={<Iconify icon="solar:alt-arrow-down-bold-duotone" width={20} />}>
          <Typography variant="subtitle2">سند کامل (JSON)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <JsonEditor
            label="Full Document"
            value={toPrettyJson(document)}
            onChange={onDocumentJsonChange}
            helperText="تغییر این بخش می‌تواند سند را خراب کند - با احتیاط"
            rows={15}
          />
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}
