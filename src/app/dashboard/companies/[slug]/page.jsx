import { CONFIG } from 'src/global-config';

import { CompanyDetailView } from 'src/sections/dashboard/companies/company-detail-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Company Detail - ${CONFIG.appName}` };

export default async function Page({ params }) {
  const { slug } = await params;
  return <CompanyDetailView companySlug={slug} />;
}
