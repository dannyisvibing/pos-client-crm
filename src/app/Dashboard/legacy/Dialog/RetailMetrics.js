import React, { Component } from 'react';
import _ from 'lodash';
import CARDS from '../../managers/card/card.constants';
import {
  RBDialog,
  RBHeader,
  RBCheckbox,
  RBButton
} from '../../../../rombostrap';
import {
  RBDialogHeader,
  RBDialogActions,
  RBDialogContent
} from '../../../../rombostrap/components/RBDialog';
import { RBButtonGroup } from '../../../../rombostrap/components/RBButton';

class RetailMetrics extends Component {
  state = {
    open: false,
    catalogue: []
  };

  open(catalogue) {
    catalogue = this.setCatalogue(catalogue);
    this.setState({ open: true, catalogue });
    return new Promise(resolve => {
      this._resolve = resolve;
    });
  }

  setCatalogue(catalogue) {
    var listSize, itemGroups, columnKey;
    catalogue = catalogue.filter(item => CARDS[item.type]).map(item => {
      return {
        ...item,
        metadata: {
          title: CARDS[item.type].title,
          description: CARDS[item.type].description
        }
      };
    });
    listSize = Math.ceil(catalogue.length / 2);
    itemGroups = [[], []];
    columnKey = 0;
    catalogue.forEach((item, i) => {
      if (i >= listSize && columnKey !== 1) {
        columnKey = 1;
      }
      return itemGroups[columnKey].push(item);
    });
    return itemGroups;
  }

  handleUpdateDashboard = e => {
    var { catalogue } = this.state;
    e.preventDefault();
    this.setState({ open: false });
    this._resolve(_.flatten(catalogue));
  };

  handleRequestClose = e => {
    e.preventDefault();
    this.setState({ open: false });
  };

  handleChange = (e, item) => {
    var i, j, _i, _j, _len1, _len2;
    var { catalogue } = this.state;
    for (i = _i = 0, _len1 = catalogue.length; _i < _len1; i = ++_i) {
      for (j = _j = 0, _len2 = catalogue[i].length; _j < _len2; j = ++_j) {
        if (catalogue[i][j].type === item.type) {
          catalogue[i][j].enabled = e.target.checked;
          this.setState({ catalogue });
          return;
        }
      }
    }
  };

  render() {
    const { catalogue } = this.state;
    return (
      <RBDialog
        size="large"
        open={this.state.open}
        onRequestClose={this.handleRequestClose}
      >
        <RBDialogHeader>
          <RBHeader category="dialog">Show More Retail Metrics</RBHeader>
          <p className="vd-text-body vd-mtm">
            Choose the information you want to see on your Home dashboard.
          </p>
        </RBDialogHeader>
        <RBDialogContent>
          <div className="ds-card-catalogue vd-g-row vd-g-s-up-2 vd-g-xs-up-1">
            {catalogue.map((col, i) => (
              <div key={i} className="vd-g-col">
                {col.map((item, j) => (
                  <div key={j} className="vd-mbl vd-mrl">
                    <RBCheckbox
                      label={item.metadata.title}
                      description={item.metadata.description}
                      checked={item.enabled}
                      onChange={e => this.handleChange(e, item)}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </RBDialogContent>
        <RBDialogActions>
          <RBButtonGroup>
            <RBButton category="secondary" onClick={this.handleRequestClose}>
              Cancel
            </RBButton>
            <RBButton category="primary" onClick={this.handleUpdateDashboard}>
              Update Dashboard
            </RBButton>
          </RBButtonGroup>
        </RBDialogActions>
      </RBDialog>
    );
  }
}

export default RetailMetrics;
