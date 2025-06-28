import React from 'react';
import PropTypes from 'prop-types';
import InstagramIcon from '@mui/icons-material/Instagram';
import { Box, Typography, Grid, Paper } from '@mui/material';

ImageHome.propTypes = {};

function ImageHome(props) {
  const images = [
    '/imagesHome/áo thun be.png',
    '/imagesHome/áo thun đen.png',
    '/imagesHome/áo thun be.png',
    '/imagesHome/áo thun đen.png',
    '/imagesHome/áo thun be.png',
    '/imagesHome/áo thun đen.png',
  ];
  return (
    <Box
      sx={{
        mx: 'auto',
        p: 4,
        backgroundColor: '#f8f9fa',
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          textAlign: 'center',
          mb: 4,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: '#e91e63',
            fontWeight: 400,
            mb: 2,
            fontSize: '18px',
          }}
        >
          Follow On
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <InstagramIcon
            sx={{
              fontSize: 32,
              color: '#000',
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: '#000',
              fontSize: '28px',
            }}
          >
            hoanghai-shop
          </Typography>
        </Box>
      </Box>

      {/* Image Grid */}
      <Grid container spacing={2}>
        {images.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                aspectRatio: '1/1',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              <Box
                component="img"
                src={image}
                alt={`Craft project ${index + 1}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ImageHome;
