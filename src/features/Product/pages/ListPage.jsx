import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import { Box, Button, Container, Grid, Pagination, PaginationItem, Paper } from '@mui/material';
import Slider from '@mui/material/Slider';
import productApi from 'api/productApi';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
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
    const [originalProductList, setOriginalProductList] = useState([]);
    const [filters, setFilters] = useState(() => {
        const params = queryString.parse(location.search);
        return {
            _page: 1,
            _limit: 10,
            ...params,
        };
    });
    const [pagination,setPagination] = useState({
        limit : 10,
        count : 10,
        page : 1,
    });

    useEffect(()=>{
        (async()=>{
            try {
                const {data,pagination} = await productApi.getAll(filters);
                setPagination(pagination);
                setProductList(data);
                setOriginalProductList(data);
            } catch (error) {
                console.log("lỗi",error);
            }

            setLoading(false);
        })();

    },[filters]);

    useEffect(()=>{
        navigate({
            pathname: location.pathname,
            search: queryString.stringify(filters),
        })
    },[filters,location.pathname])

    const handleNextPage = (event, page) => {
        setFilters((prevFilters)=>({
            ...prevFilters,
            _page: page,
        }));
    };

    const handleSortChange = (newSortValue) => {
        if(newSortValue==='salePrice:ASC' || newSortValue==='salePrice:DESC'){
            setFilters((prevFilters)=>({
                ...prevFilters,
                _sort: newSortValue,
            }));
        }
        if(newSortValue===''){
            setFilters((prevFilters) => {
                const { _sort, ...rest } = prevFilters;
                return rest;
            });
        }
    };

    const handleFilterChange = (newFilter) => {
        setFilters((prevFilters)=>({
            ...prevFilters,
            ...newFilter,
        }));
    }

    const handleFilterViewChange = (newFilter) => {
        setFilters(newFilter)
    }

    return (
        <Box>
            <Container>
                <Grid container spacing={1}>
                    <Grid item xs={3}>
                        <Paper elevation={0}>
                            <ProductFilter onChange={handleFilterChange} filters={filters}></ProductFilter>
                        </Paper>
                    </Grid>
                    
                    <Grid item xs={9}>
                        <Paper elevation={0}>
                            <Box display="flex" justifyContent="space-between">
                                <FilterViewer filters={filters} onChange={handleFilterViewChange} ></FilterViewer>
                                
                                <ProductSort currentSort={filters._sort || ''} onChange={handleSortChange}></ProductSort>
                            </Box>

                            {loading ? <ProductSkeletonList/> : <ProductList data={productList}></ProductList>}
                            <Box display="flex" justifyContent="center">
                                <Pagination
                                    count={Math.ceil(pagination.total / pagination.limit)}
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