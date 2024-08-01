import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Paper, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

ImageDetail.propTypes = {
    images : PropTypes.array.isRequired,
    open : PropTypes.bool.isRequired,
    onClose : PropTypes.func.isRequired,
};

function ImageDetail({ images={}, open, onClose }) {

    const [currentIndex,setCurrentIndex] = useState(0);

    return (
        <div>
            <Dialog
                onClose={onClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                maxWidth='md'
                fullWidth
            >
                <DialogContent dividers>
                    <Grid container sx={{ height: '100%' }} spacing={2}>
                        <Grid item xs={12} sm={12} md={8} lg={8}>
                            <Paper sx={{height:'100%'}}>
                                <img className='main-image-sub' src={images[currentIndex]} alt=''/>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                            <Paper sx={{maxHeight: '400px', overflowY:'auto'}}>
                                {images.map((src, index) =>(
                                    <img 
                                        className={images[currentIndex] === src ? 'image_sub_active_detail' : 'image_sub_detail'}
                                        key={index}
                                        src={src}
                                        alt=''
                                    />
                                ))}
                            </Paper>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ImageDetail;