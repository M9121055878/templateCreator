'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Checkbox, FormControlLabel, CircularProgress, Typography } from '@mui/material';
import axios from 'src/lib/axios';

const AVAILABLE_PERMISSIONS = [
  { id: 'templates', label: 'تمپلیت‌ها' },
  { id: 'theme-builder', label: 'تم‌ساز' },
  { id: 'users', label: 'کاربران' },
  { id: 'roles', label: 'نقش‌ها' },
  { id: 'companies', label: 'شرکت‌ها' },
  { id: 'groups', label: 'گروه‌ها' },
];

export function RoleEditDialog({ open, onClose, onSuccess, role }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [],
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && role) {
      setFormData({
        name: role.name || '',
        description: role.description || '',
        permissions: role.permissions || [],
      });
    }
  }, [open, role]);

  const handlePermissionChange = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await axios.put(`/api/roles/${role.id}`, {
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to update role:', error);
      alert(error.message || 'خطا در ویرایش نقش');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>ویرایش نقش</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="نام نقش"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="توضیحات"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={2}
            sx={{ mb: 2 }}
          />
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            دسترسی‌ها:
          </Typography>
          {AVAILABLE_PERMISSIONS.map((permission) => (
            <FormControlLabel
              key={permission.id}
              control={
                <Checkbox
                  checked={formData.permissions.includes(permission.id)}
                  onChange={() => handlePermissionChange(permission.id)}
                />
              }
              label={permission.label}
              sx={{ display: 'block' }}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          انصراف
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
          {submitting ? 'در حال ویرایش...' : 'ویرایش'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
