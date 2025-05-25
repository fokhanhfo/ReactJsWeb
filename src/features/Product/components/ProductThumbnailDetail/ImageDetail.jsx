import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, Grid, IconButton, Paper, Box } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';

function ImageDetail({ images, open, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageClick = (index) => {
    setCurrentIndex(index);
  };

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={1}>
            <IconButton onClick={handlePrevClick}>
              <ArrowBackIosNewIcon />
            </IconButton>
          </Grid>
          <Grid item xs={10}>
            <Paper elevation={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
              <img src={images[currentIndex]} alt="Product" style={{ maxWidth: '100%', maxHeight: '100%' }} />
            </Paper>
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={handleNextClick}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, overflowX: 'auto', p: 1 }}>
              {images.map((src, index) => (
                <Paper
                  key={index}
                  elevation={currentIndex === index ? 4 : 1}
                  sx={{
                    border: currentIndex === index ? '2px solid #1976d2' : 'none',
                    cursor: 'pointer',
                    width: 60,
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={() => handleImageClick(index)}
                >
                  <img src={src} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Paper>
              ))}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

ImageDetail.propTypes = {
  images: PropTypes.array.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImageDetail;
