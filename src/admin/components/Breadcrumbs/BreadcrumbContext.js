import React, { createContext, useState, useContext } from 'react';

// Tạo context
const BreadcrumbContext = createContext();

// Custom hook để dễ dàng sử dụng BreadcrumbContext
export const useBreadcrumb = () => useContext(BreadcrumbContext);

// Provider để bao bọc toàn bộ ứng dụng
export const BreadcrumbProvider = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};
