import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { formatPrice, imageMainColor } from 'utils';

BillDetail.propTypes = {
  billDetail: PropTypes.array.isRequired,
};

function BillDetail({ billDetail }) {
  return (
    <Grid container spacing={3}>
      {billDetail.map((item) => {
        const productDetail = item.productDetail;
        return (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ maxWidth: 345, boxShadow: 3, borderRadius: 2 }}>
              <img
                src={imageMainColor(productDetail)?.name}
                alt={productDetail.product.name}
                style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
              />
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {productDetail.product.name}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1">
                    <strong>Giá:</strong> {formatPrice(productDetail.sellingPrice)}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Số lượng:</strong> {item.quantity}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Tổng tiền:</strong> {formatPrice(productDetail.sellingPrice * item.quantity)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default BillDetail;
