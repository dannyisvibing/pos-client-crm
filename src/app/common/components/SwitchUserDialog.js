import React from 'react';
import {
  RBDialog,
  RBHeader,
  RBField,
  RBInput,
  UserBadge
} from '../../../rombostrap';
import { RBDialogHeader } from '../../../rombostrap/components/RBDialog';
import { RBLabel, RBValue } from '../../../rombostrap/components/RBField';

const SwitchUserDialog = props => {
  const {
    isOpen,
    name,
    filteredUsers,
    onNameChange,
    onSelectUser,
    onRequestClose
  } = props;
  return (
    <RBDialog size="medium" open={isOpen} onRequestClose={onRequestClose}>
      <RBDialogHeader>
        <RBHeader category="dialog">Switch to a different user</RBHeader>
      </RBDialogHeader>
      <form className="vd-mbm">
        <RBField>
          <RBLabel>Search all users</RBLabel>
          <RBValue>
            <RBInput
              value={name}
              onInputChange={onNameChange}
              placeholder="Enter name of user"
              rbInputSymbol={{ align: 'left', icon: 'fa fa-search' }}
            />
          </RBValue>
        </RBField>
      </form>
      <div className="user-switching-list-container">
        {false && <div>No users found matching</div>}
        <RBField>
          <RBLabel>All users</RBLabel>
          <ul className="user-switching-list vd-g-row">
            {filteredUsers.map((user, i) => (
              <li
                key={i}
                className="vd-g-col vd-g-s-12 vd-g-m-6"
                style={{ cursor: 'pointer' }}
              >
                <UserBadge
                  key={i}
                  name={user.displayName}
                  email={user.userEmail}
                  onClick={() => onSelectUser(user)}
                />
              </li>
            ))}
          </ul>
        </RBField>
      </div>
    </RBDialog>
  );
};

export default SwitchUserDialog;
