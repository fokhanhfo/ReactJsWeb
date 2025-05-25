import React from 'react';
import PropTypes from 'prop-types';
import { Box, FormControl, FormHelperText, Slider, Typography } from '@mui/material';
import { Controller } from 'react-hook-form';

SliderForm.propTypes = {
  form: PropTypes.object,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  disabled: PropTypes.bool,
  width: PropTypes.string,
};

function SliderForm({ form, name, label, min, max, step, disabled, width }) {
  return (
    <FormControl sx={{ width: width || '100%' }} margin="normal">
      <Typography>{label}</Typography>
      <Controller
        name={name}
        control={form.control}
        render={({ field }) => {
          const value = Array.isArray(field.value) && field.value.length === 2 ? field.value : [min, max];
          console.log(value);

          return (
            <>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>{value[0].toLocaleString()} VND</Typography>
                <Typography>{value[1].toLocaleString()} VND</Typography>
              </Box>
              <Slider
                value={value}
                onChange={(_, newValue) => field.onChange(newValue)}
                valueLabelDisplay="auto"
                min={min}
                max={max}
                step={step}
                disabled={disabled}
              />
            </>
          );
        }}
      />
    </FormControl>
  );
}

export default SliderForm;
