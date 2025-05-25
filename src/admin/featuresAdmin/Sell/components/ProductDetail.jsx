import React, { useEffect, useState } from 'react';
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

// Component for quantity box styling
const QuantityBox = ({ children, ...props }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      border: '1px solid #ddd',
      borderRadius: '8px',
      overflow: 'hidden',
    }}
    {...props}
  >
    {children}
  </Box>
);

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

  // Close dialog handler
  const handleClose = () => {
    if (onSubmit) onSubmit();
  };

  // Update size list when color changes
  useEffect(() => {
    if (selectedColor) handleChangeListSize(selectedColor);

    const listSize = productDetails.flatMap((detail) => detail.productDetailSizes.map((size) => size.size.name));
    setIsSize([...new Set(listSize)]);
  }, [selectedColor]);

  // Handle adding product to cart
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
    const newItem = { productDetail, quantity: data.amount, color: data.color, size: data.size };

    setProductChoise(newItem);
    addToCartContext(newItem);
  };

  // Update available sizes based on selected color
  const handleChangeListSize = (color) => {
    const productDetail = productDetails.find((item) => item.color.id === color.id);
    if (!productDetail) return;

    const availableSizes = productDetail.productDetailSizes
      .filter((item) => item.quantity > 0)
      .map((item) => item.size)
      .sort((a, b) => a.name.localeCompare(b.name));

    setSizesShow(availableSizes);
  };

  // Update product choice when size changes
  const handleProductChoice = (size) => {
    const productDetail = productDetails.find((item) => item.color.id === selectedColor.id);
    const quantityProductDetail = productDetail.productDetailSizes.find((item) => item.size.name === size);

    const newItem = {
      productDetail,
      quantity: amount,
      color: selectedColor,
      size,
      quantityProduct: quantityProductDetail?.quantity,
    };

    setProductChoise(newItem);
  };

  return (
    <Dialog aria-labelledby="customized-dialog-title" open={isChoise}>
      <DialogTitle sx={{ m: 0, p: 2 }}>{product.name}</DialogTitle>

      <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
        <CloseIcon />
      </IconButton>

      <DialogContent dividers>
        <Box>
          {/* Color Selection */}
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ width: '50%' }}>
              <Typography sx={{ fontWeight: 600, mb: 1.5 }}>Chọn màu:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {productDetails.map((value, index) => {
                  const mainImage = value.image.find((img) => img.mainColor);
                  return (
                    <Box key={index} sx={{ textAlign: 'center' }}>
                      <Card
                        sx={{
                          maxWidth: 60,
                          cursor: 'pointer',
                          border: selectedColor?.id === value.color.id ? '2px solid #1976d2' : '1px solid #ddd',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          },
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
                      <Typography variant="body2" sx={{ mt: 1, fontSize: '0.75rem' }}>
                        {value.color.name}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* Size Selection */}
            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1.5 }}>Chọn size:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {isSize.map((sizeObj, i) => {
                  const isAvailable = sizesShow.map((size) => size?.name).includes(sizeObj);
                  const isSelected = selectedSize === sizeObj;

                  return (
                    <Box
                      key={i}
                      sx={{
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: isSelected ? '2px solid #1976d2' : '1px solid #ddd',
                        borderRadius: '4px',
                        backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                        opacity: isAvailable ? 1 : 0.5,
                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s ease',
                        '&:hover': isAvailable ? { transform: 'translateY(-2px)' } : {},
                      }}
                      onClick={() => {
                        if (selectedColor) {
                          isAvailable && setValue('size', sizeObj);
                          handleProductChoice(sizeObj);
                        }
                      }}
                    >
                      <Typography variant="body2">{sizeObj}</Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>

          {/* Quantity Selection */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ fontWeight: 600, mb: 1.5 }}>Số lượng:</Typography>
            <QuantityBox>
              <Button
                size="small"
                onClick={() => {
                  setValue('amount', Math.max(1, amount - 1));
                  handleProductChoice();
                }}
                sx={{ minWidth: '40px' }}
              >
                <Remove fontSize="small" />
              </Button>
              <Box
                width={40}
                textAlign="center"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {amount}
              </Box>
              <Button
                size="small"
                onClick={() => {
                  setValue('amount', amount + 1);
                  handleProductChoice();
                }}
                sx={{ minWidth: '40px' }}
              >
                <Add fontSize="small" />
              </Button>
            </QuantityBox>
            <Typography variant="body2" color="textSecondary">
              {productChoise ? productChoise.quantityProduct : 0} sản phẩm có sẵn
            </Typography>
          </Box>

          {/* Price Display */}
          <Box sx={{ my: 1, float: 'right' }}>
            <Typography variant="h5" color="error" fontWeight={700}>
              {productChoise ? formatPrice(productChoise.productDetail.sellingPrice * amount) : 0}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      {/* Add to Cart Button */}
      <DialogActions>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddShoppingCart />}
          fullWidth
          sx={{
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: '8px',
            textTransform: 'none',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
            },
          }}
          onClick={handleSubmit(onSubmitCart)}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductDetail;
