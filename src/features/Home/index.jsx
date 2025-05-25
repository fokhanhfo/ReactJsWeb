import React from 'react';
import PropTypes from 'prop-types';
import SliderHome from './components/SliderHome';
import ProductHome from './components/ProductHome';
import { Container, Paper } from '@mui/material';

HomeFeatures.propTypes = {};

const images = [
  'https://dashboard.leanow.vn/upload/3-2024/1710751498751.webp',
  'https://dashboard.leanow.vn/upload/10-2023/1697646329905.webp',
  'https://dashboard.leanow.vn/upload/9-2023/1695398469078.webp',
  'https://dashboard.leanow.vn/upload/7-2023/1690294640922.webp',
  'https://dashboard.leanow.vn/upload/8-2024/1723171967680.webp',
  'https://dashboard.leanow.vn/upload/6-2024/1718965436093.webp',
];

function HomeFeatures(props) {
  return (
    <>
      <Container maxWidth={false} sx={{ maxWidth: '1400px', padding: '20px 0' }}>
        <SliderHome images={images} />
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
