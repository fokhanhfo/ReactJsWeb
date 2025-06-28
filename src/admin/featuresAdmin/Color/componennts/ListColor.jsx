import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';
import DataTable from 'admin/components/Table/DataTable';
import DeleteIcon from '@mui/icons-material/Delete';
import { Update } from '@mui/icons-material';
import AddColor from './AddColor';
import Fuse from 'fuse.js';

ListColor.propTypes = {
  colors: PropTypes.array.isRequired,
  actionsState: PropTypes.object.isRequired,
};

function ListColor({ colors, actionsState }) {
  const [selectedColor, setSelectedColor] = useState(null);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = React.useState('');
  const fuse = new Fuse(colors || [], {
    keys: ['name', 'key', 'id'],
    threshold: 0.4,
    ignoreLocation: true,
    includeScore: true,
    isCaseSensitive: false,
  });

  const filteredCategories = searchTerm ? fuse.search(searchTerm).map((result) => result.item) : colors || [];

  const handleActions = (state, row) => {
    if (state === 'edit' || state === 'view') {
      setSelectedColor(row);
    }
    handleAction(state, dispatch, actionsState);
  };

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5, minWidth: 50 },
    {
      field: 'name',
      headerName: 'Color',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'colorBox',
      headerName: 'Color Key',
      flex: 1,
      minWidth: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
          <Box width={30} height={30} borderRadius="50%" bgcolor={params.row.key} border={1} borderColor="black" />
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      flex: 0.8,
      minWidth: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleActions('edit', params.row)}>
            <Update color="success" />
          </IconButton>
          {/* <IconButton>
          <DeleteIcon color="error" />
        </IconButton> */}
        </>
      ),
    },
  ];

  return (
    <Box width="100%" display="flex" flexDirection="column" gap={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
        <Box display="flex" gap={1} alignItems="center">
          <TextField
            size="small"
            placeholder="Tìm kiếm màu"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Typography variant="body2">({colors.length} item)</Typography>
        </Box>
      </Box>
      <DataTable rows={filteredCategories} columns={columns} height="450px" />
      {actionsState.edit === true && <AddColor actionsState={actionsState} initialValues={selectedColor} />}
    </Box>
  );
}

export default ListColor;
