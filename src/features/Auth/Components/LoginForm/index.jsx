import styled from '@emotion/styled';
import { yupResolver } from '@hookform/resolvers/yup';
import { LockOutlined } from '@mui/icons-material';
import { Avatar, Button, Typography} from '@mui/material';
import InputField from 'components/form-controls/InputForm';
import PasswordField from 'components/form-controls/PassworField';
import PropTypes from 'prop-types';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import * as yup from 'yup';

LoginForm.propTypes = {
  onSubmit: PropTypes.func,
};

const StyledAvatar = styled(Avatar)`
  margin: 0 auto;
  background: red;
`;

const StyledTypography = styled(Typography)`
  text-align: center;
`;

const StyledButton = styled(Button)`
  margin: 16.5px 0;
`;

function LoginForm(props) {

  const schema = yup
    .object({
      username : yup.string().required('Bắt buộc'),
      password : yup.string().required('Bắt buộc'),
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

  const handleSubmit = async(value) => {
    const {onSubmit} = props;
    if (onSubmit) {
      await onSubmit(value);
    }
    // form.reset();
  };

  return (
    <div>
      <StyledAvatar>
        <LockOutlined />
      </StyledAvatar>
      <StyledTypography component="h3" variant="h5">
        Sign in
      </StyledTypography>

      <p>{errorMessage}</p>

      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <InputField name='username' label='Username' form={form}/>
        <PasswordField name='password' label='Password' form={form}/>
        <StyledButton type="submit" fullWidth variant="contained">
          Sign in
        </StyledButton>
      </form>
    </div>
  );
}

export default LoginForm;
