'use client';

import { useEffect } from 'react';

import { usePageHeader } from 'src/contexts/page-header-context';

export function PageHeader({
  title,
  subtitle,
  action,
  backAction,
  ...other
}) {
  const { updateHeader, clearHeader } = usePageHeader();

  useEffect(() => {
    updateHeader({
      title,
      subtitle,
      action,
      backAction,
    });

    // Cleanup when component unmounts
    return () => {
      clearHeader();
    };
  }, [title, subtitle, action, backAction, updateHeader, clearHeader]);

  // This component doesn't render anything visible
  // It just updates the header context
  return null;
}