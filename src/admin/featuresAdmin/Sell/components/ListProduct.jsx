import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Typography, Card, CardMedia, CardContent, IconButton } from '@mui/material';
import { THUMBNAIL_PLACEHOLDER } from 'constants';
import { calculateDiscount, formatPrice, imageMainProduct } from 'utils';
import { useCart } from '../CartContext';
import AddIcon from '@mui/icons-material/Add';
import ProductDetail from './ProductDetail';
import { discountStatus } from 'enum/discountStatus';

ListProduct.propTypes = {
  products: PropTypes.array.isRequired,
};

function ListProduct({ products }) {
  const { addToCart } = useCart();
  const [isDiaLog, setIsDiaLog] = useState(false);
  const [product, setProduct] = useState();

  const handIsChoise = () => setIsDiaLog(!isDiaLog);

  return (
    <Box sx={{ overflowY: 'auto', padding: 1.5 }}>
      <Grid container spacing={1.5}>
        {products?.map((product) => {
          const image = imageMainProduct(product.productDetails);
          const sellingPrice = product.sellingPrice;

          const { percentageValue, finalPrice } = calculateDiscount(product, product.productDiscountPeriods);
          return (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  '&:hover': { boxShadow: 10 },
                  transition: '0.3s',
                  borderRadius: 1.5,
                  position: 'relative',
                }}
              >
                <CardMedia
                  component="img"
                  image={image ? image.imageUrl : THUMBNAIL_PLACEHOLDER}
                  alt={product.name}
                  sx={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    objectFit: 'cover',
                    borderRadius: 2,
                    position: 'relative',
                  }}
                />
                {percentageValue && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
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

                {/* Dấu cộng để thêm sản phẩm */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                  onClick={() =>
                    // addToCart(product)
                    {
                      setProduct(product);
                      setIsDiaLog(!isDiaLog);
                    }
                  }
                >
                  <IconButton size="small">
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
                <CardContent sx={{ padding: 1.5 }}>
                  <Typography variant="body1" fontWeight={600} noWrap>
                    {product.name}
                  </Typography>
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
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      {isDiaLog && <ProductDetail isChoise={isDiaLog} onSubmit={handIsChoise} product={product} />}
    </Box>
  );
}

export default ListProduct;
