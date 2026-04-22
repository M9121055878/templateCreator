'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const PageHeaderContext = createContext();

export function PageHeaderProvider({ children }) {
  const [headerData, setHeaderData] = useState({
    title: '',
    subtitle: '',
    action: null,
    backAction: null,
  });

  const updateHeader = useCallback((data) => {
    setHeaderData(data);
  }, []);

  const clearHeader = useCallback(() => {
    setHeaderData({
      title: '',
      subtitle: '',
      action: null,
      backAction: null,
    });
  }, []);

  return (
    <PageHeaderContext.Provider value={{ headerData, updateHeader, clearHeader }}>
      {children}
    </PageHeaderContext.Provider>
  );
}

export function usePageHeader() {
  const context = useContext(PageHeaderContext);
  if (!context) {
    throw new Error('usePageHeader must be used within a PageHeaderProvider');
  }
  return context;
}