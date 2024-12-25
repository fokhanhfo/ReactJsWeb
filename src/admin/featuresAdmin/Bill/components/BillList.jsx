import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, FormControl, NativeSelect, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import TableHeadComponent from 'admin/components/Table/TableHeadComponent';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';
import { formatDateTime, formatPrice } from 'utils';
import './styles.scss';
import billApi from 'api/billApi';
import { useSnackbar } from 'notistack';

BillList.propTypes = {
    bills : PropTypes.array.isRequired,
    onUpdateSuccess: PropTypes.func.isRequired,
};

function BillList({bills,onUpdateSuccess}) {
    const {enqueueSnackbar} = useSnackbar();

    const listHead = ["Phone", "Address","Email","User Name","Created Date","Price Total","Trạng thái","Thao tác"]
    const [localBills, setLocalBills] = useState(bills);

    const handleClickStatus= async(event,billId) => {
        const data = {
            status : event.target.value,
            id : billId
        }
        const response = await billApi.updateStatus(data);
        if(response){
            const index = localBills.findIndex(bill => bill.id === billId);
            if (index !== -1) {
                const updatedBills = [...localBills];
                updatedBills.splice(index, 1);
                setLocalBills(updatedBills);
                enqueueSnackbar("Update trạng thái thành công" ,{ variant: "success" })
            }
        }else{
            enqueueSnackbar("Update trạng thái không thành công",{ variant: "error" })
        }
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHeadComponent listHead={listHead} />
                    <TableBody>
                    {localBills.map((row) => (
                        <TableRow
                        key={row.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.id}
                            </TableCell>
                            <TableCell align="right">{row.phone}</TableCell>
                            <TableCell align="right">{row.address}</TableCell>
                            <TableCell align="right">{row.email}</TableCell>
                            <TableCell align="right">{row.user_id}</TableCell>
                            <TableCell align="right">{formatDateTime(row.createdDate)}</TableCell>
                            <TableCell align="right">{formatPrice(row.total_price)}</TableCell>
                            <TableCell align="right">
                                <FormControl fullWidth>
                                    <NativeSelect
                                        value = {row.status}
                                        onChange={(event)=>handleClickStatus(event,row.id)}
                                        inputProps={{
                                        name: 'age',
                                        id: 'uncontrolled-native',
                                        }}
                                    >
                                        <option value={1}>Duyệt Đơn</option>
                                        <option value={2}>Đơn Hoàn thành</option>
                                        <option value={0}>Hủy đơn hàng</option>
                                    </NativeSelect>
                                </FormControl>
                            </TableCell>
                            <TableCell align="right">
                                <Button><Link to={`./${row.id}`}><VisibilityIcon/></Link></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default BillList;