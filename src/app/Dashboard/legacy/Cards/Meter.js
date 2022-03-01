import React from 'react';

const Meter = ({ value }) => (
  <div className="ds-meter">
    <div className="ds-meter-bar" style={{ width: `${value}%` }} />
  </div>
);

export default Meter;
