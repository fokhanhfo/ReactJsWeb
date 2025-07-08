import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'admin/components/Table/DataTable';
import { Box, Button, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';
import { Update } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddDiscount from './AddDiscount';
import { formatPrice, optionCategoryDiscount, optionTypeDiscount } from 'utils';
import { Link } from 'react-router-dom';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PercentIcon from '@mui/icons-material/Percent';
import MoneyIcon from '@mui/icons-material/Money';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import dayjs from 'dayjs';
import { discountStatus } from 'enum/discountStatus';
import { useDeletediscountMutation, useUpdateStatusDiscountMutation } from 'hookApi/discountApi';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useSnackbar } from 'notistack';
import ConfirmDialog from 'components/ConfirmDialog/ConfirmDialog';

ListDiscount.propTypes = {
  discounts: PropTypes.array.isRequired,
  actionsState: PropTypes.object.isRequired,
};

function ListDiscount({ discounts, loading, actionsState }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [updateDiscountStatus] = useUpdateStatusDiscountMutation();
  const [deletediscount, { data, error, isLoading }] = useDeletediscountMutation();
  const { enqueueSnackbar } = useSnackbar();
  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.6,
      minWidth: 100,
      renderCell: (params) => {
        const categoryDiscount = optionCategoryDiscount.find((item) => item.id === params.row.category);
        const isEnabled = params.row.enable; // true hoặc false

        return (
          <Link
            to={`./${params.row.id}`}
            style={{
              fontWeight: 600,
              color: '#1976d2',
              textDecoration: 'none',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>#{params.row.id}</Typography>
              {/* Icon loại mã giảm giá */}
              <Box>
                {categoryDiscount?.id === 1 ? (
                  <ShoppingBagIcon sx={{ color: '#1976d2', fontSize: 20 }} /> // xanh dương
                ) : categoryDiscount?.id === 2 ? (
                  <LocalShippingIcon sx={{ color: '#f57c00', fontSize: 20 }} /> // cam
                ) : (
                  <Box sx={{ fontSize: 12, color: 'gray' }}>?</Box>
                )}
              </Box>
              {/* Icon hiển thị trên trang chủ */}
              <Tooltip title={isEnabled ? 'Đang hiển thị trên trang chủ' : 'Không hiển thị'}>
                <Box>
                  {isEnabled ? (
                    <VisibilityIcon sx={{ color: 'green', fontSize: 20 }} />
                  ) : (
                    <VisibilityOffIcon sx={{ color: 'gray', fontSize: 20 }} />
                  )}
                </Box>
              </Tooltip>
            </Box>
          </Link>
        );
      },
    },
    {
      field: 'discountCode',
      headerName: 'Code giảm giá',
      flex: 0.8,
      minWidth: 130,
      renderCell: (params) => {
        const discountType = optionTypeDiscount.find((item) => item.id === params.row.type);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {discountType?.id === 1 ? (
              <PercentIcon sx={{ color: '#1976d2', mr: 0.5 }} />
            ) : discountType?.id === 2 ? (
              <MoneyIcon sx={{ color: '#4caf50', mr: 0.5 }} />
            ) : null}
            {params.row.discountCode}
          </Box>
        );
      },
    },
    {
      field: 'value',
      headerName: 'Giá trị',
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => {
        const discountType = optionTypeDiscount.find((item) => item.id === params.row.type);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {discountType?.id === 1 ? params.value : discountType?.id === 2 ? formatPrice(params.value) : null}
          </Box>
        );
      },
    },
    {
      field: 'maxValue',
      headerName: 'Giá trị tối đa',
      flex: 0.6,
      minWidth: 130,
      renderCell: (params) => (
        <>{params.value === 0 || params.value === null ? 'Không áp dụng' : formatPrice(params.value)}</>
      ),
    },
    {
      field: 'discountCondition',
      headerName: 'Điều kiện giảm',
      flex: 0.6,
      minWidth: 130,
      renderCell: (params) => <>{formatPrice(params.value)}</>,
    },
    {
      field: 'quantity',
      headerName: 'Số lượng',
      flex: 0.4,
      minWidth: 90,
      renderCell: (params) => params.value?.toLocaleString('vi-VN') ?? '',
    },
    {
      field: 'durationDays',
      headerName: 'Số ngày giảm',
      flex: 0.5,
      minWidth: 120,
      renderCell: (params) => {
        const start = new Date(params.row.startTime);
        const end = new Date(params.row.endTime);
        const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return `${diffDays} ngày`;
      },
    },
    {
      field: 'remainingDays',
      headerName: 'Số ngày còn lại',
      flex: 0.6,
      minWidth: 130,
      renderCell: (params) => {
        const now = new Date();
        const start = new Date(params.row.startTime);
        const end = new Date(params.row.endTime);

        if (now < start) {
          return <Chip label="Chưa bắt đầu" color="info" size="small" />;
        }

        const diffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
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
      flex: 0.6,
      minWidth: 120,
      renderCell: (params) => {
        const isActive = params.value === 1;
        const isHovered = hoveredRow === params.row.id;
        return (
          <Box
            sx={{ position: 'relative' }}
            onMouseEnter={() => setHoveredRow(params.row.id)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            <Chip
              label={isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
              color={isActive ? 'success' : 'default'}
              size="small"
              sx={{ opacity: isHovered ? 0.5 : 1, transition: 'opacity 0.2s' }}
            />
            {isHovered && (
              <Tooltip title={isActive ? 'Ngừng hoạt động' : 'Kích hoạt'}>
                <IconButton
                  size="small"
                  onClick={() => handleToggleStatus(params.row)}
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
                  }}
                >
                  {isActive ? (
                    <ToggleOnIcon className="text-green-500" fontSize="small" />
                  ) : (
                    <ToggleOffIcon className="text-gray-500" fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            )}
          </Box>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      flex: 0.5,
      minWidth: 100,
      sortable: false,
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
      await deletediscount(id).unwrap();
      enqueueSnackbar('Xóa thành công', { variant: 'success' });
      setIsDialogOpen(false);
      setSelectedDiscount(null);
    } catch (err) {
      console.error('Lỗi khi xóa:', err);
      enqueueSnackbar(err?.data?.message || 'Xóa không thành công', { variant: 'error' });
    }
  };

  const handleToggleStatus = async (row) => {
    try {
      let newData;
      if (row.status === discountStatus.HOATDONG) {
        newData = { id: row.id, status: discountStatus.NGUNG };
      } else {
        newData = { id: row.id, status: discountStatus.HOATDONG };
      }

      const res = await updateDiscountStatus(newData).unwrap();
      console.log('Status updated:', res);
    } catch (err) {
      console.error('Status update error:', err);
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

export default ListDiscount;
