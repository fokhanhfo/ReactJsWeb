import React, { useState } from 'react';
import PropTypes from 'prop-types';
import RegisterForm from '../RegisterForm';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { loginWindow, register } from 'features/Auth/userSlice';
import { useSnackbar } from 'notistack';
import { Box } from '@mui/material';
import OtpInputDialog from './OtpInput';
import userApi from 'api/userApi';

Register.propTypes = {
  closeDialog: PropTypes.func,
};

function Register(props) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (value) => {
    try {
      const newValue = {
        ...value,
        typeLogin: 0,
      };
      const action = register(newValue);
      const resultAction = await dispatch(action);
      if (register.rejected.match(resultAction)) {
        const error = resultAction.payload;
        throw error;
      }
      const user = unwrapResult(resultAction);
      if (user) {
        setEmail(user.data);
        enqueueSnackbar(user.message, { variant: 'success' });
        setShowOtpForm(true);
      }

      // enqueueSnackbar('Tạo tài khoản thành công', { variant: 'success' });
    } catch (error) {
      console.error('new user to register:', error);
      enqueueSnackbar(`${error.message}`, { variant: 'error' });
    }
  };

  const handleOtpComplete = async (otp) => {
    try {
      const data = await userApi.verifyOtp(email, otp);
      enqueueSnackbar(data.message, {
        variant: 'success',
        autoHideDuration: 6000,
      });
      setShowOtpForm(false);
      // const { closeDialog } = props;
      // if (closeDialog) {
      //   closeDialog();
      // }
      dispatch(loginWindow('login'));
    } catch (error) {
      console.error('new user to register:', error);
      enqueueSnackbar(`${error.message}`, { variant: 'error' });
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <RegisterForm onSubmit={handleSubmit}></RegisterForm>
      <OtpInputDialog
        email={email}
        open={showOtpForm}
        onClose={() => setShowOtpForm(false)}
        onSubmit={handleOtpComplete}
      />
    </Box>
  );
}

export default Register;
