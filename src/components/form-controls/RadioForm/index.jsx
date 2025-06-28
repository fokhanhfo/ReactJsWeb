import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup } from '@mui/material';

RadioForm.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,

  label: PropTypes.string,
  disabled: PropTypes.bool,
  option: PropTypes.array.isRequired,
};

function RadioForm(props) {
  const { form, name, label, disabled, option } = props;
  const {
    formState: { errors },
  } = form;
  return (
    <FormControl fullWidth size="small" error={!!errors[name]} disabled={disabled}>
      <FormLabel id="demo-row-radio-buttons-group-label">{label}</FormLabel>
      <Controller
        name={name}
        control={form.control}
        render={({ field }) => (
          <RadioGroup
            {...field}
            value={field.value || ''}
            onChange={(e) => {
              field.onChange(e.target.value);
            }}
            row
          >
            {option.map((option) => (
              <FormControlLabel
                key={option.id}
                value={option.id}
                control={<Radio disabled={disabled} />}
                label={option.name}
              />
            ))}
          </RadioGroup>
        )}
      />
      {errors[name] && <FormHelperText>{errors[name].message}</FormHelperText>}
    </FormControl>
  );
}

export default RadioForm;
