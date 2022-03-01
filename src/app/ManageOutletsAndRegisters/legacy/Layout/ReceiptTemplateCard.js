import React from 'react';
import classnames from 'classnames';
import { RBLink } from '../../../../rombostrap';

const ReceiptTemplateCard = ({ classes, template }) => (
  <div className={classnames('vd-card', classes)}>
    <div className="vd-ptl vd-pls vd-prs vd-pbl vd-align-center">
      <RBLink href={`/setup/receipt_template/edit/${template.id}`}>
        <div className="vd-text--secondary">{template.name}</div>
      </RBLink>
    </div>
  </div>
);

export default ReceiptTemplateCard;
