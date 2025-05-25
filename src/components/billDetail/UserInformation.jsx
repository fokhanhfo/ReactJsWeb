import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Paper, Typography, Box, Divider } from '@mui/material';
import { formatDateTime, formatPrice } from 'utils';

UserInformation.propTypes = {
  bill: PropTypes.object.isRequired,
};

function UserInformation({ bill }) {
  console.log(bill);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Thông tin khách hàng
          </Typography>
          <Divider />
          <Typography variant="body1" sx={{ mt: 1 }}>
            <strong>Id khách hàng:</strong> {bill.user.id}
          </Typography>
          <Typography variant="body1">
            <strong>Tên khách hàng:</strong> {bill.user.fullName}
          </Typography>
          <Typography variant="body1">
            <strong>Số điện thoại:</strong> {bill.phone}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {bill.email}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Thông tin hóa đơn
          </Typography>
          <Divider />
          <Typography variant="body1" sx={{ mt: 1 }}>
            <strong>Id hóa đơn:</strong> {bill.id}
          </Typography>
          <Typography variant="body1">
            <strong>Địa chỉ:</strong> {bill.address}
          </Typography>
          <Typography variant="body1">
            <strong>Ngày tạo:</strong> {formatDateTime(bill.createdDate)}
          </Typography>
          <Typography variant="body1">
            <strong>Tổng tiền:</strong> {formatPrice(bill.total_price)}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}

export default UserInformation;
