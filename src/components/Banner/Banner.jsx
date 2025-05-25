import React from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Card, Breadcrumbs, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

Banner.propTypes = {};

function Banner(props) {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '167px',
        backgroundImage: 'url(/images/banner.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth={false} sx={{ height: '100%', display: 'flex', alignItems: 'center', maxWidth: '1400px' }}>
        <Card elevation={0} sx={{ width: '100%', background: 'transparent', boxShadow: 'none' }}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
            <Link underline="hover" color="inherit" to="/">
              Home
            </Link>
            <Typography color="text.primary">Shop</Typography>
          </Breadcrumbs>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Our Products
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Discover our collection of high-quality products
          </Typography>
        </Card>
      </Container>
    </Box>
  );
}

export default Banner;
