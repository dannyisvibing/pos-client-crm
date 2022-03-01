import React, { Component } from 'react';
import _ from 'lodash';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import STORES from '../../../../modules/idb/stores';
import Product from '../../../../modules/idb/model/product';
import storeManager from '../../../../modules/idb/managers/store-manager';
import { RBFlex, RBButton, RBForm } from '../../../../rombostrap';
import RBField, {
  RBLabel,
  RBValue
} from '../../../../rombostrap/components/RBField';
import RBInput from '../../../../rombostrap/components/RBInputV1';

class PerformAutocomplete extends Component {
  state = {
    quantity: 1,
    isLoading: false,
    options: [],
    formState: {}
  };

  componentWillMount() {
    const { stocktake = {} } = this.props;
    this.productsStore = storeManager.getStore(STORES.products);
    this.productsStore.getAll().then(products => {
      _.remove(products, product => product.deletedAt);
      _.remove(
        products,
        product => (stocktake.showInactive ? false : !product.active)
      );
      products = this.enhanceProductResult(products);
      products = _.map(products, product => product.toJson());

      var filterBy = ['sku'];

      _.forEach(products, product => {
        product.name = product.name || '';
        product.sku = product.sku || 0;
      });

      this.setState({ options: products, filterBy });
    });
  }

  countProduct(product) {
    if (product) {
      this.props.onAddItem(product, this.state.quantity);
      this.setState({ quantity: 1 });
      this.typeaheadRef.getInstance().focus();
    }
  }

  selectProduct(product) {
    if (!product || !product.name) return;
    this.setState({ selected: [product.name] });
    this.lastSelectedProduct = product;
    this.qtyRef.setFocus();
  }

  enhanceProductResult(products) {
    return _.map(products, product => {
      product.name = product.getName();
      return product;
    });
  }

  handleSearch = query => {};

  handleFocus = () => {
    this.setState({ selected: [] });
  };

  handleFilterUpdate = filters => {
    if (filters.length > 0) {
      this.typeaheadRef.getInstance().clear();
      this.selectProduct(new Product(filters[0]));
    }
  };

  handleQtyChange = value => {
    this.setState({ quantity: value });
  };

  handleAddItem = e => {
    e.preventDefault();
    this.countProduct(this.lastSelectedProduct);
  };

  handleFormStateChange = formState => {
    this.setState({ formState });
  };

  handleFormElementStateChange = (name, state) => {
    if (!this.formRef) {
      setTimeout(() => {
        this.handleFormElementStateChange(name, state);
      }, 0);
    } else {
      this.formRef.onStateChanged(name, state);
    }
  };

  render() {
    const { quantity } = this.state;
    return (
      <RBForm
        ref={c => (this.formRef = c)}
        onFormStateChanged={this.handleFormStateChange}
      >
        <RBFlex flex>
          <RBField classes="vd-mrm autocomplete--with-name">
            <RBLabel>Search Products</RBLabel>
            <RBValue>
              <div className="autocomplete-container">
                <AsyncTypeahead
                  ref={c => (this.typeaheadRef = c)}
                  {...this.state}
                  labelKey="name"
                  minLength={1}
                  onFocus={this.handleFocus}
                  onSearch={this.handleSearch}
                  placeholder="Type to search for products"
                  renderMenuItemChildren={option => (
                    <div key={option.id}>{option.name}</div>
                  )}
                  onChange={this.handleFilterUpdate}
                />
              </div>
            </RBValue>
          </RBField>
          <RBField>
            <RBLabel>Quantity</RBLabel>
            <RBValue>
              <RBInput
                ref={c => (this.qtyRef = c)}
                rbNumberEnabled
                rbNumberOptions={{ decimalPlaces: 0, stripNonNumeric: true }}
                value={quantity}
                onInputChange={this.handleQtyChange}
                onStateChange={state =>
                  this.handleFormElementStateChange('quantity', state)
                }
              />
            </RBValue>
          </RBField>
          <RBField>
            <RBLabel>&nbsp;</RBLabel>
            <RBValue>
              <RBButton
                category="primary"
                onClick={this.handleAddItem}
                disabled={this.state.formState.invalid}
              >
                Count
              </RBButton>
            </RBValue>
          </RBField>
        </RBFlex>
      </RBForm>
    );
  }
}

export default PerformAutocomplete;
