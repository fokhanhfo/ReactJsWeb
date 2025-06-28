import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box, CircularProgress, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';

const BillCancelDialogUser = ({ isOpen, title, message, onConfirm, onCancel, isLoading }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalNote, setAdditionalNote] = useState('');

  // Các lý do hủy bill phổ biến cho người dùng
  const cancellationReasons = [
    { value: 'changed_mind', label: 'Tôi đã thay đổi ý định' },
    { value: 'found_better_price', label: 'Tìm được giá tốt hơn ở nơi khác' },
    { value: 'delivery_too_long', label: 'Thời gian giao hàng quá lâu' },
    { value: 'payment_issue', label: 'Gặp vấn đề với thanh toán' },
    { value: 'wrong_item', label: 'Đặt nhầm sản phẩm' },
    { value: 'financial_reason', label: 'Lý do tài chính' },
    { value: 'other', label: 'Lý do khác' },
  ];
  const handleConfirm = () => {
    let finalNote = '';
    const reasonLabel = cancellationReasons.find((r) => r.value === selectedReason)?.label || '';

    if (selectedReason === 'other') {
      finalNote = `Lý do khác: ${additionalNote}`;
    } else {
      finalNote = reasonLabel;
    }

    onConfirm(finalNote);
  };

  const handleCancel = () => {
    setSelectedReason('');
    setAdditionalNote('');
    onCancel();
  };

  const isConfirmDisabled = !selectedReason || (selectedReason === 'other' && !additionalNote.trim()) || isLoading;

  return (
    <Dialog open={isOpen} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: 'error.main' }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 3 }}>{message}</DialogContentText>

        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ mb: 2, fontWeight: 'medium' }}>
            Vui lòng chọn lý do hủy:
          </FormLabel>
          <RadioGroup value={selectedReason} onChange={(e) => setSelectedReason(e.target.value)}>
            {cancellationReasons.map((reason) => (
              <FormControlLabel
                key={reason.value}
                value={reason.value}
                control={<Radio />}
                label={reason.label}
                sx={{ mb: 0.5 }}
              />
            ))}
          </RadioGroup>
        </FormControl>

        {selectedReason === 'other' && (
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Vui lòng mô tả chi tiết"
              placeholder="Nhập lý do cụ thể..."
              value={additionalNote}
              onChange={(e) => setAdditionalNote(e.target.value)}
              variant="outlined"
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleCancel} disabled={isLoading} variant="outlined">
          Quay lại
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isConfirmDisabled}
          color="error"
          variant="contained"
          startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {isLoading ? 'Đang xử lý...' : 'Xác nhận hủy'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BillCancelDialogUser;
