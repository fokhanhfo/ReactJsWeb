import React from 'react';
import PropTypes from 'prop-types';
import RegisterForm from '../RegisterForm';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { register } from 'features/Auth/userSlice';
import { useSnackbar } from 'notistack';

Register.propTypes = {
    closeDialog : PropTypes.func,
};

function Register(props) {
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();

    const handleSubmit = async (value) => {
        try {
            value.username = value.email;
            console.log('form submit',value);
            const action = register(value);
            const resultAction = await dispatch(action);
            const user = unwrapResult(resultAction);

            const {closeDialog}= props;
            if(closeDialog){
                closeDialog();
            }

            enqueueSnackbar('Tạo tài khoản thành công',{variant:'success'})
        } catch (error) {
            console.log('new user to register:',error);
            enqueueSnackbar('Tạo tài khoản thất bại',{variant:'error'})
        }
    }

    return (
        <div>
            <RegisterForm onSubmit={handleSubmit}></RegisterForm>
        </div>
    );
}

export default Register;