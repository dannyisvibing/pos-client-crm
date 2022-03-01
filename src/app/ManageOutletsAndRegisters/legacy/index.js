import React, { Component } from 'react';
import isEqual from 'is-equal';
import OutletsAndRegisters from '../containers/OutletsAndRegistersContainer';
import ViewOutlet from './Outlet/ViewOutlets';
import ManageOutlet from '../containers/ManageOutletsContainer';
import ViewRegister from './Register/ViewRegister';
import ManageRegister from '../containers/ManageRegisterContainer';

class OutletSetupRoute extends Component {
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
    var action = this.props.match.params.action;
    var id = this.props.match.params.id;
    var setupType = this.props.setupType;
    var whereToGo;
    var params = {};

    if (!setupType) {
      whereToGo = '/';
    } else if (setupType === 'outlet') {
      if (action === 'view' && !!id) {
        whereToGo = '/outlet/view';
        params.id = id;
      } else if (action === 'new' && !id) {
        whereToGo = '/outlet/manage';
        params.create = true;
      } else if (action === 'edit' && !!id) {
        whereToGo = '/outlet/manage';
        params.id = id;
      } else {
        this.props.history.replace('/setup/outlets_and_registers');
      }
    } else if (setupType === 'register') {
      if (action === 'view' && !!id) {
        whereToGo = '/register/view';
        params.id = id;
      } else if (action === 'new' && !!id) {
        whereToGo = '/register/manage';
        params.id = id;
        params.create = true;
      } else if (action === 'edit' && !!id) {
        whereToGo = '/register/manage';
        params.id = id;
      } else {
        this.props.history.replace('/setup/outlets_and_registers');
      }
    } else {
      this.props.history.replace('/setup/outlets_and_registers');
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
      <OutletsAndRegisters {...this.props} />
    ) : whereToGo === '/outlet/view' ? (
      <ViewOutlet params={params} {...this.props} />
    ) : whereToGo === '/outlet/manage' ? (
      <ManageOutlet params={params} {...this.props} />
    ) : whereToGo === '/register/view' ? (
      <ViewRegister params={params} {...this.props} />
    ) : whereToGo === '/register/manage' ? (
      <ManageRegister params={params} {...this.props} />
    ) : (
      <div />
    );
  }
}

export default OutletSetupRoute;
