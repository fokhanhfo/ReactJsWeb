import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Checkbox, Divider, FormControlLabel, Paper, Typography } from '@mui/material';
import styled from 'styled-components';
import { formatPrice } from 'utils';
import { Link } from 'react-router-dom';

PayCart.propTypes = {
  listCart: PropTypes.array.isRequired,
  onAllCheckboxChange: PropTypes.func.isRequired,
  setOpen: PropTypes.func,
};

function PayCart({ listCart = [], onAllCheckboxChange, setOpen }) {
  const selectCartItem = listCart.filter((item) => item.status === 1);
  const totalPrice = selectCartItem.reduce((sum, item) => sum + item.productDetail.sellingPrice * item.quantity, 0);
  const [statusCheckBox, setStatusCheckBox] = useState(1);

  const handleCheckboxChange = (event) => {
    const newStatus = event.target.checked ? 1 : 0;
    setStatusCheckBox(newStatus);
    onAllCheckboxChange(newStatus);
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
        <Button variant="outlined" color="error" size="small" sx={{ minWidth: '60px' }}>
          Xóa
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
          component={Link}
          to="/checkout"
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => setOpen(false)}
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
