'use client';

import { useState } from 'react';

import { Card, Container, Stack } from '@mui/material';

import { PageHeader } from 'src/components/page-header';

import { CompanyCreateDialog } from './company-create-dialog';
import { CompanyTable } from './company-table';

export function CompaniesView() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateSuccess = () => {
    setOpenCreateDialog(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Container maxWidth="xl">
      <PageHeader
        title="شرکت ها"
        subtitle="مدیریت شرکت‌ها"
        action={{
          label: 'شرکت جدید',
          icon: 'mingcute:add-line',
          onClick: () => setOpenCreateDialog(true),
        }}
      />

      <Stack spacing={3}>
        <Card>
          <CompanyTable refreshKey={refreshKey} />
        </Card>

        <CompanyCreateDialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} onSuccess={handleCreateSuccess} />
      </Stack>
    </Container>
  );
}
