import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from 'components/form-controls/InputForm';
import { useSnackbar } from 'notistack';
import ButtonBase from '@mui/material/ButtonBase';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField, LocalizationProvider } from '@mui/x-date-pickers';
import { get } from 'lodash';
import dayjs from 'dayjs';
import RadioForm from 'components/form-controls/RadioForm';
import { useAddUserMutation, useUpdateUserMutation } from 'hookApi/userApi';
import { useGetRoleQuery } from 'hookApi/roleApi';

AddUser.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmitSuccess: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  listRole: PropTypes.object,
};

function AddUser({ onClose, onSubmitSuccess, initialValues }) {
  const { data: dataRole, error: errorRole, isLoading: isLoadingRole } = useGetRoleQuery();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addUser] = useAddUserMutation();
  const [updateUser, { isLoading, isSuccess, error }] = useUpdateUserMutation();
  const { enqueueSnackbar } = useSnackbar();

  const schema = yup.object({
    fullName: yup.string().required('Họ và tên là bắt buộc').max(100, 'Họ và tên tối đa 100 ký tự'),

    birthday: yup.date().nullable().typeError('Ngày sinh không hợp lệ'),

    gender: yup.string().oneOf(['true', 'false', ''], 'Giới tính không hợp lệ'),

    address: yup.string().nullable().max(255, 'Địa chỉ tối đa 255 ký tự'),

    email: yup.string().required('Email là bắt buộc').email('Email không hợp lệ'),

    phone: yup
      .string()
      .nullable()
      .matches(/^(0|\+84)[0-9]{9}$/, 'Số điện thoại không hợp lệ'),

    username: yup
      .string()
      .required('Tên đăng nhập là bắt buộc')
      .min(4, 'Tên đăng nhập phải có ít nhất 4 ký tự')
      .max(50, 'Tên đăng nhập tối đa 50 ký tự'),

    // password: yup.string().when('id', {
    //   is: (id) => !id, // Nếu không có id => đang ở chế độ thêm mới => password là bắt buộc
    //   then: (schema) => schema.required('Mật khẩu là bắt buộc').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    //   otherwise: (schema) => schema.notRequired(),
    // }),

    file: yup
      .mixed()
      .nullable()
      .test('fileFormat', 'Chỉ chấp nhận ảnh JPEG hoặc PNG', (value) => {
        if (!value) return true;
        return ['image/jpeg', 'image/png'].includes(value.type);
      }),
    roles: yup.array().of(yup.string()).min(1, 'Vui lòng chọn ít nhất một vai trò').required('Vai trò là bắt buộc'),
  });

  const form = useForm({
    defaultValues: {
      fullName: '',
      birthday: '',
      gender: '',
      address: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      file: null,
      roles: [],
    },
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = form;

  const onSubmitForm = async (data) => {
    setIsSubmitting(true);
    try {
      const formErrors = Object.keys(errors);
      if (formErrors.length > 0) {
        formErrors.forEach((errorKey) => {
          enqueueSnackbar(errors[errorKey]?.message || 'Có lỗi xảy ra trong form', { variant: 'error' });
        });
        return;
      }
      console.log('data', data);
      let updatedValues = {
        ...data,
        id: initialValues?.id,
        roles: data.roles.map((roleId) => ({ id: roleId })),
        typeLogin: 0,
      };
      console.log('updatedValues', updatedValues);
      const formData = new FormData();
      formData.append('userRequest', new Blob([JSON.stringify(updatedValues)], { type: 'application/json' }));
      if (data.file) {
        formData.append('file', data.file);
      }
      if (initialValues) {
        await updateUser(formData).unwrap();
      } else {
        await addUser(formData).unwrap();
      }
      reset();
      onSubmitSuccess();
    } catch (error) {
      enqueueSnackbar(error?.data?.message || 'Thêm người dùng thất bại', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (initialValues) {
      form.reset({
        fullName: initialValues.fullName || '',
        birthday: initialValues.birthday || '',
        gender: initialValues.gender || '',
        address: initialValues.address || '',
        email: initialValues.email || '',
        phone: initialValues.phone || '',
        username: initialValues.username || '',
        roles: initialValues.roles.map((item) => item.id) || [],
      });
    }
  }, [initialValues, form]);

  console.log('error', errors);

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Thêm người dùng
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <form id="add-user-form" onSubmit={handleSubmit(onSubmitForm)}>
          <Box display="flex" gap={2} mb={2}>
            <Box sx={{ textAlign: 'center' }}>
              <FormControl fullWidth error={!!errors.file} sx={{ textAlign: 'center' }}>
                <Controller
                  name="file"
                  control={form.control}
                  defaultValue={null}
                  render={({ field }) => {
                    console.log('field.value', initialValues?.userImage?.userImage);
                    return (
                      <>
                        <Avatar
                          src={
                            field.value ? URL.createObjectURL(field.value) : `${initialValues?.userImage?.userImage}`
                          }
                          sx={{ width: 120, height: 120, margin: '0 auto', marginBottom: '16px' }}
                        />
                        <Button variant="outlined" component="label">
                          Chọn Ảnh
                          <input
                            hidden
                            accept="image/*"
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                field.onChange(file);
                              }
                            }}
                          />
                        </Button>
                        <Typography variant="body2" color="text.secondary" sx={{ marginTop: '8px' }}>
                          Định dạng: .JPEG, .PNG
                        </Typography>
                      </>
                    );
                  }}
                />
                {errors.file && <FormHelperText>{errors.file.message}</FormHelperText>}
              </FormControl>
            </Box>
            <Box>
              <Box display="flex" gap={2} mb={2}>
                <InputField name="username" label="Tên đăng nhập" form={form} />
                <InputField name="password" label="Mật khẩu" form={form} type="password" />
              </Box>
              <Box display="flex" gap={2} mb={2}>
                <InputField name="email" label="Email" form={form} />
              </Box>
              <Box display="flex" gap={2} mb={2}>
                <RadioForm
                  name="gender"
                  label="Giới tính"
                  form={form}
                  option={[
                    { id: 'true', name: 'Nam' },
                    { id: 'false', name: 'Nữ' },
                    { id: '', name: 'Khác' },
                  ]}
                />
              </Box>
            </Box>
          </Box>
          <Box display="flex" gap={2} mb={2}>
            <InputField name="fullName" label="Họ và tên" form={form} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <FormControl fullWidth>
                <Controller
                  name={'birthday'}
                  control={form.control}
                  render={({ field }) => {
                    // Đảm bảo rằng giá trị khởi tạo là Dayjs hợp lệ
                    const dateValue = field.value ? dayjs(field.value) : null;
                    return (
                      <DateField
                        {...field}
                        value={dateValue}
                        label={'Ngày sinh'}
                        size="small"
                        variant="outlined"
                        inputFormat="DD/MM/YYYY"
                      />
                    );
                  }}
                />
                {get(errors, 'birthday' + '.message') && (
                  <FormHelperText>{get(errors, 'birthday' + '.message')}</FormHelperText>
                )}
              </FormControl>
            </LocalizationProvider>
            <InputField name="phone" label="Số điện thoại" form={form} />
          </Box>
          <Box display="flex" gap={2} mb={2}>
            <InputField name="address" label="Địa chỉ" form={form} />
          </Box>
          <FormControl fullWidth error={!!errors.roles} sx={{ mb: 2 }}>
            <Controller
              name="roles"
              control={form.control}
              render={({ field }) => (
                <Select
                  {...field}
                  multiple
                  displayEmpty
                  variant="outlined"
                  size="small"
                  renderValue={(selected) => {
                    if (!selected || selected.length === 0) {
                      return 'Chọn vai trò';
                    }
                    const selectedNames = dataRole?.data
                      .filter((role) => selected.includes(role.id))
                      .map((role) => role.name);
                    return selectedNames.join(', ');
                  }}
                >
                  <MenuItem disabled value="">
                    <em>Chọn vai trò</em>
                  </MenuItem>
                  {dataRole?.data.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.roles && <FormHelperText>{errors.roles.message}</FormHelperText>}
          </FormControl>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button form="add-user-form" type="submit" variant="contained" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddUser;
