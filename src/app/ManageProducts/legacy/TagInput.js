import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class TagInput extends Component {
  state = {
    value: ''
  };

  handleChange = e => {
    var value = e.target.value;

    if (value.length > 1 && value[value.length - 1] === ',') {
      var newTag = value.substring(0, value.length - 1);
      var dupIndex = this.props.tags.indexOf(newTag);
      if (dupIndex !== -1) {
        this.setState({ dupIndex });
      } else {
        this.props.onAddNewTag(newTag);
        this.setState({ value: '', dupIndex: -1 });
      }
    } else {
      this.setState({ value, dupIndex: -1 });
    }
  };

  render() {
    const { classes, label, tags, onRemoveTag } = this.props;
    return (
      <div className={classnames('vd-field', classes.root)}>
        {label && <div className="vd-label">{label}</div>}
        <div className={classnames('vd-value', classes.wrapper)}>
          <div className="vd-lozenge-group">
            {tags.map((tag, i) => (
              <div
                className={classnames('vd-lozenge vd-lozenge--interactive', {
                  'vd-lozenge-group-already-added': i === this.state.dupIndex
                })}
                key={i}
              >
                <span>
                  <span className="vd-lozenge-value">
                    <span>{tag}</span>
                  </span>
                </span>
                <div
                  className="vd-lozenge-delete fa fa-trash"
                  onClick={e => onRemoveTag(tag)}
                />
              </div>
            ))}
            <input
              className="vd-lozenge-group-input"
              placeholder="Separate by comman"
              value={this.state.value}
              onChange={this.handleChange}
              style={{ flexBasis: '17ch' }}
            />
          </div>
        </div>
      </div>
    );
  }
}

TagInput.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    wrapper: PropTypes.string
  }),
  tags: PropTypes.arrayOf(PropTypes.string)
};

TagInput.defaultProps = {
  classes: {},
  tags: []
};

export default TagInput;
