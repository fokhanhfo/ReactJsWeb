import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { Update } from '@mui/icons-material';
import ReusableTable from 'admin/components/Table/ReusableTable';

ListCategory.propTypes = {
  categorys: PropTypes.array.isRequired,
};

function ListCategory({ categorys }) {
  // Define the table headers
  const listHead = [
    { label: 'id', key: 'id', width: '10%' },
    { label: 'name', key: 'name', width: '30%' },
    { label: 'description', key: 'description', width: '40%' },
    {
      label: 'Thao tác',
      key: 'actions',
      width: '20%',
      render: (row) => (
        <>
          <IconButton>
            <DeleteIcon />
          </IconButton>
          <IconButton>
            <Link to={`./${row.id}`}>
              <Update />
            </Link>
          </IconButton>
        </>
      ),
    },
  ];
  return <ReusableTable listHead={listHead} rows={categorys} />;
}

export default ListCategory;
