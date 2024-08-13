import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { STATIC_HOST } from 'constants';
import { THUMBNAIL_PLACEHOLDER } from 'constants';
import "./styles.scss";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { ArrowForwardIos } from '@mui/icons-material';
import ImageDetail from './ProductThumbnailDetail/ImageDetail';

// const images = [
//     'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ly2cepottyvt4e',
//     'https://cc-prod.scene7.com/is/image/CCProdAuthor/tti-marquee-desktop@2x?$png$&jpegSize=200&wid=1162',
//     'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg',
//     'https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp',
//     'https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630',
//     'https://thumbs.dreamstime.com/z/earth-fresh-spring-green-grass-green-leaf-summer-time-31254943.jpg',
//     'https://down-vn.img.susercontent.com/file/sg-11134201-7rbkk-ln5rcc2bpdf946',
//     'https://media-cdn-v2.laodong.vn/storage/newsportal/2023/8/26/1233821/Giai-Nhi-1--Nang-Tre.jpg',
//     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSN0Y_SeJHZINmA_vwcN_rR71JW9wJXegQWiA&s',
//     'https://d1hjkbq40fs2x4.cloudfront.net/2017-08-21/files/landscape-photography_1645-t.jpg',
//     'https://d1hjkbq40fs2x4.cloudfront.net/2017-08-21/files/landscape-photography_1645-t.jpg',
//     'https://d1hjkbq40fs2x4.cloudfront.net/2017-08-21/files/landscape-photography_1645-t.jpg',
//     'https://d1hjkbq40fs2x4.cloudfront.net/2017-08-21/files/landscape-photography_1645-t.jpg',
//     'https://d1hjkbq40fs2x4.cloudfront.net/2017-08-21/files/landscape-photography_1645-t.jpg',
//     'https://d1hjkbq40fs2x4.cloudfront.net/2017-08-21/files/landscape-photography_1645-t.jpg',
//     'https://d1hjkbq40fs2x4.cloudfront.net/2017-08-21/files/landscape-photography_1645-t.jpg',
//     'https://d1hjkbq40fs2x4.cloudfront.net/2017-08-21/files/landscape-photography_1645-t.jpg',
//     'https://d1hjkbq40fs2x4.cloudfront.net/2017-08-21/files/landscape-photography_1645-t.jpg',
//     'https://d1hjkbq40fs2x4.cloudfront.net/2017-08-21/files/landscape-photography_1645-t.jpg',
// ]

ProductThumbnail.propTypes = {
    product: PropTypes.object,
};

function ProductThumbnail({ product }) {
    console.log(product);
    const images = product.imagesUrl;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentIndexClick,setCurrentIndexClick] =useState(0);
    const [displayedImages, setDisplayedImages] = useState(images.slice(0, 5));
    const thumbnailUrl = product.thumbnail ? `${product.thumbnail?.url}` : THUMBNAIL_PLACEHOLDER;

    // useEffect(() => {
    //     if (!limit.includes(images[currentIndex]) && currentIndex >= 4) {
    //         setDisplayedImages(images.slice(currentIndex-4,currentIndex+1));
    //         setLimit(images.slice(currentIndex-4,currentIndex+1));
    //     }else if(currentIndex < 4 && !limit.includes(images[currentIndex])){
    //         setDisplayedImages(images.slice(currentIndex,currentIndex+5));
    //         setLimit(images.slice(currentIndex,currentIndex+5));
    //     }
    // }, [currentIndex]);

    const handlePrevClick = () => {
        // setCurrentIndex(prevIndex => prevIndex > 0 ? prevIndex - 1 : 0);
        setCurrentIndexClick(prevIndex => {
            const newIndex = prevIndex > 0 ? prevIndex -1 : 0;
            setDisplayedImages(images.slice(newIndex,newIndex+5));
            return newIndex;
        })
    }

    const handleNextClick = () => {
        if(images.length <5){
            setDisplayedImages(images.slice(0,5));
        }else{
            setCurrentIndexClick(prevIndex => {
                const newIndex = prevIndex < images.length - 5 ? prevIndex + 1 : images.length - 5;
                setDisplayedImages(images.slice(newIndex,newIndex+5));
                return newIndex;
            })
        }
        // setCurrentIndex(prevIndex => prevIndex < images.length - 1 ? prevIndex + 1 : images.length-1);
    }

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box className="imageProduct">
            <Box onClick={handleClickOpen} className="imageProduct-main">
                <img className='main-image-sub' src={images[currentIndex]} alt={product.name} width="100%" />
            </Box>
            <Box className="controls-image">
                <div onClick={handlePrevClick} className='button_back_img left'>
                    <ArrowBackIosNewIcon />
                </div>
                <div>
                    {displayedImages.map((src, index) => (
                        <img
                            className={images[currentIndex] === src ? 'image_sub_active' : 'image_sub'}
                            key={index}
                            src={src}
                            alt={`Thumbnail ${index}`}
                            onMouseEnter={() => setCurrentIndex(images.indexOf(src))}
                        />
                    ))}
                </div>
                <div onClick={handleNextClick} className='button_back_img right'>
                    <ArrowForwardIos />
                </div>
            </Box>
            <React.Fragment>
                <ImageDetail images={images} open={open} onClose={handleClose}></ImageDetail>
            </React.Fragment>
        </Box>
    );
}

export default ProductThumbnail;
