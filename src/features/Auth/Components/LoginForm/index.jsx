import styled from '@emotion/styled';
import { yupResolver } from '@hookform/resolvers/yup';
import { Facebook, LockOutlined } from '@mui/icons-material';
import { Avatar, Box, Button, Grid, Typography } from '@mui/material';
import InputField from 'components/form-controls/InputForm';
import PasswordField from 'components/form-controls/PassworField';
import PropTypes from 'prop-types';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { LoginSocialFacebook } from 'reactjs-social-login';
import * as yup from 'yup';

LoginForm.propTypes = {
  onSubmit: PropTypes.func,
  loginFacebook: PropTypes.func,
  onForgotPassword: PropTypes.func,
  isLoginLoading: PropTypes.bool,
  isFacebookLoading: PropTypes.bool,
};

const StyledButton = styled(Button)`
  margin-top: 10px;
`;

const FacebookButton = styled(Button)`
  margin-top: 10px;
  background-color: #1877f2;
  color: white;
  &:hover {
    background-color: #1558b0;
  }
`;

const ForgotPasswordButton = styled(Typography)`
  margin-top: 5px;
  color: #1976d2;
  cursor: pointer;
  &:hover {
    background-color: #e3f2fd;
  }
`;

function LoginForm(props) {
  const { isLoginLoading, isFacebookLoading } = props;
  const schema = yup
    .object({
      username: yup
        .string()
        .required('Bắt buộc')
        .min(4, 'Tối thiểu 4 ký tự')
        .max(20, 'Tối đa 20 ký tự')
        .matches(/^[a-zA-Z0-9_]+$/, 'Chỉ chứa chữ cái, số và dấu gạch dưới'),

      password: yup
        .string()
        .required('Bắt buộc')
        // .min(6, 'Tối thiểu 6 ký tự')
        .max(32, 'Tối đa 32 ký tự'),
      // .matches(/[A-Z]/, 'Phải có ít nhất một chữ in hoa')
      // .matches(/[a-z]/, 'Phải có ít nhất một chữ thường')
      // .matches(/[0-9]/, 'Phải có ít nhất một chữ số')
      // .matches(/[@$!%*?&]/, 'Phải có ít nhất một ký tự đặc biệt'),
    })
    .required();

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const { setError } = form;
  const errorMessage = useSelector((state) => state.user.error?.message || '');

  const handleSubmit = async (value) => {
    const { onSubmit } = props;
    if (onSubmit) {
      await onSubmit(value);
    }
  };

  const handleLoginFacebook = async (value) => {
    const { loginFacebook } = props;
    if (loginFacebook) {
      await loginFacebook({ token: value });
    }
  };

  const handleForgotPassword = () => {
    const { onForgotPassword } = props;
    if (onForgotPassword) {
      onForgotPassword();
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <Avatar sx={{ bgcolor: 'red' }}>
          <LockOutlined />
        </Avatar>
      </Box>
      <Typography component="h3" variant="h5" sx={{ textAlign: 'center', fontWeight: '600', mb: 3 }}>
        Đăng Nhập
      </Typography>

      {errorMessage && (
        <Typography sx={{ color: 'error.main', textAlign: 'center', mb: 2 }} variant="body2">
          {errorMessage}
        </Typography>
      )}

      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <InputField name="username" label="Username" form={form} />
          </Grid>
          <Grid item xs={12}>
            <PasswordField name="password" label="Password" form={form} />
          </Grid>
        </Grid>
        <Box sx={{ textAlign: 'right' }} mb={2} mt={1}>
          <ForgotPasswordButton variant="text" onClick={handleForgotPassword}>
            Quên mật khẩu?
          </ForgotPasswordButton>
        </Box>
        <StyledButton disabled={isLoginLoading || isFacebookLoading} type="submit" fullWidth variant="contained">
          {isLoginLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </StyledButton>
      </form>

      <LoginSocialFacebook
        appId="1261402088556652"
        onResolve={(response) => handleLoginFacebook(response.data.accessToken)}
        onReject={(error) => console.log(error)}
        scope="email,public_profile"
      >
        <FacebookButton
          disabled={isLoginLoading || isFacebookLoading}
          fullWidth
          variant="contained"
          startIcon={<Facebook />}
        >
          {isFacebookLoading ? 'Đang đăng nhập...' : 'Đăng nhập với Facebook'}
        </FacebookButton>
      </LoginSocialFacebook>
    </Box>
  );
}

export default LoginForm;
