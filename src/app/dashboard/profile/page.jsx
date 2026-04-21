import { CONFIG } from 'src/global-config';
import { ProfileView } from 'src/sections/dashboard/profile';

export const metadata = { title: `پروفایل | داشبورد - ${CONFIG.appName}` };

export default function Page() {
  return <ProfileView />;
}
