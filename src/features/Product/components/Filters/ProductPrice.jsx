import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, TextField, Typography } from '@mui/material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import styled from '@emotion/styled';

const StyledBox = styled(Box)`
  display: flex;
`;

const StyledTextField = styled(TextField)`
  margin-right: 10px;
`;

ProductPrice.propTypes = {
    onChange: PropTypes.func,
};

function ProductPrice(props) {
    const { onChange } = props;

    const [price,setPrice]= useState({
        salePrice_gte:0,
        salePrice_lte:0,
    });

    const handlePrice = (evt)=>{
        evt.stopPropagation();
        evt.preventDefault();
        const { name, value } = evt.target;
        evt.currentTarget.value = evt.target.value.replace(/[\D\s]/, '');
        setPrice(prevValue=>({
            ...prevValue,
            [evt.target.name] : evt.target.value,
        }));
    }

    const handleSubmit = ()=>{
        if(onChange){
            onChange(price);
        }
    };

    return (
        <Box>
            <Typography>Giá</Typography>
            <StyledBox>
                <StyledTextField
                name="salePrice_gte"
                value={price.salePrice_gte}
                type='text'
                onChange={handlePrice}
                size='small'
                />
                <ArrowRightAltIcon style={{ margin: '10px' }} />
                <StyledTextField
                name="salePrice_lte"
                value={price.salePrice_lte}
                type='text'
                onChange={handlePrice}
                size='small'
                />
            </StyledBox>
            <Button onClick={handleSubmit}>
                Lọc
            </Button>
        </Box>
    );
}

export default ProductPrice;