import React from 'react';
import { Box, Typography, TextField, Button, Tabs, Tab, Grid, Card, CardContent, CardActions } from '@mui/material';
import { useGetDiscountsByUserIdQuery } from 'hookApi/discountUserApi';

function Voucher() {
  const { data, isLoading, error, refetch } = useGetDiscountsByUserIdQuery({ isUsed: false });
  const listDiscount = data?.data || [];

  return (
    <Box sx={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      {/* Tiêu đề */}
      <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: '16px' }}>
        Kho Voucher
      </Typography>

      {/* Tìm kiếm mã voucher */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: '16px' }}>
        <TextField
          placeholder="Nhập mã voucher tại đây"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ backgroundColor: '#f5f5f5', borderRadius: '4px' }}
        />
        <Button variant="contained" color="error">
          Lưu
        </Button>
      </Box>

      {/* Tabs */}
      {/* <Tabs value={0} textColor="primary" indicatorColor="primary" sx={{ marginBottom: '16px' }}>
        <Tab label="Tất Cả (1174)" />
        <Tab label="Shopee (1160)" />
        <Tab label="Shop (1)" />
        <Tab label="Nạp thẻ & Dịch vụ (11)" />
        <Tab label="Scan & Pay (0)" />
        <Tab label="Dịch vụ Tài chính (2)" />
        <Tab label="More" />
      </Tabs> */}

      {/* Danh sách voucher */}
      <Grid container spacing={2}>
        {listDiscount.map((discount) => {
          const voucher = discount.discount;
          return (
            <Grid item xs={12} sm={6} md={4} key={voucher.id}>
              <Card sx={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" color="error" sx={{ marginBottom: '8px' }}>
                    {voucher.discountName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '8px' }}>
                    Giảm tối đa {voucher.maxValue}
                  </Typography>
                  {/* <Typography variant="body2" color="text.secondary">
                  {voucher.type}
                </Typography> */}
                  <Typography variant="body2" color="text.secondary" sx={{ marginTop: '8px' }}>
                    Có hiệu lực tới: {voucher.endTime}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant="outlined" color="error" fullWidth>
                    Dùng Sau
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default Voucher;
