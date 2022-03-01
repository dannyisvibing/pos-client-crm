import React, { Component } from 'react';
import filter from 'lodash/filter';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';
import {
  RBSection,
  RBHeader,
  RBFlex,
  RBLink,
  RBButton
} from '../../../../rombostrap';
import Tabs from '../Layout/Tabs';
import FilterBar from '../Users/FilterBar';
import List from '../Users/List';
import STATE from '../../../../constants/states';
import { isAdminRole } from '../../../../modules/user';

class UsersList extends Component {
  state = {
    state: STATE.inProgress,
    users: [],
    roleOptions: [],
    outletOptions: [],
    filter: {},
    search: {}
  };

  componentWillMount() {
    const { outlets, users, roles } = this.props;
    var outletOptions = [];
    outletOptions = outlets.map(outlet => ({
      name: outlet.outletName,
      entity: outlet.outletId
    }));
    this.setState({
      state: STATE.ready,
      users: users,
      outletOptions
    });
    this.initRolesDropdown(roles);
  }

  initRolesDropdown = roles => {
    var roleOptions = map(
      orderBy(
        filter(roles, role => {
          // Managers can't filter by admin roles
          return this.props.canManageRoles() || !isAdminRole(role);
        }),
        'position',
        'desc'
      ),
      role => {
        return {
          name: role.name,
          entity: role.name.toLowerCase()
        };
      }
    );
    this.setState({ roleOptions });
  };

  handleFilterChange = (filterKey, filterValue) => {
    var filter = this.state.filter;
    filter[filterKey] = filterValue;
    filter.outletName = '';
    if (filterKey === 'query') filter.query = filterValue;
    if (filterKey === 'role') filter.role = (filterValue || {}).entity;
    if (filterKey === 'outlet') {
      filter.outletId = (filterValue || {}).entity;
      filter.outletName = (filterValue || {}).name;
    }
    this.setState({ filter });
  };

  handleApplyFilter = e => {
    e.preventDefault();
    this.setState({ search: Object.assign({}, this.state.filter) });
  };

  render() {
    console.log('ffff', this.state.users);
    return (
      <div>
        <RBSection>
          <RBHeader category="page">Users</RBHeader>
        </RBSection>
        <Tabs activeTab="users" />
        <RBSection type="secondary">
          <RBFlex flex flexJustify="between" flexAlign="center">
            <div>
              Manage users and their sales targets.
              <RBLink secondary>Need help?</RBLink>
            </div>
            <div>
              <RBButton category="primary" href="/setup/users/add">
                Add User
              </RBButton>
            </div>
          </RBFlex>
        </RBSection>
        <FilterBar
          query={this.state.filter.query}
          role={this.state.filter.role}
          roleOptions={this.state.roleOptions}
          outlet={this.state.filter.outletId}
          outletOptions={this.state.outletOptions}
          onFilterChange={this.handleFilterChange}
          onApplyFilter={this.handleApplyFilter}
        />
        <List
          state={this.state.state}
          users={this.state.users}
          search={this.state.search}
        />
      </div>
    );
  }
}

export default UsersList;
