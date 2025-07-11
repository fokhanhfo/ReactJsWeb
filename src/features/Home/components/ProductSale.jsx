import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Divider, IconButton, Button, useTheme, useMediaQuery } from '@mui/material';
import { ChevronLeft, ChevronRight, Sort as SortIcon } from '@mui/icons-material';
import ProductSkeletonList from 'features/Product/components/ProductSkeletonList';
import Product from 'features/Product/components/Product';
import { Link } from 'react-router-dom';

ProductSale.propTypes = {
  productList: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

function ProductSale({ productList, loading }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const scrollRef = useRef(null);

  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons();
      return () => scrollElement.removeEventListener('scroll', checkScrollButtons);
    }
  }, [productList, loading]);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -600, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 600, behavior: 'smooth' });
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          mb: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -5,
              left: 0,
              width: 60,
              height: 3,
              backgroundColor: theme.palette.primary.main,
            },
          }}
        >
          Sản Phẩm Giảm Giá
        </Typography>

        <Button
          component={Link}
          to="./products"
          variant="outlined"
          startIcon={<SortIcon />}
          sx={{
            borderRadius: 2,
            display: { xs: 'none', sm: 'flex' },
            textTransform: 'none',
          }}
        >
          Xem tất cả
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Scrollable Product Section */}
      <Box position="relative">
        {!isMobile && showLeftButton && (
          <IconButton
            onClick={scrollLeft}
            sx={{
              position: 'absolute',
              left: -16,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              backgroundColor: 'white',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: 'white',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              },
            }}
          >
            <ChevronLeft />
          </IconButton>
        )}

        <Box
          ref={scrollRef}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            gap: 3,
            px: { xs: 1, md: 2 },
            py: 2,
            '&::-webkit-scrollbar': {
              height: 6,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f1f1f1',
              borderRadius: 3,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#c1c1c1',
              borderRadius: 3,
              '&:hover': {
                backgroundColor: '#a1a1a1',
              },
            },
          }}
        >
          {loading ? (
            <ProductSkeletonList />
          ) : (
            productList.map((product) => (
              <Box key={product.id} sx={{ minWidth: 200 }}>
                <Product product={product} />
              </Box>
            ))
          )}
        </Box>

        {!isMobile && showRightButton && (
          <IconButton
            onClick={scrollRight}
            sx={{
              position: 'absolute',
              right: -16,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              backgroundColor: 'white',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: 'white',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              },
            }}
          >
            <ChevronRight />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}

export default ProductSale;
