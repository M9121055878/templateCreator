import { CONFIG } from 'src/global-config';
import { DashboardLayout } from 'src/layouts/dashboard';

import { AuthGuard } from 'src/auth/guard';
import { PageHeaderProvider } from 'src/contexts/page-header-context';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  if (CONFIG.auth.skip) {
    return (
      <PageHeaderProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </PageHeaderProvider>
    );
  }

  return (
    <AuthGuard>
      <PageHeaderProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </PageHeaderProvider>
    </AuthGuard>
  );
}
