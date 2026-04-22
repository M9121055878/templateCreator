'use client';

import { createContext, useContext, useState } from 'react';

const PageHeaderContext = createContext();

export function PageHeaderProvider({ children }) {
  const [headerData, setHeaderData] = useState({
    title: '',
    subtitle: '',
    action: null,
    backAction: null,
  });

  const updateHeader = (data) => {
    setHeaderData(data);
  };

  const clearHeader = () => {
    setHeaderData({
      title: '',
      subtitle: '',
      action: null,
      backAction: null,
    });
  };

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