import styled from '@emotion/styled';
import { yupResolver } from '@hookform/resolvers/yup';
import { LockOutlined } from '@mui/icons-material';
import { Avatar, Button, Typography} from '@mui/material';
import InputField from 'components/form-controls/InputForm';
import PasswordField from 'components/form-controls/PassworField';
import PropTypes from 'prop-types';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

LoginForm.propTypes = {
  onSubmit: PropTypes.func,
};

// const useStyles = makeStyles((theme) =>({
//   root:{},

//   avatar:{
//     margin:'0 auto',
//   },

//   title:{
//     textAlign: 'center',
//   },

//   submit:{},
// }));

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
      identifier : yup.string().required('Bắt buộc').email('Nhập đúng đinh dạng email'),
      password : yup.string().required('Bắt buộc').min(8,'Mật khẩu phải có 8 chữ số'),
    })
    .required();

  const form = useForm({
    defaultValues: {
      identifier: '',
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const handleSubmit = (value) => {
    const {onSubmit} = props;
    if(onSubmit){
      onSubmit(value);
    }
    form.reset();
  };

  return (
    <div>
      <StyledAvatar>
        <LockOutlined />
      </StyledAvatar>

      <StyledTypography component="h3" variant="h5">
        Sign in
      </StyledTypography>

      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <InputField name='identifier' label='Email' form={form}/>
        <PasswordField name='password' label='Password' form={form}/>
        <StyledButton type="submit" fullWidth variant="contained">
          Sign in
        </StyledButton>
      </form>
    </div>
  );
}

export default LoginForm;
