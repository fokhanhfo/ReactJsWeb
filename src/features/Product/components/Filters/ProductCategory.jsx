import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { List, ListItemButton, ListItemText, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

ProductCategory.propTypes = {
  onChange: PropTypes.func,
};

function ProductCategory({ onChange }) {
  const [dataCategory, setDataCategory] = useState([]);
  const categoryQuery = useSelector((state) => state.categoryApi.queries['getCategory(undefined)']);

  useEffect(() => {
    if (categoryQuery?.data) {
      setDataCategory(categoryQuery.data.data);
    }
  }, [categoryQuery]);

  const handleCategory = (category) => {
    onChange && onChange(category);
  };

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem' }}>
        Danh mục
      </Typography>
      <List>
        {dataCategory.map((category) => (
          <ListItemButton key={category.id} onClick={() => handleCategory(category)}>
            <ListItemText
              primary={category.name}
              primaryTypographyProps={{ variant: 'body2', sx: { fontSize: '0.875rem' } }}
            />
          </ListItemButton>
        ))}
      </List>
    </>
  );
}

export default ProductCategory;
