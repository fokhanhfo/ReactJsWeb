import styled from '@emotion/styled';
import { yupResolver } from '@hookform/resolvers/yup';
import { LockOutlined } from '@mui/icons-material';
import { Avatar, Button, Typography } from '@mui/material';
import InputField from 'components/form-controls/InputForm';
import PasswordField from 'components/form-controls/PassworField';
import PropTypes from 'prop-types';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import * as yup from 'yup';

const StyledAvatar = styled(Avatar)`
  margin: 0 auto;
  background: red;
`;

const StyledTypography = styled(Typography)`
  text-align: center;
`;

const StyledButton = styled(Button)`
  margi-top: 10px;
`;

RegisterForm.propTypes = {
  onSubmit: PropTypes.func,
};

function RegisterForm(props) {
  // .test('hai từ','Họ tên phải có 2 từ trở lên',(value)=>{
  //   return value.trim().split(' ').length >=2;
  // }),
  const schema = yup
    .object({
      username: yup.string().required('please enter fullname'),
      email: yup.string().required('Bắt buộc').email('Nhập đúng đinh dạng email'),
      password: yup.string().required('Bắt buộc').min(8, 'Mật khẩu phải có 8 chữ số'),
      retypePassword: yup
        .string()
        .required('Băt buộc')
        .oneOf([yup.ref('password')], 'Nhập lại sai'),
    })
    .required();

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
    <div>
      <StyledAvatar>
        <LockOutlined />
      </StyledAvatar>

      <StyledTypography component="h3" variant="h5">
        Create An Account
      </StyledTypography>

      <p>{errorMessage}</p>

      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <InputField name="username" label="User Name" form={form} />
        <InputField name="email" label="Email" form={form} />
        <PasswordField name="password" label="Password" form={form} />
        <PasswordField name="retypePassword" label="Retype Password" form={form} />
        <StyledButton type="submit" fullWidth variant="contained">
          Sign Up
        </StyledButton>
      </form>
    </div>
  );
}

export default RegisterForm;
