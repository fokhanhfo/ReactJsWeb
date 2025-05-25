import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import productApi from 'api/productApi';
import { Link } from 'react-router-dom';
import './styled.scss';
import { Box, Button, Chip, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Update } from '@mui/icons-material';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import { useSnackbar } from 'notistack';
import ReusableTable from 'admin/components/Table/ReusableTable';
import { formatPrice, imageMainColor, imageMainProduct } from 'utils';
import { useDispatch } from 'react-redux';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';
import AddProduct from './AddProduct';
import ViewProduct from './ViewProduct';
import { useGetColorQuery } from 'hookApi/colorApi';
import { useGetSizeQuery } from 'hookApi/sizeApi';
import DataTable from 'admin/components/Table/DataTable';
import EditIcon from '@mui/icons-material/Edit';

ListProduct.propTypes = {
  products: PropTypes.array.isRequired,
  actionsState: PropTypes.object.isRequired,
};

function ListProduct({ products, actionsState }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { data: colors, error: colorsError, isLoading: colorsLoading } = useGetColorQuery();
  const { data: sizes, error: sizesError, isLoading: sizesLoading } = useGetSizeQuery();

  // const listHead = [
  //   { label: 'ID', key: 'id', width: '5%' },
  //   {
  //     label: 'Name',
  //     key: 'name',
  //     width: '15%',
  //     render: (row) => (
  //       <>
  //         <span style={{ cursor: 'pointer' }} onClick={() => handleActions('view', row)}>
  //           {row.name}
  //         </span>
  //       </>
  //     ),
  //   },
  //   // { label: 'Detail', key: 'detail', width: '20%' },
  //   {
  //     label: 'Price',
  //     key: 'price',
  //     width: '10%',
  //     render: (row) => {
  //       const listPrice = row.productDetails.map((productDetails) => productDetails.sellingPrice).sort((a, b) => a - b);
  //       return (
  //         <>
  //           {formatPrice(listPrice[0])}-{formatPrice(listPrice[listPrice.length - 1])}
  //         </>
  //       );
  //     },
  //   },
  //   {
  //     label: 'Quantity',
  //     width: '10%',
  //     render: (row) => {
  //       const totalQuantity = row.productDetails.reduce((sum, productDetail) => sum + productDetail.quantity, 0);
  //       return <>{totalQuantity}</>;
  //     },
  //   },
  //   { label: 'Category', width: '10%', render: (row) => row.category.name },
  //   // {
  //   //   label: 'Images',
  //   //   width: '15%',
  //   //   render: (row) => {
  //   //     return (
  //   //       <>
  //   //         <img
  //   //         // src={row?.imagesUrl[0]} alt="" style={{ width: 50, height: 50 }}
  //   //         />
  //   //         <Button>
  //   //           <Link to={`./${row.id}/image/`}>Danh sách ảnh</Link>
  //   //         </Button>
  //   //       </>
  //   //     );
  //   //   },
  //   // },
  //   {
  //     label: 'Actions',
  //     width: '10%',
  //     render: (row) => (
  //       <>
  //         <IconButton onClick={() => handleActions('edit', row)}>
  //           <Update color="success" />
  //         </IconButton>
  //         <IconButton>
  //           <DeleteIcon color="error" />
  //         </IconButton>
  //       </>
  //     ),
  //   },
  //   {
  //     label: 'Status',
  //     width: '10%',
  //     render: (row) => (
  //       <FormControl fullWidth>
  //         <NativeSelect
  //           value={row.status}
  //           onChange={(event) => handleClickStatus(event, row)}
  //           inputProps={{
  //             name: 'status',
  //             id: 'status-select',
  //           }}
  //         >
  //           <option value={1}>On</option>
  //           <option value={0}>Off</option>
  //         </NativeSelect>
  //       </FormControl>
  //     ),
  //   },
  // ];
  const columns = [
    // { field: 'id', headerName: 'ID', flex: 0.5 },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      renderCell: (params) => {
        const imageURL = imageMainProduct(params.row.productDetails);
        return (
          <Box display="flex" alignItems="center" gap={1}>
            <img
              src={imageURL?.imageUrl}
              alt=""
              style={{
                width: 40,
                height: 40,
                objectFit: 'cover',
                borderRadius: 4,
              }}
            />
            <span style={{ cursor: 'pointer', fontWeight: 500 }} onClick={() => handleActions('view', params.row)}>
              {params.row.name}
            </span>
          </Box>
        );
      },
    },
    {
      field: 'productDetails',
      headerName: 'Price',
      flex: 1,
      valueGetter: (params) => {
        const listPrice = params?.map((pd) => pd.sellingPrice).sort((a, b) => a - b);
        return `${formatPrice(listPrice[0])} - ${formatPrice(listPrice[listPrice.length - 1])}`;
      },
    },
    // {
    //   field: 'quantity',
    //   headerName: 'Quantity',
    //   width: 120,
    //   valueGetter: (params) => {
    //     return params.row.productDetails?.reduce((sum, pd) => sum + pd.quantity, 0);
    //   },
    // },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      valueGetter: (params) => params?.name,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.5,
      renderCell: (params) => {
        const status = params.row.status;
        const label = status === 1 ? 'On' : 'Off';

        const bgColor = status === 1 ? 'rgba(113, 221, 55, 0.16)' : 'rgba(145, 158, 171, 0.16)';
        const textColor = status === 1 ? '#71dd37' : '#919eab';

        return (
          <Chip
            label={label}
            size="small"
            onClick={() => handleClickStatus(params.row.status)}
            sx={{
              fontWeight: 500,
              borderRadius: '8px',
              px: 1.5,
              py: 0.5,
              fontSize: '0.75rem',
              bgcolor: bgColor,
              color: textColor,
              cursor: 'pointer',
            }}
          />
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      flex: 0.5,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleActions('edit', params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton>
            <DeleteIcon color="error" />
          </IconButton>
        </>
      ),
    },
  ];

  const handleActions = (state, row) => {
    if (state === 'edit' || state === 'view') {
      setSelectedProduct(row);
    }
    handleAction(state, dispatch, actionsState);
  };

  const handleClickStatus = async (event, product) => {
    try {
      product.status = event.target.value;
      await productApi.update(product);
      enqueueSnackbar('Update trạng thái thành công', { variant: 'success' });
    } catch (e) {
      enqueueSnackbar(`Update trạng thái không thành công: ${e.message}`, { variant: 'error' });
    }
  };
  console.log('products', products);

  return (
    <>
      {/* <ReusableTable listHead={listHead} rows={products} /> */}
      <DataTable rows={products} columns={columns} />
      {actionsState.edit === true && (
        <AddProduct
          actionsState={actionsState}
          initialValues={selectedProduct}
          listSize={sizes.data}
          listColor={colors.data}
        />
      )}
      {actionsState.view === true && <ViewProduct actionsState={actionsState} initialValues={selectedProduct} />}
    </>
  );
}

export default ListProduct;
