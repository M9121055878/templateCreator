'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, MenuItem, CircularProgress } from '@mui/material';
import { useAuthContext } from 'src/auth/hooks/use-auth-context';
import axios from 'src/lib/axios';

export function GroupCreateDialog({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    companyId: '',
  });
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user, isAdmin, isCompanyAdmin } = useAuthContext();

  useEffect(() => {
    if (open) {
      fetchCompanies();
      
      // If company admin, set their company as default
      if (isCompanyAdmin && user?.company_id) {
        setFormData(prev => ({ ...prev, companyId: user.company_id }));
      }
    }
  }, [open, isCompanyAdmin, user]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await axios.post('/api/groups', {
        name: formData.name,
        slug: formData.slug,
        companyId: formData.companyId,
      });
      onSuccess();
      setFormData({ name: '', slug: '', companyId: isCompanyAdmin ? user?.company_id : '' });
    } catch (error) {
      console.error('Failed to create group:', error);
      alert(error.message || 'خطا در ایجاد گروه');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>ایجاد گروه جدید</DialogTitle>
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
              helperText="مثال: my-group"
              sx={{ mb: 2 }}
            />
            {!isCompanyAdmin && (
              <TextField
                fullWidth
                select
                label="شرکت"
                name="companyId"
                value={formData.companyId}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              >
                <MenuItem value="">انتخاب کنید</MenuItem>
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          انصراف
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting || loading}>
          {submitting ? 'در حال ایجاد...' : 'ایجاد'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
