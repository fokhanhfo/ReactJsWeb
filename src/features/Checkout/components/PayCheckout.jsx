'use client';

import { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { calculateDiscount, formatPrice } from 'utils';
import { CheckoutContext } from './CheckoutProvider';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Dialog,
  Divider,
  Drawer,
  Grid,
  InputBase,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp, LocalOffer } from '@mui/icons-material';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useGetDiscountsByUserIdQuery } from 'hookApi/discountUserApi';
import { useSnackbar } from 'notistack';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

PayCheckout.propTypes = {
  cartQuery: PropTypes.object.isRequired,
  setIsDialogOpen: PropTypes.func,
};

function PayCheckout({ cartQuery, setIsDialogOpen }) {
  const theme = useTheme();
  const [voucherOpen, setVoucherOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');

  const listCart = cartQuery.data.data || [];
  const selectCartItem = listCart.filter((item) => item.status === 1);
  const calculateTotalPrice = (selectCartItem) => {
    return selectCartItem.reduce((sum, item) => {
      const { percentageValue, finalPrice } = calculateDiscount(
        item.productDetail.product,
        item.productDetail.product.productDiscountPeriods,
      );
      return sum + finalPrice * item.quantity;
    }, 0);
  };

  const totalPrice = calculateTotalPrice(selectCartItem);
  const { moneyToPay, setmoneyToPay } = useContext(CheckoutContext);
  const { data, isLoading, error, refetch } = useGetDiscountsByUserIdQuery();
  const listDiscount = data?.data || [];
  const listDiscountFreeShip = listDiscount.filter((voucher) => voucher.discount.category === 2);
  const listDiscountProduct = listDiscount.filter((voucher) => voucher.discount.category === 1);
  const { voucherProduct, setvoucherProduct } = useContext(CheckoutContext);
  const { discountFreeShip, setDiscountFreeShip } = useContext(CheckoutContext);
  const [selectedVoucherProduct, setSelectedVoucherProduct] = useState(null);
  const [selectedFreeShipVoucher, setSelectedFreeShipVoucher] = useState(null);
  const { valueVoucherProduct, setValueVoucherProduct } = useContext(CheckoutContext);
  const { valueDiscountFreeShip, setValueDiscountFreeShip } = useContext(CheckoutContext);
  const { enqueueSnackbar } = useSnackbar();

  // const handleCompleteOrder = async () => {
  //   const cartRequests = cartQuery.data.data
  //     .filter((element) => element.status === 1)
  //     .map((item) => {
  //       const size = item.productDetail.productDetailSizes.find((i) => i.size.name === item.size);
  //       return {
  //         quantity: item.quantity,
  //         size,
  //         color: item.color,
  //         productDetail: item.productDetail,
  //       };
  //     });

  //   const newValue = {
  //     email: shipDetail.email,
  //     address: `${shipDetail.addressDetail} ${shipDetail.commune} ${shipDetail.district} ${shipDetail.city}`,
  //     phone: shipDetail.phone,
  //     cartRequests: cartRequests,
  //   };

  //   if (onSubmit) {
  //     onSubmit(newValue);
  //   }
  // };

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const discountType = (discount) => {
    const voucher = discount?.discount;
    return (
      <Grid item xs={12} sm={6} key={voucher.id} sx={{ cursor: 'pointer' }}>
        <Paper
          elevation={2}
          sx={{
            position: 'relative',
            borderRadius: 3,
            border: '1.5px dashed #000',
            backgroundColor: '#121212',
            overflow: 'hidden',
            boxShadow: '0 3px 12px rgba(0,0,0,0.5)',
            fontFamily: 'Roboto, sans-serif',
            width: '100%',
            transform:
              selectedVoucherProduct?.id === voucher.id || selectedFreeShipVoucher?.id === voucher.id
                ? 'scale(1.02)'
                : 'scale(1)',
            boxShadow:
              selectedVoucherProduct?.id === voucher.id || selectedFreeShipVoucher?.id === voucher.id
                ? '0 6px 16px rgba(76, 175, 80, 0.5)'
                : '0 3px 12px rgba(0,0,0,0.5)',
            border:
              selectedVoucherProduct?.id === voucher.id || selectedFreeShipVoucher?.id === voucher.id
                ? '2px solid #4caf50'
                : '1.5px dashed #000',
          }}
          onClick={() => {
            if (voucher.category === 1) {
              setSelectedVoucherProduct(selectedVoucherProduct?.id === voucher.id ? null : voucher);
            } else {
              setSelectedFreeShipVoucher(selectedFreeShipVoucher?.id === voucher.id ? null : voucher);
            }
          }}
        >
          {(selectedVoucherProduct?.id === voucher.id || selectedFreeShipVoucher?.id === voucher.id) && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: '#4caf50',
                color: '#fff',
                borderRadius: '50%',
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                zIndex: 1,
              }}
            >
              ✓
            </Box>
          )}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              py: 1.5,
              px: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h5"
                sx={{
                  color: '#fff',
                  fontWeight: 'bolder',
                  lineHeight: 1,
                }}
              >
                {voucher.value || '40.000Đ'}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#ccc',
                  mt: 0.3,
                  fontWeight: 500,
                  fontSize: '0.75rem',
                }}
              >
                {voucher.discountName || 'Giảm cho đơn từ 699K'}
              </Typography>
            </Box>

            <Box
              sx={{
                bgcolor: '#fff',
                borderRadius: 1.5,
                px: 1.5,
                py: 0.7,
                textAlign: 'center',
                ml: 1.5,
                minWidth: 75,
              }}
            >
              <Typography
                variant="overline"
                sx={{
                  color: '#000',
                  fontWeight: 'bold',
                  display: 'block',
                  fontSize: '0.65rem',
                  letterSpacing: 1,
                }}
              >
                MÃ ƯU ĐÃI
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#000',
                  fontWeight: '900',
                  lineHeight: 1.1,
                  mt: 0.1,
                }}
              >
                {voucher.discountCode || 'VIETNAMS2'}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              bgcolor: 'rgba(255,255,255,0.1)',
              p: 1,
              borderTop: '1.5px dashed rgba(255,255,255,0.3)',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: '#eee',
                display: 'block',
                textAlign: 'center',
                fontWeight: 500,
                fontSize: '0.7rem',
              }}
            >
              {voucher.expiry || 'Áp dụng đến 31/12/2024 • Không áp dụng tích điểm'}
            </Typography>
          </Box>
        </Paper>
      </Grid>
    );
  };

  const discountVoucher =
    voucherProduct && totalPrice >= voucherProduct?.discountCondition
      ? voucherProduct.type === 1
        ? totalPrice * (voucherProduct.value / 100) < voucherProduct.maxValue
          ? totalPrice * (voucherProduct.value / 100)
          : voucherProduct.maxValue
        : voucherProduct.value
      : 0;

  const discountShip = discountFreeShip
    ? discountFreeShip.type === 1
      ? 30000 * (discountFreeShip.value / 100) < discountFreeShip.maxValue
        ? 30000 * (discountFreeShip.value / 100)
        : discountFreeShip.maxValue
      : discountFreeShip.value
    : 0;

  useEffect(() => {
    setmoneyToPay(totalPrice + 30000 - (discountShip + discountVoucher));
  }, [totalPrice, discountVoucher, discountShip]);

  return (
    <Box>
      <CardContent sx={{ p: 0 }}>
        {/* Voucher Section */}
        <Box sx={{ p: 2, bgcolor: theme.palette.grey[50] }}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            startIcon={<LocalOffer />}
            endIcon={voucherOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            onClick={() => setVoucherOpen(!voucherOpen)}
            sx={{ mb: 1, justifyContent: 'space-between' }}
          >
            Chọn mã giảm giá
          </Button>

          <Drawer
            anchor={isMobile ? 'bottom' : 'right'}
            open={voucherOpen}
            onClose={() => setVoucherOpen(false)}
            PaperProps={{
              sx: {
                borderTopLeftRadius: isMobile ? 16 : 0,
                borderTopRightRadius: isMobile ? 16 : 0,
                borderTop: isMobile ? '1px solid #ddd' : 'none',
                width: isMobile ? '100%' : 550,
                maxHeight: isMobile ? '80vh' : '100vh',
                overflow: 'hidden',
              },
            }}
            ModalProps={{
              keepMounted: true, // Giữ trạng thái drawer khi ẩn
            }}
          >
            <Box
              sx={{
                p: 3,
                maxHeight: isMobile ? '80vh' : '100vh',
                overflowY: 'auto',
                bgcolor: '#fff',
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              {/* Tiêu đề */}
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                VOUCHER CỦA BẠN
              </Typography>

              {/* Nhập mã giảm giá */}
              <Paper
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Nhập mã giảm giá"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                />
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <Button color="primary" sx={{ px: 3 }} variant="contained" disableElevation>
                  ÁP DỤNG
                </Button>
              </Paper>

              {/* Danh sách mã giảm giá */}
              <Box>
                {/* <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Danh sách voucher:
                </Typography> */}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Mã giảm giá vận chuyển
                    </Typography>
                  </Grid>
                  {Array.isArray(listDiscountFreeShip) && listDiscountFreeShip.length > 0 ? (
                    listDiscountFreeShip.map((voucher) => discountType(voucher))
                  ) : (
                    <Grid item xs={12}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        p={2}
                        bgcolor="#f5f5f5"
                        borderRadius={2}
                      >
                        <InfoOutlinedIcon sx={{ color: 'text.secondary', mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          Không có mã giảm giá vận chuyển
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Mã giảm giá sản phẩm
                    </Typography>
                  </Grid>
                  {Array.isArray(listDiscountProduct) && listDiscountProduct.length > 0 ? (
                    listDiscountProduct.map((voucher) => discountType(voucher))
                  ) : (
                    <Grid item xs={12}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        p={2}
                        bgcolor="#f5f5f5"
                        borderRadius={2}
                      >
                        <InfoOutlinedIcon sx={{ color: 'text.secondary', mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          Không có mã giảm giá sản phẩm
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>

              {/* Ghi chú */}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 2, display: 'block', textAlign: 'center' }}
              >
                Lưu ý: Nếu code của bạn không nằm trong danh sách trên thì vui lòng nhập code nhé.
              </Typography>
              <Box sx={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{
                    backgroundColor: 'black',
                    py: 1.5,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    borderRadius: 2,
                    textTransform: 'none',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                      backgroundColor: '#333',
                    },
                  }}
                  onClick={() => {
                    setvoucherProduct(selectedVoucherProduct);
                    setValueVoucherProduct(
                      selectedVoucherProduct && totalPrice >= selectedVoucherProduct?.discountCondition
                        ? selectedVoucherProduct.type === 1
                          ? totalPrice * (selectedVoucherProduct.value / 100) < selectedVoucherProduct.maxValue
                            ? totalPrice * (selectedVoucherProduct.value / 100)
                            : selectedVoucherProduct.maxValue
                          : selectedVoucherProduct.value
                        : 0,
                    );
                    setValueDiscountFreeShip(
                      selectedFreeShipVoucher
                        ? selectedFreeShipVoucher.type === 1
                          ? 30000 * (selectedFreeShipVoucher.value / 100) < selectedFreeShipVoucher.maxValue
                            ? 30000 * (selectedFreeShipVoucher.value / 100)
                            : selectedFreeShipVoucher.maxValue
                          : selectedFreeShipVoucher.value
                        : 0,
                    );
                    setDiscountFreeShip(selectedFreeShipVoucher);
                    setVoucherOpen(false);
                    enqueueSnackbar('Áp dụng thành công', { variant: 'success' });
                    console.log('Voucher applied:', {
                      product: selectedVoucherProduct,
                      freeship: selectedFreeShipVoucher,
                    });
                  }}
                >
                  Áp dụng
                </Button>
              </Box>
            </Box>
          </Drawer>
        </Box>

        <Divider />

        {/* Order Summary */}
        <Box sx={{ p: 2 }}>
          <Stack spacing={1.5}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Tổng đơn:
              </Typography>
              <Typography variant="body1">{formatPrice(totalPrice)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Ưu đãi (voucher / thành viên):
              </Typography>
              <Typography variant="body1" color="error.main">
                -{formatPrice(valueVoucherProduct)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Phí ship:
              </Typography>
              <Typography variant="body1">{formatPrice(30000)}</Typography>
            </Box>

            {discountFreeShip && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Giảm phí ship:
                </Typography>
                <Typography variant="body1">-{formatPrice(valueDiscountFreeShip)}</Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Thành tiền:
              </Typography>
              <Typography variant="body1">
                {formatPrice(totalPrice + 30000 - (discountShip + discountVoucher))}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Divider />

        {/* Total */}
        {/* <Box sx={{ p: 2, bgcolor: theme.palette.primary.main, color: 'white' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight="bold">
              THÀNH TIỀN:
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {formatPrice(totalPrice)}
            </Typography>
          </Box>
        </Box> */}

        {/* Complete Order Button */}
        <Button
          fullWidth
          size="large"
          onClick={() => setIsDialogOpen(true)}
          sx={{
            py: 1.5,
            borderRadius: 0,
            fontWeight: 'bold',
            fontSize: '1rem',
            backgroundColor: 'black',
            color: 'white',
            '&:hover': {
              backgroundColor: '#333',
            },
          }}
        >
          HOÀN TẤT ĐƠN HÀNG
        </Button>
      </CardContent>
    </Box>
  );
}

export default PayCheckout;
