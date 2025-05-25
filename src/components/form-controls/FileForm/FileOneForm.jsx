import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import {
  FormControl,
  FormHelperText,
  Button,
  Grid,
  Card,
  CardMedia,
  CardActions,
  IconButton,
  Box,
} from '@mui/material';
import { AddPhotoAlternate, Delete } from '@mui/icons-material';
import { get } from 'lodash';
import ClearIcon from '@mui/icons-material/Clear';

FileForm.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
};

function FileForm({ form, name, label, disabled }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const {
    formState: { errors },
  } = form;

  const handleFileChange = (newFile) => {
    console.log(name);
    setSelectedFile(newFile);
    form.setValue(name, newFile);
  };

  const removeFile = () => {
    form.setValue(name, null);
    setSelectedFile(null);
  };

  // useEffect(() => {
  //   const subscription = form.watch((value) => {
  //     if (value[name] instanceof File) {
  //       setSelectedFile(value[name]);
  //     }
  //   });
  //   return () => subscription.unsubscribe();
  // }, [form, name]);

  // useEffect(() => {
  //   return () => {
  //     if (selectedFile) URL.revokeObjectURL(selectedFile.preview);
  //   };
  // }, [selectedFile]);

  const message = get(errors, name + '.message');

  return (
    <FormControl margin="normal" fullWidth error={!!message}>
      <Controller
        name={name}
        control={form.control}
        render={({ field: { onChange, value, ...fieldProps } }) => (
          <>
            {!value && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  id={`file-upload-${name}`}
                  onChange={(e) => {
                    if (!e.target.files.length) return;
                    const file = e.target.files[0];
                    onChange(file);
                    handleFileChange(file);
                    e.target.value = null;
                  }}
                  disabled={disabled}
                />
                <label htmlFor={`file-upload-${name}`}>
                  <Button
                    sx={{ width: '100%' }}
                    variant="contained"
                    component="span"
                    startIcon={<AddPhotoAlternate />}
                    disabled={disabled}
                  >
                    {label || 'Upload'}
                  </Button>
                </label>
              </>
            )}
          </>
        )}
      />
      {selectedFile && (
        <Card>
          <CardMedia
            sx={{ position: 'relative' }}
            component="img"
            height="140"
            image={selectedFile ? URL.createObjectURL(selectedFile) : ''}
            alt={selectedFile ? selectedFile.name : 'No image'}
          />
          <CardActions>
            <Box
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'primary.dark',
              }}
              onClick={removeFile}
            >
              <IconButton size="small">
                <ClearIcon fontSize="small" color="error" />
              </IconButton>
            </Box>
          </CardActions>
        </Card>
      )}
      {message && <FormHelperText>{message}</FormHelperText>}
    </FormControl>
  );
}

export default FileForm;
