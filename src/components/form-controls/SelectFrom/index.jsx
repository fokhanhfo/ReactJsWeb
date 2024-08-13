import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

SelectFrom.propTypes = {
    form: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    disabled: PropTypes.bool,
    options: PropTypes.array.isRequired,
    onSubmit: PropTypes.func,
    isLoading: PropTypes.bool,
    id: PropTypes.string,
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function SelectFrom(props) {
    const { id,form, name, label, disabled, options,onSubmit,isLoading } = props;
    const { formState: { errors } } = form;

    const handleChange = (event) => {
        if (onSubmit) {
          onSubmit(event.target.value);
        }
      };
    return (
        <FormControl margin='normal' className='select_form' sx={{width:'100%'}}>
            <InputLabel id="demo-multiple-name-label">{label}</InputLabel>
            <Controller 
                name={name}
                control={form.control}
                render={({field})=>(
                    <Select
                        {...field}
                        labelId={`${name}-${label}`}
                        id={name}
                        onChange={(e) => {
                            field.onChange(e);
                            handleChange(e); 
                        }}
                        input={<OutlinedInput label={label} />}
                        MenuProps={MenuProps}
                        >
                        {options.map((option) => (
                            <MenuItem
                                key={option.id}
                                value={option.id}
                            >
                            {option.name}
                            </MenuItem>
                        ))}
                    </Select>
                )}
            />
        </FormControl>
    );
}

export default SelectFrom;