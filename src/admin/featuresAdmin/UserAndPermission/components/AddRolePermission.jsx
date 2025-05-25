import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from 'react-redux';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';

AddRolePermission.propTypes = {
  actionsState: PropTypes.object.isRequired,
};

function AddRolePermission({ actionsState }) {
  const { add, edit, del, view } = actionsState;
  const dispatch = useDispatch();
  const handleClose = () => {
    handleAction('add', dispatch, { add, edit, del, view });
  };
  return (
    <Dialog aria-labelledby="customized-dialog-title" open={add}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Modal title
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>khánh</DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddRolePermission;
