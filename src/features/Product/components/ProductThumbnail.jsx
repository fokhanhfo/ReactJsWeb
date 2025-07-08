import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton, Grid, Dialog, useTheme, useMediaQuery } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos, Close } from '@mui/icons-material';
import ImageDetail from './ProductThumbnailDetail/ImageDetail';

ProductThumbnail.propTypes = {
  product: PropTypes.object.isRequired,
  height: PropTypes.string,
};

function ProductThumbnail({ product, height }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const images = product.productDetails.flatMap((productDetail) => productDetail.image.map((img) => img.imageUrl));
  console.log(images);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    setShowLeft(container.scrollLeft > 0);
    setShowRight(container.scrollLeft + container.clientWidth < container.scrollWidth);
  };

  const scrollByAmount = (amount) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : prevIndex));
  };

  return (
    <Box sx={{ display: isMobile ? 'block' : 'flex', width: '100%', height: height }}>
      {!isMobile && (
        <Grid
          width={'20%'}
          container
          spacing={1}
          sx={{
            mt: 2,
            maxHeight: 550, // chiều cao tối đa của vùng thumbnails
            overflowY: 'auto', // cuộn dọc nếu quá nhiều ảnh
          }}
        >
          {images.map((src, index) => (
            <Grid item key={index} lg={12}>
              <Box
                sx={{
                  width: 60,
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: currentIndex === index ? '2px solid #1976d2' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#1976d2',
                  },
                  margin: '0 auto',
                }}
                onMouseEnter={() => setCurrentIndex(index)}
              >
                <img
                  src={src}
                  alt={`Thumbnail ${index}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Hình ảnh chính */}
      <Box
        sx={{
          position: 'relative',
          width: isMobile ? '100%' : '80%',
          overflow: 'hidden',
          borderRadius: 2,
          boxShadow: 3,
          cursor: 'pointer',
        }}
        onClick={() => setOpen(true)}
      >
        <img
          src={images[currentIndex]}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>

      {isMobile && (
        <Box sx={{ position: 'relative', width: '100%', mt: 2 }}>
          <Box
            ref={scrollRef}
            onScroll={handleScroll}
            sx={{
              display: 'flex',
              gap: 1,
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              px: 4,
            }}
          >
            {images.map((src, index) => (
              <Box
                key={index}
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: currentIndex === index ? '2px solid #1976d2' : '2px solid transparent',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#1976d2',
                  },
                }}
                onMouseEnter={() => setCurrentIndex(index)}
              >
                <img
                  src={src}
                  alt={`Thumbnail ${index}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            ))}
          </Box>

          {/* nút trái */}
          {showLeft && (
            <IconButton
              onClick={() => scrollByAmount(-100)}
              sx={{
                position: 'absolute',
                top: '50%',
                left: 0,
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0,0,0,0.4)',
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.6)' },
              }}
            >
              <ArrowBackIosNew />
            </IconButton>
          )}

          {/* nút phải */}
          {showRight && (
            <IconButton
              onClick={() => scrollByAmount(100)}
              sx={{
                position: 'absolute',
                top: '50%',
                right: 0,
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0,0,0,0.4)',
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.6)' },
              }}
            >
              <ArrowForwardIos />
            </IconButton>
          )}
        </Box>
      )}

      {/* Popup chi tiết ảnh */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md">
        <IconButton sx={{ position: 'absolute', top: 10, right: 10, color: '#fff' }} onClick={() => setOpen(false)}>
          <Close />
        </IconButton>
        <ImageDetail images={images} open={open} onClose={() => setOpen(false)} />
      </Dialog>
    </Box>
  );
}

export default ProductThumbnail;
