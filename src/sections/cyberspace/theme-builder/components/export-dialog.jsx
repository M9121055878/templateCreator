'use client';

import { useMemo, useState } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

export function ExportDialog({ open, onClose, mode, document, documents, onCopied }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const jsonContent = useMemo(() => {
    if (mode === 'active' && document) {
      return JSON.stringify({ document }, null, 2);
    }
    if (mode === 'all' && documents) {
      return JSON.stringify({ documents }, null, 2);
    }
    return '';
  }, [mode, document, documents]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonContent);
      setCopied(true);
      onCopied?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'active'
      ? `template-${document?.id || 'export'}.json`
      : 'templates-all.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    setCopied(false);
    setActiveTab(0);
    onClose();
  };

  const title = mode === 'active' ? 'Export Active Template' : 'Export All Templates';
  const count = mode === 'active' ? 1 : documents?.length || 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:download-minimalistic-bold-duotone" width={24} />
          <Typography>{title}</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <Alert severity="info" sx={{ fontSize: 12 }}>
            {mode === 'active'
              ? `در حال export کردن template: ${document?.meta?.title || document?.id || 'Unknown'}`
              : `${count} template برای export آماده است`}
          </Alert>

          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} size="small">
            <Tab label="JSON Preview" />
            <Tab label="Raw Text" />
          </Tabs>

          <Box hidden={activeTab !== 0}>
            <Box
              sx={{
                bgcolor: 'background.neutral',
                p: 2,
                borderRadius: 1,
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                maxHeight: 400,
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {jsonContent}
            </Box>
          </Box>

          <Box hidden={activeTab !== 1}>
            <TextField
              fullWidth
              multiline
              rows={12}
              value={jsonContent}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                },
              }}
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} variant="outlined">
          بستن
        </Button>
        <Button
          onClick={handleCopy}
          variant="outlined"
          startIcon={<Iconify icon={copied ? "solar:check-circle-bold-duotone" : "solar:copy-bold-duotone"} width={18} color={copied ? "success" : undefined} />}
        >
          {copied ? 'کپی شد!' : 'Copy to Clipboard'}
        </Button>
        <Button
          onClick={handleDownload}
          variant="contained"
          startIcon={<Iconify icon="solar:download-minimalistic-bold-duotone" width={18} />}
        >
          Download File
        </Button>
      </DialogActions>
    </Dialog>
  );
}
