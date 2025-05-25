import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, isLoading }) => {
  return (
    <Dialog open={isOpen} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="error">
          Hủy
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
          {isLoading ? 'Updating...' : 'Đồng ý'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
