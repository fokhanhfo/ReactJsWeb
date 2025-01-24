import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, FormControl, NativeSelect, Paper, TableRow, TableCell } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';
import { formatDateTime, formatPrice } from 'utils';
import './styles.scss';
import billApi from 'api/billApi';
import { useSnackbar } from 'notistack';
import ReusableTable from 'admin/components/Table/ReusableTable';

BillList.propTypes = {
  bills: PropTypes.array.isRequired,
  onUpdateSuccess: PropTypes.func.isRequired,
};

function BillList({ bills, onUpdateSuccess }) {
  const { enqueueSnackbar } = useSnackbar();
  const [localBills, setLocalBills] = useState(bills);

  const listHead = [
    { key: 'id', label: 'ID', width: '10%' },
    { key: 'phone', label: 'Phone', width: '15%' },
    { key: 'email', label: 'Email', width: '15%' },
    { key: 'user_id', label: 'User Name', width: '15%' },
    { key: 'createdDate', label: 'Created Date', width: '15%', render: (row) => formatDateTime(row.createdDate) },
    { key: 'total_price', label: 'Price Total', width: '15%', render: (row) => formatPrice(row.total_price) },
    {
      key: 'status',
      label: 'Trạng thái',
      width: '15%',
      render: (row) => (
        <FormControl fullWidth>
          <NativeSelect
            value={row.status}
            onChange={(event) => handleClickStatus(event, row.id)}
            inputProps={{
              name: 'status',
              id: `status-select-${row.id}`,
            }}
          >
            <option value={1}>Duyệt Đơn</option>
            <option value={2}>Đơn Hoàn thành</option>
            <option value={0}>Hủy đơn hàng</option>
          </NativeSelect>
        </FormControl>
      ),
    },
    {
      key: 'actions',
      label: 'Thao tác',
      width: '10%',
      render: (row) => (
        <Button>
          <Link to={`./${row.id}`}>
            <VisibilityIcon />
          </Link>
        </Button>
      ),
    },
  ];

  // Xử lý thay đổi trạng thái
  const handleClickStatus = async (event, billId) => {
    const data = { status: event.target.value, id: billId };
    const response = await billApi.updateStatus(data);
    if (response) {
      const updatedBills = localBills.filter((bill) => bill.id !== billId);
      setLocalBills(updatedBills);
      enqueueSnackbar('Update trạng thái thành công', { variant: 'success' });
    } else {
      enqueueSnackbar('Update trạng thái không thành công', { variant: 'error' });
    }
  };

  return <ReusableTable listHead={listHead} rows={localBills} />;
}

export default BillList;
