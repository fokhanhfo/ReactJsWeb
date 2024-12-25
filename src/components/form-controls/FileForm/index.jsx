import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { FormControl, FormHelperText } from '@mui/material';

FileForm.propTypes = {
    form: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    disabled: PropTypes.bool,
};

function FileForm(props) {
    const { form, name, label, disabled } = props;
    const [selectedFiles, setSelectedFiles] = useState([]); 
    const {
        formState: { errors },
    } = form;

    const handleFileChange = (files) => {
        setSelectedFiles(files);
        form.setValue(name, files);
    };

    const removeFile = (index) => {  
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        handleFileChange(newFiles);
    };

    useEffect(() => {
        const subscription = form.watch((value) => {
            if (value[name] === null || value[name].length === 0) {
                setSelectedFiles([]);
            }
        });
        return () => subscription.unsubscribe();
    }, [form, name]);

    return (
        <FormControl margin='normal' fullWidth error={!!errors[name]}>
            <Controller
                name={name}
                control={form.control}
                render={({ field }) => (
                    <input  
                        type='file' 
                        multiple 
                        accept='image/*' 
                        onChange={(e) => {
                            const files = Array.from(e.target.files);  
                            handleFileChange(files);
                            field.onChange(files);
                        }}
                        disabled={disabled}
                    />
                )}
            />
            {errors[name] && <FormHelperText>{errors[name]?.message}</FormHelperText>}
            {selectedFiles.length > 0 && (  
                <div>  
                    <h4>Selected Files:</h4>  
                    <ul>  
                        {selectedFiles.map((file, index) => (  
                            <li key={index}>  
                                {file.name}   
                                <button   
                                    onClick={() => removeFile(index)}  
                                    style={{ marginLeft: '10px', color: 'red', cursor: 'pointer' }}
                                >  
                                    X  
                                </button>  
                            </li>  
                        ))}  
                    </ul>  
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>  
                        {selectedFiles.map((file, index) => {  
                            const fileUrl = URL.createObjectURL(file);  
                            return (  
                                <img   
                                    key={index}   
                                    src={fileUrl}   
                                    alt={file.name}   
                                    style={{ width: '100px', height: '100px', margin: '5px' }}   
                                />  
                            );  
                        })}  
                    </div>  
                </div>  
            )}  
        </FormControl>
    );
}

export default FileForm;
