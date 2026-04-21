'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, CircularProgress } from '@mui/material';
import axios from 'src/lib/axios';

export function CompanyEditDialog({ open, onClose, onSuccess, company }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && company) {
      setFormData({
        name: company.name || '',
        slug: company.slug || '',
      });
    }
  }, [open, company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await axios.put(`/api/companies/${company.id}`, {
        name: formData.name,
        slug: formData.slug,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to update company:', error);
      alert(error.message || 'خطا در ویرایش شرکت');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>ویرایش شرکت</DialogTitle>
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
            sx={{ mb: 2 }}
          />
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
