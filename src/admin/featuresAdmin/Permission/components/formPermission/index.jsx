import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from 'components/form-controls/InputForm';
import { Button } from '@mui/material';

FormPermission.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
  }),
  isEdit: PropTypes.bool,
};

function FormPermission({ onSubmit, initialValues, isEdit = false }) {
  const schema = yup
    .object({
      name: yup.string().required('Bắt buộc'),
    })
    .required();

  const form = useForm({
    defaultValues: {
      name: '',
    },
    resolver: yupResolver(schema),
  });

  const handleSubmit = (value) => {
    if (onSubmit) {
      onSubmit(value);
    }
    form.reset();
  };

  useEffect(() => {
    if (initialValues) {
      form.reset({
        name: initialValues.name || '',
        description: initialValues.description || '',
      });
    }
  }, [initialValues, form]);
  return (
    <>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <InputField name="name" label="Name" form={form} />
        <Button type="submit">{!isEdit ? 'Thêm quyền' : 'Cập nhật'}</Button>
      </form>
    </>
  );
}

export default FormPermission;
