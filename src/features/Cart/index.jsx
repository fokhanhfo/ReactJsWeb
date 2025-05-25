import React from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Typography } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import CartItem from './components/CartItem';
import PayCart from './components/PayCart';
import { useSelector } from 'react-redux';
import { useUpdateCartMutation } from 'hookApi/cartApi';

CartFeature.propTypes = {
  setOpen: PropTypes.func.isRequired,
};

function CartFeature({ setOpen }) {
  const cartQuery = useSelector((state) => state.cartApi.queries['getCart(undefined)']);
  const cartData = cartQuery?.data;
  const isFetching = cartQuery?.isFetching;
  const [updateCart] = useUpdateCartMutation();
  if (isFetching) {
    return <div>Đang tải dữ liệu...</div>;
  }

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
    <Container>
      <Box sx={{ mt: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.2)' }}>
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
          <div style={{ width: '400px' }}>
            <CartItem listCart={cartData.data} onCheckboxChange={handleCheckboxChange}></CartItem>
            <PayCart setOpen={setOpen} listCart={cartData.data} onAllCheckboxChange={handleAllCheckboxChange}></PayCart>
          </div>
        ) : (
          <Box display="flex" alignItems="center" justifyContent="center" flex={1}>
            <Typography variant="body1" color="text.secondary">
              Giỏ hàng trống.
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default CartFeature;
