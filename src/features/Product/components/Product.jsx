import React from 'react';
import PropTypes from 'prop-types';
import { Box, Skeleton, Typography } from '@mui/material';
import { STATIC_HOST } from 'constants';
import { THUMBNAIL_PLACEHOLDER } from 'constants';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from 'utils';

Product.propTypes = {
    product : PropTypes.object,
};

function Product({product}) {

    const history = useNavigate()

    const thumbnailUrl = product.thumbnail ? `${STATIC_HOST}${product.thumbnail?.url}` : THUMBNAIL_PLACEHOLDER; 

    const handleClick = () => {
        history(`/products/${product.id}`);
    };

    return (
        <Box padding={1} onClick={handleClick}>
            <img src={thumbnailUrl} alt={product.name} width='100%' />
            <Typography>{product.name}</Typography>
            <Typography>
                {formatPrice(product.originalPrice)}
            </Typography>
        </Box>
    );
}

export default Product;