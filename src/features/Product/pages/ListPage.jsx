import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import { Box, Button, Container, Grid, Pagination, PaginationItem, Paper } from '@mui/material';
import Slider from '@mui/material/Slider';
import productApi from 'api/productApi';
import queryString from 'query-string';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductList from '../components/ProductList';
import ProductSkeletonList from '../components/ProductSkeletonList';
import ProductSort from '../components/ProductSort';
import ProductFilter from '../components/ProductFilter';
import FilterViewer from '../components/FilterViewer';

ListPage.propTypes = {
    
};

function ListPage(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const [productList,setProductList] = useState([]);
    const [loading,setLoading] = useState(true);
    const queryParams = useMemo(()=>{
        const params = queryString.parse(location.search);
        return {
            page: Number.parseInt(params.page) || 1,
            limit: Number.parseInt(params.limit) || 2,
            status : 1,
            ...params,
        }

    },[location.search]);
    // const [filters, setFilters] = useState(() => {
    //     return {
    //         page: Number.parseInt(params.page) || 1,
    //         limit: Number.parseInt(params.limit) || 2,
    //         ...queryParams,
    //     };
    // });
    const [pagination,setPagination] = useState({
        limit : 10,
        count : 10,
        page : 1,
    });

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true); // Bắt đầu loading
            try {
                const { data, pagination } = await productApi.getAll(queryParams);
                setPagination(pagination);
                setProductList(data);
            } catch (error) {
                console.error("Lỗi khi fetch products:", error);
            } finally {
                setLoading(false); // Kết thúc loading
            }
        };
    
        fetchProducts(); // Gọi hàm fetchProducts
    }, [queryParams]);

    // useEffect(()=>{
    //     navigate({
    //         pathname: location.pathname,
    //         search: queryString.stringify(filters),
    //     }, { replace: true });
    // },[filters,navigate,location.pathname])

    // useEffect(()=>{
    //     const params = queryString.parse(location.search);
    //     const newFilter = {
    //         page : Number.parseInt(params.page) || 1,
    //         limit : Number.parseInt(params.limit) || 2,
    //         ...params,
    //     };
    //     if (JSON.stringify(newFilter) !== JSON.stringify(filters)) {
    //         setFilters(newFilter);
    //     }
    // },[location.search]);

    const handleNextPage = (event, page) => {
        // setFilters((prevFilters)=>({
        //     ...prevFilters,
        //     page: page,
        // }));

        const filters = {
            ...queryParams,
            page: page,
        }

        navigate({
            pathname: location.pathname,
            search: queryString.stringify(filters),
        });

    };

    const handleSortChange = (newSortValue) => {
        const filters = {
            ...queryParams
        }
        if (newSortValue === 'Price:ASC' || newSortValue === 'Price:DESC') {
            filters.sort = newSortValue; 
        } else if (newSortValue === '') {
            delete filters.sort;  
        }

        navigate({
            pathname: location.pathname,
            search: queryString.stringify(filters),
        });
    };

    const handleFilterChange = (newFilter) => {

        const filters = {
            ...queryParams,
            ...newFilter
        }
        navigate({
            pathname: location.pathname,
            search: queryString.stringify(filters),
        });
    }

    const handleFilterViewChange = (newFilter) => {
        // setFilters(newFilter)
        navigate({
            pathname: location.pathname,
            search: queryString.stringify(newFilter),
        });
    }
    return (
        <Box>
            <Container>
                <Grid container spacing={1}>
                    <Grid item xs={3}>
                        <Paper elevation={0}>
                            <ProductFilter onChange={handleFilterChange} filters={queryParams}></ProductFilter>
                        </Paper>
                    </Grid>
                    
                    <Grid item xs={9}>
                        <Paper elevation={0}>
                            <Box display="flex" justifyContent="space-between">
                                <FilterViewer filters={queryParams} onChange={handleFilterViewChange} ></FilterViewer>
                                
                                <ProductSort currentSort={queryParams.sort || ''} onChange={handleSortChange}></ProductSort>
                            </Box>

                            {loading ? <ProductSkeletonList/> : <ProductList data={productList}></ProductList>}
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
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default ListPage;