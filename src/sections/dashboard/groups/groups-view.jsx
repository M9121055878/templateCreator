'use client';

import { useState } from 'react';
import { Container, Stack, Typography, Button, Card } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { GroupTable } from './group-table';
import { GroupCreateDialog } from './group-create-dialog';

export function GroupsView() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateSuccess = () => {
    setOpenCreateDialog(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">مدیریت گروه‌ها</Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => setOpenCreateDialog(true)}
        >
          گروه جدید
        </Button>
      </Stack>

      <Card>
        <GroupTable refreshKey={refreshKey} />
      </Card>

      <GroupCreateDialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} onSuccess={handleCreateSuccess} />
    </Container>
  );
}
