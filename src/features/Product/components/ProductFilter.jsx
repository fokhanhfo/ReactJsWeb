import React from 'react';
import PropTypes from 'prop-types';
import ProductCategory from './Filters/ProductCategory';
import { Box } from '@mui/material';
import ProductPrice from './Filters/ProductPrice';

ProductFilter.propTypes = {
    filters : PropTypes.object.isRequired,
    onChange : PropTypes.func,
};

function ProductFilter(props) {
    const {filters, onChange} = props;

    const handleCategoryChange = (newCategoryId) => {
        if(onChange){
            const newFilter = {
                ...filters,
                'category': newCategoryId,
            }
            onChange(newFilter);
        }
    };

    const handleProductPriceChange = (newPrice) => {
        if(onChange){
            const newFilter = {
                ...filters,
                'price_gte': newPrice.salePrice_gte,
                'price_lte': newPrice.salePrice_lte
            }
            onChange(newFilter);
        }
    };

    return (
        <Box>
            <ProductCategory onChange={handleCategoryChange}></ProductCategory>
            <ProductPrice onChange={handleProductPriceChange}></ProductPrice>
        </Box>
    );
}

export default ProductFilter;