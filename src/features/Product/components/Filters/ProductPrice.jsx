import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, TextField, Typography, Slider, InputAdornment } from '@mui/material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import styled from '@emotion/styled';

// Styled components
const Container = styled(Box)`
  width: 236px;
`;

const StyledBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  margin-top: 8px;
`;

const StyledTextField = styled(TextField)`
  flex: 1;
  .MuiInputBase-input {
    font-size: 13px;
    padding: 6px 8px;
  }
`;

const ArrowIconWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
`;

function formatPrice(value) {
  return value.toLocaleString('vi-VN');
}

function ProductPrice({ onChange }) {
  const [price, setPrice] = useState({
    salePrice_gte: '',
    salePrice_lte: '',
  });

  const [sliderValue, setSliderValue] = useState([0, 10000000]);

  const handleTextFieldChange = (evt) => {
    const { name, value } = evt.target;
    const numericValue = Number(value.replace(/\D/g, ''));

    const newPrice = {
      ...price,
      [name]: numericValue,
    };

    setPrice(newPrice);

    // Update slider accordingly
    setSliderValue([newPrice.salePrice_gte || 0, newPrice.salePrice_lte || 10000000]);
  };

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
    setPrice({
      salePrice_gte: newValue[0],
      salePrice_lte: newValue[1],
    });
  };

  const handleSubmit = () => {
    if (onChange) {
      onChange(price);
    }
  };

  return (
    <Container>
      <Typography variant="subtitle2" fontWeight={600}>
        Giá
      </Typography>

      {/* Slider */}
      <Box mt={1} mb={2}>
        <Slider
          value={sliderValue}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          min={0}
          max={10000000}
          step={100000}
          valueLabelFormat={(value) => `${formatPrice(value)} đ`}
          size="small"
        />
      </Box>

      {/* TextFields */}
      <StyledBox>
        <StyledTextField
          name="salePrice_gte"
          value={price.salePrice_gte}
          onChange={handleTextFieldChange}
          size="small"
          placeholder="Từ"
          type="text"
          InputProps={{
            endAdornment: <InputAdornment position="end">đ</InputAdornment>,
          }}
        />
        <ArrowIconWrapper>
          <ArrowRightAltIcon fontSize="small" />
        </ArrowIconWrapper>
        <StyledTextField
          name="salePrice_lte"
          value={price.salePrice_lte}
          onChange={handleTextFieldChange}
          size="small"
          placeholder="Đến"
          type="text"
          InputProps={{
            endAdornment: <InputAdornment position="end">đ</InputAdornment>,
          }}
        />
      </StyledBox>

      {/* Filter Button */}
      <Button
        variant="contained"
        fullWidth
        color="primary"
        onClick={handleSubmit}
        size="small"
        sx={{ mt: 1, fontSize: '13px', textTransform: 'none' }}
      >
        Lọc
      </Button>
    </Container>
  );
}

ProductPrice.propTypes = {
  onChange: PropTypes.func,
};

export default ProductPrice;
