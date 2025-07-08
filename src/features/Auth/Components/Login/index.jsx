'use client';

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import LoginForm from '../LoginForm';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { facebookLogin, login } from 'features/Auth/userSlice';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useGetCartQuery } from 'features/Cart/cartApi';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';
import userApi from 'api/userApi';
import OtpInputDialog from '../Register/OtpInput';
import CloseIcon from '@mui/icons-material/Close';
import ForgotPasswordForm from '../ForgotPasswordForm';
import { useConfirmForgotPasswordMutation, useForgotPasswordMutation } from 'hookApi/userApi';
import OtpVerificationForm from '../OtpVerificationForm';

Login.propTypes = {
  closeDialog: PropTypes.func,
};

function Login(props) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [open, setOpen] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [openForgot, setOpenForgot] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEmail, setIsEmail] = useState('');
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [step, setStep] = useState('forgot');

  const [forgotPassword, { isLoading, isError, isSuccess, error }] = useForgotPasswordMutation();
  const [
    confirmForgotPassword,
    { isLoading: isConfirmLoading, isError: isConfirmError, isSuccess: isConfirmSuccess, error: confirmError },
  ] = useConfirmForgotPasswordMutation();
  // Cải tiến: Tách loading states cụ thể cho từng action
  const [loadingStates, setLoadingStates] = useState({
    login: false,
    facebookLogin: false,
    resendOtp: false,
    verifyOtp: false,
  });

  // Helper functions để quản lý loading states
  const setLoading = (action, isLoading) => {
    setLoadingStates((prev) => ({ ...prev, [action]: isLoading }));
  };

  const isAnyLoading = () => {
    return Object.values(loadingStates).some((loading) => loading);
  };

  const {
    data: dataCart,
    error: errorCart,
    isLoading: isLoadingCart,
  } = useGetCartQuery(undefined, {
    skip: !isLoggedIn,
  });

  const handleSubmit = async (value) => {
    try {
      setLoading('login', true);
      setUsername(value.username);
      setPassword(value.password);

      const action = login(value);
      const resultAction = await dispatch(action);
      console.log('resultAction:', resultAction);

      if (login.rejected.match(resultAction)) {
        const error = resultAction.payload;
        if (error.status === '403') {
          setEmail(error.data);
          enqueueSnackbar('Tài khoản của bạn chưa kích hoạt', { variant: 'error' });
          setOpen(true);
          return;
        }
        throw error;
      }

      const user = unwrapResult(resultAction);
      const listRoles = user.scope.split(' ');
      const { closeDialog } = props;

      if (closeDialog) closeDialog();
      setIsLoggedIn(true);

      if (listRoles[0] === 'ROLE_ADMIN' || listRoles.includes('ROLE_STAFF')) {
        navigate('/admin/home');
      }

      enqueueSnackbar('Đăng nhập thành công', { variant: 'success' });
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Đăng nhập thất bại', { variant: 'error' });
    } finally {
      setLoading('login', false);
    }
  };

  const handleFacebookLogin = async (value) => {
    try {
      setLoading('facebookLogin', true);

      const action = facebookLogin(value);
      const resultAction = await dispatch(action);

      if (facebookLogin.rejected.match(resultAction)) {
        throw resultAction.payload;
      }

      const user = unwrapResult(resultAction);
      const { closeDialog } = props;

      if (closeDialog) closeDialog();
      setIsLoggedIn(true);

      const listRoles = user.scope.split(' ');
      navigate(listRoles[0] === 'ROLE_ADMIN' ? '/admin/home' : '/');

      enqueueSnackbar('Đăng nhập Facebook thành công', { variant: 'success' });
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Đăng nhập Facebook thất bại', { variant: 'error' });
    } finally {
      setLoading('facebookLogin', false);
    }
  };

  const handleClose = () => {
    // Không cho đóng dialog khi đang loading
    if (!loadingStates.resendOtp) {
      setOpen(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setLoading('resendOtp', true);

      const response = await userApi.resendOtp(email, 'REGISTER');
      enqueueSnackbar(response.message, {
        variant: 'success',
        autoHideDuration: 6000,
      });

      setOpen(false);
      setShowOtpForm(true);
    } catch (error) {
      enqueueSnackbar('Gửi lại mã OTP thất bại', { variant: 'error' });
    } finally {
      setLoading('resendOtp', false);
    }
  };

  const handleOtpComplete = async (otp) => {
    try {
      setLoading('verifyOtp', true);

      const data = await userApi.verifyOtp(email, otp, 'REGISTER');
      enqueueSnackbar(data.message, {
        variant: 'success',
        autoHideDuration: 6000,
      });

      setShowOtpForm(false);
      // Tự động đăng nhập lại sau khi verify OTP
      handleSubmit({ username, password });
    } catch (error) {
      console.error('OTP verification error:', error);
      enqueueSnackbar(`${error.message}`, { variant: 'error' });
    } finally {
      setLoading('verifyOtp', false);
    }
  };

  const handleOtpResend = async () => {
    await handleConfirm();
  };

  useEffect(() => {
    if (errorCart) {
      enqueueSnackbar('Lỗi khi lấy giỏ hàng', { variant: 'error' });
    }
  }, [errorCart, enqueueSnackbar]);

  const handleOpenForgot = () => {
    setOpenForgot(true);
  };

  const handleForgotPassword = async (value) => {
    try {
      setIsEmail(value.email);
      await forgotPassword({
        email: value.email,
      }).unwrap();

      enqueueSnackbar('Mã OTP đã được gửi đến email của bạn', { variant: 'success' });
      setIsDialogOpen(true);
      // setActiveStep(1);
    } catch (error) {
      enqueueSnackbar(error?.data?.message || 'Email Không đúng', { variant: 'error' });
    }
  };

  const handleOtpSubmitForgot = async (value) => {
    try {
      console.log(value);
      await confirmForgotPassword(value).unwrap();
      enqueueSnackbar('Mật khẩu đã được thay đổi thành công!', { variant: 'success' });
      // setActiveStep(2);
      setIsDialogOpen(false);
      setOpenForgot(false);
    } catch (error) {
      enqueueSnackbar(error?.data?.message || 'Mã OTP không đúng hoặc đã hết hạn', { variant: 'error' });
    }
  };

  const handleResend = async () => {
    await handleForgotPassword({ email: isEmail });
    setIsResendLoading(true);
  };

  return (
    <div>
      {/* Chỉ hiển thị LoadingWeb khi có loading actions hoặc cart loading */}
      {/* {(isLoadingCart || isAnyLoading()) && <LoadingWeb />} */}

      <LoginForm
        onSubmit={handleSubmit}
        loginFacebook={handleFacebookLogin}
        onForgotPassword={handleOpenForgot}
        isLoginLoading={loadingStates.login}
        isFacebookLoading={loadingStates.facebookLogin}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Xác nhận kích hoạt
          <IconButton
            disabled={loadingStates.resendOtp}
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography>Bạn có chắc muốn kích hoạt tài khoản này không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loadingStates.resendOtp} variant="outlined">
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loadingStates.resendOtp}
            variant="contained"
            color="primary"
            startIcon={loadingStates.resendOtp ? <CircularProgress size={16} /> : null}
          >
            {loadingStates.resendOtp ? 'Đang gửi...' : 'Xác nhận'}
          </Button>
        </DialogActions>
      </Dialog>

      <OtpInputDialog
        email={email}
        open={showOtpForm}
        onClose={() => !loadingStates.verifyOtp && setShowOtpForm(false)}
        onSubmit={handleOtpComplete}
        onResend={handleOtpResend}
        isLoading={loadingStates.verifyOtp}
        isResendLoading={loadingStates.resendOtp}
      />

      <ForgotPasswordForm
        open={openForgot}
        onClose={() => setOpenForgot(false)}
        onSubmit={handleForgotPassword}
        onBack={() => {
          // Ví dụ: set trạng thái về form đăng nhập
        }}
        isLoading={isLoading}
      />
      <OtpVerificationForm
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        email={isEmail}
        onSubmit={handleOtpSubmitForgot}
        onResendOtp={handleResend}
        onBack={() => {
          setIsDialogOpen(false);
          setOpenForgot(true);
        }}
        isLoading={isConfirmLoading}
        isResendLoading={isResendLoading}
      />
    </div>
  );
}

export default Login;
