import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import RBButton from './RBButton';

const RBSave = ({ lastUpdated, form, disabled, saving, onSave }) =>
  !form.dirty && lastUpdated ? (
    <div className="vd-text--sub">
      Last updated {moment(lastUpdated).fromNow()}
    </div>
  ) : (
    (!lastUpdated || form.dirty) && (
      <RBButton
        category="primary"
        disabled={saving || disabled}
        onClick={onSave}
      >
        {saving ? 'Saving...' : !lastUpdated ? 'Save' : 'Save Changes'}
        {saving && <i className="vd-loader vd-loader--small" />}
      </RBButton>
    )
  );

RBSave.propTypes = {
  form: PropTypes.shape({
    dirty: PropTypes.bool
  }),
  disabled: PropTypes.bool,
  saving: PropTypes.bool,
  onSave: PropTypes.func
};

RBSave.defaultProps = {
  disabled: false,
  saving: false,
  form: {}
};

export default RBSave;
