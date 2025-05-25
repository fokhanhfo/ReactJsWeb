import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { resetState } from 'admin/reduxAdmin/slices/actionsSlice';
import Loading from 'components/Loading';
import { useGetDiscountQuery } from 'hookApi/discountApi';
import { useBreadcrumb } from 'admin/components/Breadcrumbs/BreadcrumbContext';
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
import ListDiscountPeriod from '../components/ListDiscountPeriod';
import AddDiscountPeriod from '../components/AddDiscountPeriod';
import { useGetDiscountPeriodQuery } from 'hookApi/discountPeriodApi';

DiscountPeriod.propTypes = {};

function DiscountPeriod(props) {
  const { data, error, isLoading } = useGetDiscountPeriodQuery();
  const dispatch = useDispatch();
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [status, setStatus] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [stock, setStock] = React.useState('');

  // const queryParams = useMemo(() => {
  //     const params = queryString.parse(location.search);
  //     return {
  //       page: Number.parseInt(params.page) || 1,
  //       limit: Number.parseInt(params.limit) || rowsPerPage,
  //       ...params,
  //     };
  //   }, [location.search]);

  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);
  const actionsState = useSelector((state) => state.actions);
  const onSubmit = (status) => {
    // if (status) {
    //   refetch();
    // }
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
    // const value = event.target.value;
    // setStatus(value);
    // const newFilter = { ...queryParams };
    // if (value === '') {
    //   delete newFilter.status;
    // } else {
    //   newFilter.status = value;
    // }
    // navigate(
    //   {
    //     pathname: location.pathname,
    //     search: queryString.stringify(newFilter),
    //   },
    //   { replace: true },
    // );
  };

  const handleCategory = (event) => {
    // const value = event.target.value;
    // setCategory(value);
    // const newFilter = { ...queryParams };
    // if (value === '') {
    //   delete newFilter.category;
    // } else {
    //   newFilter.category = value;
    // }
    // navigate(
    //   {
    //     pathname: location.pathname,
    //     search: queryString.stringify(newFilter),
    //   },
    //   { replace: true },
    // );
  };

  return (
    <>
      {!isLoading ? (
        <>
          <Paper>
            <Box sx={{ p: 3, backgroundColor: '#fff', borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Filters
              </Typography>

              <Box display="flex" gap={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select value={status} label="Status" onChange={(e) => handleStatus(e)}>
                    <MenuItem value="">All</MenuItem>
                    {optionStatusDiscount.map((option) => (
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
                    {optionCategoryDiscount.map((category) => (
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
              <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                <TextField size="small" placeholder="Search Product" sx={{ width: 300 }} />

                <Box display="flex" alignItems="center" gap={1}>
                  <FormControl size="small">
                    <Select
                      value={rowsPerPage}
                      // onChange={(e) => handleRowsPerPage(e)}
                    >
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
                    Add Discount
                  </Button>
                </Box>
              </Box>
            </Box>
            <ListDiscountPeriod discounts={data.data} actionsState={actionsState} />
          </Paper>
        </>
      ) : (
        <Loading />
      )}
      {actionsState.add && <AddDiscountPeriod actionsState={actionsState} onSubmit={onSubmit} />}
    </>
  );
}

export default DiscountPeriod;
