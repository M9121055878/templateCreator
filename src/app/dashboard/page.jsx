import { CONFIG } from 'src/global-config';

import { DashboardView } from 'src/sections/dashboard';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <DashboardView />;
}
