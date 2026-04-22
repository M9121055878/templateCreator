'use client';

import { useEffect, useMemo } from 'react';

import { usePageHeader } from 'src/contexts/page-header-context';

export function PageHeader({
  title,
  subtitle,
  action,
  backAction,
  ...other
}) {
  const { updateHeader, clearHeader } = usePageHeader();

  // Memoize the header data to prevent unnecessary updates
  const headerData = useMemo(() => ({
    title: title || '',
    subtitle: subtitle || '',
    action: action || null,
    backAction: backAction || null,
  }), [title, subtitle, action, backAction]);

  useEffect(() => {
    updateHeader(headerData);

    // Cleanup when component unmounts
    return () => {
      clearHeader();
    };
  }, [headerData, updateHeader, clearHeader]);

  // This component doesn't render anything visible
  // It just updates the header context
  return null;
}