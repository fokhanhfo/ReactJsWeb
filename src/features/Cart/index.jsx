import React from 'react';
import PropTypes from 'prop-types';
import { Box, Container, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import CartItem from './components/CartItem';
import PayCart from './components/PayCart';
import { useSelector } from 'react-redux';
import { useUpdateCartMutation } from 'hookApi/cartApi';
import CloseIcon from '@mui/icons-material/Close';

CartFeature.propTypes = {
  setOpen: PropTypes.func.isRequired,
};

function CartFeature({ setOpen }) {
  const cartQuery = useSelector((state) => state.cartApi.queries['getCart(undefined)']);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const cartData = cartQuery?.data;
  const isFetching = cartQuery?.isFetching;
  const [updateCart] = useUpdateCartMutation();

  const handleCheckboxChange = async (cartItem) => {
    const updatedCartItem = { ...cartItem, status: cartItem.status === 1 ? 0 : 1 };
    const response = await updateCart(updatedCartItem).unwrap();
  };

  const handleAllCheckboxChange = async (status) => {
    const listCart = [...cartData.data];
    listCart.forEach(async (item) => {
      const newItem = { ...item, status: status };
      const response = await updateCart(newItem).unwrap();
    });
  };
  return (
    <>
      <Box sx={{ mt: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.2)' }}>
        <IconButton sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }} onClick={() => setOpen(false)}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          🛒GIỎ HÀNG
        </Typography>
        {/* <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
            '& a': {
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
                color: 'primary.main',
              },
            },
          }}
        >
          <Link to="/">Home</Link>
          <ChevronRightIcon fontSize="small" sx={{ mx: 0.5, opacity: 0.6 }} />
          <Link to="/products">Shop</Link>
          <ChevronRightIcon fontSize="small" sx={{ mx: 0.5, opacity: 0.6 }} />
          <Typography color="text.primary" sx={{ fontWeight: 'medium' }}>
            Cart
          </Typography>
        </Box> */}
      </Box>
      <Box>
        {cartData?.data?.length > 0 ? (
          <Box
            sx={{
              width: {
                xs: '100%',
                sm: '400px',
              },
              p: 2,
            }}
          >
            <CartItem listCart={cartData.data} onCheckboxChange={handleCheckboxChange}></CartItem>
            <PayCart setOpen={setOpen} listCart={cartData.data} onAllCheckboxChange={handleAllCheckboxChange}></PayCart>
          </Box>
        ) : (
          <Box width={'400px'} display="flex" alignItems="center" justifyContent="center" flex={1}>
            <Typography variant="body1" color="text.secondary">
              Giỏ hàng trống.
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
}

export default CartFeature;
