import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormHelperText, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import { get } from 'lodash';

InputField.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  width: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  height: PropTypes.string,
  size: PropTypes.string,
  readOnly: PropTypes.bool,
  defaultValue: PropTypes.any,
  hidden: PropTypes.bool,
};

function InputField(props) {
  const { defaultValue, hidden, form, name, label, disabled, width, height, size, readOnly } = props;
  const {
    formState: { errors },
    setValue,
  } = form;

  const message = get(errors, name + '.message');

  useEffect(() => {
    if (defaultValue !== undefined) {
      setValue(name, defaultValue);
    }
  }, [defaultValue, name, setValue]);

  return (
    <FormControl
      fullWidth
      error={Boolean(message)}
      sx={{
        width: width || '100%',
        height: height || 'auto',
        display: hidden && 'none',
      }}
    >
      <Controller
        name={name}
        control={form.control}
        render={({ field }) => (
          <TextField
            {...field}
            size="small"
            variant="outlined"
            label={label}
            disabled={disabled}
            InputProps={{ inputProps: { readOnly: readOnly } }}
          />
        )}
      />
      <FormHelperText>{message}</FormHelperText>
    </FormControl>
  );
}

export default InputField;
