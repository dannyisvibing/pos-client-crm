import React from 'react';
import classnames from 'classnames';
import {
  RBDialog,
  RBFlex,
  RBSection,
  RBButton,
  RBLink,
  RBHeader
} from '../../../rombostrap';
import {
  getUserDisplayName,
  getAccountType,
  getUserEmail
} from '../../../modules/user';
import '../styles/RightSidebar.css';

const AppRightSidebar = props => {
  const { isOpen, activeUser, onRequestClose, onSwitchUser, onSignOut } = props;
  return (
    <RBDialog drawer open={isOpen} onRequestClose={onRequestClose}>
      <div className="dialog-drawer-container">
        <div className="dialog-drawer-top-banner" />
        <RBSection
          classes={classnames('dialog-drawer-header user-dialog-current-user', {
            'user-dialog-current-user--with-switch-user-button': true
          })}
        >
          <RBButton
            category="primary"
            classes="user-switch-button"
            onClick={onSwitchUser}
          >
            Switch user
          </RBButton>
          <RBHeader category="subpage" classes="vd-mbm user-display-name">
            {getUserDisplayName(activeUser)}
          </RBHeader>
          <RBFlex flex flexAlign="baseline" classes="vd-mbl">
            <span className="user-account-type">
              {getAccountType(activeUser)}:
            </span>
            <span className="user-account-email vd-text--secondary vd-text--sub">
              {getUserEmail(activeUser)}
            </span>
          </RBFlex>
          <RBFlex flex flexJustify="start">
            <RBLink
              isNavLink={false}
              href=""
              className="vd-text--negative"
              onClick={onSignOut}
            >
              Sign out
            </RBLink>
          </RBFlex>
        </RBSection>
      </div>
      <div className="dialog-drawer-content" />
    </RBDialog>
  );
};

export default AppRightSidebar;
