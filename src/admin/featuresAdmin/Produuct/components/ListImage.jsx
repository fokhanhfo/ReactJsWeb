import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, IconButton, Paper, Box, Stack, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useSnackbar } from 'notistack';
import imageApi from 'api/imageApi';
import ReusableTable from 'admin/components/Table/ReusableTable';

ListImage.propTypes = {
  listImage: PropTypes.array.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

function ListImage({ listImage, onUpdate }) {
  const [selectedFiles, setSelectedFiles] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  const handleFileChange = (e, id) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFiles((prev) => ({ ...prev, [id]: file }));
    }
  };

  const handleUpdateClick = async (id) => {
    const selectedFile = selectedFiles[id];
    if (selectedFile) {
      const data = new FormData();
      data.append('file', selectedFile);
      try {
        await imageApi.update(id, data);
        enqueueSnackbar('Cập nhật thành công!', { variant: 'success' });
        onUpdate();
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Lỗi cập nhật!', { variant: 'error' });
      }
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await imageApi.remove(id);
      enqueueSnackbar('Xóa thành công!', { variant: 'success' });
      onUpdate();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Lỗi khi xóa!', { variant: 'error' });
    }
  };

  const listHead = [
    { key: 'id', label: 'ID', width: '10%' },
    {
      key: 'image',
      label: 'Hình ảnh',
      width: '20%',
      render: (row) => (
        <img src={row.urlFile} alt="Preview" width={100} height={100} style={{ borderRadius: 8, objectFit: 'cover' }} />
      ),
    },
    {
      key: 'update',
      label: 'Cập nhật',
      width: '30%',
      render: (row) => (
        <Stack direction="column" spacing={1} alignItems="center">
          <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
            Chọn ảnh
            <input type="file" accept="image/*,video/*" hidden onChange={(e) => handleFileChange(e, row.id)} />
          </Button>
          {selectedFiles[row.id] && (
            <img
              src={URL.createObjectURL(selectedFiles[row.id])}
              alt="Preview"
              width={100}
              height={100}
              style={{ borderRadius: 8, objectFit: 'cover' }}
            />
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleUpdateClick(row.id)}
            disabled={!selectedFiles[row.id]}
          >
            Cập nhật
          </Button>
        </Stack>
      ),
    },
    {
      key: 'actions',
      label: 'Hành động',
      width: '10%',
      render: (row) => (
        <IconButton color="error" onClick={() => handleDeleteClick(row.id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>
        Danh sách hình ảnh
      </Typography>
      <Paper elevation={3}>
        <ReusableTable listHead={listHead} rows={listImage} />
      </Paper>
    </Box>
  );
}

export default ListImage;
