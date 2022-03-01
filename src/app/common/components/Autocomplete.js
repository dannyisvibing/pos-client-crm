import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import RBPopover, {
  RBPopoverTarget,
  RBPopoverContainer,
  RBPopoverContent
} from '../../../rombostrap/components/RBPopover';

class AutoComplete extends PureComponent {
  handleKeyDown = e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      if (this.props.onEnterKeyPressed) this.props.onEnterKeyPressed();
    }

    if (e.keyCode === 38) {
      if (this.props.onUpPressed) this.props.onUpPressed();
    }

    if (e.keyCode === 40) {
      if (this.props.onDownPressed) this.props.onDownPressed();
    }
  };

  render() {
    const {
      id,
      label,
      placeholder,
      open,
      onRequestClose,
      value,
      onChange,
      match,
      possibleMatch,
      faIcon,
      children
    } = this.props;

    return (
      <div>
        {label && <div className="vd-text-label vd-mbs">{label}</div>}
        <RBPopover
          id={id}
          abuttedLeft={true}
          targetBottom
          containerTop
          open={open}
          onRequestClose={onRequestClose}
        >
          <RBPopoverTarget classes="vd-autocomplete-input-container">
            <input
              className="vd-input vd-autocomplete-input vd-input--icon-left"
              type="text"
              placeholder={placeholder}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              onKeyDown={this.handleKeyDown}
              value={value}
              onChange={onChange}
            />
            {open && (
              <div className="vd-autocomplete-input-typeahead">
                {match && (
                  <span className="vd-autocomplete-input-typeahead-match">
                    {match}
                  </span>
                )}
                {match && possibleMatch}
              </div>
            )}
            <i
              className={classnames(
                'vd-input-icon vd-input-icon--left',
                faIcon
              )}
            />
          </RBPopoverTarget>
          <RBPopoverContainer classes="vd-suggestions-popover" list hidePrint>
            <RBPopoverContent>{children}</RBPopoverContent>
          </RBPopoverContainer>
        </RBPopover>
      </div>
    );
  }
}

AutoComplete.propTypes = {
  id: PropTypes.string,
  placeholder: PropTypes.string
};

AutoComplete.defaultProps = {
  id: 'default-ac'
};

export default AutoComplete;
