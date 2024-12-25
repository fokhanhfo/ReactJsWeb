import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Header from 'admin/components/Header';
import { useSelector } from 'react-redux';
import ProductAdmin from 'admin/featuresAdmin/Produuct';
import HomeFeaturesAdmin from 'admin/featuresAdmin/Home';
import CategoryAdmin from 'admin/featuresAdmin/Category';
import BillFeature from 'admin/featuresAdmin/Bill';

function AdminRoutes() {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.current);
  if(!currentUser || Object.keys(currentUser).length === 0){
    return <Navigate to="/" replace />;
  }
  const listRoles = (currentUser.scope).split(' ');


  return (
    <Routes>
      {currentUser && listRoles[0]  === 'ROLE_ADMIN' ? (
        <>
          <Route path="/" element={<Navigate to="home" replace />} />
          <Route path="/*" element={<Header />}>
            <Route path="home" element={<HomeFeaturesAdmin/>} />
            <Route path="products/*" element={<ProductAdmin />} />
            <Route path="category/*" element={<CategoryAdmin />} />
            <Route path="bill/*" element={<BillFeature />} />
          </Route>
          <Route path="admin/login" element={<Navigate to="/admin/products" />} />
        </>
      ) : (
        <Route path="/*" element={<Navigate to="/" />} />
      )}
    </Routes>
  );
}

export default AdminRoutes;
