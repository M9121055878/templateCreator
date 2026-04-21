'use client';

import { useState } from 'react';
import { Container, Stack, Typography, Button, Card } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { CompanyTable } from './company-table';
import { CompanyCreateDialog } from './company-create-dialog';

export function CompaniesView() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateSuccess = () => {
    setOpenCreateDialog(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">مدیریت شرکت‌ها</Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => setOpenCreateDialog(true)}
        >
          شرکت جدید
        </Button>
      </Stack>

      <Card>
        <CompanyTable refreshKey={refreshKey} />
      </Card>

      <CompanyCreateDialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} onSuccess={handleCreateSuccess} />
    </Container>
  );
}
