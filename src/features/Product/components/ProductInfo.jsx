import React, { useState } from 'react';
import PropTypes from 'prop-types';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import { Box, Button, TextField, Typography } from '@mui/material';
import { formatPrice } from 'utils';
import { AddShoppingCart } from '@mui/icons-material';
import './styles.scss';
import { useAddToCartMutation } from 'features/Cart/cartApi';
import { useSnackbar } from 'notistack';

ProductInfo.propTypes = {
    product: PropTypes.object,
};

function ProductInfo({ product = {} }) {
    const { id, name, detail, price, quantity, category } = product;
    const [amount, setAmount] = useState(1);
    const [addToCart] = useAddToCartMutation();
    const {enqueueSnackbar } = useSnackbar();
    const handleAddToCart = async () => {
        const newItem = {
            product: id,
            quantity: amount,
        };

        try {
            const response = await addToCart(newItem).unwrap();
            enqueueSnackbar(`${response.data.message}`,{variant:'success'});
        } catch (error) {
            console.log(error);
            enqueueSnackbar(`${error.data.message}`,{variant:'error'});
        }
    };
    return (
        <Box className="product-info" sx={{ padding: { xs: '10px', sm: '20px' } }}>
            <Box sx={{ marginBottom: '16px' }}>
                <Typography variant='h5'>{name}</Typography>
            </Box>
            <Box sx={{ marginBottom: '16px' }}>
                <Box display="flex" alignItems="center" flexWrap="wrap">
                    <Box display="flex" alignItems="center">
                        <Typography component="span" sx={{ marginRight: '4px' }}>4</Typography>
                        {[...Array(4)].map((_, index) => (
                            <StarIcon key={index} sx={{ color: 'gold', fontSize: '20px' }} />
                        ))}
                        <StarHalfIcon sx={{ color: 'gold', fontSize: '20px' }} />
                    </Box>
                    <Box sx={{ border: '1px solid', padding: '10px 0', margin: '0 8px' }} />
                    <Typography component="span" sx={{ marginRight: '16px' }}>4 Đánh giá</Typography>
                    <Box sx={{ border: '1px solid', padding: '10px 0', margin: '0 8px' }} />
                    <Typography component="span">4 Đã bán</Typography>
                </Box>
            </Box>
            <Box sx={{ marginBottom: '16px' }}>
                <Typography variant='h6'>{formatPrice(price)}</Typography>
            </Box>
            <Box sx={{ marginBottom: '16px' }}>
                <Typography>Hãng sản phẩm: {category.name}</Typography>
            </Box>
            <Box sx={{ marginBottom: '16px' }}>
                <Typography dangerouslySetInnerHTML={{ __html: detail }}></Typography>
            </Box>
            <Box display="flex" alignItems="center" flexWrap="wrap" sx={{ marginBottom: '16px' }}>
                <TextField type="number" variant="outlined" 
                onChange={(e) => setAmount(Number(e.target.value))}
                size="small" sx={{ marginRight: '16px' }} 
                InputProps={{
                    inputProps:{min:1}
                }} />
                <Typography>{quantity} Sản phẩm có sẵn</Typography>
            </Box>
            <Box>
                <Button variant='outlined' startIcon={<AddShoppingCart />} onClick={handleAddToCart}>
                    Add to cart
                </Button>
            </Box>
        </Box>
    );
}

export default ProductInfo;
