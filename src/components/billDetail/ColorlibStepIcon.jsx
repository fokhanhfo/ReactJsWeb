import React from 'react';
import PropTypes from 'prop-types';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import { styled, useTheme } from '@mui/material';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
  icon: PropTypes.node,
  className: PropTypes.string,
};

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: '#ccc',
  zIndex: 1,
  color: '#fff',
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',

  // Kích thước mặc định
  width: 50,
  height: 50,

  // Responsive kích thước
  [theme.breakpoints.down('md')]: {
    width: 40,
    height: 40,
  },
  [theme.breakpoints.down('sm')]: {
    width: 32,
    height: 32,
    '& svg': {
      fontSize: 16,
    },
  },

  ...(ownerState.active && {
    backgroundColor: '#ff9800',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundColor: '#4caf50',
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, icon } = props;
  const theme = useTheme();

  const icons = {
    1: <PendingActionsIcon />,
    2: <HourglassEmptyIcon />,
    3: <SettingsIcon />,
    4: <LocalShippingIcon />,
    5: <GroupAddIcon />,
    6: <CheckCircleIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} theme={theme}>
      {icons[String(icon)]}
    </ColorlibStepIconRoot>
  );
}

export default ColorlibStepIcon;
