import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ReusableTable from 'admin/components/Table/ReusableTable';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';
import { resetState } from 'admin/reduxAdmin/slices/actionsSlice';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AddRolePermission from './AddRolePermission';

ListPermission.propTypes = {
  permissions: PropTypes.array.isRequired,
  roles: PropTypes.array.isRequired,
};

function ListPermission({ permissions, roles }) {
  const listHead = [
    { label: 'id', key: 'id', width: '10%' },
    { label: 'Role', key: 'name', width: '30%' },
    {
      label: 'Permission',
      width: '40%',
      render: (row) => {
        const roels = row.permissions.map((role) => role.name).join(', ');
        return <>{roels}</>;
      },
    },
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
  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);
  const actionsState = useSelector((state) => state.actions);
  const handleActions = (state) => handleAction(state, dispatch, actionsState);
  return (
    <>
      <Box>
        <Button onClick={() => handleActions('add')} sx={{ float: 'right' }} variant="contained">
          Add
        </Button>
      </Box>
      <ReusableTable listHead={listHead} rows={roles} />
      <AddRolePermission actionsState={actionsState} />
    </>
  );
}

export default ListPermission;
