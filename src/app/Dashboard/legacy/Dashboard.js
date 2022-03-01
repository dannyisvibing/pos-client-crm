import React, { Component } from 'react';
import { RBLoader } from '../../../rombostrap';
import STATES from '../../../constants/states';
import rbDashboardService from '../managers/dashboard/dashboard.service';
import Runtime from './Runtime';

class Dashboard extends Component {
  state = {
    state: STATES.inProgress
  };

  componentWillMount() {
    rbDashboardService
      .init(this.props.activeUser, this.props.myOutlets)
      .then(() => {
        this.setState({ state: STATES.ready });
      });
  }

  render() {
    return (
      <div className="ds-page">
        {this.state.state === STATES.inProgress && (
          <div className="ds-page-loading">
            <RBLoader />
          </div>
        )}
        {this.state.state === STATES.ready && <Runtime />}
      </div>
    );
  }
}

export default Dashboard;
