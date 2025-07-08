import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  Paper,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import CartItem from 'features/Cart/components/CartItem';
import Loading from 'components/Loading';
import styled from 'styled-components';
import { calculateDiscount, formatPrice, handleGlobalError } from 'utils';
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
import ConfirmDialog from 'components/ConfirmDialog/ConfirmDialog';
import { useFormContext } from 'react-hook-form';
import userApi from 'api/userApi';
import { useGetMyInfoQuery } from 'hookApi/userApi';
import OtpInputDialog from 'features/Auth/Components/Register/OtpInput';

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
  const cartData = cartQuery?.data?.data;
  const [updateCart] = useUpdateCartMutation();
  const { enqueueSnackbar } = useSnackbar();
  const { refetch } = useGetCartQuery();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoadingConfirm, setIsLoadingConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, trigger } = useFormContext();
  const { payMethod, setPayMethod } = useContext(CheckoutContext);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const { data: dataUser, error, isLoading: isLoadingUser } = useGetMyInfoQuery();
  const handleIncrement = async (cartItem) => {
    const newQuantity = { ...cartItem, quantity: cartItem.quantity + 1, product: cartItem.productDetail.product.id };
    try {
      await updateCart(newQuantity).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDecrement = async (cartItem) => {
    if (cartItem.quantity > 1) {
      const newQuantity = { ...cartItem, quantity: cartItem.quantity - 1, product: cartItem.productDetail.product.id };
      try {
        await updateCart(newQuantity).unwrap();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const { discountFreeShip, voucherProduct, moneyToPay, valueVoucherProduct, valueDiscountFreeShip } =
    useContext(CheckoutContext);

  const { shipDetail } = useContext(CheckoutContext);

  const handleSubmitAddCart = async (otp) => {
    const listIdVoucher = [voucherProduct?.id, discountFreeShip?.id].filter((id) => id !== undefined);
    console.log(listIdVoucher);
    console.log(voucherProduct);
    console.log(discountFreeShip);

    setIsLoading(true);
    try {
      const newdata = {
        fullName: shipDetail.recipientName,
        address: shipDetail.addressDetail,
        phone: shipDetail.phone,
        cartRequests: cartData
          .filter((item) => item.status === 1)
          .map((item) => {
            const { percentageValue, finalPrice } = calculateDiscount(
              item.productDetail.product,
              item.productDetail.product.productDiscountPeriods,
            );

            return {
              ...item,
              discountPrice: finalPrice,
            };
          }),
        total_price: moneyToPay,
        discountId: listIdVoucher,
        paymentMethod: form.getValues('paymentMethod'),
        discountShip: valueDiscountFreeShip,
        discountUser: valueVoucherProduct,
        otp: otp,
      };

      const res = await billApi.add(newdata);
      enqueueSnackbar(`Mua hàng thành công`, { variant: 'success' });
      setShowOtpForm(false);
      if (res) {
        refetch();
        navigate('/user/bill/all');
        window.scrollTo({
          top: 150,
          behavior: 'smooth',
        });
      }
    } catch (error) {
      console.error('Error during order submission:', error);
      enqueueSnackbar(error?.response?.data?.message || `Mua hàng thất bại`, { variant: 'error' });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    setIsLoadingConfirm(true);
    try {
      const response = await userApi.resendOtp(dataUser?.data?.email, 'ORDER');
      enqueueSnackbar(response.message, {
        variant: 'success',
        autoHideDuration: 6000,
      });

      setIsDialogOpen(false);
      setShowOtpForm(true);
    } catch (error) {
      enqueueSnackbar('Gửi lại mã OTP thất bại', { variant: 'error' });
    } finally {
      setIsLoadingConfirm(false);
    }
  };

  const handleValidateAndSubmit = async (otp) => {
    const isValid = await trigger();

    if (!isValid) {
      enqueueSnackbar('Vui lòng kiểm tra lại thông tin đơn hàng.', { variant: 'error' });
      setIsDialogOpen(false);
      return;
    }

    await handleSubmit(handleSubmitAddCart(otp));
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  const handleContinueShopping = () => {
    navigate('/home');
  };

  const handleOtpComplete = async (otp) => {
    await handleValidateAndSubmit(otp);
  };

  const handleOtpResend = async () => {
    await handleConfirm();
  };

  return (
    <>
      {cartData ? (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
          <Grid container sx={{ flex: 1 }}>
            {cartData
              .filter((item) => item.status === 1)
              .map((item, index) => {
                const sellingPrice = item.productDetail.product.sellingPrice;
                const { percentageValue, finalPrice } = calculateDiscount(
                  item.productDetail.product,
                  item.productDetail.product.productDiscountPeriods,
                );
                return (
                  <Grid item md={6} key={index} sx={index % 2 != 0 ? { borderLeft: '1px solid #ccc', pl: 2 } : null}>
                    <Container>
                      <Box sx={{ display: 'flex', justifyContent: 'end', margin: '10px 10px 0 0' }}>
                        <IconButton size="small" sx={{ p: 0 }}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 3 }}>
                        {/* Product Image */}
                        <Box sx={{ width: '33%', position: 'relative' }}>
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
                          {percentageValue && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 5,
                                left: 5,
                                backgroundColor: 'red',
                                color: 'white',
                                px: 1,
                                py: 0.5,
                                fontSize: '12px',
                                borderRadius: '4px',
                                fontWeight: 'bold',
                              }}
                            >
                              -{percentageValue}%
                            </Box>
                          )}
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
                              {percentageValue
                                ? finalPrice.toLocaleString()
                                : item.productDetail.product.sellingPrice.toLocaleString()}{' '}
                              đ
                            </Typography>
                            <Typography sx={{ ml: 2, color: 'text.disabled', textDecoration: 'line-through' }}>
                              {percentageValue && <>{item.productDetail.product.sellingPrice.toLocaleString()} đ</>}
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
                                {(percentageValue
                                  ? finalPrice
                                  : item.productDetail.product.sellingPrice * item.quantity
                                ).toLocaleString()}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                    </Container>
                  </Grid>
                );
              })}
          </Grid>

          {/* <Divider sx={{ marginY: 2 }} /> */}

          <Grid container>
            <Grid item md={6}></Grid>
            <Grid item md={6}>
              <PayCheckout setIsDialogOpen={setIsDialogOpen} cartQuery={cartQuery}></PayCheckout>
            </Grid>
          </Grid>
          <ConfirmDialog
            isOpen={isDialogOpen}
            title="Xác nhận"
            message="Xác nhận mua hàng?"
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            isLoading={isLoadingConfirm}
            dialogType="info"
          />
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Giỏ hàng của bạn đang trống
            </Typography>
            <Button variant="contained" color="primary" onClick={handleContinueShopping}>
              Tiếp tục mua sắm
            </Button>
          </Box>
        </Box>
      )}

      <OtpInputDialog
        email={dataUser?.data?.email}
        open={showOtpForm}
        onClose={() => setShowOtpForm(false)}
        onSubmit={handleOtpComplete}
        onResend={handleOtpResend}
        isLoading={isLoading}
        // isResendLoading={loadingStates.resendOtp}
      />
    </>
  );
}

export default ListProdcut;
