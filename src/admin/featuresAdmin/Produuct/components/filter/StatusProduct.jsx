import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

StatusProduct.propTypes = {
    filter : PropTypes.object.isRequired,
    onSubmit : PropTypes.func.isRequired,
};

function StatusProduct({filter,onSubmit}) {


    const handleChangeFilter = (event) =>{
        if(onSubmit){
            onSubmit(event.target.value);
        }
    }

    return (
        <div>
            <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">Trạng Thái</FormLabel>
                <RadioGroup
                    value={filter.status}
                    onChange={handleChangeFilter}
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                >
                    <FormControlLabel value={1} control={<Radio />} label="Hoạt động" />
                    <FormControlLabel value={0} control={<Radio />} label="Ngừng Bán" />
                </RadioGroup>
            </FormControl>
        </div>
    );
}

export default StatusProduct;