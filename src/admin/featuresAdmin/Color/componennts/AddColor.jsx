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
import { ChromePicker } from 'react-color';
import { useSnackbar } from 'notistack';
import { useAddToColorMutation } from 'hookApi/colorApi';

AddColor.propTypes = {
  onSubmit: PropTypes.func,
  actionsState: PropTypes.object.isRequired,
  initialValues: PropTypes.object,
};

function AddColor({ actionsState, onSubmit, initialValues }) {
  const { add, edit, del, view } = actionsState;
  const activeAction = Object.keys(actionsState).find((key) => actionsState[key]);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [addColor] = useAddToColorMutation();

  const schema = yup
    .object({
      name: yup.string().required('Bắt buộc'),
      key: yup.string().required('Bắt buộc'),
    })
    .required();

  const form = useForm({
    defaultValues: {
      name: '',
      key: '#ff0000',
    },
    resolver: yupResolver(schema),
  });

  const { setValue, handleSubmit } = form;

  const handleColorChange = (updatedColor) => {
    setValue('key', updatedColor.hex);
  };

  const onSubmitForm = async (data) => {
    setIsSubmitting(true);
    try {
      const updateData = { ...data, id: initialValues?.id };
      await addColor(updateData).unwrap();
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
        key: initialValues.key || '#ff0000',
      });
    }
  }, [initialValues, form]);

  return (
    <Dialog aria-labelledby="customized-dialog-title" open={add || edit}>
      <DialogTitle sx={{ m: 0, p: 2 }}>{initialValues ? 'Sửa màu' : 'Thêm màu mới'}</DialogTitle>
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
            <ChromePicker color={form.watch('key')} onChange={handleColorChange} />
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

export default AddColor;
