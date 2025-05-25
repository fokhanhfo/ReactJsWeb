import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ReusableTable from 'admin/components/Table/ReusableTable';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';

ListPermission.propTypes = {
  permissions: PropTypes.array.isRequired,
  actionsState: PropTypes.object.isRequired,
};

function ListPermission({ permissions, loading, actionsState }) {
  const listHead = [
    { label: 'id', key: 'id', width: '10%' },
    { label: 'Permission', key: 'name', width: '30%' },
    {
      label: 'Thao tác',
      key: 'actions',
      width: '20%',
      render: (row) => (
        <>
          {/* <IconButton>
            <DeleteIcon />
          </IconButton>
          <IconButton>
            <Link to={`./${row.id}`}>
              <Update />
            </Link>
          </IconButton> */}
        </>
      ),
    },
  ];
  const dispatch = useDispatch();
  const handleActions = (state) => handleAction(state, dispatch, actionsState);
  return (
    <>
      <Box>
        <Button onClick={() => handleActions('add')} sx={{ float: 'right' }} variant="contained">
          Add
        </Button>
      </Box>
      <ReusableTable listHead={listHead} rows={permissions} />
    </>
  );
}

export default ListPermission;
