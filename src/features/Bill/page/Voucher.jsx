import React from 'react';
import { Box, Typography, TextField, Button, Tabs, Tab, Grid, Card, CardContent, CardActions } from '@mui/material';
import { useGetDiscountsByUserIdQuery } from 'hookApi/discountUserApi';
import { formatPrice } from 'utils';
import dayjs from 'dayjs';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useNavigate } from 'react-router-dom';

function Voucher() {
  const { data, isLoading, error, refetch } = useGetDiscountsByUserIdQuery({ isUsed: false });
  const listDiscount = data?.data || [];
  const listDiscountFreeShip = listDiscount.filter((voucher) => voucher.discount.category === 2);
  const listDiscountProduct = listDiscount.filter((voucher) => voucher.discount.category === 1);
  const navigate = useNavigate();

  if (listDiscount.length === 0) {
    return (
      <Box
        sx={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      >
        <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: '16px' }}>
          Kho Voucher
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Hiện tại bạn không có voucher nào.
        </Typography>
      </Box>
    );
  }

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

      <Grid container spacing={2}>
        {/* Phần mã giảm giá vận chuyển */}
        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary">
            Mã giảm giá vận chuyển
          </Typography>
        </Grid>
        {listDiscountFreeShip.length > 0 ? (
          listDiscountFreeShip.map((discount) => {
            const voucher = discount.discount;
            return (
              <Grid item xs={12} sm={6} md={4} key={voucher.id}>
                <Card
                  sx={{
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #f57c00',
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" color="error" sx={{ marginBottom: '8px' }}>
                      {voucher.discountName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '8px' }}>
                      Giảm tối đa {formatPrice(voucher.maxValue)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ marginTop: '8px' }}>
                      Có hiệu lực tới: {dayjs(voucher.endTime).format('DD/MM/YYYY')}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button variant="outlined" color="error" fullWidth onClick={() => navigate('/products')}>
                      Dùng Sau
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" justifyContent="center" p={2} bgcolor="#f5f5f5" borderRadius={2}>
              <InfoOutlinedIcon sx={{ color: 'text.secondary', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Không có mã giảm giá vận chuyển
              </Typography>
            </Box>
          </Grid>
        )}

        {/* Phần mã giảm giá sản phẩm */}
        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary">
            Mã giảm giá sản phẩm
          </Typography>
        </Grid>
        {listDiscountProduct.length > 0 ? (
          listDiscountProduct.map((discount) => {
            const voucher = discount.discount;
            return (
              <Grid item xs={12} sm={6} md={4} key={voucher.id}>
                <Card
                  sx={{
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #1976d2',
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" color="error" sx={{ marginBottom: '8px' }}>
                      {voucher.discountName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '8px' }}>
                      Giảm tối đa {formatPrice(voucher.maxValue)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ marginTop: '8px' }}>
                      Có hiệu lực tới: {dayjs(voucher.endTime).format('DD/MM/YYYY')}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button variant="outlined" color="error" fullWidth onClick={() => navigate('/products')}>
                      Dùng Sau
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" justifyContent="center" p={2} bgcolor="#f5f5f5" borderRadius={2}>
              <InfoOutlinedIcon sx={{ color: 'text.secondary', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Không có mã giảm giá sản phẩm
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default Voucher;
