import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { formatPrice } from 'utils';

billDetail.propTypes = {
    billDetail: PropTypes.array.isRequired,
};

function billDetail({ billDetail }) {
    return (
        <Grid container spacing={3}>
            {billDetail.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <Card sx={{ maxWidth: 345 }}>
                        <CardMedia
                            component="img"
                            height="140"
                            image={item.productId.imagesUrl[0]} // Display the first image
                            alt={item.productId.name}
                        />
                        <CardContent>
                            <Typography variant="h6" component="div" gutterBottom>
                                {item.productId.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {item.productId.detail}
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body1">
                                    <strong>Giá:</strong> {formatPrice(item.productId.price)}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Số lượng:</strong> {item.quantity}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Tổng tiền:</strong> {formatPrice(item.productId.price * item.quantity)}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

export default billDetail;
