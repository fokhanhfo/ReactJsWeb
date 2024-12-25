import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';

RadioForm.propTypes = {
    form: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,

    label : PropTypes.string,
    disabled : PropTypes.bool,
    option : PropTypes.array.isRequired,
};

function RadioForm(props) {
    const {form,name,label,disabled,option} = props;
    const {
        formState:{errors},
    }=form;
    return (
        <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">{label}</FormLabel>
            <Controller
                name={name}
                control={form.control}
                render={({field})=>(
                    <RadioGroup
                        {...field}
                        value={field.value}
                        onChange={(e) => {
                            field.onChange(e);
                        }}
                        row
                    >
                        {option.map(option =>(
                            <FormControlLabel key={option.id} value={option.id} control={<Radio disabled={disabled}/>} label={option.name} />
                        ))}
                    </RadioGroup>
                )}
            />
            {errors[name] && <p>{errors[name].message}</p>}
        </FormControl>
    );
}

export default RadioForm;