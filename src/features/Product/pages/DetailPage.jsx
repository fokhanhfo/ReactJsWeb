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
} from '@mui/material';
import ProductThumbnail from '../components/ProductThumbnail';
import { useMatch } from 'react-router-dom';
import useProductDetail from '../hooks/useProductDetail';
import ProductInfo from '../components/ProductInfo';
import Banner from 'components/Banner/Banner';
import { useState } from 'react';

function DetailPage() {
  const match = useMatch('/products/:productId');
  const productId = match ? match.params.productId : null;

  const { product, loading } = useProductDetail(productId);

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
          <Grid container spacing={3}>
            {suggestedProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="body1" fontWeight="bold" sx={{ textAlign: 'center' }}>
                      {product.name}
                    </Typography>
                    <Box sx={{ textAlign: 'center', mt: 1 }}>
                      {product.oldPrice && (
                        <Typography variant="body2" sx={{ textDecoration: 'line-through', color: '#888', mr: 1 }}>
                          {product.oldPrice.toLocaleString('vi-VN')}đ
                        </Typography>
                      )}
                      {product.discount && (
                        <Typography
                          variant="body2"
                          sx={{
                            display: 'inline-block',
                            backgroundColor: '#000',
                            color: '#fff',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                          }}
                        >
                          {product.discount}
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ textAlign: 'center', color: '#007bff', mt: 1 }}>
                      {product.price.toLocaleString('vi-VN')}đ
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center' }}>
                    <Button variant="contained" color="primary" size="small">
                      Xem chi tiết
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default DetailPage;
