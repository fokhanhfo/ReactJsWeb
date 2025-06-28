import React from 'react';
import { Box, Paper, Typography, useTheme, useMediaQuery, Container } from '@mui/material';
import SizeAdmin from '../Size';
import ColorAdmin from '../Color';

function SizeAndColor() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Container maxWidth={false} sx={{ width: '100%', height: '100%' }}>
      <Box display="flex" flexWrap="wrap" gap={3} justifyContent="center" alignItems="stretch">
        <Paper
          elevation={4}
          sx={{
            flex: isSmallScreen ? '1 1 100%' : '1 1 45%',
            p: 3,
            borderRadius: 3,
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            minWidth: 320,
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 90px)',
          }}
        >
          <SizeAdmin />
        </Paper>

        <Paper
          elevation={4}
          sx={{
            flex: isSmallScreen ? '1 1 100%' : '1 1 45%',
            p: 3,
            borderRadius: 3,
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            minWidth: 320,
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 90px)',
          }}
        >
          <ColorAdmin />
        </Paper>
      </Box>
    </Container>
  );
}

export default SizeAndColor;
