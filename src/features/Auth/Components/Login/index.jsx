import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import LoginForm from '../LoginForm';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { facebookLogin, login } from 'features/Auth/userSlice';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useGetCartQuery } from 'features/Cart/cartApi';
import Loading from 'components/Loading';
import StorageKeys from 'constants/storage-keys';

Login.propTypes = {
    closeDialog : PropTypes.func,
};

function Login(props) {
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const { data: dataCart, error: errorCart, isLoading: isLoadingCart } = useGetCartQuery(undefined, {
        skip: !isLoggedIn, 
    });

    const handleSubmit = async (value) => {
        try {
            console.log('form submit',value);
            const action = login(value);
            const resultAction = await dispatch(action);
            if (login.rejected.match(resultAction)) {
                const error = resultAction.payload;
                throw error;
            }
            console.log(resultAction);
            const user = unwrapResult(resultAction);
            const listRoles = user.scope.split(' ');
            const {closeDialog}= props;
            if(closeDialog){
                closeDialog();
            }
            setIsLoggedIn(true);
            if(listRoles[0] === 'ROLE_ADMIN'){
                navigate('/admin/home');
            }else {
                navigate('/');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleFacebookLogin = async(value)=>{
        try {
            console.log(value);
          const action = facebookLogin(value);
          const resultAction = await dispatch(action);
          if (facebookLogin.rejected.match(resultAction)) {
              const error = resultAction.payload;
              throw error;
          }
          console.log(resultAction);
          const user = unwrapResult(resultAction);
          const {closeDialog}= props;
          if(closeDialog){
              closeDialog();
          }
          setIsLoggedIn(true);
          const listRoles = user.scope.split(' ');
          if(listRoles[0] === 'ROLE_ADMIN'){
              navigate('/admin/home');
          }else {
              navigate('/');
          }
        } catch (error) {
            console.log(error);
        }
      }

    // const handleSubmitFb=async()=>{

    // }

    useEffect(() => {
        if (errorCart) {
            console.log(errorCart);
            enqueueSnackbar('Lỗi khi lấy giỏ hàng', { variant: 'error' });
        }
    }, [errorCart, enqueueSnackbar]);

    return (
        <div>
            {isLoadingCart && <Loading />}
            <LoginForm onSubmit={handleSubmit} loginFacebook={handleFacebookLogin}></LoginForm>
        </div>
    );
}

export default Login;