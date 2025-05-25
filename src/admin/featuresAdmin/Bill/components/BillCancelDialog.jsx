import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const BillCancelDialog = ({ isOpen, title, message, onConfirm, onCancel, isLoading }) => {
  const [note, setNote] = useState(''); // State để lưu ghi chú

  const handleConfirm = () => {
    onConfirm(note); // Gửi ghi chú khi xác nhận
  };

  return (
    <Dialog open={isOpen} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Lý do từ chối"
          value={note}
          onChange={(e) => setNote(e.target.value)} // Cập nhật ghi chú
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="error">
          Hủy
        </Button>
        <Button onClick={handleConfirm} color="primary" variant="contained" disabled={isLoading || !note.trim()}>
          {isLoading ? 'Đang xử lý...' : 'Đồng ý'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BillCancelDialog;
