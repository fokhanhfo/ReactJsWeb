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

RegisterForm.propTypes = {
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

function RegisterForm(props) {
  const classes = useStyles();

  const schema = yup
    .object({
      fullName: yup.string().required('please enter fullname').test('hai từ','Họ tên phải có 2 từ trở lên',(value)=>{
        return value.trim().split(' ').length >=2;
      }),
      email : yup.string().required('Bắt buộc').email('Nhập đúng đinh dạng email'),
      password : yup.string().required('Bắt buộc').min(8,'Mật khẩu phải có 8 chữ số'),
      retypePassword:yup.string().required('Băt buộc').oneOf([yup.ref('password')],'Nhập lại sai')
    })
    .required();

  const form = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      retypePassword: '',
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
        Create An Account
      </Typography>

      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <InputField name='fullName' label='Full Name' form={form}/>
        <InputField name='email' label='Email' form={form}/>
        <PasswordField name='password' label='Password' form={form}/>
        <PasswordField name='retypePassword' label='Retype Password' form={form}/>
        <Button type='submit' fullWidth variant='contained' style={{margin:'16.5px 0'}}>
          Sign up
        </Button>
      </form>
    </div>
  );
}

export default RegisterForm;
