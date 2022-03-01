import React, { Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import { AsyncTypeahead, Token } from 'react-bootstrap-typeahead';
import rbReportingResource from '../../../modules/reporting/reporting.resource';

class ReportFilter extends Component {
  state = {
    multiple: true,
    isLoading: false,
    options: [],
    placeholder: '',
    tagsEmpty: true,
    filterLookup: {},
    selected: []
  };

  componentWillMount() {
    this.setPlaceholderText();
    var filterLookup = {};
    var _ref, _i, _len, type;
    _ref = this.props.filterTypes;
    if (!_ref) return;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      type = _ref[_i];
      filterLookup[type.key] = type;
    }
    this.setState({
      filterLookup,
      selected: this.props.selectedFilters || []
    });
  }

  setPlaceholderText() {
    var a, orVal, placeholder, types;
    const { tagsEmpty } = this.state;
    const { filterTypes } = this.props;
    if (!tagsEmpty) return;

    types = _.map(_.map(filterTypes, 'name'), function(v) {
      return v.toLowerCase();
    });
    a = 'aeiou'.indexOf(types[0][0]) > -1 ? 'an' : 'a';
    if (types.length === 1) {
      placeholder =
        'Start typing ' + a + ' ' + types[0] + ' to filter your report';
    } else if (types.length === 2) {
      orVal = types.pop();
      placeholder =
        'Start typing ' +
        a +
        ' ' +
        types.join(', ') +
        ' or ' +
        orVal +
        ' to filter your report';
    } else {
      placeholder =
        'Start typing ' +
        a +
        ' ' +
        types.slice(0, 3).join(', ') +
        ' or other keyword to filter your report';
    }
    this.setState({ placeholder });
  }

  handleSearch = query => {
    this.setState({ isLoading: true });
    const { filterTypes } = this.props;
    var type = _.map(filterTypes, 'key').join(',');
    var params = { query, type };
    rbReportingResource.entities(params).then(options => {
      this.setState({
        options,
        isLoading: false
      });
    });
  };

  handleFilterUpdate = filters => {
    this.setState({ tagsEmpty: !filters.length }, () => {
      this.setPlaceholderText();
    });
    var tags = filters.map(filter => ({
      id: filter.id,
      name: filter.name,
      typeName: this.state.filterLookup[filter.type].name,
      type: filter.type
    }));
    this.setState({ selected: filters });
    this.props.onFilterUpdate(tags);
  };

  render() {
    const { classes } = this.props;
    const { placeholder, filterLookup } = this.state;
    return (
      <div className={classnames('tag-container', classes)}>
        <AsyncTypeahead
          {...this.state}
          labelKey="name"
          minLength={1}
          onSearch={this.handleSearch}
          placeholder={placeholder}
          renderToken={(token, onRemove) => (
            <Token key={token.id} onRemove={onRemove}>
              {`${filterLookup[token.type].name}: ${token.name}`}
            </Token>
          )}
          renderMenuItemChildren={(option, props) => (
            <div key={option.id}>
              {option.name} &nbsp;&nbsp;<span className="suggested-filter-typename">
                {filterLookup[option.type].name}
              </span>
            </div>
          )}
          onChange={this.handleFilterUpdate}
        />
      </div>
    );
  }
}

export default ReportFilter;
