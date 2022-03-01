import React from 'react';
import {
  RBHeader,
  RBP,
  RBInput,
  RBField,
  RBPasswordCheckerFeedback
} from '../../../../../rombostrap';
import { RBLabel, RBValue } from '../../../../../rombostrap/components/RBField';

const Security = ({
  isCreate,
  user,
  passwordScore,
  onPasswordScoreChange,
  onPasswordChange
}) => (
  <div>
    <RBHeader category="settings">Security</RBHeader>
    <div className="vd-g-row">
      <div className="vd-g-col vd-g-s-12 vd-g-m-3 vd-grid-settings-item">
        <RBP>
          Have a secure password to keep this user account safe. You can also
          use a Quick Switch ID when you begin a sale to instantly switch to
          your account.
        </RBP>
      </div>
      <div className="vd-g-col vd-g-s-12 vd-g-m-9">
        <div className="vd-text-signpost">Sign In Securely</div>
        <RBP>
          When you need to sign in to Vend, you will be asked to provide your
          password.
        </RBP>
        <div className="vd-g-row vd-g-row--gutter-l">
          <div className="vd-g-col vd-g-s-12 vd-g-m-6">
            <RBField>
              <RBLabel>{isCreate ? 'Enter' : 'Change'} Password</RBLabel>
              <RBValue>
                <RBInput
                  type="password"
                  value={user.password}
                  rbPasswordCheckerEnabled
                  rbPasswordCheckerScore={passwordScore}
                  onPasswordCheckerScoreChanged={onPasswordScoreChange}
                  minLength={4}
                  maxLength={64}
                  required={!!user.passwordRepeat || isCreate}
                  onInputChange={password =>
                    onPasswordChange('password', password)
                  }
                />
              </RBValue>
              <RBPasswordCheckerFeedback score={passwordScore} />
            </RBField>
          </div>
          <div className="vd-g-col vd-g-s-12 vd-g-m-6">
            <RBField>
              <RBLabel>Repeat {isCreate ? '' : 'New'} Password</RBLabel>
              <RBValue>
                <RBInput
                  type="password"
                  required={!!user.password || isCreate}
                  value={user.passwordRepeat}
                  onInputChange={passwordRepeat =>
                    onPasswordChange('passwordRepeat', passwordRepeat)
                  }
                />
              </RBValue>
            </RBField>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Security;
