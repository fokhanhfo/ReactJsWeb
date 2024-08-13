import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Skeleton, Typography } from '@mui/material';
import { STATIC_HOST } from 'constants';
import { THUMBNAIL_PLACEHOLDER } from 'constants';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from 'utils';
import styled from 'styled-components';

Product.propTypes = {
    product : PropTypes.object,
};

const StylesBox = styled(Box)`
    img{
        width:100%;
        aspect-ratio: 1 / 1;
        object-fit: cover;
    }
`

const StyledTypography = styled(Typography)`
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
`;

function Product({product}) {

    const history = useNavigate()

    const thumbnailUrl = product.imagesUrl ? `${product.imagesUrl[0]}` : THUMBNAIL_PLACEHOLDER; 

    const handleClick = () => {
        history(`/products/${product.id}`);
    };

    return (
        <StylesBox onClick={handleClick}>
            <img src={thumbnailUrl} alt={product.name}/>
            <StyledTypography
                variant="body1"
            >{product.name}</StyledTypography>
            <Typography>
                {formatPrice(product.price)}
            </Typography>
        </StylesBox>
    );
}

export default Product;