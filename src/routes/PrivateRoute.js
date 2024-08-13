import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const currentUser = useSelector((state) => state.user.current);
  console.log(currentUser)

  return currentUser && currentUser.jti ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
