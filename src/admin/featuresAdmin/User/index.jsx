import React from 'react';
import PropTypes from 'prop-types';
import { Container } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import UserPageList from './pages/UserPageList';
import useListUser from './hook/userFetch';

UsersAdmin.propTypes = {};

function UsersAdmin(props) {
  const { users, loading } = useListUser();
  return (
    <Container maxWidth={false}>
      <Routes>
        <Route path="" element={<UserPageList users={users} loading={loading} />} />
        {/* <Route path="/add" element={<AddCategory />} />
        <Route path="/:categoryId" element={<EditCategory />} /> */}
      </Routes>
    </Container>
  );
}

export default UsersAdmin;
