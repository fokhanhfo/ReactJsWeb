import React from 'react';
import PropTypes from 'prop-types';
import { Container } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import PermissionPageList from './pages/PermissionPageList';
import useListPermission from './hook/roleAndPermissionFetch';

RolePermissionAdmin.propTypes = {};

function RolePermissionAdmin(props) {
  const { roles, permissions, loading } = useListPermission();
  console.log(permissions);
  return (
    <Container maxWidth={false}>
      <Routes>
        <Route path="" element={<PermissionPageList roles={roles} permissions={permissions} loading={loading} />} />
        {/* <Route path="/add" element={<AddCategory />} />
        <Route path="/:categoryId" element={<EditCategory />} /> */}
      </Routes>
    </Container>
  );
}

export default RolePermissionAdmin;
