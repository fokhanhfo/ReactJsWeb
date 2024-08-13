import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import categoryApi from 'api/categoryApi';
import '../styled.scss';

CategoryProduct.propTypes = {
    onSubmit : PropTypes.func.isRequired,
};

function CategoryProduct({onSubmit}) {

    const [category,setCategory] = useState([]);

    useEffect(()=>{
        const fetchCategory = async()=>{
            try{
                const response = await categoryApi.getAll();
                console.log(response);
                setCategory(response.data);
            }catch(e){
                console.error(e.message);
            }
        }
        fetchCategory();
    },[]);

    const handleClickCategory = (idCategory)=>{
        if(onSubmit){
            onSubmit(idCategory);
        }
    }

    return (
        <>
            {category.map((category)=>(
                <div onClick={()=>handleClickCategory(category.id)} className='category_filter_item' key={category.id}>
                    {category.name}
                </div>
            ))}
        </>
    );
}

export default CategoryProduct;