import React from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Card, Breadcrumbs, Typography, Link as MuiLink } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

Banner.propTypes = {};

function Banner(props) {
  const location = useLocation();

  // lấy các phần của path, vd: ['shop', 'product', '123']
  const pathnames = location.pathname.split('/').filter((x) => x);

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
          {/* <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Home
            </Link>
            {pathnames.map((value, index) => {
              const to = `/${pathnames.slice(0, index + 1).join('/')}`;

              // nếu là phần tử cuối thì không render Link
              const isLast = index === pathnames.length - 1;

              return isLast ? (
                <Typography key={to} color="text.primary">
                  {decodeURIComponent(value)}
                </Typography>
              ) : (
                <MuiLink component={Link} underline="hover" color="inherit" to={to} key={to}>
                  {decodeURIComponent(value)}
                </MuiLink>
              );
            })}
          </Breadcrumbs> */}
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Sản phẩm của chúng tôi
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Khám phá bộ sưu tập sản phẩm chất lượng cao của chúng tôi
          </Typography>
        </Card>
      </Container>
    </Box>
  );
}

export default Banner;
