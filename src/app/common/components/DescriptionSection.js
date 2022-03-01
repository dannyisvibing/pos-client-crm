import React from 'react';

import { RBSection, RBHeader, RBP } from '../../../rombostrap';

const DescriptionSection = ({
  title,
  description,
  classes,
  type,
  level,
  children
}) => {
  return (
    <RBSection classes={classes} type={type} level={level}>
      <RBHeader category="settings">{title}</RBHeader>
      <div className="vd-g-row">
        <div className="vd-g-col vd-g-s-12 vd-g-m-3 vd-grid-settings-item">
          {description && <RBP>{description}</RBP>}
        </div>
        <div className="vd-g-col vd-g-s-12 vd-g-m-9">{children}</div>
      </div>
    </RBSection>
  );
};

export default DescriptionSection;
