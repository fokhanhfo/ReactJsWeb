import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Header from 'admin/components/Header';
import { useSelector } from 'react-redux';
import ProductAdmin from 'admin/featuresAdmin/Produuct';
import HomeFeaturesAdmin from 'admin/featuresAdmin/Home';

function AdminRoutes() {
  const currentUser = useSelector((state) => state.user.current);
  const listRoles = (currentUser.scope).split(' ');
  console.log(listRoles);


  return (
    <Routes>
      {currentUser && listRoles[0]  === 'ROLE_ADMIN' ? (
        <>
          <Route path="/" element={<Navigate to="home" replace />} />
          <Route path="/*" element={<Header />}>
            <Route path="home" element={<HomeFeaturesAdmin/>} />
            <Route path="products/*" element={<ProductAdmin />} />
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
