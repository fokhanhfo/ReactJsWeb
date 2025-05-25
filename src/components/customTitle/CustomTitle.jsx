import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

CustomTitle.propTypes = {
  label: PropTypes.string.isRequired,
  size: PropTypes.string,
};

function CustomTitle({ label, size }) {
  return (
    <Typography variant={size ? size : null} className="customTitle" marginTop={'10px'}>
      {label}
    </Typography>
  );
}

export default CustomTitle;
