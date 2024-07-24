import React from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Grid, Paper } from '@mui/material';
import { CheckBox } from '@mui/icons-material';

ListPage.propTypes = {
    
};

function ListPage(props) {
    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper>1</Paper>
                </Grid>
                <Grid container item>
                    <Grid container item xs={12}>
                        <Grid item xs={1}>
                            <CheckBox/>
                        </Grid>
                        <Grid item xs={2}>
                            <Paper>1</Paper>
                        </Grid>
                        <Grid item xs={3}>
                            <Paper>1</Paper>
                        </Grid>
                        <Grid item xs={2}>
                            <Paper>1</Paper>
                        </Grid>
                        <Grid item xs={2}>
                            <Paper>1</Paper>
                        </Grid>
                        <Grid item xs={2}>
                            <Paper>1</Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
}

export default ListPage;