import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import categoryApi from 'api/categoryApi';
import { Box, Button, Typography } from '@mui/material';

ProductCategory.propTypes = {
    onChange : PropTypes.func,
};

function ProductCategory(props) {
    const { onChange } = props;
    const [dataCategory,setDataCategory] = useState([]);

    useEffect(()=>{
        (async()=>{
            try {
                const data = await categoryApi.getAll();
                setDataCategory(data);
                console.log(data);
            } catch (error) {
                console.log("lỗi",error);
            }
        })();
    },[]);

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