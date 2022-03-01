import React from 'react';
import classnames from 'classnames';
import { logRender } from '../../../utils/debug';
import { getUserDisplayName } from '../../../modules/user';
import AppRightSidebar from '../containers/AppRightSidebarContainer';
import SwitchUserDialog from '../containers/SwitchUserDialogContainer';
import ConfirmUserSwitchDialog from '../containers/ConfirmUserSwitchDialogContainer';
import '../styles/AppHeader.css';

const AppHeader = props => {
  logRender('render AppHeader');
  const { isOnline, retailerSettings, activeUser, onClickUser } = props;
  return (
    <div
      className={classnames('vd-topbar topnav', {
        'topnav--offline': !isOnline
      })}
    >
      <div className="vd-nav-item topnav-header">
        <a className="vd-nav-item-action" href="/dashboard">
          <div className="vd-nav-item-label">{retailerSettings.storeCname}</div>
        </a>
      </div>
      {!isOnline && <div className="topnav-center">Offline mode</div>}
      <div className="topnav-content">
        {isOnline && (
          <div className="vd-nav-item" style={{ cursor: 'pointer' }}>
            <a className="vd-nav-item-action" onClick={onClickUser}>
              <div className="vd-nav-item-label">
                {getUserDisplayName(activeUser)}
              </div>
            </a>
          </div>
        )}
      </div>
      <AppRightSidebar />
      <SwitchUserDialog />
      <ConfirmUserSwitchDialog />
    </div>
  );
};

export default AppHeader;
