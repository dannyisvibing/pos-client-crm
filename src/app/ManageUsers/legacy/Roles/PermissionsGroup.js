import React, { Component } from 'react';
import classnames from 'classnames';
import filter from 'lodash/filter';
import Permission from './Permission';
import { RBSection, RBFlex, RBHeader } from '../../../../rombostrap';

class PermissionsGroup extends Component {
  state = {};

  componentWillMount() {
    this.editablePermissionsRef = {};
    this.readonlyPermissionsRef = {};
  }

  getPermissionsGroup() {
    var d1 = Object.keys(this.editablePermissionsRef)
      .map(key => this.editablePermissionsRef[key])
      .map(ref => ref.getPermission());
    var d2 = Object.keys(this.readonlyPermissionsRef)
      .map(key => this.readonlyPermissionsRef[key])
      .map(ref => ref.getPermission());

    return {
      name: this.props.name,
      permissions: d1.concat(d2)
    };
  }

  render() {
    const { permissions, name, role } = this.props;
    const oneColumnGroups = [
      'Reporting',
      'Labels',
      'Discounts',
      'Product Costs'
    ];
    const editablePermissions = filter(permissions, { editable: true });
    const readonlyPermissions = filter(permissions, { editable: false });
    const readOnlyCount = readonlyPermissions.length;
    const hasOtherPermissionsTitle =
      editablePermissions.length && readOnlyCount;
    const oneColumn = oneColumnGroups.indexOf(name) > -1;

    return (
      <RBSection>
        <RBFlex flex>
          <div className="vd-g-col vd-col-3">
            <RBHeader>{name}</RBHeader>
          </div>
          <div className="vd-g-col vd-col-9">
            {editablePermissions.map((permission, i) => (
              <div
                key={i}
                className={classnames({
                  'vd-mbl': i !== editablePermissions.length - 1
                })}
              >
                <Permission
                  ref={c => (this.editablePermissionsRef[i] = c)}
                  permission={permission}
                  role={role}
                />
              </div>
            ))}
            {!!hasOtherPermissionsTitle && (
              <div>
                <hr className="vd-hr" />
                <RBHeader classes="vd-mtl vd-mbl up-role-subsection-title">
                  Other permissions
                </RBHeader>
              </div>
            )}
            {!!readOnlyCount && (
              <div className="vd-g-row">
                <div className={classnames({ 'vd-g-col': !oneColumn })}>
                  {readonlyPermissions.map(
                    (permission, i) =>
                      (i % 2 === 0 || oneColumn) && (
                        <div
                          key={i}
                          className={classnames({
                            'vd-mbl': i < readOnlyCount - (oneColumn ? 1 : 2)
                          })}
                        >
                          <Permission
                            ref={c => (this.readonlyPermissionsRef[i] = c)}
                            permission={permission}
                            role={role}
                          />
                        </div>
                      )
                  )}
                </div>
                {!oneColumn && (
                  <div className="vd-g-col">
                    {readonlyPermissions.map(
                      (permission, i) =>
                        i % 2 === 1 && (
                          <div
                            key={i}
                            className={classnames({
                              'vd-mbl': i < readOnlyCount - 2
                            })}
                          >
                            <Permission
                              ref={c => (this.readonlyPermissionsRef[i] = c)}
                              permission={permission}
                              role={role}
                            />
                          </div>
                        )
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </RBFlex>
      </RBSection>
    );
  }
}

export default PermissionsGroup;
