import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, IconButton } from '@mui/material';
import { useDispatch } from 'react-redux';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';
import ReusableTable from 'admin/components/Table/ReusableTable';
import DeleteIcon from '@mui/icons-material/Delete';
import { Update } from '@mui/icons-material';
import AddSize from './AddSize';
ListSize.propTypes = {
  sizes: PropTypes.array.isRequired,
  actionsState: PropTypes.object.isRequired,
};

function ListSize({ sizes, actionsState }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const listHead = [
    {
      label: 'Size',
      width: '10%',
      render: (row) => (
        <>
          <span
            style={{ cursor: 'pointer', size: 'blue', textDecoration: 'underline' }}
            onClick={() => handleActions('view', row)}
          >
            {row.name}
          </span>
        </>
      ),
    },
    {
      label: 'Trạng thái',
      width: '30%',
      render: (row) => {
        console.log(row);
        return <>{row.status === 0 ? 'Ngưng bán' : 'Đang bán'}</>;
      },
    },
    {
      label: 'Thao tác',
      key: 'actions',
      width: '20%',
      render: (row) => (
        <>
          <IconButton onClick={() => handleActions('edit', row)}>
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
      setSelectedSize(row);
    }
    handleAction(state, dispatch, actionsState);
  };
  return (
    <>
      <Box>
        <Button onClick={() => handleActions('add')} sx={{ float: 'right' }} variant="contained">
          Add
        </Button>
      </Box>
      <ReusableTable listHead={listHead} rows={sizes} />
      {actionsState.edit === true && <AddSize actionsState={actionsState} initialValues={selectedSize} />}
    </>
  );
}

export default ListSize;
