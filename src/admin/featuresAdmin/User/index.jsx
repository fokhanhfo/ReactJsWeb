import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Container } from '@mui/material';
import { Route, Routes, useLocation } from 'react-router-dom';
import UserPageList from './pages/UserPageList';
import useListUser from './hook/userFetch';
import { useGetUsersQuery } from 'hookApi/userApi';
import queryString from 'query-string';

UsersAdmin.propTypes = {};

function UsersAdmin(props) {
  return (
    <Container maxWidth={false}>
      <Routes>
        <Route path="" element={<UserPageList />} />
        {/* <Route path="/add" element={<AddCategory />} />
        <Route path="/:categoryId" element={<EditCategory />} /> */}
      </Routes>
    </Container>
  );
}

export default UsersAdmin;
