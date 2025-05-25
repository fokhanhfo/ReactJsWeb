import React from 'react';
import PropTypes from 'prop-types';
import { Chip } from '@mui/material';

StatusChip.propTypes = {
  status: PropTypes.number, // vì status là số
};

// Ánh xạ id -> tên trạng thái
const statusMap = {
  0: 'Chờ phê duyệt',
  1: 'Chuẩn bị hàng',
  2: 'Vận chuyển',
  3: 'Chờ giao hàng',
  5: 'Hoàn thành',
  6: 'Đã hủy',
  7: 'Trả hàng/Hoàn tiền',
};

// Ánh xạ tên trạng thái (chữ thường) -> màu sắc
const statusColorMap = {
  'chờ thanh toán': 'info',
  'chờ phê duyệt': 'info',
  'vận chuyển': 'warning',
  'chờ giao hàng': 'warning',
  'hoàn thành': 'success',
  'đơn hoàn thành': 'success',
  'đã hủy': 'error',
  'trả hàng/hoàn tiền': 'secondary',
};

function StatusChip({ status }) {
  const statusLabel = statusMap[status] || 'Không xác định';
  const color = statusColorMap[statusLabel.toLowerCase()] || 'default';

  return <Chip label={statusLabel} color={color} size="small" sx={{ fontWeight: 'medium' }} />;
}

export default StatusChip;
