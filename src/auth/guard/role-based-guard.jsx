'use client';

import { m } from 'framer-motion';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { ForbiddenIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';

import { useAuthContext } from '../hooks/use-auth-context';

// ----------------------------------------------------------------------

/**
 * NOTE:
 * This component is for reference only.
 * You can customize the logic and conditions to better suit your application's requirements.
 */

export function RoleBasedGuard({ sx, children, hasContent, hasPermission, allowedRoles }) {
  const { user, hasPermission: checkPermission, isAdmin, isCompanyAdmin } = useAuthContext();

  const hasAccess = (() => {
    if (isAdmin) return true;

    if (hasPermission && !checkPermission(hasPermission)) {
      return false;
    }

    if (allowedRoles && user?.role?.name && !allowedRoles.includes(user.role.name)) {
      return false;
    }

    return true;
  })();

  if (!hasAccess) {
    return hasContent ? (
      <Container
        component={MotionContainer}
        sx={[{ textAlign: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]}
      >
        <m.div variants={varBounce('in')}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Permission denied
          </Typography>
        </m.div>

        <m.div variants={varBounce('in')}>
          <Typography sx={{ color: 'text.secondary' }}>
            You do not have permission to access this page.
          </Typography>
        </m.div>

        <m.div variants={varBounce('in')}>
          <ForbiddenIllustration sx={{ my: { xs: 5, sm: 10 } }} />
        </m.div>
      </Container>
    ) : null;
  }

  return <>{children}</>;
}
