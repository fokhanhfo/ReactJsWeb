import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

Loading.propTypes = {

};

function Loading(props) {
    return (
        <div className="loading-container">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
        </div>
    );
}

export default Loading;