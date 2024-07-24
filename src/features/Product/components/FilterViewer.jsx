import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Chip } from '@mui/material';
import categoryApi from 'api/categoryApi';
import styled from '@emotion/styled';

const RootBox = styled(Box)`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  list-style-type: none;
  
  & > li {
    margin: 5px 5px;
  }
`;

FilterViewer.propTypes = {
    filters : PropTypes.object,
    onChange : PropTypes.func,
    
};

function FilterViewer({filters = {},onChange = null}) {

    const [dataCategory, setDataCategory] = useState(null);

    useEffect(() => {
        const fetchCategory = async (categoryId) => {
            try {
                const data = await categoryApi.get(categoryId);
                setDataCategory(data);
            } catch (error) {
                console.log("lỗi", error);
            }
        };
        const categoryId= filters['category.id'];
        if (categoryId) {
            fetchCategory(categoryId);
        }
    },[filters['category.id']]);

    const FILTER_LIST =[
        {
            id:1,
            getLabel:() =>'Giao hàng miễn phí',
            isActive:(filter) => filter.isFreeShip,
            isVisible:() =>true,
            isRemovable:false,
            onRemove:() =>{},
            onToggle: (filter) => {
                const newFilters = { ...filter };
                if (newFilters.isFreeShip) {
                    delete newFilters.isFreeShip;
                } else {
                    newFilters.isFreeShip = true;
                }
                return newFilters;
            },
        },
        {
            id:2,
            getLabel:(filter) => `${filter.salePrice_gte}=>${filter.salePrice_lte}`,
            isActive:() => true,
            isVisible:(filter) =>{
                if(filter.salePrice_lte){
                    return true;
                }
            },
            isRemovable:true,
            onRemove:filter =>{
                const newFilters = { ...filter };
                delete newFilters.salePrice_lte;
                delete newFilters.salePrice_gte;
                return newFilters;
            },
            onToggle:()=>{},
        },
        {
            id:3,
            getLabel:() => {
                return dataCategory?.name || 'Loading...';
            },
            isActive:filter => true,
            isVisible:(filter) =>Boolean(filter['category.id']),
            isRemovable:true,
            onRemove:filter =>{
                const newFilters = { ...filter };
                delete newFilters['category.id'];
                return newFilters;
            },
            onToggle:()=>{},
        },
    ]

    return (
        <RootBox>
            {FILTER_LIST.filter(x=>x.isVisible(filters)).map(x=>(
                <li key={x.id}>
                    <Chip 
                    label={x.getLabel(filters)} 
                    color={x.isActive(filters) ? 'primary' : 'default'}
                    clickable={!x.isRemovable}
                    onClick={x.isRemovable ? null : () => {
                        if(!onChange){
                            return
                        }
                        const newFilter = x.onToggle(filters);
                        onChange(newFilter);
                    }}
                    onDelete={x.isRemovable ? ()=>{
                        if(!onChange){
                            return
                        }
                        const newFilter = x.onRemove(filters);
                        onChange(newFilter);
                    } : null}
                    >

                    </Chip>
                </li>
            ))}
        </RootBox>
    );
}

export default FilterViewer;