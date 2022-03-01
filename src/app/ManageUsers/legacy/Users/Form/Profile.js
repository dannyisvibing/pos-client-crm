import React from 'react';
import moment from 'moment';
import Error from '../../Layout/Error';
import { RBHeader, RBP, RBField } from '../../../../../rombostrap';
import { RBLabel, RBValue } from '../../../../../rombostrap/components/RBField';
import RBInput from '../../../../../rombostrap/components/RBInputV1';

const Profile = ({ userForm, user, apiErrorMessages, onProfileChange }) => (
  <div>
    <RBHeader category="settings">Profile</RBHeader>
    <div className="vd-g-row">
      <div className="vd-g-col vd-g-s-12 vd-g-m-3 vd-grid-settings-item">
        <RBP>Personal and contact information for this user.</RBP>
      </div>
      <div className="vd-g-col vd-g-s-12 vd-g-m-9">
        <div className="vd-g-row vd-g-row--gutter-l">
          <div className="vd-g-col vd-g-s-12 vd-g-m-6">
            {/* Email Address / Username */}
            <RBField>
              <RBLabel>
                {user.isPrimaryUser ? 'Admin Email' : 'Username'}
              </RBLabel>
              <RBValue>
                <RBInput
                  type={user.isPrimaryUser ? 'email' : 'text'}
                  errorCondition={apiErrorMessages.name}
                  modelOptions={{
                    updateOn: 'default',
                    debounce: { blur: 0, default: 300 }
                  }}
                  required
                  value={user.username}
                  onInputChange={username =>
                    onProfileChange('username', username)
                  }
                />
                {!!apiErrorMessages.name && (
                  <Error message={apiErrorMessages.name} />
                )}
                {userForm.name.dirty &&
                  userForm.name.invalid && (
                    <Error
                      message={`You must have ${
                        user.isPrimaryUser ? 'an admin email' : 'a username'
                      }`}
                    />
                  )}
              </RBValue>
            </RBField>

            {/* Display Name */}
            <RBField>
              <RBLabel>Display Name</RBLabel>
              <RBValue>
                <RBInput
                  value={user.displayName}
                  onInputChange={displayName =>
                    onProfileChange('displayName', displayName)
                  }
                />
              </RBValue>
            </RBField>

            {/* Email */}
            <RBField>
              <RBLabel>Email</RBLabel>
              <RBValue>
                <RBInput
                  type="email"
                  modelOptions={{
                    updateOn: 'default',
                    debounce: { blur: 0, default: 300 }
                  }}
                  maxLength={255}
                  value={user.userEmail}
                  onInputChange={email => onProfileChange('userEmail', email)}
                />
                {!!apiErrorMessages.email && (
                  <Error message={apiErrorMessages.email} />
                )}
                {userForm.email.invalid && (
                  <Error message="Email must be valid" />
                )}
              </RBValue>
            </RBField>
            {user.createdAt && (
              <div className="vd-text--sub">
                Created at {moment(user.createdAt).format('ddd D MMMM, YYYY')}{' '}
                at {moment(user.createdAt).format('H:m A')}
              </div>
            )}
          </div>
          <div className="vd-g-col vd-g-s-12 vd-g-m-6">
            <RBField>
              <RBLabel>Profile Image</RBLabel>
              <RBValue />
            </RBField>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Profile;
