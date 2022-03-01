import React, { Component } from 'react';
import isEqual from 'is-equal';
import ManageTemplate from '../containers/ManageTemplateContainer';

class ReceiptTemplateRoute extends Component {
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
    var whereToGo;
    var params = {};

    if (action === 'new' && !id) {
      whereToGo = '/manage';
      params.create = true;
    } else if (action === 'edit' && !!id) {
      whereToGo = '/manage';
      params.id = id;
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
    return whereToGo === '/manage' ? (
      <ManageTemplate params={params} {...this.props} />
    ) : (
      <div />
    );
  }
}

export default ReceiptTemplateRoute;
