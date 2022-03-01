import React, { Component } from 'react';
import _ from 'lodash';
import { RBCheckboxDropdown } from '../../../rombostrap';

class OptionalAggregateDropdown extends Component {
  state = {
    optional: []
  };

  componentWillMount() {
    var optionalAggregates = this.props.definition.optionalAggregates;
    var optional = this.props.optional;
    _.forEach(optional, function(agg) {
      agg.selected = _.indexOf(optionalAggregates, agg.key) >= 0;
    });
    this.setState({ optional });
  }

  handleApply = items => {
    var optionalAggregates = _.map(_.filter(items, 'selected', true), 'key');
    this.props.onAggregatesUpdate(optionalAggregates);
  };

  render() {
    return (
      <div>
        <RBCheckboxDropdown
          items={this.state.optional}
          onApply={this.handleApply}
        />
      </div>
    );
  }
}

export default OptionalAggregateDropdown;
