import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Xác định schema xác thực bằng yup
const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  age: yup.number().positive('Age must be a positive number').integer('Age must be an integer').required('Age is required'),
}).required();

const TestYup = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>First Name</label>
        <input {...register('firstName')} />
        <p>{errors.firstName?.message}</p>
      </div>

      <div>
        <label>Age</label>
        <input {...register('age')} />
        <p>{errors.age?.message}</p>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

TestYup.propTypes = {
  // Define prop types if needed
};

export default TestYup;
