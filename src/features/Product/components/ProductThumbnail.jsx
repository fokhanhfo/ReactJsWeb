import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton, Grid, Dialog } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos, Close } from '@mui/icons-material';
import ImageDetail from './ProductThumbnailDetail/ImageDetail';

ProductThumbnail.propTypes = {
  product: PropTypes.object.isRequired,
};

function ProductThumbnail({ product }) {
  const images = product.productDetails.flatMap((productDetail) => productDetail.image.map((img) => img.imageUrl));
  console.log(images);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : prevIndex));
  };

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Grid width={'20%'} height={60} container spacing={1} sx={{ mt: 2 }}>
        {images.slice(0, 5).map((src, index) => (
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
              <img src={src} alt={`Thumbnail ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
          </Grid>
        ))}
        {/* <Box
          sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 400, mt: 2 }}
          position={'absolute'}
        >
          <IconButton onClick={handlePrevClick} disabled={currentIndex === 0}>
            <ArrowBackIosNew />
          </IconButton>
          <IconButton onClick={handleNextClick} disabled={currentIndex === images.length - 1}>
            <ArrowForwardIos />
          </IconButton>
        </Box> */}
      </Grid>

      {/* Hình ảnh chính */}
      <Box
        sx={{
          position: 'relative',
          width: '80%',
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
