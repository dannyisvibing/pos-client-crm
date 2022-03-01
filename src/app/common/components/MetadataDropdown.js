import React, { Component } from 'react';
import _ from 'lodash';
import { RBCheckboxDropdown } from '../../../rombostrap';

class MetadataDropdown extends Component {
  state = {
    metadataItems: []
  };

  componentWillMount() {
    var selectedKeys, metadataItems;
    selectedKeys = this.getActiveMetadata();
    metadataItems = this.props.metadataItems;
    _.forEach(metadataItems, item => {
      if (_.indexOf(selectedKeys, item.key) >= 0) {
        item.selected = true;
      }
    });
    this.setState({ metadataItems });
  }

  getActiveMetadata() {
    var dimensionMetadata;
    dimensionMetadata = this.props.definition.dimensionMetadata;
    return _.flatten(
      _.map(
        _.filter(dimensionMetadata, function(data) {
          return data.metadata.length > 0;
        }),
        'metadata'
      )
    );
  }

  handleApply = items => {
    var rowMetadata, selectedItems;
    selectedItems = _.filter(items, 'selected', true);
    rowMetadata = [];
    _.forEach(this.props.definition.transformedReport.dimensions.row, function(
      row,
      key
    ) {
      rowMetadata[key] = {
        dimension: row.key,
        metadata: []
      };
      return _.forEach(selectedItems, function(selectedItem) {
        if (_.indexOf(selectedItem.dimensionKeys, row.key) >= 0) {
          return rowMetadata[key].metadata.push(selectedItem.key);
        }
      });
    });
    this.props.onMetadataUpdate(rowMetadata);
  };

  render() {
    return (
      <div>
        <RBCheckboxDropdown
          items={this.state.metadataItems}
          onApply={this.handleApply}
        />
      </div>
    );
  }
}

export default MetadataDropdown;
