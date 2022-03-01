import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const RBFlex = ({
  flex,
  flexDirection,
  flexType,
  flexJustify,
  flexAlign,
  classes,
  children
}) => (
  <div
    className={classnames(classes, {
      'vd-flex': flex,
      [`vd-flex--${flexDirection}`]: flexDirection,
      [`vd-flex--${flexType}`]: flexType,
      [`vd-flex--justify-${flexJustify}`]: flexJustify,
      [`vd-flex--align-${flexAlign}`]: flexAlign
    })}
  >
    {children}
  </div>
);

RBFlex.propTypes = {
  flexDirection: PropTypes.oneOf(['row', 'column']),
  flexType: PropTypes.oneOf([
    'container',
    'fieldset-row',
    'no-shrink',
    'settings-explanation',
    'settings-expanded-content',
    'responsive-column'
  ]),
  flexJustify: PropTypes.oneOf(['start', 'end', 'between', 'around', 'center']),
  flexAlign: PropTypes.oneOf(['start', 'end', 'baseline', 'center', 'stretch'])
};

export default RBFlex;
