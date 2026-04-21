'use client';

import { useRouter } from 'src/routes/hooks';
import { Container, Stack, Typography, Box, Card, CardContent, Button, Grid } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { useAuthContext } from 'src/auth/hooks/use-auth-context';
import { paths } from 'src/routes/paths';

export function DashboardView() {
  const router = useRouter();
  const { isAdmin, isCompanyAdmin } = useAuthContext();

  const tools = [
    {
      title: 'عکس ساز',
      description: 'ایجاد و ویرایش تصاویر',
      icon: 'solar:gallery-add-bold-duotone',
      path: paths.dashboard.templates,
      color: 'primary',
    },
    {
      title: 'تم ساز',
      description: 'ساخت و شخصی‌سازی تم‌ها',
      icon: 'solar:palette-bold-duotone',
      path: paths.dashboard.themeBuilder,
      color: 'secondary',
    },
  ];

  const managementTools = [
    {
      title: 'کاربران',
      description: 'مدیریت کاربران سیستم',
      icon: 'solar:users-group-rounded-bold-duotone',
      path: paths.dashboard.users,
      color: 'info',
      roles: ['admin'],
    },
    {
      title: 'نقش‌ها',
      description: 'مدیریت نقش‌ها و دسترسی‌ها',
      icon: 'solar:shield-keyhole-bold-duotone',
      path: paths.dashboard.roles,
      color: 'warning',
      roles: ['admin'],
    },
    {
      title: 'شرکت‌ها',
      description: 'مدیریت شرکت‌ها',
      icon: 'solar:buildings-bold-duotone',
      path: paths.dashboard.companies,
      color: 'success',
      roles: ['admin'],
    },
  ];

  const accountTools = [
    {
      title: 'پروفایل',
      description: 'مشاهده و ویرایش پروفایل',
      icon: 'solar:user-circle-bold-duotone',
      path: paths.dashboard.profile,
      color: 'default',
    },
  ];

  const canAccess = (roles) => {
    if (!roles || roles.length === 0) return true;
    if (isAdmin) return true;
    return roles?.includes(isCompanyAdmin ? 'company_admin' : null);
  };

  const renderToolCard = (tool) => (
    <Card
      key={tool.title}
      sx={{
        height: '100%',
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 3 }}>
          <Iconify icon={tool.icon} width={48} height={48} color={tool.color} />
        </Box>
        <Typography variant="h6" gutterBottom>
          {tool.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flex: 1 }}>
          {tool.description}
        </Typography>
        <Button
          variant={tool.color === 'default' ? 'outlined' : 'contained'}
          color={tool.color}
          onClick={() => router.push(tool.path)}
          fullWidth
        >
          ورود
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl">
      <Stack spacing={4}>
        <Box>
          <Typography variant="h3">داشبورد</Typography>
          <Typography variant="body2" color="text.secondary">
            به داشبورد خوش آمدید
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" sx={{ mb: 3 }}>
            ابزارها
          </Typography>
          <Grid container spacing={3}>
            {tools.map(renderToolCard)}
          </Grid>
        </Box>

        {(isAdmin || isCompanyAdmin) && (
          <Box>
            <Typography variant="h5" sx={{ mb: 3 }}>
              مدیریت
            </Typography>
            <Grid container spacing={3}>
              {managementTools
                .filter((tool) => canAccess(tool.roles))
                .map(renderToolCard)}
            </Grid>
          </Box>
        )}

        <Box>
          <Typography variant="h5" sx={{ mb: 3 }}>
            حساب کاربری
          </Typography>
          <Grid container spacing={3}>
            {accountTools.map(renderToolCard)}
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
}
