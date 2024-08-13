import React from 'react';
import PropTypes from 'prop-types';
import FormProduct from '../components/formProduct';
import productApi from 'api/productApi';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

AddProduct.propTypes = {
    
};

function AddProduct(props) {
    const{enqueueSnackbar } = useSnackbar(props);
    const navigate = useNavigate();

    const handleSubmit = async(value)=>{
        try{
            const response = await productApi.add(value);
            enqueueSnackbar('success',{variant: 'success'});
            navigate('admin/products');
        }catch(err){
            console.error(err);
            enqueueSnackbar('error'+err,{variant: 'error'});
        }
    };

    return (
        <>
            <div>
                <h3>Thêm Sản Phẩm</h3>
            </div>
            <FormProduct onSubmit={handleSubmit}></FormProduct>
        </>
    );
}

export default AddProduct;