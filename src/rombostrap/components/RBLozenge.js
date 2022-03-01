import React from 'react';
import classnames from 'classnames';

const RBLozenge = ({ label, children, onDelete }) => (
  <div
    className={classnames('vd-lozenge', {
      'vd-lozenge--interactive': !!onDelete
    })}
  >
    <span>
      {label && <span className="vd-lozenge-label">{label}: </span>}
      <span className="vd-lozenge-value">{children}</span>
      {onDelete && (
        <div className="vd-lozenge-delete fa fa-trash" onClick={onDelete} />
      )}
    </span>
  </div>
);

export default RBLozenge;
