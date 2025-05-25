import PropTypes from 'prop-types';
import { Box, Container, Grid, Typography, Divider } from '@mui/material';
import Product from './Product';
import styled from 'styled-components';

ProductList.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string,
};

const ProductListHeader = styled(Box)`
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProductListTitle = styled(Typography)`
  font-weight: 600;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 3px;
    background-color: #e53935;
    border-radius: 2px;
  }
`;

const ProductGrid = styled(Grid)`
  margin-top: 8px;
`;

const ProductGridItem = styled(Grid)`
  padding: 12px;
  transition: transform 0.2s ease;

  @media (max-width: 600px) {
    padding: 8px;
  }
`;

function ProductList({ data = [], title = 'Featured Products' }) {
  return (
    <>
      <ProductGrid container spacing={2}>
        {data.map((product) => (
          <ProductGridItem item key={product.id} xs={6} sm={4} md={3} lg={2.4}>
            <Product product={product} />
          </ProductGridItem>
        ))}
      </ProductGrid>
    </>
  );
}

export default ProductList;
