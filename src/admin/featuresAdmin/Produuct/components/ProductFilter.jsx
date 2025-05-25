import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './styled.scss';
import { Box, Button, Checkbox } from '@mui/material';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import SelectFrom from 'components/form-controls/SelectFrom';
import InputField from 'components/form-controls/InputForm';
import { useSelector } from 'react-redux';
import SliderForm from 'components/form-controls/SliderForm/SliderForm';
import { optionStatus } from 'utils/status';
import RadioForm from 'components/form-controls/RadioForm';
import { useSearchParams } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

ProductFilter.propTypes = {
  filter: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

function ProductFilter({ filter, onSubmit }) {
  const [isMenu, setIsMenu] = useState();
  const categoryQuery = useSelector((state) => state.categoryApi.queries['getCategory(undefined)']);
  const [searchParams] = useSearchParams();

  const schema = yup
    .object({
      name: yup.string(),
      price: yup.array().nullable(),
      category: yup.object().nullable(),
      status: yup.number().nullable(),
    })
    .required();

  const form = useForm({
    defaultValues: {
      name: '',
      price: null,
      category: null,
      status: null,
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (searchParams) {
      const categoryId = JSON.parse(searchParams.get('category'));
      let selectedCategory;
      if (categoryId) {
        selectedCategory = categoryQuery.data.data.find((cat) => cat.id === categoryId.id) || null;
      }
      form.reset({
        name: searchParams.get('name') || '',
        price: [
          searchParams.get('price_gte') ? Number(searchParams.get('price_gte')) : 0,
          searchParams.get('price_lte') ? Number(searchParams.get('price_lte')) : 100000000,
        ],
        category: selectedCategory,
        status: searchParams.get('status') ? Number(searchParams.get('status')) : null,
      });
    }
  }, [searchParams, form]);
  const handleSubmit = async (values) => {
    const newValues = {
      ...values,
      price_gte: values.price[0],
      price_lte: values.price[1],
      category: values?.category?.id,
    };
    Object.keys(newValues).forEach((key) => {
      if (newValues[key] === null) {
        delete newValues[key];
      }
    });
    delete newValues.price;
    if (onSubmit) {
      onSubmit(newValues);
    }
  };
  return (
    <>
      <form
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '30px',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <InputField width="30%" name="name" label="Tên sản phẩm" form={form} />
        <SelectFrom
          height="40px"
          width="30%"
          name="category"
          label="Danh mục"
          form={form}
          options={categoryQuery.data.data}
        />
        <SliderForm width="40%" name="price" label="Chọn khoảng giá" form={form} min={0} max={1000000} />
        <RadioForm name="status" label="Trạng thái" form={form} option={optionStatus} />
        <Box sx={{ width: '100%' }}>
          <Button startIcon={<SearchIcon />} sx={{ float: 'right' }} variant="contained" type="submit">
            search
          </Button>
        </Box>
      </form>
    </>
  );
}

export default ProductFilter;
