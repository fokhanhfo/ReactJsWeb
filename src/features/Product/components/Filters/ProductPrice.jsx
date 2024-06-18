import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, TextField, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

const useStyles = makeStyles((theme)=>({
    box:{
        display: 'flex',
    },
    
}));

ProductPrice.propTypes = {
    onChange: PropTypes.func,
};

function ProductPrice(props) {
    const classes = useStyles();
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
            <Box className={classes.box}>
                <TextField 
                    name="salePrice_gte"
                    value={price.salePrice_gte}
                    type='text' 
                    onChange={handlePrice}
                    size='small' 
                />
                <ArrowRightAltIcon style={{margin:'10px'}}></ArrowRightAltIcon>
                <TextField 
                    name="salePrice_lte"
                    value={price.salePrice_lte}
                    type='text' 
                    onChange={handlePrice}
                    size='small' 
                />
            </Box>
            <Button onClick={handleSubmit}>
                Lọc
            </Button>
        </Box>
    );
}

export default ProductPrice;