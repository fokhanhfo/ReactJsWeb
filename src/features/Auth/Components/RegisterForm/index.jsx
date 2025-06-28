import { yupResolver } from '@hookform/resolvers/yup';
import { LockOutlined } from '@mui/icons-material';
import { Avatar, Button, Typography, Paper, Box, Stack, Grid } from '@mui/material';
import InputField from 'components/form-controls/InputForm';
import PasswordField from 'components/form-controls/PassworField';
import PropTypes from 'prop-types';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import * as yup from 'yup';

RegisterForm.propTypes = {
  onSubmit: PropTypes.func,
};

function RegisterForm(props) {
  const schema = yup.object({
    username: yup
      .string()
      .required('Vui lòng nhập tên đăng nhập')
      .min(4, 'Tên đăng nhập tối thiểu 4 ký tự')
      .max(20, 'Tên đăng nhập tối đa 20 ký tự')
      .matches(/^[a-zA-Z0-9_]+$/, 'Tên đăng nhập chỉ chứa chữ cái, số và dấu gạch dưới'),

    email: yup.string().required('Bắt buộc').email('Nhập đúng định dạng email'),

    password: yup
      .string()
      .required('Bắt buộc')
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .max(32, 'Mật khẩu tối đa 32 ký tự')
      .matches(/[A-Z]/, 'Mật khẩu phải có ít nhất một chữ in hoa')
      .matches(/[a-z]/, 'Mật khẩu phải có ít nhất một chữ thường')
      .matches(/[0-9]/, 'Mật khẩu phải có ít nhất một chữ số')
      .matches(/[@$!%*?&]/, 'Mật khẩu phải có ít nhất một ký tự đặc biệt'),

    retypePassword: yup
      .string()
      .required('Bắt buộc')
      .oneOf([yup.ref('password')], 'Nhập lại mật khẩu không khớp'),
  });

  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      retypePassword: '',
    },
    resolver: yupResolver(schema),
  });

  const handleSubmit = (value) => {
    const { onSubmit } = props;
    if (onSubmit) {
      onSubmit(value);
    }
    form.reset();
  };

  const errorMessage = useSelector((state) => state.user.error?.message || '');

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
        Tạo Tài Khoản
      </Typography>

      {errorMessage && (
        <Typography sx={{ color: 'error.main', textAlign: 'center', mb: 2 }} variant="body2">
          {errorMessage}
        </Typography>
      )}

      <form onSubmit={form.handleSubmit(handleSubmit)} noValidate style={{ width: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <InputField name="username" label="Tên đăng nhập" form={form} />
          </Grid>
          <Grid item xs={12}>
            <InputField name="email" label="Email" form={form} />
          </Grid>
          <Grid item xs={12}>
            <PasswordField name="password" label="Mật khẩu" form={form} />
          </Grid>
          <Grid item xs={12}>
            <PasswordField name="retypePassword" label="Nhập lại mật khẩu" form={form} />
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, ml: 1 }}>
              Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
            </Typography>
          </Grid>
        </Grid>

        <Button type="submit" fullWidth variant="contained" sx={{ mt: '10px' }}>
          Đăng Ký
        </Button>
      </form>
    </Box>
  );
}

export default RegisterForm;
