import React, { useEffect, useMemo, useState } from 'react';
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
                setDataCategory(data.data);
            } catch (error) {
                console.log("lỗi", error);
            }
        };
        const categoryId= filters['category'];
        if (categoryId) {
            fetchCategory(categoryId);
        }
    },[filters['category']]);

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
            getLabel:(filter) => `${filter.price_gte}=>${filter.price_lte}`,
            isActive:() => true,
            isVisible:(filter) =>{
                if(filter.price_lte){
                    return true;
                }
            },
            isRemovable:true,
            onRemove:filter =>{
                const newFilters = { ...filter };
                delete newFilters.price_lte;
                delete newFilters.price_gte;
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
            isVisible:(filter) =>Boolean(filter['category']),
            isRemovable:true,
            onRemove:filter =>{
                const newFilters = { ...filter };
                delete newFilters['category'];
                return newFilters;
            },
            onToggle:()=>{},
        },
    ]

    const visibleFilters = useMemo(()=>{
        return FILTER_LIST.filter(x=>x.isVisible(filters))
    })

    return (
        <RootBox>
            {visibleFilters.map(x=>(
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