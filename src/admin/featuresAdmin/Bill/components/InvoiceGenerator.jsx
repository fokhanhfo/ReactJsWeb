'use client';
import { Box, Button, Paper, Typography, Stack } from '@mui/material';
import { Download, Print } from '@mui/icons-material';
import jsPDF from 'jspdf';

const InvoiceGenerator = ({ billData, rows }) => {
  // Hàm format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Hàm tính tổng tiền
  const calculateTotal = () => {
    return rows.reduce((sum, item) => sum + item.price * item.quantity, 0);
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

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: '#f8f9fa',
        border: '1px solid #e9ecef',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 2,
          color: '#495057',
        }}
      >
        Xuất hóa đơn
      </Typography>

      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Tạo và tải xuống hóa đơn PDF cho đơn hàng #{billData.id}
      </Typography>

      <Stack direction="row" spacing={2}>
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
          variant="outlined"
          startIcon={<Print />}
          onClick={printPDF}
          sx={{
            borderColor: '#1976d2',
            color: '#1976d2',
            '&:hover': {
              borderColor: '#1565c0',
              backgroundColor: 'rgba(25, 118, 210, 0.04)',
            },
          }}
        >
          In hóa đơn
        </Button>
      </Stack>

      <Box
        sx={{
          mt: 3,
          p: 2,
          backgroundColor: '#e3f2fd',
          borderRadius: 1,
          border: '1px solid #bbdefb',
        }}
      >
        <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
          💡 Lưu ý: Hóa đơn sẽ bao gồm đầy đủ thông tin đơn hàng, danh sách sản phẩm và tổng tiền.
        </Typography>
      </Box>
    </Paper>
  );
};

export default InvoiceGenerator;
