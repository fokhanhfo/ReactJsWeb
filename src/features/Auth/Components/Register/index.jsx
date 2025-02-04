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
            const newValue={
                ...value,
                typeLogin:0,
            };
            const action = register(newValue);
            const resultAction = await dispatch(action);
            if (register.rejected.match(resultAction)) {
                const error = resultAction.payload;
                throw error;
            }
            const user = unwrapResult(resultAction);
            console.log(user);

            const {closeDialog}= props;
            if(closeDialog){
                closeDialog();
            }

            enqueueSnackbar('Tạo tài khoản thành công',{variant:'success'});
        } catch (error) {
            console.error('new user to register:',error);
            enqueueSnackbar('Tạo tài khoản thất bại',{variant:'error'});
        }
    }

    return (
        <div>
            <RegisterForm onSubmit={handleSubmit}></RegisterForm>
        </div>
    );
}

export default Register;