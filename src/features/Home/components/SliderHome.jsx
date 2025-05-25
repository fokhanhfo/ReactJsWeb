import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './styled.scss';
import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';

SliderHome.propTypes = {
  images: PropTypes.array.isRequired,
};

function SliderHome({ images }) {
  const [index, setIndex] = useState(0);

  const handlePrev = () => {
    setIndex((index) => {
      if (index === 0) return images.length - 1;
      return index - 1;
    });
  };

  const handleNext = () => {
    setIndex((index) => {
      if (index === images.length - 1) return 0;
      return index + 1;
    });
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <div className="home-slider">
            <div className="home-slider-divImg">
              {images.map((image) => (
                <img style={{ translate: `${-100 * index}%` }} src={image} key={image} className="home-slider-img" />
              ))}
            </div>
            <button onClick={handlePrev} className="home-slider-btn btn-left">
              <ArrowBackIosIcon />
            </button>
            <button onClick={handleNext} className="home-slider-btn btn-right">
              <ArrowForwardIosIcon />
            </button>
          </div>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container spacing={2} direction="column" sx={{ height: '100%' }}>
            {/* Top card */}
            <Grid item xs={6}>
              <Card sx={{ borderRadius: 2, height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography color="primary" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                    Hand made
                  </Typography>
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    New Modern Stylist Crafts
                  </Typography>
                </CardContent>
                <CardMedia
                  component="img"
                  image="/placeholder.svg?height=150&width=300"
                  alt="Craft supplies with gold accent"
                  sx={{ height: 120, objectFit: 'cover' }}
                />
              </Card>
            </Grid>

            {/* Bottom card */}
            <Grid item xs={6}>
              <Card sx={{ borderRadius: 2, height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography color="primary" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                    Popular
                  </Typography>
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Energy with our newest collection
                  </Typography>
                </CardContent>
                <CardMedia
                  component="img"
                  image="/placeholder.svg?height=150&width=300"
                  alt="Wooden utensils in container"
                  sx={{ height: 120, objectFit: 'cover' }}
                />
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default SliderHome;
