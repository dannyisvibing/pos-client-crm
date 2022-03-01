import React, { Component } from 'react';
import isEqual from 'is-equal';
import Consignments from '../containers/ConsignmentsContainer';
import ManageConsignment from '../containers/ManageConsignmentContainer';
import ViewConsignment from '../containers/ViewConsignmentContainer';

class ConsignmentRoutes extends Component {
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
    var actionOrId = this.props.match.params.actionOrId;
    var action = this.props.match.params.action;
    var whereToGo;
    var params = {};

    if (!actionOrId && !action) {
      whereToGo = '/';
    } else if (actionOrId === 'newSupplier' && !action) {
      whereToGo = '/edit';
      params.create = true;
      params.type = 'supplierOrder';
    } else if (actionOrId === 'newReturn' && !action) {
      whereToGo = '/edit';
      params.create = true;
      params.type = 'supplierReturn';
    } else if (actionOrId === 'newOutlet' && !action) {
      whereToGo = '/edit';
      params.create = true;
      params.type = 'outletTransfer';
    } else if (!!actionOrId && !action) {
      whereToGo = '/view';
      params.id = actionOrId;
    } else if (!!actionOrId && action === 'receive') {
      whereToGo = '/edit';
      params.create = false;
      params.id = actionOrId;
      params.target = 'receive';
    } else if (!!actionOrId && action === 'edit') {
      whereToGo = '/edit';
      params.create = false;
      params.id = actionOrId;
      params.target = 'entire';
    } else if (!!actionOrId && action === 'editDetails') {
      whereToGo = '/edit';
      params.create = false;
      params.id = actionOrId;
      params.target = 'details';
    } else {
      this.props.history.replace('/product/consignment');
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
      <Consignments {...this.props} />
    ) : whereToGo === '/view' ? (
      <ViewConsignment params={params} {...this.props} />
    ) : whereToGo === '/edit' ? (
      <ManageConsignment params={params} {...this.props} />
    ) : (
      <div />
    );
  }
}

export default ConsignmentRoutes;
