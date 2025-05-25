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
import CKEditorForm from 'components/form-controls/CKEditorForm';
import categoryApi from 'api/categoryApi';
import { useAddToCategoryMutation } from 'hookApi/categoryApi';

AddCategory.propTypes = {
  onSubmit: PropTypes.func,
  actionsState: PropTypes.object.isRequired,
  initialValues: PropTypes.object,
};

function AddCategory({ actionsState, onSubmit, initialValues }) {
  const { add, edit, del, view } = actionsState;
  const activeAction = Object.keys(actionsState).find((key) => actionsState[key]);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [addCategory] = useAddToCategoryMutation();

  const schema = yup
    .object({
      name: yup.string().required('Bắt buộc'),
      description: yup.string().required('Bắt buộc'),
    })
    .required();

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
    },
    resolver: yupResolver(schema),
  });

  const { setValue, handleSubmit } = form;

  const onSubmitForm = async (data) => {
    setIsSubmitting(true);
    try {
      await addCategory(data).unwrap();
      enqueueSnackbar('success', { variant: 'success' });
    } catch (err) {
      console.log(err);
      enqueueSnackbar('error' + err.data.message, { variant: 'error' });
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
        description: initialValues.description || '',
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
            <InputField name="name" label="Tên danh mục" form={form} />
            <CKEditorForm name="description" lable="Chi tiết danh mục" form={form} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Đang thêm...' : 'Thêm danh mục'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AddCategory;
