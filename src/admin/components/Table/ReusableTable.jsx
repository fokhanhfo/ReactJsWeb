import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

ReusableTable.propTypes = {
  listHead: PropTypes.arrayOf(Object).isRequired,
  rows: PropTypes.array.isRequired,
};

function ReusableTable({ listHead, rows }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650, borderCollapse: 'collapse' }} aria-label="reusable table">
        {/* Table Head */}
        <TableHead>
          <TableRow>
            {listHead.map((head, index) => (
              <TableCell
                key={index}
                align="center"
                sx={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  width: head.width || 'auto',
                  backgroundColor: '#3e5b93',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '14px',
                }}
              >
                {head.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* Table Body */}
        <TableBody>
          {rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                sx={{
                  border: '1px solid #ddd',
                  '&:hover': {
                    backgroundColor: '#aabdcd',
                  },
                }}
              >
                {listHead.map((col, colIndex) => (
                  <TableCell key={colIndex} align="center" sx={{ border: '1px solid #ddd', padding: '8px' }}>
                    {col.render ? col.render(row) : row[col.key] || '--'}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={listHead.length} align="center" sx={{ padding: '16px', fontStyle: 'italic' }}>
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ReusableTable;
