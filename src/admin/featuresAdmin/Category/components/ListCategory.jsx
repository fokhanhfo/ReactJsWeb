import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { Update } from '@mui/icons-material';
import ReusableTable from 'admin/components/Table/ReusableTable';
import DataTable from 'admin/components/Table/DataTable';
import EditIcon from '@mui/icons-material/Edit';
import { handleAction } from 'admin/ultilsAdmin/actionHandlers';
import AddCategory from './AddCategory';
import { useDispatch } from 'react-redux';
import { useDeletecategoryMutation } from 'hookApi/categoryApi';
import { useSnackbar } from 'notistack';
import ConfirmDialog from 'components/ConfirmDialog/ConfirmDialog';

ListCategory.propTypes = {
  categorys: PropTypes.array.isRequired,
  actionsState: PropTypes.object.isRequired,
};

function ListCategory({ categorys, actionsState }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteItem, { isLoading, isSuccess, error }] = useDeletecategoryMutation();
  const { enqueueSnackbar } = useSnackbar();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [idCategory, setIdCategory] = useState();
  const handleOpenDialog = (id) => {
    setIdCategory(id);
    setIsDialogOpen(true);
  };
  const handleDeleteCategory = async (id) => {
    try {
      await deleteItem(id).unwrap();
      enqueueSnackbar('Xóa thành công', { variant: 'success' });
    } catch (err) {
      const errorMessage = err?.data?.message ?? err?.message ?? 'Đã xảy ra lỗi';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsDialogOpen(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      renderCell: (params) => {
        return <div dangerouslySetInnerHTML={{ __html: params.row.description }} />;
      },
    },
    { field: 'totalQuantity', headerName: 'TOTAL PRODUCTS', flex: 1 },
    {
      field: 'actions',
      headerName: 'Thao tác',
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleActions('edit', params.row)}>
            <EditIcon color="success" />
          </IconButton>
          {/* <IconButton onClick={() => handleOpenDialog(params.row.id)}>
            <DeleteIcon color="error" />
          </IconButton> */}
        </>
      ),
    },
  ];
  const dispatch = useDispatch();
  const handleActions = (state, row) => {
    if (state === 'edit' || state === 'view') {
      setSelectedCategory(row);
    }
    handleAction(state, dispatch, actionsState);
  };
  return (
    <>
      {' '}
      <DataTable rows={categorys} columns={columns} />
      {actionsState.edit === true && <AddCategory actionsState={actionsState} initialValues={selectedCategory} />}
      <ConfirmDialog
        isOpen={isDialogOpen}
        title="Xác nhận"
        message="Bạn có chắc chắn muốn thực hiện hành động này không?"
        onConfirm={() => handleDeleteCategory(idCategory)}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </>
  );
}

export default ListCategory;
