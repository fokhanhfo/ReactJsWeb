import React from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, Paper } from '@mui/material';
import NavUser from './components/navUser';
import BillUser from './components/billUser';
import Banner from 'components/Banner/Banner';
import { Route, Routes } from 'react-router-dom';
import Profile from './page/Profile';
import Address from './page/Address';
import Voucher from './page/Voucher';

UserDetail.propTypes = {};

function UserDetail(props) {
  return (
    <>
      <Banner />
      <Paper sx={{ boxShadow: 'none', backgroundColor: '#f5f5f5' }}>
        <Container maxWidth={false} sx={{ maxWidth: '1400px', padding: '20px 0' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <NavUser />
            </Grid>
            {/* <Grid item xs={12} sm={9}>
              <BillUser />
            </Grid> */}
            <Grid item xs={12} sm={9}>
              <Routes>
                <Route path="/bill/*" element={<BillUser />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/address" element={<Address />} />
                <Route path="/vouchers" element={<Voucher />} />
              </Routes>
            </Grid>
          </Grid>
        </Container>
      </Paper>
    </>
  );
}

export default UserDetail;
