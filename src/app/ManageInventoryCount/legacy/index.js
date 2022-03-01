import React, { Component } from 'react';
import isEqual from 'is-equal';
import Landing from '../containers/LandingPageContainer';
import Manage from '../containers/ManageInventoryCountPageContainer';
import Perform from './Perform';
import Review from './View/Review';
import View from './View/View';

class StocktakeRoutes extends Component {
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

    if (!route && !id) {
      whereToGo = '/';
    } else if (route === 'create' && !id) {
      whereToGo = '/manage';
      params.create = true;
    } else if (route === 'edit' && !!id) {
      whereToGo = '/manage';
      params.id = id;
    } else if (route === 'perform' && !!id) {
      whereToGo = '/perform';
      params.id = id;
    } else if (route === 'review' && !!id) {
      whereToGo = '/review';
      params.id = id;
    } else if (route === 'view' && !!id) {
      whereToGo = '/view';
      params.id = id;
    } else {
      this.props.history.replace('/product/inventory_count');
    }

    return { whereToGo, params };
  }

  render() {
    const { whereToGo, params } = this.state;
    return whereToGo === '/' ? (
      <Landing {...this.props} />
    ) : whereToGo === '/manage' ? (
      <Manage {...this.props} params={params} />
    ) : whereToGo === '/perform' ? (
      <Perform {...this.props} params={params} />
    ) : whereToGo === '/review' ? (
      <Review {...this.props} params={params} />
    ) : whereToGo === '/view' ? (
      <View {...this.props} params={params} />
    ) : (
      <div />
    );
  }
}

export default StocktakeRoutes;
