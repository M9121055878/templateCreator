'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

export function Toolbar({
  document,
  dirty,
  isSaving,
  activeTemplateId,
  validationErrors,
  onSave,
  onImport,
  onExportActive,
  onExportAll,
  onCreate,
  onDuplicate,
  onDelete,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 2,
        px: { xs: 2, md: 3 },
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            تم‌ساز
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {document?.meta?.title || 'بدون عنوان'}
            </Typography>
            {dirty && (
              <Tooltip title="تغییرات ذخیره نشده">
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'warning.main',
                  }}
                />
              </Tooltip>
            )}
            {validationErrors.length > 0 && (
              <Chip size="small" color="error" label={`${validationErrors.length} خطا`} />
            )}
          </Stack>
        </Box>
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{
          flexWrap: 'wrap',
          gap: 1,
          justifyContent: 'flex-end',
        }}
      >
        <Button
          size="small"
          variant="outlined"
          startIcon={<Iconify icon="solar:upload-minimalistic-bold-duotone" width={18} />}
          onClick={onImport}
        >
          Import
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<Iconify icon="solar:download-minimalistic-bold-duotone" width={18} />}
          onClick={onExportActive}
          disabled={!activeTemplateId}
        >
          Export Active
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<Iconify icon="solar:download-minimalistic-bold-duotone" width={18} />}
          onClick={onExportAll}
        >
          Export All
        </Button>

        <Box component="span" sx={{ width: 1, height: 24, bgcolor: 'divider', mx: 1 }} />

        <Button
          size="small"
          variant="outlined"
          startIcon={<Iconify icon="solar:add-circle-bold-duotone" width={18} />}
          onClick={onCreate}
        >
          New
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<Iconify icon="solar:copy-bold-duotone" width={18} />}
          onClick={onDuplicate}
          disabled={!activeTemplateId}
        >
          Duplicate
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="error"
          startIcon={<Iconify icon="solar:trash-bin-trash-bold-duotone" width={18} />}
          onClick={onDelete}
          disabled={!activeTemplateId}
        >
          Delete
        </Button>

        <Box component="span" sx={{ width: 1, height: 24, bgcolor: 'divider', mx: 1 }} />

        <Button
          size="small"
          variant="contained"
          startIcon={<Iconify icon="solar:diskette-bold-duotone" width={18} />}
          onClick={onSave}
          disabled={!dirty || isSaving || !document || validationErrors.length > 0}
          loading={isSaving}
        >
          Save
        </Button>
      </Stack>
    </Box>
  );
}
