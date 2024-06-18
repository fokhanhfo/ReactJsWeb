import React from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { FormHelperText } from '@mui/material';

PasswordField.propTypes = {
    form: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,

    label : PropTypes.string,
    disabled : PropTypes.bool,
};

function PasswordField(props) {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const {form,name,label,disabled} = props;
    // const {errors,formState} = form;
    // console.log(errors,formState);
    const {
        formState:{errors},
    }=form;
    

    return (
        // <Controller
        //     name={name}
        //     control={form.control}
        //     render={({field}) => (
        //         <TextField
        //             {...field}
        //             margin='normal'
        //             variant='outlined'
        //             fullWidth
        //             label={label}
        //             disabled={disabled}
        //             error={!!errors[name]}
        //             helperText={errors[name]?.message}
        //         />
        //     )}
        // />
        <FormControl fullWidth margin='normal' variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <Controller
            name={name}
            control={form.control}
            render={({field}) => (
                <OutlinedInput
                    {...field}
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    variant='outlined'
                    endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                    }
                    label="Password"
                    disabled={disabled}
                    error={!!errors[name]}
                />
            )}
          />
          {errors[name] && <FormHelperText>{errors[name]?.message}</FormHelperText>}
        </FormControl>
    );
}

export default PasswordField;