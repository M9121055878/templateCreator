'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, CircularProgress } from '@mui/material';
import axios from 'src/lib/axios';

export function GroupEditDialog({ open, onClose, onSuccess, group }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    companyId: '',
  });
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && group) {
      setFormData({
        name: group.name || '',
        slug: group.slug || '',
        companyId: group.company_id || '',
      });
      fetchCompanies();
    }
  }, [open, group]);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('/api/companies');
      setCompanies(response.data.companies || []);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await axios.put(`/api/groups/${group.id}`, {
        name: formData.name,
        slug: formData.slug,
        companyId: formData.companyId || null,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to update group:', error);
      alert(error.message || 'خطا در ویرایش گروه');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>ویرایش گروه</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="نام گروه"
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
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          انصراف
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting || loading}>
          {submitting ? 'در حال ویرایش...' : 'ویرایش'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
