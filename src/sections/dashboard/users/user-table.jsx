'use client';

import { useState, useEffect } from 'react';
import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Typography } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import axios from 'src/lib/axios';

export function UserTable({ refreshKey }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [refreshKey]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (roleName) => {
    switch (roleName) {
      case 'admin':
        return 'error';
      case 'company_admin':
        return 'warning';
      case 'user':
        return 'info';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (roleName) => {
    switch (roleName) {
      case 'admin':
        return 'ادمین کل';
      case 'company_admin':
        return 'ادمین شرکت';
      case 'user':
        return 'کاربر';
      default:
        return roleName;
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
            <TableCell>نام نمایشی</TableCell>
            <TableCell>نام کاربری</TableCell>
            <TableCell>نقش</TableCell>
            <TableCell>شرکت</TableCell>
            <TableCell>گروه</TableCell>
            <TableCell>وضعیت</TableCell>
            <TableCell align="right">عملیات</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {user.first_name} {user.last_name}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Chip label={getRoleLabel(user.role?.name)} color={getRoleColor(user.role?.name)} size="small" />
              </TableCell>
              <TableCell>{user.company?.name || '-'}</TableCell>
              <TableCell>{user.group?.name || '-'}</TableCell>
              <TableCell>
                <Chip label={user.is_active ? 'فعال' : 'غیرفعال'} color={user.is_active ? 'success' : 'default'} size="small" />
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
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  کاربری یافت نشد
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
