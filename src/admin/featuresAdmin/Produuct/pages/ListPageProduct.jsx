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
import { useGetProductsQuery } from 'hookApi/productApi';
import { optionStatus } from 'utils/status';
import MoreVertIcon from '@mui/icons-material/MoreVert';

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
  const queryParams = useMemo(() => {
    const params = queryString.parse(location.search);
    return {
      page: Number.parseInt(params.page) || 1,
      limit: Number.parseInt(params.limit) || 5,
      ...params,
    };
  }, [location.search]);

  const [status, setStatus] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [stock, setStock] = React.useState('');
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const { data, error, isLoading } = useGetProductsQuery(queryParams);
  const { data: colors, error: colorsError, isLoading: colorsLoading } = useGetColorQuery();
  const { data: sizes, error: sizesError, isLoading: sizesLoading } = useGetSizeQuery();

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

    const newFilter = { ...queryParams };

    if (value === '') {
      delete newFilter.status;
    } else {
      newFilter.status = value;
    }

    navigate(
      {
        pathname: location.pathname,
        search: queryString.stringify(newFilter),
      },
      { replace: true },
    );
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

  const salesData = [
    {
      title: 'In-Store Sales',
      amount: '$5,345',
      orders: '5k orders',
      change: '+5.7%',
      changeColor: 'green',
      icon: <StoreIcon fontSize="large" />,
    },
    {
      title: 'Website Sales',
      amount: '$74,347',
      orders: '21k orders',
      change: '+12.4%',
      changeColor: 'green',
      icon: <LanguageIcon fontSize="large" />,
    },
    {
      title: 'Discount',
      amount: '$14,235',
      orders: '6k orders',
      change: null,
      icon: <DiscountIcon fontSize="large" />,
    },
    {
      title: 'Affiliate',
      amount: '$8,345',
      orders: '150 orders',
      change: '-3.5%',
      changeColor: 'red',
      icon: <CreditCardIcon fontSize="large" />,
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
                  Filters
                </Typography>

                {/* Filter Selects */}
                <Box display="flex" gap={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select value={status} label="Status" onChange={(e) => handleStatus(e)}>
                      <MenuItem value="">All</MenuItem>
                      {optionStatus.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
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
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <InputLabel>Stock</InputLabel>
                    <Select value={stock} label="Stock" onChange={(e) => setStock(e.target.value)}>
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="in">In Stock</MenuItem>
                      <MenuItem value="out">Out of Stock</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Divider sx={{ marginY: 2 }} />

                {/* Search and Actions */}
                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                  <TextField size="small" placeholder="Search Product" sx={{ width: 300 }} />

                  <Box display="flex" alignItems="center" gap={1}>
                    <FormControl size="small">
                      <Select value={rowsPerPage} onChange={(e) => setRowsPerPage(e.target.value)}>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
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

                    <IconButton borderRadius="50%" sx={{ backgroundColor: '#f0f0f0' }}>
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
              <ListProduct actionsState={actionsState} products={products} />
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
      {actionsState.add && <AddProduct listSize={sizes.data} listColor={colors.data} actionsState={actionsState} />}
    </div>
  );
}

export default ListPageProduct;
