'use client';

import { useState } from 'react';
import { Card, Box, Button, Container, Typography, Stack, IconButton } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { UserCreateDialog } from './user-create-dialog';
import { UserTable } from './user-table';

export function UsersView() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateSuccess = () => {
    setOpenCreateDialog(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">مدیریت کاربران</Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => setOpenCreateDialog(true)}
        >
          کاربر جدید
        </Button>
      </Stack>

      <Card>
        <UserTable refreshKey={refreshKey} />
      </Card>

      <UserCreateDialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} onSuccess={handleCreateSuccess} />
    </Container>
  );
}
