import React from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Box, Container } from '@mui/material';

DataTable.propTypes = {
  rows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  pageSize: PropTypes.number,
  handleSelectionChange: PropTypes.func,
  selectedUsers: PropTypes.array,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

function DataTable({ rows, columns, pageSize = 5, handleSelectionChange, selectedUsers, height = 'auto' }) {
  return (
    <Box
      margin={2}
      sx={{
        height: height,
        overflow: 'auto',
      }}
    >
      <DataGrid
        rows={rows}
        rowHeight={80}
        columns={columns}
        sx={{
          border: 0,
          '& .MuiDataGrid-virtualScrollerRenderZone > *:last-child': {
            borderBottom: '1px solid #e0e0e0', // hoặc màu bạn muốn
          },
        }}
        getRowId={(row) => row.id}
        disableColumnMenu
        hideFooter
        {...(handleSelectionChange && {
          onRowSelectionModelChange: handleSelectionChange,
          rowSelectionModel: selectedUsers,
        })}
      />
    </Box>
  );
}

export default DataTable;
