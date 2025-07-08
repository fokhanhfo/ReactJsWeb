import React from 'react';
import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Chip,
  Rating,
  TextField,
  Paper,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  Stack,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingBag,
  LocalShipping,
  Security,
  Refresh,
  Star,
  Phone,
  Email,
  LocationOn,
  Facebook,
  Instagram,
  Twitter,
  Close,
} from '@mui/icons-material';
import { useGetProductsQuery } from 'hookApi/productApi';
import { calculateDiscount, formatPrice, imageMainProduct } from 'utils';
import { THUMBNAIL_PLACEHOLDER } from 'constants';
import { useNavigate } from 'react-router-dom';

function HoangHaiFashionApp() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.');
    setFormData({ name: '', email: '', message: '' });
  };

  const navItems = ['Trang chủ', 'Giới thiệu', 'Sản phẩm', 'Dịch vụ', 'Liên hệ'];
  const queryParams = {
    page: 1,
    limit: 4,
    status: 1,
  };
  const { data, error, isLoading, refetch } = useGetProductsQuery(queryParams);
  const products = [
    {
      title: 'Áo sơ mi cao cấp',
      price: '899.000đ',
      originalPrice: '1.200.000đ',
      rating: 4.8,
      image: '/placeholder.svg?height=300&width=250',
    },
    {
      title: 'Váy dạ hội sang trọng',
      price: '2.499.000đ',
      originalPrice: '3.000.000đ',
      rating: 4.9,
      image: '/placeholder.svg?height=300&width=250',
    },
    {
      title: 'Blazer công sở',
      price: '1.299.000đ',
      originalPrice: '1.800.000đ',
      rating: 4.7,
      image: '/placeholder.svg?height=300&width=250',
    },
    {
      title: 'Blazer công sở',
      price: '1.299.000đ',
      originalPrice: '1.800.000đ',
      rating: 4.7,
      image: '/placeholder.svg?height=300&width=250',
    },
  ];

  const services = [
    {
      icon: <LocalShipping sx={{ fontSize: 40, color: '#000000' }} />,
      title: 'Giao hàng nội thành',
      description: 'Hỗ trợ giao hàng nhanh trong khu vực Chương Mỹ và lân cận',
    },
    {
      icon: <Security sx={{ fontSize: 40, color: '#000000' }} />,
      title: 'Chất lượng đảm bảo',
      description: 'Sản phẩm chính hãng, kiểm tra kỹ trước khi giao',
    },
    {
      icon: <Refresh sx={{ fontSize: 40, color: '#000000' }} />,
      title: 'Đổi trả thuận tiện',
      description: 'Đổi trả trong 7 ngày nếu lỗi sản xuất',
    },
    {
      icon: <Star sx={{ fontSize: 40, color: '#000000' }} />,
      title: 'Hỗ trợ tận tâm',
      description: 'Tư vấn nhiệt tình, phục vụ khách hàng tận nơi',
    },
  ];

  const navigate = useNavigate();
  const handleClick = (id) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    navigate(`/products/${id}`);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'white', px: isMobile ? 2 : 0 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 50%, #ffffff 100%)',
          py: { xs: 8, md: 12 },
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: '1400px', padding: '20px 0' }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Chip
                  label="✨ Thời trang cao cấp"
                  sx={{
                    bgcolor: 'black',
                    color: 'white',
                    mb: 2,
                    fontWeight: 600,
                  }}
                />
                <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 'bold', mb: 2, color: 'black' }}>
                  Hoàng Hải
                  <Box component="span" sx={{ color: 'black', display: 'block' }}>
                    Fashion
                  </Box>
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, lineHeight: 1.6, color: 'text.secondary' }}>
                  Khám phá bộ sưu tập thời trang cao cấp với phong cách hiện đại, chất lượng vượt trội và dịch vụ tận
                  tâm. Nơi bạn tỏa sáng với phong cách riêng.
                </Typography>
              </Box>

              <Stack direction={isMobile ? 'column' : 'row'} spacing={2} sx={{ mb: 4 }}>
                <Button
                  onClick={() => {
                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth',
                    });
                    navigate(`/`);
                  }}
                  variant="contained"
                  size="large"
                  sx={{ py: 1.5, px: 4 }}
                >
                  Khám phá ngay
                </Button>
                <Button
                  onClick={() => {
                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth',
                    });
                    navigate(`/products`);
                  }}
                  variant="outlined"
                  size="large"
                  sx={{ py: 1.5, px: 4 }}
                >
                  Xem bộ sưu tập
                </Button>
              </Stack>

              <Grid container spacing={4} sx={{ textAlign: 'center' }}>
                <Grid item xs={4}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black' }}>
                    500+
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Khách hàng hài lòng
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black' }}>
                    100+
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sản phẩm đa dạng
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black' }}>
                    5⭐
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Xếp hạng trên Google
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  height: { xs: 300, md: 400 },
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.100',
                  border: '2px solid #e5e7eb',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    bgcolor: 'black',
                  },
                }}
              >
                <img
                  src="/imagesHome/sale.png"
                  alt="Hình ảnh thời trang"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'cover',
                    borderRadius: 'inherit',
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* About Section */}
      <Container maxWidth={false} sx={{ maxWidth: '1400px', padding: '20px 0' }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip
            label="Về chúng tôi"
            sx={{
              bgcolor: 'grey.100',
              color: 'black',
              mb: 2,
              fontWeight: 600,
              border: '1px solid #e5e7eb',
            }}
          />
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: 'black' }}>
            Câu chuyện của Hoàng Hải Fashion
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Với hơn 5 năm kinh nghiệm trong ngành thời trang, chúng tôi cam kết mang đến những sản phẩm chất lượng cao
            và phong cách độc đáo.
          </Typography>
        </Box>

        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: 'black' }}>
              Tầm nhìn & Sứ mệnh
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
              Hoàng Hải Fashion được thành lập với mục tiêu trở thành thương hiệu thời trang hàng đầu, mang đến cho
              khách hàng những trải nghiệm mua sắm tuyệt vời nhất với sản phẩm chất lượng cao và dịch vụ tận tâm.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    bgcolor: 'black',
                    color: 'white',
                    border: '2px solid #000000',
                  }}
                >
                  <Typography variant="h3" sx={{ mb: 1 }}>
                    5+
                  </Typography>
                  <Typography variant="body2">Năm kinh nghiệm</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    bgcolor: 'white',
                    color: 'black',
                    border: '2px solid #000000',
                  }}
                >
                  <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                    1000+
                  </Typography>
                  <Typography variant="body2">Sản phẩm đã bán</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                height: 400,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.100',
                border: '2px solid #e5e7eb',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  bgcolor: 'black',
                },
              }}
            >
              <img
                src="/imagesHome/sale.png"
                alt="Hình ảnh thời trang"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'cover',
                  borderRadius: 'inherit',
                }}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Products Section */}
      <Box
        sx={{
          bgcolor: 'grey.50',
          py: { xs: 8, md: 12 },
          borderTop: '1px solid #e5e7eb',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: '1400px', padding: '20px 0' }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              label="Sản phẩm nổi bật"
              sx={{
                bgcolor: 'black',
                color: 'white',
                mb: 2,
                fontWeight: 600,
              }}
            />
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: 'black' }}>
              Bộ sưu tập thời trang
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Khám phá những sản phẩm thời trang cao cấp được tuyển chọn kỹ lưỡng
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {data?.data?.products.map((product, index) => {
              const image = product.productDetails
                .flatMap((productDetail) => productDetail.image)
                .find((image) => image.mainProduct === true);

              const thumbnailUrl =
                image?.imageUrl || imageMainProduct(product.productDetails)?.imageUrl || THUMBNAIL_PLACEHOLDER;

              const sellingPrice = product.sellingPrice;

              const { percentageValue, finalPrice } = calculateDiscount(product, product.productDiscountPeriods);
              return (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card sx={{ height: '100%' }}>
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        image={thumbnailUrl}
                        alt={product.name}
                        sx={{
                          width: '100%',
                          aspectRatio: '1 / 1',
                          objectFit: 'cover',
                          position: 'relative',
                        }}
                      />
                      {percentageValue && (
                        <Chip
                          label={`-${percentageValue}%`}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            bgcolor: 'error.main',
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      )}
                      <Button
                        size="small"
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
                    <CardContent>
                      <Typography variant="button" sx={{ fontWeight: 600, mb: 1, color: 'black' }}>
                        {product.name}
                      </Typography>
                      {/* <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Rating
                          value={product.rating}
                          precision={0.1}
                          size="small"
                          readOnly
                          sx={{
                            '& .MuiRating-iconFilled': {
                              color: '#000000',
                            },
                          }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          ({product.rating})
                        </Typography>
                      </Box> */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
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
                        <Button onClick={() => handleClick(product.id)} variant="contained" size="small">
                          Mua ngay
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                });
                navigate(`/products`);
              }}
              variant="outlined"
              size="large"
              sx={{ px: 4 }}
            >
              Xem tất cả sản phẩm
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Services Section */}
      <Container maxWidth={false} sx={{ maxWidth: '1400px', padding: '20px 0' }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip
            label="Dịch vụ"
            sx={{
              bgcolor: 'grey.100',
              color: 'black',
              mb: 2,
              fontWeight: 600,
              border: '1px solid #e5e7eb',
            }}
          />
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'black' }}>
            Tại sao chọn Hoàng Hải Fashion?
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  border: '2px solid #e5e7eb',
                  '&:hover': {
                    borderColor: 'black',
                    '& .service-icon': {
                      transform: 'scale(1.1)',
                    },
                  },
                }}
              >
                <Box sx={{ mb: 2, transition: 'transform 0.3s' }} className="service-icon">
                  {service.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'black' }}>
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Contact Section */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 8, md: 12 }, borderTop: '1px solid #e5e7eb' }}>
        <Container maxWidth={false} sx={{ maxWidth: '1400px', padding: '20px 0' }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              label="Liên hệ"
              sx={{
                bgcolor: 'black',
                color: 'white',
                mb: 2,
                fontWeight: 600,
              }}
            />
            <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: 'black' }}>
              Kết nối với chúng tôi
            </Typography>
          </Box>

          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: 'black' }}>
                Thông tin liên hệ
              </Typography>

              <Stack spacing={3}>
                <a
                  href="https://www.google.com/maps/place/Shop+Ho%C3%A0ng+H%E1%BA%A3i/@20.9239125,105.7012006,17z/data=!3m1!4b1!4m6!3m5!1s0x31344d9c251a4597:0xbd9e54a0390bf57b!8m2!3d20.9239075!4d105.7037755!16s%2Fg%2F11hf7zyk_c?hl=vi&entry=ttu"
                  target="_blank"
                  rel="noopener"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'black', width: 56, height: 56 }}>
                      <LocationOn sx={{ color: 'white' }} />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'black' }}>
                        Địa chỉ
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        26 Hòa Sơn, TT. Chúc Sơn, Chương Mỹ, Hà Nội
                        <br />
                        Việt Nam
                      </Typography>
                    </Box>
                  </Box>
                </a>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'white', border: '2px solid black', width: 56, height: 56 }}>
                    <Phone sx={{ color: 'black' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'black' }}>
                      Điện thoại
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      0977.477.636
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'black', width: 56, height: 56 }}>
                    <Email sx={{ color: 'white' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'black' }}>
                      Email
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      hoanghaifashion@gmail.com
                    </Typography>
                  </Box>
                </Box>
              </Stack>

              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'black' }}>
                  Theo dõi chúng tôi
                </Typography>
                <Stack direction="row" spacing={1}>
                  <IconButton sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: 'grey.800' } }}>
                    <Facebook />
                  </IconButton>
                  <IconButton
                    sx={{
                      bgcolor: 'white',
                      color: 'black',
                      border: '2px solid black',
                      '&:hover': { bgcolor: 'grey.100' },
                    }}
                  >
                    <Instagram />
                  </IconButton>
                  <IconButton sx={{ bgcolor: 'black', color: 'white', '&:hover': { bgcolor: 'grey.800' } }}>
                    <Twitter />
                  </IconButton>
                </Stack>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 4, border: '2px solid #e5e7eb' }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: 'black' }}>
                  Gửi tin nhắn cho chúng tôi
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Chúng tôi sẽ phản hồi trong vòng 24 giờ
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Họ tên"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: 'black',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'black',
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: 'black',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: 'black',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'black',
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: 'black',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Tin nhắn"
                        name="message"
                        multiline
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: 'black',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'black',
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: 'black',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button type="submit" variant="contained" fullWidth size="large">
                        Gửi tin nhắn
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default HoangHaiFashionApp;
