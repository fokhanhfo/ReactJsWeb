import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  List,
  ListItem,
  IconButton,
  Card,
  CardContent,
  Divider,
  Button,
  Paper,
  Chip,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import { useCart } from '../CartContext';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';
import { useDispatch } from 'react-redux';
import PayOrder from './PayOrder';
import { useSnackbar } from 'notistack';
import ConfirmDialog from 'components/ConfirmDialog/ConfirmDialog';
import { calculateDiscount, formatPrice } from 'utils';

OrdersTab.propTypes = {
  actionsState: PropTypes.object,
};

function OrdersTab({ actionsState }) {
  const { cart, setCart } = useCart();
  const dispatch = useDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [isProductDetail, setIsProductDetail] = useState(null);

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

  const handleRemoveProduct = (product) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.productDetail.id === product.productDetail.id &&
            item.color.name === product.color.name &&
            item.size === product.size
          ),
      ),
    );
  };

  const handleClickRemove = async (product) => {
    setIsDialogOpen(true);
    setIsProductDetail(product);
  };

  const handleActions = (state) => handleAction(state, dispatch, actionsState);

  const calculateTotalPrice = (selectCartItem) => {
    return selectCartItem.reduce((sum, item) => {
      const sellingPrice = item.productDetail.product.sellingPrice;
      const { percentageValue, finalPrice } = calculateDiscount(
        item.productDetail.product,
        item.productDiscountPeriods,
      );

      return sum + finalPrice * item.quantity;
    }, 0);
  };

  const totalPrice = calculateTotalPrice(cart);
  const handleRemove = (isProductDetail) => {
    handleRemoveProduct(isProductDetail);
    setIsDialogOpen(false);
    enqueueSnackbar('Đã xóa sản phẩm chi tiết', { variant: 'success' });
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: 'black',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 2,
          gap: 1,
          py: 1,
          px: 2,
        }}
      >
        <ShoppingCartIcon fontSize="small" />
        <Typography variant="subtitle1" fontWeight={600}>
          Giỏ hàng ({cart.length})
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {cart.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4,
            }}
          >
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Your cart is empty
            </Typography>
          </Box>
        ) : (
          <List sx={{ flex: 1, overflow: 'auto', p: 1 }}>
            {cart.map((product, index) => {
              const sellingPrice = product.productDetail.product.sellingPrice;
              const { percentageValue, finalPrice } = calculateDiscount(
                product.productDetail.product,
                product.productDiscountPeriods,
              );
              return (
                <ListItem key={index} sx={{ p: 0, mb: 1 }}>
                  <Card
                    sx={{
                      width: '100%',
                      border: '1px solid #f0f0f0',
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        {/* Product Image */}
                        <Paper
                          component="img"
                          src={
                            product.productDetail.image.length > 0
                              ? product.productDetail.image[0].imageUrl
                              : 'https://via.placeholder.com/80'
                          }
                          alt={product.productDetail.product.name}
                          sx={{
                            width: 80,
                            height: 80,
                            objectFit: 'cover',
                            borderRadius: 1,
                            border: '1px solid #f0f0f0',
                          }}
                        />

                        {/* Product Details */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          {/* Product Name & Delete */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography
                              variant="subtitle2"
                              fontWeight="600"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flex: 1,
                                mr: 1,
                              }}
                            >
                              {product.productDetail.product.name}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleClickRemove(product)}
                              sx={{
                                p: 0.5,
                                '&:hover': {
                                  bgcolor: 'error.light',
                                  color: 'white',
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>

                          {/* Price */}
                          {percentageValue ? (
                            <Box display={'flex'} gap={1}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: 'red',
                                }}
                              >
                                {formatPrice(finalPrice)}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 400,
                                  textDecoration: 'line-through',
                                  color: 'gray',
                                }}
                              >
                                {formatPrice(sellingPrice)}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 400,
                              }}
                            >
                              {formatPrice(sellingPrice)}
                            </Typography>
                          )}

                          {/* Product Attributes */}
                          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                            <Chip
                              label={product.color.name}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: '0.75rem',
                                height: 24,
                                borderColor: 'black',
                                color: 'black',
                              }}
                            />
                            <Chip
                              label={`Size ${product.size}`}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: '0.75rem',
                                height: 24,
                                borderColor: 'black',
                                color: 'black',
                              }}
                            />
                          </Stack>

                          {/* Quantity Controls & Total */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleDecreaseQuantity(product)}
                                sx={{
                                  border: '1px solid black',
                                  borderRadius: '50%',
                                  width: 28,
                                  height: 28,
                                  '&:hover': { bgcolor: 'black', color: 'white' },
                                }}
                              >
                                <RemoveIcon sx={{ fontSize: 14 }} />
                              </IconButton>

                              <Typography
                                variant="body2"
                                fontWeight="600"
                                sx={{
                                  minWidth: 24,
                                  textAlign: 'center',
                                  bgcolor: '#f5f5f5',
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: 1,
                                }}
                              >
                                {product.quantity}
                              </Typography>

                              <IconButton
                                size="small"
                                onClick={() => handleIncreaseQuantity(product)}
                                sx={{
                                  border: '1px solid black',
                                  borderRadius: '50%',
                                  width: 28,
                                  height: 28,
                                  '&:hover': { bgcolor: 'black', color: 'white' },
                                }}
                              >
                                <AddIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            </Box>

                            <Typography sx={{ fontWeight: 500, fontSize: '1.1rem' }}>
                              {(percentageValue
                                ? finalPrice
                                : product.productDetail.product.sellingPrice * product.quantity
                              ).toLocaleString()}{' '}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>

      {/* Footer */}
      {cart.length > 0 && (
        <>
          <Divider />
          <Box sx={{ p: 2, bgcolor: '#fafafa' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="700">
                Tổng tiền
              </Typography>
              <Typography variant="h5" fontWeight="700" color="black">
                {totalPrice.toLocaleString()} VND
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<PaymentIcon />}
              onClick={() => handleActions('view')}
              sx={{
                bgcolor: 'black',
                color: 'white',
                fontWeight: '600',
                py: 1.5,
                '&:hover': {
                  bgcolor: '#333',
                },
              }}
            >
              Thanh toán
            </Button>
          </Box>
        </>
      )}

      <PayOrder cart={cart} totalPrice={totalPrice} actionsState={actionsState} />
      <ConfirmDialog
        isOpen={isDialogOpen}
        title="Xác nhận"
        message="Bạn có chắc chắn muốn thực hiện hành động này không?"
        onConfirm={() => handleRemove(isProductDetail)}
        onCancel={handleCancel}
        dialogType="info"
      />
    </Box>
  );
}

export default OrdersTab;
