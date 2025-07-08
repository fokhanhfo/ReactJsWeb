import {
  Box,
  Container,
  Grid,
  Paper,
  CircularProgress,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ProductThumbnail from '../components/ProductThumbnail';
import { Link, useMatch, useNavigate } from 'react-router-dom';
import useProductDetail from '../hooks/useProductDetail';
import ProductInfo from '../components/ProductInfo';
import Banner from 'components/Banner/Banner';
import { useState } from 'react';
import { useGetProductsQuery } from 'hookApi/productApi';
import { THUMBNAIL_PLACEHOLDER } from 'constants';
import { calculateDiscount, formatPrice, imageMainProduct } from 'utils';
import { Sort as SortIcon } from '@mui/icons-material';

function DetailPage() {
  const navigate = useNavigate();
  const match = useMatch('/products/:productId');
  const productId = match ? match.params.productId : null;

  const { product, loading } = useProductDetail(productId);

  const { data, error, isLoading } = useGetProductsQuery({ page: 1, limit: 20, category: product?.category?.id });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }
  const suggestedProducts = [
    {
      id: 1,
      name: 'SSSIGNATURE TEE',
      price: 299000,
      oldPrice: 369000,
      discount: '-18%',
      image: '/images/product1.jpg',
    },
    {
      id: 2,
      name: 'STAR TEE',
      price: 299000,
      oldPrice: 399000,
      discount: '-25%',
      image: '/images/product2.jpg',
    },
    {
      id: 3,
      name: 'THE COMMUTER POLO',
      price: 299000,
      oldPrice: 399000,
      discount: '-25%',
      image: '/images/product3.jpg',
    },
    {
      id: 4,
      name: 'GREAT LIFE TEE 2025 (FIT)',
      price: 299000,
      oldPrice: null,
      discount: null,
      image: '/images/product4.jpg',
    },
  ];

  return (
    <>
      <Banner />
      <Paper sx={{ boxShadow: 'none' }}>
        <Container maxWidth={false} sx={{ maxWidth: '1400px', padding: '20px' }}>
          <Grid container alignItems="flex-start" spacing={2}>
            <Grid item xs={12} md={5}>
              <ProductThumbnail product={product} sx={{ width: '100%' }} />
            </Grid>

            <Grid item xs={12} md={7}>
              <ProductInfo product={product} />
            </Grid>
          </Grid>
        </Container>
      </Paper>
      <Box sx={{ padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <Container maxWidth={false} sx={{ maxWidth: '1400px', padding: '20px' }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            sx={{
              color: '#333',
              borderBottom: '2px solid #007bff',
              display: 'inline-block',
              paddingBottom: '4px',
              marginBottom: '16px',
            }}
          >
            Mô tả sản phẩm
          </Typography>
          <Box
            sx={{
              maxHeight: isExpanded ? '1000px' : '72px', // Chiều cao tối đa khi mở rộng hoặc thu gọn
              overflow: 'hidden',
              transition: 'max-height 0.5s ease', // Hiệu ứng chuyển đổi mượt mà
            }}
          >
            <Typography
              dangerouslySetInnerHTML={{ __html: product.detail }}
              sx={{
                lineHeight: 1.8,
                fontSize: '1rem',
                color: '#555',
                textAlign: 'justify',
                wordWrap: 'break-word',
              }}
            />
          </Box>
          <Button
            onClick={handleToggle}
            sx={{
              marginTop: '8px',
              color: 'black',
              textTransform: 'none',
              fontWeight: 'bold',
            }}
          >
            {isExpanded ? 'Thu gọn' : 'Đọc thêm'}
          </Button>
        </Container>
      </Box>
      <Box sx={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', mt: 4 }}>
        <Container maxWidth={false} sx={{ maxWidth: '1400px', padding: '20px' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{
                color: '#333',
                borderBottom: '2px solid #007bff',
                display: 'inline-block',
                paddingBottom: '4px',
                marginBottom: '16px',
              }}
            >
              Gợi ý sản phẩm
            </Typography>
            <Button
              component={Link}
              to="../"
              variant="outlined"
              startIcon={<SortIcon />}
              sx={{
                borderRadius: 2,
                display: { xs: 'none', sm: 'flex' },
                textTransform: 'none',
              }}
            >
              Xem tất cả
            </Button>
          </Box>
          <Grid container spacing={3}>
            {data?.data?.products && data.data.products.length > 0 ? (
              data?.data?.products.map((product) => {
                const image = product.productDetails
                  .flatMap((productDetail) => productDetail.image)
                  .find((image) => image.mainProduct === true);

                const thumbnailUrl =
                  image?.imageUrl || imageMainProduct(product.productDetails)?.imageUrl || THUMBNAIL_PLACEHOLDER;
                const sellingPrice = product.sellingPrice;

                const { percentageValue, finalPrice } = calculateDiscount(product, product.productDiscountPeriods);
                return (
                  <Grid item xs={6} sm={6} md={4} lg={2.4} key={product.id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                        },
                        border: '1px solid #f0f0f0',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          '&:hover .slide-button': {
                            transform: 'translate(-50%, -50%)',
                            opacity: 1,
                            pointerEvents: 'auto',
                          },
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={thumbnailUrl}
                          alt={product.name}
                          sx={{
                            width: '100%',
                            aspectRatio: '1 / 1',
                            objectFit: 'cover',
                            position: 'relative',
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': {
                              transform: 'scale(1.05)',
                            },
                          }}
                        />
                        {percentageValue && (
                          <Chip
                            label={`-${percentageValue}%`}
                            sx={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                              backgroundColor: '#000',
                              color: '#fff',
                              fontWeight: 'bold',
                              fontSize: '0.75rem',
                            }}
                          />
                        )}
                        <Button
                          size="small"
                          onClick={() => {
                            window.scrollTo(0, 0);
                            navigate(`/products/${product.id}`);
                          }}
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, 100%)',
                            opacity: 0,
                            backgroundColor: '#fff',
                            color: 'black',
                            transition: 'transform 0.3s ease, opacity 0.3s ease',
                            textTransform: 'none',
                            pointerEvents: 'none',
                          }}
                          className="slide-button"
                        >
                          Xem chi tiết
                        </Button>
                      </Box>

                      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                        <Typography
                          variant="h6"
                          component="h3"
                          sx={{
                            fontWeight: 600,
                            textAlign: 'center',
                            mb: 2,
                            color: '#1a1a1a',
                            fontSize: '1rem',
                            lineHeight: 1.4,
                            minHeight: '2.8rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {product.name}
                        </Typography>

                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                          {percentageValue ? (
                            <>
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
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: 'red',
                                }}
                              >
                                {formatPrice(finalPrice)}
                              </Typography>
                            </>
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
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            ) : (
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: 'center',
                    mt: 5,
                    color: '#888',
                    fontWeight: 500,
                  }}
                >
                  Không có sản phẩm
                </Typography>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default DetailPage;
