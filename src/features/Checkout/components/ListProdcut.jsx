import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Box, Card, Checkbox, Container, Divider, Grid, IconButton, List, Paper, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import CartItem from 'features/Cart/components/CartItem';
import Loading from 'components/Loading';
import styled from 'styled-components';
import { formatPrice, handleGlobalError } from 'utils';
import { useUpdateCartMutation } from 'features/Cart/cartApi';
import { THUMBNAIL_PLACEHOLDER } from 'constants';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import PayCheckout from './PayCheckout';
import { CheckoutContext } from './CheckoutProvider';
import billApi from 'api/billApi';
import { useSnackbar } from 'notistack';
import { useGetCartQuery } from 'hookApi/cartApi';
import { useNavigate } from 'react-router-dom';

ListProdcut.propTypes = {
  cartQuery: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
  form: PropTypes.object.isRequired,
};

const StyledTypography = styled(Typography)`
  font-weight: 500;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

function ListProdcut({ cartQuery, onSubmit, form }) {
  const cartData = cartQuery?.data.data;
  const [updateCart] = useUpdateCartMutation();
  const { enqueueSnackbar } = useSnackbar();
  const { refetch } = useGetCartQuery();
  const navigate = useNavigate();

  const handleIncrement = async (cartItem) => {
    const newQuantity = { ...cartItem, quantity: cartItem.quantity + 1, product: cartItem.product.id };
    try {
      await updateCart(newQuantity).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDecrement = async (cartItem) => {
    if (cartItem.quantity > 1) {
      const newQuantity = { ...cartItem, quantity: cartItem.quantity - 1, product: cartItem.product.id };
      try {
        await updateCart(newQuantity).unwrap();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const { discountFreeShip, voucherProduct, moneyToPay } = useContext(CheckoutContext);

  const handleSubmit = async (value) => {
    console.log(moneyToPay);
    console.log(value);
    console.log(voucherProduct);
    console.log(discountFreeShip);
    const listIdVoucher = [voucherProduct?.id, discountFreeShip?.id].filter((id) => id !== undefined);
    console.log(listIdVoucher);
    try {
      // form.setValue('listCart', listCart);
      // form.setValue('selectCartItem', selectCartItem);
      // form.setValue('totalPrice', totalPrice);
      const city = form.getValues('city').name;
      const district = form.getValues('district').name;
      const commune = form.getValues('commune').name;
      const newdata = {
        fullName: form.getValues('fullname'),
        email: form.getValues('email'),
        address: `${form.getValues('addressDetail')} - ${commune} - ${district} - ${city}`,
        phone: form.getValues('phone'),
        cartRequests: cartData.filter((item) => item.status === 1),
        total_price: moneyToPay,
        discountId: listIdVoucher,
        paymentMethod: form.getValues('paymentMethod'),
      };
      const res = await billApi.add(newdata);
      enqueueSnackbar(`Mua hàng thành công`, { variant: 'success' });
      if (res) {
        refetch();
        navigate('/home');
      }
    } catch (error) {
      enqueueSnackbar(`Mua hàng thất bại`, { variant: 'error' });
    }
  };

  return (
    <>
      {cartData ? (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
          <Grid container sx={{ flex: 1 }}>
            {cartData
              .filter((item) => item.status === 1)
              .map((item, index) => (
                <Grid item md={6} key={index} sx={index % 2 != 0 ? { borderLeft: '1px solid #ccc', pl: 2 } : null}>
                  <Container>
                    <Box sx={{ display: 'flex', justifyContent: 'end', margin: '10px 10px 0 0' }}>
                      <IconButton size="small" sx={{ p: 0 }}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 3 }}>
                      {/* Product Image */}
                      <Box sx={{ width: '33%' }}>
                        <Paper
                          component="img"
                          src={
                            item.productDetail.image.length > 0
                              ? item.productDetail.image[0].imageUrl
                              : 'https://via.placeholder.com/64'
                          }
                          alt={item.productDetail.product.name || 'Product Image'}
                          sx={{
                            width: '100%',
                            height: 'auto',
                            objectFit: 'cover',
                            bgcolor: '#f5f5f5',
                          }}
                        />
                      </Box>

                      {/* Product Details */}
                      <Box sx={{ width: '67%' }}>
                        {/* Product Name */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h8" fontWeight="500">
                            {item.productDetail.product.name}
                          </Typography>
                        </Box>

                        {/* Price */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Typography sx={{ color: 'error.main', fontWeight: 500, fontSize: '1.1rem' }}>
                            {item.productDetail.sellingPrice.toLocaleString()} đ
                          </Typography>
                          <Typography sx={{ ml: 2, color: 'text.disabled', textDecoration: 'line-through' }}>
                            40,000
                          </Typography>
                        </Box>

                        {/* Details Grid */}
                        <Grid container spacing={1} sx={{ mb: 2 }}>
                          {/* Quantity */}
                          <Grid item xs={4}>
                            <Typography sx={{ color: 'text.secondary' }}>Số Lượng</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <IconButton
                                size="small"
                                onClick={() => handleDecrement(item)}
                                sx={{
                                  border: '1px solid rgba(0,0,0,0.23)',
                                  borderRadius: '50%',
                                  p: 0.5,
                                }}
                              >
                                <RemoveIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                              <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                              <IconButton
                                size="small"
                                onClick={() => handleIncrement(item)}
                                sx={{
                                  border: '1px solid rgba(0,0,0,0.23)',
                                  borderRadius: '50%',
                                  p: 0.5,
                                }}
                              >
                                <AddIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Box>
                          </Grid>

                          <Grid item xs={4}></Grid>

                          {/* Color */}
                          <Grid item xs={4}>
                            <Typography sx={{ color: 'text.secondary' }}>Màu</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography>{item.color.name}</Typography>
                          </Grid>

                          <Grid item xs={4}></Grid>

                          {/* Size */}
                          <Grid item xs={4}>
                            <Typography sx={{ color: 'text.secondary' }}>Size</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography>{item.size.name}</Typography>
                          </Grid>

                          {/* Total Price */}
                          <Grid item xs={4}>
                            <Typography>
                              {(item.productDetail.sellingPrice * item.quantity).toLocaleString()}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </Container>
                </Grid>
              ))}
          </Grid>

          {/* <Divider sx={{ marginY: 2 }} /> */}

          <Grid container>
            <Grid item md={6}></Grid>
            <Grid item md={6}>
              <PayCheckout onSubmit={handleSubmit} cartQuery={cartQuery}></PayCheckout>
            </Grid>
          </Grid>
        </Paper>
      ) : (
        <Loading></Loading>
      )}
    </>
  );
}

export default ListProdcut;
