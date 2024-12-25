import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ListImage from '../components/ListImage';
import imageApi from 'api/imageApi';
import { useParams } from 'react-router-dom';
import Loading from 'components/Loading';
import { useSnackbar } from 'notistack';
import { Button } from '@mui/material';

EditImage.propTypes = {
    
};

function EditImage(props) {
    const [isLoading,setIsLoading] = useState(false);
    const {productId} = useParams();
    const [images , setImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const {enqueueSnackbar} = useSnackbar();
    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    const handleCreateClick = async() => {
        if(selectedFiles){
            const data = new FormData();
            for (let i = 0; i < selectedFiles.length; i++) {
                data.append('file', selectedFiles[i]);
            }
            try{
                const response = await imageApi.add(productId,data);
                enqueueSnackbar('success',{variant:'success'});
                fetchImages();
            }catch(e){
                console.error(e);
                enqueueSnackbar('error',{variant:'error'});
            }
        }
    };
    const fetchImages = async() =>{
        setIsLoading(true);
        try{
            const response = await imageApi.getImageProduct(productId);
            setImages(response.data);
        }catch(e){
            console.e("Lỗi khi fetch image:", e);
        }finally{
            setIsLoading(false);
        }
    }
    useEffect(()=>{
        fetchImages();
    },[]);

    return (
        <>
            <div>
                <h3>Danh sách ảnh</h3>
            </div>
            {!isLoading ? 
                <>
                    <ListImage listImage={images} onUpdate={fetchImages}></ListImage>
                    <div>
                        <h3>Thêm ảnh</h3>
                        <div>
                            <input type="file" 
                                multiple
                                accept="image/*,video/*"
                                onChange={(e)=>handleFileChange(e)} 
                            />
                            <Button onClick={handleCreateClick}>Thêm ảnh</Button>
                        </div>
                    </div>
                </>
            : <Loading/>
            }
        </>
    );
}

export default EditImage;