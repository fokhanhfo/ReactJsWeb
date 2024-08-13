import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';

FileForm.propTypes = {
    form : PropTypes.object.isRequired,
    name : PropTypes.string.isRequired,
    lable : PropTypes.string,
    disabled : PropTypes.bool,
    

};

function FileForm(props) {
    const {form,name,lable,disabled}=props;
    return (
        <Controller
            name={name}
            control={form.control}
            render={({field})=>(
                <input  
                    type='file' 
                    multiple 
                    accept='image/*' 
                    onChange={(e)=>field.onChange(e.target.files)}>
                </input>
            )}

        />
    );
}

export default FileForm;