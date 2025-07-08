import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import './styled.scss';
import ProductFilter from '../components/ProductFilter';
import ListProduct from '../components/ListProduct';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import productApi from 'api/productApi';
import Loading from 'components/Loading';
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  PaginationItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Add, ArrowLeft, ArrowRight } from '@mui/icons-material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import styled from 'styled-components';
// import { useGetProductsQuery } from 'admin/featuresAdmin/Produuct/hook/productApi';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';
import { useDispatch, useSelector } from 'react-redux';
import AddProduct from '../components/AddProduct';
import AddIcon from '@mui/icons-material/Add';
import { useGetColorQuery } from 'hookApi/colorApi';
import { useGetSizeQuery } from 'hookApi/sizeApi';
import StoreIcon from '@mui/icons-material/Store';
import LanguageIcon from '@mui/icons-material/Language';
import DiscountIcon from '@mui/icons-material/Discount';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useGetAllProductStatisticsQuery, useGetProductsQuery } from 'hookApi/productApi';
import { optionStatus } from 'utils/status';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InventoryIcon from '@mui/icons-material/Inventory';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import WarehouseIcon from '@mui/icons-material/Warehouse';

ListPageProduct.propTypes = {
  actionsState: PropTypes.object.isRequired,
};

const StyledButton = styled(Button)`
  float: right;
`;

function ListPageProduct({ actionsState }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const categoryQuery = useSelector((state) => state.categoryApi.queries['getCategory(undefined)']);
  const [status, setStatus] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [sortPrice, setSortPrice] = React.useState('');
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const queryParams = useMemo(() => {
    const params = queryString.parse(location.search);
    return {
      page: Number.parseInt(params.page) || 1,
      limit: rowsPerPage || 20,
      ...params,
    };
  }, [location.search, rowsPerPage]);

  const { data, error, isLoading, refetch } = useGetProductsQuery(queryParams);
  const { data: colors, error: colorsError, isLoading: colorsLoading } = useGetColorQuery();
  const { data: sizes, error: sizesError, isLoading: sizesLoading } = useGetSizeQuery();
  const {
    data: productStatistics,
    isLoading: isLoadingProductStatistics,
    error: errorProductStatistics,
  } = useGetAllProductStatisticsQuery();
  if (isLoading) return <Loading />;
  if (error) return <p>Đã xảy ra lỗi khi tải sản phẩm!</p>;

  const products = data?.data.products || [];
  const pagination = data?.data || {};

  // const rows = [];
  // products.forEach(element => {
  //     rows.push(createData(
  //         element.id,
  //         element.name,
  //         element.detail,
  //         element.price,
  //         element.quantity,
  //         element.category.name,
  //         element.imagesUrl[0],
  //         element.status
  //     ));
  // });

  // console.log(rows);

  const updateFilter = (key, value) => {
    const newFilter = { ...queryParams };

    if (value === '') {
      delete newFilter[key];
    } else {
      newFilter[key] = value;
      newFilter.page = 1; // Reset to first page on filter change
    }

    navigate(
      {
        pathname: location.pathname,
        search: queryString.stringify(newFilter),
      },
      { replace: true },
    );
  };

  // Các handler tối ưu
  const handleNextPage = (event, page) => {
    const newFilter = {
      ...queryParams,
      page: page,
    };

    navigate(
      {
        pathname: location.pathname,
        search: queryString.stringify(newFilter),
      },
      { replace: true },
    );
  };

  const handleStatus = (event) => {
    const value = event.target.value;
    setStatus(value);
    updateFilter('status', value);
  };

  const handleCategory = (event) => {
    const value = event.target.value;
    setCategory(value);
    updateFilter('category', value);
  };

  const handleSortPrice = (event) => {
    const value = event.target.value;
    setSortPrice(value);
    updateFilter('sort', value);
  };

  const handleRowsPerPage = (event) => {
    const value = event.target.value;
    setRowsPerPage(value);
    updateFilter('limit', value);
  };

  const handleSearchChange = (e) => {
    const newName = e.target.value;

    const currentParams = queryString.parse(location.search);
    const updatedParams = {
      ...currentParams,
      name: newName,
      page: 1,
    };

    const newSearch = queryString.stringify(updatedParams);
    navigate(`?${newSearch}`);
  };

  const handleChangeFilter = (newfilter) => {
    navigate(
      {
        pathname: location.pathname,
        search: queryString.stringify(newfilter),
      },
      { replace: true },
    );
  };
  const handleActions = (state) => handleAction(state, dispatch, actionsState);

  if (isLoadingProductStatistics || !productStatistics?.data) {
    return <Loading />;
  }

  const { productStatusStats, productSalesView, topProduct, productQuantityDTOS } = productStatistics?.data;

  const salesData = [
    {
      title: 'Sản phẩm bán chạy nhất',
      amount: `${productSalesView.name}`,
      orders: `Đã bán ${productSalesView.totalSold} sản phẩm`,
      change: `ID: ${productSalesView.id}`,
      changeColor: 'green',
      icon: <TrendingUpIcon fontSize="large" sx={{ color: 'green' }} />, // Biểu tượng tăng trưởng
    },
    {
      title: 'Số sản phẩm sắp hết hàng',
      amount: `${productQuantityDTOS.length + 1} sản phẩm`,
      orders: 'Cần nhập hàng',
      changeColor: 'orange',
      icon: <WarningIcon fontSize="large" sx={{ color: 'orange' }} />, // Biểu tượng cảnh báo
    },
    {
      title: 'Sản phẩm đang hoạt động',
      amount: `${productStatusStats.find((s) => s.status === 'Đang hoạt động')?.count || 0}`,
      orders: 'Hoạt động',
      changeColor: 'blue',
      icon: <InventoryIcon fontSize="large" sx={{ color: 'blue' }} />, // Biểu tượng kho hàng
    },
    {
      title: 'Sản phẩm còn nhiều hàng',
      amount: `${topProduct.name}`,
      orders: `Còn ${topProduct.totalQuantity} sản phẩm`,
      change: `ID: ${topProduct.id}`,
      changeColor: 'teal',
      icon: <WarehouseIcon fontSize="large" sx={{ color: 'teal' }} />, // Biểu tượng kho bãi
    },
  ];

  return (
    <div>
      {loading ? (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* <ProductFilter filter={queryParams} onSubmit={handleChangeFilter} /> */}
            <Paper>
              <Box sx={{ padding: 2, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
                <Grid container spacing={2}>
                  {salesData.map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Box
                        sx={{
                          display: 'flex',
                          height: '100%',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: 2,
                          backgroundColor: '#fff',
                          borderRadius: 2,
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle1" color="textSecondary">
                            {item.title}
                          </Typography>
                          <Typography variant="h5" fontWeight="bold">
                            {item.amount}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {item.orders}
                          </Typography>
                          {item.change && (
                            <Typography
                              variant="body2"
                              sx={{
                                color: item.changeColor,
                                fontWeight: 'bold',
                                marginTop: 0.5,
                              }}
                            >
                              {item.change}
                            </Typography>
                          )}
                        </Box>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: '#f5f5f5',
                            borderRadius: '50%',
                          }}
                        >
                          {item.icon}
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Paper>
            <Paper>
              <Box sx={{ p: 3, backgroundColor: '#fff', borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Bộ lọc
                </Typography>

                {/* Filter Selects */}
                <Box display="flex" gap={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      value={queryParams.status ? queryParams.status : status}
                      label="Trạng thái"
                      onChange={(e) => handleStatus(e)}
                    >
                      <MenuItem value="">All</MenuItem>
                      {optionStatus.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <InputLabel>Danh mục</InputLabel>
                    <Select
                      value={queryParams.category ? queryParams.category : category}
                      label="Category"
                      onChange={(e) => handleCategory(e)}
                    >
                      <MenuItem value="">All</MenuItem>
                      {categoryQuery?.data?.data.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <InputLabel>Giá</InputLabel>
                    <Select value={sortPrice} label="Giá" onChange={(e) => handleSortPrice(e)}>
                      <MenuItem value="">Bỏ chọn</MenuItem>
                      <MenuItem value="sellingPrice:desc">Giảm dần</MenuItem>
                      <MenuItem value="sellingPrice:asc">Tăng dần</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Divider sx={{ marginY: 2 }} />

                {/* Search and Actions */}
                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                  <Box>
                    <TextField
                      value={queryParams.name ? queryParams.name : ''}
                      onChange={handleSearchChange}
                      size="small"
                      placeholder="Search Product"
                      sx={{ width: 300 }}
                    />
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <FormControl size="small">
                      <Select
                        value={queryParams.limit ? queryParams.limit : rowsPerPage}
                        onChange={(e) => handleRowsPerPage(e)}
                      >
                        <MenuItem value={20}>20 thẻ</MenuItem>
                        <MenuItem value={50}>50 thẻ</MenuItem>
                        <MenuItem value={100}>100 thẻ</MenuItem>
                      </Select>
                    </FormControl>

                    <Button variant="outlined" disabled>
                      Export
                    </Button>

                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ float: 'right' }}
                      startIcon={<AddIcon />}
                      onClick={() => handleActions('add')}
                    >
                      Add Product
                    </Button>

                    <IconButton sx={{ backgroundColor: '#f0f0f0', borderRadius: '50%' }}>
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
              <ListProduct refetch={refetch} actionsState={actionsState} products={products} />
              <Box sx={{ float: 'right', paddingBottom: 2 }}>
                <Pagination
                  count={Math.ceil(pagination.count / queryParams.limit)}
                  page={Number.parseInt(queryParams.page)}
                  onChange={handleNextPage}
                  shape="rounded"
                  size="large"
                  color="primary"
                  siblingCount={1}
                  boundaryCount={1}
                  showFirstButton // Hiển thị nút đầu tiên (<<)
                  showLastButton
                  renderItem={(item) => <PaginationItem slots={{ previous: ArrowLeft, next: ArrowRight }} {...item} />}
                />
              </Box>
            </Paper>
          </Box>
        </>
      ) : (
        <Loading></Loading>
      )}
      {actionsState.add && !colorsLoading && !sizesLoading && (
        <AddProduct listSize={sizes.data} listColor={colors.data} actionsState={actionsState} />
      )}
    </div>
  );
}

export default ListPageProduct;
