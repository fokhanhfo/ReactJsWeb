import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { FormControl, FormHelperText, OutlinedInput, InputAdornment, IconButton, InputLabel } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

PasswordField.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,

  label: PropTypes.string,
  disabled: PropTypes.bool,
  width: PropTypes.string,
  height: PropTypes.string,
  size: PropTypes.string,
  readOnly: PropTypes.bool,
  defaultValue: PropTypes.any,
  hidden: PropTypes.bool,
};

function PasswordField(props) {
  const { form, name, label, disabled, width, height, size = 'small', readOnly, defaultValue, hidden } = props;

  const {
    formState: { errors },
    setValue,
  } = form;

  const message = errors[name]?.message;

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (defaultValue !== undefined) {
      setValue(name, defaultValue);
    }
  }, [defaultValue, name, setValue]);

  return (
    <FormControl
      fullWidth
      variant="outlined"
      error={Boolean(message)}
      sx={{
        width: width || '100%',
        height: height || 'auto',
        display: hidden && 'none',
      }}
      size={size}
    >
      <InputLabel htmlFor={`outlined-adornment-password-${name}`}>{label}</InputLabel>
      <Controller
        name={name}
        control={form.control}
        render={({ field }) => (
          <OutlinedInput
            {...field}
            id={`outlined-adornment-password-${name}`}
            type={showPassword ? 'text' : 'password'}
            label={label}
            disabled={disabled}
            readOnly={readOnly}
            size={size}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  tabIndex={-1}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        )}
      />
      <FormHelperText>{message}</FormHelperText>
    </FormControl>
  );
}

export default PasswordField;
