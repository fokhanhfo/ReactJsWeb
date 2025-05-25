import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, IconButton } from '@mui/material';
import { useDispatch } from 'react-redux';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';
import ReusableTable from 'admin/components/Table/ReusableTable';
import DeleteIcon from '@mui/icons-material/Delete';
import { Update } from '@mui/icons-material';
import AddColor from './AddColor';
ListColor.propTypes = {
  colors: PropTypes.array.isRequired,
  actionsState: PropTypes.object.isRequired,
};

function ListColor({ colors, actionsState }) {
  const [selectedColor, setSelectedColor] = useState(null);
  const listHead = [
    { label: 'id', key: 'id', width: '10%' },
    {
      label: 'Color',
      width: '10%',
      render: (row) => (
        <>
          <span
            style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
            onClick={() => handleActions('view', row)}
          >
            {row.name}
          </span>
        </>
      ),
    },
    { label: 'Key', key: 'key', width: '10%' },
    {
      label: 'Color Key',
      width: '30%',
      render: (row) => {
        return (
          <>
            <Box
              width={30}
              margin={'auto'}
              height={30}
              borderRadius="50%"
              bgcolor={`${row.key}`}
              border={1}
              borderColor="black"
            />
          </>
        );
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
      setSelectedColor(row);
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
      <ReusableTable listHead={listHead} rows={colors} />
      {actionsState.edit === true && <AddColor actionsState={actionsState} initialValues={selectedColor} />}
    </>
  );
}

export default ListColor;
