'use client';

import { useState } from 'react';

import { Card, Container, Stack } from '@mui/material';

import { PageHeader } from 'src/components/page-header';

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
      <Stack spacing={5}>
        <PageHeader
          title="کاربران"
          subtitle="مدیریت کاربران سیستم"
          action={{
            label: 'کاربر جدید',
            icon: 'mingcute:add-line',
            onClick: () => setOpenCreateDialog(true),
          }}
        />

        <Card>
          <UserTable refreshKey={refreshKey} />
        </Card>

        <UserCreateDialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} onSuccess={handleCreateSuccess} />
      </Stack>
    </Container>
  );
}
