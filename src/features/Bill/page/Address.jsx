import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import AddressForm from '../components/AddressForm';
import {
  useAddShippingAddressMutation,
  useDeleteShippingAddressMutation,
  useGetShippingAddressesQuery,
  useUpdateShippingAddressMutation,
} from 'hookApi/shippingAddressApi';
import { useSnackbar } from 'notistack';

function Address() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useGetShippingAddressesQuery();
  const addresses = (data?.data || []).slice().sort((a, b) => {
    if (a.isDefault) return -1;
    if (b.isDefault) return 1;
    return 0;
  });
  const defaultAddress = addresses.find((addr) => addr.isDefault);
  const [addAddress] = useAddShippingAddressMutation();
  const [updateAddress] = useUpdateShippingAddressMutation();
  const [deleteAddress] = useDeleteShippingAddressMutation();
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddress?.id || null);

  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleAdd = () => {
    setEditData(null);
    setOpenDialog(true);
  };

  const handleEdit = (address) => {
    setEditData(address);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn xóa?')) {
      await deleteAddress(id);
    }
  };

  const handleSelectAddress = async (address) => {
    try {
      setSelectedAddressId(address.id);
      await updateAddress({
        id: address.id,
        isDefault: true,
      }).unwrap();
      enqueueSnackbar('Cập nhật địa chỉ mặc định thành công', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error?.data?.message || 'Lỗi khi cập nhật địa chỉ mặc định', { variant: 'error' });
      console.error('Lỗi khi cập nhật địa chỉ mặc định', error);
    }
  };

  const handleSubmit = async (values) => {
    const addressDetail = `${values.addressDetail}, ${values.commune?.name}, ${values.district?.name}, ${values.city?.name}`;

    const payload = {
      idProvince: values.city?.idProvince,
      idDistrict: values.district?.idDistrict,
      idCommune: values.commune?.idCommune,
      recipientName: values.fullname,
      phone: values.phone,
      addressDetail,
    };

    try {
      if (editData) {
        await updateAddress({ id: editData.id, ...payload }).unwrap();
        enqueueSnackbar('Cập nhật địa chỉ thành công', { variant: 'success' });
      } else {
        await addAddress(payload).unwrap();
        enqueueSnackbar('Thêm địa chỉ thành công', { variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar(error?.data.message || 'Đã có lỗi xảy ra, vui lòng thử lại', { variant: 'error' });
      console.error(error);
    }
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <Box
      sx={{
        padding: '24px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: '16px' }}>
        Địa chỉ của tôi
      </Typography>

      <Box sx={{ textAlign: 'right', marginBottom: '16px' }}>
        <Button variant="contained" color="error" onClick={handleAdd}>
          + Thêm địa chỉ mới
        </Button>
      </Box>

      {addresses.map((address) => (
        <Box key={address.id} sx={{ marginBottom: '16px' }}>
          <Typography fontWeight="bold">{address.recipientName}</Typography>
          <Typography variant="body2" color="text.secondary">
            {address.phone}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: '8px' }}>
            {address.addressDetail}
          </Typography>

          {address.isDefault && (
            <Typography variant="caption" color="success.main">
              [Địa chỉ mặc định]
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 2, marginTop: '8px' }}>
            <Button variant="text" sx={{ color: '#007bff', textTransform: 'none' }} onClick={() => handleEdit(address)}>
              Cập nhật
            </Button>
            <Button
              variant="text"
              sx={{ color: '#007bff', textTransform: 'none' }}
              onClick={() => handleDelete(address.id)}
            >
              Xóa
            </Button>
            {!address.isDefault && (
              <Button
                variant="text"
                sx={{ color: '#007bff', textTransform: 'none' }}
                onClick={() => handleSelectAddress(address)}
              >
                Chọn mặc định
              </Button>
            )}
          </Box>
          <Divider sx={{ marginTop: '16px' }} />
        </Box>
      ))}

      {/* form dialog */}
      <AddressForm
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        initialData={editData}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}

export default Address;
