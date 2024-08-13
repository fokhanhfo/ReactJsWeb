import React from 'react';
import PropTypes from 'prop-types';
import './styled.scss';
import { Container, Grid, Paper } from '@mui/material';

NewProduct.propTypes = {
    
};



function NewProduct(props) {

    

    return (
        <Container>
            <Grid container>
                <Grid item xs={12} sm={3} md={2.4}>
                    <Paper className='product'>
                        <div className='product_img'>
                            <img src="https://cdn.ssstutter.com/products/66z6ao28eNQDG839/052024/1716197300837.webp" alt="" />
                        </div>
                        <div className='product_detail'>
                            
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default NewProduct;