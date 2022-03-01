import React from 'react';

const Spinner = ({ loading }) =>
  loading && (
    <div className="loading-overlay">
      <div className="spinner">
        <div className="spinner_ball" />
        <div className="spinner_ball" />
        <div className="spinner_ball" />
      </div>
    </div>
  );

export default Spinner;
