import React from 'react';
import classnames from 'classnames';
import { RBFlag } from '../../../rombostrap';
import IDBadge, {
  Header,
  Description
} from '../../../rombostrap/components/RBBadge/IDBadge';

const CustomerBadge = ({
  classes,
  name,
  group,
  customerCode,
  countryCode,
  onClick
}) => {
  return (
    <div className={classnames('vd-badge', classes)} onClick={onClick}>
      <IDBadge modifiers={['small']} inlineImage="/img/sample/pic4.jpg">
        <Header>
          <header>
            <span>{name}</span>
            <RBFlag>{group}</RBFlag>
          </header>
        </Header>
        <Description>
          <description>{`${customerCode}|${countryCode}`}</description>
        </Description>
      </IDBadge>
    </div>
  );
};

export default CustomerBadge;
