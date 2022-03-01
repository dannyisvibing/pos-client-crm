import React from 'react';
import { connect } from 'react-redux';
import NameTD from './ListItems/Name';
import RoleTD from './ListItems/Role';
import OutletNameTD from './ListItems/OutletName';
import TargetInputTD from './ListItems/TargetInput';
import SeenAtTD from './ListItems/SeenAt';
import STATE from '../../../../constants/states';
import MESSAGES from '../../constants/messages';
import { RBSection, RBTable, RBLoader } from '../../../../rombostrap';
import {
  RBTHead,
  RBTBody,
  RBTR,
  RBTH,
  RBTD
} from '../../../../rombostrap/components/RBTable/RBTable';
import { filterUsers } from '../../../../modules/user';

const List = ({ state, users, search, filterUsers }) => {
  var filteredUsers = [];
  return (
    <RBSection>
      <RBTable fixed classes="vd-mbl">
        <RBTHead>
          <RBTR>
            <RBTH classes="vd-no-pad-l vd-sml-pad-r" width="270">
              Name
            </RBTH>
            <RBTH classes="vd-sml-pad-h" width="80">
              Role
            </RBTH>
            <RBTH classes="vd-sml-pad-h" width="170">
              Outlet
            </RBTH>
            <RBTH classes="vd-sml-pad-h vd-align-center">Daily Target</RBTH>
            <RBTH classes="vd-sml-pad-h vd-align-center">Weekly Target</RBTH>
            <RBTH classes="vd-sml-pad-h vd-align-center">Monthly Target</RBTH>
            <RBTH classes="vd-sml-pad-h" width="90">
              Last Active
            </RBTH>
          </RBTR>
        </RBTHead>
        <RBTBody>
          {state === STATE.inProgress && (
            <RBTR>
              <RBTD colSpan="7" classes="vd-align-center">
                <RBLoader />
              </RBTD>
            </RBTR>
          )}
          {state === STATE.ready &&
            (filteredUsers = filterUsers(users, search)).map((user, i) => (
              <RBTR key={i} classes="pro-user-row">
                <NameTD user={user} />
                <RoleTD user={user} />
                <OutletNameTD user={user} />
                <TargetInputTD
                  user={user}
                  period="daily"
                  value={user.targetDaily}
                />
                <TargetInputTD
                  user={user}
                  period="weekly"
                  value={user.targetWeekly}
                />
                <TargetInputTD
                  user={user}
                  period="monthly"
                  value={user.targetMonthly}
                />
                <SeenAtTD user={user} />
              </RBTR>
            ))}
          {state === STATE.error && (
            <RBTR>
              <RBTD classes="vd-align-center" colSpan="7">
                {MESSAGES.error.server}
              </RBTD>
            </RBTR>
          )}
          {!filteredUsers.length &&
            (search.query || search.role || search.outletId) && (
              <RBTR>
                <RBTD classes="vd-align-center" colSpan="7">
                  No users found
                  {search.query && (
                    <span> matching \u201C{search.query}\u201D</span>
                  )}
                  {search.role && (
                    <span>
                      {' '}
                      who are {search.role === 'admin' ? 'an' : 'a'}
                      <span className="up-capitalize">{search.role}</span>
                    </span>
                  )}
                  {search.outletId && <span> at {search.outletName}</span>}
                </RBTD>
              </RBTR>
            )}
        </RBTBody>
      </RBTable>
    </RBSection>
  );
};

export default connect(state => ({
  filterUsers(users, filter) {
    return filterUsers(state, users, filter);
  }
}))(List);
