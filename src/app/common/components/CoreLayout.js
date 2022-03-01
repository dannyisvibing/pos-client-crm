import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { logRender } from '../../../utils/debug';

class CoreLayout extends Component {
  render() {
    const { children } = this.props;
    logRender('render CoreLayout');
    return <div>{children}</div>;
  }
}

const { any } = PropTypes;
CoreLayout.propTypes = {
  children: any.isRequired
};

export default CoreLayout;
