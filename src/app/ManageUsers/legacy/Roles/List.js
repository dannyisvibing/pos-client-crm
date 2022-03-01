import React from 'react';
import _ from 'lodash';
import STATE from '../../../../constants/states';
import timeAgo from '../../../../utils/timeAgo';
import { RBSection, RBTable, RBLoader, RBLink } from '../../../../rombostrap';
import {
  RBTHead,
  RBTBody,
  RBTR,
  RBTH,
  RBTD
} from '../../../../rombostrap/components/RBTable/RBTable';

const List = ({ state, roles }) => (
  <RBSection>
    <RBTable>
      <RBTHead>
        <RBTR>
          <RBTH classes="vd-no-pad-l vd-sml-pad-r">Name</RBTH>
          <RBTH classes="vd-sml-pad-h">Last Saved</RBTH>
        </RBTR>
      </RBTHead>
      <RBTBody>
        {state === STATE.inProgress && (
          <RBTR>
            <RBTD colSpan="2" classes="vd-align-center">
              <RBLoader />
            </RBTD>
          </RBTR>
        )}
        {state === STATE.ready &&
          _.orderBy(roles, ['position'], ['asc']).map((role, i) => (
            <RBTR key={i}>
              <RBTD classes="vd-no-pad-l vd-sml-pad-r">
                <RBLink
                  classes="vd-clickable pro-role-name"
                  secondary
                  href={`/setup/users/roles/${role.roleId}`}
                >
                  {role.name}
                </RBLink>
              </RBTD>
              <RBTD classes="vd-sml-pad-h vd-text--sub up-sentence-case">
                {timeAgo(role.updatedAt)}
              </RBTD>
            </RBTR>
          ))}
      </RBTBody>
    </RBTable>
  </RBSection>
);

export default List;
