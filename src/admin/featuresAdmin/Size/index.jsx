import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useGetSizeQuery } from 'hookApi/sizeApi';
import Loading from 'components/Loading';
import AddSize from './componennts/AddSize';
import ListSize from './componennts/ListSize';

function SizeAdmin() {
  const { data, isLoading, refetch } = useGetSizeQuery();
  const [openAdd, setOpenAdd] = useState(false);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleSubmitSuccess = () => {
    refetch();
    handleCloseAdd();
  };

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap">
        <Typography variant="h6" fontWeight={600} color="primary.main">
          Quản lý kích thước
        </Typography>
        <Button variant="contained" onClick={handleOpenAdd}>
          Thêm kích thước
        </Button>
      </Box>

      {isLoading ? <Loading /> : <ListSize sizes={data?.data || []} onRefresh={refetch} />}

      {openAdd && <AddSize onClose={handleCloseAdd} onSubmitSuccess={handleSubmitSuccess} />}
    </Box>
  );
}

export default SizeAdmin;
