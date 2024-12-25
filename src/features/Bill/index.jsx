import React from 'react';
import PropTypes from 'prop-types';
import { Container, Grid } from '@mui/material';
import NavUser from './components/navUser';
import BillUser from './components/billUser';

Bill.propTypes = {};

function Bill(props) {
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <NavUser />
        </Grid>
        <Grid item xs={12} sm={9}>
          <BillUser />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Bill;
