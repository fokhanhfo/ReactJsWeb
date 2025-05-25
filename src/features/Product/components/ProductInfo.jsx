import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardMedia,
  Rating,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { AddShoppingCart, Remove, Add } from '@mui/icons-material';
import { useAddToCartMutation } from 'features/Cart/cartApi';
import { useSnackbar } from 'notistack';
import { formatPrice } from 'utils';
import styled from '@emotion/styled';
import * as yup from 'yup';
import { useGetSizeQuery } from 'hookApi/sizeApi';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const QuantityBox = styled(Box)`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
`;

function ProductInfo({ product = {} }) {
  const { id, name, detail, price, quantity, category, productDetails = [] } = product;
  const { handleSubmit, setValue, watch } = useForm({ defaultValues: { color: null, size: null, amount: 1 } });

  const { enqueueSnackbar } = useSnackbar();
  const [addToCart] = useAddToCartMutation();
  const { data: sizes, error: sizesError, isLoading: sizesLoading } = useGetSizeQuery();

  const selectedColor = watch('color');
  const selectedSize = watch('size');
  const amount = watch('amount');
  const [sizesShow, setSizesShow] = useState([sizes]);
  const [isSize, setIsSize] = useState([]);
  const [productChoise, setProductChoise] = useState();
  const [valueStar, setValueStar] = React.useState(2);

  useEffect(() => {
    if (selectedColor) {
      handleChangeListSize(selectedColor);
    }
    const listSize = product.productDetails.flatMap((productDetail) => {
      return productDetail.productDetailSizes.map((productDetailSize) => productDetailSize.size.name);
    });

    setIsSize([...new Set(listSize)]);
  }, [selectedColor]);

  const onSubmit = async (data) => {
    if (!data.color) {
      enqueueSnackbar('Vui lòng chọn màu!', { variant: 'error' });
      return;
    }
    if (!data.size) {
      enqueueSnackbar('Vui lòng chọn size!', { variant: 'error' });
      return;
    }

    const productDetail = product.productDetails.find((item) => item.color.id === data.color.id);
    const newItem = {
      productDetail,
      quantity: data.amount,
      color: data.color,
      size: productDetail.productDetailSizes.find((item) => item.size.name === data.size).size,
    };
    console.log(newItem);
    try {
      const response = await addToCart(newItem).unwrap();
      enqueueSnackbar(response?.message || 'Thêm vào giỏ hàng thành công!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error?.data?.message || 'Không thể thêm vào giỏ hàng', { variant: 'error' });
    }
  };

  const handleChangeListSize = (color) => {
    const productDetail = product.productDetails.find((item) => item.color.id === color.id);
    if (!productDetail) return;

    const availableSizes = productDetail.productDetailSizes
      .filter((item) => item.quantity > 0)
      .map((item) => item.size)
      .sort((a, b) => a.name.localeCompare(b.name));

    setSizesShow(availableSizes);
  };

  const hanldProductChoise = (size) => {
    const productDetail = product.productDetails.find((item) => item.color.id === selectedColor.id);
    const quantityProductDetail = productDetail.productDetailSizes.find((item) => item.size.name === size);
    const newItem = {
      productDetail,
      quantity: amount,
      color: selectedColor,
      size: size,
      quantityProduct: quantityProductDetail?.quantity,
    };
    setProductChoise(newItem);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom mb={2}>
        {name}
      </Typography>
      <Rating
        name="simple-controlled"
        value={valueStar}
        onChange={(event, newValue) => {
          setValueStar(newValue);
        }}
        sx={{
          color: 'black', // màu sao đã chọn
          '& .MuiRating-iconFilled': {
            color: 'black', // sao được chọn
          },
          mb: 2,
        }}
      />
      <Typography variant="h5" fontWeight={500} mb={2}>
        {formatPrice(productDetails[0]?.sellingPrice || price)}
      </Typography>
      {/* <Typography variant="body1" color="textSecondary" mt={1} mb={2}>
        Hãng: {category?.name || 'Không rõ'}
      </Typography> */}
      <Typography
        dangerouslySetInnerHTML={{ __html: detail }}
        sx={{
          mb: 2,
          color: '#555',
          fontSize: '1rem',
          lineHeight: 1.6,
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 3, // Hiển thị tối đa 3 dòng
        }}
      />

      {/* Chọn màu */}
      <Typography fontWeight={600}>Chọn màu: {selectedColor ? selectedColor.name : ''}</Typography>
      <Grid container spacing={1} mb={2}>
        {productDetails.map((value, index) => {
          const mainImage = value.image.find((img) => img.mainColor);
          return (
            <Grid item key={index}>
              <Card
                sx={{
                  maxWidth: 60,
                  cursor: 'pointer',
                  border: selectedColor?.id === value.color.id ? '2px solid blue' : '1px solid #ddd',
                }}
                onClick={() => setValue('color', value.color)}
              >
                <CardMedia
                  component="img"
                  sx={{ width: 60, height: 60, objectFit: 'cover' }}
                  image={mainImage?.imageUrl || ''}
                  alt={value.color.name}
                />
              </Card>
              <Typography m={1} variant="body2" align="center">
                {value.color.name}
              </Typography>
            </Grid>
          );
        })}
      </Grid>

      {/* Chọn size */}
      <Typography fontWeight={600}>Chọn size:</Typography>
      <Grid container spacing={1} mb={2}>
        {isSize.map((sizeObj, i) => {
          const isAvailable = sizesShow.map((size) => size?.name).includes(sizeObj);
          const isSelected = selectedSize === sizeObj;
          return (
            <Grid item key={i}>
              <Card
                sx={{
                  maxWidth: 40,
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #1976d2' : '1px solid #ddd',
                  textAlign: 'center',
                  opacity: isAvailable ? 1 : 0.5,
                }}
                onClick={() => {
                  if (selectedColor) {
                    isAvailable && setValue('size', sizeObj);
                    hanldProductChoise(sizeObj);
                  }
                }}
              >
                <Box width={40} height={40} display="flex" alignItems="center" justifyContent="center">
                  <Typography>{sizeObj}</Typography>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Chọn số lượng */}
      <Grid container alignItems="center" spacing={2} mb={3}>
        <Grid item>
          <Typography fontWeight={500}>Số lượng:</Typography>
        </Grid>
        <Grid item>
          <QuantityBox>
            <Button size="small" onClick={() => setValue('amount', Math.max(1, amount - 1))}>
              <Remove fontSize="small" />
            </Button>
            <Box width={40} textAlign="center">
              {amount}
            </Box>
            <Button size="small" onClick={() => setValue('amount', amount + 1)}>
              <Add fontSize="small" />
            </Button>
          </QuantityBox>
        </Grid>
        <Grid item>
          <Typography variant="body2" color="textSecondary">
            {quantity} sản phẩm có sẵn
          </Typography>
        </Grid>
      </Grid>

      {/* Nút thêm vào giỏ hàng */}
      <Button
        variant="contained"
        color="error"
        startIcon={<AddShoppingCart />}
        fullWidth
        sx={{ py: 1.5 }}
        onClick={handleSubmit(onSubmit)}
      >
        <Typography fontWeight={600}>THÊM VÀO GIỎ HÀNG</Typography>
      </Button>
      <Divider sx={{ my: 2 }} />

      <Box>
        <Accordion
        // sx={{
        //   boxShadow: 'none', // Loại bỏ đổ bóng
        //   backgroundColor: 'transparent', // Loại bỏ màu nền
        // }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="policy-content" id="policy-header">
            <Typography fontWeight="bold">CHÍNH SÁCH GIAO HÀNG & THANH TOÁN</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" gutterBottom>
              Khách hàng mua hàng tại SSSUTTER có thể thanh toán bằng 3 hình thức sau:
            </Typography>
            <Typography variant="body2" gutterBottom>
              1. Trả tiền khi nhận hàng (COD): khi nhận được hàng, người nhận hàng sẽ thanh toán trực tiếp cho người
              giao hàng. Khoản thanh toán bao gồm tiền hàng và phí giao hàng cho vận chuyển.
            </Typography>
            <Typography variant="body2" gutterBottom>
              2. Thanh toán qua ví ShopeePay.
            </Typography>
            <Typography variant="body2" gutterBottom>
              3. Thanh toán bằng thẻ ATM nội địa/thẻ thanh toán quốc tế Visa, MasterCard.
            </Typography>

            {/* Bảng thông tin giao hàng */}
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>KHU VỰC</TableCell>
                    <TableCell>PHÍ GIAO HÀNG</TableCell>
                    <TableCell>THỜI GIAN VẬN CHUYỂN</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Nội thành Hà Nội & TP. Hồ Chí Minh</TableCell>
                    <TableCell>Đồng giá 30.000Đ</TableCell>
                    <TableCell>1-2 ngày làm việc</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Ngoại thành Hà Nội & TP. Hồ Chí Minh</TableCell>
                    <TableCell>Đồng giá 30.000Đ</TableCell>
                    <TableCell>3-7 ngày làm việc</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Các tỉnh thành khác</TableCell>
                    <TableCell>Đồng giá 30.000Đ</TableCell>
                    <TableCell>5-7 ngày làm việc</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}

ProductInfo.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ProductInfo;
