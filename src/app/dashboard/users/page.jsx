import { CONFIG } from 'src/global-config';
import { RoleBasedGuard } from 'src/auth/guard';
import { UsersView } from 'src/sections/dashboard/users';

export const metadata = { title: `کاربران | داشبورد - ${CONFIG.appName}` };

export default function Page() {
  return (
    <RoleBasedGuard hasContent hasPermission="users">
      <UsersView />
    </RoleBasedGuard>
  );
}
