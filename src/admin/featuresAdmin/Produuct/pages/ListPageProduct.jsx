import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import './styled.scss';
import ProductFilter from '../components/ProductFilter';
import ListProduct from '../components/ListProduct';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import productApi from 'api/productApi';
import Loading from 'components/Loading';
import { Box, Button, Pagination, PaginationItem } from '@mui/material';
import { Add, ArrowLeft, ArrowRight } from '@mui/icons-material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import styled from 'styled-components';

ListPageProduct.propTypes = {
    
};

const StyledButton = styled(Button)`
    float : right;
`

function ListPageProduct(props) {

    const location = useLocation();
    const navigate = useNavigate();
    const [products,setProducts] =useState([]);
    const [loading,setLoading] = useState(true);
    const queryParams = useMemo(()=>{
        const params = queryString.parse(location.search);
        return {
            page: Number.parseInt(params.page) || 1,
            limit : Number.parseInt(params.limit) || 5,
            status : Number.parseInt(params.status) || 1,
            ...params
        }
    },[location.search])

    const [pagination,setPagination] = useState({});
    const fetchProducts = async() =>{
        setLoading(true);
        try{
            const {data,pagination} = await productApi.getAll(queryParams);
            setProducts(data);
            setPagination(pagination);
        }catch(e){
            console.e("Lỗi khi fetch products:", e);
        }finally{
            setLoading(false);
        }
    }
    useEffect(()=>{
        fetchProducts();
    },[queryParams])

    // const rows = [];
    // products.forEach(element => {
    //     rows.push(createData(
    //         element.id,
    //         element.name,
    //         element.detail,
    //         element.price,
    //         element.quantity,
    //         element.category.name,
    //         element.imagesUrl[0],
    //         element.status
    //     ));
    // });

    // console.log(rows);

    const handleNextPage = (event, page) => {
        const newFilter={
            ...queryParams,
            page: page,
        };
        navigate({
            pathname: location.pathname,
            search: queryString.stringify(newFilter),
        }, { replace: true });

    };

    const handleChangeFilter = (newfilter)=>{
        navigate({
            pathname : location.pathname,
            search: queryString.stringify(newfilter),
        },{ replace: true })
    };




    return (
        <div>
            <div className='title'>
                <h3>Sản phẩm</h3>
            </div>
            {!loading ? 
                <>
                    <ProductFilter filter={queryParams} onSubmit={handleChangeFilter}></ProductFilter>
                    <div>
                        <StyledButton variant="contained"><Link to="./add">Add Product</Link></StyledButton>
                        <ListProduct products={products} onUpdateSuccess={fetchProducts}></ListProduct>
                    </div>
                    <Box display="flex" justifyContent="center">
                        <Pagination
                            count={Math.ceil(pagination.count / pagination.limit)}
                            page={Number.parseInt(queryParams.page)}
                            onChange={handleNextPage}
                            renderItem={(item) => (
                            <PaginationItem
                                slots={{ previous: ArrowLeft, next: ArrowRight }}
                                {...item}
                            />
                            )}
                        />
                    </Box>

                </>:<Loading></Loading>}
        </div>
    );
}

export default ListPageProduct;