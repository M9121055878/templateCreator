'use client';

import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

export function LeftPanel({
  templates,
  activeTemplateId,
  isLoading,
  searchQuery,
  onSearchChange,
  onTemplateSelect,
}) {
  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) return templates;
    const query = searchQuery.toLowerCase();
    return templates.filter(
      (t) =>
        t.title?.toLowerCase().includes(query) ||
        t.id?.toLowerCase().includes(query) ||
        t.category?.toLowerCase().includes(query)
    );
  }, [templates, searchQuery]);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Iconify icon="solar:folder-with-files-bold-duotone" width={20} color="action" />
          <Typography variant="h6">تمپلیت‌ها</Typography>
        </Stack>

        <TextField
          fullWidth
          size="small"
          placeholder="جستجو..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="solar:magnifer-bold-duotone" width={18} />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 1.5 }}
        />

        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {isLoading
            ? 'در حال بارگذاری...'
            : `${filteredTemplates.length} از ${templates.length} تمپلیت`}
        </Typography>
      </CardContent>

      <Box sx={{ flex: 1, overflow: 'auto', px: 1, pb: 1 }}>
        <List dense disablePadding>
          {filteredTemplates.map((template) => (
            <ListItem key={template.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={template.id === activeTemplateId}
                onClick={() => onTemplateSelect(template.id)}
                sx={{
                  borderRadius: 1,
                  '&.Mui-selected': {
                    bgcolor: 'primary.lighter',
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                        {template.title}
                      </Typography>
                      {template.status && (
                        <Chip
                          size="small"
                          label={template.status}
                          color={template.status === 'active' ? 'success' : 'default'}
                          sx={{ height: 18, fontSize: 10 }}
                        />
                      )}
                    </Stack>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                      {template.category} • {template.id}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {!isLoading && filteredTemplates.length === 0 && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {searchQuery ? 'نتیجه‌ای یافت نشد' : 'تمپلیتی وجود ندارد'}
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
}
