import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'admin/components/Table/DataTable';
import { Box, Button, IconButton } from '@mui/material';
import { useDispatch } from 'react-redux';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';
import { Update } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddDiscount from './AddDiscount';
import { optionCategoryDiscount, optionTypeDiscount } from 'utils';
import { Link } from 'react-router-dom';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PercentIcon from '@mui/icons-material/Percent';
import MoneyIcon from '@mui/icons-material/Money';

ListDiscount.propTypes = {
  discounts: PropTypes.array.isRequired,
  actionsState: PropTypes.object.isRequired,
};

function ListDiscount({ discounts, loading, actionsState }) {
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.4,
      renderCell: (params) => <Link to={`./${params.row.id}`}>#{params.row.id}</Link>,
    },
    {
      field: 'discountCode',
      headerName: 'Code giảm giá',
      flex: 1,
      renderCell: (params) => {
        const discountType = optionTypeDiscount.find((item) => item.id === params.row.type);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {discountType?.id === 1 ? (
              <PercentIcon sx={{ color: '#1976d2', marginRight: '5px' }} />
            ) : discountType?.id === 2 ? (
              <MoneyIcon sx={{ color: '#4caf50', marginRight: '5px' }} />
            ) : null}
            {params.row.discountCode}
          </Box>
        );
      },
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
    {
      field: 'category',
      headerName: 'Danh mục',
      flex: 0.5,
      renderCell: (params) => {
        const categoryDiscount = optionCategoryDiscount.find((item) => item.id === params.row.category);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {categoryDiscount?.id === 1 ? (
              <>
                <ShoppingBagIcon sx={{ color: '#1976d2', marginRight: '5px' }} /> {categoryDiscount?.name}
              </>
            ) : categoryDiscount?.id === 2 ? (
              <>
                <LocalShippingIcon sx={{ color: '#1976d2', marginRight: '5px' }} /> {categoryDiscount?.name}
              </>
            ) : null}
          </Box>
        );
      },
    },
    { field: 'value', headerName: 'Giá trị', flex: 0.7 },
    { field: 'maxValue', headerName: 'Giá trị tối đa', flex: 0.7 },
    { field: 'discountCondition', headerName: 'Điều kiện giảm', flex: 0.5 },
    { field: 'quantity', headerName: 'Số lượng', flex: 0.5 },
    // { field: 'startTime', headerName: 'Bắt đầu', width: 150 },
    // { field: 'endTime', headerName: 'Kết thúc', flex: 1 },
    { field: 'status', headerName: 'Trạng thái', flex: 0.5 },
    {
      field: 'actions',
      headerName: 'Thao tác',
      flex: 0.5,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleActions('edit', params.row)}>
            <Update color="success" />
          </IconButton>
          <IconButton>
            <DeleteIcon color="error" />
          </IconButton>
        </>
      ),
    },
  ];

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
      {actionsState.edit === true && selectedDiscount !== null ? (
        <AddDiscount actionsState={actionsState} initialValues={selectedDiscount} />
      ) : null}
    </>
  );
}

export default ListDiscount;
