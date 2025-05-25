import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormHelperText, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import { get } from 'lodash';

SelectFrom.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  options: PropTypes.array.isRequired,
  onSubmit: PropTypes.func,
  isLoading: PropTypes.bool,
  transmitId: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  formSub: PropTypes.bool,
  readOnly: PropTypes.bool,
};

function SelectFrom(props) {
  const { transmitId, form, name, label, disabled, options, onSubmit, isLoading, width, height, formSub, readOnly } =
    props;

  const {
    formState: { errors },
  } = form;

  const message = get(errors, name + '.message');

  const handleChange = (event) => {
    const value = event.target.value;
    const selectedValue = value ? JSON.parse(value) : null;
    if (onSubmit) {
      onSubmit(selectedValue);
    }
  };

  return (
    <FormControl
      error={Boolean(message)}
      sx={{
        width: width || '100%',
        height: height || 'auto',
      }}
    >
      <Controller
        name={name}
        control={form.control}
        render={({ field }) => (
          <>
            <TextField
              {...field}
              value={field.value ? JSON.stringify(field.value) : ''}
              onChange={(e) => {
                const value = e.target.value;
                const selectedOption = value ? JSON.parse(value) : null;
                field.onChange(selectedOption);
                handleChange(e);
              }}
              variant="outlined"
              size="small"
              label={label}
              select
              disabled={disabled || readOnly}
            >
              {options.map((option, index) => (
                <MenuItem key={index} value={JSON.stringify(option)}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </>
        )}
      />
      <FormHelperText>{message}</FormHelperText>
    </FormControl>
  );
}

export default SelectFrom;
