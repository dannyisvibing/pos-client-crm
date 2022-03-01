import React, { Component } from 'react';
import _ from 'lodash';
import Dialog, { DialogContent } from '../../common/legacy/Dialog';
import { A } from '../../common/legacy/Basic';
import ModalTypes from '../../../constants/modalTypes';
import '../styles/SelectVariantToSale.css';

const Variant = ({ value, ...props }) => (
  <button className="wr-card wr-card--clamp" {...props}>
    <div className="wr-card-content">
      <h3 className="wr-card-value">{value}</h3>
    </div>
  </button>
);

class SelectVariantToSale extends Component {
  state = {
    variantAttrs: [],
    currDeepAttrValues: []
  };
  componentWillReceiveProps(nextProps) {
    if (!this.props.isOpen && nextProps.isOpen) {
      const { productId } = nextProps;
      this.handleVariantSelect(productId);
    }
  }

  handleVariantSelect(productId, deep, value) {
    var {
      products,
      productsHash,
      variantAttrsHash,
      closeModal,
      confirmHandler
    } = this.props;
    var selectedProduct = productsHash[productId];
    var selectedProductVariants = products.filter(
      product => product.productHandle === selectedProduct.productHandle
    );
    if (typeof deep === 'undefined') {
      let variantAttrs = [];
      if (selectedProduct.variantAttr1)
        variantAttrs.push(selectedProduct.variantAttr1);
      if (selectedProduct.variantAttr2)
        variantAttrs.push(selectedProduct.variantAttr2);
      if (selectedProduct.variantAttr3)
        variantAttrs.push(selectedProduct.variantAttr3);
      variantAttrs = variantAttrs.map(variantAttrId => ({
        attrName: variantAttrsHash[variantAttrId].value,
        attrId: variantAttrId,
        attrValue: undefined
      }));

      this.setState({
        productName: selectedProduct.name,
        variantAttrs: variantAttrs,
        currDeep: 0,
        currDeepAttrValues: _.uniq(
          selectedProductVariants.map(product => product.variantValue1)
        )
      });
    } else if (deep === this.state.variantAttrs.length - 1) {
      const { variantAttrs = [] } = this.state;
      // Variant selection is finished
      variantAttrs[deep].attrValue = value;
      selectedProduct = selectedProductVariants.filter(product => {
        var cond1 = variantAttrs[0]
          ? product.variantValue1 === variantAttrs[0].attrValue
          : true;
        var cond2 = variantAttrs[1]
          ? product.variantValue2 === variantAttrs[1].attrValue
          : true;
        var cond3 = variantAttrs[2]
          ? product.variantValue3 === variantAttrs[2].attrValue
          : true;

        return cond1 && cond2 && cond3;
      })[0];

      if (selectedProduct) {
        closeModal(ModalTypes.SELECT_VARIANT);
        confirmHandler(selectedProduct.id);
      } else {
        closeModal(ModalTypes.SELECT_VARIANT);
      }
    } else {
      const { variantAttrs = [] } = this.state;
      // A variant value is selected unless value is not undefined so move to next deep of variant attribute
      // A deep is selected if value is undefined
      var nextDeep = deep + (typeof value === 'undefined' ? 0 : 1);
      variantAttrs[deep].attrValue = value;
      this.setState({
        variantAttrs: variantAttrs,
        currDeep: nextDeep,
        currDeepAttrValues: _.uniq(
          selectedProductVariants.map(product => {
            if (nextDeep === 0) return product.variantValue1;
            if (nextDeep === 1) return product.variantValue2;
            if (nextDeep === 2) return product.variantValue3;
            return null;
          })
        )
      });
    }
  }

  handleVariantDeepSelect(deep) {
    const { productId } = this.props;
    var { variantAttrs } = this.state;
    variantAttrs.forEach((attr, index) => {
      if (index >= deep) attr.attrValue = undefined;
    });

    this.handleVariantSelect(productId, deep);
  }

  handleClose = () => {
    this.props.closeModal(ModalTypes.SELECT_VARIANT);
  };

  render() {
    const { isOpen, productId } = this.props;
    const {
      productName,
      variantAttrs,
      currDeepAttrValues,
      currDeep
    } = this.state;

    return (
      <Dialog large open={isOpen} onRequestClose={this.handleClose}>
        <DialogContent>
          <div className="vd-text-sub-heading">{productName}</div>
          <ul className="select-variant-categories vd-mbl vd-mts vd-pln">
            {variantAttrs.map((attr, i) => (
              <li key={i} className="select-variant-categories-item">
                {attr.attrValue ? (
                  <A
                    secondary
                    title={`${attr.attrName}: ${attr.attrValue}`}
                    onClick={() => this.handleVariantDeepSelect(i)}
                  />
                ) : (
                  <span>Select {attr.attrName}</span>
                )}
              </li>
            ))}
          </ul>
          <div className="wr-cards">
            {currDeepAttrValues.map((value, i) => (
              <Variant
                key={i}
                value={value}
                onClick={() =>
                  this.handleVariantSelect(productId, currDeep, value)
                }
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

export default SelectVariantToSale;
