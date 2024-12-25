import React from 'react';
import PropTypes from 'prop-types';
import FormCategory from '../components/formCategory';
import categoryApi from 'api/categoryApi';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

AddCategory.propTypes = {
    
};

function AddCategory(props) {
    const{enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const handleSubmit = async(value)=>{
        try{
            const response = await categoryApi.add(value);
            enqueueSnackbar('success',{variant: 'success'});
            navigate('../');
        }catch(err){
            console.log(err);
            enqueueSnackbar('error'+err.response.data.message,{variant: 'error'});
        }
    }

    return (
        <>
            <div>
                <h3>Thêm Danh Mục</h3>
            </div>
            <FormCategory onSubmit={handleSubmit}/>
        </>
    );
}

export default AddCategory;