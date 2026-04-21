'use client';

import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { DashboardContent } from 'src/layouts/dashboard';
import { createEditorStore } from 'src/features/templates/editor/state/editor-store';
import { mapDslToEditorState } from 'src/features/templates/editor/adapters/dsl-to-editor';
import { mapEditorStateToDsl } from 'src/features/templates/editor/adapters/editor-to-dsl';
import { parseTemplateDocument, renderTemplateContent, resolveTemplateRuntime } from 'src/features/templates';

import { toast } from 'src/components/snackbar';

const EMPTY_JSON = '{}';

function toPrettyJson(value) {
  return JSON.stringify(value ?? {}, null, 2);
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseJsonOrNull(raw) {
  if (!raw?.trim()) return null;
  return JSON.parse(raw);
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
  const [history, setHistory] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const [assetsText, setAssetsText] = useState(EMPTY_JSON);
  const [inputsText, setInputsText] = useState('[]');
  const [nodeStyleText, setNodeStyleText] = useState(EMPTY_JSON);

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

      const parsed = parseTemplateDocument(payload.document);
      const store = createEditorStore(parsed);

      setActiveTemplateId(parsed.id);
      setDocument(parsed);
      setSelectedNodeId(store.selectedNodeId);
      setHistory(store.history);
      setDirty(store.dirty);
      setValidationErrors([]);
      setAssetsText(toPrettyJson(parsed.assets ?? {}));
      setInputsText(toPrettyJson(parsed.inputs ?? []));
      setNodeStyleText(toPrettyJson(parsed.layout?.root?.style ?? {}));
    } catch (error) {
      toast.error(error?.message ?? 'خطا در بارگذاری تمپلیت');
    }
  };

  const handleBootstrapFromFiles = async () => {
    setIsBootstrapping(true);
    try {
      const response = await fetch('/api/templates/editor/bootstrap-from-files', { method: 'POST' });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to bootstrap templates from files.');
      }

      if (payload.errors?.length) {
        toast.error(`Bootstrap completed with ${payload.errors.length} error(s).`);
      } else {
        toast.success(`Bootstrap done. imported=${payload.imported}, skipped=${payload.skipped}`);
      }

      await loadTemplates();
    } catch (error) {
      toast.error(error?.message ?? 'خطا در bootstrap تمپلیت‌ها');
    } finally {
      setIsBootstrapping(false);
    }
  };

  useEffect(() => {
    handleBootstrapFromFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      setHistory((prevHistory) => [...prevHistory, roundTrip].slice(-40));
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

  useEffect(() => {
    setNodeStyleText(toPrettyJson(activeNode?.style ?? {}));
  }, [activeNode]);

  const handleMetaFieldChange = (field, value) => {
    applyDocumentChange((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        [field]: value,
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

  const handleInputsCommit = () => {
    try {
      const parsed = parseJsonOrNull(inputsText);
      if (!Array.isArray(parsed)) {
        throw new Error('inputs must be an array');
      }

      applyDocumentChange((prev) => ({ ...prev, inputs: parsed }));
    } catch (error) {
      toast.error(`JSON ورودی نامعتبر است: ${error?.message ?? ''}`);
    }
  };

  const handleAssetsCommit = () => {
    try {
      const parsed = parseJsonOrNull(assetsText);
      applyDocumentChange((prev) => ({ ...prev, assets: parsed ?? {} }));
    } catch (error) {
      toast.error(`JSON assets نامعتبر است: ${error?.message ?? ''}`);
    }
  };

  const handleSave = async () => {
    if (!document) return;

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

      const content = JSON.stringify(payload.document, null, 2);
      await navigator.clipboard.writeText(content);
      toast.success('JSON تمپلیت فعال در clipboard کپی شد');
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

      const content = JSON.stringify(payload.documents ?? [], null, 2);
      await navigator.clipboard.writeText(content);
      toast.success('JSON همه تمپلیت‌ها در clipboard کپی شد');
    } catch (error) {
      toast.error(error?.message ?? 'خطا در خروجی گرفتن همه تمپلیت‌ها');
    }
  };

  const handleImportJson = async () => {
    const raw = window.prompt(
      'JSON تمپلیت را وارد کنید (یک document یا آرایه documents):',
      '{\n  "document": {}\n}'
    );
    if (!raw?.trim()) return;

    try {
      const body = JSON.parse(raw);
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
    } catch (error) {
      toast.error(error?.message ?? 'فرمت JSON واردشده نامعتبر است');
    }
  };

  return (
    <DashboardContent maxWidth="xl">
      <Stack spacing={3}>
        <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4">تم ساز</Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              ادیتور کامل DSL برای مدیریت meta، schema، layout و assets
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              History snapshots: {history.length}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={handleImportJson}>
              Import JSON
            </Button>
            <Button variant="outlined" onClick={handleExportActive} disabled={!activeTemplateId}>
              Export Active
            </Button>
            <Button variant="outlined" onClick={handleExportAll}>
              Export All
            </Button>
            <Button variant="outlined" onClick={handleCreate}>
              New
            </Button>
            <Button variant="outlined" onClick={handleDuplicate} disabled={!activeTemplateId}>
              Duplicate
            </Button>
            <Button variant="outlined" color="error" onClick={handleDelete} disabled={!activeTemplateId}>
              Delete
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={!dirty || isSaving || !document}>
              Save
            </Button>
          </Stack>
        </Stack>

        {isBootstrapping && <Alert severity="info">در حال bootstrap اولیه از فایل‌ها...</Alert>}

        {!!validationErrors.length && (
          <Alert severity="error">
            {validationErrors.map((error) => (
              <Typography key={error} variant="body2">
                {error}
              </Typography>
            ))}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">تمپلیت‌ها</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
                  {isLoading ? 'در حال بارگذاری...' : `${templates.length} تمپلیت`}
                </Typography>
                <List dense sx={{ maxHeight: 560, overflow: 'auto' }}>
                  {templates.map((template) => (
                    <ListItem disablePadding key={template.id}>
                      <ListItemButton
                        selected={template.id === activeTemplateId}
                        onClick={() => loadTemplate(template.id)}
                      >
                        <ListItemText
                          primary={template.title}
                          secondary={`${template.id} • ${template.category}`}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1.5 }}>
                    Canvas / Preview
                  </Typography>
                  <Box
                    sx={{
                      width: '100%',
                      minHeight: 360,
                      border: (theme) => `1px dashed ${theme.palette.divider}`,
                      borderRadius: 1.5,
                      p: 1,
                      overflow: 'auto',
                      bgcolor: 'background.neutral',
                    }}
                  >
                    {preview}
                  </Box>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1.5 }}>
                    Node Selection
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {document?.layout?.root?.id && (
                      <Chip
                        color={selectedNodeId === document.layout.root.id ? 'primary' : 'default'}
                        label={`root (${document.layout.root.id})`}
                        onClick={() => setSelectedNodeId(document.layout.root.id)}
                      />
                    )}
                    {Object.values(document?.layout?.nodes ?? {}).map((node) => (
                      <Chip
                        color={selectedNodeId === node.id ? 'primary' : 'default'}
                        key={node.id}
                        label={`${node.id} (${node.type})`}
                        onClick={() => setSelectedNodeId(node.id)}
                      />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Properties</Typography>
                <Stack spacing={1.5} sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Meta</Typography>
                  <TextField
                    label="Title"
                    value={document?.meta?.title ?? ''}
                    onChange={(event) => handleMetaFieldChange('title', event.target.value)}
                  />
                  <TextField
                    label="Category"
                    value={document?.meta?.category ?? ''}
                    onChange={(event) => handleMetaFieldChange('category', event.target.value)}
                  />
                  <Stack direction="row" spacing={1}>
                    <TextField
                      label="Width"
                      type="number"
                      value={document?.meta?.size?.width ?? 0}
                      onChange={(event) =>
                        applyDocumentChange((prev) => ({
                          ...prev,
                          meta: {
                            ...prev.meta,
                            size: {
                              ...prev.meta.size,
                              width: toNumber(event.target.value, prev.meta.size.width),
                            },
                          },
                        }))
                      }
                    />
                    <TextField
                      label="Height"
                      type="number"
                      value={document?.meta?.size?.height ?? 0}
                      onChange={(event) =>
                        applyDocumentChange((prev) => ({
                          ...prev,
                          meta: {
                            ...prev.meta,
                            size: {
                              ...prev.meta.size,
                              height: toNumber(event.target.value, prev.meta.size.height),
                            },
                          },
                        }))
                      }
                    />
                  </Stack>
                  <TextField
                    label="Recommended Format"
                    value={document?.meta?.recommendedFormat ?? 'png'}
                    onChange={(event) => handleMetaFieldChange('recommendedFormat', event.target.value)}
                  />
                  <TextField
                    label="Status"
                    value={document?.status ?? 'draft'}
                    onChange={(event) =>
                      applyDocumentChange((prev) => ({
                        ...prev,
                        status: event.target.value,
                      }))
                    }
                  />

                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2">Schema (inputs)</Typography>
                  <TextField
                    multiline
                    minRows={8}
                    value={inputsText}
                    onChange={(event) => setInputsText(event.target.value)}
                  />
                  <Button variant="outlined" onClick={handleInputsCommit}>
                    Apply Inputs JSON
                  </Button>

                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2">Selected Node</Typography>
                  <TextField
                    label="Node ID"
                    value={activeNode?.id ?? ''}
                    disabled
                  />
                  <Stack direction="row" spacing={1}>
                    <TextField
                      label="x"
                      type="number"
                      value={activeNode?.x ?? 0}
                      onChange={(event) => handleNodeFieldChange('x', toNumber(event.target.value, 0))}
                    />
                    <TextField
                      label="y"
                      type="number"
                      value={activeNode?.y ?? 0}
                      onChange={(event) => handleNodeFieldChange('y', toNumber(event.target.value, 0))}
                    />
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      label="w"
                      type="number"
                      value={activeNode?.w ?? 0}
                      onChange={(event) => handleNodeFieldChange('w', toNumber(event.target.value, 0))}
                    />
                    <TextField
                      label="h"
                      type="number"
                      value={activeNode?.h ?? 0}
                      onChange={(event) => handleNodeFieldChange('h', toNumber(event.target.value, 0))}
                    />
                  </Stack>
                  <TextField
                    label="text"
                    value={activeNode?.text ?? ''}
                    onChange={(event) => handleNodeFieldChange('text', event.target.value)}
                  />
                  <TextField
                    label="src"
                    value={activeNode?.src ?? ''}
                    onChange={(event) => handleNodeFieldChange('src', event.target.value)}
                  />
                  <TextField
                    label="style (JSON)"
                    multiline
                    minRows={5}
                    value={nodeStyleText}
                    onChange={(event) => {
                      setNodeStyleText(event.target.value);
                      try {
                        const nextStyle = parseJsonOrNull(event.target.value) ?? {};
                        handleNodeFieldChange('style', nextStyle);
                      } catch {
                        // ignore invalid json while user is typing
                      }
                    }}
                  />

                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2">Assets</Typography>
                  <TextField
                    multiline
                    minRows={8}
                    value={assetsText}
                    onChange={(event) => setAssetsText(event.target.value)}
                  />
                  <Button variant="outlined" onClick={handleAssetsCommit}>
                    Apply Assets JSON
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </DashboardContent>
  );
}
