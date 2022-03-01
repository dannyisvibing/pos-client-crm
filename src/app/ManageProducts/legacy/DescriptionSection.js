import React from 'react';
import { RBSection, RBHeader, RBP } from '../../../rombostrap';

const DescriptionSection = ({ classes, title, description, children }) => (
  <RBSection classes={classes}>
    <div className="vd-flex">
      <div className="vd-col-6">
        <RBHeader category="section">{title}</RBHeader>
        <RBP>{description}</RBP>
      </div>
      <div className="vd-col-6 vd-field mll">{children}</div>
    </div>
  </RBSection>
);

export default DescriptionSection;
