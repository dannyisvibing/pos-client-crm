import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router';

const PublicRoute = ({
  hasSession,
  component: Component,
  location,
  ...rest
}) => {
  const nextPath =
    location.state &&
    location.state.from &&
    location.state.from.pathname !== '/login'
      ? location.state.from.pathname
      : '/';

  return (
    <Route
      {...rest}
      render={props =>
        hasSession ? (
          <Redirect
            to={{
              pathname: nextPath,
              state: { from: props.location }
            }}
          />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

const { bool, element, object, oneOfType, func } = PropTypes;
PublicRoute.propTypes = {
  hasSession: bool.isRequired,
  location: oneOfType([object]).isRequired,
  component: oneOfType([element, func]).isRequired
};

export default PublicRoute;
