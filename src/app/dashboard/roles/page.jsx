import { CONFIG } from 'src/global-config';
import { RoleBasedGuard } from 'src/auth/guard';
import { RolesView } from 'src/sections/dashboard/roles';

export const metadata = { title: `نقش‌ها | داشبورد - ${CONFIG.appName}` };

export default function Page() {
  return (
    <RoleBasedGuard hasContent hasPermission="roles">
      <RolesView />
    </RoleBasedGuard>
  );
}
