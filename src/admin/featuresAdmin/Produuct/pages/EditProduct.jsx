import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FormProduct from '../components/formProduct';
import productApi from 'api/productApi';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from 'components/Loading';

EditProduct.propTypes = {
    
};

function EditProduct(props) {
    const{enqueueSnackbar } = useSnackbar(props);
    const navigate = useNavigate();
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await productApi.get(Number.parseInt(productId));
                setProduct(()=>{
                    const data = response.data;
                    const newProduct = {
                        ...data,
                        category : data.category.id
                    }
                    return newProduct;
                });
            } catch (e) {
                console.error(e);
            }
        }
        fetchProduct();
    }, [productId]);

    const handleSubmit = async(value)=>{
        try{
            const newValue={
                ...value,
                id: productId,
            }
            const response = await productApi.update(newValue);
            enqueueSnackbar('success',{variant: 'success'});
            navigate('../');
        }catch(err){
            console.error(err);
            enqueueSnackbar('error'+err,{variant: 'error'});
        }
    };

    return (
        <>
            <div>
                <h3>Chỉnh sửa sản phẩm</h3>
            </div>
            {product ? (
                <FormProduct onSubmit={handleSubmit} initialValues={product} isEdit={true}/>
            ) : (
                <Loading/>
            )}
        </>
    );
}

export default EditProduct;