import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAddToSizeMutation, useUpdateSizeMutation } from 'hookApi/sizeApi';
import { useSnackbar } from 'notistack';
import NumericForm from 'components/form-controls/NumericFormat';

AddSize.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmitSuccess: PropTypes.func,
  initialValues: PropTypes.object,
};

function AddSize({ onClose, onSubmitSuccess, initialValues }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addSize] = useAddToSizeMutation();
  const [updateSize] = useUpdateSizeMutation();
  const { enqueueSnackbar } = useSnackbar();

  const schema = yup.object({
    name: yup
      .number()
      .typeError('Phải là số')
      .required('Bắt buộc')
      .min(35, 'Giá trị tối thiểu là 35')
      .max(50, 'Giá trị tối đa là 50'),
  });

  const form = useForm({
    defaultValues: {
      name: '',
    },
    resolver: yupResolver(schema),
  });

  const { handleSubmit, reset, formState } = form;

  const onSubmitForm = async (data) => {
    setIsSubmitting(true);
    try {
      if (initialValues?.id) {
        await updateSize({ ...data, id: initialValues.id }).unwrap();
        enqueueSnackbar('Cập nhật thành công', { variant: 'success' });
      } else {
        await addSize(data).unwrap();
        enqueueSnackbar('Thêm thành công', { variant: 'success' });
      }
      onSubmitSuccess?.();
      reset();
    } catch (err) {
      enqueueSnackbar(err?.data?.message || 'Có lỗi xảy ra', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name || '',
      });
    }
  }, [initialValues, reset]);

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 600 }}>
        {initialValues ? 'Cập nhật kích thước' : 'Thêm kích thước'}
      </DialogTitle>
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <form onSubmit={handleSubmit(onSubmitForm)}>
        <DialogContent dividers sx={{ px: 4, py: 3 }}>
          <Box display="flex" flexDirection="column" gap={2}>
            <NumericForm name="name" label="Kích thước (mm)" form={form} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 2 }}>
          <Button type="submit" variant="contained" fullWidth disabled={isSubmitting || !formState.isDirty}>
            {isSubmitting ? (initialValues ? 'Đang cập nhật...' : 'Đang thêm...') : initialValues ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AddSize;
