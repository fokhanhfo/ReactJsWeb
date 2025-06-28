import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import { Update } from '@mui/icons-material';
import AddSize from './AddSize';
import DataTable from 'admin/components/Table/DataTable';
import Fuse from 'fuse.js';

ListSize.propTypes = {
  sizes: PropTypes.array.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

function ListSize({ sizes, onRefresh }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fuse = new Fuse(sizes, {
    keys: ['name'],
    threshold: 0.3,
    ignoreLocation: true,
  });

  const filteredSizes = searchTerm ? fuse.search(searchTerm).map((i) => i.item) : sizes;

  const handleOpenDialog = (mode, size = null) => {
    setDialogMode(mode);
    setSelectedSize(size);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogMode(null);
    setSelectedSize(null);
  };

  const handleSuccessSubmit = () => {
    handleCloseDialog();
    onRefresh();
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Kích thước (mm)',
      flex: 1.2,
      minWidth: 120,
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (params.row.status === 0 ? 'Ngưng bán' : 'Đang bán'),
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      flex: 0.6,
      minWidth: 80,
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={() => handleOpenDialog('edit', params.row)}>
          <Update color="success" />
        </IconButton>
      ),
    },
  ];

  return (
    <Box width="100%" display="flex" flexDirection="column" gap={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
        <Box display="flex" gap={1} alignItems="center">
          <TextField
            size="small"
            placeholder="Tìm kiếm kích thước"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Typography variant="body2">({sizes.length} items)</Typography>
        </Box>
      </Box>
      <DataTable rows={filteredSizes} columns={columns} height="450px" />

      {openDialog && (
        <AddSize initialValues={selectedSize} onClose={handleCloseDialog} onSubmitSuccess={handleSuccessSubmit} />
      )}
    </Box>
  );
}

export default ListSize;
