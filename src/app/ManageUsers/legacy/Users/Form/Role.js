import React from 'react';
import { RBHeader, RBSelect, RBP, RBField } from '../../../../../rombostrap';
import { RBLabel, RBValue } from '../../../../../rombostrap/components/RBField';

const Role = ({ canManageRoles, user, roleOptions, onRoleChange }) => (
  <div>
    <RBHeader category="settings">Role</RBHeader>
    <div className="vd-g-row">
      <div className="vd-g-col vd-g-s-12 vd-g-m-3 vd-grid-settings-item">
        <RBP>A role defines what this user can see and do.</RBP>
      </div>
      <div className="vd-g-col vd-g-s-12 vd-g-m-9">
        {!canManageRoles && (
          <span className="up-sentence-case">{user.accountType.name}</span>
        )}
        {canManageRoles && (
          <RBField short>
            <RBLabel>Role</RBLabel>
            <RBValue>
              <RBSelect
                entities={roleOptions}
                entityValue="value"
                selectedEntity={user.accountType.value}
                onChange={onRoleChange}
              />
            </RBValue>
          </RBField>
        )}
      </div>
    </div>
  </div>
);

export default Role;
