---
inclusion: fileMatch
fileMatchPattern: ['src/sections/**/*.jsx']
---

# Sections & Views

## Views (`src/sections/cyberspace/view/`)
- Each view in separate folder: `view/overview/`, `view/posts/`, `view/analytics/`
- First JSX element must be `<DashboardContent>` from `src/layouts/dashboard`
- Views handle data fetching with react-query (`useQuery`, `useMutation`)
- Views import from section component folders

## Section Components (`src/sections/cyberspace/`)
- Each page has dedicated folder: `overview/`, `posts/`, `analytics/`, etc.
- Keep components small and focused -- no monolithic files
- Truly generic components go to `src/components/`
