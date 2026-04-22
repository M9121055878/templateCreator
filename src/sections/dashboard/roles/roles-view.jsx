'use client';

import { useState } from 'react';

import { Card, Container, Stack } from '@mui/material';

import { PageHeader } from 'src/components/page-header';

import { RoleCreateDialog } from './role-create-dialog';
import { RoleTable } from './role-table';

export function RolesView() {
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
          title="نقش ها"
          subtitle="مدیریت نقش‌ها و دسترسی‌ها"
          action={{
            label: 'نقش جدید',
            icon: 'mingcute:add-line',
            onClick: () => setOpenCreateDialog(true),
          }}
        />

        <Card>
          <RoleTable refreshKey={refreshKey} />
        </Card>

        <RoleCreateDialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} onSuccess={handleCreateSuccess} />
      </Stack>
    </Container>
  );
}
