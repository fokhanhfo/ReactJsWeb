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
import Banner from 'components/Banner/Banner';

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
  const [sort, setSort] = useState();

  const categoryQuery = useSelector((state) => state.categoryApi.queries['getCategory(undefined)']);

  const queryParams = useMemo(() => {
    const params = queryString.parse(location.search);

    return {
      name: params.name || '',
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
    window.scrollTo({ top: 300, behavior: 'smooth' });
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

  const handleSort = (event) => {
    const value = event.target.value;
    setSort(value);
    const newFilter = { ...queryParams };
    if (value === '') {
      delete newFilter.sort;
    } else {
      newFilter.sort = value;
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
      <Banner />
      <Paper>
        <Container
          maxWidth={false}
          sx={{
            maxWidth: '1400px',
            paddingY: 2,
          }}
        >
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
                    flexDirection: 'column',
                    gap: 2,
                    mb: 2,
                  }}
                >
                  {/* TITLE */}
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Sản Phẩm Nổi Bật
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Khám phá các sản phẩm cao cấp được tuyển chọn
                    </Typography>
                  </Box>

                  {/* CONTROL BAR */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'stretch', sm: 'center' },
                      justifyContent: 'space-between',
                      gap: 2,
                      p: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      backgroundColor: 'background.paper',
                    }}
                  >
                    {/* LEFT - Rows per page */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        flex: { xs: '1 1 auto', sm: '0 0 auto' },
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Hiển thị:
                      </Typography>
                      <FormControl size="small" sx={{ minWidth: 100 }}>
                        <Select
                          value={rowsPerPage}
                          onChange={(e) => handleRowsPerPageChange(e)}
                          sx={{ borderRadius: 2 }}
                        >
                          <MenuItem value={20}>20</MenuItem>
                          <MenuItem value={30}>30</MenuItem>
                          <MenuItem value={50}>50</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>

                    {/* RIGHT - Filters */}
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                        alignItems: 'center',
                        justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                      }}
                    >
                      {/* CATEGORY */}
                      <FormControl size="small" sx={{ minWidth: 140 }}>
                        <InputLabel>Danh mục</InputLabel>
                        <Select value={category} label="Danh mục" onChange={handleCategory} sx={{ borderRadius: 2 }}>
                          <MenuItem value="">Tất cả</MenuItem>
                          {categoryQuery?.data?.data.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/* SORT */}
                      <FormControl size="small" sx={{ minWidth: 140 }}>
                        <InputLabel>Giá tiền</InputLabel>
                        <Select
                          value={queryParams.sort === 'hasDiscount' ? '' : queryParams.sort}
                          label="Giá tiền"
                          onChange={(e) => handleSort(e)}
                          sx={{ borderRadius: 2 }}
                        >
                          <MenuItem value="">Mặc định</MenuItem>
                          <MenuItem value="sellingPrice:ASC">Giá thấp đến cao</MenuItem>
                          <MenuItem value="sellingPrice:DESC">Giá cao đến thấp</MenuItem>
                        </Select>
                      </FormControl>

                      {/* FILTER BUTTON - only mobile */}
                      {/* <Button
                        variant="contained"
                        startIcon={<FilterListIcon />}
                        onClick={() => setOpenDrawer(true)}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          display: { xs: 'flex', sm: 'none' },
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        }}
                      >
                        Bộ lọc
                      </Button> */}
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
          {/* <Drawer
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
          </Drawer> */}
        </Container>
      </Paper>
    </Box>
  );
}

export default ListPage;
