import React, { useState } from 'react';
import PropTypes from 'prop-types';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './styled.scss';
import { Checkbox } from '@mui/material';
import StatusProduct from './filter/StatusProduct';
import CategoryProduct from './filter/CategoryProduct';

ProductFilter.propTypes = {
    filter : PropTypes.object.isRequired,
    onSubmit : PropTypes.func.isRequired,

};

function ProductFilter({filter,onSubmit}) {
    const [isMenu,setIsMenu] = useState()

    const handleClickMenu = ()=>(
        setIsMenu(!isMenu)
    )

    const handleChangeStatus = (status)=>{
        const newFilter = {
            ...filter,
            status : status,
        }
        if(onSubmit){
            onSubmit(newFilter);
        }
    }

    const handleSelectCategory = (idCategory)=>{
        const newFilter = {
            ...filter,
            category: idCategory
        };
        if(onSubmit){
            onSubmit(newFilter);
        }
    }

    return (
        <>
            <div className='filter'>
                <div className='filter_category' onClick={handleClickMenu}>
                    <p>Danh mục</p>
                    <KeyboardArrowDownIcon/>
                </div>

                <div className='filter_status'> 
                    <StatusProduct filter={filter} onSubmit={handleChangeStatus}></StatusProduct>
                </div>
            </div>
            {isMenu && (
                <div className='filter_category_list'>
                    <CategoryProduct onSubmit={handleSelectCategory} />
                </div>
            )}
        </>
    );
}

export default ProductFilter;