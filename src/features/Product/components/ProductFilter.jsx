import React from 'react';
import PropTypes from 'prop-types';
import ProductCategory from './Filters/ProductCategory';
import ProductPrice from './Filters/ProductPrice';
import { Box, Paper, Typography, Button, Divider } from '@mui/material';

ProductFilter.propTypes = {
  filters: PropTypes.object.isRequired,
  onChange: PropTypes.func,
};

function ProductFilter({ filters, onChange }) {
  const handleCategoryChange = (category) => {
    if (onChange) {
      const newFilter = {
        ...filters,
        category: category.id,
      };
      onChange(newFilter);
    }
  };

  const handleProductPriceChange = (newPrice) => {
    if (onChange) {
      const newFilter = {
        ...filters,
        price_gte: newPrice.salePrice_gte,
        price_lte: newPrice.salePrice_lte,
      };
      onChange(newFilter);
    }
  };

  return (
    <>
      <Divider sx={{ mb: 2 }} />
      <Box>
        <ProductCategory onChange={handleCategoryChange} />
        <Divider sx={{ my: 2 }} />
        <ProductPrice onChange={handleProductPriceChange} />
      </Box>
      <Button variant="contained" color="primary" sx={{ mt: 2, width: '100%', borderRadius: 1 }}>
        Áp dụng
      </Button>
    </>
  );
}

export default ProductFilter;
