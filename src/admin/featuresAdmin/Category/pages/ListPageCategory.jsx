import React from 'react';
import PropTypes from 'prop-types';
import useListCategory from '../hook/categoryFetch';
import ListCategory from '../components/ListCategory';
import Loading from 'components/Loading';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '@mui/material';

ListPageCategory.propTypes = {
};

const StyledButton = styled(Button)`
    float : right;
`

function ListPageCategory() {
    const {categorys,loading} = useListCategory();

    return (
        <>
            <div className='title'>
                <h3>Danh mục</h3>
            </div>
            <div>
                <StyledButton variant="contained"><Link to="./add">Add Product</Link></StyledButton>
            </div>
            {!loading ? 
                <ListCategory categorys={categorys}/> :
                <Loading/>
            }
        </>
    );
}

export default ListPageCategory;