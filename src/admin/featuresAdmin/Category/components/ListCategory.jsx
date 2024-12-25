import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, IconButton, NativeSelect, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { Update } from '@mui/icons-material';

ListCategory.propTypes = {
    categorys: PropTypes.array.isRequired,
};

function ListCategory({categorys}) {

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>id</TableCell>
                        <TableCell align="right">name</TableCell>
                        <TableCell align="right">description</TableCell>
                        <TableCell align="right">Thao tác</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {categorys.map((row) => (
                        <TableRow
                        key={row.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.id}
                            </TableCell>
                            <TableCell align="right">{row.name}</TableCell>
                            <TableCell align="right">{row.description}</TableCell>
                            <TableCell align="right">
                                <IconButton>
                                    <DeleteIcon/>
                                </IconButton>
                                <IconButton>
                                    <Link to={`./${row.id}`}><Update/></Link>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default ListCategory;