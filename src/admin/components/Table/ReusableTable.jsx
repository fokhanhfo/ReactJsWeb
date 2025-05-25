import PropTypes from 'prop-types';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  useTheme,
} from '@mui/material';

ReusableTable.propTypes = {
  listHead: PropTypes.arrayOf(Object).isRequired,
  rows: PropTypes.array.isRequired,
  title: PropTypes.string,
};

function ReusableTable({ listHead, rows, title }) {
  const theme = useTheme();

  return (
    <Box>
      {title && (
        <Box
          sx={{
            padding: '16px 20px',
            borderBottom: '1px solid #e0e0e0',
            backgroundColor: '#f9fafb',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
      )}

      <TableContainer>
        <Table
          stickyHeader
          sx={{
            borderCollapse: 'separate',
            borderSpacing: 0,
          }}
          aria-label="reusable table"
        >
          {/* Table Head */}
          <TableHead>
            <TableRow>
              {listHead.map((head, index) => (
                <TableCell
                  key={index}
                  align="center"
                  sx={{
                    padding: '12px 16px',
                    width: head.width || 'auto',
                    backgroundColor: '#3e5b93',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '14px',
                    borderBottom: 'none',
                    position: 'relative',
                    '&:not(:last-child)::after': {
                      content: '""',
                      position: 'absolute',
                      right: 0,
                      top: '25%',
                      height: '50%',
                      width: '1px',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
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
                    transition: 'background-color 0.2s ease',
                    '&:nth-of-type(even)': {
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(170, 189, 205, 0.3)',
                    },
                    '&:last-child td': {
                      borderBottom: 0,
                    },
                  }}
                >
                  {listHead.map((col, colIndex) => (
                    <TableCell
                      key={colIndex}
                      align="center"
                      sx={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #e0e0e0',
                        fontSize: '14px',
                        color: '#333',
                      }}
                    >
                      {col.render ? col.render(row) : row[col.key] || '--'}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={listHead.length}
                  align="center"
                  sx={{
                    padding: '24px 16px',
                    fontStyle: 'italic',
                    color: 'text.secondary',
                    fontSize: '14px',
                  }}
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ReusableTable;
