import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  Select,
  Typography,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import InputField from 'components/form-controls/InputForm';
import CKEditorForm from 'components/form-controls/CKEditorForm';
import SelectFrom from 'components/form-controls/SelectFrom';
import Loading from 'components/Loading';
import FileForm from 'components/form-controls/FileForm';
import RadioForm from 'components/form-controls/RadioForm';
import { optionStatus } from 'utils/status';
import productApi from 'api/productApi';
// import { useAddProductMutation, useUpdateProductMutation } from '../hook/productApi';
import NumericForm from 'components/form-controls/NumericFormat';
import FileOneForm from 'components/form-controls/FileForm/FileOneForm';
import { Delete } from '@mui/icons-material';
import { get } from 'lodash';
import ClearIcon from '@mui/icons-material/Clear';
import { useDeleteimageMutation, useGetImageAllPDIdQuery, useGetImageAllProductIdQuery } from 'hookApi/imageApi';
import SizeFieldArray from './SizeFieldArray';
import { useAddProductMutation, useUpdateProductMutation } from 'hookApi/productApi';

AddProduct.propTypes = {
  actionsState: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  listColor: PropTypes.array,
  listSize: PropTypes.array,
};

function AddProduct({ actionsState, onSubmit, initialValues, listColor, listSize }) {
  console.log(initialValues);
  const categoryQuery = useSelector((state) => state.categoryApi.queries['getCategory(undefined)']);
  const { add, edit, del, view } = actionsState;
  const activeAction = Object.keys(actionsState).find((key) => actionsState[key]);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [imagePreviews, setImagePreviews] = useState({});
  const [listImage, setListImage] = useState([]);
  const [imageCheck, setImageCheck] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  const handleFileChange = (files, index, name) => {
    setImagePreviews((prev) => {
      const newPreviews = { ...prev };
      newPreviews[index] = Array.from(files).map((file) => file);

      form.setValue(name, newPreviews[index]);
      return newPreviews;
    });
  };

  let schema;
  schema = yup.object().shape({
    name: yup.string().required('Tên sản phẩm là bắt buộc'),
    category: yup
      .object()
      .transform((value, originalValue) => (originalValue === '' ? null : value))
      .nullable()
      .required('Danh mục là bắt buộc'),
    detail: yup.string().required('Chi tiết sản phẩm là bắt buộc'),
    productDetails: yup.array().of(
      yup.object().shape({
        index: yup.number().required(),
        importPrice: yup
          .number()
          .transform((value, originalValue) => {
            if (typeof originalValue === 'string') {
              return parseFloat(originalValue.replace(/,/g, '')) || 0;
            }
            return value;
          })
          .nullable()
          .min(1, 'Số lượng tối thiểu là 1')
          .required('Giá nhập là bắt buộc'),
        sellingPrice: yup
          .number()
          .transform((value, originalValue) => {
            if (typeof originalValue === 'string') {
              return parseFloat(originalValue.replace(/,/g, '')) || 0;
            }
            return value;
          })
          .nullable()
          .min(1, 'Số lượng tối thiểu là 1')
          .required('Giá bán là bắt buộc'),
        // quantity: yup
        //   .number()
        //   .transform((value, originalValue) => {
        //     if (typeof originalValue === 'string') {
        //       return parseFloat(originalValue.replace(/,/g, '')) || 0;
        //     }
        //     return value;
        //   })
        //   .nullable()
        //   .min(1, 'Số lượng tối thiểu là 1')
        //   .required('Số lượng là bắt buộc'),
        color: yup
          .object()
          .transform((value, originalValue) => (originalValue === '' ? null : value))
          .nullable()
          .required('Màu sắc là bắt buộc'),
        // size: yup
        //   .object()
        //   .transform((value, originalValue) => (originalValue === '' ? null : value))
        //   .nullable()
        //   .required('Kích thước là bắt buộc'),
        image: add ? yup.mixed().required('Hình ảnh là bắt buộc') : yup.mixed().nullable(),
        productDetailSizes: yup.array().of(
          yup.object().shape({
            size: yup
              .object()
              .transform((value, originalValue) => (originalValue === '' ? null : value))
              .nullable()
              .required('Kích thước là bắt buộc'),
            quantity: yup
              .number()
              .transform((value, originalValue) => {
                if (typeof originalValue === 'string') {
                  return parseFloat(originalValue.replace(/,/g, '')) || 0;
                }
                return value;
              })
              .min(0, 'Số lượng tối thiểu là 0')
              .required('Số lượng là bắt buộc'),
          }),
        ),
      }),
    ),
  });

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      category: '',
      detail: '',
      isMainProductId: null,
      isMainProductIdNew: null,
      productDetails: [
        {
          id: null,
          index: 0,
          importPrice: 0,
          sellingPrice: 0,
          color: null,
          isMainId: null,
          isMainIdNew: null,
          productDetailSizes: [
            {
              id: null,
              size: null,
              quantity: 0,
            },
          ],
          image: null,
        },
      ],
    },
  });

  const {
    control,
    formState: { errors, isDirty },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'productDetails',
  });

  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteImage] = useDeleteimageMutation();
  // const {
  //   data: imageProductDetail,
  //   isLoading: isLoadingDetail,
  //   refetch,
  // } = useGetImageAllProductIdQuery(initialValues?.id, {
  //   skip: !initialValues?.id,
  // });

  console.log(isDirty);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      // if (activeAction === 'edit') {
      //   const payload = { ...values, category: values.category };
      //   await updateProduct(payload);
      // } else {
      let updatedValues = { ...values, id: initialValues?.id };

      if (updatedValues.productDetails && updatedValues.productDetails.length > 0) {
        updatedValues = {
          ...updatedValues,
          productDetails: updatedValues.productDetails.map((item, index) => ({
            ...item,
            id: initialValues?.productDetails?.[index]?.id || item.id,
          })),
        };
      }

      const formData = new FormData();

      formData.append('product', new Blob([JSON.stringify(updatedValues)], { type: 'application/json' }));
      updatedValues.productDetails.forEach((detail) => {
        if (detail.image) {
          for (let i = 0; i < detail.image.length; i++) {
            formData.append(`productDetails.${detail.index}`, detail.image[i]);
          }
        }
      });

      if (activeAction === 'add') {
        await addProduct(formData).unwrap();
      } else {
        await updateProduct(formData).unwrap();
      }
      // refetch();
      enqueueSnackbar('success', { variant: 'success' });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('error' + err, { variant: 'error' });
    } finally {
      setIsSubmitting(false);
      form.reset();
      handleAction(activeAction, dispatch, { add, edit, del, view });
    }
    console.log(values);
  };

  useEffect(() => {
    const colors = form.watch('productDetails').map((p) => p.color?.id);
    console.log('đã thay đổi màu sắc');
    setSelectedColors(colors);
  }, [JSON.stringify(form.watch('productDetails').map((p) => p.color?.id))]);

  useEffect(() => {
    if (initialValues) {
      form.reset({
        name: initialValues.name || '',
        detail: initialValues.detail || '',
        category: initialValues.category || '',
        status: initialValues.status || '',
        isMainProductId:
          initialValues?.productDetails?.flatMap((detail) => detail.image)?.find((image) => image.mainProduct)?.id ||
          '',
        productDetails:
          initialValues.productDetails?.map((item, index) => ({
            id: item.id || null,
            index: index,
            importPrice: item.importPrice || 0,
            sellingPrice: item.sellingPrice || 0,
            color: item.color || null,
            image: item.image || null,
            isMainId: item.image.find((image) => image.mainColor === true)?.id || null,
            isMainIdNew: null,
            isMainProductId: null,
            productDetailSizes:
              item.productDetailSizes?.map((sizeItem) => ({
                id: sizeItem.id || null,
                size: sizeItem.size || null,
                quantity: sizeItem.quantity || 0,
              })) || [],
          })) || [],
      });
    }
  }, [initialValues, form]);

  // if (isLoadingDetail) {
  //   return <Loading></Loading>;
  // }

  const removeFileImageOld = async (id) => {
    try {
      await deleteImage(id).unwrap();
      console.log(`Deleted image with id: ${id}`);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const removeFile = (productIndex, fileIndex, name) => {
    setImagePreviews((prev) => {
      const newPreviews = { ...prev };

      if (newPreviews[productIndex]) {
        newPreviews[productIndex] = newPreviews[productIndex].filter((_, i) => i !== fileIndex);

        if (newPreviews[productIndex].length === 0) {
          delete newPreviews[productIndex];
        }
      }

      form.setValue(name, { ...newPreviews });

      return { ...newPreviews };
    });
  };

  const removeAllFiles = (productIndex, name) => {
    setImagePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[productIndex];
      form.setValue(name, { ...newPreviews });
      return { ...newPreviews };
    });
  };

  const message = (index) => {
    console.log(get(form.errors, `productDetails[${index}].color` + '.message'));
    return get(form.errors, `productDetails[${index}].color` + '.message');
  };

  return (
    <Dialog
      aria-labelledby="customized-dialog-title"
      open={add || edit}
      maxWidth="lg"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          width: '1200px',
          maxWidth: 'none',
        },
      }}
    >
      <Box sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1100, borderBottom: '1px solid #ddd' }}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {add ? 'Thêm sản phẩm' : 'Chỉnh sửa sản phẩm'}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => handleAction(activeAction, dispatch, { add, edit, del, view })}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <DialogContent dividers sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Box display={'flex'} gap={2}>
            <InputField name="name" label="Tên sản phẩm" form={form}></InputField>
            <SelectFrom height="40px" name="category" label="Danh mục" form={form} options={categoryQuery.data.data} />
          </Box>
          <CKEditorForm name="detail" lable="Chi tiết sản phẩm" form={form} />
          {/* <InputField name="price" label="Giá tiền" form={form} />
          <InputField name="quantity" label="Số lượng sản phẩm" form={form} /> */}
          {/* {!(activeAction === 'edit') && <FileForm name="file" form={form} />}
          {activeAction === 'edit' && (
            <RadioForm name="status" label="Trạng thái" form={form} option={optionStatus} />
          )}{' '} */}
          <Divider sx={{ marginY: 2 }} />
          <h4>Danh sách sản phẩm chi tiết</h4>
          {fields.map((item, index) => (
            <>
              <Divider sx={{ marginY: 2, width: '50%' }} />
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 1.5,
                  fontWeight: 600,
                  color: 'primary.dark',
                  textTransform: 'capitalize',
                  letterSpacing: 0.5,
                }}
              >
                Sản phẩm {index} : Màu {form.watch(`productDetails[${index}].color`)?.name || 'Chưa có màu'}
              </Typography>

              <Box key={item.id} sx={{ borderBottom: '1px solid #ddd' }}>
                <Box display={'flex'} gap={1}>
                  <InputField
                    defaultValue={index}
                    hidden
                    name={`productDetails[${index}].index`}
                    label="Index"
                    form={form}
                  ></InputField>
                  <NumericForm
                    name={`productDetails[${index}].importPrice`}
                    label="Giá nhập"
                    form={form}
                    type="number"
                  />
                  <NumericForm
                    name={`productDetails[${index}].sellingPrice`}
                    label="Giá bán"
                    form={form}
                    type="number"
                  />
                  <FormControl
                    className="select_form"
                    fullWidth
                    error={!!get(errors, `productDetails[${index}].color` + '.message')}
                  >
                    <InputLabel id={`${`productDetails[${index}].color`}-label`} sx={{ top: '-6px' }}>
                      Màu sắc
                    </InputLabel>
                    <Controller
                      name={`productDetails[${index}].color`}
                      control={form.control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          labelId={`productDetails[${index}].color-label`}
                          id={`productDetails[${index}].color`}
                          value={field.value ? JSON.stringify(field.value) : ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            const selectedOption = value ? JSON.parse(value) : null;
                            field.onChange(selectedOption);
                          }}
                          input={<OutlinedInput label={'Màu sắc'} />}
                          sx={{ height: '40px', display: 'flex', alignItems: 'center' }}
                        >
                          <MenuItem value="">
                            <em>Bỏ chọn</em>
                          </MenuItem>
                          {listColor.map((c) => (
                            <MenuItem
                              key={c.id}
                              value={JSON.stringify(c)}
                              disabled={selectedColors.includes(c.id) && c.id !== field.value?.id}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div
                                  style={{
                                    width: 20,
                                    height: 20,
                                    backgroundColor: c.key,
                                    borderRadius: '50%',
                                    border: '1px solid #ccc',
                                  }}
                                />
                                {c.name}
                              </div>
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />

                    {get(errors, `productDetails[${index}].color` + '.message') && (
                      <FormHelperText>{get(errors, `productDetails[${index}].color` + '.message')}</FormHelperText>
                    )}
                  </FormControl>
                  <Box width={'150%'}>
                    <SizeFieldArray
                      actionsState={actionsState}
                      control={control}
                      index={index}
                      form={form}
                      listSize={listSize}
                    />
                  </Box>
                  {/* <NumericForm name={`productDetails[${index}].quantity`} label="Số lượng" form={form} type="number" />
                <SelectFrom
                  height="40px"
                  name={`productDetails[${index}].size`}
                  label="Kích thước"
                  form={form}
                  options={listSize}
                  component
                /> */}
                  {/* <FileOneForm name={`productDetails[${index}].image`} label="Upload" form={form} /> */}
                  <FileForm
                    width={'70%'}
                    name={`productDetails[${index}].image`}
                    label="Upload"
                    form={form}
                    index={index}
                    onFileChange={handleFileChange}
                  />

                  <IconButton onClick={() => remove(index)} color="secondary">
                    <Delete color="error" />
                  </IconButton>
                </Box>
                {edit === true && (
                  <Grid marginBottom={2} container spacing={2} mt={2}>
                    {initialValues?.productDetails[index]?.image &&
                      initialValues?.productDetails[index]?.image.map((item, urlIndex) => (
                        <Grid item xs={6} sm={4} md={2} key={urlIndex}>
                          <Card sx={{ position: 'relative' }}>
                            <CardMedia
                              component="img"
                              height="140"
                              sx={{ objectFit: 'contain', width: '100%', height: '140px' }}
                              image={item.imageUrl}
                              alt={initialValues?.productDetails[index]?.product?.name || 'Product Image'}
                            />
                            <IconButton
                              size="small"
                              onClick={() => removeFileImageOld(item.id)}
                              sx={{
                                position: 'absolute',
                                top: 5,
                                right: 5,
                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 0, 0, 0.8)',
                                },
                              }}
                            >
                              <ClearIcon fontSize="small" />
                            </IconButton>
                            <CardActions>
                              {edit && (
                                <>
                                  {' '}
                                  <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label">Màu</FormLabel>
                                    <Controller
                                      name={`productDetails[${index}].isMainId`}
                                      control={control}
                                      defaultValue=""
                                      render={({ field }) => (
                                        <Radio
                                          {...field}
                                          checked={field.value === item.id} // Kiểm tra xem có phải ảnh chính không
                                          onChange={() => field.onChange(item.id)} // Cập nhật giá trị khi chọn
                                          value={item.id}
                                          color="primary"
                                        />
                                      )}
                                    />
                                  </FormControl>
                                  <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label">Sản phẩm</FormLabel>
                                    <Controller
                                      name={`isMainProductId`}
                                      control={control}
                                      defaultValue=""
                                      render={({ field }) => (
                                        <Radio
                                          {...field}
                                          checked={field.value === item.id}
                                          onChange={() => field.onChange(item.id)}
                                          value={item.id}
                                          color="primary"
                                        />
                                      )}
                                    />
                                  </FormControl>
                                </>
                              )}
                            </CardActions>
                          </Card>
                        </Grid>
                      ))}
                  </Grid>
                )}
                {imagePreviews[index] && (
                  <Grid marginBottom={2} container spacing={2} mt={2}>
                    {imagePreviews[index].map((file, fileIdx) => {
                      return (
                        <Grid item xs={6} sm={4} md={2} key={fileIdx}>
                          <Card sx={{ position: 'relative' }}>
                            <CardMedia
                              image={file.preview || URL.createObjectURL(file)}
                              alt={file.name}
                              component="img"
                              height="140"
                              sx={{ objectFit: 'contain', width: '100%', height: '140px' }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => removeFile(index, fileIdx, `productDetails[${index}].image`)}
                              sx={{
                                position: 'absolute',
                                top: 5,
                                right: 5,
                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 0, 0, 0.8)',
                                },
                              }}
                            >
                              <ClearIcon fontSize="small" />
                            </IconButton>
                            <CardActions>
                              <CardActions>
                                {add && (
                                  <>
                                    {' '}
                                    <FormControl>
                                      <FormLabel id="demo-row-radio-buttons-group-label">Màu</FormLabel>
                                      <Controller
                                        name={`productDetails[${index}].isMainIdNew`}
                                        control={control}
                                        defaultValue=""
                                        render={({ field }) => (
                                          <Radio
                                            {...field}
                                            checked={field.value === file.name}
                                            onChange={() => {
                                              field.onChange(file.name);
                                            }} // Cập nhật giá trị khi chọn
                                            value={field.name}
                                            color="primary"
                                          />
                                        )}
                                      />
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel id="demo-row-radio-buttons-group-label">Sản phẩm</FormLabel>
                                      <Controller
                                        name="isMainProductIdNew"
                                        control={control}
                                        defaultValue=""
                                        render={({ field }) => {
                                          const selectedValue = JSON.stringify({ index, indexFile: fileIdx });
                                          return (
                                            <Radio
                                              {...field}
                                              checked={field.value === selectedValue}
                                              onChange={() => field.onChange(selectedValue)}
                                              value={selectedValue}
                                              color="primary"
                                            />
                                          );
                                        }}
                                      />
                                    </FormControl>
                                  </>
                                )}
                              </CardActions>
                            </CardActions>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </Box>
            </>
          ))}
          <Button
            onClick={() =>
              append({
                importPrice: '',
                sellingPrice: '',
                quantity: '',
                color: '',
                size: '',
                image: null,
                productDetailSizes: [
                  {
                    id: null,
                    size: null,
                    quantity: 0,
                  },
                ],
              })
            }
          >
            Thêm
          </Button>
        </DialogContent>
        <DialogActions
          sx={{ position: 'sticky', bottom: 0, backgroundColor: 'white', zIndex: 1100, borderTop: '1px solid #ddd' }}
        >
          <Button variant="contained" type="submit" autoFocus disabled={!isDirty || isSubmitting}>
            {add ? 'Thêm' : 'Cập nhật'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AddProduct;
