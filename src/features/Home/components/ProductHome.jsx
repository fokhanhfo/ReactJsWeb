import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Paper } from '@mui/material';
import productApi from 'api/productApi';
import Loading from 'components/Loading';
import { formatPrice } from 'utils';
import InfiniteScroll from 'components/InfiniteScroll';

ProductHome.propTypes = {
    
};

function ProductHome(props) {
    const [totalRows, setTotalRows] = useState(0);
    const [filter , setFilter]=useState({
        page:1,
        limit:5,
        status:1,
    });
    const [posts,setPosts] = useState([]);

    useEffect(()=>{
        (async ()=>{
            const response = await productApi.getAll(filter);
            setPosts([...posts,...response.data]);
            setTotalRows(response.pagination.count);
        })();

    },[filter])

    const fetchMore = () => {
        setTimeout(() => {
            setFilter((prevFilter) => ({
                ...prevFilter,
                page: prevFilter.page + 1,
            }));
        }, 1000);
    };

    return (
        <>
            <InfiniteScroll
                loader={<Loading/>}
                className="w-[800px] mx-auto my-10"
                fetchMore={fetchMore}
                hasMore={posts.length < totalRows}
                endMessage={
                    <>
                        <p style={{textAlign:'center'}}>Đã hết sản phẩm</p>
                    </>
                }
            >
                <Grid className='home-products' spacing={3} container>
                    {posts.map((post,index)=>(
                        <Grid className='home-product' key={index} item xs={6} sm={4} md={3} lg={3}>
                            <Paper>
                                <div className='home-product-divImg'>
                                    <img className='home-product-img' src={post.imagesUrl[0]} alt="" />
                                </div>
                                <div className='home-product-detail'>
                                    <p className='home-product-detailName'>{post.name}</p>
                                    <p className='home-product-detailPrice'>{formatPrice(post.price)}</p>
                                </div>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

            </InfiniteScroll>
        </>
    );
}

export default ProductHome;