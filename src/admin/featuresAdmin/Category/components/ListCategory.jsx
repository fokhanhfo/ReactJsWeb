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

ListCategory.propTypes = {
  categorys: PropTypes.array.isRequired,
  actionsState: PropTypes.object.isRequired,
};

function ListCategory({ categorys, actionsState }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Define the table headers
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
          {/* <IconButton>
            <DeleteIcon />
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
    </>
  );
}

export default ListCategory;
