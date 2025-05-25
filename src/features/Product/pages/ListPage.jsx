'use client';

import { useEffect, useMemo, useState } from 'react';
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
  const [category, setCategory] = useState('');

  const categoryQuery = useSelector((state) => state.categoryApi.queries['getCategory(undefined)']);

  const queryParams = useMemo(() => {
    const params = queryString.parse(location.search);
    return {
      page: Number.parseInt(params.page) || 1,
      limit: Number.parseInt(params.limit) || 10,
      sort: 'hasDiscount',
      status: 1,
      ...params,
    };
  }, [location.search]);

  useEffect(() => {
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
              Our Products
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Discover our collection of high-quality products
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
                  <Typography variant="h5" color="text.primary">
                    Featured Products
                  </Typography>

                  <Box width={'30%'} display="flex" justifyContent={'end'} gap={1}>
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
                    </FormControl>
                    <Button
                      variant="outlined"
                      startIcon={<SortIcon />}
                      fullWidth
                      sx={{
                        borderRadius: 2,
                        display: { xs: 'none', sm: 'flex' },
                        textTransform: 'none',
                      }}
                    >
                      Sort
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
