import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginWindow } from 'features/Auth/userSlice';
import Loading from 'components/Loading';
import LoginRequired from 'components/NotFound/LoginRequired';

const PrivateRoute = () => {
  const currentUser = useSelector((state) => state.user.current);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (!currentUser || !currentUser.jti) {
  //     dispatch(loginWindow());
  //   }
  // }, [currentUser, dispatch]);

  return currentUser && currentUser.jti ? <Outlet /> : <LoginRequired/>;
};

export default PrivateRoute;
