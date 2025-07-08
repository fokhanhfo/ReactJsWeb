import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './styled.scss';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

SliderHome.propTypes = {
  images: PropTypes.array.isRequired,
};

function SliderHome({ images, autoPlayInterval = 3000, pauseOnHover = true }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handlePrev = useCallback(() => {
    setIndex((prevIndex) => {
      if (prevIndex === 0) return images.length - 1;
      return prevIndex - 1;
    });
  }, [images.length]);

  const handleNext = useCallback(() => {
    setIndex((prevIndex) => {
      if (prevIndex === images.length - 1) return 0;
      return prevIndex + 1;
    });
  }, [images.length]);

  const handleDotClick = (dotIndex) => {
    setIndex(dotIndex);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlayInterval || (pauseOnHover && isHovered)) {
      return;
    }

    const interval = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlayInterval, pauseOnHover, isHovered, handleNext]);

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsHovered(false);
    }
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
        {/* Main Slider */}
        <Grid item xs={12} lg={8} sx={{ display: 'flex', alignItems: 'center' }}>
          <Paper
            elevation={0}
            sx={{
              height: '100%',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.100',
              border: '2px solid #e5e7eb',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                bgcolor: 'black',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '4px',
                bgcolor: 'black',
              },
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: { xs: 250, sm: 320, md: 400, lg: 450 },
                minHeight: { xs: 250, sm: 320, md: 400, lg: 450 },
                overflow: 'hidden',
                borderRadius: 2,
                backgroundColor: 'grey.100',
                boxShadow: 3,
                flex: 1,
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Box
                sx={{
                  display: 'flex',
                  height: '100%',
                  transition: 'transform 0.3s ease-in-out',
                  transform: `translateX(-${index * 100}%)`,
                }}
              >
                {images.map((image, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      width: '100%',
                      height: '100%',
                      flexShrink: 0,
                      position: 'relative',
                    }}
                  >
                    <Box
                      component="img"
                      src={image || '/placeholder.svg?height=400&width=600'}
                      alt={`Slide ${idx + 1}`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                ))}
              </Box>

              {/* Navigation Buttons */}
              <IconButton
                onClick={handlePrev}
                sx={{
                  position: 'absolute',
                  left: { xs: 8, sm: 16 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': {
                    backgroundColor: 'white',
                    transform: 'translateY(-50%) scale(1.1)',
                  },
                  boxShadow: 2,
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <ArrowBackIosIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
              </IconButton>

              <IconButton
                onClick={handleNext}
                sx={{
                  position: 'absolute',
                  right: { xs: 8, sm: 16 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': {
                    backgroundColor: 'white',
                    transform: 'translateY(-50%) scale(1.1)',
                  },
                  boxShadow: 2,
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <ArrowForwardIosIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
              </IconButton>

              {/* Dots Indicator */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 1,
                }}
              >
                {images.map((_, idx) => (
                  <Box
                    key={idx}
                    onClick={() => handleDotClick(idx)}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: idx === index ? 'white' : 'rgba(255, 255, 255, 0.5)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      transform: idx === index ? 'scale(1.25)' : 'scale(1)',
                      '&:hover': {
                        backgroundColor: 'white',
                      },
                    }}
                  />
                ))}
              </Box>

              {/* Auto-play indicator */}
              {!isHovered && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(76, 175, 80, 0.8)',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': {
                        opacity: 1,
                      },
                      '50%': {
                        opacity: 0.5,
                      },
                      '100%': {
                        opacity: 1,
                      },
                    },
                  }}
                />
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Side Cards */}
        <Grid item xs={12} lg={4} sx={{ display: 'flex' }}>
          <Grid
            container
            spacing={2}
            sx={{
              height: '100%',
              minHeight: { xs: 250, sm: 320, md: 400, lg: 450 },
              flex: 1,
            }}
          >
            {/* Top Card */}
            <Grid item xs={12} sm={6} lg={12}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 2,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                  },
                  cursor: 'pointer',
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label="Hand made"
                      size="small"
                      sx={{
                        backgroundColor: 'primary.50',
                        color: 'primary.600',
                        fontWeight: 500,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 'bold',
                      mb: 2,
                      fontSize: { xs: '1rem', sm: '1.25rem' },
                      transition: 'color 0.3s ease-in-out',
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    New Modern Stylist Crafts
                  </Typography>
                </CardContent>
                <CardMedia
                  component="img"
                  image="/imagesHome/sale.png"
                  alt="Craft supplies with gold accent"
                  sx={{
                    height: { xs: 100, sm: 120, lg: 140 },
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
              </Card>
            </Grid>

            {/* Bottom Card */}
            <Grid item xs={12} sm={6} lg={12}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 2,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                  },
                  cursor: 'pointer',
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label="Popular"
                      size="small"
                      sx={{
                        backgroundColor: 'success.50',
                        color: 'success.600',
                        fontWeight: 500,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 'bold',
                      mb: 2,
                      fontSize: { xs: '1rem', sm: '1.25rem' },
                      transition: 'color 0.3s ease-in-out',
                      '&:hover': {
                        color: 'success.main',
                      },
                    }}
                  >
                    Energy with our newest collection
                  </Typography>
                </CardContent>
                <CardMedia
                  component="img"
                  image="/imagesHome/sale.png"
                  alt="Wooden utensils in container"
                  sx={{
                    height: { xs: 100, sm: 120, lg: 140 },
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SliderHome;
