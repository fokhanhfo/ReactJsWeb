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
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from 'components/form-controls/InputForm';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import NumericForm from 'components/form-controls/NumericFormat';
import SelectFrom from 'components/form-controls/SelectFrom';
import { handleGlobalError, handleGlobalSuccess, optionCategoryDiscount, optionTypeDiscount } from 'utils';
import { useAddToDiscountMutation } from 'hookApi/discountApi';
import { useAddToDiscountPeriodMutation, useUpdateDiscountPeriodMutation } from 'hookApi/discountPeriodApi';
import { useSnackbar } from 'notistack';

AddDiscountPeriod.propTypes = {
  actionsState: PropTypes.object.isRequired,
  initialValues: PropTypes.object,
};

function AddDiscountPeriod({ actionsState, onSubmit, initialValues }) {
  const { add, edit, del, view } = actionsState;
  const activeAction = Object.keys(actionsState).find((key) => actionsState[key]);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const schema = yup
    .object({
      discountPeriodCode: yup.string().required('Bắt buộc'),
      discountPeriodName: yup.string().required('Bắt buộc'),
      minPercentageValue: yup
        .number()
        .transform((value, originalValue) =>
          typeof originalValue === 'string' && originalValue.trim() === '' ? undefined : value,
        )
        .typeError('Vui lòng nhập số')
        .required('Trường này là bắt buộc')
        .min(0, 'Giá trị tối thiểu phải ≥ 0')
        .max(100, 'Giá trị tối thiểu không được > 100'),

      maxPercentageValue: yup
        .number()
        .transform((value, originalValue) =>
          typeof originalValue === 'string' && originalValue.trim() === '' ? undefined : value,
        )
        .typeError('Vui lòng nhập số')
        .required('Trường này là bắt buộc')
        .min(0, 'Giá trị tối đa phải ≥ 0')
        .max(100, 'Giá trị tối đa không được > 100')
        .when('minPercentageValue', (min, schema) =>
          min !== undefined ? schema.min(min, 'Giá trị tối đa phải ≥ giá trị tối thiểu') : schema,
        ),
      startTime: yup
        .date()
        .transform((value, originalValue) => (originalValue === '' ? null : value)) // xử lý "" thành null
        .typeError('Vui lòng chọn thời gian bắt đầu') // lỗi nếu không phải là ngày hợp lệ
        .required('Vui lòng chọn thời gian bắt đầu'),

      endTime: yup
        .date()
        .transform((value, originalValue) => (originalValue === '' ? null : value)) // xử lý "" thành null
        .typeError('Vui lòng chọn thời gian kết thúc') // lỗi nếu không phải là ngày hợp lệ
        .required('Vui lòng chọn thời gian kết thúc')
        .min(yup.ref('startTime'), 'Thời gian kết thúc phải sau thời gian bắt đầu'),
    })
    .required();

  const form = useForm({
    defaultValues: {
      discountPeriodCode: '',
      discountPeriodName: '',
      minPercentageValue: '',
      maxPercentageValue: '',
      startTime: '',
      endTime: '',
    },
    resolver: yupResolver(schema),
  });

  const {
    control,
    formState: { errors, isDirty },
  } = form;

  const [addDiscount] = useAddToDiscountMutation();
  const [addToDiscountPeriod] = useAddToDiscountPeriodMutation();
  const [updateDiscountPeriod, { isLoading, isSuccess, isError, error }] = useUpdateDiscountPeriodMutation();

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      form.reset({
        discountPeriodCode: initialValues.discountPeriodCode || '',
        discountPeriodName: initialValues.discountPeriodName || '',
        minPercentageValue: initialValues.minPercentageValue || 0,
        maxPercentageValue: initialValues.maxPercentageValue || 0,
        startTime: initialValues.startTime ? dayjs(initialValues.startTime) : null,
        endTime: initialValues.endTime ? dayjs(initialValues.endTime) : null,
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
      const newValue = {
        ...value,
        id: initialValues?.id || null,
        startTime: convertToVietnamTime(value.startTime),
        endTime: convertToVietnamTime(value.endTime),
        status: 1,
      };

      let response;
      if (newValue.id) {
        // Có ID → cập nhật
        response = await updateDiscountPeriod(newValue).unwrap();
      } else {
        // Không có ID → thêm mới
        response = await addToDiscountPeriod(newValue).unwrap();
      }

      console.log(response);
      if (response) {
        enqueueSnackbar(newValue.id ? 'Cập nhật mã giảm giá thành công' : 'Thêm mã giảm giá thành công', {
          variant: 'success',
        });
        handleAction(activeAction, dispatch, { add, edit, del, view });
        form.reset();
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error?.data?.message || 'Đã xảy ra lỗi', {
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                      name="discountPeriodCode"
                      label="Mã giảm giá *"
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
                      name="discountPeriodName"
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

              {/* <Paper
                elevation={0}
                sx={{ p: 2, mb: 3, backgroundColor: alpha(theme.palette.primary.light, 0.05), borderRadius: '8px' }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
                  Phân loại
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
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
                  <Grid item xs={12} sm={6}>
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
                </Grid>
              </Paper> */}

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
                      name={`minPercentageValue`}
                      label={
                        <>
                          Giới trị % tối thiểu <span style={{ color: 'red' }}>*</span>
                        </>
                      }
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
                      name={`maxPercentageValue`}
                      label="Giá trị % tối đa"
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
                  {/* <Grid item xs={12} sm={6} md={3}>
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
                  </Grid> */}
                  {/* <Grid item xs={12} sm={6} md={3}>
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
                  </Grid> */}
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
                            onChange={(newValue) => field.onChange(newValue)}
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
                            onChange={(newValue) => field.onChange(newValue)}
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
            disabled={isSubmitting || !isDirty}
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

export default AddDiscountPeriod;
