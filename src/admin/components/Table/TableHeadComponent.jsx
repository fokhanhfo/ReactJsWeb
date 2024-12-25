import React from 'react';
import PropTypes from 'prop-types';
import { TableCell, TableHead, TableRow } from '@mui/material';

TableHeadComponent.propTypes = {
    listHead : PropTypes.array.isRequired,
    
};

function TableHeadComponent({listHead}) {
    return (
        <TableHead className='table_head'>
            <TableRow>
                <TableCell>id</TableCell>
                {listHead.map((element, index) => (
                    <TableCell key={index} align="right">{element}</TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default TableHeadComponent;