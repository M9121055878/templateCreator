import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  params: icon('ic-params'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  subpaths: icon('ic-subpaths'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    subheader: 'Overview',
    items: [
      {
        title: 'داشبورد',
        path: paths.dashboard.root,
        icon: ICONS.dashboard,
      },
      {
        title: 'عکس ساز',
        path: paths.dashboard.templates,
        icon: ICONS.file,
        info: <Label>v1.0</Label>
      },
      {
        title: 'تم ساز',
        path: paths.dashboard.themeBuilder,
        icon: ICONS.params,
        info: <Label color="info">beta</Label>,
      },
    ],
  },
  /**
   * Management
   */
  {
    subheader: 'مدیریت',
    items: [
      {
        title: 'کاربران',
        path: paths.dashboard.users,
        icon: ICONS.user,
        roles: ['admin'],
      },
      {
        title: 'نقش‌ها',
        path: paths.dashboard.roles,
        icon: ICONS.lock,
        roles: ['admin'],
      },
      {
        title: 'شرکت‌ها',
        path: paths.dashboard.companies,
        icon: ICONS.booking,
        roles: ['admin'],
      },
      {
        title: 'گروه‌ها',
        path: paths.dashboard.groups,
        icon: ICONS.folder,
        roles: ['admin', 'company_admin'],
      },
    ],
  },
  /**
   * Account
   */
  {
    subheader: 'حساب کاربری',
    items: [
      {
        title: 'پروفایل',
        path: paths.dashboard.profile,
        icon: ICONS.user,
      },
    ],
  },
];
