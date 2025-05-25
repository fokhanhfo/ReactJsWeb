'use client';

import { useEffect, useState } from 'react';
import billApi from 'api/billApi';
import { useSnackbar } from 'notistack';
import Loading from 'components/Loading';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Divider,
  Container,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
  createTheme,
  ThemeProvider,
  Button,
  Avatar,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Receipt, Person, LocalShipping, CreditCard } from '@mui/icons-material';
import { formatDateTime, formatPrice, getStatusNameById, imageMainColor } from 'utils';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { styled } from '@mui/material/styles';
import DataTable from 'admin/components/Table/DataTable';
import EditIcon from '@mui/icons-material/Edit';
import { optionStatusBill } from 'utils/status';
import ConfirmDialog from 'components/ConfirmDialog/ConfirmDialog';
import { useGetBillByIdQuery, useUpdateBillMutation } from 'hookApi/billApi';
import ColorlibStepIcon from 'components/billDetail/ColorlibStepIcon';
import BillCancelDialog from '../components/BillCancelDialog';
// Create a black and white theme
const blackAndWhiteTheme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
    text: {
      primary: '#000000',
      secondary: '#555555',
    },
    grey: {
      50: '#f8f8f8',
      100: '#f0f0f0',
      200: '#e0e0e0',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#000000',
          color: '#ffffff',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: '#e0e0e0',
        },
      },
    },
  },
});

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#4caf50',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#4caf50',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
    // Chỉnh sửa backgroundColor theo theme nếu muốn.
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
  },
}));

function PageBillDetail() {
  const { enqueueSnackbar } = useSnackbar();
  const { billId } = useParams();
  const [bill, setBill] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCancelBillOpen, setIsCancelBillOpen] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchBillId = async () => {
  //     try {
  //       const response = await billApi.get(billId);
  //       if (response) {
  //         setBill(response.data);
  //       }
  //     } catch (error) {
  //       enqueueSnackbar('Lỗi khi tải hóa đơn', { variant: 'error' });
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchBillId();
  // }, [billId, enqueueSnackbar]);

  const { data, isLoading: isLoadingGet, error, refetch } = useGetBillByIdQuery(billId);
  const billData = data?.data;
  const [updateStatusBill, { isLoading: isLoadingUpdate, isSuccess, isError }] = useUpdateBillMutation();

  if (isLoadingGet) return <Loading />;
  if (!billData)
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5">Không tìm thấy hóa đơn</Typography>
      </Container>
    );

  const steps = ['Đã đặt hàng', 'Chờ phê duyệt', 'Chuẩn bị hàng', 'Vận chuyển', 'Chờ giao hàng', 'Xác nhận Hoàn thành'];

  const rows = billData.billDetail.map((item) => {
    const product = item.productDetail.product;
    const imageUrl = imageMainColor(item.productDetail)?.imageUrl || '/placeholder.svg';

    return {
      id: item.id,
      image: imageUrl,
      name: product.name,
      price: item.productDetail.sellingPrice,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      total: item.productDetail.sellingPrice * item.quantity,
    };
  });

  const columns = [
    {
      field: 'name',
      headerName: 'Sản phẩm',
      flex: 1.5,
      renderCell: (params) => {
        return (
          <Box display="flex" alignItems="center" gap={1}>
            <img
              src={params.row.image}
              alt="product"
              style={{ width: 75, height: 75, objectFit: 'cover', borderRadius: 8 }}
            />
            <span style={{ cursor: 'pointer', fontWeight: 500 }}>{params.value}</span>
          </Box>
        );
      },
    },
    {
      field: 'price',
      headerName: 'Giá bán',
      flex: 1,
      valueFormatter: (params) => formatPrice(params.value),
    },
    { field: 'size', headerName: 'Size', flex: 0.5 },
    { field: 'color', headerName: 'Màu', flex: 0.5 },
    { field: 'quantity', headerName: 'SL', flex: 0.5 },
    {
      field: 'total',
      headerName: 'Tổng',
      flex: 1,
      valueFormatter: (params) => {
        console.log('params', params);
        return formatPrice(params.value);
      },
    },
  ];

  const handleClickStatus = async () => {
    const data = { status: billData.status + 1, id: billId };
    const response = await updateStatusBill(data);
    if (response) {
      enqueueSnackbar('Update trạng thái thành công', { variant: 'success' });
      refetch();
    } else {
      enqueueSnackbar('Update trạng thái không thành công', { variant: 'error' });
    }
    setIsDialogOpen(false);
  };

  const handleClickCancel = async () => {
    const data = { status: 5, id: billId };
    const response = await updateStatusBill(data);
    if (response) {
      enqueueSnackbar('Update trạng thái thành công', { variant: 'success' });
      refetch();
    } else {
      enqueueSnackbar('Update trạng thái không thành công', { variant: 'error' });
    }
    setIsDialogOpen(false);
  };

  const handleUpdateStatus = () => {
    setIsDialogOpen(true);
  };

  const handleUpdateCancelBill = () => {
    setIsCancelBillOpen(true);
  };

  // const handleConfirm = () => {
  //   setIsDialogOpen(false);
  //   alert('Bạn đã đồng ý!');
  // };

  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  const handleCancelBill = () => {
    setIsCancelBillOpen(false);
  };

  const getButtonLabel = (status) => {
    switch (status) {
      case 0:
        return 'Phê duyệt';
      case 1:
        return 'Chuẩn bị hàng';
      case 2:
        return 'Vận chuyển';
      case 3:
        return 'Chờ giao hàng';
      case 4:
        return 'Xác nhận';
    }
  };

  const countProductDetail = billData.billDetail.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Paper
        sx={{
          p: 2,
          background: '#ffffff',
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Button startIcon={<ArrowBackIcon />} sx={{ color: '#777' }} variant="text" onClick={() => navigate(-1)}>
          TRỞ LẠI
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ mr: 2 }}>
            MÃ ĐƠN HÀNG: {billData.id}
          </Typography>
          <Typography variant="body1" sx={{ color: '#ee4d2d', fontWeight: 'bold' }}>
            | {getStatusNameById(billData.status).toLocaleUpperCase()}
          </Typography>
        </Box>
      </Paper>

      <Paper
        sx={{
          p: 2,
          background: '#ffffff',
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Stack sx={{ width: '100%' }} spacing={4}>
          <Stepper activeStep={billData.status + 1} alternativeLabel connector={<ColorlibConnector />}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        {/* LEFT: DataGrid */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              backgroundColor: '#fff',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Danh sách sản phẩm
            </Typography>
            <DataTable rows={rows} columns={columns} />
            <Box width="30%" sx={{ mt: 2, ml: 'auto' }}>
              <Box>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant="body2">Tổng sản phẩm:</Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography variant="body2">{countProductDetail}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant="body2">Tổng tiền:</Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography variant="body2">{formatPrice(billData.total_price)}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant="body2">Phí giao hàng:</Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography variant="body2">{formatPrice(billData.total_price)}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant="body2">Phải trả:</Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography variant="body2">{formatPrice(billData.total_price)}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* RIGHT: Customer Info */}
        {/* <Grid item xs={12} md={5}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              backgroundColor: '#fafafa',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Person sx={{ color: '#000000' }} />
              <Typography variant="h6" sx={{ color: '#000000', fontWeight: 'bold' }}>
                Địa chỉ nhận hàng
              </Typography>
            </Stack>
            <Divider sx={{ mb: 3, height: 2 }} />

            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="body1" sx={{ fontWeight: 'medium', mr: 1 }}>
                  {bill.user.fullName}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    opacity: 0.7,
                    fontSize: '0.875rem',
                  }}
                >
                  (+84) {bill.phone} • {bill.user.email}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  opacity: 0.7,
                  fontSize: '0.875rem',
                }}
              >
                <Box component="span" sx={{ fontWeight: 'medium', color: 'text.primary', opacity: 0.8 }}>
                  Địa chỉ:
                </Box>{' '}
                {bill.address}
              </Typography>
            </Stack>
          </Paper>
        </Grid> */}

        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Customer Details */}
            <Box
              sx={{
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fff',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Thông tin khách hàng
                </Typography>
                {billData.status === 0 && (
                  <Button startIcon={<EditIcon />} size="small" sx={{ textTransform: 'none' }}>
                    Edit
                  </Button>
                )}
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2 }}>
                <Avatar src="https://via.placeholder.com/150" alt="Customer Avatar" />
                <Box>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {billData.user.fullName ? billData.user.fullName : 'admin'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Customer ID: #{billData.user.id}
                  </Typography>
                </Box>
              </Stack>
              <Typography sx={{ mt: 2, fontWeight: 'bold', color: '#1976d2' }}>{countProductDetail} Orders</Typography>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Contact info
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {billData.email ? billData.email : 'khanhkomonny@gmail.com'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Mobile: (+84) {billData.phone}
                </Typography>
              </Box>
            </Box>

            {/* Shipping Address */}
            <Box
              sx={{
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fff',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Địa chỉ giao hàng
                </Typography>
                {billData.status === 0 && (
                  <Button startIcon={<EditIcon />} size="small" sx={{ textTransform: 'none' }}>
                    Edit
                  </Button>
                )}
              </Stack>
              <Box sx={{ mt: 2 }}>
                {billData.address
                  ? billData.address.split(' - ').map((item, index) => (
                      <Typography key={index} color="text.secondary">
                        {item}
                      </Typography>
                    ))
                  : 'Chưa có địa chỉ'}
              </Box>
              <Box
                sx={{
                  position: 'fixed',
                  bottom: 50,
                  right: 50,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2, // Khoảng cách giữa các nút
                  alignItems: 'center', // Căn giữa các nút theo chiều ngang
                }}
              >
                {billData.status === 0 && (
                  <Button
                    variant="contained"
                    color="error"
                    sx={{
                      textTransform: 'none',
                      backgroundColor: '#ff6f61',
                      '&:hover': { backgroundColor: '#ff5a4d' },
                      width: 150,
                    }}
                    onClick={handleUpdateCancelBill}
                  >
                    Từ chối đơn hàng
                  </Button>
                )}
                {billData.status < 5 && (
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      textTransform: 'none',
                      backgroundColor: '#1976d2',
                      '&:hover': { backgroundColor: '#1565c0' },
                      width: 150,
                    }}
                    onClick={handleUpdateStatus}
                  >
                    {getButtonLabel(billData.status)}
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <ConfirmDialog
        isOpen={isDialogOpen}
        title="Xác nhận"
        message="Bạn có chắc chắn muốn thực hiện hành động này không?"
        onConfirm={handleClickStatus}
        onCancel={handleCancel}
        isLoading={isLoadingUpdate}
      />
      <BillCancelDialog
        isOpen={isCancelBillOpen}
        title="Xác nhận"
        message="Bạn có chắc chắn muốn thực hiện hành động này không?"
        onConfirm={handleClickCancel}
        onCancel={handleCancelBill}
        isLoading={isLoadingUpdate}
      />
    </Box>
  );
}

export default PageBillDetail;
