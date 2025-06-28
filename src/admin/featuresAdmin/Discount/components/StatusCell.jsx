// StatusCell.jsx
import React from 'react';
import { Box, Chip, Button } from '@mui/material';

const StatusCell = ({ value, row, onToggle }) => {
  const [hover, setHover] = React.useState(false);
  const isActive = value === 1;

  const handleToggleStatus = () => {
    onToggle?.(row); // gọi callback nếu có
  };

  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
    >
      {!hover ? (
        <Chip
          label={isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
          color={isActive ? 'success' : 'default'}
          size="small"
        />
      ) : (
        <Button size="small" variant="outlined" color={isActive ? 'error' : 'success'} onClick={handleToggleStatus}>
          {isActive ? 'Ngừng' : 'Kích hoạt'}
        </Button>
      )}
    </Box>
  );
};

export default StatusCell;
