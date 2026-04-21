import { CONFIG } from 'src/global-config';
import { RoleBasedGuard } from 'src/auth/guard';
import { GroupsView } from 'src/sections/dashboard/groups';

export const metadata = { title: `گروه‌ها | داشبورد - ${CONFIG.appName}` };

export default function Page() {
  return (
    <RoleBasedGuard hasContent hasPermission="groups">
      <GroupsView />
    </RoleBasedGuard>
  );
}
