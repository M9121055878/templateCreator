'use client';

import { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Typography } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import axios from 'src/lib/axios';

export function GroupTable({ refreshKey }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, [refreshKey]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/groups');
      setGroups(response.data.groups || []);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
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
            <TableCell>شرکت</TableCell>
            <TableCell>وضعیت</TableCell>
            <TableCell align="right">عملیات</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groups.map((group) => (
            <TableRow key={group.id}>
              <TableCell>{group.name}</TableCell>
              <TableCell>{group.slug}</TableCell>
              <TableCell>{group.company?.name || '-'}</TableCell>
              <TableCell>
                <Chip label={group.is_active ? 'فعال' : 'غیرفعال'} color={group.is_active ? 'success' : 'default'} size="small" />
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
          {groups.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  گروهی یافت نشد
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
