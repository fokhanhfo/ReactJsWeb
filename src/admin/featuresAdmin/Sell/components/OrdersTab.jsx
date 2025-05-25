import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  List,
  Avatar,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Divider,
  Button,
  Paper,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../CartContext';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';
import { useDispatch } from 'react-redux';
import PayOrder from './PayOrder';
import CloseIcon from '@mui/icons-material/Close';

OrdersTab.propTypes = {
  actionsState: PropTypes.object,
};

function OrdersTab({ actionsState }) {
  const { cart, setCart } = useCart();

  const dispatch = useDispatch();

  const handleIncreaseQuantity = (product) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productDetail.id === product.productDetail.id &&
        item.color.name === product.color.name &&
        item.size === product.size
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const handleDecreaseQuantity = (product) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.productDetail.id === product.productDetail.id &&
          item.color.name === product.color.name &&
          item.size === product.size
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemoveProduct = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const handleActions = (state) => handleAction(state, dispatch, actionsState);

  const totalPrice = cart.reduce((sum, item) => sum + item.productDetail.sellingPrice * item.quantity, 0);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        🛒 Order
      </Typography>
      <Divider sx={{ marginY: 2 }} />

      {/* Box chứa danh sách sản phẩm */}
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {cart.length === 0 ? (
          <Box display="flex" alignItems="center" justifyContent="center" flex={1}>
            <Typography variant="body1" color="text.secondary">
              Đơn hàng trống.
            </Typography>
          </Box>
        ) : (
          <List sx={{ flex: 1, overflowY: 'auto', maxHeight: '450px' }}>
            {cart.map((product, index) => (
              <Card
                key={index}
                sx={{
                  marginBottom: 2,
                  position: 'relative',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Typography variant="h6" fontWeight="500">
                    {product.productDetail.product.name}
                  </Typography>
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
                        product.productDetail.image.length > 0
                          ? product.productDetail.image[0].imageUrl
                          : 'https://via.placeholder.com/64'
                      }
                      alt="White shirt"
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
                    {/* Price */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography sx={{ color: 'error.main', fontWeight: 500, fontSize: '1.1rem' }}>
                        {product.productDetail.sellingPrice.toLocaleString()} VND
                      </Typography>
                      <Typography sx={{ ml: 2, color: 'text.disabled', textDecoration: 'line-through' }}>
                        40000
                      </Typography>
                    </Box>

                    {/* Details Grid */}
                    <Grid container spacing={1.5} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography sx={{ color: 'text.secondary' }}>Số Lượng</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleDecreaseQuantity(product)}
                            sx={{
                              border: '1px solid rgba(0,0,0,0.23)',
                              borderRadius: '50%',
                              p: 0.5,
                            }}
                          >
                            <RemoveIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                          <Typography sx={{ mx: 2 }}>{product.quantity}</Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleIncreaseQuantity(product)}
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

                      <Grid item xs={6}>
                        <Typography sx={{ color: 'text.secondary' }}>Màu</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>{product.color.name}</Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography sx={{ color: 'text.secondary' }}>Size</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>{product.size}</Typography>
                      </Grid>
                    </Grid>

                    {/* Total Price */}
                    <Box sx={{ textAlign: 'right', pt: 1 }}>
                      <Typography sx={{ fontWeight: 500, fontSize: '1.1rem' }}>
                        {(product.productDetail.sellingPrice * product.quantity).toLocaleString()} VND
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Card>
            ))}
          </List>
        )}
      </Box>

      <Divider sx={{ marginY: 2 }} />
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <Typography variant="h6" fontWeight="bold" color="primary">
          Tổng tiền: {totalPrice.toLocaleString()} VND
        </Typography>
        <Button sx={{ float: 'right' }} onClick={() => handleActions('view')} variant="contained">
          Pay
        </Button>
      </Box>
      <PayOrder cart={cart} totalPrice={totalPrice} actionsState={actionsState} />
    </Box>
  );
}

export default OrdersTab;
