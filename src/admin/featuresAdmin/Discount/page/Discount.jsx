import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { resetState } from 'admin/reduxAdmin/slices/actionsSlice';
import Loading from 'components/Loading';
import AddDiscount from '../components/AddDiscount';
import { useGetDiscountQuery } from 'hookApi/discountApi';
import { useBreadcrumb } from 'admin/components/Breadcrumbs/BreadcrumbContext';
import ListDiscount from '../components/ListDiscount';
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';
import { optionCategoryDiscount, optionStatusDiscount } from 'utils';
import queryString from 'query-string';
import { useLocation, useNavigate } from 'react-router-dom';

Discount.propTypes = {};

function Discount(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const queryParams = useMemo(() => {
    const params = queryString.parse(location.search);
    return {
      page: Number.parseInt(params.page) || 1,
      limit: rowsPerPage || 20,
      sort: 'enable:DESC',
      ...params,
    };
  }, [location.search, rowsPerPage]);
  const { data, error, isLoading } = useGetDiscountQuery(queryParams);
  const dispatch = useDispatch();
  const [status, setStatus] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [istype, setIsType] = React.useState('');

  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);
  const actionsState = useSelector((state) => state.actions);

  const updateFilter = (key, value) => {
    const newFilter = { ...queryParams };

    if (value === '') {
      delete newFilter[key];
    } else {
      newFilter[key] = value;
      newFilter.page = 1;
    }

    navigate(
      {
        pathname: location.pathname,
        search: queryString.stringify(newFilter),
      },
      { replace: true },
    );
  };

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

  const handleRowsPerPage = (event) => {
    const value = event.target.value;
    setRowsPerPage(value);
    updateFilter('limit', value);
  };

  const { setBreadcrumbs } = useBreadcrumb();

  // const handleRowsPerPage = (e) => {
  //     setRowsPerPage(e.target.value);
  //     const newFilter = {
  //       ...queryParams,
  //       limit: e.target.value,
  //     };
  //     navigate(
  //       {
  //         pathname: location.pathname,
  //         search: queryString.stringify(newFilter),
  //       },
  //       { replace: true },
  //     );
  //   };

  useEffect(() => {
    setBreadcrumbs([{ label: 'Home', href: './home' }, { label: 'Discount' }]);
  }, [setBreadcrumbs]);

  const handleActions = (state) => handleAction(state, dispatch, actionsState);

  const handleStatus = (event) => {
    const value = event.target.value;
    setStatus(value);
    const newFilter = { ...queryParams };
    if (value === '') {
      delete newFilter.validity;
    } else {
      newFilter.validity = value;
      newFilter.page = 1;
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

  const handleType = (event) => {
    const value = event.target.value;
    setIsType(value);
    const newFilter = { ...queryParams };
    if (value === '') {
      delete newFilter.type;
    } else {
      newFilter.type = value;
    }
    navigate(
      {
        pathname: location.pathname,
        search: queryString.stringify(newFilter),
      },
      { replace: true },
    );
  };

  const handleSearchChange = (e) => {
    const newName = e.target.value;

    const currentParams = queryString.parse(location.search);
    const updatedParams = {
      ...currentParams,
      page: 1,
    };

    if (newName) {
      updatedParams.search = newName;
    } else {
      delete updatedParams.search;
    }

    const newSearch = queryString.stringify(updatedParams);
    navigate(`?${newSearch}`);
  };

  return (
    <>
      {!isLoading ? (
        <>
          <Paper>
            <Box sx={{ p: 3, backgroundColor: '#fff', borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Bộ lọc
              </Typography>

              <Box display="flex" gap={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Hiệu lực</InputLabel>
                  <Select
                    value={queryParams.validity ? queryParams.validity : status}
                    label="Hiệu lực"
                    onChange={(e) => handleStatus(e)}
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="ongoing">Đang diễn ra</MenuItem>
                    <MenuItem value="upcoming">Chưa bắt đầu</MenuItem>
                    <MenuItem value="ended">Đã kết thúc</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={queryParams.category ? queryParams.category : category}
                    label="Category"
                    onChange={(e) => handleCategory(e)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="1">Sản phẩm</MenuItem>
                    <MenuItem value="2">Vận chuyển</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel>Loại</InputLabel>
                  <Select
                    value={queryParams.type ? queryParams.type : istype}
                    label="Loại"
                    onChange={(e) => handleType(e)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="1">Phần trăm</MenuItem>
                    <MenuItem value="2">Giá trị tiền</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Divider sx={{ marginY: 2 }} />
              <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                <TextField
                  value={queryParams.search ? queryParams.search : ''}
                  onChange={handleSearchChange}
                  size="small"
                  placeholder="Tìm kiếm theo ID/CODE giảm giá"
                  sx={{ width: 300 }}
                />
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
                    Add Discount
                  </Button>
                </Box>
              </Box>
            </Box>
            <ListDiscount discounts={data?.data?.discounts} actionsState={actionsState} />
          </Paper>
        </>
      ) : (
        <Loading />
      )}
      {actionsState.add && <AddDiscount actionsState={actionsState} />}
    </>
  );
}

export default Discount;
