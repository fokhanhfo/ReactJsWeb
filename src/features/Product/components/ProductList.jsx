import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Paper, Skeleton } from '@mui/material';
import Product from './Product';
import styled from 'styled-components';

ProductList.propTypes = {
    data : PropTypes.array,
};

const StyledBox = styled(Box)`
    border:0.5px solid rgb(223 223 223);
    border-radius:10px;
    &:hover{
        border:0.5px solid red;
    }
`;



function ProductList({data=[]}) {
    return (
        <Box padding='8px'>
            <Grid container>
                {data.map((product)=>(
                    <Grid padding='8px' item key={product.id} xs={12} sm={6} md={4} lg={3} >
                        <StyledBox>
                            <Product product={product}></Product>
                        </StyledBox>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default ProductList;