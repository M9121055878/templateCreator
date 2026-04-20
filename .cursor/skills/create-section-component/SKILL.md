---
name: create-section-component
description: >-
  Creates MUI-based section components following Minimal UI Kit patterns.
  Use when the user asks to build a new component inside src/sections/,
  create a card, table, chart, or any UI block for a dashboard page.
---

# Create Section Component

## File Location

Section components live under `src/sections/cyberspace/<page-name>/`:

```
src/sections/cyberspace/analytics/
├── analytics-summary.jsx
├── analytics-chart.jsx
├── analytics-filters.jsx
└── index.js
```

## Component Template

```jsx
'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

export function AnalyticsSummary({ title, total, icon, color = 'primary', sx, ...other }) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        ...sx,
      }}
      {...other}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          display: 'flex',
          borderRadius: 1.5,
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: (t) => t.vars.palette[color].lighter,
          color: (t) => t.vars.palette[color].dark,
        }}
      >
        <Iconify icon={icon} width={24} />
      </Box>

      <Box>
        <Typography variant="h4">{total}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {title}
        </Typography>
      </Box>
    </Card>
  );
}
```

## Styling Rules

- Always use MUI `sx` prop -- no styled-components or CSS modules
- Use `theme.vars.palette` or callback `(t) => t.vars.palette...` for colors
- Use `alpha()` from `minimal-shared/utils` for transparency
- Never hardcode hex colors -- always reference palette tokens
- Support both dark and light mode

## Icons

- General icons: `<Iconify icon="solar:chart-bold" width={24} />`
- Browse at https://icon-sets.iconify.design/?query=solar
- Navbar icons use `<SvgColor>` from `public/assets/icons/navbar/`

## Data Integration

Components receive data via props from the parent view. They should NOT fetch data directly.

```jsx
// View fetches data
const { data } = useQuery({ queryKey: ['analytics'], queryFn: fetchAnalytics });

// Component receives props
<AnalyticsSummary title="بازدید" total={data?.viewCount} icon="solar:eye-bold" />
```

## Barrel Export

Always create/update `index.js` for the folder:

```js
export { AnalyticsSummary } from './analytics-summary';
export { AnalyticsChart } from './analytics-chart';
```

## Checklist

- [ ] File placed in correct `src/sections/cyberspace/<page>/` folder
- [ ] Uses `sx` prop exclusively for styles
- [ ] Colors reference theme palette (no hardcoded hex)
- [ ] Icons use Iconify Solar set
- [ ] UI text is in Persian
- [ ] Component is focused (single responsibility)
- [ ] Barrel export updated
