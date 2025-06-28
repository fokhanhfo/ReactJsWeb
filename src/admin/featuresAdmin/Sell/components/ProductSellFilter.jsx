import React from 'react';
import { Box, TextField, Typography, Paper, Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from 'react-redux';
import SelectFrom from 'components/form-controls/SelectFrom';
import SliderForm from 'components/form-controls/SliderForm/SliderForm';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';

ProductSellFilter.propTypes = {
  onChange: PropTypes.func,
  filter: PropTypes.object,
};

function ProductSellFilter({ onChange, filter }) {
  const [sortPrice, setSortPrice] = React.useState('');
  const location = useLocation();
  const [category, setCategory] = React.useState('');
  const schema = yup
    .object({
      name: yup.string().required('Bắt buộc'),
      description: yup.string().required('Bắt buộc'),
    })
    .required();

  const handleSortPrice = (event) => {
    const value = event.target.value;
    setSortPrice(value);

    const newFilter = { ...filter };

    if (value === '') {
      delete newFilter.sort;
    } else {
      newFilter.sort = value;
      newFilter.page = 1;
    }

    if (onChange) {
      onChange(newFilter);
    }
  };

  const handleCategory = (event) => {
    const value = event.target.value;
    setCategory(value);

    const newFilter = { ...filter };

    if (value === '') {
      delete newFilter.category;
    } else {
      newFilter.category = value;
      newFilter.page = 1;
    }

    if (onChange) {
      onChange(newFilter);
    }
  };

  const handleSearchChange = (e) => {
    const newName = e.target.value;

    const currentParams = queryString.parse(location.search);
    const updatedParams = {
      ...currentParams,
      name: newName,
      page: 1,
    };

    if (onChange) {
      onChange(updatedParams);
    }
  };

  const categoryQuery = useSelector((state) => state.categoryApi.queries['getCategory(undefined)']);

  return (
    <>
      <Typography variant="subtitle1" fontWeight={600} mb={2}>
        Bộ lọc sản phẩm
      </Typography>
      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
        <TextField onChange={handleSearchChange} size="small" placeholder="Search Product" fullWidth />
        <FormControl fullWidth size="small">
          <InputLabel>Danh mục</InputLabel>
          <Select value={category} label="Category" onChange={(e) => handleCategory(e)}>
            <MenuItem value="">All</MenuItem>
            {categoryQuery?.data?.data.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* <SliderForm name="price" form={form} min={0} max={1000000} /> */}
        <FormControl fullWidth size="small">
          <InputLabel>Giá</InputLabel>
          <Select value={sortPrice} label="Giá" onChange={(e) => handleSortPrice(e)}>
            <MenuItem value="">Bỏ chọn</MenuItem>
            <MenuItem value="sellingPrice:desc">Giảm dần</MenuItem>
            <MenuItem value="sellingPrice:asc">Tăng dần</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </>
  );
}

export default ProductSellFilter;
