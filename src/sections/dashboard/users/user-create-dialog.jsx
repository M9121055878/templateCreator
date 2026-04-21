'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, MenuItem, CircularProgress } from '@mui/material';
import axios from 'src/lib/axios';

export function UserCreateDialog({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    roleId: '',
    companyId: '',
    groupId: '',
  });
  const [roles, setRoles] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesRes, companiesRes, groupsRes] = await Promise.all([
        axios.get('/api/roles'),
        axios.get('/api/companies'),
        axios.get('/api/groups'),
      ]);
      setRoles(rolesRes.data.roles || []);
      setCompanies(companiesRes.data.companies || []);
      setGroups(groupsRes.data.groups || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
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
      await axios.post('/api/users', {
        username: formData.username,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        roleId: formData.roleId || null,
        companyId: formData.companyId || null,
        groupId: formData.groupId || null,
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to create user:', error);
      alert(error.message || 'خطا در ایجاد کاربر');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>ایجاد کاربر جدید</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="نام کاربری"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="رمز عبور"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="نام نمایشی"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="نام خانوادگی"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              select
              label="نقش"
              name="roleId"
              value={formData.roleId}
              onChange={handleChange}
              sx={{ mb: 2 }}
            >
              <MenuItem value="">انتخاب کنید</MenuItem>
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              label="شرکت"
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              sx={{ mb: 2 }}
            >
              <MenuItem value="">انتخاب کنید</MenuItem>
              {companies.map((company) => (
                <MenuItem key={company.id} value={company.id}>
                  {company.name}
                </MenuItem>
              ))}
            </TextField>
            {formData.companyId && (
              <TextField
                fullWidth
                select
                label="گروه"
                name="groupId"
                value={formData.groupId}
                onChange={handleChange}
                sx={{ mb: 2 }}
              >
                <MenuItem value="">انتخاب کنید</MenuItem>
                {groups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
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
