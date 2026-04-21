'use client';

import { useMemo, useState } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

const EXAMPLE_SINGLE = `{
  "document": {
    "id": "tpl-100",
    "version": "1.0.0",
    "engine": "dsl",
    "status": "active",
    "meta": {
      "title": "Example Template",
      "category": "social",
      "size": { "width": 1080, "height": 1080 }
    },
    "inputs": [],
    "layout": { ... }
  }
}`;

const EXAMPLE_ARRAY = `{
  "documents": [
    { "id": "tpl-101", ... },
    { "id": "tpl-102", ... }
  ]
}`;

export function ImportDialog({ open, onClose, onImport, isLoading }) {
  const [jsonText, setJsonText] = useState('');
  const [parseError, setParseError] = useState(null);

  const validation = useMemo(() => {
    if (!jsonText.trim()) {
      return { valid: false, error: null, empty: true };
    }

    try {
      const parsed = JSON.parse(jsonText);
      const hasDocument = parsed && typeof parsed === 'object' && 'document' in parsed;
      const hasDocuments = parsed && typeof parsed === 'object' && Array.isArray(parsed.documents);

      if (!hasDocument && !hasDocuments) {
        return { valid: false, error: 'JSON باید شامل "document" یا "documents" باشد', parsed };
      }

      return { valid: true, error: null, parsed, hasDocument, hasDocuments };
    } catch (err) {
      return { valid: false, error: `خطای JSON: ${err.message}`, empty: false };
    }
  }, [jsonText]);

  const handleClose = () => {
    setJsonText('');
    setParseError(null);
    onClose();
  };

  const handleImport = async () => {
    if (!validation.valid) return;

    try {
      await onImport(validation.parsed);
      handleClose();
    } catch (err) {
      setParseError(err.message || 'خطا در import');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:upload-minimalistic-bold-duotone" width={24} />
          <Typography>Import JSON</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <Alert severity="info" sx={{ fontSize: 12 }}>
            JSON باید شامل یک document تکی یا آرایه‌ای از documents باشد.
            <Box component="div" sx={{ mt: 1 }}>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setJsonText(EXAMPLE_SINGLE);
                }}
                sx={{ fontSize: 12 }}
              >
                نمونه single document
              </Link>
              {' • '}
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setJsonText(EXAMPLE_ARRAY);
                }}
                sx={{ fontSize: 12 }}
              >
                نمونه multiple documents
              </Link>
            </Box>
          </Alert>

          <TextField
            fullWidth
            multiline
            rows={12}
            label="JSON تمپلیت"
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              setParseError(null);
            }}
            error={!!validation.error || !!parseError}
            helperText={validation.error || parseError || 'JSON معتبر وارد کنید'}
            sx={{
              '& .MuiInputBase-root': {
                fontFamily: 'monospace',
                fontSize: '0.85rem',
              },
            }}
          />

          {!validation.empty && validation.valid && (
            <Alert severity="success" sx={{ fontSize: 12 }}>
              {validation.hasDocument && 'یک document شناسایی شد'}
              {validation.hasDocuments && `${validation.parsed.documents.length} document شناسایی شد`}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} variant="outlined">
          انصراف
        </Button>
        <Button
          onClick={handleImport}
          variant="contained"
          disabled={!validation.valid || isLoading}
          loading={isLoading}
        >
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
}
