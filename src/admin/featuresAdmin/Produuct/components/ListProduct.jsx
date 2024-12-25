import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import productApi from 'api/productApi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './styled.scss';
import { Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Update } from '@mui/icons-material';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import { useSnackbar } from 'notistack';
import TableHeadComponent from 'admin/components/Table/TableHeadComponent';

ListProduct.propTypes = {
    products : PropTypes.array.isRequired,
    onUpdateSuccess: PropTypes.func.isRequired,
};

function ListProduct({products,onUpdateSuccess}) {
    const {enqueueSnackbar} = useSnackbar();
    const listHead = ["name","deatil","price","quantity","category","images","Thao tác","Trạng thái"]
    const handleClickStatus = async(event,product) =>{
        try{
            product.status = event.target.value;
            product.category = product.category.id;
            delete product.imagesUrl;
            await productApi.update(product);
            enqueueSnackbar("Update trạng thái thành công" ,{ variant: "success" })
            onUpdateSuccess();
        }catch(e){
            console.log(e);
            enqueueSnackbar("Update trạng thái không thành công"+ {e} ,{ variant: "error" })
        }
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHeadComponent listHead={listHead} />
                    <TableBody>
                    {products.map((row) => (
                        <TableRow
                        key={row.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.id}
                            </TableCell>
                            <TableCell align="right">{row.name}</TableCell>
                            <TableCell align="right">{row.detail}</TableCell>
                            <TableCell align="right">{row.price}</TableCell>
                            <TableCell align="right">{row.quantity}</TableCell>
                            <TableCell align="right">{row.category.name}</TableCell>
                            <TableCell align="right" className="table-cell image-cell">
                                <img src={row.imagesUrl[0]} alt="" />
                                <Button><Link to={`./${row.id}/image/`}>Danh sách ảnh</Link></Button>
                            </TableCell>
                            <TableCell align="right">
                                <IconButton>
                                    <DeleteIcon/>
                                </IconButton>
                                <IconButton>
                                    <Link to={`./${row.id}`}><Update/></Link>
                                </IconButton>
                            </TableCell>
                            <TableCell align="right">
                                <FormControl fullWidth>
                                    <NativeSelect
                                        value = {row.status}
                                        onChange={(event)=>handleClickStatus(event,row)}
                                        inputProps={{
                                        name: 'age',
                                        id: 'uncontrolled-native',
                                        }}
                                    >
                                        <option value={1}>On</option>
                                        <option value={0}>Off</option>
                                    </NativeSelect>
                                </FormControl>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default ListProduct;