'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { AdvancedTab } from './advanced-tab';
import { ContentTab } from './content-tab';
import { InputsEditor } from './inputs-editor';
import { PropertiesTab } from './properties-tab';
import { AssetsEditor } from './assets-editor';

const RECOMMENDED_FORMATS = ['jpg', 'png'];
const TEMPLATE_STATUSES = ['draft', 'active', 'archived'];

function MetaSection({ document, onMetaChange, onSizeChange, onStatusChange }) {
  const meta = document?.meta || {};
  const size = meta.size || { width: 1080, height: 1080 };

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Iconify icon="solar:settings-bold-duotone" width={18} />
        <Typography variant="subtitle2">تنظیمات سند</Typography>
      </Stack>

      <Stack spacing={1.5}>
        <TextField
          fullWidth
          size="small"
          label="عنوان"
          value={meta.title || ''}
          onChange={(e) => onMetaChange('title', e.target.value)}
        />

        <TextField
          fullWidth
          size="small"
          label="دسته‌بندی"
          value={meta.category || ''}
          onChange={(e) => onMetaChange('category', e.target.value)}
        />

        <TextField
          fullWidth
          size="small"
          select
          label="وضعیت"
          value={document?.status || 'draft'}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          {TEMPLATE_STATUSES.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          size="small"
          select
          label="فرمت پیشنهادی"
          value={meta.recommendedFormat || 'jpg'}
          onChange={(e) => onMetaChange('recommendedFormat', e.target.value)}
        >
          {RECOMMENDED_FORMATS.map((f) => (
            <MenuItem key={f} value={f}>
              {f.toUpperCase()}
            </MenuItem>
          ))}
        </TextField>

        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            type="number"
            label="Width"
            value={size.width}
            onChange={(e) => {
              const val = Number(e.target.value);
              onSizeChange('width', val > 0 ? val : 1080);
            }}
            inputProps={{ min: 1 }}
            sx={{ flex: 1 }}
          />
          <TextField
            size="small"
            type="number"
            label="Height"
            value={size.height}
            onChange={(e) => {
              const val = Number(e.target.value);
              onSizeChange('height', val > 0 ? val : 1080);
            }}
            inputProps={{ min: 1 }}
            sx={{ flex: 1 }}
          />
        </Stack>
      </Stack>

      <Divider sx={{ my: 2 }} />
    </Box>
  );
}

export function RightPanel({
  document,
  activeNode,
  selectedNodeId,
  validationErrors,
  onMetaChange,
  onStatusChange,
  onNodeFieldChange,
  onInputsChange,
  onAssetsChange,
  onSizeChange,
}) {
  const [activeTab, setActiveTab] = useState('properties');

  const tabs = [
    { id: 'properties', label: 'Properties', icon: <Iconify icon="solar:tuning-2-bold-duotone" width={18} /> },
    { id: 'content', label: 'Content', icon: <Iconify icon="solar:text-bold-duotone" width={18} /> },
    { id: 'inputs', label: 'Inputs', icon: <Iconify icon="solar:checklist-minimalistic-bold-duotone" width={18} /> },
    { id: 'assets', label: 'Assets', icon: <Iconify icon="solar:folder-with-files-bold-duotone" width={18} /> },
    { id: 'advanced', label: 'Advanced', icon: <Iconify icon="solar:code-square-bold-duotone" width={18} /> },
  ];

  const handleTabChange = (_, value) => {
    setActiveTab(value);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
      }}
    >
      <CardContent
        sx={{
          p: 0,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          '&:last-child': { pb: 0 },
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ minHeight: 44 }}
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                value={tab.id}
                icon={tab.icon}
                label={tab.label}
                iconPosition="start"
                sx={{ minHeight: 44, textTransform: 'none', fontSize: '0.8rem' }}
              />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {activeTab === 'properties' && (
            <>
              <MetaSection
                document={document}
                onMetaChange={onMetaChange}
                onStatusChange={onStatusChange}
                onSizeChange={onSizeChange}
              />
              <PropertiesTab
                activeNode={activeNode}
                document={document}
                validationErrors={validationErrors}
                onNodeFieldChange={onNodeFieldChange}
              />
            </>
          )}

          {activeTab === 'content' && (
            <ContentTab activeNode={activeNode} onNodeFieldChange={onNodeFieldChange} />
          )}

          {activeTab === 'inputs' && (
            <InputsEditor inputs={document?.inputs || []} onChange={onInputsChange} />
          )}

          {activeTab === 'assets' && (
            <AssetsEditor assets={document?.assets || {}} onChange={onAssetsChange} />
          )}

          {activeTab === 'advanced' && (
            <AdvancedTab
              document={document}
              activeNode={activeNode}
              inputs={document?.inputs || []}
              assets={document?.assets || {}}
              onInputsChange={onInputsChange}
              onAssetsChange={onAssetsChange}
              onNodeStyleChange={(style) => onNodeFieldChange('style', style)}
              onDocumentJsonChange={(parsed) => {
                // Only allow if it's valid
                if (parsed && typeof parsed === 'object') {
                  // This would need a full document replace function
                  console.log('Document JSON changed:', parsed);
                }
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
