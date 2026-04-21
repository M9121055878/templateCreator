'use client';

import { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Typography } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { CompanyEditDialog } from './company-edit-dialog';
import axios from 'src/lib/axios';

export function CompanyTable({ refreshKey }) {
  const router = useRouter();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, [refreshKey]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/companies');
      setCompanies(response.data.companies || []);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setOpenEditDialog(true);
  };

  const handleDelete = async (companyId) => {
    if (!confirm('آیا از حذف این شرکت اطمینان دارید؟')) return;
    try {
      await axios.delete(`/api/companies/${companyId}`);
      fetchCompanies();
    } catch (error) {
      console.error('Failed to delete company:', error);
      alert('خطا در حذف شرکت');
    }
  };

  const handleEditSuccess = () => {
    setOpenEditDialog(false);
    setSelectedCompany(null);
    fetchCompanies();
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>در حال بارگذاری...</Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>نام</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>وضعیت</TableCell>
              <TableCell align="right">عملیات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>
                  <Typography
                    component="span"
                    sx={{ cursor: 'pointer', color: 'primary.main', fontWeight: 500 }}
                    onClick={() => router.push(paths.dashboard.companiesDetail(company.id))}
                  >
                    {company.name}
                  </Typography>
                </TableCell>
                <TableCell>{company.slug}</TableCell>
                <TableCell>
                  <Chip label={company.is_active ? 'فعال' : 'غیرفعال'} color={company.is_active ? 'success' : 'default'} size="small" />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleEdit(company)}>
                    <Iconify icon="solar:pen-bold" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(company.id)}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {companies.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    شرکتی یافت نشد
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <CompanyEditDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        onSuccess={handleEditSuccess}
        company={selectedCompany}
      />
    </>
  );
}
