import React, { useState } from 'react';
import PropTypes from 'prop-types';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import { Box, Button, TextField, Typography, Divider } from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';
import { useAddToCartMutation } from 'features/Cart/cartApi';
import { useSnackbar } from 'notistack';
import { formatPrice } from 'utils';
import styled from '@emotion/styled';

const StyledContainer = styled(Box)`
  padding: 20px;
`;

const ProductTitle = styled(Typography)`
  margin-bottom: 16px;
  font-weight: bold;
`;

const RatingBox = styled(Box)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

const PriceBox = styled(Typography)`
  margin-bottom: 16px;
  font-size: 24px;
  font-weight: bold;
  color: #d32f2f;
`;

const DetailBox = styled(Typography)`
  margin-bottom: 16px;
  line-height: 1.5;
  color: #555;
`;

const QuantityBox = styled(Box)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

const StyledDivider = styled(Divider)`
  margin: 0 8px;
`;

const AddToCartButton = styled(Button)`
  margin-top: 16px;
`;

function ProductInfo({ product = {} }) {
  const { id, name, detail, price, quantity, category } = product;
  const [amount, setAmount] = useState(1);
  const [addToCart] = useAddToCartMutation();
  const { enqueueSnackbar } = useSnackbar();

  const handleAddToCart = async () => {
    const newItem = {
      product: product,
      quantity: amount,
    };

    try {
      const response = await addToCart(newItem).unwrap();
      enqueueSnackbar(response?.message, { variant: 'success' });
    } catch (error) {
      const errorMessage = error?.data?.message || 'Unable to add to cart';
      console.log(error);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  return (
    <StyledContainer>
      <ProductTitle variant="h5">{name}</ProductTitle>

      <RatingBox>
        <Box display="flex" alignItems="center">
          <Typography component="span" sx={{ marginRight: '4px' }}>
            4
          </Typography>
          {[...Array(4)].map((_, index) => (
            <StarIcon key={index} sx={{ color: 'gold', fontSize: '20px' }} />
          ))}
          <StarHalfIcon sx={{ color: 'gold', fontSize: '20px' }} />
        </Box>
        <StyledDivider orientation="vertical" flexItem />
        <Typography component="span" sx={{ marginRight: '16px' }}>
          4 Đánh giá
        </Typography>
        <StyledDivider orientation="vertical" flexItem />
        <Typography component="span">4 Đã bán</Typography>
      </RatingBox>

      <PriceBox>{formatPrice(price)}</PriceBox>

      <Typography sx={{ marginBottom: '16px' }}>Hãng sản phẩm: {category?.name || 'N/A'}</Typography>

      <DetailBox dangerouslySetInnerHTML={{ __html: detail }} />

      <QuantityBox>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          value={amount}
          onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
          InputProps={{ inputProps: { min: 1 } }}
          sx={{ marginRight: '16px' }}
        />
        <Typography>{quantity} Sản phẩm có sẵn</Typography>
      </QuantityBox>

      <AddToCartButton variant="outlined" startIcon={<AddShoppingCart />} onClick={handleAddToCart}>
        Add to cart
      </AddToCartButton>
    </StyledContainer>
  );
}

ProductInfo.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    detail: PropTypes.string,
    price: PropTypes.number,
    quantity: PropTypes.number,
    category: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
};

export default ProductInfo;
