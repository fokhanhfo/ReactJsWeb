import React from 'react';
import PropTypes from 'prop-types';
import LoginForm from '../LoginForm';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { login } from 'features/Auth/userSlice';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

Login.propTypes = {
    closeDialog : PropTypes.func,
};

function Login(props) {
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();

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
                if(listRoles[0] === 'ROLE_ADMIN'){
                    navigate('/admin/home');
                }else {
                    navigate('/');
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <LoginForm onSubmit={handleSubmit}></LoginForm>
        </div>
    );
}

export default Login;