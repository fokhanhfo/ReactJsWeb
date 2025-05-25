import React from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, IconButton, Paper, TextField, Typography, Box, List, Card, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatPrice } from 'utils';
import { useDeletecartMutation, useUpdateCartMutation } from '../cartApi';
import { useSnackbar } from 'notistack';
import { THUMBNAIL_PLACEHOLDER } from 'constants';
import CloseIcon from '@mui/icons-material/Close';

CartItem.propTypes = {
  listCart: PropTypes.array.isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
};

function CartItem({ listCart = [], onCheckboxChange }) {
  const [updateCart] = useUpdateCartMutation();
  const { enqueueSnackbar } = useSnackbar();
  const [deleteCart] = useDeletecartMutation();

  const handleIncrement = async (cartItem) => {
    const newQuantity = { ...cartItem, quantity: cartItem.quantity + 1 };
    await updateCart(newQuantity).unwrap();
  };

  const handleDecrement = async (cartItem) => {
    if (cartItem.quantity > 1) {
      const newQuantity = { ...cartItem, quantity: cartItem.quantity - 1 };
      await updateCart(newQuantity).unwrap();
    }
  };

  const handleDelete = async (id) => {
    await deleteCart(id).unwrap();
    enqueueSnackbar('Sản phẩm đã bị xóa', { variant: 'success' });
  };

  const handleDecreaseQuantity = (product) => {};

  const handleIncreaseQuantity = (product) => {};

  console.log(listCart);

  return (
    <List sx={{ flex: 1, overflowY: 'auto', maxHeight: '100vh' }}>
      {listCart.map((item, index) => (
        <Card
          key={index}
          sx={{
            marginBottom: 2,
            position: 'relative',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox checked={item.status === 1} onChange={() => onCheckboxChange(item)} />
              <Typography variant="h6" fontWeight="500">
                {item.productDetail.product.name}
              </Typography>
            </Box>
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
                  {item.productDetail.sellingPrice.toLocaleString()} VND
                </Typography>
                <Typography sx={{ ml: 2, color: 'text.disabled', textDecoration: 'line-through' }}>40000</Typography>
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

                <Grid item xs={6}>
                  <Typography sx={{ color: 'text.secondary' }}>Màu</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{item.color.name}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography sx={{ color: 'text.secondary' }}>Size</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{item.size.name}</Typography>
                </Grid>
              </Grid>

              {/* Total Price */}
              <Box sx={{ textAlign: 'right', pt: 1 }}>
                <Typography sx={{ fontWeight: 500, fontSize: '1.1rem' }}>
                  {(item.productDetail.sellingPrice * item.quantity).toLocaleString()} VND
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>
      ))}
    </List>
  );
}

export default CartItem;
