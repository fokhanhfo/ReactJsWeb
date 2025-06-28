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
  Paper,
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
import ConfirmDialog from 'components/ConfirmDialog/ConfirmDialog';

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [indexProductDetail, setIndexProductDetail] = useState(null);

  let schema;
  schema = yup.object().shape({
    name: yup.string().required('Tên sản phẩm là bắt buộc'),
    category: yup
      .object()
      .transform((value, originalValue) => (originalValue === '' ? null : value))
      .nullable()
      .required('Danh mục là bắt buộc'),
    detail: yup.string().required('Chi tiết sản phẩm là bắt buộc'),
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
      .required('Giá bán là bắt buộc')
      .test('is-greater', 'Giá bán phải lớn hơn giá nhập', function (value) {
        const { importPrice } = this.parent;
        return value > importPrice;
      }),
    isMainProductIdNew: add ? yup.mixed().nullable().required('Sản phẩm chính là bắt buộc') : yup.mixed().nullable(),
    productDetails: yup.array().of(
      yup.object().shape({
        index: yup.number().required(),
        color: yup
          .object()
          .transform((value, originalValue) => (originalValue === '' ? null : value))
          .nullable()
          .required('Màu sắc là bắt buộc'),
        image: add ? yup.mixed().required('Hình ảnh là bắt buộc') : yup.mixed().nullable(),
        isMainIdNew: add
          ? yup.mixed().nullable().required('Thông tin sản phẩm chính là bắt buộc')
          : yup.mixed().nullable(),
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
              .nullable()
              .min(1, 'Số lượng tối thiểu là 1')
              .required('Giá nhập là bắt buộc'),
          }),
        ),
      }),
    ),
  });

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      category: null,
      detail: '',
      importPrice: 0,
      sellingPrice: 0,
      isMainProductId: null,
      isMainProductIdNew: null,
      productDetails: [
        {
          id: null,
          index: 0,
          color: null,
          isMainId: null,
          isMainIdNew: null,
          images: [],
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

  const handleFileChange = (files, index, name) => {
    setImagePreviews((prev) => {
      const newPreviews = { ...prev };
      newPreviews[index] = Array.from(files).map((file) => file);

      form.setValue(name, newPreviews[index], { shouldDirty: true });

      const isMainColorField = `productDetails[${index}].isMainIdNew`;
      const currentMainColor = form.getValues(isMainColorField);
      if (!currentMainColor && newPreviews[index].length > 0) {
        form.setValue(isMainColorField, newPreviews[index][0].name); // Ảnh đầu tiên làm màu chính
      }

      if (add) {
        const currentMainProduct = form.getValues('isMainProductIdNew');
        if (!currentMainProduct && newPreviews[index].length > 0) {
          const mainProductValue = JSON.stringify({ index, indexFile: 0 }); // Ảnh đầu tiên
          form.setValue('isMainProductIdNew', mainProductValue);
        }
      }

      return newPreviews;
    });
  };

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
      enqueueSnackbar('Thành công', { variant: 'success' });
      handleAction(activeAction, dispatch, { add, edit, del, view });
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.data.message, { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
    console.log(values);
  };

  useEffect(() => {
    const colors = form.watch('productDetails').map((p) => p.color?.id);
    console.log('đã thay đổi màu sắc');
    setSelectedColors(colors);
  }, [JSON.stringify(form.watch('productDetails').map((p) => p.color?.id))]);
  console.log('initialValues', initialValues);

  useEffect(() => {
    if (initialValues) {
      form.reset({
        name: initialValues.name || '',
        detail: initialValues.detail || '',
        category: initialValues.category || '',
        status: initialValues.status || '',
        importPrice: initialValues.importPrice || 0,
        sellingPrice: initialValues.sellingPrice || 0,
        isMainProductId:
          initialValues?.productDetails?.flatMap((detail) => detail.image)?.find((image) => image.mainProduct)?.id ||
          '',
        productDetails:
          initialValues.productDetails?.map((item, index) => ({
            id: item.id || null,
            index: index,
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

  const handleClickRemove = async (index) => {
    if (fields.length <= 1) {
      enqueueSnackbar('Không thể xóa sản phẩm chi tiết cuối cùng', { variant: 'warning' });
      return;
    }
    setIsDialogOpen(true);
    setIndexProductDetail(index);
  };

  const handleRemove = (index) => {
    remove(index);
    setIsDialogOpen(false);
    enqueueSnackbar('Đã xóa sản phẩm chi tiết', { variant: 'success' });
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  console.log('errors', errors);

  return (
    <>
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
        <Box
          sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1100, borderBottom: '1px solid #ddd' }}
        >
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
          <DialogContent dividers sx={{ maxHeight: '70vh', overflowY: 'auto', backgroundColor: '#fff' }}>
            {/* Form thông tin cơ bản */}
            <Box display="flex" gap={2} mb={2}>
              <InputField name="name" label="Tên sản phẩm" form={form} />
              <SelectFrom
                height="40px"
                name="category"
                label="Danh mục"
                form={form}
                options={categoryQuery.data.data}
              />
            </Box>
            <Box display="flex" gap={2} mb={2}>
              <NumericForm name={`importPrice`} label="Giá nhập" form={form} type="number" />
              <NumericForm name={`sellingPrice`} label="Giá bán" form={form} type="number" />
            </Box>

            <Box mb={3}>
              <CKEditorForm name="detail" lable="Chi tiết sản phẩm" form={form} />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Header danh sách sản phẩm chi tiết */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                p: 2,
                backgroundColor: '#f9f9f9',
                borderRadius: 2,
                border: '1px solid #e0e0e0',
              }}
            >
              <Typography variant="h5" sx={{ color: '#000', m: 0 }}>
                Danh sách sản phẩm chi tiết
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
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
                  });
                  enqueueSnackbar('Thêm form sản phẩm chi tiết', { variant: 'success' });
                }}
                sx={{
                  backgroundColor: '#000',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#333',
                  },
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                Thêm sản phẩm chi tiết
              </Button>
            </Box>

            {/* Danh sách các sản phẩm chi tiết */}
            {fields.map((item, index) => (
              <Paper
                key={item.id}
                elevation={1}
                sx={{
                  p: 2,
                  mb: 3,
                  border: '1px solid #ddd',
                  borderRadius: 2,
                  backgroundColor: '#fafafa',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #e0e0e0',
                    mb: 2,
                    pb: 1,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: '#000',
                      textTransform: 'capitalize',
                      letterSpacing: 0.5,
                    }}
                  >
                    Sản phẩm {index + 1} : Màu {form.watch(`productDetails[${index}].color`)?.name || 'Chưa có màu'}
                  </Typography>
                  <IconButton onClick={() => handleClickRemove(index)} color="secondary">
                    <ClearIcon color="error" />
                  </IconButton>
                </Box>

                <Box key={item.id} sx={{ borderBottom: '1px solid #ddd' }}>
                  <Box display={'flex'} gap={1}>
                    <InputField
                      defaultValue={index}
                      hidden
                      name={`productDetails[${index}].index`}
                      label="Index"
                      form={form}
                    ></InputField>
                    {/* <NumericForm
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
                    /> */}
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
                            {errors.productDetails?.[index]?.isMainIdNew && (
                              <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                                {errors.productDetails[index].isMainIdNew.message}
                              </Typography>
                            )}
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
                                  <>
                                    {' '}
                                    {add && (
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
                                    )}
                                    {add && (
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
                                    )}
                                  </>
                                </CardActions>
                              </CardActions>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  )}
                </Box>
              </Paper>
            ))}
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
      <ConfirmDialog
        isOpen={isDialogOpen}
        title="Xác nhận"
        message="Bạn có chắc chắn muốn thực hiện hành động này không?"
        onConfirm={() => handleRemove(indexProductDetail)}
        onCancel={handleCancel}
      />
    </>
  );
}

export default AddProduct;
