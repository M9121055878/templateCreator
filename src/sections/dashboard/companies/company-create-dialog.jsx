'use client';

import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import axios from 'src/lib/axios';

export function CompanyCreateDialog({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await axios.post('/api/companies', {
        name: formData.name,
        slug: formData.slug,
      });
      onSuccess();
      setFormData({ name: '', slug: '' });
    } catch (error) {
      console.error('Failed to create company:', error);
      alert(error.message || 'خطا در ایجاد شرکت');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>ایجاد شرکت جدید</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="نام شرکت"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            helperText="مثال: my-company"
            sx={{ mb: 2 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          انصراف
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
          {submitting ? 'در حال ایجاد...' : 'ایجاد'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
