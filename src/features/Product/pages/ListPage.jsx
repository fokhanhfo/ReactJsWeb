import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Pagination,
  PaginationItem,
  Drawer,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Button,
  Paper,
  Breadcrumbs,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  FilterList as FilterListIcon,
  ArrowBack as ArrowLeft,
  ArrowForward as ArrowRight,
  Close as CloseIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import productApi from 'api/productApi';
import ProductList from '../components/ProductList';
import ProductSkeletonList from '../components/ProductSkeletonList';
import ProductFilter from '../components/ProductFilter';
import FilterViewer from '../components/FilterViewer';
import { useSelector } from 'react-redux';

function ListPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [pagination, setPagination] = useState({ limit: 10, count: 10, page: 1 });
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [category, setCategory] = useState('');

  const categoryQuery = useSelector((state) => state.categoryApi.queries['getCategory(undefined)']);

  const queryParams = useMemo(() => {
    const params = queryString.parse(location.search);

    return {
      page: Number.parseInt(params.page) || 1,
      limit: Number.parseInt(params.limit) || rowsPerPage || 10,
      sort: params.sort || 'hasDiscount',
      status: Number.parseInt(params.status) || 1,
      category: params.category || '',
    };
  }, [location.search, rowsPerPage]);

  useEffect(() => {
    const params = queryString.parse(location.search);

    if (params.category) {
      setCategory(params.category);
    } else {
      setCategory('');
    }
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, pagination } = await productApi.getAll(queryParams);
        setProductList(data);
        setPagination(pagination);
      } catch (error) {
        console.error('Lỗi khi fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [queryParams]);

  const handlePageChange = (event, page) => {
    navigate({
      pathname: location.pathname,
      search: queryString.stringify({ ...queryParams, page }),
    });
  };

  const handleFilterChange = (newFilter) => {
    navigate({
      pathname: location.pathname,
      search: queryString.stringify({ ...queryParams, ...newFilter }),
    });
  };

  const handleFilterViewChange = (newFilter) => {
    navigate({
      pathname: location.pathname,
      search: queryString.stringify(newFilter),
    });
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

  const handleRowsPerPageChange = (e) => {
    const newLimit = e.target.value;
    setRowsPerPage(newLimit);

    const currentParams = queryString.parse(location.search);
    const newParams = {
      ...currentParams,
      limit: newLimit,
      page: 1, // reset về page 1 khi thay đổi limit
    };

    navigate({
      pathname: location.pathname,
      search: `?${queryString.stringify(newParams)}`,
    });
  };

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          height: '167px',
          backgroundImage: 'url(/images/banner.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth={false} sx={{ height: '100%', display: 'flex', alignItems: 'center', maxWidth: '1400px' }}>
          <Card elevation={0} sx={{ width: '100%', background: 'transparent', boxShadow: 'none' }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
              <Link underline="hover" color="inherit" href="/">
                Home
              </Link>
              <Typography color="text.primary">Shop</Typography>
            </Breadcrumbs>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Sản Phẩm Của Chúng Tôi
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Khám phá bộ sưu tập sản phẩm chất lượng cao của chúng tôi
            </Typography>
          </Card>
        </Container>
      </Box>
      <Paper>
        <Container
          maxWidth={false}
          sx={{
            maxWidth: '1400px',
            paddingY: 2,
          }}
        >
          {/* Filter Section */}
          {/* <Card
            elevation={0}
            sx={{
              mb: 3,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              width: '100%',
              padding: 2,
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
              <Box sx={{ flex: 1 }}>
                <FilterViewer filters={queryParams} onChange={handleFilterViewChange} />
              </Box>

              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  startIcon={<SortIcon />}
                  size="small"
                  sx={{
                    borderRadius: 2,
                    display: { xs: 'none', sm: 'flex' },
                  }}
                >
                  Sort
                </Button>
                <Button
                  variant="contained"
                  startIcon={<FilterListIcon />}
                  onClick={() => setOpenDrawer(true)}
                  size="small"
                  sx={{
                    display: { md: 'none' },
                    borderRadius: 2,
                  }}
                >
                  Filters
                </Button>
              </Box>
            </Box>
          </Card> */}

          <Grid container spacing={3}>
            {/* Desktop Filter Sidebar */}
            {/* <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Card
                elevation={0}
                sx={{
                  position: 'sticky',
                  top: 24,
                  height: 'fit-content',
                }}
              >
                <Typography mb={1} variant="h5" component="h2" color="text.primary">
                  Filters
                </Typography>
                <ProductFilter onChange={handleFilterChange} filters={queryParams} />
              </Card>
            </Grid> */}

            <Grid item xs={12} md={12}>
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
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1,
                      }}
                    >
                      Sản Phẩm Nổi Bật
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Discover our handpicked selection of premium products
                    </Typography>
                  </Box>

                  {/* <Box width="70%" display="flex" flexWrap="wrap" justifyContent="flex-end" gap={2} sx={{ mt: 2 }}>
                    <FormControl
                      size="small"
                      sx={{
                        width: {
                          xs: '100%',
                          sm: '120px',
                          md: '140px',
                        },
                      }}
                    >
                      <Select value={rowsPerPage} onChange={(e) => setRowsPerPage(e.target.value)} displayEmpty>
                        <MenuItem value={10}>10 Items</MenuItem>
                        <MenuItem value={20}>20 Items</MenuItem>
                        <MenuItem value={50}>50 Items</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl
                      size="small"
                      sx={{
                        minWidth: {
                          xs: '100%',
                          sm: '160px',
                          md: '180px',
                        },
                      }}
                    >
                      <InputLabel>Category</InputLabel>
                      <Select value={category} label="Category" onChange={(e) => handleCategory(e)}>
                        <MenuItem value="">All</MenuItem>
                        {categoryQuery?.data?.data.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Button
                      variant="outlined"
                      startIcon={<SortIcon />}
                      sx={{
                        display: {
                          xs: 'none',
                          sm: 'flex',
                        },
                        borderRadius: 2,
                        textTransform: 'none',
                        minWidth: '120px',
                      }}
                    >
                      Sort
                    </Button>

                    <Button
                      variant="contained"
                      startIcon={<FilterListIcon />}
                      onClick={() => setOpenDrawer(true)}
                      sx={{
                        display: {
                          xs: 'flex',
                          md: 'none',
                        },
                        borderRadius: 2,
                        textTransform: 'none',
                        minWidth: '120px',
                      }}
                    >
                      Filters
                    </Button>
                  </Box> */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'stretch', sm: 'center' },
                      justifyContent: 'space-between',
                      gap: 2,
                      p: 2,
                    }}
                  >
                    {/* Left side - Items per page */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                        Hiển thị:
                      </Typography>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={rowsPerPage}
                          onChange={(e) => setRowsPerPage(e.target.value)}
                          displayEmpty
                          sx={{ borderRadius: 2 }}
                        >
                          <MenuItem value={20}>20 Thẻ</MenuItem>
                          <MenuItem value={30}>30 Thẻ</MenuItem>
                          <MenuItem value={50}>50 Thẻ</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>

                    {/* Right side - Filters and Sort */}
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                        alignItems: { xs: 'stretch', sm: 'center' },
                        flex: 1,
                        justifyContent: 'flex-end',
                      }}
                    >
                      {/* Category Filter */}
                      <FormControl
                        size="small"
                        sx={{
                          minWidth: { xs: '100%', sm: 180 },
                        }}
                      >
                        <InputLabel>Danh Mục</InputLabel>
                        <Select value={category} label="Category" onChange={handleCategory} sx={{ borderRadius: 2 }}>
                          <MenuItem value="">All Categories</MenuItem>
                          {categoryQuery?.data?.data.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/* Sort - Desktop */}
                      {!isMobile && (
                        <FormControl size="small" sx={{ minWidth: 140 }}>
                          <InputLabel>Sort By</InputLabel>
                          <Select
                            value={''}
                            label="Giá"
                            // onChange={handleSortChange}
                            sx={{ borderRadius: 2 }}
                          >
                            <MenuItem value="">Default</MenuItem>
                            <MenuItem value="price-low">Price: Low to High</MenuItem>
                            <MenuItem value="price-high">Price: High to Low</MenuItem>
                            <MenuItem value="rating">Highest Rated</MenuItem>
                            <MenuItem value="newest">Newest First</MenuItem>
                          </Select>
                        </FormControl>
                      )}

                      {/* Sort Button - Mobile */}
                      {isMobile && (
                        <Button
                          variant="outlined"
                          startIcon={<SortIcon />}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                          }}
                        >
                          Sort
                        </Button>
                      )}

                      {/* Filters Button - Mobile */}
                      {isMobile && (
                        <Button
                          variant="contained"
                          startIcon={<FilterListIcon />}
                          onClick={() => setOpenDrawer(true)}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          }}
                        >
                          Filters
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ mb: 1 }} />

                <Box sx={{ flex: 1, mb: 1 }}>
                  <FilterViewer filters={queryParams} onChange={handleFilterViewChange} />
                </Box>

                <Divider sx={{ mb: 1 }} />

                {loading ? <ProductSkeletonList /> : <ProductList data={productList} />}
              </Box>

              {/* Pagination */}
              <Box
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
              </Box>
            </Grid>
          </Grid>

          {/* Mobile Filter Drawer */}
          <Drawer
            anchor="right"
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
            PaperProps={{
              sx: {
                width: '85%',
                maxWidth: 360,
                borderRadius: '12px 0 0 12px',
                p: 2,
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Filters
              </Typography>
              <IconButton onClick={() => setOpenDrawer(false)} edge="end">
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <ProductFilter onChange={handleFilterChange} filters={queryParams} />
            <Box sx={{ mt: 3 }}>
              <Button variant="contained" fullWidth onClick={() => setOpenDrawer(false)} sx={{ borderRadius: 2 }}>
                Apply Filters
              </Button>
            </Box>
          </Drawer>
        </Container>
      </Paper>
    </Box>
  );
}

export default ListPage;
