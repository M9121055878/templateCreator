---
inclusion: fileMatch
fileMatchPattern: ['src/auth/**/*.jsx', 'src/auth/**/*.js']
---

# Auth Conventions

- JWT auth provider at `src/auth/context/jwt/`
- Auth skip toggle: `CONFIG.auth.skip` in `src/global-config.js`
- Guards: `AuthGuard`, `GuestGuard`, `RoleBasedGuard` in `src/auth/guard/`
- Sign-in/up views are in Persian
- Do NOT modify auth infrastructure, only configure via global-config
