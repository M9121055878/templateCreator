---
name: create-dashboard-page
description: >-
  Scaffolds a complete new dashboard page including route, view, section components,
  path registration, and nav config. Use when the user asks to create a new page,
  add a new dashboard section, or build a new screen in the dashboard.
---

# Create Dashboard Page

## Workflow

Follow these steps in order when creating a new dashboard page.

### Step 1: Register the route path

Add the new path to `src/routes/paths.js` inside the `dashboard` object:

```js
// src/routes/paths.js
export const paths = {
  dashboard: {
    // ...existing paths
    posts: `${ROOTS.DASHBOARD}/posts`,
  },
};
```

### Step 2: Create the page file

Create `src/app/dashboard/<name>/page.jsx`. Pages are thin -- metadata + view import only.

```jsx
import { PostsView } from 'src/sections/cyberspace/view/posts';

export const metadata = { title: 'پست‌ها' };

export default function Page() {
  return <PostsView />;
}
```

### Step 3: Create the view

Create `src/sections/cyberspace/view/<name>/index.jsx` (or a named file + barrel export).

```jsx
'use client';

import { useQuery } from '@tanstack/react-query';

import { DashboardContent } from 'src/layouts/dashboard';
import axiosInstance, { endpoints } from 'src/lib/axios';

import { PostsTable } from '../../posts/posts-table';
import { PostsStats } from '../../posts/posts-stats';

export function PostsView() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-posts'],
    queryFn: () => axiosInstance.get(endpoints.dashboard.posts),
  });

  return (
    <DashboardContent>
      <PostsStats data={data?.stats} loading={isLoading} />
      <PostsTable rows={data?.items ?? []} loading={isLoading} />
    </DashboardContent>
  );
}
```

### Step 4: Create section components

Create component files in `src/sections/cyberspace/<name>/`:

```
src/sections/cyberspace/posts/
├── posts-table.jsx
├── posts-stats.jsx
├── posts-filters.jsx
└── index.js          (barrel exports)
```

Component pattern:

```jsx
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

export function PostsStats({ data, loading }) {
  return (
    <Card sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Iconify icon="solar:chart-bold" width={24} />
        <Typography variant="h6">آمار پست‌ها</Typography>
      </Box>
      {/* component body */}
    </Card>
  );
}
```

### Step 5: Add navigation item

Edit `src/layouts/nav-config-dashboard.jsx` -- add an entry in the appropriate `items` array:

```jsx
{ title: 'پست‌ها', path: paths.dashboard.posts, icon: ICONS.blog },
```

### Step 6: Add API endpoint (if needed)

Add to `endpoints` in `src/lib/axios.js`:

```js
export const endpoints = {
  // ...existing
  dashboard: {
    posts: '/api/dashboard/posts',
  },
};
```

## Checklist

- [ ] Path registered in `src/routes/paths.js`
- [ ] Page file created in `src/app/dashboard/<name>/page.jsx`
- [ ] View created in `src/sections/cyberspace/view/<name>/`
- [ ] Section components created in `src/sections/cyberspace/<name>/`
- [ ] Nav item added in `src/layouts/nav-config-dashboard.jsx`
- [ ] API endpoint added (if applicable)
- [ ] All UI text is in Persian
- [ ] `DashboardContent` is the root wrapper in the view
