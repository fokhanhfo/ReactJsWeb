import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, TextField, Button, Grid, Container, Paper, IconButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import ExploreIcon from '@mui/icons-material/Explore';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

AlbumFeature.propTypes = {};

function AlbumFeature(props) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Grid container spacing={4}>
        {/* Left Section - Get In Touch */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              height: '100%',
              border: '1px solid #eee',
              borderRadius: 1,
            }}
          >
            <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
              Get In Touch
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 4 }}>
              <LocationOnIcon sx={{ color: 'success.main', mr: 2, mt: 0.5 }} />
              <Typography variant="body1" color="text.secondary">
                24/26 Strait Bargate, Boston, PE21,
                <br />
                United Kingdom
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 3 }}>
              <PhoneIcon sx={{ color: 'success.main', mr: 2, mt: 0.5 }} />
              <Typography variant="body1" color="text.secondary">
                +098 (905) 786 897 8<br />6 - 146 - 389 - 5748
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 3 }}>
              <AccessTimeIcon sx={{ color: 'success.main', mr: 2, mt: 0.5 }} />
              <Box>
                <Typography variant="body1" color="text.secondary">
                  Store Hours:
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  10 am - 10 pm EST, 7 days a week
                </Typography>
              </Box>
            </Box>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<HeadsetMicIcon />}
              sx={{
                mt: 4,
                py: 1.5,
                borderColor: '#ddd',
                color: 'text.primary',
                '&:hover': {
                  borderColor: '#ccc',
                  backgroundColor: '#f9f9f9',
                },
              }}
            >
              Get Support On Call
            </Button>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<ExploreIcon />}
              sx={{
                mt: 2,
                py: 1.5,
                borderColor: '#ddd',
                color: 'text.primary',
                '&:hover': {
                  borderColor: '#ccc',
                  backgroundColor: '#f9f9f9',
                },
              }}
            >
              Get Direction
            </Button>
          </Paper>
        </Grid>

        {/* Right Section - Make Custom Request */}
        <Grid item xs={12} md={7}>
          <Box>
            <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
              Make Custom Request
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Must-have pieces selected every month want style Ideas and Treats?
            </Typography>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Full name" variant="outlined" sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Email address" variant="outlined" sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Phone number" variant="outlined" sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Subject" variant="outlined" sx={{ mb: 2 }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Enter message" variant="outlined" multiline rows={8} sx={{ mb: 2 }} />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  py: 1.5,
                  px: 3,
                  backgroundColor: '#d81b60',
                  '&:hover': {
                    backgroundColor: '#c2185b',
                  },
                }}
              >
                Get A Quote
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Scroll to top button */}
      <Box sx={{ position: 'fixed', bottom: 20, right: 20 }}>
        <IconButton
          onClick={scrollToTop}
          sx={{
            backgroundColor: '#d81b60',
            color: 'white',
            '&:hover': {
              backgroundColor: '#c2185b',
            },
          }}
        >
          <ArrowUpwardIcon />
        </IconButton>
      </Box>
    </Container>
  );
}

export default AlbumFeature;
