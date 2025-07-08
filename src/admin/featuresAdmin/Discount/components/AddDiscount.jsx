import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  Typography,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from 'components/form-controls/InputForm';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import NumericForm from 'components/form-controls/NumericFormat';
import SelectFrom from 'components/form-controls/SelectFrom';
import { handleGlobalError, handleGlobalSuccess, optionCategoryDiscount, optionTypeDiscount } from 'utils';
import { enqueueSnackbar } from 'notistack';
import { useAddToDiscountMutation, useUpdateDiscountMutation } from 'hookApi/discountApi';
import { discountType } from 'enum/discountType';
import RadioForm from 'components/form-controls/RadioForm';

AddDiscount.propTypes = {
  actionsState: PropTypes.object.isRequired,
  initialValues: PropTypes.object,
};

function AddDiscount({ actionsState, initialValues }) {
  const { add, edit, del, view } = actionsState;
  const activeAction = Object.keys(actionsState).find((key) => actionsState[key]);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useTheme();

  const schema = yup
    .object({
      discountCode: yup.string().required('Bắt buộc'),
      discountName: yup.string().required('Bắt buộc'),
      type: yup
        .object()
        .transform((value, originalValue) => (originalValue === '' ? null : value))
        .nullable()
        .required('Loại giảm giá là bắt buộc'),
      category: yup
        .object()
        .transform((value, originalValue) => (originalValue === '' ? null : value))
        .nullable()
        .required('Danh mục là bắt buộc'),
      value: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .required('Bắt buộc')
        .positive('Phải là số dương')
        .when('type', {
          is: (type) => type?.id === discountType.TIENMAT, // Tiền mặt
          then: (schema) => schema.min(1000, 'Giá trị phải lớn hơn 1000'),
          otherwise: (schema) =>
            schema.max(100, 'Giá trị phải nhỏ hơn hoặc bằng 100').min(0, 'Giá trị phải lớn hơn hoặc bằng 0'),
        }),

      maxValue: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? null : value))
        .nullable()
        .when('type', {
          is: (type) => type?.id === 1,
          then: (schema) =>
            schema
              .required('Giá trị tối đa là bắt buộc khi loại giảm giá là tiền mặt')
              .moreThan(1000, 'Phải lớn hơn 1000'),
          otherwise: (schema) =>
            schema
              .nullable()
              .test(
                'is-zero-or-null',
                'Phải là 0 hoặc để trống',
                (value) => value === 0 || value === null || value === undefined,
              ),
        }),

      discountCondition: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .required('Bắt buộc')
        .min(1001, 'Phải lớn hơn 1000'),

      quantity: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .required('Bắt buộc')
        .min(1, 'Phải ít nhất là 1'),

      startTime: yup
        .date()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .required('Bắt buộc'),

      endTime: yup
        .date()
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .required('Bắt buộc')
        .min(yup.ref('startTime'), 'Phải sau ngày bắt đầu'),
      enable: yup.boolean().required('Trạng thái là bắt buộc'),
    })
    .required();

  const form = useForm({
    defaultValues: {
      discountCode: '',
      discountName: '',
      type: null,
      category: null,
      value: '',
      maxValue: '',
      discountCondition: '',
      quantity: '',
      startTime: null,
      endTime: null,
      enable: 'false',
    },
    resolver: yupResolver(schema),
  });

  const {
    control,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = form;

  const typeValue = watch('type');
  const isCashType = typeValue?.id === discountType.TIENMAT;

  const [addDiscount] = useAddToDiscountMutation();
  const [updateDiscount] = useUpdateDiscountMutation();

  useEffect(() => {
    if (isCashType) {
      setValue('maxValue', 0);
    }
  }, [isCashType, setValue]);

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      form.reset({
        discountCode: initialValues.discountCode || '',
        discountName: initialValues.discountName || '',
        type: initialValues.type ? optionTypeDiscount.find((item) => item.id === initialValues.type) : null,
        category: initialValues.category
          ? optionCategoryDiscount.find((item) => item.id === initialValues.category)
          : null,
        value: initialValues.value || 0,
        maxValue: initialValues.maxValue || 0,
        discountCondition: initialValues.discountCondition || 0,
        quantity: initialValues.quantity || 0,
        startTime: initialValues.startTime ? dayjs(initialValues.startTime) : null,
        endTime: initialValues.endTime ? dayjs(initialValues.endTime) : null,
        enable: initialValues.enable || 'false',
      });
    }
  }, [initialValues, form]);

  function convertToVietnamTime(utcDateString) {
    const date = new Date(utcDateString);
    date.setHours(date.getHours() + 7); // Cộng thêm 7 giờ
    return date.toISOString().slice(0, 16);
  }

  const handleSubmit = async (value) => {
    setIsSubmitting(true);

    try {
      const typeId = value?.type?.id;
      const categoryId = value?.category?.id;

      if (!typeId || !categoryId) {
        throw new Error('Loại hoặc danh mục không hợp lệ.');
      }

      const newValue = {
        ...value,
        startTime: convertToVietnamTime(value.startTime),
        endTime: convertToVietnamTime(value.endTime),
        type: typeId,
        category: categoryId,
        status: 1,
      };
      console.log(value);

      let response;
      if (initialValues?.id) {
        response = await updateDiscount({ ...newValue, id: initialValues.id }).unwrap();
        enqueueSnackbar('Cập nhật mã giảm giá thành công', { variant: 'success' });
      } else {
        response = await addDiscount(newValue).unwrap();
        enqueueSnackbar('Thêm mã giảm giá thành công', { variant: 'success' });
      }

      form.reset();
      handleAction(activeAction, dispatch, { add, edit, del, view });
    } catch (error) {
      console.error('Lỗi khi thêm mã giảm giá:', error);
      const errorMessage = error.data?.message || error.message || 'Đã xảy ra lỗi!';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const startTime = useWatch({ control, name: 'startTime' });
  const endTime = useWatch({ control, name: 'endTime' });

  const numberOfDays =
    startTime && endTime
      ? dayjs(endTime).diff(dayjs(startTime), 'day') + 1 // +1 nếu muốn tính cả ngày bắt đầu
      : null;

  return (
    <Dialog
      aria-labelledby="customized-dialog-title"
      open={add || edit}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        elevation: 3,
        sx: {
          width: '800px',
          maxWidth: 'none',
          borderRadius: '12px',
          overflow: 'hidden',
        },
      }}
    >
      <Box sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1100, borderBottom: '1px solid #ddd' }}>
        <DialogTitle
          sx={{
            m: 0,
            p: 2.5,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          id="customized-dialog-title"
        >
          <Typography variant="h6" component="div" fontWeight="bold">
            {edit ? 'Cập nhật phiếu giảm giá' : 'Thêm phiếu giảm giá'}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => handleAction(activeAction, dispatch, { add, edit, del, view })}
            sx={{
              color: theme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.contrastText, 0.1),
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      </Box>

      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <DialogContent dividers sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Box width="100%">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Paper
                elevation={0}
                sx={{ p: 2, mb: 3, backgroundColor: alpha(theme.palette.primary.light, 0.05), borderRadius: '8px' }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
                  Thông tin cơ bản
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <InputField
                      name="discountCode"
                      label="Mã giảm giá"
                      form={form}
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          height: '48px',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputField
                      name="discountName"
                      label="Tên giảm giá"
                      form={form}
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          height: '48px',
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>

              <Paper
                elevation={0}
                sx={{ p: 2, mb: 3, backgroundColor: alpha(theme.palette.primary.light, 0.05), borderRadius: '8px' }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
                  Phân loại
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={3.5}>
                    <SelectFrom
                      height="48px"
                      name={`type`}
                      label="Loại giảm giá"
                      form={form}
                      options={optionTypeDiscount}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3.5}>
                    <SelectFrom
                      height="48px"
                      name={`category`}
                      label="Danh mục áp dụng"
                      form={form}
                      options={optionCategoryDiscount}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <RadioForm
                      name="enable"
                      form={form}
                      option={[
                        { id: 'true', name: 'Hiện trang chủ' },
                        { id: 'false', name: 'Không hiện' },
                      ]}
                    />
                  </Grid>
                </Grid>
              </Paper>

              <Paper
                elevation={0}
                sx={{ p: 2, mb: 3, backgroundColor: alpha(theme.palette.primary.light, 0.05), borderRadius: '8px' }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
                  Giá trị và điều kiện
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6} md={3}>
                    <NumericForm
                      name={`value`}
                      label="Giá trị giảm"
                      disabled={typeValue === null ? true : false}
                      form={form}
                      type="number"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          height: '48px',
                        },
                      }}
                    />
                  </Grid>
                  {/* {!isCashType && ( */}
                  <Grid item xs={12} sm={6} md={3}>
                    <NumericForm
                      name={`maxValue`}
                      label="Giá trị tối đa"
                      form={form}
                      type="number"
                      disabled={isCashType}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          height: '48px',
                        },
                      }}
                    />
                  </Grid>
                  {/* )} */}
                  <Grid item xs={12} sm={6} md={3}>
                    <NumericForm
                      name={`discountCondition`}
                      label="Điều kiện giảm giá"
                      form={form}
                      type="number"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          height: '48px',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <NumericForm
                      name={`quantity`}
                      label="Số lượng"
                      form={form}
                      type="number"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          height: '48px',
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>

              <Paper
                elevation={0}
                sx={{ p: 2, backgroundColor: alpha(theme.palette.primary.light, 0.05), borderRadius: '8px' }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
                  Thời gian áp dụng
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <FormControl margin="normal" fullWidth>
                      <Controller
                        name="startTime"
                        control={control}
                        render={({ field }) => (
                          <DateTimePicker
                            label="Thời gian bắt đầu"
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(newValue: Dayjs | null) => {
                              // Kiểm tra xem newValue có hợp lệ không
                              if (newValue && newValue.isValid()) {
                                field.onChange(newValue.toISOString());
                              } else {
                                field.onChange(null);
                              }
                            }}
                            format="DD/MM/YYYY HH:mm"
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!errors.startTime,
                                helperText: errors.startTime?.message,
                                sx: {
                                  '& .MuiOutlinedInput-root': {
                                    height: 48,
                                    borderRadius: '8px',
                                  },
                                },
                              },
                            }}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl margin="normal" fullWidth>
                      <Controller
                        name="endTime"
                        control={control}
                        render={({ field }) => (
                          <DateTimePicker
                            label="Thời gian kết thúc"
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(newValue: Dayjs | null) => {
                              // Kiểm tra xem newValue có hợp lệ không
                              if (newValue && newValue.isValid()) {
                                field.onChange(newValue.toISOString());
                              } else {
                                field.onChange(null);
                              }
                            }}
                            format="DD/MM/YYYY HH:mm"
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!errors.endTime,
                                helperText: errors.endTime?.message,
                                sx: {
                                  '& .MuiOutlinedInput-root': {
                                    height: 48,
                                    borderRadius: '8px',
                                  },
                                },
                              },
                            }}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                {numberOfDays !== null && numberOfDays >= 0 && (
                  <Typography mt={2} color="text.secondary">
                    Áp dụng trong {numberOfDays} ngày
                  </Typography>
                )}
              </Paper>
            </LocalizationProvider>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{ position: 'sticky', bottom: 0, backgroundColor: 'white', zIndex: 1100, borderTop: '1px solid #ddd' }}
        >
          <Button
            variant="outlined"
            onClick={() => handleAction(activeAction, dispatch, { add, edit, del, view })}
            sx={{
              borderRadius: '8px',
              px: 3,
              py: 1,
            }}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isDirty || isSubmitting}
            sx={{
              borderRadius: '8px',
              px: 3,
              py: 1,
            }}
          >
            {isSubmitting ? 'Đang xử lý...' : edit ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AddDiscount;
