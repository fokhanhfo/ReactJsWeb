import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/scss/image-gallery.scss";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './styled.scss';

SliderHome.propTypes = {
    images: PropTypes.array.isRequired,
};

function SliderHome({images}) {
    const [index,setIndex] = useState(0);

    const handlePrev = ()=>{
      setIndex(index=>{
        if(index === 0) return images.length -1;
        return index - 1 ;
      })
    }

    const handleNext = ()=>{
      setIndex(index=>{
        if(index === images.length - 1) return 0;
        return index + 1;
      });
    }

    return (
        <>
          <div className='home-slider'>
            <div className='home-slider-divImg'>
              {images.map(image=>(
                <img style={{translate:`${-100 * index}%`}} 
                  src={image} key={image} 
                  className='home-slider-img'
                />
              ))}
            </div>
            <button onClick={handlePrev} className='home-slider-btn btn-left'><ArrowBackIosIcon/></button>
            <button onClick={handleNext} className='home-slider-btn btn-right'><ArrowForwardIosIcon/></button>
          </div>
        </>
    );
}

export default SliderHome;