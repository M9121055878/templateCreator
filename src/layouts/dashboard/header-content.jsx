'use client';

import { Button, IconButton, Stack, Typography, useTheme } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { usePageHeader } from 'src/contexts/page-header-context';

export function HeaderContent() {
  const theme = useTheme();
  const { headerData } = usePageHeader();

  if (!headerData.title) {
    return null;
  }

  const renderBackButton = () => {
    if (!headerData.backAction) return null;

    return (
      <IconButton
        onClick={headerData.backAction.onClick}
        sx={{
          mr: 2,
          color: 'var(--color, inherit)',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <Iconify icon="mingcute:arrow-right-line" />
      </IconButton>
    );
  };

  const renderAction = () => {
    if (!headerData.action) return null;

    return (
      <Button
        variant={headerData.action.variant || 'contained'}
        color={headerData.action.color || 'inherit'}
        startIcon={headerData.action.icon ? <Iconify icon={headerData.action.icon} /> : null}
        onClick={headerData.action.onClick}
        disabled={headerData.action.disabled}
        size="small"
        sx={{
          display: { xs: 'none', md: 'flex' },
          minHeight: 36,
        }}
        {...headerData.action.buttonProps}
      >
        {headerData.action.label}
      </Button>
    );
  };

  const renderMobileAction = () => {
    if (!headerData.action) return null;

    return (
      <IconButton
        onClick={headerData.action.onClick}
        disabled={headerData.action.disabled}
        sx={{
          display: { xs: 'flex', md: 'none' },
          color: 'var(--color, inherit)',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        {headerData.action.icon ? (
          <Iconify icon={headerData.action.icon} />
        ) : (
          <Iconify icon="mingcute:more-2-line" />
        )}
      </IconButton>
    );
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        width: '100%',
        px: { xs: 2, md: 0 },
      }}
    >
      {/* Left side - Back button + Title */}
      <Stack direction="row" alignItems="center" spacing={0} sx={{ flex: 1 }}>
        {renderBackButton()}
        <Stack spacing={0.5}>
          <Typography
            variant="h6"
            sx={{
              color: 'var(--color, inherit)',
              fontWeight: 600,
              textAlign: { xs: 'center', md: 'right' },
            }}
          >
            {headerData.title}
          </Typography>
          {headerData.subtitle && (
            <Typography
              variant="caption"
              sx={{
                color: 'var(--color, inherit)',
                opacity: 0.7,
                textAlign: { xs: 'center', md: 'right' },
              }}
            >
              {headerData.subtitle}
            </Typography>
          )}
        </Stack>
      </Stack>

      {/* Right side - Action buttons */}
      <Stack direction="row" alignItems="center" spacing={1}>
        {renderAction()}
        {renderMobileAction()}
      </Stack>
    </Stack>
  );
}