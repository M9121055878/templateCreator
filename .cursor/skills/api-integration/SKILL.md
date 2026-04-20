---
name: api-integration
description: >-
  Integrates new API endpoints using axios and react-query following project
  conventions. Use when the user asks to connect to a new backend endpoint,
  add data fetching, create API hooks, or wire up a new service.
---

# API Integration

## Architecture Overview

```
src/lib/axios.js      → axios instance + endpoints registry
src/api/dashboard.js  → react-query hooks (useQuery / useMutation)
src/sections/.../view  → views consume hooks
```

## Step 1: Register the endpoint

Add the endpoint path to the `endpoints` object in `src/lib/axios.js`:

```js
export const endpoints = {
  // ...existing
  dashboard: {
    overview: '/api/dashboard/overview',
    posts: '/api/dashboard/posts',
  },
};
```

## Step 2: Create react-query hooks

Create or update `src/api/dashboard.js`:

```js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/lib/axios';

export function useDashboardPosts(params) {
  return useQuery({
    queryKey: ['dashboard-posts', params],
    queryFn: async () => {
      const res = await axiosInstance.get(endpoints.dashboard.posts, { params });
      return res.data;
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newPost) => axiosInstance.post(endpoints.dashboard.posts, newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-posts'] });
    },
  });
}
```

## Step 3: Use in view

```jsx
import { useDashboardPosts } from 'src/api/dashboard';

export function PostsView() {
  const { data, isLoading, error } = useDashboardPosts();

  if (isLoading) return <LoadingScreen />;
  if (error) return <Typography color="error">{error.message}</Typography>;

  return (
    <DashboardContent>
      <PostsTable rows={data?.items ?? []} />
    </DashboardContent>
  );
}
```

## Response Format

The backend wraps all responses:

```json
{
  "meta": { "page": 1, "total": 100 },
  "data": { "items": [...] }
}
```

The axios interceptor in `src/lib/axios.js` extracts `response.data.data`, so your hook receives the inner `data` object directly.

## Error Handling

Errors arrive as `error.response.data.error.message`. The axios interceptor already extracts this into a standard `Error` object. Display with:

```jsx
const { error } = useDashboardPosts();
// error.message contains the Persian-friendly backend message
```

## Query Key Conventions

- Prefix with domain: `['dashboard-posts']`, `['dashboard-analytics']`
- Include params for cache separation: `['dashboard-posts', { page, filter }]`
- Invalidate related keys after mutations

## Checklist

- [ ] Endpoint added to `endpoints` in `src/lib/axios.js`
- [ ] react-query hook created in `src/api/dashboard.js`
- [ ] Uses `axiosInstance` (never raw `axios`)
- [ ] Query key is descriptive and includes params
- [ ] Mutations invalidate related queries
- [ ] Loading and error states handled in view
- [ ] Response shape matches backend `{ meta, data }` contract
