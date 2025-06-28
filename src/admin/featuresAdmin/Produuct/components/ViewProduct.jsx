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
import NumericForm from 'components/form-controls/NumericFormat';
import SizeFieldArray from './SizeFieldArray';

ViewProduct.propTypes = {
  actionsState: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
};

function ViewProduct({ actionsState, onSubmit, initialValues }) {
  const categoryQuery = useSelector((state) => state.categoryApi.queries['getCategory(undefined)']);
  const listColor = useSelector((state) => state.colorApi.queries['getColor(undefined)'].data.data);
  const listSize = useSelector((state) => state.sizeApi.queries['getSize(undefined)'].data.data);
  const { add, edit, del, view } = actionsState;
  const activeAction = Object.keys(actionsState).find((key) => actionsState[key]);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  // let schema;
  // if (activeAction === 'edit') {
  //   schema = yup
  //     .object({
  //       name: yup.string().required('Băt buộc'),
  //       detail: yup.string().required('Bắt buộc'),
  //       price: yup.number().required('Bắt buộc'),
  //       quantity: yup.number().required('Bắt buộc'),
  //       category: yup.string().required('Bắt buộc'),
  //       status: yup.number().required('Bắt buộc'),
  //     })
  //     .required();
  // } else {
  //   schema = yup
  //     .object({
  //       name: yup.string().required('Băt buộc'),
  //       detail: yup.string().required('Bắt buộc'),
  //       price: yup.number().required('Bắt buộc'),
  //       quantity: yup.number().required('Bắt buộc'),
  //       category: yup.object().required('Bắt buộc'),
  //       file: yup.mixed().required('Bắt buộc'),
  //     })
  //     .required();
  // }

  const form = useForm({
    defaultValues: {
      name: '',
      detail: '',
      category: '',
      importPrice: 0,
      sellingPrice: 0,
      status: '',
      isMainProductId: '',
      productDetails: [
        {
          id: null,
          index: 0,
          color: null,
          isMainId: null,
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

  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'productDetails',
  });

  // const handleSubmit = (value) => {
  //   if (handleClose) {
  //     handleClose();
  //   }
  //   form.reset();
  // };

  // const handleSubmit = async (values) => {
  //   setIsSubmitting(true);
  //   try {
  //     if (activeAction === 'edit') {
  //       onSubmit(values);
  //     } else {
  //       const formData = new FormData();
  //       console.log(values.category);
  //       formData.append('name', values.name);
  //       formData.append('detail', values.detail);
  //       formData.append('price', values.price);
  //       formData.append('quantity', values.quantity);
  //       formData.append('category', JSON.stringify(values.category));
  //       if (values.file && values.file.length > 0) {
  //         for (let i = 0; i < values.file.length; i++) {
  //           formData.append('images', values.file[i]);
  //         }
  //       }
  //       await addProduct(formData).unwrap();
  //     }
  //     enqueueSnackbar('success', { variant: 'success' });
  //   } catch (err) {
  //     console.error(err);
  //     enqueueSnackbar('error' + err, { variant: 'error' });
  //   } finally {
  //     setIsSubmitting(false);
  //     form.reset();
  //     handleAction(activeAction, dispatch, { add, edit, del, view });
  //   }
  // };

  useEffect(() => {
    if (initialValues) {
      form.reset({
        name: initialValues.name || '',
        detail: initialValues.detail || '',
        category: initialValues.category || '',
        importPrice: initialValues.importPrice || 0,
        sellingPrice: initialValues.sellingPrice || 0,
        status: initialValues.status || '',
        isMainProductId:
          initialValues?.productDetails?.flatMap((detail) => detail.image)?.find((image) => image.mainProduct)?.id ||
          '',
        productDetails:
          initialValues.productDetails?.map((item) => ({
            id: item.id || null,
            quantity: item.quantity || 0,
            color: item.color || null,
            size: item.size || null,
            image: item.image || null,
            isMainId: item.image.filter((image) => image.mainColor === true)[0]?.id || null,
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

  return (
    <Dialog
      aria-labelledby="customized-dialog-title"
      open={view}
      maxWidth="lg"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          width: '1000px',
          maxWidth: 'none',
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Sản phẩm {initialValues.name}
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
      <form>
        <DialogContent dividers>
          <Box display={'flex'} gap={1}>
            <InputField readOnly name="name" label="Tên sản phẩm" form={form}></InputField>
            <SelectFrom
              readOnly
              height="40px"
              name="category"
              label="Danh mục"
              form={form}
              options={categoryQuery.data.data}
            />
            <NumericForm
              readOnly
              details={true}
              name={`importPrice`}
              label="Giá nhập"
              form={form}
              type="number"
              formSub={true}
            />
            <NumericForm readOnly name={`sellingPrice`} label="Giá bán" form={form} type="number" />
          </Box>
          <CKEditorForm name="detail" lable="Chi tiết sản phẩm" form={form} disabled />
          {/* <InputField name="price" label="Giá tiền" form={form} disabled />
          <InputField name="quantity" label="Số lượng sản phẩm" form={form} disabled /> */}
          {/* {activeAction === 'edit' ||
            (activeAction === 'view' && (
              <RadioForm name="status" label="Trạng thái" form={form} option={optionStatus} disabled />
            ))} */}
          <Divider sx={{ marginY: 2 }} />
          <h4>Danh sách sản phẩm chi tiết</h4>
          <Divider sx={{ marginY: 2, width: '50%' }} />
          {initialValues.productDetails?.map((item, index) => (
            <>
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
                <Box key={item.id} display={'flex'} gap={1} marginBottom={2}>
                  {/* <NumericForm
                    readOnly
                    details={true}
                    name={`productDetails[${index}].importPrice`}
                    label="Giá nhập"
                    form={form}
                    type="number"
                    formSub={true}
                  />
                  <NumericForm
                    readOnly
                    name={`productDetails[${index}].sellingPrice`}
                    label="Giá bán"
                    form={form}
                    type="number"
                  /> */}
                  <FormControl className="select_form" fullWidth>
                    <InputLabel id={`${`productDetails[${index}].color`}-label`} sx={{ top: '-6px' }}>
                      Màu sắc
                    </InputLabel>
                    <Controller
                      name={`productDetails[${index}].color`}
                      control={form.control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          labelId={`${`productDetails[${index}].color`}-label`}
                          id={`productDetails[${index}].color`}
                          value={field.value ? JSON.stringify(field.value) : ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            const selectedOption = value ? JSON.parse(value) : null;
                            field.onChange(selectedOption);
                          }}
                          input={<OutlinedInput label={'Màu sắc'} />}
                          sx={{ height: '40px', display: 'flex', alignItems: 'center' }}
                          readOnly={true}
                        >
                          <MenuItem value="">
                            <em>Bỏ chọn</em>
                          </MenuItem>
                          {listColor.map((c) => (
                            <MenuItem key={c.id} value={JSON.stringify(c)}>
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
                  </FormControl>
                  <Box width={'150%'}>
                    <SizeFieldArray
                      actionsState={actionsState}
                      readOnly
                      control={control}
                      index={index}
                      form={form}
                      listSize={listSize}
                    />
                  </Box>
                </Box>
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
                          <CardActions>
                            <>
                              <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Màu</FormLabel>
                                <Controller
                                  name={`productDetails[${index}].isMainId`}
                                  control={control}
                                  defaultValue=""
                                  render={({ field }) => (
                                    <Radio
                                      {...field}
                                      checked={field.value === item.id}
                                      onChange={() => field.onChange(item.id)}
                                      value={item.id}
                                      color="primary"
                                      disabled={true}
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
                                      disabled={true}
                                    />
                                  )}
                                />
                              </FormControl>
                            </>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            </>
          ))}
        </DialogContent>
      </form>
      {/* {initialValues.imagesUrl.length > 0 && (
        <Grid container spacing={2} mt={2}>
          {initialValues.imagesUrl.map((url, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Card>
                <CardMedia component="img" height="140" image={url} alt={`image-${index}`} />
              </Card>
            </Grid>
          ))}
        </Grid>
      )} */}
    </Dialog>
  );
}

export default ViewProduct;
