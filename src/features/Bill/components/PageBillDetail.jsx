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
  CardMedia,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDateTime, formatPrice, getStatusNameById, imageMainColor } from 'utils';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { styled } from '@mui/material/styles';
import DataTable from 'admin/components/Table/DataTable';
import { useGetBillByIdQuery, useUpdateBillMutation } from 'hookApi/billApi';
import ColorlibStepIcon from 'components/billDetail/ColorlibStepIcon';
import {
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as LocalShippingIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import BillCancelDialogUser from './BillCancelDialogUser';
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
    borderRadius: 1,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',

    // Responsive line height
    [theme.breakpoints.down('sm')]: {
      height: 2,
    },
  },
}));

function PageBillDetail() {
  const [isCancelBillOpen, setIsCancelBillOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { billId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

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
      price: { sellingPrice: item.sellingPrice, discountPrice: item.discountPrice },
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      total: item.discountPrice ? item.discountPrice * item.quantity : item.sellingPrice * item.quantity,
    };
  });

  const handleUpdateCancelBill = () => {
    setIsCancelBillOpen(true);
  };

  const handleCancelBill = () => {
    setIsCancelBillOpen(false);
  };

  const handleClickCancel = async (note) => {
    const data = { status: 6, id: billId, note: note };
    const response = await updateStatusBill(data);
    if (response) {
      enqueueSnackbar('Update trạng thái thành công', { variant: 'success' });
      refetch();
    } else {
      enqueueSnackbar('Update trạng thái không thành công', { variant: 'error' });
    }
    setIsCancelBillOpen(false);
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Sản phẩm',
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <img
            src={params.row.image}
            alt="product"
            style={{
              width: 75,
              height: 75,
              objectFit: 'cover',
              borderRadius: 8,
            }}
          />
          <span style={{ cursor: 'pointer', fontWeight: 500 }}>{params.value}</span>
        </Box>
      ),
    },
    {
      field: 'price',
      headerName: 'Giá bán',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        const { sellingPrice, discountPrice } = params.value || {};

        const isSamePrice = sellingPrice === discountPrice;

        return (
          <Box width={'100%'} height={'100%'} display={'flex'} flexDirection={'column'} justifyContent={'center'}>
            {isSamePrice ? (
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: 'black', // hoặc màu khác bạn muốn
                }}
              >
                {formatPrice(sellingPrice)}
              </Typography>
            ) : (
              <>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: 'red',
                  }}
                >
                  {formatPrice(discountPrice)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 400,
                    textDecoration: 'line-through',
                    color: 'gray',
                  }}
                >
                  {formatPrice(sellingPrice)}
                </Typography>
              </>
            )}
          </Box>
        );
      },
    },
    {
      field: 'size',
      headerName: 'Size',
      flex: 0.3,
      minWidth: 50,
    },
    {
      field: 'color',
      headerName: 'Màu',
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: 'quantity',
      headerName: 'SL',
      flex: 0.5,
      minWidth: 60,
    },
    {
      field: 'total',
      headerName: 'Tổng',
      flex: 1,
      minWidth: 100,
      valueFormatter: (params) => formatPrice(params),
    },
  ];

  const SummaryItem = ({ label, value, bold = false }) => (
    <Grid container sx={{ py: 1 }}>
      <Grid item xs={6}>
        <Typography variant="body1" sx={{ fontWeight: bold ? 600 : 400 }}>
          {label}
        </Typography>
      </Grid>
      <Grid item xs={6} sx={{ textAlign: 'right' }}>
        <Typography variant="body1" sx={{ fontWeight: bold ? 600 : 400 }}>
          {value}
        </Typography>
      </Grid>
    </Grid>
  );

  const handleBack = () => {
    const returnUrl = localStorage.getItem('bill_return_url');
    if (returnUrl) {
      localStorage.removeItem('bill_return_url');
      window.location.href = returnUrl;
    } else {
      navigate(-1); // fallback nếu không có URL
    }
  };

  const renderMobileProductList = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
      {rows.map((product) => (
        <Card key={product.id} sx={{ borderRadius: 2, boxShadow: 2 }}>
          <CardContent sx={{ display: 'flex', p: 2 }}>
            <CardMedia
              component="img"
              image={product.image}
              alt={product.name}
              sx={{ width: 80, height: 80, borderRadius: 1, mr: 2 }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {product.name}
              </Typography>

              <Grid container spacing={1} sx={{ mt: 1 }}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="textSecondary">
                    Giá:
                  </Typography>
                  <Typography variant="body1">
                    <Box width="100%" height="100%" display="flex" flexDirection="column" justifyContent="center">
                      {product.price.discountPrice ? (
                        <>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: 'red',
                            }}
                          >
                            {formatPrice(product.price.discountPrice)}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 400,
                              textDecoration: 'line-through',
                              color: 'gray',
                            }}
                          >
                            {formatPrice(product.price.sellingPrice)}
                          </Typography>
                        </>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: 'black',
                          }}
                        >
                          {formatPrice(product.price.sellingPrice)}
                        </Typography>
                      )}
                    </Box>
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="textSecondary">
                    Size:
                  </Typography>
                  <Typography variant="body1">{product.size}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="textSecondary">
                    SL:
                  </Typography>
                  <Typography variant="body1">{product.quantity}</Typography>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: '1px solid #eee' }}>
                <Typography variant="body2" color="textSecondary">
                  Màu sắc:
                </Typography>
                <Typography variant="body1">{product.color}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body1" fontWeight={600}>
                  Tổng:
                </Typography>
                <Typography variant="body1" fontWeight={600} color="primary">
                  {formatPrice(product.total)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  // Hiển thị bảng cho màn hình tablet
  const renderTabletTable = () => (
    <TableContainer sx={{ mt: 2, borderRadius: 2, border: '1px solid #e0e0e0', maxHeight: 400 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Sản phẩm</TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Giá bán</TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Size</TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>SL</TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Tổng</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <img
                    src={product.image}
                    alt="product"
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: 'cover',
                      borderRadius: 8,
                      marginRight: 12,
                    }}
                  />
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Màu: {product.color}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Box width="100%" height="100%" display="flex" flexDirection="column" justifyContent="center">
                  {product.price.discountPrice ? (
                    <>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: 'red',
                        }}
                      >
                        {formatPrice(product.price.discountPrice)}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 400,
                          textDecoration: 'line-through',
                          color: 'gray',
                        }}
                      >
                        {formatPrice(product.price.sellingPrice)}
                      </Typography>
                    </>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: 'black',
                      }}
                    >
                      {formatPrice(product.price.sellingPrice)}
                    </Typography>
                  )}
                </Box>
              </TableCell>
              <TableCell>{product.size}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{formatPrice(product.total)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

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
        <Button startIcon={<ArrowBackIcon />} sx={{ color: '#777' }} variant="text" onClick={handleBack}>
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
      {billData.status < 6 && (
        <Paper
          sx={{
            p: isSmallScreen ? 1 : 2,
            background: '#ffffff',
            textAlign: 'center',
            overflow: 'hidden',
          }}
        >
          <Stack sx={{ width: '100%', overflowX: 'auto', py: 1 }}>
            <Stepper
              activeStep={billData.status + 1}
              alternativeLabel
              connector={<ColorlibConnector />}
              sx={{
                minWidth: isSmallScreen ? '550px' : '100%',
                px: isSmallScreen ? 1 : 0,
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={ColorlibStepIcon}
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontSize: isSmallScreen ? '0.65rem' : isMediumScreen ? '0.75rem' : '0.875rem',
                        lineHeight: 1.2,
                        mt: 1,
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Stack>
        </Paper>
      )}
      {/* LEFT: DataGrid */}

      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                border: '1px solid #e0e0e0',
                backgroundColor: '#fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <ShoppingCartIcon fontSize="small" /> Danh sách sản phẩm
              </Typography>

              {/* Hiển thị phù hợp với kích thước màn hình */}
              {isMobile ? (
                renderMobileProductList()
              ) : isTablet ? (
                renderTabletTable()
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: 400,
                    '& .MuiDataGrid-cell': {
                      borderBottom: 'none',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: '#f5f7fa',
                      borderRadius: 1,
                    },
                  }}
                >
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    hideFooter
                    disableSelectionOnClick
                    hideFooterSelectedRowCount
                    rowHeight={80}
                  />
                </Box>
              )}

              {/* Phần tổng kết */}
              <Box
                sx={{
                  width: { xs: '100%', sm: '70%', md: '60%', lg: '60%' },
                  mt: 4,
                  ml: { xs: 0, sm: 'auto' },
                  borderTop: '1px solid #eee',
                  pt: 2,
                  backgroundColor: '#fafafa',
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <SummaryItem label="Tổng sản phẩm:" value={countProductDetail} />
                <SummaryItem label="Tổng tiền hàng:" value={formatPrice(billData.total_price)} />
                {/* Giảm giá khách hàng */}
                <SummaryItem label="Voucher" value={`- ${formatPrice(billData.discountUser)}`} />
                <SummaryItem
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalShippingIcon fontSize="small" /> Phí giao hàng:
                    </Box>
                  }
                  value={formatPrice(30000)}
                />
                {billData.discountShip != 0 && (
                  <SummaryItem label="Giảm phí ship:" value={`- ${billData.discountShip}`} />
                )}
                <SummaryItem
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PaymentIcon fontSize="small" /> Tổng thanh toán:
                    </Box>
                  }
                  value={formatPrice(billData.total_price + 30000 - (billData.discountShip + billData.discountUser))}
                  bold
                />
              </Box>
            </Paper>
          </Grid>

          {/* Thông tin đơn hàng bên phải */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                border: '1px solid #e0e0e0',
                backgroundColor: '#fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                height: '100%',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  pb: 2,
                  borderBottom: '1px solid #eee',
                }}
              >
                Thông tin đơn hàng
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                  Mã đơn hàng
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  #{billData.id}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                  Ngày đặt hàng
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {new Date(billData.createdDate).toLocaleString('vi-VN')}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                  Phương thức thanh toán
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {billData.payMethod === null && 'Thanh toán khi nhận hàng'}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                  Địa chỉ giao hàng
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {billData.address}
                </Typography>
              </Box>

              <Box
                sx={{
                  mt: 4,
                  p: 2,
                  backgroundColor: '#f0f7ff',
                  borderRadius: 2,
                  borderLeft: '3px solid #1976d2',
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                  Ghi chú đơn hàng
                </Typography>
                <Typography variant="body2">{billData.note ? billData.note : 'Không có ghi chú'}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
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
        {billData.status < 2 && (
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
      </Box>
      <BillCancelDialogUser
        isOpen={isCancelBillOpen}
        title="Xác nhận"
        message="Bạn có chắc chắn muốn thực hiện hành động này không?"
        onConfirm={handleClickCancel}
        onCancel={handleCancelBill}
        isLoading={isLoadingUpdate}
      />

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

      {/* <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2 }}>
                <Avatar src="https://via.placeholder.com/150" alt="Customer Avatar" />
                <Box>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {billData?.fullName ? billData.fullName : billData.user.fullName}
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
              </Stack>
              <Box sx={{ mt: 2 }}>
                {billData.address
                  ? billData.address.split(' - ').map((item, index) => (
                      <Typography variant="body1" key={index} color="text.secondary">
                        {item}
                      </Typography>
                    ))
                  : 'Chưa có địa chỉ'}
              </Box>
            </Box>
          </Box>
        </Grid> */}
    </Box>
  );
}

export default PageBillDetail;
