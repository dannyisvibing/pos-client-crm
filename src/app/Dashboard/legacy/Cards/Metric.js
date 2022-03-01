import React from 'react';
import removeWidow from '../../../../utils/removeWidow';

const Metric = ({ classes, label, value, context }) => (
  <div className={classes}>
    {!!label && (
      <div className="vd-text-label vd-mbs">{removeWidow(label)}</div>
    )}
    <div className="vd-text-heading vd-no-wrap">{value}</div>
    {!!context && (
      <div className="vd-text-supplementary vd-mts">{removeWidow(context)}</div>
    )}
  </div>
);

export default Metric;
