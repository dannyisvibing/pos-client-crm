import * as React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router';

const ProtectedRoute = ({ hasSession, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      hasSession ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

const { bool, element, object, oneOfType, func } = PropTypes;
ProtectedRoute.propTypes = {
  hasSession: bool.isRequired,
  location: oneOfType([object]).isRequired,
  component: oneOfType([element, func]).isRequired
};

export default ProtectedRoute;
