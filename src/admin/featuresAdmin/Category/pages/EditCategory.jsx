import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
import categoryApi from 'api/categoryApi';
import Loading from 'components/Loading';
import FormCategory from '../components/formCategory';

EditCategory.propTypes = {
    
};

function EditCategory(props) {
    const{enqueueSnackbar } = useSnackbar(props);
    const navigate = useNavigate();
    const { categoryId } = useParams();
    const [category, setCategory] = useState(null);
    useEffect(()=>{
        const fetchCategory = async()=>{
            try{
                const response = await categoryApi.get(categoryId);
                setCategory(response.data);
            }catch(e){
                console.error(e);
            }
        }
        fetchCategory();
    },[]);

    const handleSubmit = async(value)=>{
        try{
            const newValue={
                ...value,
                id: categoryId,
            }
            const response = await categoryApi.update(newValue);
            enqueueSnackbar('success',{variant: 'success'});
            navigate('../');
        }catch(err){
            console.error(err);
            enqueueSnackbar('Error :'+err.response.data.message,{variant: 'error'});
        }
    }

    return (
        <>
            <div>
                <h3>Chỉnh sửa danh mục</h3>
            </div>
            {category ? (
                <FormCategory onSubmit={handleSubmit} initialValues={category} isEdit={true}/>
            ) : (
                <Loading/>
            )}
        </>
    );
}

export default EditCategory;