import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { TextField } from '@mui/material';
import { get } from 'lodash';

const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(props, ref) {
  const { onChange, ...rest } = props;

  return (
    <NumericFormat
      {...rest}
      getInputRef={ref}
      onValueChange={(values) => onChange(values.floatValue ?? 0)}
      thousandSeparator=","
      decimalScale={0}
      allowNegative={false}
      inputMode="numeric" // Thêm inputMode để hỗ trợ nhập số
      inputProps={{ isNumericString: true }} // Đưa isNumericString vào inputProps thay vì trực tiếp
    />
  );
});

NumericFormatCustom.propTypes = {
  onChange: PropTypes.func.isRequired,
};

function NumericForm({ form, name, label, disabled, width, height, readOnly }) {
  const {
    formState: { errors },
  } = form;

  const message = get(errors, `${name}.message`);

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => (
        <TextField
          {...field}
          label={label}
          variant="outlined"
          fullWidth
          size="small"
          disabled={disabled}
          error={!!message}
          helperText={message}
          sx={{ width: width || '100%', height: height || 'auto' }}
          InputProps={{
            inputComponent: NumericFormatCustom,
            inputProps: { readOnly }, // Đảm bảo chỉ truyền readOnly vào đây
          }}
        />
      )}
    />
  );
}

NumericForm.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  width: PropTypes.string,
  height: PropTypes.string,
  readOnly: PropTypes.bool,
};

export default NumericForm;
