import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Tabs from '../Layout/Tabs';
import List from './List';
import STATE from '../../../../constants/states';
import { RBSection, RBHeader, RBFlex } from '../../../../rombostrap';
import { fetchRoles } from '../../../../modules/user';

class Roles extends Component {
  state = {
    state: STATE.inProgress,
    roles: []
  };

  async componentWillMount() {
    const result = await this.props.fetchRoles();
    this.setState({
      roles: result.payload.data,
      state: STATE.ready
    });
  }

  render() {
    return (
      <div>
        <RBSection>
          <RBHeader category="page">Roles</RBHeader>
        </RBSection>
        <Tabs activeTab="roles" />
        <RBSection type="secondary">
          <RBFlex flex flexJustify="between" flexAlign="center">
            <div>Manage what each role can see and do.</div>
            <div>
              <a className="vd-button" style={{ opacity: 0 }}>
                &nbsp;
              </a>
            </div>
          </RBFlex>
        </RBSection>
        <List state={this.state.state} roles={this.state.roles} />
      </div>
    );
  }
}

export default connect(null, dispatch =>
  bindActionCreators(
    {
      fetchRoles
    },
    dispatch
  )
)(Roles);
