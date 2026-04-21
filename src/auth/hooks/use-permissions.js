import { useAuthContext } from './use-auth-context';

export function usePermissions() {
  const { user, hasPermission, isAdmin, isCompanyAdmin } = useAuthContext();

  return {
    user,
    hasPermission,
    isAdmin,
    isCompanyAdmin,
    canAccessUsers: isAdmin,
    canAccessRoles: isAdmin,
    canAccessCompanies: isAdmin,
    canAccessGroups: isAdmin || isCompanyAdmin,
    canAccessTemplates: hasPermission('templates'),
    canAccessThemeBuilder: hasPermission('theme-builder'),
  };
}
