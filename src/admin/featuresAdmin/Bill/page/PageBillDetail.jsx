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
  Dialog,
  DialogContent,
  DialogActions,
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
import { Download, Print } from '@mui/icons-material';
import jsPDF from 'jspdf';
import EditIcon from '@mui/icons-material/Edit';
import { optionStatusBill } from 'utils/status';
import ConfirmDialog from 'components/ConfirmDialog/ConfirmDialog';
import { useGetBillByIdQuery, useUpdateBillMutation } from 'hookApi/billApi';
import ColorlibStepIcon from 'components/billDetail/ColorlibStepIcon';
import BillCancelDialog from '../components/BillCancelDialog';
import {
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as LocalShippingIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import InvoiceGenerator from '../components/InvoiceGenerator';
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
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);

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

  // Hàm tải PDF
  const downloadPDF = () => {
    const doc = generatePDF();
    doc.save(`hoa-don-${billData.id}.pdf`);
  };

  // Hàm in PDF
  const printPDF = () => {
    const doc = generatePDF();
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);

    const printWindow = window.open(pdfUrl);
    printWindow.onload = () => {
      printWindow.print();
    };
  };

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
      valueFormatter: (params) => formatPrice(params),
    },
    { field: 'size', headerName: 'Size', flex: 0.5 },
    { field: 'color', headerName: 'Màu', flex: 0.5 },
    { field: 'quantity', headerName: 'SL', flex: 0.5 },
    {
      field: 'total',
      headerName: 'Tổng',
      flex: 1,
      valueFormatter: (params) => formatPrice(params),
    },
  ];

  const handleClickStatus = async () => {
    const data = { status: billData.status + 1, id: billId };
    const response = await updateStatusBill(data);
    if (response) {
      enqueueSnackbar('Update trạng thái thành công', { variant: 'success' });
      refetch();
      if (billData.status === 1) {
        setIsInvoiceDialogOpen(true);
      }
    } else {
      enqueueSnackbar('Update trạng thái không thành công', { variant: 'error' });
    }
    setIsDialogOpen(false);
  };

  const handleClickCancel = async () => {
    const data = { status: 6, id: billId };
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

  const generatePDF = () => {
    const doc = new jsPDF();

    const normalizeProductName = (str) => {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
    };

    // Sử dụng font Times hỗ trợ Unicode tốt hơn
    doc.setFont('times');

    // Header
    doc.setFontSize(20);
    doc.setFont('times', 'bold');
    doc.text('HOA DON BAN HANG', 105, 20, { align: 'center' });

    // Thông tin công ty (tùy chọn)
    doc.setFontSize(10);
    doc.setFont('times', 'normal');
    doc.text('SHOP THOI TRANG HOANG HAI', 105, 30, { align: 'center' });
    doc.text('Dia chi: 26 Hoa Son, TT. Chuc Son, Chuong My, Ha Noi, Viet Nam', 105, 35, { align: 'center' });

    // Thông tin đơn hàng
    doc.setFontSize(12);
    doc.setFont('times', 'normal');

    let yPosition = 50;

    // Ngày đặt hàng
    doc.setFont('times', 'bold');
    doc.text('Ngay dat:', 105, yPosition);
    doc.text('Ma don hang:', 20, yPosition);
    doc.setFont('times', 'normal');
    doc.text(new Date(billData.createdDate).toLocaleDateString('vi-VN'), 155, yPosition);
    doc.text(`#${billData.id}`, 70, yPosition);

    yPosition += 8;

    // Mã đơn hàng
    doc.setFont('times', 'bold');
    doc.text('Ten khach hàng:', 20, yPosition);
    doc.text('So dien thoai:', 105, yPosition);
    doc.setFont('times', 'normal');
    doc.text(`#${billData.phone}`, 155, yPosition);
    doc.text(`${normalizeProductName(billData.fullName)}`, 70, yPosition);

    yPosition += 8;

    // Phương thức thanh toán
    doc.setFont('times', 'bold');
    doc.text('Thanh toan:', 20, yPosition);
    doc.setFont('times', 'normal');
    const paymentText = billData.payMethod === null ? 'Thanh toan khi nhan hang' : billData.payMethod;
    doc.text(paymentText, 70, yPosition);

    yPosition += 8;

    // Địa chỉ giao hàng
    doc.setFont('times', 'bold');
    doc.text('Dia chi:', 20, yPosition);
    doc.setFont('times', 'normal');

    // Chuyển đổi ký tự có dấu thành không dấu cho địa chỉ
    const normalizeAddress = (str) => {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
    };

    const addressLines = doc.splitTextToSize(normalizeAddress(billData.address), 120);
    doc.text(addressLines, 70, yPosition);
    yPosition += addressLines.length * 5;

    yPosition += 10;

    // Đường kẻ phân cách
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 8;

    // Header bảng sản phẩm
    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.text('STT', 25, yPosition);
    doc.text('San pham', 40, yPosition);
    doc.text('Size', 90, yPosition);
    doc.text('Mau', 105, yPosition);
    doc.text('SL', 125, yPosition);
    doc.text('Don gia', 140, yPosition);
    doc.text('Thanh tien', 170, yPosition);

    yPosition += 3;
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 8;

    // Danh sách sản phẩm
    doc.setFont('times', 'normal');
    doc.setFontSize(9);

    rows.forEach((item, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;

        // Vẽ lại header bảng trên trang mới
        doc.setFont('times', 'bold');
        doc.setFontSize(10);
        doc.text('STT', 25, yPosition);
        doc.text('San pham', 40, yPosition);
        doc.text('Size', 90, yPosition);
        doc.text('Mau', 105, yPosition);
        doc.text('SL', 125, yPosition);
        doc.text('Don gia', 140, yPosition);
        doc.text('Thanh tien', 170, yPosition);
        yPosition += 3;
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 8;
        doc.setFont('times', 'normal');
        doc.setFontSize(9);
      }

      const { sellingPrice, discountPrice } = item.price;
      const quantity = item.quantity;
      const totalSelling = sellingPrice * quantity;
      const totalDiscount = discountPrice * quantity;
      const format = (value) => new Intl.NumberFormat('vi-VN').format(value) + ' VND';

      // STT
      doc.text((index + 1).toString(), 25, yPosition);

      const productLines = doc.splitTextToSize(normalizeProductName(item.name), 60);
      doc.text(productLines, 40, yPosition);

      // Size, màu, số lượng
      doc.text(item.size || '-', 90, yPosition);
      doc.text(item.color || '-', 105, yPosition);
      doc.text(item.quantity.toString(), 125, yPosition);

      // Đơn giá và thành tiền (chỉ hiển thị số)
      const formatPriceForPDF = (price) => {
        const { sellingPrice, discountPrice } = item.price;
        return new Intl.NumberFormat('vi-VN').format(price) + ' VND';
      };

      if (sellingPrice === discountPrice) {
        // không giảm giá
        doc.text(format(sellingPrice), 140, yPosition);
        doc.text(format(totalSelling), 170, yPosition);
      } else {
        // có giảm giá
        const discountText = format(discountPrice);
        const originalText = format(sellingPrice);

        // dòng giá giảm
        doc.text(discountText, 140, yPosition);

        // dòng giá gốc bên dưới
        const originalY = yPosition + 4;
        doc.text(originalText, 140, originalY);

        // vẽ gạch giữa giá gốc
        const textMiddleY = originalY - 1; // giữa chiều cao chữ
        const textWidth = doc.getTextWidth(originalText);
        doc.setLineWidth(0.2);
        doc.setDrawColor(0, 0, 0, 50);
        doc.line(140, textMiddleY, 140 + textWidth, textMiddleY);
        // thành tiền
        doc.text(format(totalDiscount), 170, yPosition);
      }

      yPosition += Math.max(productLines.length * 4, 8);
    });

    yPosition += 5;
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;

    // Tổng tiền
    doc.setFont('times', 'normal');
    doc.setFontSize(10);

    // Tong san pham
    doc.text('Tong san pham:', 140, yPosition);
    doc.text(`${countProductDetail}`, 175, yPosition);

    // Cập nhật yPosition để xuống dòng
    yPosition += 8;

    // Tong tien
    doc.text('Tong tien:', 140, yPosition);
    const formatPriceForPDF = (price) => {
      return new Intl.NumberFormat('vi-VN').format(price) + ' VND';
    };
    doc.text(formatPriceForPDF(billData.total_price), 175, yPosition);

    // Cập nhật yPosition để xuống dòng
    yPosition += 8;

    // Voucher
    doc.text('Voucher:', 140, yPosition);
    doc.text(formatPriceForPDF(billData.discountUser), 175, yPosition);

    // Cập nhật yPosition để xuống dòng
    yPosition += 8;

    // Phi giao hang
    doc.text('Phi giao hang:', 140, yPosition);
    doc.text(formatPriceForPDF(30000), 175, yPosition);

    // Cập nhật yPosition để xuống dòng
    yPosition += 8;

    doc.setFont('times', 'bold');
    // Tong thanh toan
    doc.text('Tong thanh toan:', 140, yPosition);
    doc.text(
      formatPriceForPDF(billData.total_price + 30000 - (billData.discountShip + billData.discountUser)),
      175,
      yPosition,
    );

    yPosition += 15;

    // Ghi chú
    if (billData.note) {
      doc.setFont('times', 'bold');
      doc.setFontSize(10);
      doc.text('Ghi chu:', 20, yPosition);
      yPosition += 8;

      doc.setFont('times', 'normal');
      // Chuyển đổi ghi chú
      const normalizeNote = (str) => {
        return str
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/Đ/g, 'D');
      };
      const noteLines = doc.splitTextToSize(normalizeNote(billData.note), 170);
      doc.text(noteLines, 20, yPosition);
      yPosition += noteLines.length * 5;
    }

    // Footer
    yPosition += 20;
    doc.setFont('times', 'italic');
    doc.setFontSize(8);
    doc.text('Cam on quy khach da mua hang!', 105, yPosition, { align: 'center' });
    doc.text('Hotline: 0977.477.636 | Email: HoangHaiFashion@gmail.com', 105, yPosition + 5, { align: 'center' });

    return doc;
  };

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
                    <Typography variant="body2">Voucher:</Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography variant="body2">{`- ${formatPrice(billData.discountUser)}`}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <LocalShippingIcon fontSize="small" /> Phí giao hàng:
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography variant="body2">{formatPrice(30000)}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <PaymentIcon fontSize="small" /> Tổng thanh toán:
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography variant="body2">
                      {formatPrice(billData.total_price + 30000 - (billData.discountShip + billData.discountUser))}
                    </Typography>
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
          {(billData.status === 0 || billData.status < 5) && (
            <Box
              sx={{
                position: 'fixed',
                bottom: 16,
                right: 16,
                display: 'flex',
                gap: 2, // khoảng cách giữa hai nút
                zIndex: 1000, // đảm bảo nút nổi lên trên
              }}
            >
              {billData.status > 1 && (
                <>
                  <Button
                    variant="contained"
                    startIcon={<Download />}
                    onClick={downloadPDF}
                    sx={{
                      backgroundColor: '#1976d2',
                      '&:hover': {
                        backgroundColor: '#1565c0',
                      },
                    }}
                  >
                    Tải xuống PDF
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<Print />}
                    onClick={printPDF}
                    sx={{
                      backgroundColor: '#1976d2',
                      '&:hover': {
                        backgroundColor: '#1565c0',
                      },
                    }}
                  >
                    In hóa đơn
                  </Button>
                </>
              )}
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
          )}
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
      <Dialog open={isInvoiceDialogOpen} onClose={() => setIsInvoiceDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogContent>
          <Box sx={{ py: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 4,
                textAlign: 'center',
                color: '#1976d2',
              }}
            >
              Quản lý hóa đơn
            </Typography>

            <InvoiceGenerator billData={billData} rows={rows} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsInvoiceDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PageBillDetail;
