import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RBInput from '../../../../rombostrap/components/RBInputV1';
import { RBValue } from '../../../../rombostrap/components/RBField';
import { retailerSettingsSelector } from '../../../../modules/retailer';
import { setTarget } from '../../../../modules/user';
import getCurrencySymbol from '../../../../utils/getCurrencySymbol';

class TargetInput extends Component {
  state = {
    targetValue: '',
    waiting: false
  };

  componentWillMount() {
    this.setState({ targetValue: this.props.value || 0 });
  }

  handleTargetChange = newValue => {
    const { targetValue: oldValue } = this.state;
    const { period, userId, setTarget } = this.props;
    if (Number(newValue) === Number(oldValue)) return;
    this.setState({
      targetValue: newValue,
      waiting: true
    });

    setTarget(userId, period, newValue)
      .then(() => {
        this.setState({ waiting: false });
      })
      .catch(() => {
        // To Do - Notification
        this.setState({
          targetValue: oldValue,
          waiting: false
        });
      });
  };

  render() {
    const { storeSetting } = this.props;

    return (
      <RBValue>
        <RBInput
          value={this.state.targetValue}
          textAlign="right"
          modelOptions={{
            updateOn: 'default',
            debounce: { default: 300, blur: 0 }
          }}
          rbNumberEnabled
          rbNumberOptions={{ decimalPlaces: 2, stripNonNumeric: true }}
          rbInputSymbol={{
            align: 'left',
            symbol: getCurrencySymbol(storeSetting.defaultCurrency)
          }}
          onInputChange={this.handleTargetChange}
        />
        {this.state.waiting && (
          <i className="vd-input-icon vd-input-icon--left vd-loader vd-loader--small up-input-loading" />
        )}
      </RBValue>
    );
  }
}

export default connect(
  state => ({
    storeSetting: retailerSettingsSelector(state)
  }),
  dispatch =>
    bindActionCreators(
      {
        setTarget
      },
      dispatch
    )
)(TargetInput);
