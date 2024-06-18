import { yupResolver } from '@hookform/resolvers/yup';
import { LockOutlined } from '@mui/icons-material';
import { Avatar, Button, Typography} from '@mui/material';
import { makeStyles } from '@mui/styles';
import InputField from 'components/form-controls/InputForm';
import PasswordField from 'components/form-controls/PassworField';
import PropTypes from 'prop-types';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

LoginForm.propTypes = {
  onSubmit: PropTypes.func,
};

const useStyles = makeStyles((theme) =>({
  root:{},

  avatar:{
    margin:'0 auto',
  },

  title:{
    textAlign: 'center',
  },

  submit:{},
}));

function LoginForm(props) {
  const classes = useStyles();

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
    <div className={classes.root}>
      <Avatar className={classes.avatar} style={{background:'red'}}>
      </Avatar>

      <Typography className={classes.title} component="h3" variant='h5'> 
        Sign in
      </Typography>

      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <InputField name='identifier' label='Email' form={form}/>
        <PasswordField name='password' label='Password' form={form}/>
        <Button type='submit' fullWidth variant='contained' style={{margin:'16.5px 0'}}>
          Sign in
        </Button>
      </form>
    </div>
  );
}

export default LoginForm;
