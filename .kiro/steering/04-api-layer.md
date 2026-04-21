---
inclusion: fileMatch
fileMatchPattern: ['src/api/**/*.js', 'src/lib/**/*.js']
---

# API Layer

- All requests use react-query (`useQuery`, `useMutation`)
- Use axios instance from `src/lib/axios.js`
- Define endpoints in `src/lib/axios.js` `endpoints` object
- Backend wraps responses in `{ meta, data }` (ResponseInterceptor)
- Frontend interceptor extracts `response.data.data`
- Errors come from `error.response.data.error.message`

## Adding new endpoint

1. Add endpoint path to `endpoints` object in `src/lib/axios.js`
2. Create query hook in `src/api/dashboard.js`
3. Use `axiosInstance` (not raw axios) for all requests
