import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { alpha, Box, CircularProgress, Divider, IconButton, Typography, useTheme } from '@mui/material';

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  dialogType: PropTypes.string.isRequired,
};

function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, isLoading, dialogType }) {
  console.log(dialogType);
  const theme = useTheme();
  const getIconAndColor = () => {
    switch (dialogType) {
      case 'error':
        return { icon: <ErrorIcon />, color: theme.palette.error.main };
      case 'success':
        return { icon: <CheckCircleIcon />, color: theme.palette.success.main };
      case 'warning':
        return { icon: <WarningIcon />, color: theme.palette.warning.main };
      default:
        return { icon: <InfoIcon />, color: theme.palette.info.main };
    }
  };

  const { icon, color } = getIconAndColor();
  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: theme.shadows[10],
          overflow: 'visible',
        },
      }}
    >
      {/* Header với icon đóng */}
      <Box sx={{ position: 'relative', pt: 2 }}>
        <IconButton
          onClick={onCancel}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
            '&:hover': {
              backgroundColor: alpha(theme.palette.grey[500], 0.1),
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Icon chính */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: alpha(color, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
              fontSize: 32,
            }}
          >
            {icon}
          </Box>
        </Box>

        {/* Title */}
        <DialogTitle
          sx={{
            textAlign: 'center',
            pb: 1,
            pt: 0,
            px: 3,
          }}
        >
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            {title}
          </Typography>
        </DialogTitle>
      </Box>

      <Divider sx={{ mx: 3, mb: 2 }} />

      {/* Content */}
      <DialogContent sx={{ px: 3, py: 0 }}>
        <DialogContentText
          sx={{
            textAlign: 'center',
            fontSize: '1rem',
            lineHeight: 1.6,
            color: theme.palette.text.secondary,
            mb: 2,
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          pt: 2,
          gap: 1,
          justifyContent: 'center',
        }}
      >
        <Button
          onClick={onCancel}
          variant="outlined"
          size="large"
          disabled={isLoading}
          sx={{
            minWidth: 120,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            borderColor: theme.palette.grey[300],
            color: theme.palette.text.secondary,
            '&:hover': {
              borderColor: theme.palette.grey[400],
              backgroundColor: alpha(theme.palette.grey[500], 0.05),
            },
          }}
        >
          Hủy
        </Button>

        <Button
          onClick={onConfirm}
          variant="contained"
          size="large"
          disabled={isLoading}
          sx={{
            minWidth: 120,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            backgroundColor: color,
            boxShadow: `0 4px 12px ${alpha(color, 0.3)}`,
            '&:hover': {
              backgroundColor: color,
              filter: 'brightness(0.9)',
              boxShadow: `0 6px 16px ${alpha(color, 0.4)}`,
            },
            '&:disabled': {
              backgroundColor: alpha(color, 0.6),
            },
          }}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} color="inherit" />
              <span>Đang xử lý...</span>
            </Box>
          ) : (
            <span>Đồng ý</span>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
