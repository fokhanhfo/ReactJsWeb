'use client';

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AddShoppingCart, Remove, Add } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useGetSizeQuery } from 'hookApi/sizeApi';
import { formatPrice } from 'utils';
import { useCart } from '../CartContext';

ProductDetail.propTypes = {
  isChoise: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func,
  product: PropTypes.object,
};

function ProductDetail({ isChoise, onSubmit, product }) {
  const { productDetails = [] } = product;
  const { handleSubmit, setValue, watch } = useForm({
    defaultValues: { color: null, size: null, amount: 1, idProductDetail: null },
  });

  const { enqueueSnackbar } = useSnackbar();
  const { data: sizes } = useGetSizeQuery();
  const { addToCart: addToCartContext } = useCart();

  const [productChoise, setProductChoise] = useState();
  const [isSize, setIsSize] = useState([]);
  const [sizesShow, setSizesShow] = useState([sizes]);

  const selectedColor = watch('color');
  const selectedSize = watch('size');
  const amount = watch('amount');

  const handleClose = () => {
    if (onSubmit) onSubmit();
  };

  useEffect(() => {
    if (selectedColor) handleChangeListSize(selectedColor);

    const listSize = productDetails.flatMap((detail) => detail.productDetailSizes.map((size) => size.size.name));
    setIsSize([...new Set(listSize)]);
  }, [selectedColor]);

  const onSubmitCart = (data) => {
    if (!data.color) {
      enqueueSnackbar('Vui lòng chọn màu!', { variant: 'error' });
      return;
    }
    if (!data.size) {
      enqueueSnackbar('Vui lòng chọn size!', { variant: 'error' });
      return;
    }

    const productDetail = productDetails.find((item) => item.color.id === data.color.id);
    const newItem = {
      productDetail,
      quantity: data.amount,
      color: data.color,
      size: data.size,
      productDiscountPeriods: product.productDiscountPeriods,
    };

    setProductChoise(newItem);
    addToCartContext(newItem);
  };

  const handleChangeListSize = (color) => {
    const productDetail = productDetails.find((item) => item.color.id === color.id);
    if (!productDetail) return;

    const availableSizes = productDetail.productDetailSizes
      .filter((item) => item.quantity > 0)
      .map((item) => item.size)
      .sort((a, b) => a.name.localeCompare(b.name));

    setSizesShow(availableSizes);
  };

  const handleProductChoice = (size) => {
    const productDetail = productDetails.find((item) => item.color.id === selectedColor.id);
    const quantityProductDetail = productDetail.productDetailSizes.find((item) => item.size.name === size);

    const newItem = {
      productDetail,
      quantity: amount,
      sellingPrice: productDetail.product.sellingPrice,
      color: selectedColor,
      size,
      quantityProduct: quantityProductDetail?.quantity,
    };

    setProductChoise(newItem);
  };

  console.log('productChoise', productChoise);

  return (
    <Dialog
      open={isChoise}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: 'white',
          color: 'black',
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 2,
          pb: 1,
          fontSize: '1.25rem',
          fontWeight: 600,
          color: 'black',
        }}
      >
        {product.name}
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'black',
            '&:hover': { bgcolor: 'grey.100' },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2, pt: 1 }}>
        {/* Color Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: 'black' }}>
            Màu sắc
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {productDetails.map((value, index) => {
              const mainImage = value.image.find((img) => img.mainColor);
              const isSelected = selectedColor?.id === value.color.id;

              return (
                <Box key={index} sx={{ textAlign: 'center' }}>
                  <Card
                    sx={{
                      width: 100,
                      height: 100,
                      cursor: 'pointer',
                      border: isSelected ? '2px solid black' : '1px solid #e0e0e0',
                      borderRadius: 1,
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'black',
                        transform: 'scale(1.05)',
                      },
                    }}
                    onClick={() => setValue('color', value.color)}
                  >
                    <CardMedia
                      component="img"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      image={mainImage?.imageUrl || ''}
                      alt={value.color.name}
                    />
                  </Card>
                  <Typography variant="caption" sx={{ mt: 0.5, color: 'black', fontSize: '0.7rem' }}>
                    {value.color.name}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        <Divider sx={{ my: 2, borderColor: 'grey.300' }} />

        {/* Size Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: 'black' }}>
            Kích thước
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {isSize.map((sizeObj, i) => {
              const isAvailable = sizesShow.map((size) => size?.name).includes(sizeObj);
              const isSelected = selectedSize === sizeObj;

              return (
                <Chip
                  key={i}
                  label={sizeObj}
                  variant={isSelected ? 'filled' : 'outlined'}
                  sx={{
                    minWidth: 40,
                    height: 32,
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? 600 : 400,
                    bgcolor: isSelected ? 'black' : 'transparent',
                    color: isSelected ? 'white' : 'black',
                    borderColor: isSelected ? 'black' : 'grey.400',
                    opacity: isAvailable ? 1 : 0.4,
                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                    '&:hover': isAvailable
                      ? {
                          bgcolor: isSelected ? 'black' : 'grey.100',
                          borderColor: 'black',
                        }
                      : {},
                  }}
                  onClick={() => {
                    if (selectedColor && isAvailable) {
                      setValue('size', sizeObj);
                      handleProductChoice(sizeObj);
                    }
                  }}
                />
              );
            })}
          </Box>
        </Box>

        <Divider sx={{ my: 2, borderColor: 'grey.300' }} />

        {/* Quantity and Price */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'black' }}>
              Số lượng
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              <IconButton
                size="small"
                onClick={() => setValue('amount', Math.max(1, amount - 1))}
                sx={{
                  borderRadius: 0,
                  color: 'black',
                  '&:hover': { bgcolor: 'grey.100' },
                }}
              >
                <Remove fontSize="small" />
              </IconButton>
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  minWidth: 40,
                  textAlign: 'center',
                  borderLeft: '1px solid #e0e0e0',
                  borderRight: '1px solid #e0e0e0',
                  bgcolor: 'grey.50',
                }}
              >
                <Typography variant="body2" fontWeight={600}>
                  {amount}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => setValue('amount', amount + 1)}
                sx={{
                  borderRadius: 0,
                  color: 'black',
                  '&:hover': { bgcolor: 'grey.100' },
                }}
              >
                <Add fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="caption" sx={{ mt: 0.5, color: 'grey.600' }}>
              {productChoise ? productChoise.quantityProduct : 0} có sẵn
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ color: 'grey.600' }}>
              Tổng tiền
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'black' }}>
              {productChoise ? formatPrice(productChoise.sellingPrice * amount) : '0₫'}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          startIcon={<AddShoppingCart />}
          fullWidth
          onClick={handleSubmit(onSubmitCart)}
          sx={{
            py: 1.5,
            fontSize: '0.95rem',
            fontWeight: 600,
            bgcolor: 'black',
            color: 'white',
            borderRadius: 1,
            textTransform: 'none',
            '&:hover': {
              bgcolor: 'grey.800',
            },
            '&:disabled': {
              bgcolor: 'grey.300',
              color: 'grey.500',
            },
          }}
          disabled={!selectedColor || !selectedSize}
        >
          Thêm vào giỏ hàng
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductDetail;
