import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'admin/components/Table/DataTable';
import { Box, Button, Chip, IconButton } from '@mui/material';
import { useDispatch } from 'react-redux';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';
import { Update } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddDiscount from './AddDiscountPeriod';
import { formatDateTime, optionCategoryDiscount, optionTypeDiscount } from 'utils';
import { Link } from 'react-router-dom';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PercentIcon from '@mui/icons-material/Percent';
import MoneyIcon from '@mui/icons-material/Money';
import { useDeletediscountPeriodMutation } from 'hookApi/discountPeriodApi';
import ConfirmDialog from 'components/ConfirmDialog/ConfirmDialog';
import { useSnackbar } from 'notistack';

ListDiscountPeriod.propTypes = {
  discounts: PropTypes.array.isRequired,
  actionsState: PropTypes.object.isRequired,
};

function ListDiscountPeriod({ discounts, loading, actionsState }) {
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [deletediscountPeriod, { isLoading }] = useDeletediscountPeriodMutation();
  const { enqueueSnackbar } = useSnackbar();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCancel = () => {
    setIsDialogOpen(false);
  };
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.4,
      renderCell: (params) => <Link to={`./${params.row.id}`}>#{params.row.id}</Link>,
    },
    {
      field: 'discountPeriodCode',
      headerName: 'Code giảm giá',
      flex: 1,
      renderCell: (params) => params.row.discountPeriodCode,
    },
    // {
    //   field: 'discountName',
    //   headerName: 'Tên giảm giá',
    //   width: 200,
    //   renderCell: (params) => <Link to={`./${params.row.id}`}>{params.row.discountName}</Link>,
    // },
    // {
    //   field: 'type',
    //   headerName: 'Loại',
    //   flex: 0.5,
    //   renderCell: (params) => <>{optionTypeDiscount.find((item) => item.id === params.row.type)?.name}</>,
    // },
    { field: 'minPercentageValue', headerName: 'Giá trị % tối thiểu', flex: 0.7 },
    { field: 'maxPercentageValue', headerName: 'Giá trị % tối đa', flex: 0.7 },
    {
      field: 'durationDays',
      headerName: 'Số ngày giảm',
      flex: 0.5,
      renderCell: (params) => {
        const start = new Date(params.row.startTime);
        const end = new Date(params.row.endTime);
        const diffTime = end - start;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} ngày`;
      },
    },
    {
      field: 'remainingDays',
      headerName: 'Số ngày còn lại',
      flex: 0.5,
      renderCell: (params) => {
        const now = new Date();
        const start = new Date(params.row.startTime);
        const end = new Date(params.row.endTime);

        if (now < start) {
          // Chưa bắt đầu
          return <Chip label="Chưa bắt đầu" color="info" size="small" />;
        }

        const diffTime = end - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
          return <Chip label={`${diffDays} ngày`} color={diffDays <= 3 ? 'warning' : 'success'} size="small" />;
        } else {
          return <Chip label="Hết hạn" color="error" size="small" />;
        }
      },
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      flex: 0.5,
      renderCell: (params) => {
        const isActive = params.value === 1;

        return (
          <Chip
            label={isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
            color={isActive ? 'success' : 'default'} // 'success' = xanh lá, 'default' = xám
            size="small"
          />
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      flex: 0.5,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleActions('edit', params.row)}>
            <Update color="success" />
          </IconButton>
          <IconButton onClick={() => handleOpenDialog(params.row)}>
            <DeleteIcon color="error" />
          </IconButton>
        </>
      ),
    },
  ];

  const handleOpenDialog = (rows) => {
    setIsDialogOpen(true);
    setSelectedDiscount(rows);
  };

  const handleDelete = async (id) => {
    console.log('Delete row:', id);
    try {
      await deletediscountPeriod(id).unwrap();
      enqueueSnackbar('Xóa thành công', { variant: 'success' });
      setIsDialogOpen(false);
      setSelectedDiscount(null);
    } catch (err) {
      console.error('Lỗi khi xóa:', err);
      enqueueSnackbar(err?.data?.message || 'Xóa không thành công', { variant: 'error' });
    }
  };

  const dispatch = useDispatch();
  const handleActions = (state, row) => {
    if (state === 'edit' || state === 'view') {
      setSelectedDiscount(row);
    }
    handleAction(state, dispatch, actionsState);
  };

  return (
    <>
      {/* <Box>
        <Button onClick={() => handleActions('add')} sx={{ float: 'right' }} variant="contained">
          Add
        </Button>
      </Box> */}
      <Box>
        <DataTable
          rows={discounts}
          columns={columns}
          pageSize={5}
          handleSelectionChange={(selection) => console.log(selection)}
        />
      </Box>
      <ConfirmDialog
        isOpen={isDialogOpen}
        title="Xác nhận"
        message="Bạn có chắc chắn muốn thực hiện hành động này không?"
        onConfirm={() => handleDelete(selectedDiscount.id)}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
      {actionsState.edit === true && selectedDiscount !== null ? (
        <AddDiscount actionsState={actionsState} initialValues={selectedDiscount} />
      ) : null}
    </>
  );
}

export default ListDiscountPeriod;
