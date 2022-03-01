import React, { Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import PRODUCTS_FILTERS from '../../../../constants/stocktake/product-filters';

class Autocomplete extends Component {
  state = {
    isLoading: false,
    options: []
  };

  componentWillMount() {
    var filterBy = [];
    this.optionsSrc = [];
    const { typeaheadEntities, collection } = this.props;
    _.forEach(typeaheadEntities, entity => {
      var data = collection[entity.type];

      if (entity.searchFields) {
        filterBy = filterBy.concat(entity.searchFields);
      }

      _.remove(data, filter => filter.deletedAt);

      if (entity.type === PRODUCTS_FILTERS.products.key) {
        data = this.enhanceProductResult(data);
      }

      data = _.map(data, option => option.toJson());
      data = _.map(data, option => {
        option.title = entity.title;
        option.type = entity.type;
        return option;
      });
      this.optionsSrc = this.optionsSrc.concat(data);
    });

    _.forEach(this.optionsSrc, option => {
      option.name = option.name || '';
      _.forEach(filterBy, filter => (option[filter] = option[filter] || ''));
    });
    this.setState({ options: this.optionsSrc, filterBy });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.includeInactive !== nextProps.includeInactive) {
      var options = [];
      options = _.filter(this.optionsSrc, suggestion => {
        return !!suggestion.sku
          ? nextProps.includeInactive
            ? true
            : suggestion.active
          : true;
      });
      this.setState({ options });
    }
  }

  enhanceProductResult(products) {
    return _.map(products, product => {
      product.name = product.getName();
      return product;
    });
  }

  handleSearch = query => {};

  handleFilterUpdate = filters => {
    if (filters.length > 0) {
      this.typeaheadRef.getInstance().clear();
      this.props.onSelectFilter(filters[0]);
    }
  };

  render() {
    const { classes, disabled } = this.props;
    return (
      <div className={classnames('autocomplete-container', classes)}>
        <AsyncTypeahead
          ref={c => (this.typeaheadRef = c)}
          {...this.state}
          disabled={disabled}
          labelKey="name"
          minLength={1}
          onSearch={this.handleSearch}
          placeholder="Search for suppliers, brands, types, tags or SKUs"
          renderMenuItemChildren={(option, props) => (
            <div key={option.id}>
              <span className="option-category">{option.title}:</span>{' '}
              {option.name}
            </div>
          )}
          onChange={this.handleFilterUpdate}
        />
      </div>
    );
  }
}

export default Autocomplete;
