import React from 'react';
import PropTypes from 'prop-types';
import LoginForm from '../LoginForm';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { login } from 'features/Auth/userSlice';
import { useSnackbar } from 'notistack';

Login.propTypes = {
    closeDialog : PropTypes.func,
};

function Login(props) {
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();

    const handleSubmit = async (value) => {
        try {
            console.log('form submit',value);
            const action = login(value);
            const resultAction = await dispatch(action);
            const user = unwrapResult(resultAction);

            const {closeDialog}= props;
            if(closeDialog){
                closeDialog();
            }
        } catch (error) {
            console.log('new user to Login:',error);
            enqueueSnackbar('Đăng nhập thất bại',{variant:'error'})
        }
    }

    return (
        <div>
            <LoginForm onSubmit={handleSubmit}></LoginForm>
        </div>
    );
}

export default Login;