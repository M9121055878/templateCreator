'use client';

import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { DashboardContent } from 'src/layouts/dashboard';
import { PageHeader } from 'src/components/page-header';
import { Iconify } from 'src/components/iconify';
import { createEditorStore } from 'src/features/templates/editor/state/editor-store';
import { mapDslToEditorState } from 'src/features/templates/editor/adapters/dsl-to-editor';
import { mapEditorStateToDsl } from 'src/features/templates/editor/adapters/editor-to-dsl';
import { parseTemplateDocument, renderTemplateContent, resolveTemplateRuntime } from 'src/features/templates';

import { toast } from 'src/components/snackbar';

import {
  Canvas,
  LeftPanel,
  RightPanel,
  ImportDialog,
  ExportDialog,
} from '../components';

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildDefaultValues(document) {
  return (document.inputs ?? []).reduce((acc, input) => {
    acc[input.key] = input.default ?? '';
    return acc;
  }, {});
}

function normalizeErrors(error) {
  const details = error?.issues ?? error?.errors;
  if (!Array.isArray(details)) return [error?.message ?? 'Invalid template document'];

  return details.map((item) => `${item.path?.join('.') || 'document'}: ${item.message}`);
}

export function ThemeBuilderView() {
  const [templates, setTemplates] = useState([]);
  const [activeTemplateId, setActiveTemplateId] = useState(null);
  const [document, setDocument] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);

  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportDialogMode, setExportDialogMode] = useState('active');
  const [exportDialogData, setExportDialogData] = useState(null);

  useEffect(() => {
    loadTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/templates/editor');
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to load template list.');
      }

      const list = payload.templates ?? [];
      setTemplates(list);

      if (!activeTemplateId && list.length > 0) {
        await loadTemplate(list[0].id);
      } else if (activeTemplateId && list.some((item) => item.id === activeTemplateId)) {
        await loadTemplate(activeTemplateId);
      } else if (list.length === 0) {
        setActiveTemplateId(null);
        setDocument(null);
      }
    } catch (error) {
      toast.error(error?.message ?? 'خطا در دریافت لیست تمپلیت‌ها');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTemplate = async (templateId) => {
    try {
      const response = await fetch(`/api/templates/editor/${templateId}`);
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to load template.');
      }

      // Normalize document to ensure size values are valid
      const normalizedDocument = {
        ...payload.document,
        meta: {
          ...payload.document.meta,
          size: {
            width: (payload.document.meta?.size?.width || 0) > 0 ? payload.document.meta.size.width : 1080,
            height: (payload.document.meta?.size?.height || 0) > 0 ? payload.document.meta.size.height : 1080,
          },
        },
      };

      const parsed = parseTemplateDocument(normalizedDocument);
      const store = createEditorStore(parsed);

      setActiveTemplateId(parsed.id);
      setDocument(parsed);
      setSelectedNodeId(store.selectedNodeId);
      setDirty(false);
      setValidationErrors([]);
    } catch (error) {
      toast.error(error?.message ?? 'خطا در بارگذاری تمپلیت');
    }
  };

  const activeNode = useMemo(() => {
    if (!document || !selectedNodeId) return null;

    if (selectedNodeId === document.layout?.root?.id) {
      return document.layout.root;
    }

    return document.layout?.nodes?.[selectedNodeId] ?? null;
  }, [document, selectedNodeId]);

  const preview = useMemo(() => {
    if (!document) return null;

    const runtime = resolveTemplateRuntime(document, buildDefaultValues(document));
    return renderTemplateContent(
      {
        engine: document.engine,
        document,
      },
      runtime
    );
  }, [document]);

  const applyDocumentChange = (updater) => {
    setDocument((prev) => {
      if (!prev) return prev;

      const next = updater(prev);
      const editorState = mapDslToEditorState(next);
      const roundTrip = mapEditorStateToDsl(editorState, next);
      setDirty(true);

      try {
        parseTemplateDocument(roundTrip);
        setValidationErrors([]);
      } catch (error) {
        setValidationErrors(normalizeErrors(error));
      }

      return roundTrip;
    });
  };

  const handleMetaFieldChange = (field, value) => {
    applyDocumentChange((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        [field]: value,
      },
    }));
  };

  const handleStatusChange = (value) => {
    applyDocumentChange((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const handleSizeChange = (dimension, value) => {
    const numValue = toNumber(value, document?.meta?.size?.[dimension]);
    const positiveValue = numValue > 0 ? numValue : 1080;
    applyDocumentChange((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        size: {
          ...prev.meta.size,
          [dimension]: positiveValue,
        },
      },
    }));
  };

  const handleNodeFieldChange = (field, value) => {
    if (!document || !selectedNodeId || !activeNode) return;

    if (selectedNodeId === document.layout.root.id) {
      applyDocumentChange((prev) => ({
        ...prev,
        layout: {
          ...prev.layout,
          root: {
            ...prev.layout.root,
            [field]: value,
          },
        },
      }));
      return;
    }

    applyDocumentChange((prev) => ({
      ...prev,
      layout: {
        ...prev.layout,
        nodes: {
          ...prev.layout.nodes,
          [selectedNodeId]: {
            ...prev.layout.nodes[selectedNodeId],
            [field]: value,
          },
        },
      },
    }));
  };

  const handleInputsChange = (newInputs) => {
    applyDocumentChange((prev) => ({
      ...prev,
      inputs: newInputs,
    }));
  };

  const handleAssetsChange = (newAssets) => {
    applyDocumentChange((prev) => ({
      ...prev,
      assets: newAssets,
    }));
  };

  const handleSave = async () => {
    if (!document || validationErrors.length > 0) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/templates/editor/${document.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to save template.');
      }

      setDocument(payload.document);
      setDirty(false);
      setValidationErrors([]);
      toast.success('تمپلیت با موفقیت ذخیره شد');
      await loadTemplates();
    } catch (error) {
      toast.error(error?.message ?? 'خطا در ذخیره تمپلیت');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/templates/editor', { method: 'POST' });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to create template.');
      }

      toast.success('تمپلیت جدید ساخته شد');
      await loadTemplates();
      await loadTemplate(payload.document.id);
    } catch (error) {
      toast.error(error?.message ?? 'خطا در ساخت تمپلیت');
    }
  };

  const handleDuplicate = async () => {
    if (!activeTemplateId) return;

    try {
      const response = await fetch('/api/templates/editor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duplicateFrom: activeTemplateId }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to duplicate template.');
      }

      toast.success('تمپلیت کپی شد');
      await loadTemplates();
      await loadTemplate(payload.document.id);
    } catch (error) {
      toast.error(error?.message ?? 'خطا در کپی تمپلیت');
    }
  };

  const handleDelete = async () => {
    if (!activeTemplateId) return;

    try {
      const response = await fetch(`/api/templates/editor/${activeTemplateId}`, {
        method: 'DELETE',
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to delete template.');
      }

      toast.success('تمپلیت حذف شد');
      setActiveTemplateId(null);
      setDocument(null);
      await loadTemplates();
    } catch (error) {
      toast.error(error?.message ?? 'خطا در حذف تمپلیت');
    }
  };

  const handleExportActive = async () => {
    if (!activeTemplateId) return;

    try {
      const response = await fetch(`/api/templates/editor/export?templateId=${activeTemplateId}`);
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to export template.');
      }

      setExportDialogMode('active');
      setExportDialogData({ document: payload.document });
      setExportDialogOpen(true);
    } catch (error) {
      toast.error(error?.message ?? 'خطا در خروجی گرفتن تمپلیت فعال');
    }
  };

  const handleExportAll = async () => {
    try {
      const response = await fetch('/api/templates/editor/export');
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to export templates.');
      }

      setExportDialogMode('all');
      setExportDialogData({ documents: payload.documents ?? [] });
      setExportDialogOpen(true);
    } catch (error) {
      toast.error(error?.message ?? 'خطا در خروجی گرفتن همه تمپلیت‌ها');
    }
  };

  const handleImport = async (body) => {
    const response = await fetch('/api/templates/editor/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || 'Failed to import templates.');
    }

    if (payload.errors?.length) {
      toast.error(
        `Import partially failed. imported=${payload.imported}, skipped=${payload.skipped}, errors=${payload.errors.length}`
      );
    } else {
      toast.success(`Import done. imported=${payload.imported}, skipped=${payload.skipped}`);
    }

    await loadTemplates();
  };

  return (
    <DashboardContent maxWidth="xl" sx={{ px: { xs: 1, md: 2 } }}>
      <PageHeader
        title="تم ساز"
        subtitle={document?.meta?.title || 'بدون عنوان'}
        action={{
          label: 'ساخت تم جدید',
          icon: 'mingcute:add-line',
          onClick: handleCreate,
        }}
      />

      <Stack spacing={2} sx={{ height: 'calc(100vh - 180px)', minHeight: 600 }}>
        {/* Secondary Actions Menu */}
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Iconify icon="mingcute:save-line" />}
            onClick={handleSave}
            disabled={!dirty || isSaving || !document || validationErrors.length > 0}
          >
            {isSaving ? 'در حال ذخیره...' : 'ذخیره'}
          </Button>
          
          <Button
            size="small"
            variant="outlined"
            startIcon={<Iconify icon="mingcute:more-2-line" />}
            onClick={(e) => setMenuAnchor(e.currentTarget)}
          >
            سایر عملیات
          </Button>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
          >
            <MenuItem onClick={() => { setImportDialogOpen(true); setMenuAnchor(null); }}>
              <Iconify icon="mingcute:upload-line" sx={{ mr: 1 }} />
              ایمپورت
            </MenuItem>
            <MenuItem onClick={() => { handleExportActive(); setMenuAnchor(null); }} disabled={!activeTemplateId}>
              <Iconify icon="mingcute:download-line" sx={{ mr: 1 }} />
              اکسپورت فعال
            </MenuItem>
            <MenuItem onClick={() => { handleExportAll(); setMenuAnchor(null); }}>
              <Iconify icon="mingcute:download-line" sx={{ mr: 1 }} />
              اکسپورت همه
            </MenuItem>
            <MenuItem onClick={() => { handleDuplicate(); setMenuAnchor(null); }} disabled={!activeTemplateId}>
              <Iconify icon="mingcute:copy-line" sx={{ mr: 1 }} />
              کپی
            </MenuItem>
            <MenuItem onClick={() => { handleDelete(); setMenuAnchor(null); }} disabled={!activeTemplateId} sx={{ color: 'error.main' }}>
              <Iconify icon="mingcute:delete-line" sx={{ mr: 1 }} />
              پاک کردن
            </MenuItem>
          </Menu>
        </Stack>

        <Box
          sx={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '280px 1fr 340px' },
            gridTemplateRows: { xs: 'auto auto 1fr', md: '1fr' },
            gap: 2,
            minHeight: 0,
          }}
        >
          <Box sx={{ minHeight: 0, overflow: 'hidden' }}>
            <LeftPanel
              templates={templates}
              activeTemplateId={activeTemplateId}
              isLoading={isLoading}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onTemplateSelect={loadTemplate}
            />
          </Box>

          <Box sx={{ minHeight: 0, overflow: 'hidden' }}>
            <Canvas
              document={document}
              preview={preview}
              selectedNodeId={selectedNodeId}
              dirty={dirty}
              onNodeSelect={setSelectedNodeId}
            />
          </Box>

          <Box sx={{ minHeight: 0, overflow: 'hidden' }}>
            <RightPanel
              document={document}
              activeNode={activeNode}
              selectedNodeId={selectedNodeId}
              validationErrors={validationErrors}
              onMetaChange={handleMetaFieldChange}
              onStatusChange={handleStatusChange}
              onSizeChange={handleSizeChange}
              onNodeFieldChange={handleNodeFieldChange}
              onInputsChange={handleInputsChange}
              onAssetsChange={handleAssetsChange}
            />
          </Box>
        </Box>
      </Stack>

      <ImportDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onImport={handleImport}
      />

      <ExportDialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        mode={exportDialogMode}
        document={exportDialogData?.document}
        documents={exportDialogData?.documents}
        onCopied={() => toast.success('در clipboard کپی شد')}
      />
    </DashboardContent>
  );
}
