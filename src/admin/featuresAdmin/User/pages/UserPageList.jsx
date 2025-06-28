import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'admin/components/Table/DataTable';
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
import { ArrowLeft, ArrowRight, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AddUser from '../components/AddUser';
import { Update } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import StoreIcon from '@mui/icons-material/Store';
import LanguageIcon from '@mui/icons-material/Language';
import DiscountIcon from '@mui/icons-material/Discount';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import queryString from 'query-string';
import { useGetUsersQuery } from 'hookApi/userApi';
import { useGetRoleQuery } from 'hookApi/roleApi';
import Loading from 'components/Loading';
import userApi from 'api/userApi';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import DateRangeIcon from '@mui/icons-material/DateRange';

ListUser.propTypes = {};

function ListUser(props) {
  const navigate = useNavigate();
  const [enable, setEnable] = React.useState('');
  const [typeLogin, settypeLogin] = React.useState('');
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const location = useLocation();
  const [roles, setRoles] = useState([]);
  const [getDataStatistics, setGetDataStatistics] = useState();
  const queryParams = useMemo(() => {
    const params = queryString.parse(location.search);
    return {
      page: Number.parseInt(params.page) || 1,
      limit: rowsPerPage || 20,
      ...params,
    };
  }, [location.search, rowsPerPage]);
  const { data, error, isLoading } = useGetUsersQuery(queryParams);
  const { data: dataRole, error: errorRole, isLoading: isLoadingRole } = useGetRoleQuery();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await userApi.getDataStatistics();
        setGetDataStatistics(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thống kê:', error);
      }
    };

    fetchData();
  }, []);

  const pagination = data?.data || {};
  console.log('get', getDataStatistics);
  const salesData = [
    {
      title: 'Tổng số người dùng',
      amount: `${getDataStatistics?.genderCount?.total}`,
      orders: `Nam: ${getDataStatistics?.genderCount?.male}, Nữ: ${getDataStatistics?.genderCount?.female}`,
      change: `Khác: ${getDataStatistics?.genderCount?.other}`,
      changeColor: 'blue',
      icon: <PeopleIcon fontSize="large" color="primary" />,
    },
    {
      title: 'Tổng số quản trị viên',
      amount: `${getDataStatistics?.roleCounts?.find((role) => role.name === 'ADMIN')?.total}`,
      orders: `Người dùng: ${getDataStatistics?.roleCounts?.find((role) => role.name === 'USER')?.total}`,
      change: `Tổng: ${getDataStatistics?.roleCounts?.reduce((sum, r) => sum + r.total, 0)}`,
      changeColor: 'green',
      icon: <AdminPanelSettingsIcon fontSize="large" color="secondary" />,
    },
    {
      title: 'Tỷ lệ giới tính khác',
      amount: `${((getDataStatistics?.genderCount?.other / getDataStatistics?.genderCount?.total) * 100).toFixed(1)}%`,
      orders: 'So với tổng số người dùng',
      change: null,
      icon: <Diversity3Icon fontSize="large" color="error" />,
    },
    {
      title: 'Thống kê theo tháng',
      amount: `${getDataStatistics?.totalPerMonth?.[1]?.totalUsers ?? 'Chưa có dữ liệu'}`,
      orders: `Tháng: ${getDataStatistics?.totalPerMonth?.[1]?.month ?? 'Không rõ'}`,
      change: null,
      icon: <DateRangeIcon fontSize="large" color="action" />,
    },
  ];

  const handleCloseAdd = () => setOpenAdd(false);
  const handleSubmitSuccess = () => {
    handleCloseAdd();
  };
  const handleOpenDialog = (mode, size = null) => {
    setSelectedUser(size);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setSelectedUser(null);
  };

  const handleSuccessSubmit = () => {
    handleCloseDialog();
  };

  const handleActions = () => setOpenAdd(true);

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.2 },
    { field: 'username', headerName: 'Tên đăng nhập', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone', headerName: 'Số điện thoại', flex: 0.5 },
    {
      field: 'roles',
      headerName: 'Quyền',
      flex: 1,
      valueGetter: (params) => {
        return params.map((r) => r.name).join(', ');
      },
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton color="error">
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => handleOpenDialog('edit', params.row)}>
            <Update color="success" />
          </IconButton>
        </>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  const handleRole = (event) => {
    const value = event.target.value;

    // Nếu người dùng chọn "Tất cả", thì xóa filter và reset state
    if (value.includes('')) {
      setRoles([]);
      const newFilter = { ...queryParams };
      delete newFilter.role;
      newFilter.page = 1;

      navigate(
        {
          pathname: location.pathname,
          search: queryString.stringify(newFilter),
        },
        { replace: true },
      );
      return;
    }

    // Ngược lại: người dùng chọn các quyền cụ thể
    setRoles(value);

    const newFilter = { ...queryParams };
    if (value.length === 0) {
      delete newFilter.role;
    } else {
      newFilter.role = value.join(',');
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

  const handletypeLogin = (event) => {
    const value = event.target.value;
    settypeLogin(value);

    const newFilter = { ...queryParams };

    if (value === '') {
      delete newFilter.typeLogin;
    } else {
      newFilter.typeLogin = value;
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

  const handleEnable = (event) => {
    const value = event.target.value;
    setEnable(value);

    const newFilter = { ...queryParams };

    if (value === '') {
      delete newFilter.enable;
    } else {
      newFilter.enable = value;
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

  if (isLoading || isLoadingRole) {
    return <Loading />;
  }

  return (
    <>
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
        {' '}
        <Box sx={{ p: 3, backgroundColor: '#fff', borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Bộ lọc
          </Typography>

          {/* Filter Selects */}
          <Box display="flex" gap={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Trạng thái</InputLabel>
              <Select value={enable} label="Trạng thái" onChange={(e) => handleEnable(e)}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value={1}>Đã kích hoạt</MenuItem>
                <MenuItem value={0}>Chưa kích hoạt</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Quyền</InputLabel>
              <Select
                multiple
                value={roles}
                label="Quyền"
                onChange={handleRole}
                renderValue={(selected) => (selected.length === 0 ? 'Tất cả' : selected.join(', '))}
              >
                <MenuItem value="">
                  <em>Tất cả</em>
                </MenuItem>
                {!isLoadingRole &&
                  dataRole?.data.map((item) => (
                    <MenuItem key={item.name} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Loại</InputLabel>
              <Select value={typeLogin} label="Loại" onChange={(e) => handletypeLogin(e)}>
                <MenuItem value="">Bỏ chọn</MenuItem>
                <MenuItem value="0">Đăng nhập bình thường</MenuItem>
                <MenuItem value="1">Facebook</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Divider sx={{ marginY: 2 }} />

          {/* Search and Actions */}
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <TextField
              // onChange={handleSearchChange}
              size="small"
              placeholder="Tìm kiếm người dùng"
              sx={{ width: 300 }}
            />

            <Box display="flex" alignItems="center" gap={1}>
              <FormControl size="small">
                <Select value={rowsPerPage} onChange={(e) => setRowsPerPage(e.target.value)}>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
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
                onClick={() => handleActions()}
              >
                Thêm Nhân viên
              </Button>

              <IconButton sx={{ borderRadius: '50%', backgroundColor: '#f0f0f0' }}>
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
        {!isLoading && (
          <>
            <DataTable rows={data.data.users} columns={columns} />
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
          </>
        )}
        {openAdd && <AddUser listRole={dataRole} onClose={handleCloseAdd} onSubmitSuccess={handleSubmitSuccess} />}
        {openDialog && (
          <AddUser initialValues={selectedUser} onClose={handleCloseDialog} onSubmitSuccess={handleSuccessSubmit} />
        )}
      </Paper>
    </>
  );
}

export default ListUser;
