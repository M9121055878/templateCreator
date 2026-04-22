'use client';

import { Button, IconButton, Stack, Typography, useTheme } from '@mui/material';

import { Iconify } from 'src/components/iconify';

export function PageHeader({
  title,
  subtitle,
  action,
  backAction,
  sx,
  ...other
}) {
  const theme = useTheme();

  const renderBackButton = () => {
    if (!backAction) return null;

    return (
      <IconButton
        onClick={backAction.onClick}
        sx={{
          mr: 2,
          color: 'text.primary',
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
    if (!action) return null;

    return (
      <Button
        variant={action.variant || 'contained'}
        color={action.color || 'inherit'}
        startIcon={action.icon ? <Iconify icon={action.icon} /> : null}
        onClick={action.onClick}
        disabled={action.disabled}
        {...action.buttonProps}
      >
        {action.label}
      </Button>
    );
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        mb: { xs: 3, md: 5 },
        ...sx,
      }}
      {...other}
    >
      <Stack direction="row" alignItems="center" spacing={0}>
        {renderBackButton()}
        <Stack spacing={0.5}>
          <Typography
            variant="h4"
            sx={{
              textAlign: { xs: 'center', md: 'right' },
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                textAlign: { xs: 'center', md: 'right' },
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Stack>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          display: { xs: 'none', md: 'flex' },
        }}
      >
        {renderAction()}
      </Stack>

      {/* Mobile action button */}
      {action && (
        <Stack
          sx={{
            display: { xs: 'flex', md: 'none' },
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: theme.zIndex.fab,
          }}
        >
          <Button
            variant={action.variant || 'contained'}
            color={action.color || 'primary'}
            onClick={action.onClick}
            disabled={action.disabled}
            sx={{
              minWidth: 56,
              height: 56,
              borderRadius: '50%',
              boxShadow: theme.shadows[8],
              '&:hover': {
                boxShadow: theme.shadows[12],
              },
            }}
            {...action.buttonProps}
          >
            {action.icon ? <Iconify icon={action.icon} /> : action.label}
          </Button>
        </Stack>
      )}
    </Stack>
  );
}