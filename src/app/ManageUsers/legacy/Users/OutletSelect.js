import React, { Component } from 'react';
import { connect } from 'react-redux';
import difference from 'lodash/difference';
import map from 'lodash/map';
import filter from 'lodash/filter';
import { RBField, RBSelect, RBButton } from '../../../../rombostrap';
import { RBValue } from '../../../../rombostrap/components/RBField';
import { activeUserSelector } from '../../../../modules/user';

class OutletSelect extends Component {
  state = {
    restrictedOutletIds: []
  };

  componentWillMount() {
    const { restrictedOutletIds = [] } = this.props.user;
    this.setState({
      restrictedOutletIds: this._filterEditableOutletIds(restrictedOutletIds)
    });
  }

  /**
   * Determine the outlet ids that are currently not assigned to the user.
   *
   * @private
   * @method unassignedOutlets
   *
   * @return {Array} Outlet ids that are not assigned to the user.
   */
  unassignedOutlets() {
    return difference(
      map(this.props.outlets, 'outletId'),
      this.state.restrictedOutletIds
    );
  }

  /**
   * Filters outlet ids that can be managed by the active user.
   *
   * @private
   * @method _filterEditableOutletIds
   *
   * @param  {Array} outletIds
   *         An array of outlet ids to be filtered.
   *
   * @return {Array} Outlet ids that the active user has access to.
   */
  _filterEditableOutletIds(outletIds) {
    const restrictedOutletIds = this.props.activeUser.restrictedOutletIds;

    // If the active user has no outlet restrictions, return early
    if (!restrictedOutletIds.length) {
      return outletIds;
    }

    return filter(
      outletIds,
      outletId => restrictedOutletIds.indexOf(outletId) > -1
    );
  }

  /**
   * Determine whether another outlet 'select' can be added. We should only
   * allow the same number of selects as there are outlets.
   *
   * @method canAddOutletOption
   *
   * @return {Boolean} True if an outlet option can be added.
   */
  canAddOutletOption() {
    const totalOutlets = map(this.props.outlets, 'outletId').length;
    const selectedOutlets = this.state.restrictedOutletIds.length;
    return selectedOutlets && totalOutlets > selectedOutlets;
  }

  /**
   * Adds another outlet option and selects the first unassigned outlet by
   * default.
   *
   * @method addOutletOption
   */
  addOutletOption = e => {
    e.preventDefault();
    if (this.canAddOutletOption()) {
      var restrictedOutletIds = this.state.restrictedOutletIds;
      restrictedOutletIds.push(this.unassignedOutlets()[0]);
      this.props.onOutletIdsSelected(restrictedOutletIds);
      this.setState({ restrictedOutletIds });
    }
  };

  /**
   * Checks whether the user has a given permission.
   * Fallback in the role if the user hasn't got permissions
   *
   * @method removeOutlet
   *
   * @param {String} outletId
   *        The id of the outlet to remove.
   */
  removeOutlet = (e, index) => {
    e.preventDefault();
    var restrictedOutletIds = this.state.restrictedOutletIds;
    restrictedOutletIds.splice(index, 1);
    this.props.onOutletIdsSelected(restrictedOutletIds);
    this.setState({ restrictedOutletIds });
  };

  /**
   * When the outlet select has changed, checks if it has changed to
   * 'All Outlets', if so, clears the `restricted_outlet_ids`
   *
   * @method outletChanged
   *
   * @param {String} outletId
   *        The selected outletId.
   */
  outletChanged = (index, outletId) => {
    if (!outletId) {
      this.props.onOutletIdsSelected([]);
      this.setState({ restrictedOutletIds: [] });
    } else {
      var restrictedOutletIds = this.state.restrictedOutletIds;
      restrictedOutletIds[index] = outletId;
      this.props.onOutletIdsSelected(restrictedOutletIds);
      this.setState({ restrictedOutletIds });
    }
  };

  render() {
    const { restrictedOutletIds } = this.state;
    return (
      <div>
        {restrictedOutletIds.length > 1 &&
          restrictedOutletIds.map((outletId, i) => (
            <RBField key={i} short flex classes="vd-mbm vd-mrn">
              <RBValue flex>
                <RBSelect
                  entities={this.props.outlets}
                  entityKey="outletName"
                  entityValue="outletId"
                  selectedEntity={restrictedOutletIds[i]}
                  onChange={outlet =>
                    this.outletChanged(i, (outlet || {}).outletId)
                  }
                  nullLabel="All Outlets"
                />
                <RBButton
                  category="negative"
                  modifiers={['icon']}
                  onClick={e => this.removeOutlet(e, i)}
                >
                  <i className="fa fa-trash" />
                </RBButton>
              </RBValue>
            </RBField>
          ))}
        {restrictedOutletIds.length <= 1 && (
          <RBField short flex classes="vd-mbm vd-mrn">
            <RBValue flex>
              <RBSelect
                entities={this.props.outlets}
                entityKey="outletName"
                entityValue="outletId"
                selectedEntity={restrictedOutletIds[0]}
                onChange={outlet =>
                  this.outletChanged(0, (outlet || {}).outletId)
                }
                nullLabel="All Outlets"
              />
            </RBValue>
          </RBField>
        )}
        {!!this.canAddOutletOption() && (
          <a
            href=""
            className="vd-text--success vd-mtm"
            onClick={this.addOutletOption}
          >
            <i className="fa fa-plus-circle vd-mrs" />Add new outlet
          </a>
        )}
      </div>
    );
  }
}

export default connect(state => ({
  activeUser: activeUserSelector(state)
}))(OutletSelect);
