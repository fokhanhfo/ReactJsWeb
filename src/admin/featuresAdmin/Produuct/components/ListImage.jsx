import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, FormControl, IconButton, NativeSelect, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { Update } from '@mui/icons-material';
import imageApi from 'api/imageApi';
import { useSnackbar } from 'notistack';

ListImage.propTypes = {
    listImage : PropTypes.array.isRequired,
    onUpdate: PropTypes.func.isRequired,
};

function ListImage({listImage,onUpdate}) {
    const [selectedFiles, setSelectedFiles] = useState({});
    const {enqueueSnackbar} = useSnackbar();
    const handleFileChange = (e, id) => {
        const files = e.target.files[0];
        setSelectedFiles({
            ...selectedFiles,
            [id]: files,
        });
    };
    
    const handleUpdateClick = async(id) => {
        const selectedFile = selectedFiles[id];
        if(selectedFile){
            const data = new FormData();
            data.append('file', selectedFile);
            try{
                const response = await imageApi.update(id,data);
                enqueueSnackbar('success',{variant:'success'});
                onUpdate();
            }catch(e){
                console.error(e);
                enqueueSnackbar('error',{variant:'error'});
            }
        }
    };

    const handleDeleteClick = async(id) =>{
        try{
            const response = await imageApi.remove(id);
            enqueueSnackbar('success',{variant:'success'});
            onUpdate();
        }catch(e){
            console.error(e);
            enqueueSnackbar('error',{variant:'error'});
        }
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>id</TableCell>
                        <TableCell align="right">ImageUrl</TableCell>
                        <TableCell align="right">Thao tác</TableCell>
                        <TableCell align="right">Thay đổi ảnh</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {listImage.map((row) => (
                        <TableRow
                        key={row.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.id}
                            </TableCell>
                            <TableCell align="right"><img width='100px' height='100px' src={row.urlFile} alt="" /></TableCell>
                            <TableCell align="right">
                                <IconButton onClick={()=>handleDeleteClick(row.id)}>
                                    <DeleteIcon/>
                                </IconButton>
                            </TableCell>
                            <TableCell align="right">
                                <input type="file" 
                                    accept="image/*,video/*"
                                    onChange={(e)=>handleFileChange(e,row.id)} 
                                />
                                <Button onClick={() => handleUpdateClick(row.id)}>Cập nhật</Button>
                                <div>
                                    {selectedFiles[row.id] && (
                                        <img
                                            src={URL.createObjectURL(selectedFiles[row.id])}
                                            alt="Preview"
                                            width="100"
                                            height="100"
                                        />
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default ListImage;