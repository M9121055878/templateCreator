'use client';

import { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Typography } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { GroupEditDialog } from './group-edit-dialog';
import axios from 'src/lib/axios';

export function GroupTable({ refreshKey, companyId }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, [refreshKey]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const url = companyId ? `/api/groups?companyId=${companyId}` : '/api/groups';
      const response = await axios.get(url);
      setGroups(response.data.groups || []);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (group) => {
    setSelectedGroup(group);
    setOpenEditDialog(true);
  };

  const handleDelete = async (groupId) => {
    if (!confirm('آیا از حذف این گروه اطمینان دارید؟')) return;
    try {
      await axios.delete(`/api/groups/${groupId}`);
      fetchGroups();
    } catch (error) {
      console.error('Failed to delete group:', error);
      alert('خطا در حذف گروه');
    }
  };

  const handleEditSuccess = () => {
    setOpenEditDialog(false);
    setSelectedGroup(null);
    fetchGroups();
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
                  <IconButton size="small" onClick={() => handleEdit(group)}>
                    <Iconify icon="solar:pen-bold" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(group.id)}>
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
      <GroupEditDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        onSuccess={handleEditSuccess}
        group={selectedGroup}
      />
    </>
  );
}
