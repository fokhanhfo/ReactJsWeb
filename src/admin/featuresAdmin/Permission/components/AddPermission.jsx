import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from 'react-redux';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from 'components/form-controls/InputForm';
import permissionApi from 'api/permission';

AddPermission.propTypes = {
  actionsState: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

function AddPermission({ actionsState, onSubmit }) {
  const { add, edit, del, view } = actionsState;
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = yup
    .object({
      name: yup.string().required('Bắt buộc'),
    })
    .required();

  const form = useForm({
    defaultValues: {
      name: '',
    },
    resolver: yupResolver(schema),
  });

  // const handleSubmit = (value) => {
  //   if (handleClose) {
  //     handleClose();
  //   }
  //   form.reset();
  // };

  const handleClose = async (value) => {
    setIsSubmitting(true); // Bắt đầu chờ API
    try {
      const response = await permissionApi.add(value);
      if (response) {
        onSubmit(true); // Cập nhật danh sách sau khi thêm quyền thành công
      }
    } catch (error) {
      console.error('Error adding permission:', error);
    } finally {
      setIsSubmitting(false); // Kết thúc quá trình chờ
      form.reset();
      handleAction('add', dispatch, { add, edit, del, view });
    }
  };

  return (
    <Dialog aria-labelledby="customized-dialog-title" open={add}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Thêm quyền mới
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
      <form onSubmit={form.handleSubmit(handleClose)}>
        <DialogContent dividers>
          <InputField name="name" label="Name" form={form} />
        </DialogContent>
        <DialogActions>
          <Button type="submit" autoFocus disabled={isSubmitting}>
            {isSubmitting ? 'Đang thêm...' : 'Thêm quyền'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AddPermission;
