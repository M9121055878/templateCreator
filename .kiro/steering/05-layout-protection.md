---
inclusion: fileMatch
fileMatchPattern: ['src/layouts/**/*.jsx']
---

# Layout Protection

DO NOT modify layout files. These are part of Minimal UI Kit framework.

Key layout files (read-only):
- `src/layouts/dashboard/layout.jsx` -- main dashboard layout
- `src/layouts/dashboard/content.jsx` -- DashboardContent wrapper
- `src/layouts/dashboard/bottom-nav.jsx` -- bottom navigation
- `src/layouts/core/` -- shared layout primitives

Configurable (safe to edit):
- `src/layouts/nav-config-dashboard.jsx` -- navigation items
- `src/global-config.js` -- UI_CONFIG flags
