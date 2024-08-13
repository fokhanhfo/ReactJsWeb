import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Slider from './components/Slider';
import NewProduct from './components/NewProduct';
import productApi from 'api/productApi';

NewArrivalsFeatures.propTypes = {
    
};

function NewArrivalsFeatures(props) {
    const [productList,setProductList] = useState([]);

    const [param,setParam] = useState({
        page : 1,
        limit: 10,
    });

    // useEffect(async()=>{
    //     try{
    //         const { data, pagination } = await productApi.getNewProduct(param);
    //     }catch(e){};
    // });

    return (
        <div>
            <Slider></Slider>
            <NewProduct></NewProduct>
        </div>
    );
}

export default NewArrivalsFeatures;