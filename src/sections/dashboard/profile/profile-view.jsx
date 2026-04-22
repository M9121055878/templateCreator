'use client';

import { useState } from 'react';
import { useRouter } from 'src/routes/hooks';
import { Container, Stack, Typography, Card, Box, TextField, Button, Alert, Divider } from '@mui/material';
import { PageHeader } from 'src/components/page-header';
import { useAuthContext } from 'src/auth/hooks/use-auth-context';
import axios from 'src/lib/axios';

export function ProfileView() {
  const { user, signOut } = useAuthContext();
  const router = useRouter();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');

  const handleLogout = async () => {
    try {
      setLoadingLogout(true);
      await signOut();
      router.push('/auth/jwt/sign-in');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoadingLogout(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('رمز عبور جدید و تکرار آن مطابقت ندارند');
      setMessageType('error');
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage('رمز عبور جدید باید حداقل ۶ کاراکتر باشد');
      setMessageType('error');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/api/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setMessage('رمز عبور با موفقیت تغییر کرد');
      setMessageType('success');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage(error.message || 'خطا در تغییر رمز عبور');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Stack spacing={3}>
        <PageHeader
          title="پروفایل"
          subtitle="مشاهده و ویرایش اطلاعات حساب کاربری"
          action={{
            label: 'خروج از حساب کاربری',
            icon: 'mingcute:exit-line',
            variant: 'outlined',
            color: 'error',
            onClick: handleLogout,
            disabled: loadingLogout,
          }}
        />

        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                نام نمایشی
              </Typography>
              <Typography variant="body1">
                {user?.firstName} {user?.lastName}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                نام کاربری
              </Typography>
              <Typography variant="body1">{user?.email}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                نقش
              </Typography>
              <Typography variant="body1">{user?.role?.name}</Typography>
            </Box>
            {user?.company && (
              <Box>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  شرکت
                </Typography>
                <Typography variant="body1">{user.company.name}</Typography>
              </Box>
            )}
            {user?.group && (
              <Box>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  گروه
                </Typography>
                <Typography variant="body1">{user.group.name}</Typography>
              </Box>
            )}
          </Stack>
        </Card>

        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            تغییر رمز عبور
          </Typography>

          {message && (
            <Alert severity={messageType} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
              {message}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="رمز عبور فعلی"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="رمز عبور جدید"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="تکرار رمز عبور جدید"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
            >
              {loading ? 'در حال تغییر...' : 'تغییر رمز عبور'}
            </Button>
          </Box>
        </Card>
      </Stack>
    </Container>
  );
}
