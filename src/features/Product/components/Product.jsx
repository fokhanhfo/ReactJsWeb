import React from 'react';
import PropTypes from 'prop-types';
import { Box, Skeleton, Typography } from '@mui/material';

Product.propTypes = {
    product : PropTypes.object,
};

function Product({product}) {
    const format = new Intl.NumberFormat('vi-VN',{
       style: 'currency',
       currency: 'VND', 
    });

    return (
        <Box padding={1}>
            <img src='https://api.ezfrontend.com/uploads/9ff7d29c2ebad4fd802685eb770d9452_417240087a.jpg' alt={product.name} width='100%' />
            <Typography>{product.name}</Typography>
            <Typography>
                {format.format(product.originalPrice)}
            </Typography>
        </Box>
    );
}

export default Product;