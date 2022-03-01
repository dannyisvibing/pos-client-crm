import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory';
import createStore from './store/createStore';
import { getLocalSessionSync } from './modules/auth';
import './rombostrap/index.css';
import registerServiceWorker from './registerServiceWorker';

// =========================================
// Store Instantiation
// =========================================
const initialState = {
  auth: {
    session: getLocalSessionSync()
  }
};
const history = createHistory();
const store = createStore(initialState, history);

// =========================================
// Render
// =========================================
const composeApp = App => <App store={store} history={history} />;

const renderApp = () => {
  const App = require('./app').default;
  ReactDOM.render(composeApp(App), document.getElementById('root'));
};

renderApp();

if (module.hot) {
  module.hot.accept('./app', renderApp);
}

// =========================================
// Service Worker Registration
// =========================================
registerServiceWorker();
