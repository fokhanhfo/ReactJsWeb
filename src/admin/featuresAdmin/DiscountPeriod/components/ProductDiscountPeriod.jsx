'use client';

import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';
import { useDispatch, useSelector } from 'react-redux';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
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
import { useAddAllDiscountUserMutation } from 'hookApi/discountUserApi';
import { formatPrice, handleGlobalError, handleGlobalSuccess, imageMainProduct } from 'utils';
import { useSnackbar } from 'notistack';
import { useGetProductsQuery } from 'hookApi/productApi';
import CloseIcon from '@mui/icons-material/Close';
import {
  useAddAllDiscountProductPeriodMutation,
  useDeleteDiscountProductPeriodMutation,
} from 'hookApi/discountProductPeriod';
import { render } from '@testing-library/react';
import queryString from 'query-string';
import { useLocation, useNavigate } from 'react-router-dom';

ProductDiscountPeriod.propTypes = {
  discountsProduct: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  actionsState: PropTypes.object.isRequired,
  idDiscount: PropTypes.number,
  onSubmit: PropTypes.func,
  discountPeriod: PropTypes.object,
};

function ProductDiscountPeriod({ onSubmit, idDiscount, discountsProduct, loading, actionsState, discountPeriod }) {
  const [selectedDiscountUser, setSelectedDiscountUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isOpenDiaLog, setIsOpenDiaLog] = useState(false);
  const [percentageValue, setPercentageValue] = useState(discountPeriod.minPercentageValue);
  const [percentageValueError, setPercentageValueError] = useState('');
  const [category, setCategory] = React.useState('');
  const [sortPrice, setSortPrice] = React.useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const categoryQuery = useSelector((state) => state.categoryApi.queries['getCategory(undefined)']);
  const [countProducts, setCountProducts] = useState(0);
  const [selectValueProduct, setSelectValueProduct] = useState({});
  const theme = useTheme();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [deleteDiscountProductPeriod, { isLoading: isLoadingDiscountUser, isSuccess, isError }] =
    useDeleteDiscountProductPeriodMutation();

  const queryParams = useMemo(() => {
    const params = queryString.parse(location.search);
    return {
      page: Number.parseInt(params.page) || 1,
      limit: rowsPerPage || 10,
      idDiscountPeriod: idDiscount,
      ...params,
    };
  }, [location.search, rowsPerPage]);

  console.log('rowPerPage', rowsPerPage);

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

  const { data, error, isLoading, refetch } = useGetProductsQuery(queryParams);
  const [addAllDiscountUser] = useAddAllDiscountUserMutation();
  const [addAllDiscountProductPeriod] = useAddAllDiscountProductPeriodMutation();

  const handleActions = (state, row) => {
    if (state === 'edit' || state === 'view') {
      setSelectedDiscountUser(row);
    }
    handleAction(state, dispatch, actionsState);
  };

  const handleSelectionChange = (newSelectionModel) => {
    const selectedRows = data?.data?.products.filter((row) => newSelectionModel.includes(row.id));
    setSelectValueProduct(selectedRows);
    setSelectedProducts(newSelectionModel);
  };

  const getSelectedProductIds = () => {
    return selectedProducts;
  };

  const handleAddProduct = async (percentageValue) => {
    try {
      const invalidProducts = selectValueProduct.filter((product) => {
        const priceAfterDiscount = product.sellingPrice * (1 - percentageValue / 100);
        return priceAfterDiscount < product.importPrice;
      });

      if (invalidProducts.length > 0) {
        const productNames = invalidProducts.map((p) => p.name).join(', ');
        enqueueSnackbar(`Không thể áp dụng vì giá sau giảm thấp hơn giá mua: ${productNames}`, { variant: 'warning' });
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(true);
      const selectedIds = getSelectedProductIds();
      const newData = {
        discountPeriod: { id: idDiscount },
        percentageValue: selectedIds.map((id) => ({ product: { id: id }, percentageValue })),
      };
      const response = await addAllDiscountProductPeriod(newData);
      refetch();
      if (onSubmit) {
        onSubmit();
      }
      enqueueSnackbar('Áp mã thành công', { variant: 'success' });
      setTimeout(() => {
        setIsSubmitting(false);
        setSelectedProducts([]); // Reset selection after adding
      }, 1000);
    } catch (error) {
      enqueueSnackbar('Update trạng thái không thành công', { variant: 'error' });
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDiscountProductPeriod(id).unwrap();
      enqueueSnackbar('Xóa thành công', { variant: 'success' });
      refetch();
      if (onSubmit) {
        onSubmit();
      }
    } catch (error) {
      enqueueSnackbar('Xóa không thành công', { variant: 'error' });
    }
  };

  const handleAction = () => {
    data && setIsOpenDiaLog(false);
  };

  const validatePercentageValue = (percentageValue) => {
    const trimmedValue = String(percentageValue).trim();
    if (!trimmedValue) {
      setPercentageValueError('Giá trị % không được để trống');
      return false;
    }

    const numericValue = Number(trimmedValue);

    if (isNaN(numericValue)) {
      setPercentageValueError('Giá trị % phải là số hợp lệ');
      return false;
    }

    if (numericValue < discountPeriod.minPercentageValue) {
      setPercentageValueError(`Giá trị % phải >= ${discountPeriod.minPercentageValue}`);
      return false;
    }

    if (numericValue > discountPeriod.maxPercentageValue) {
      setPercentageValueError(`Giá trị % phải <= ${discountPeriod.maxPercentageValue}`);
      return false;
    }

    setPercentageValueError('');
    return true;
  };

  const validateForm = () => {
    const isPercentageValueValid = validatePercentageValue(percentageValue);

    return isPercentageValueValid;
  };

  const handleClick = async () => {
    if (!validateForm()) {
      return;
    }

    await handleAddProduct(percentageValue);

    data && setIsOpenDiaLog(false);
  };

  const handleCategory = (event) => {
    const value = event.target.value;
    setCategory(value);

    const newFilter = { ...queryParams };

    if (value === '') {
      delete newFilter.category;
    } else {
      newFilter.category = value;
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

  const handleSortPrice = (event) => {
    const value = event.target.value;
    setSortPrice(value);

    const newFilter = { ...queryParams };

    if (value === '') {
      delete newFilter.sort;
    } else {
      newFilter.sort = value;
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

  const listHead = [
    { label: 'ID', key: 'id', width: '5%' },
    {
      label: 'Tên sản phẩm',
      key: 'product',
      flex: 1,
      render: (params) => {
        const imageURL = imageMainProduct(params.product.productDetails);
        return (
          <Box display="flex" alignItems="center" gap={1}>
            <img
              src={imageURL?.imageUrl}
              alt=""
              style={{
                width: 40,
                height: 40,
                objectFit: 'cover',
                borderRadius: 4,
              }}
            />
            <span
              style={{ cursor: 'pointer', fontWeight: 500 }}
              // onClick={() => handleActions('view', params.product)}
            >
              {params.product.name}
            </span>
          </Box>
        );
      },
    },
    {
      label: 'Giá trị % giảm ',
      key: 'percentageValue',
      flex: 1,
      render: (params) => <>{params.percentageValue}%</>,
      // render: (params) => {
      //   const imageURL = imageMainProduct(params.product.productDetails);
      //   return (
      //     <Box display="flex" alignItems="center" gap={1}>
      //       <img
      //         src={imageURL?.imageUrl}
      //         alt=""
      //         style={{
      //           width: 40,
      //           height: 40,
      //           objectFit: 'cover',
      //           borderRadius: 4,
      //         }}
      //       />
      //       <span
      //         style={{ cursor: 'pointer', fontWeight: 500 }}
      //         // onClick={() => handleActions('view', params.product)}
      //       >
      //         {params.product.name}
      //       </span>
      //     </Box>
      //   );
      // },
    },
    {
      label: 'Giá nhập sản phẩm',
      width: '5%',
      render: (param) => <>{formatPrice(param.product.importPrice)}</>,
    },
    {
      label: 'Giá sản phẩm',
      width: '5%',
      render: (param) => <>{formatPrice(param.product.sellingPrice)}</>,
    },
    {
      label: 'Giá sau giảm',
      width: '5%',
      render: (param) => {
        const price = param.product.sellingPrice;
        const discount = (price * param.percentageValue) / 100;
        return <>{formatPrice(price - discount)}</>;
      },
    },
    {
      label: 'Thao tác',
      key: 'actions',
      width: '10%',
      render: (row) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          <Tooltip title="Chỉnh sửa">
            <IconButton
              // onClick={() => handleActions('edit', row)}
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
    {
      field: 'name',
      headerName: 'Name',
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => {
        const imageURL = imageMainProduct(params.row.productDetails);
        return (
          <Box display="flex" alignItems="center" gap={1}>
            <img
              src={imageURL?.imageUrl}
              alt=""
              style={{
                width: 40,
                height: 40,
                objectFit: 'cover',
                borderRadius: 4,
              }}
            />
            <span
              style={{ cursor: 'pointer', fontWeight: 500 }}
              // onClick={() => handleActions('view', params.row)}
            >
              {params.row.name}
            </span>
          </Box>
        );
      },
    },
    {
      field: 'importPrice',
      headerName: 'Giá nhập',
      flex: 1,
      minWidth: 120,
      valueGetter: (params) => {
        return formatPrice(params);
      },
    },
    {
      field: 'sellingPrice',
      headerName: 'Giá bán',
      flex: 1,
      minWidth: 120,
      valueGetter: (params) => {
        return formatPrice(params);
      },
    },
    // {
    //   field: 'quantity',
    //   headerName: 'Quantity',
    //   width: 120,
    //   valueGetter: (params) => {
    //     return params.row.productDetails?.reduce((sum, pd) => sum + pd.quantity, 0);
    //   },
    // },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => params?.name,
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 100,
      minWidth: 80,
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

  useEffect(() => {
    if (data?.data?.count) {
      setCountProducts(data.data.count);
    }
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* First Card: Users with discounts */}
      <Card elevation={2} sx={{ borderRadius: 2, overflow: 'visible' }}>
        <CardHeader
          title="Danh sách sản phẩm được giảm giá"
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
            <ReusableTable listHead={listHead} rows={discountsProduct} />
          )}
        </CardContent>
      </Card>

      {/* Second Card: Users without discounts */}
      <Card elevation={2} sx={{ borderRadius: 2, overflow: 'visible' }}>
        <CardHeader
          title="Danh sách sản phẩm chưa áp dụng"
          titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
          action={
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              disabled={selectedProducts.length === 0 || isSubmitting}
              onClick={() => setIsOpenDiaLog(true)}
              sx={{ mr: 2 }}
            >
              {isSubmitting
                ? 'Đang thêm...'
                : `Thêm ${selectedProducts.length > 0 ? `(${selectedProducts.length})` : ''}`}
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
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm sản phẩm..."
                InputProps={{
                  startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                  Show:
                </Typography>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(e.target.value)}
                    displayEmpty
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value={countProducts}>Tất cả</MenuItem>
                    <MenuItem value={10}>10 Items</MenuItem>
                    <MenuItem value={20}>20 Items</MenuItem>
                    <MenuItem value={50}>50 Items</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                  <InputLabel>Danh mục</InputLabel>
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
                  <InputLabel>Giá</InputLabel>
                  <Select value={sortPrice} label="Giá" onChange={(e) => handleSortPrice(e)}>
                    <MenuItem value="">Bỏ chọn</MenuItem>
                    <MenuItem value="sellingPrice:desc">Giảm dần</MenuItem>
                    <MenuItem value="sellingPrice:asc">Tăng dần</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <Loading />
            </Box>
          ) : (
            <DataGrid
              rows={data?.data?.products || []}
              columns={columns}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              checkboxSelection
              onRowSelectionModelChange={handleSelectionChange}
              rowSelectionModel={selectedProducts}
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
      <Dialog aria-labelledby="customized-dialog-title" open={isOpenDiaLog}>
        <DialogTitle sx={{ m: 0, p: 2 }}>Giá trị % giảm</DialogTitle>
        <IconButton aria-label="close" onClick={handleAction} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleClick();
          }}
        >
          <DialogContent dividers>
            <Box display="flex" gap={2} flexDirection="column">
              <TextField
                label={`Điền giá trị từ ${discountPeriod.minPercentageValue} đến ${discountPeriod.maxPercentageValue}`}
                value={percentageValue}
                onChange={(e) => {
                  setPercentageValue(e.target.value);
                  if (percentageValueError) validatePercentageValue(e.target.value);
                }}
                onBlur={() => validatePercentageValue(percentageValue)}
                error={!!percentageValueError}
                helperText={percentageValueError}
                fullWidth
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClick} disabled={!percentageValue}>
              Thêm
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default ProductDiscountPeriod;
