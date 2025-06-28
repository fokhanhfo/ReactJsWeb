import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from 'react-redux';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from 'components/form-controls/InputForm';
import { ChromePicker } from 'react-color';
import { useSnackbar } from 'notistack';
import { useAddToColorMutation, useUpdateColorMutation } from 'hookApi/colorApi';

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
  const [updateColor, { isLoading, isSuccess, error }] = useUpdateColorMutation();

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

  const {
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { isDirty },
  } = form;

  const handleColorChange = (updatedColor) => {
    setValue('key', updatedColor.hex);
  };

  const onSubmitForm = async (data) => {
    setIsSubmitting(true);
    try {
      const updateData = { ...data, id: initialValues?.id };
      if (updateData.id) {
        await updateColor(updateData).unwrap();
        enqueueSnackbar('Cập nhật màu sắc thành công!', { variant: 'success' });
      } else {
        await addColor(updateData).unwrap();
        enqueueSnackbar('Thêm màu sắc thành công!', { variant: 'success' });
      }
      handleAction(activeAction, dispatch, { add, edit, del, view });
    } catch (error) {
      enqueueSnackbar(`${error?.data?.message || 'Có lỗi xảy ra'}`, { variant: 'error' });
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name || '',
        key: initialValues.key || '#ff0000',
      });
    }
  }, [initialValues, reset]);

  return (
    <Dialog open={add || edit} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 4 }}>
        <Typography variant="h6" fontWeight={600}>
          {initialValues ? 'Cập nhật màu' : 'Thêm màu mới'}
        </Typography>
        <IconButton onClick={() => handleAction(activeAction, dispatch, { add, edit, del, view })}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <DialogContent dividers sx={{ py: 3 }}>
          <Box display="flex" flexDirection="column" gap={3}>
            <InputField name="name" label="Tên màu" form={form} />
            <Box>
              <Typography fontWeight={500} gutterBottom>
                Mã màu
              </Typography>
              <Paper elevation={3} sx={{ display: 'inline-block', borderRadius: 2, overflow: 'hidden', p: 1 }}>
                <ChromePicker color={watch('key')} onChange={handleColorChange} disableAlpha />
              </Paper>
              <Typography mt={1} variant="caption" color="text.secondary">
                Mã hiện tại: <strong>{watch('key')}</strong>
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting || !isDirty}
            sx={{ borderRadius: 2, minWidth: 120 }}
          >
            {isSubmitting ? 'Đang lưu...' : initialValues ? 'Cập nhật' : 'Thêm Màu'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AddColor;
