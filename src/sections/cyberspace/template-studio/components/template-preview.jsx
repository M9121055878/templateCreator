'use client';

import { useRef, useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { TEMPLATE_ENGINES } from 'src/features/templates';

export function TemplatePreview({ template, renderedContent, engine, exportRef }) {
  const previewContainerRef = useRef(null);
  const [previewWidth, setPreviewWidth] = useState(960);

  useEffect(() => {
    if (!previewContainerRef.current) return undefined;

    const observer = new ResizeObserver(([entry]) => {
      setPreviewWidth(entry.contentRect.width);
    });

    observer.observe(previewContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const scale = useMemo(() => {
    if (!template?.width) return 1;
    return Math.min(previewWidth / template.width, 1);
  }, [previewWidth, template?.width]);

  const viewportHeight = useMemo(() => {
    if (!template?.width || !template?.height) return 320;
    return (template.height * Math.min(previewWidth, template.width)) / template.width;
  }, [previewWidth, template?.height, template?.width]);

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">پیش‌نمایش زنده</Typography>

          <Box
            ref={previewContainerRef}
            sx={(theme) => ({
              p: 2,
              width: 1,
              borderRadius: 2,
              overflow: 'auto',
              border: `1px solid ${theme.vars.palette.divider}`,
              bgcolor: theme.vars.palette.background.neutral,
            })}
          >
            <Box sx={{ width: '100%', height: viewportHeight }}>
              <Box
                sx={{
                  width: template.width,
                  height: template.height,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                }}
              >
                {engine === TEMPLATE_ENGINES.LEGACY_HTML ? (
                  <Box dangerouslySetInnerHTML={{ __html: renderedContent ?? '' }} />
                ) : (
                  renderedContent
                )}
              </Box>
            </Box>
          </Box>
        </Stack>
      </CardContent>

      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          width: 1,
          height: 1,
          overflow: 'hidden',
          pointerEvents: 'none',
          opacity: 0,
        }}
      >
        <Box
          ref={exportRef}
          sx={{
            width: template.width,
            height: template.height,
          }}
        >
          {engine === TEMPLATE_ENGINES.LEGACY_HTML ? (
            <Box dangerouslySetInnerHTML={{ __html: renderedContent ?? '' }} />
          ) : (
            renderedContent
          )}
        </Box>
      </Box>
    </Card>
  );
}
