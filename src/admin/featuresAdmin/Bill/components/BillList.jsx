import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, FormControl, NativeSelect, Paper, TableRow, TableCell, Chip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';
import { formatDateTime, formatPrice } from 'utils';
import './styles.scss';
import billApi from 'api/billApi';
import { useSnackbar } from 'notistack';
import ReusableTable from 'admin/components/Table/ReusableTable';
import DataTable from 'admin/components/Table/DataTable';

BillList.propTypes = {
  bills: PropTypes.array.isRequired,
  onUpdateSuccess: PropTypes.func,
};

function BillList({ bills, onUpdateSuccess }) {
  const { enqueueSnackbar } = useSnackbar();
  // const [localBills, setLocalBills] = useState(bills);

  const listHead = [
    { field: 'id', headerName: 'ID', flex: 0.5, renderCell: (params) => `#${params.row.id}` },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    // { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'fullName', headerName: 'Tên người nhận', flex: 1 },
    {
      field: 'createdDate',
      headerName: 'Created Date',
      flex: 1,
      renderCell: (params) => formatDateTime(params.row.createdDate),
    },
    {
      field: 'total_price',
      headerName: 'Price Total',
      flex: 1,
      renderCell: (params) => formatPrice(params.row.total_price),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => {
        const status = params.row.status;
        let label = '';
        let bgColor = '';
        let textColor = '';

        switch (status) {
          case 0:
            label = 'Chờ phê duyệt';
            bgColor = 'rgba(255, 193, 7, 0.16)';
            textColor = '#ffc107';
            break;
          case 1:
            label = 'Chuẩn bị hàng';
            bgColor = 'rgba(255, 193, 7, 0.16)';
            textColor = '#ffc107';
            break;
          case 2:
            label = 'Vận chuyển';
            bgColor = 'rgba(255, 171, 0, 0.16)';
            textColor = '#ffab00';
            break;
          case 3:
            label = 'Chờ giao hàng';
            bgColor = 'rgba(54, 179, 126, 0.16)';
            textColor = '#36b37e';
            break;
          case 4:
            label = 'Xác nhận hoàn thành';
            bgColor = 'rgba(0, 184, 217, 0.16)';
            textColor = '#00b8d9';
            break;
          case 5:
            label = 'Đơn hoàn thành';
            bgColor = 'rgba(0, 184, 217, 0.16)';
            textColor = '#00b8d9';
            break;
          case 6:
            label = 'Đã hủy';
            bgColor = 'rgba(255, 0, 0, 0.16)';
            textColor = '#ff0000';
            break;
          case 7:
            label = 'Trả hàng/Hoàn tiền';
            bgColor = 'rgba(145, 158, 171, 0.16)';
            textColor = '#919eab';
            break;
        }

        return (
          <Chip
            label={label}
            size="small"
            // onClick={() => handleClickStatus(params.row.status)}
            sx={{
              fontWeight: 500,
              borderRadius: '8px',
              px: 1.5,
              py: 0.5,
              fontSize: '0.75rem',
              bgcolor: bgColor,
              color: textColor,
              cursor: 'pointer',
            }}
          />
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      flex: 1,
      renderCell: (params) => (
        <Button>
          <Link to={`./${params.row.id}`}>
            <VisibilityIcon />
          </Link>
        </Button>
      ),
    },
  ];

  // Xử lý thay đổi trạng thái
  // const handleClickStatus = async (event, billId) => {
  //   const data = { status: event.target.value, id: billId };
  //   const response = await billApi.updateStatus(data);
  //   if (response) {
  //     const updatedBills = localBills.filter((bill) => bill.id !== billId);
  //     setLocalBills(updatedBills);
  //     enqueueSnackbar('Update trạng thái thành công', { variant: 'success' });
  //   } else {
  //     enqueueSnackbar('Update trạng thái không thành công', { variant: 'error' });
  //   }
  // };

  return <DataTable columns={listHead} rows={bills} />;
}

export default BillList;
