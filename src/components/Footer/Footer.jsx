import React from 'react';
import { Box, Typography, Grid, TextField, Button, IconButton, Container } from '@mui/material';
import { Facebook, Twitter, YouTube, Instagram } from '@mui/icons-material';

const Footer = () => {
  return (
    <Container maxWidth={false} sx={{ maxWidth: '1400px', padding: '0 20px' }}>
      <Box sx={{ padding: '40px 20px' }}>
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              ninico
            </Typography>
            <Typography variant="body2" sx={{ marginTop: '10px', color: '#666' }}>
              Elegant pink origami design three dimensional view and decoration co-exist. Great for adding a decorative
              touch to any room’s decor.
            </Typography>
          </Grid>

          {/* Information Links */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
              Information
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', marginBottom: '5px' }}>
              Custom Service
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', marginBottom: '5px' }}>
              FAQs
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', marginBottom: '5px' }}>
              Ordering Tracking
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', marginBottom: '5px' }}>
              Contacts
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Events
            </Typography>
          </Grid>

          {/* My Account Links */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
              My Account
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', marginBottom: '5px' }}>
              Delivery Information
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', marginBottom: '5px' }}>
              Privacy Policy
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', marginBottom: '5px' }}>
              Discount
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', marginBottom: '5px' }}>
              Custom Service
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Terms Condition
            </Typography>
          </Grid>

          {/* Social Network */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
              Social Network
            </Typography>
            <IconButton>
              <Facebook />
            </IconButton>
            {/* <IconButton>
            <Dribbble />
          </IconButton> */}
            <IconButton>
              <Twitter />
            </IconButton>
            <IconButton>
              <YouTube />
            </IconButton>
            <IconButton>
              <Instagram />
            </IconButton>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
              Get Newsletter
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', marginBottom: '10px' }}>
              Get on the list and get 10% off your first order!
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Enter email address"
              fullWidth
              sx={{ marginBottom: '10px' }}
            />
            <Button variant="contained" color="secondary" fullWidth>
              Subscribe Now
            </Button>
          </Grid>
        </Grid>

        {/* Footer Bottom */}
        <Box
          sx={{
            marginTop: '40px',
            borderTop: '1px solid #ddd',
            paddingTop: '20px',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" sx={{ color: '#666' }}>
            Copyright 2025 © <strong>Ninico</strong>. All rights reserved. Developed by AliThemes.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Footer;
