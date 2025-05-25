'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';
import { useDispatch } from 'react-redux';
import {
  Box,
  IconButton,
  Chip,
  Tooltip,
  useTheme,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Grid,
  Stack,
  alpha,
} from '@mui/material';
import ReusableTable from 'admin/components/Table/ReusableTable';
import { Edit, Delete, CheckCircle, Cancel, Search, Add, PersonAdd } from '@mui/icons-material';
import Loading from 'components/Loading';
import InputField from 'components/form-controls/InputForm';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DataGrid } from '@mui/x-data-grid';
import { useGetUsersQuery } from 'hookApi/userApi';
import { useAddAllDiscountUserMutation, useDeleteDiscountUserMutation } from 'hookApi/discountUserApi';
import { handleGlobalError, handleGlobalSuccess } from 'utils';
import { useSnackbar } from 'notistack';

DiscountUser.propTypes = {
  discountsUser: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  actionsState: PropTypes.object.isRequired,
  idDiscount: PropTypes.number,
  onSubmit: PropTypes.func,
};

function DiscountUser({ onSubmit, idDiscount, discountsUser, loading, actionsState }) {
  const [selectedDiscountUser, setSelectedDiscountUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const theme = useTheme();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDiscountUser, { isLoading: isLoadingDiscountUser, isSuccess, isError }] =
    useDeleteDiscountUserMutation();

  const schema = yup
    .object({
      name: yup.string().required('Bắt buộc'),
    })
    .required();

  const form = useForm({
    defaultValues: {
      name: '',
    },
    resolver: yupResolver(schema),
  });

  const { data, error, isLoading, refetch } = useGetUsersQuery({ idDiscount: idDiscount, page: 1 });
  const [addAllDiscountUser] = useAddAllDiscountUserMutation();

  const handleActions = (state, row) => {
    if (state === 'edit' || state === 'view') {
      setSelectedDiscountUser(row);
    }
    handleAction(state, dispatch, actionsState);
  };

  const handleSelectionChange = (newSelectionModel) => {
    setSelectedUsers(newSelectionModel);
    console.log('Selected user IDs:', newSelectionModel);
  };

  const getSelectedUserIds = () => {
    return selectedUsers;
  };

  const handleAddUsers = async () => {
    try {
      setIsSubmitting(true);
      const selectedIds = getSelectedUserIds();
      const newData = {
        discount: { id: idDiscount },
        users: selectedIds.map((id) => ({ id })),
      };

      const response = await addAllDiscountUser(newData);
      refetch();
      if (onSubmit) {
        onSubmit();
      }
      enqueueSnackbar('Áp mã thành công', { variant: 'success' });
      setTimeout(() => {
        setIsSubmitting(false);
        setSelectedUsers([]); // Reset selection after adding
      }, 1000);
    } catch (error) {
      enqueueSnackbar('Update trạng thái không thành công', { variant: 'error' });
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDiscountUser(id).unwrap();
      enqueueSnackbar('Xóa thành công', { variant: 'error' });
      refetch();
      if (onSubmit) {
        onSubmit();
      }
    } catch (error) {
      enqueueSnackbar('Xóa không thành công', { variant: 'success' });
    }
  };

  const listHead = [
    { label: 'ID', key: 'id', width: '5%' },
    {
      label: 'Trạng thái',
      width: '12%',
      render: (row) => (
        <Chip
          label={row.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
          color={row.status === 1 ? 'success' : 'default'}
          size="small"
          sx={{ fontWeight: 500 }}
        />
      ),
    },
    {
      label: 'Đã sử dụng',
      width: '12%',
      render: (row) =>
        row.used ? (
          <Chip
            icon={<CheckCircle fontSize="small" />}
            label="Đã sử dụng"
            color="primary"
            size="small"
            sx={{ fontWeight: 500 }}
          />
        ) : (
          <Chip
            icon={<Cancel fontSize="small" />}
            label="Chưa sử dụng"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 500 }}
          />
        ),
    },
    { label: 'ID Người dùng', width: '10%', render: (row) => row.users?.id },
    { label: 'Tên Người dùng', width: '15%', render: (row) => row.users?.fullName },
    { label: 'Email', width: '15%', render: (row) => row.users?.email },
    { label: 'Số điện thoại', width: '12%', render: (row) => row.users?.phone },
    { label: 'Tên đăng nhập', width: '12%', render: (row) => row.users?.username },
    {
      label: 'Thao tác',
      key: 'actions',
      width: '10%',
      render: (row) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          <Tooltip title="Chỉnh sửa">
            <IconButton
              onClick={() => handleActions('edit', row)}
              size="small"
              sx={{
                color: theme.palette.primary.main,
                '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa">
            <IconButton
              size="small"
              sx={{
                color: theme.palette.error.main,
                '&:hover': { backgroundColor: alpha(theme.palette.error.main, 0.1) },
              }}
            >
              <Delete fontSize="small" onClick={() => handleDelete(row.id)} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'fullName', headerName: 'Họ và tên', width: 200, flex: 1 },
    { field: 'email', headerName: 'Email', width: 250, flex: 1 },
    { field: 'phone', headerName: 'Số điện thoại', width: 150 },
    { field: 'username', headerName: 'Tên đăng nhập', width: 150 },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 100,
      renderCell: (params) => (
        <Tooltip title="Thêm vào danh sách">
          <IconButton
            size="small"
            sx={{
              color: theme.palette.success.main,
              '&:hover': { backgroundColor: alpha(theme.palette.success.main, 0.1) },
            }}
          >
            <Add fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* First Card: Users with discounts */}
      <Card elevation={2} sx={{ borderRadius: 2, overflow: 'visible' }}>
        <CardHeader
          title="Danh sách người dùng giảm giá"
          titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
          sx={{
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            pb: 1.5,
          }}
        />
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <Loading />
            </Box>
          ) : (
            <ReusableTable listHead={listHead} rows={discountsUser} />
          )}
        </CardContent>
      </Card>

      {/* Second Card: Users without discounts */}
      <Card elevation={2} sx={{ borderRadius: 2, overflow: 'visible' }}>
        <CardHeader
          title="Danh sách người chưa áp dụng"
          titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
          action={
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              disabled={selectedUsers.length === 0 || isSubmitting}
              onClick={handleAddUsers}
              sx={{ mr: 2 }}
            >
              {isSubmitting ? 'Đang thêm...' : `Thêm ${selectedUsers.length > 0 ? `(${selectedUsers.length})` : ''}`}
            </Button>
          }
          sx={{
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            pb: 1.5,
          }}
        />
        <CardContent>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm người dùng..."
                InputProps={{
                  startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                <form style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <InputField name="name" label="Tên người dùng" form={form} size="small" />
                </form>
              </Stack>
            </Grid>
          </Grid>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <Loading />
            </Box>
          ) : (
            <DataGrid
              rows={data?.data?.users || []}
              columns={columns}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              checkboxSelection
              onRowSelectionModelChange={handleSelectionChange}
              rowSelectionModel={selectedUsers}
              sx={{
                border: 0,
                overflowX: 'auto',
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  borderRadius: 1,
                },
                '& .MuiDataGrid-cell:focus-within': {
                  outline: 'none',
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                },
                height: 400,
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Uncomment if you want to add the AddDiscountUser component
      {actionsState.edit === true && selectedDiscountUser !== null && (
        <AddDiscountUser actionsState={actionsState} initialValues={selectedDiscountUser} />
      )}
      */}
    </Box>
  );
}

export default DiscountUser;
