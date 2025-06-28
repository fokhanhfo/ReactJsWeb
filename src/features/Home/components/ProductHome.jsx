import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  PaginationItem,
  Paper,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import productApi from 'api/productApi';
import Loading from 'components/Loading';
import { formatPrice, imageMainProduct } from 'utils';
import InfiniteScroll from 'components/InfiniteScroll';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { THUMBNAIL_PLACEHOLDER } from 'constants';
import { useGetProductsQuery } from 'hookApi/productApi';
import {
  FilterList as FilterListIcon,
  Sort as SortIcon,
  ArrowBack as ArrowLeft,
  ArrowForward as ArrowRight,
  Close as CloseIcon,
} from '@mui/icons-material';
import ProductSkeletonList from 'features/Product/components/ProductSkeletonList';
import ProductList from 'features/Product/components/ProductList';
import { useSelector } from 'react-redux';
import queryString from 'query-string';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Product from 'features/Product/components/Product';
import ProductSale from './ProductSale';
import ImageHome from './ImageHome';

ProductHome.propTypes = {};

function ProductHome(props) {
  const theme = useTheme();
  const [totalRows, setTotalRows] = useState(0);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [newProductList, setNewProductList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [productListDiscount, setProductListDiscount] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [category, setCategory] = useState('');
  const [pagination, setPagination] = useState({ limit: 10, count: 10, page: 1 });

  const categoryQuery = useSelector((state) => state.categoryApi.queries['getCategory(undefined)']);

  const [filter, setFilter] = useState({
    page: 1,
    limit: 5,
    status: 1,
  });
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await productApi.getAll(filter);
      setPosts([...posts, ...response.data]);
      setTotalRows(response.pagination.count);
    })();
  }, [filter]);

  const queryParams = useMemo(() => {
    const params = queryString.parse(location.search);
    return {
      page: Number.parseInt(params.page) || 1,
      limit: Number.parseInt(params.limit) || 10,
      status: 1,
      ...params,
    };
  }, [location.search]);

  const filterQueryDiscount = {
    page: 1,
    limit: 20,
    status: 1,
    sort: 'hasDiscount',
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, pagination } = await productApi.getAll(queryParams);
        const { data: dataDiscount } = await productApi.getAll(filterQueryDiscount);
        setProductList(data);
        setProductListDiscount(dataDiscount);
        setPagination(pagination);
      } catch (error) {
        console.error('Lỗi khi fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [queryParams]);

  const fetchMore = () => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      page: prevFilter.page + 1,
    }));
  };
  const handleCategory = (event) => {
    const value = event.target.value;
    setCategory(value);
    const newFilter = { ...queryParams };
    if (value === '') {
      delete newFilter.category;
    } else {
      newFilter.category = value;
    }
    navigate(
      {
        pathname: location.pathname,
        search: queryString.stringify(newFilter),
      },
      { replace: true },
    );
  };
  // const handlePageChange = (event, page) => {
  //   navigate({
  //     pathname: location.pathname,
  //     search: queryString.stringify({ ...queryParams, page }),
  //   });
  // };

  const scrollRef = useRef();

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <>
      <ProductSale productList={productListDiscount} loading={loading} />
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            mb: 1,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -5,
                left: 0,
                width: 60,
                height: 3,
                backgroundColor: theme.palette.primary.main,
              },
            }}
          >
            Sản Phẩm Nổi Bật
          </Typography>

          <Box width={'50%'} display="flex" justifyContent={'end'} gap={1}>
            {/* <FormControl fullWidth size="small">
              <Select
                value=""
                // value={rowsPerPage} onChange={(e) => setRowsPerPage(e.target.value)}
              >
                <MenuItem value="">Số lượng sản phẩm</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select value={category} label="Category" onChange={(e) => handleCategory(e)}>
                <MenuItem value="">All</MenuItem>
                {categoryQuery?.data?.data.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
            <Button
              component={Link}
              to="./products"
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
            <Button
              variant="contained"
              startIcon={<FilterListIcon />}
              onClick={() => setOpenDrawer(true)}
              fullWidth
              sx={{
                display: { md: 'none' },
                borderRadius: 2,
                textTransform: 'none',
              }}
            >
              Filters
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 1 }} />

        {/* <Box sx={{ flex: 1, mb: 1 }}>
          <FilterViewer filters={queryParams} onChange={handleFilterViewChange} />
        </Box> */}

        <Divider sx={{ mb: 1 }} />

        {loading ? <ProductSkeletonList /> : <ProductList data={productList} />}
      </Box>
      {/* <Box
        display="flex"
        justifyContent="center"
        mt={4}
        sx={{
          '& .MuiPaginationItem-root': {
            borderRadius: 2,
          },
        }}
      >
        <Pagination
          count={Math.ceil(pagination.count / pagination.limit)}
          page={queryParams.page}
          onChange={handlePageChange}
          color="primary"
          size={isMobile ? 'small' : 'medium'}
          renderItem={(item) => <PaginationItem slots={{ previous: ArrowLeft, next: ArrowRight }} {...item} />}
        />
      </Box> */}
      {/* <InfiniteScroll
        loader={<Loading />}
        className="w-[800px] mx-auto my-10"
        fetchMore={fetchMore}
        hasMore={posts.length < totalRows}
        endMessage={
          <>
            <p style={{ textAlign: 'center' }}>Đã hết sản phẩm</p>
          </>
        }
      >
        <Typography variant="h5" color="text.primary">
          Featured Products
        </Typography>
        <Divider sx={{ mb: 1 }} />
        <Grid className="home-products" spacing={3} container>
          {posts.map((post, index) => {
            const thumbnailUrl = imageMainProduct(post.productDetails)?.imageUrl || THUMBNAIL_PLACEHOLDER;
            return (
              <Grid className="home-product" key={index} item xs={6} sm={4} md={3} lg={3}> */}
      {/* <Paper>
                  <div className="home-product-divImg">
                    <img className="home-product-img" src={image?.imageUrl} alt="" />
                  </div>
                  <div className="home-product-detail">
                    <p className="home-product-detailName">{post.name}</p>
                    <p className="home-product-detailPrice">{formatPrice(post.productDetails[0]?.sellingPrice)}</p>
                  </div>
                </Paper> */}
      {/* <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => {
                      navigate(`/products/${post.id}`);
                      window.scrollTo(0, 0);
                    }}
                    sx={{
                      position: 'relative',
                      '&:hover .slide-button': {
                        transform: 'translate(-50%, -50%)',
                        opacity: 1,
                        backgroundColor: '#fff',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        pointerEvents: 'auto',
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        image={thumbnailUrl}
                        alt={post.name}
                        sx={{
                          width: '100%',
                          aspectRatio: '1 / 1',
                          objectFit: 'cover',
                          position: 'relative',
                        }}
                      /> */}
      {/* Overlay Button */}
      {/* <Button
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

                    <CardContent
                      sx={{
                        padding: 2,
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          marginBottom: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {post.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 400,
                          marginTop: 'auto',
                        }}
                      >
                        {formatPrice(post?.productDetails[0]?.sellingPrice)}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </InfiniteScroll> */}
      <ImageHome />
    </>
  );
}

export default ProductHome;
