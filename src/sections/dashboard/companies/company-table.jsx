'use client';

import { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Typography } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import axios from 'src/lib/axios';

export function CompanyTable({ refreshKey }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>در حال بارگذاری...</Typography>
      </Box>
    );
  }

  return (
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
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.slug}</TableCell>
              <TableCell>
                <Chip label={company.is_active ? 'فعال' : 'غیرفعال'} color={company.is_active ? 'success' : 'default'} size="small" />
              </TableCell>
              <TableCell align="right">
                <IconButton size="small">
                  <Iconify icon="solar:pen-bold" />
                </IconButton>
                <IconButton size="small" color="error">
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
  );
}
