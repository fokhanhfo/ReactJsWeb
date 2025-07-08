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
  const {
    transmitId = 'id',
    form,
    name,
    label,
    disabled,
    options,
    onSubmit,
    isLoading,
    width,
    height,
    formSub,
    readOnly,
  } = props;

  const {
    formState: { errors },
  } = form;

  const message = get(errors, name + '.message');

  const handleChange = (selectedOption) => {
    if (onSubmit) {
      onSubmit(selectedOption);
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
        render={({ field }) => {
          console.log('field', field);
          return (
            <>
              <TextField
                {...field}
                value={field.value ? field.value[transmitId] : ''}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedOption = options.find((opt) => opt[transmitId] === selectedId);
                  field.onChange(selectedOption || null);
                  handleChange(selectedOption);
                }}
                variant="outlined"
                size="small"
                label={label}
                select
                disabled={disabled || readOnly || isLoading}
              >
                {options.map((option) => (
                  <MenuItem key={option[transmitId]} value={option[transmitId]}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </>
          );
        }}
      />
      <FormHelperText>{message}</FormHelperText>
    </FormControl>
  );
}

export default SelectFrom;
