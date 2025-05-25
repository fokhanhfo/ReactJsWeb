import React from 'react';
import { Box, TextField, Typography, Paper, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from 'react-redux';
import SelectFrom from 'components/form-controls/SelectFrom';
import SliderForm from 'components/form-controls/SliderForm/SliderForm';

function ProductSellFilter() {
  const schema = yup
    .object({
      name: yup.string().required('Bắt buộc'),
      description: yup.string().required('Bắt buộc'),
    })
    .required();

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
    },
    resolver: yupResolver(schema),
  });

  const categoryQuery = useSelector((state) => state.categoryApi.queries['getCategory(undefined)']);

  return (
    <>
      <Typography variant="subtitle1" fontWeight={600} mb={2}>
        Bộ lọc sản phẩm
      </Typography>
      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
        <TextField
          fullWidth
          size="small"
          label="Tên sản phẩm"
          {...form.register('name')}
          error={!!form.formState.errors.name}
          helperText={form.formState.errors.name?.message}
        />
        <SelectFrom
          height="40px"
          fullWidth
          name="category"
          label="Danh mục"
          form={form}
          options={categoryQuery?.data?.data || []}
        />
        <SliderForm name="price" form={form} min={0} max={1000000} />
      </Stack>
    </>
  );
}

export default ProductSellFilter;
