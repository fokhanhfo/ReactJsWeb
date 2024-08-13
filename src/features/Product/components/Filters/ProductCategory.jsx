import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

ProductCategory.propTypes = {
    onChange : PropTypes.func,
};

function ProductCategory(props) {
    const { onChange } = props;
    const [dataCategory,setDataCategory] = useState([]);
    const categoryQuery = useSelector((state)=> state.categoryApi.queries["getCategory(undefined)"]);
    useEffect(() => {
        if (categoryQuery && categoryQuery.data) {
            setDataCategory(categoryQuery.data.data);
        }
    }, [categoryQuery]);

    const handleCategory = (category)=>{
        if(onChange){
            onChange(category.id);
        }
    };

    return (
        <Box style={{display: 'flex',flexDirection: 'column',alignItems: 'start'}}>
            <Typography>Danh mục sản phẩm</Typography>
            {dataCategory.map((category)=>(
                    <Button onClick={()=>handleCategory(category)} key={category.id}>
                        {category.name}
                    </Button>
            ))
            }
        </Box>
    );
}

export default ProductCategory;