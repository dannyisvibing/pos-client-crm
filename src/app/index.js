import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter as Router } from 'react-router-redux';
import { logRender } from '../utils/debug';
import Routes from './Routes';

const App = props => {
  const { store, history } = props;
  const key = Math.random();
  logRender('render App Container');
  return (
    <Provider store={store} key={key}>
      <Router history={history} key={key}>
        <Routes />
      </Router>
    </Provider>
  );
};

export default App;
