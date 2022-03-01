import React from 'react';
import { connect } from 'react-redux';
import { RBSection, RBTab, RBTabs } from '../../../../rombostrap';
import { canManageRoles } from '../../../../modules/user';

const Tabs = ({ activeTab, canManageRoles }) => (
  <RBSection classes="vd-ptn vd-pbn">
    <RBTabs modifiers={['no-border', 'large']}>
      <RBTab
        type="anchor"
        active={activeTab === 'users'}
        classes="po-users-tab"
        link="/setup/users"
      >
        Users
      </RBTab>
      {canManageRoles() && (
        <RBTab
          classes="po-users-tab"
          type="anchor"
          active={activeTab === 'roles'}
          link="/setup/users/roles"
        >
          Roles
        </RBTab>
      )}
    </RBTabs>
  </RBSection>
);

export default connect(state => ({
  canManageRoles() {
    return canManageRoles(state);
  }
}))(Tabs);
