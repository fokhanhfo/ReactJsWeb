import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { FormControl, FormHelperText, Button } from '@mui/material';
import { AddPhotoAlternate } from '@mui/icons-material';
import { get } from 'lodash';

FileForm.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  onFileChange: PropTypes.func,
  index: PropTypes.number,
  width: PropTypes.number,
};

function FileForm({ width, form, name, label, disabled, onFileChange, index }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const {
    formState: { errors },
  } = form;

  const handleFileChange = (newFiles) => {
    const updatedFiles = [...selectedFiles, ...newFiles];
    setSelectedFiles(updatedFiles);

    if (onFileChange) {
      onFileChange(newFiles, index, name);
    }
  };

  const message = get(errors, `${name}.message`);

  return (
    <FormControl sx={{ width: width ? width : '100%' }} error={!!message}>
      <Controller
        name={name}
        control={form.control}
        render={() => (
          <>
            <input
              type="file"
              multiple
              accept="image/*"
              hidden
              id={`file-upload-${index}`}
              onChange={(e) => {
                if (!e.target.files.length) return;
                const files = Array.from(e.target.files);
                handleFileChange(files);
                e.target.value = null;
              }}
              disabled={disabled}
            />
            <label htmlFor={`file-upload-${index}`}>
              <Button variant="contained" component="span" startIcon={<AddPhotoAlternate />} disabled={disabled}>
                {label || 'Upload'}
              </Button>
            </label>
          </>
        )}
      />
      {message && <FormHelperText>{message}</FormHelperText>}
    </FormControl>
  );
}

export default FileForm;
