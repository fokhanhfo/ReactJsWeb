import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Header from 'admin/components/Header';
import { useDispatch, useSelector } from 'react-redux';
import ProductAdmin from 'admin/featuresAdmin/Produuct';
import HomeFeaturesAdmin from 'admin/featuresAdmin/Home';
import CategoryAdmin from 'admin/featuresAdmin/Category';
import BillFeature from 'admin/featuresAdmin/Bill';
import UsersAdmin from 'admin/featuresAdmin/User';
import RolePermissionAdmin from 'admin/featuresAdmin/UserAndPermission';
import PermissionAdmin from 'admin/featuresAdmin/Permission';
import { loginWindow } from 'features/Auth/userSlice';
import FeatureSellAdmin from 'admin/featuresAdmin/Sell';
import ColorAdmin from 'admin/featuresAdmin/Color';
import SizeAdmin from 'admin/featuresAdmin/Size';
import DiscountAdmin from 'admin/featuresAdmin/Discount';
import DiscountPeriodAdmin from 'admin/featuresAdmin/DiscountPeriod';
import SizeAndColor from 'admin/featuresAdmin/SizeAndColor';
import ClothingSalesDashboard from 'admin/featuresAdmin/Dashboard';

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
            <Route path="home" element={<ClothingSalesDashboard/>} />
            <Route path="products/*" element={<ProductAdmin />} />
            <Route path="category/*" element={<CategoryAdmin />} />
            <Route path="bill/*" element={<BillFeature />} />
            <Route path="user/*" element={<UsersAdmin />} />
            <Route path="role-and-permission/*" element={<RolePermissionAdmin />} />
            <Route path="permission" element={<PermissionAdmin />} />
            <Route path="sell" element={<FeatureSellAdmin />} />
            <Route path="color" element={<ColorAdmin />} />
            <Route path="size" element={<SizeAdmin />} />
            <Route path="productAttributes" element={<SizeAndColor />} />
            <Route path="discount/*" element={<DiscountAdmin />} />
            <Route path="discountPeriod/*" element={<DiscountPeriodAdmin />} />
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
