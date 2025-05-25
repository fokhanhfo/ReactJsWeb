import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ListImage from '../components/ListImage';
import imageApi from 'api/imageApi';
import { useParams } from 'react-router-dom';
import Loading from 'components/Loading';
import { useSnackbar } from 'notistack';
import { Button, Box, Typography, Stack } from '@mui/material';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FileForm from 'components/form-controls/FileForm';

EditImage.propTypes = {};

function EditImage(props) {
  const [isLoading, setIsLoading] = useState(false);
  const { productId } = useParams();
  const [images, setImages] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = yup
    .object({
      file: yup.mixed().required('Bắt buộc'),
    })
    .required();

  const form = useForm({
    defaultValues: {
      file: null,
    },
    resolver: yupResolver(schema),
  });

  const handleCreateClick = async (values) => {
    setIsSubmitting(true);
    if (values.file.length > 0) {
      const data = new FormData();
      for (let i = 0; i < values.file.length; i++) {
        data.append('file', values.file[i]);
      }
      try {
        await imageApi.add(productId, data);
        enqueueSnackbar('Ảnh đã được thêm thành công!', { variant: 'success' });
        fetchImages();
      } catch (e) {
        console.error(e);
        enqueueSnackbar('Có lỗi xảy ra khi thêm ảnh!', { variant: 'error' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const response = await imageApi.getImageProduct(productId);
      setImages(response.data);
    } catch (e) {
      console.error('Lỗi khi fetch image:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Danh sách ảnh
      </Typography>
      {!isLoading ? (
        <>
          <ListImage listImage={images} onUpdate={fetchImages} />

          <form onSubmit={form.handleSubmit(handleCreateClick)}>
            {<FileForm name="file" form={form} />}
            <Button type="submit" autoFocus disabled={isSubmitting}>
              Thêm ảnh
            </Button>
          </form>
        </>
      ) : (
        <Loading />
      )}
    </Box>
  );
}

export default EditImage;
