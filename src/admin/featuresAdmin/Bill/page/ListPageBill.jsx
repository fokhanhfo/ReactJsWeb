import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import billApi from 'api/billApi';
import queryString from 'query-string';
import Loading from 'components/Loading';
import BillFilter from '../components/BillFilter';
import BillList from '../components/BillList';
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  PaginationItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'; // Doanh thu
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Đơn hàng
import PaymentIcon from '@mui/icons-material/Payment'; // Phương thức thanh toán
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useGetBillQuery, useGetBillStatisticsQuery } from 'hookApi/billApi';

ListPageBill.propTypes = {};

function ListPageBill(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState([]);
  const [pagination, setPagination] = useState({});
  const [status, setStatus] = React.useState('');
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedStatus, setSelectedStatus] = React.useState(null);

  const queryParams = useMemo(() => {
    const params = queryString.parse(location.search);
    return {
      page: Number.parseInt(params.page) || 1,
      limit: Number.parseInt(params.limit) || rowsPerPage,
      ...params,
    };
  }, [location.search]);

  const { data, isLoading, error, refetch } = useGetBillQuery(queryParams);
  const {
    data: billStatistics,
    isLoading: isLoadingBillStatistics,
    error: errorBillStatistics,
  } = useGetBillStatisticsQuery();

  useEffect(() => {
    if (data) {
      setBills(data.data.bill);
    }
    setLoading(isLoading);
  }, [data, isLoading]);

  if (isLoadingBillStatistics || !billStatistics?.data) {
    return <Loading />;
  }

  const { monthlyRevenue, monthlyOrderCount, revenueByPaymentMethod, orderStatusRatio } = billStatistics?.data;

  const salesData = [
    {
      title: 'Doanh thu tháng hiện tại',
      amount: `${monthlyRevenue[0]?.revenue.toLocaleString()} đ`,
      orders: `Tháng ${monthlyRevenue[0]?.month}`,
      changeColor: 'green',
      icon: <MonetizationOnIcon fontSize="large" sx={{ color: 'green' }} />,
    },
    {
      title: 'Tổng đơn hàng tháng',
      amount: `${monthlyOrderCount[0]?.orderCount} đơn`,
      orders: `Tháng ${monthlyOrderCount[0]?.month}`,
      changeColor: 'blue',
      icon: <ShoppingCartIcon fontSize="large" sx={{ color: 'blue' }} />,
    },
    {
      title: 'Doanh thu theo phương thức thanh toán',
      amount: `${revenueByPaymentMethod[0]?.totalRevenue.toLocaleString()} đ`,
      orders: `Phương thức: ${revenueByPaymentMethod[0]?.payMethod || 'Không xác định'}`,
      changeColor: 'purple',
      icon: <PaymentIcon fontSize="large" sx={{ color: 'purple' }} />,
    },
    {
      title: 'Tỷ lệ trạng thái đơn hàng',
      amount: `${orderStatusRatio.reduce((sum, item) => sum + item.count, 0)} đơn`,
      orders: orderStatusRatio
        .map((item) => {
          const statusMap = {
            0: 'Chờ xác nhận',
            1: 'Đang xử lý',
            5: 'Hoàn thành',
          };
          return `${statusMap[item.status] || 'Khác'}: ${item.count}`;
        })
        .join(', '),
      changeColor: 'orange',
      icon: <AssessmentIcon fontSize="large" sx={{ color: 'orange' }} />,
    },
  ];

  const handleChangeFilter = (newfilter) => {
    navigate(
      {
        pathname: location.pathname,
        search: queryString.stringify(newfilter),
      },
      { replace: true },
    );
  };

  const handleStatusChange = (status) => {
    let newFilter = { ...queryParams };
    if (status === null) {
      setSelectedStatus(null);
      delete newFilter.status;
    } else {
      setSelectedStatus(status);
      newFilter.status = status;
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

  const handleRowsPerPage = (e) => {
    setRowsPerPage(e.target.value);
    const newFilter = {
      ...queryParams,
      limit: e.target.value,
    };
    navigate(
      {
        pathname: location.pathname,
        search: queryString.stringify(newFilter),
      },
      { replace: true },
    );
  };

  const billStatuses = [
    { value: null, label: 'Tất cả', bgColor: 'rgba(0, 0, 0, 1)', textColor: '#000' },
    { value: 0, label: 'Chờ phê duyệt', bgColor: 'rgba(0, 0, 0, 1)', textColor: '#ffc107' },
    { value: 1, label: 'Chuẩn bị hàng', bgColor: 'rgba(0, 0, 0, 1)', textColor: '#ffc107' },
    { value: 2, label: 'Vận chuyển', bgColor: 'rgba(0, 0, 0, 1)', textColor: '#ffab00' },
    { value: 3, label: 'Chờ giao hàng', bgColor: 'rgba(0, 0, 0, 1)', textColor: '#36b37e' },
    { value: 4, label: 'Xác nhận hoàn thành', bgColor: 'rgba(0, 0, 0, 1)', textColor: '#00b8d9' },
    { value: 5, label: 'Đơn hoàn thành', bgColor: 'rgba(0, 0, 0, 1)', textColor: '#00b8d9' },
    { value: 6, label: 'Đã hủy', bgColor: 'rgba(0, 0, 0, 1)', textColor: '#ff0000' },
    { value: 7, label: 'Trả hàng/Hoàn tiền', bgColor: 'rgba(0, 0, 0, 1)', textColor: '#919eab' },
  ];

  const handleSearchChange = (e) => {
    const id = e.target.value;

    const currentParams = queryString.parse(location.search);
    const updatedParams = {
      ...currentParams,
      id: id,
      page: 1,
    };

    const newSearch = queryString.stringify(updatedParams);
    navigate(`?${newSearch}`);
  };

  return (
    <>
      {!loading ? (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* <ProductFilter filter={queryParams} onSubmit={handleChangeFilter} /> */}
            <Paper>
              <Box sx={{ padding: 2, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
                <Grid container spacing={2}>
                  {!isLoadingBillStatistics &&
                    salesData.map((item, index) => (
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
                {/* <Box>
                  <BillFilter filter={queryParams} onSubmit={handleChangeFilter}></BillFilter>
                </Box> */}
                {/* <Box display="flex" gap={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <InputLabel>Category</InputLabel>
                    <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="electronics">Electronics</MenuItem>
                      <MenuItem value="fashion">Fashion</MenuItem>
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
                </Box> */}

                <Box>
                  <Grid container spacing={2}>
                    {billStatuses.map((status) => (
                      <Grid item xs={12} sm={6} md={4} lg={1.3} key={status.value}>
                        <Chip
                          label={status.label}
                          onClick={() => handleStatusChange(status.value)}
                          sx={{
                            width: '100%', // Đảm bảo Chip chiếm toàn bộ chiều rộng của cột
                            textAlign: 'center',
                            backgroundColor: selectedStatus === status.value ? status.bgColor : 'transparent',
                            color: selectedStatus === status.value ? 'white' : 'inherit',
                            border: `1px solid ${status.textColor}`,
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: status.bgColor,
                              color: status.textColor,
                            },
                          }}
                          variant={selectedStatus === status.value ? 'filled' : 'outlined'}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Divider sx={{ marginY: 2 }} />

                {/* Search and Actions */}
                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                  <Box>
                    <TextField
                      value={queryParams.id ? queryParams.id : ''}
                      onChange={handleSearchChange}
                      size="small"
                      placeholder="Tìm kiếm ID hóa đơn"
                      sx={{ width: 300 }}
                    />
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <FormControl size="small">
                      <Select value={rowsPerPage} onChange={(e) => handleRowsPerPage(e)}>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                      </Select>
                    </FormControl>

                    <Button variant="outlined" disabled>
                      Export
                    </Button>
                  </Box>
                </Box>
              </Box>
              <BillList bills={data.data.bill}></BillList>
              <Box sx={{ float: 'right', paddingBottom: 2 }}>
                <Pagination
                  count={Math.ceil(data.data.count / rowsPerPage)}
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
    </>
  );
}

export default ListPageBill;
