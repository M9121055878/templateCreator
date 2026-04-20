import { CONFIG } from 'src/global-config';

import { TemplateStudioView } from 'src/sections/cyberspace/template-studio';

// ----------------------------------------------------------------------

export const metadata = { title: `Template Studio | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <TemplateStudioView />;
}
