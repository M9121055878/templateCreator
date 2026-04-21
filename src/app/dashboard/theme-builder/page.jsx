import { CONFIG } from 'src/global-config';

import { ThemeBuilderView } from 'src/sections/cyberspace/theme-builder';

// ----------------------------------------------------------------------

export const metadata = { title: `Theme Builder | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ThemeBuilderView />;
}
