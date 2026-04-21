'use client';

import { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Typography } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import axios from 'src/lib/axios';

export function RoleTable({ refreshKey }) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, [refreshKey]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/roles');
      setRoles(response.data.roles || []);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
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
            <TableCell>توضیحات</TableCell>
            <TableCell>دسترسی‌ها</TableCell>
            <TableCell align="right">عملیات</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell>{role.name}</TableCell>
              <TableCell>{role.description || '-'}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {role.permissions?.map((permission) => (
                    <Chip key={permission} label={permission} size="small" variant="outlined" />
                  ))}
                </Box>
              </TableCell>
              <TableCell align="right">
                <IconButton size="small">
                  <Iconify icon="solar:pen-bold" />
                </IconButton>
                {role.name !== 'admin' && role.name !== 'company_admin' && role.name !== 'user' && (
                  <IconButton size="small" color="error">
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
          {roles.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  نقشی یافت نشد
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
