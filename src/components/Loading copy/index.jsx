import React from 'react';
import PropTypes from 'prop-types';
import './styles.scss';

LoadingWeb.propTypes = {};

function LoadingWeb(props) {
  return (
    <div className="loading-container">
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  );
}

export default LoadingWeb;
