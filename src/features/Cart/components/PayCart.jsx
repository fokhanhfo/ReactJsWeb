import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Checkbox, CircularProgress, Divider, FormControlLabel, Paper, Typography } from '@mui/material';
import styled from 'styled-components';
import { calculateDiscount, formatPrice } from 'utils';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { cartApi, useDeleteAllMutation } from 'hookApi/cartApi';

PayCart.propTypes = {
  listCart: PropTypes.array.isRequired,
  onAllCheckboxChange: PropTypes.func.isRequired,
  setOpen: PropTypes.func,
};

function PayCart({ listCart = [], onAllCheckboxChange, setOpen }) {
  const { enqueueSnackbar } = useSnackbar();
  const [deleteAll, { isLoading, isSuccess, isError, error, data }] = useDeleteAllMutation();
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

  const [statusCheckBox, setStatusCheckBox] = useState(1);

  const handleCheckboxChange = (event) => {
    const newStatus = event.target.checked ? 1 : 0;
    setStatusCheckBox(newStatus);
    onAllCheckboxChange(newStatus);
  };

  const handleDeleteAll = async () => {
    if (statusCheckBox !== 1) {
      enqueueSnackbar('Vui lòng chọn tất cả sản phẩm trước khi xóa.', { variant: 'warning' });
      return;
    }

    try {
      await deleteAll().unwrap();
      enqueueSnackbar('Xóa toàn bộ giỏ hàng thành công!', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('Lỗi khi xóa toàn bộ giỏ hàng!', { variant: 'error' });
      console.error('Lỗi khi xóa toàn bộ giỏ hàng:', err);
    }
  };

  useEffect(() => {
    const allChecked = listCart.every((item) => item.status === 1);
    setStatusCheckBox(allChecked ? 1 : 0);
  }, [listCart]);

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <FormControlLabel
          control={<Checkbox checked={statusCheckBox === 1} onChange={handleCheckboxChange} color="primary" />}
          label={
            <Typography variant="body2" fontWeight="medium">
              Chọn tất cả
            </Typography>
          }
        />
        <Button
          variant="outlined"
          color="error"
          size="small"
          sx={{ minWidth: '100px', position: 'relative' }}
          onClick={handleDeleteAll}
          disabled={isLoading || statusCheckBox !== 1}
        >
          {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Xóa tất cả'}
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mt: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Tổng ({selectCartItem.length} sản phẩm):
          </Typography>
          <Typography variant="h6" color="primary" fontWeight="bold">
            {formatPrice(totalPrice)}
          </Typography>
        </Box>

        <Button
          component={selectCartItem.length > 0 ? Link : 'button'}
          to={selectCartItem.length > 0 ? '/checkout' : undefined}
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => {
            if (selectCartItem.length === 0) {
              enqueueSnackbar('Vui lòng chọn ít nhất một sản phẩm để thanh toán.', { variant: 'warning' });
            } else {
              setOpen(false); // Đóng giỏ hàng nếu cần
            }
          }}
          sx={{
            mt: 2,
            py: 1,
            textTransform: 'none',
            fontWeight: 'bold',
          }}
        >
          Thanh Toán
        </Button>
      </Box>
    </Paper>
  );
}

export default PayCart;
