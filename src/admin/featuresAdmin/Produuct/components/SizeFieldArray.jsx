import React from 'react';
import PropTypes from 'prop-types';
import { Delete } from '@mui/icons-material';
import { Box, Button, FormControl, IconButton } from '@mui/material';
import NumericForm from 'components/form-controls/NumericFormat';
import SelectFrom from 'components/form-controls/SelectFrom';
import { useFieldArray } from 'react-hook-form';

SizeFieldArray.propTypes = {
  control: PropTypes.object.isRequired,
  index: PropTypes.number,
  form: PropTypes.object.isRequired,
  listSize: PropTypes.array.isRequired,
  readOnly: PropTypes.bool,
  actionsState: PropTypes.object,
};

function SizeFieldArray({ actionsState, readOnly, control, index, form, listSize }) {
  const {
    fields: productDetailSizes,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `productDetails.${index}.productDetailSizes`,
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {productDetailSizes.map((size, sizeIndex) => (
        <Box display={'flex'} gap={1} key={size.id}>
          <SelectFrom
            height="40px"
            name={`productDetails.${index}.productDetailSizes.${sizeIndex}.size`}
            label="Size"
            form={form}
            options={listSize}
            component
            readOnly={readOnly}
          />
          <NumericForm
            name={`productDetails.${index}.productDetailSizes.${sizeIndex}.quantity`}
            label="Số lượng"
            form={form}
            type="number"
            readOnly={readOnly}
          />
          {sizeIndex > 0 && !actionsState.view ? (
            <IconButton onClick={() => remove(sizeIndex)} color="secondary">
              <Delete color="error" />
            </IconButton>
          ) : (
            <IconButton style={{ visibility: 'hidden' }}>
              <Delete />
            </IconButton>
          )}
        </Box>
      ))}
      {!actionsState.view && (
        <FormControl fullWidth margin="normal">
          <Button variant="contained" sx={{ width: '100%' }} onClick={() => append({ size: null, quantity: 0 })}>
            Thêm size
          </Button>
        </FormControl>
      )}
    </Box>
  );
}

export default SizeFieldArray;
