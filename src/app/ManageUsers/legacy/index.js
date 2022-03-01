import React, { Component } from 'react';
import isEqual from 'is-equal';
import Users from '../containers/UsersHomePageContainer';
import Roles from './Roles';
import ManageRole from './Roles/ManageRole';
import ManageUser from '../containers/ManageUserPageContainer';

class UsersRoute extends Component {
  state = {
    whereToGo: undefined,
    params: {}
  };

  componentWillMount() {
    var nextState = this.routingStateProvider();
    if (nextState) {
      this.setState({ ...nextState });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    var nextState = this.routingStateProvider();
    if (nextState) {
      const { whereToGo, params } = prevState;
      if (
        whereToGo !== nextState.whereToGo ||
        !isEqual(params, nextState.params)
      ) {
        this.setState({ ...nextState });
      }
    }
  }

  routingStateProvider() {
    var route = this.props.match.params.action;
    var id = this.props.match.params.id;
    var whereToGo;
    var params = {};

    const { canManageRoles, canManageUsers } = this.props;
    if (!route && !id) {
      if (canManageUsers()) {
        whereToGo = '/';
      } else {
        this.props.routerReplace('/setup/users/view');
      }
    } else if (route === 'roles' && !!id) {
      if (canManageRoles()) {
        params.roleId = id;
        whereToGo = '/roles/:roleId';
      } else {
        this.props.routerReplace('/setup/users');
      }
    } else if (route === 'roles') {
      if (canManageRoles()) {
        whereToGo = '/roles';
      } else {
        this.props.routerReplace('/setup/users');
      }
    } else if (route === 'view') {
      params.userId = id;
      whereToGo = '/view';
    } else if (route === 'add') {
      if (canManageUsers()) {
        params.create = true;
        whereToGo = '/add';
      } else {
        this.props.routerReplace('/setup/users');
      }
    } else {
      this.props.routerReplace('/setup/users');
    }

    if (whereToGo) {
      return { whereToGo, params };
    } else {
      return null;
    }
  }

  render() {
    const { whereToGo, params } = this.state;
    return whereToGo === '/' ? (
      <Users />
    ) : whereToGo === '/roles' ? (
      <Roles />
    ) : whereToGo === '/roles/:roleId' ? (
      <ManageRole params={params} {...this.props} />
    ) : whereToGo === '/view' ? (
      <ManageUser params={params} />
    ) : whereToGo === '/add' ? (
      <ManageUser params={params} />
    ) : (
      <div />
    );
  }
}

export default UsersRoute;
