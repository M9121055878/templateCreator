'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { Container, Stack, Typography, Button, Card, Box } from '@mui/material';
import { PageHeader } from 'src/components/page-header';
import { Iconify } from 'src/components/iconify';
import { GroupTable } from '../groups/group-table';
import { GroupCreateDialog } from '../groups/group-create-dialog';
import axios from 'src/lib/axios';

export function CompanyDetailView({ companySlug }) {
  const router = useRouter();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchCompany();
  }, [companySlug]);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/companies/${companySlug}`);
      setCompany(response.data.company);
    } catch (error) {
      console.error('Failed to fetch company:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setOpenCreateDialog(false);
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography>در حال بارگذاری...</Typography>
        </Box>
      </Container>
    );
  }

  if (!company) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography>شرکت یافت نشد</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Stack spacing={4}>
        <PageHeader
          title={`جزئیات شرکت: ${company.name}`}
          backAction={{
            onClick: () => router.push(paths.dashboard.companies),
          }}
        />

        <Card sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
              نام شرکت
            </Typography>
            <Typography variant="h6">{company.name}</Typography>
            
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', mt: 2 }}>
              Slug
            </Typography>
            <Typography variant="body1">{company.slug}</Typography>
            
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', mt: 2 }}>
              وضعیت
            </Typography>
            <Typography variant="body1">
              {company.is_active ? 'فعال' : 'غیرفعال'}
            </Typography>
          </Stack>
        </Card>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h5">گروه‌ها</Typography>
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
          <GroupTable refreshKey={refreshKey} companyId={company?.id} />
        </Card>

        <GroupCreateDialog
          open={openCreateDialog}
          onClose={() => setOpenCreateDialog(false)}
          onSuccess={handleCreateSuccess}
          defaultCompanyId={company?.id}
        />
      </Stack>
    </Container>
  );
}
