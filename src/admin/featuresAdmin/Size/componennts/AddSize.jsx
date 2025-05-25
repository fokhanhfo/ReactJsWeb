import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from 'react-redux';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from 'components/form-controls/InputForm';
import { useAddToSizeMutation } from 'hookApi/sizeApi';
import { ChromePicker } from 'react-color';

AddSize.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  actionsState: PropTypes.object.isRequired,
  initialValues: PropTypes.object,
};

function AddSize({ actionsState, onSubmit, initialValues }) {
  const { add, edit, del, view } = actionsState;
  console.log(initialValues);
  const activeAction = Object.keys(actionsState).find((key) => actionsState[key]);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addSize] = useAddToSizeMutation(); // Sử dụng hook đúng cách

  const schema = yup.object({
    name: yup.string().required('Bắt buộc'),
  });

  const form = useForm({
    defaultValues: {
      name: '',
    },
    resolver: yupResolver(schema),
  });

  const { setValue, handleSubmit } = form;

  const onSubmitForm = async (data) => {
    setIsSubmitting(true);
    try {
      const updateData = { ...data, id: initialValues?.id };
      await addSize(updateData).unwrap();
    } catch (error) {
      console.error('Lỗi khi thêm màu:', error);
    } finally {
      setIsSubmitting(false);
      form.reset();
      handleAction(activeAction, dispatch, { add, edit, del, view });
    }
  };

  useEffect(() => {
    if (initialValues) {
      form.reset({
        name: initialValues.name || '',
      });
    }
  }, [initialValues, form]);

  return (
    <Dialog aria-labelledby="customized-dialog-title" open={add || edit}>
      <DialogTitle sx={{ m: 0, p: 2 }}>Thêm màu mới</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => handleAction(activeAction, dispatch, { add, edit, del, view })}
        sx={{ position: 'absolute', right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <DialogContent dividers>
          <Box display="flex" gap={2} flexDirection="column">
            <InputField name="name" label="Tên màu" form={form} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button type="submit" autoFocus disabled={isSubmitting}>
            {isSubmitting ? 'Đang thêm...' : 'Thêm Màu'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AddSize;
