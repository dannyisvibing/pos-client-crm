import React from 'react';
import { RBLoader } from '../../../rombostrap';
import '../styles/LoadingThrobber.css';

const LoadingThrobber = () => {
  return (
    <div className="loading-throbber">
      <RBLoader />
    </div>
  );
};

export default LoadingThrobber;
