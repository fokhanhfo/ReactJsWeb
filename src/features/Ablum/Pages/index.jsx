import React from 'react';
import PropTypes from 'prop-types';
import Album from '../Components/Album';
import AlbumList from '../Components/AlbumList';

AlbumFeature.propTypes = {

};

function AlbumFeature(props) {
    const albumList = [
        {
            id: 1,
            name: 'Nhạc hoa thịnh hành',
            thumbnailUrl: 'https://inanhdep196.com/wp-content/uploads/album-anh-13x18-de-200-anh-3-1.jpg'
        },
        {
            id: 2,
            name: 'Rap việt thịnh hành',
            thumbnailUrl: 'https://inanhdep196.com/wp-content/uploads/album-anh-13x18-de-200-anh-3-1.jpg'
        },
        {
            id: 3,
            name: 'Nhạc hot thịnh hành',
            thumbnailUrl: 'https://inanhdep196.com/wp-content/uploads/album-anh-13x18-de-200-anh-3-1.jpg'
        },
    ]

    return (
        <div>
            <h2>Abum list</h2>
            <AlbumList albumList={albumList} />
        </div>
    );
}

export default AlbumFeature;