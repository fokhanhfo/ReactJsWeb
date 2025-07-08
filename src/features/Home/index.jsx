import React from 'react';
import PropTypes from 'prop-types';
import SliderHome from './components/SliderHome';
import ProductHome from './components/ProductHome';
import { Container, Paper } from '@mui/material';

HomeFeatures.propTypes = {};

const images = [
  'https://dashboard.leanow.vn/upload/3-2024/1710751498751.webp',
  'https://dashboard.leanow.vn/upload/6-2025/1749015250329.webp',
  'https://dashboard.leanow.vn/upload/4-2025/1743559354911.webp',
  'https://dashboard.leanow.vn/upload/3-2025/1742440519787.webp',
  'https://dashboard.leanow.vn/upload/10-2024/1729789351911.webp',
  'https://dashboard.leanow.vn/upload/10-2023/1697646329905.webp',
];

function HomeFeatures(props) {
  return (
    <>
      <Container maxWidth={false} sx={{ maxWidth: '1400px', padding: '20px 0' }}>
        <SliderHome images={images} autoPlayInterval={3000} pauseOnHover={true} />
      </Container>
      <Paper>
        <Container maxWidth={false} sx={{ maxWidth: '1400px', padding: '20px 0' }}>
          <ProductHome />
        </Container>
      </Paper>
    </>
  );
}

export default HomeFeatures;
