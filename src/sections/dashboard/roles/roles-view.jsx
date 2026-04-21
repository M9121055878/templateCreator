'use client';

import { useState } from 'react';
import { Container, Stack, Typography, Button, Card } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { RoleTable } from './role-table';
import { RoleCreateDialog } from './role-create-dialog';

export function RolesView() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateSuccess = () => {
    setOpenCreateDialog(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">مدیریت نقش‌ها</Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => setOpenCreateDialog(true)}
        >
          نقش جدید
        </Button>
      </Stack>

      <Card>
        <RoleTable refreshKey={refreshKey} />
      </Card>

      <RoleCreateDialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} onSuccess={handleCreateSuccess} />
    </Container>
  );
}
