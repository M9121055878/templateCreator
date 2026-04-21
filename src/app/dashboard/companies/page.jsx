import { CONFIG } from 'src/global-config';
import { RoleBasedGuard } from 'src/auth/guard';
import { CompaniesView } from 'src/sections/dashboard/companies';

export const metadata = { title: `شرکت‌ها | داشبورد - ${CONFIG.appName}` };

export default function Page() {
  return (
    <RoleBasedGuard hasContent hasPermission="companies">
      <CompaniesView />
    </RoleBasedGuard>
  );
}
