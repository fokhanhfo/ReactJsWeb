'use client';

import { useState, useEffect, useContext } from 'react';
import { Box, Typography, Button, Divider, Radio } from '@mui/material';
import AddressForm from './AddressForm';

import { useSnackbar } from 'notistack';
import {
  useAddShippingAddressMutation,
  useDeleteShippingAddressMutation,
  useGetShippingAddressesQuery,
  useUpdateShippingAddressMutation,
} from 'hookApi/shippingAddressApi';
import Loading from 'components/Loading';
import { CheckoutContext } from './CheckoutProvider';

function AddressList({ expanded }) {
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useGetShippingAddressesQuery();

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addAddress] = useAddShippingAddressMutation();
  const [updateAddress] = useUpdateShippingAddressMutation();
  const [deleteAddress] = useDeleteShippingAddressMutation();
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const { shipDetail, setShipDetail } = useContext(CheckoutContext);

  const addresses = (data?.data || []).slice().sort((a, b) => {
    if (a.isDefault) return -1;
    if (b.isDefault) return 1;
    return 0;
  });

  const defaultAddress = addresses.find((addr) => addr.isDefault);

  // Set selected address to default when data loads
  useEffect(() => {
    if (defaultAddress && !selectedAddressId) {
      setSelectedAddressId(defaultAddress.id);
      setShipDetail(defaultAddress);
    }
  }, [defaultAddress, selectedAddressId]);

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
      try {
        await deleteAddress(id).unwrap();
        enqueueSnackbar('Xóa địa chỉ thành công', { variant: 'success' });
      } catch (error) {
        enqueueSnackbar('Có lỗi xảy ra khi xóa địa chỉ', { variant: 'error' });
      }
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
      setOpenDialog(false);
    } catch (error) {
      enqueueSnackbar(error?.data?.message || 'Đã có lỗi xảy ra, vui lòng thử lại', { variant: 'error' });
      console.error(error);
    }
  };

  const handleSelectAddress = async (address) => {
    try {
      setSelectedAddressId(address.id);
      await updateAddress({
        id: address.id,
        isDefault: true,
      }).unwrap();
      setShipDetail(address);
      enqueueSnackbar('Cập nhật địa chỉ mặc định thành công', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error?.data?.message || 'Lỗi khi cập nhật địa chỉ mặc định', { variant: 'error' });
      console.error('Lỗi khi cập nhật địa chỉ mặc định', error);
    }
  };
  console.log('shipDetail', shipDetail);

  if (isLoading) {
    return <Loading />;
  }

  if (addresses.length === 0) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Chưa có địa chỉ giao hàng
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          + Thêm địa chỉ mới
        </Button>
      </Box>
    );
  }

  if (!expanded) {
    const displayAddress = defaultAddress || addresses[0];
    return (
      <Box>
        <Typography fontWeight="bold">{displayAddress.recipientName}</Typography>
        <Typography variant="body2" color="text.secondary">
          {displayAddress.phone}
        </Typography>
        <Typography variant="body2">{displayAddress.addressDetail}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {addresses.map((address, index) => (
        <Box key={address.id}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Radio
              checked={selectedAddressId === address.id}
              onChange={() => handleSelectAddress(address)}
              value={address.id}
              name="selectedAddress"
              sx={{ mt: 0.5 }}
            />
            <Box sx={{ flex: 1, ml: 1 }}>
              <Typography fontWeight="bold">{address.recipientName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {address.phone}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {address.addressDetail}
              </Typography>
              {address.isDefault && (
                <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                  Địa chỉ mặc định
                </Typography>
              )}
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Button
                  variant="text"
                  size="small"
                  sx={{ color: 'primary.main', textTransform: 'none', p: 0 }}
                  onClick={() => handleEdit(address)}
                >
                  Cập nhật
                </Button>
                <Button
                  variant="text"
                  size="small"
                  sx={{ color: 'error.main', textTransform: 'none', p: 0 }}
                  onClick={() => handleDelete(address.id)}
                >
                  Xóa
                </Button>
              </Box>
            </Box>
          </Box>
          {index < addresses.length - 1 && <Divider sx={{ my: 2 }} />}
        </Box>
      ))}

      <Box sx={{ mt: 3 }}>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          + Thêm địa chỉ mới
        </Button>
      </Box>

      <AddressForm
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        initialData={editData}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}

export default AddressList;
