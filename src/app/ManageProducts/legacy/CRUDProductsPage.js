import React, { Component } from 'react';
import _ from 'lodash';
import update from 'react-addons-update';
import {
  ClassicInput,
  ClassicCheckbox,
  ClassicAddTag,
  ClassicSelect,
  Button
} from '../../common/legacy/Basic';
import ImageButtonSegControl from './ImageButtonSegControl';
import { RBInputErrorMessageSection } from '../../../rombostrap/components/RBInput';
import {
  Content,
  Heading,
  Section,
  DetailsLeft,
  DetailsRight,
  PricingContent,
  PricingComponent,
  PricingShowDetail
} from './Layout';
import StandardInventory from './StandardInventory';
import CompositeInventory from './CompositeInventory';
import ProductTaxTableByOutlet from './TaxTable';
import ProductVariantAttrControl from './VariantAttrControl';
import ProductInventoryControl from './InventoryControl';

import NewProductTypeDialog from './NewProductType';
import NewProductSupplierDialog from './NewProductSupplier';
import NewProductBrandDialog from './NewProductBrand';
import NewProductVariantAttr from './NewProductVariantAttr';
import NewSalesTaxDialog from './NewSalesTaxV1';
import {
  ProductTypeInInventory,
  ProductLiteralType,
  ProductBrand,
  ProductSupplier,
  VariantAttributeName,
  ProductTaxByOutlet
} from './uiConfig';
import { RBForm } from '../../../rombostrap';

import { PRODUCT_OUTLET_DEFAULT_TAX_VALUE } from './uiConfig';
import '../styles/LegacyCRUDProducts.css';

class CRUDProducts extends Component {
  state = {
    action: '',
    productId: '',
    showFull: true,
    showPricingTableByOutlet: false,
    tagValue: '',
    name: '',
    active: true,
    handle: '',
    description: '',
    image: null,
    pendingImage: null,
    tags: [],
    literalTypeId: '',
    supplierId: '',
    brandId: '',
    salesAccountCode: '',
    supplierCode: '',
    purchaseAccountCode: '',
    inventoryType: ProductTypeInInventory[0].id,
    primarySupplyPrice: 0.0,
    primaryMarkup: 0.0,
    primaryRetailPrice: 0.0,
    primarySKU: 10001,
    primaryTaxByOutlet: [],
    primaryVariantAttrs: [],
    primaryTrackingInventory: [],
    hasVariant: false,
    hasInventory: true,
    productInventory: {
      variantAttrs: [],
      variantItems: []
    },
    formState: {}
  };

  componentWillMount() {
    const { params } = this.props;

    this.setState(
      {
        action: params.create
          ? 'create'
          : params.addVariant
            ? 'add_variant'
            : 'edit',
        productId: params.productId || ''
      },
      () => {
        params.create ? this.initProductForm() : this.fillOutProductForm();
      }
    );
  }

  initProductForm() {
    const { outlets, salestaxHash, storeSetting } = this.props;
    var dataForTaxTableByOutlet = [];
    var dataForPrimaryTrackingInventory = [];
    outlets.forEach(outlet => {
      var rate = 0;

      if (outlet.defaultSaletax) {
        rate = (salestaxHash[outlet.defaultSaletax] || {}).rate || 0;
      }

      dataForTaxTableByOutlet.push({
        outletId: outlet.outletId,
        outletName: outlet.outletName,
        saleTaxId: ProductTaxByOutlet[0].value,
        rate: rate
      });

      dataForPrimaryTrackingInventory.push({
        outletId: outlet.outletId,
        outletName: outlet.outletName,
        currentInventoryCount: 0,
        reorderPointCount: 0,
        reorderAmountCount: 0
      });
    });
    this.setState({
      literalTypeId: ProductLiteralType[0].value,
      supplierId: ProductSupplier[0].value,
      brandId: ProductBrand[0].value,
      primaryTaxByOutlet: dataForTaxTableByOutlet,
      primaryTrackingInventory: dataForPrimaryTrackingInventory,
      primarySKU: storeSetting.currentSeqNumber
    });
  }

  fillOutProductForm() {
    const {
      tagsHash,
      outlets,
      outletsHash,
      salestaxHash,
      productsHash
    } = this.props;
    var product = productsHash[this.state.productId];
    if (product) {
      var hasVariant =
        product.variantAttr1 || product.variantAttr2 || product.variantAttr3;
      var variantAttrs = [];
      if (hasVariant) {
        if (product.variantAttr1)
          variantAttrs.push({
            attrId: product.variantAttr1,
            value: product.variantValue1
          });
        if (product.variantAttr2)
          variantAttrs.push({
            attrId: product.variantAttr2,
            value: product.variantValue2
          });
        if (product.variantAttr3)
          variantAttrs.push({
            attrId: product.variantAttr3,
            value: product.variantValue3
          });
      }

      const taxHash = product.tax.reduce((memo, item) => {
        memo[item.outletId] = item;
        return memo;
      }, {});

      const trackingInventoryHash = product.trackingInventory.reduce(
        (memo, item) => {
          memo[item.outletId] = item;
          return memo;
        },
        {}
      );

      this.setState({
        id: product.id,
        showFull: product.primaryItem !== 0 && this.state.action === 'edit',
        name: product.name,
        active: product.active,
        handle: product.handle,
        productHandle: product.productHandle,
        description: product.description,
        tags: tagsHash[product.id] || [],
        literalTypeId: product.literalTypeId,
        supplierId: product.supplierId,
        brandId: product.brandId,
        supplierCode: product.supplierCode,
        salesAccountCode: product.salesAccountCode,
        purchaseAccountCode: product.purchaseAccountCode,
        primarySupplyPrice: product.supplyPrice,
        primaryMarkup: product.markup,
        primaryRetailPrice: product.retailPrice,
        primarySKU: product.sku,
        primaryTaxByOutlet: outlets.map(outlet => {
          var taxByOutlet = taxHash[outlet.outletId] || {};
          var rate = 0;
          var taxId =
            taxByOutlet.salestaxId || PRODUCT_OUTLET_DEFAULT_TAX_VALUE;
          if (!taxId) {
            rate = 0;
          } else if (taxId === PRODUCT_OUTLET_DEFAULT_TAX_VALUE) {
            taxId = outletsHash[outlet.outletId].defaultSaletax || '';
            if (taxId) {
              rate = salestaxHash[taxId].rate;
            }
          } else {
            rate = salestaxHash[taxId].rate;
          }

          return {
            outletId: outlet.outletId,
            outletName: outletsHash[outlet.outletId].outletName,
            saleTaxId: taxId,
            rate: rate
          };
        }),
        inventoryType:
          ProductTypeInInventory[product.isComposite === 0 ? 0 : 1].id,
        hasVariant: hasVariant,
        primaryVariantAttrs: variantAttrs,
        primaryTrackingInventory: outlets.map(outlet => {
          var tracking = trackingInventoryHash[outlet.outletId] || {};
          return {
            outletId: outlet.outletId,
            outletName: outletsHash[outlet.outletId].outletName,
            currentInventoryCount: tracking.currentInventoryCount || 0,
            reorderPointCount: tracking.reorderPointCount || 0,
            reorderAmountCount: tracking.reorderAmountCount || 0
          };
        })
      });
    }
  }

  // If taxValue is default to the default tax of the outlet, or
  // If taxValue points to the sales tax
  readSalesTaxRate(taxValue, outletId) {
    const { outletsHash, salestaxHash } = this.props;
    var rate = 0;

    // If selected tax is No Tax, then skip because rate is already set to 0
    if (taxValue !== 'product:tax:no-tax') {
      // If selected tax is Default Outlet Tax
      if (taxValue === PRODUCT_OUTLET_DEFAULT_TAX_VALUE) {
        var defaultTaxId = outletsHash[outletId].defaultSaletax;
        if (defaultTaxId) {
          rate = salestaxHash[defaultTaxId].rate || 0;
        }
      } else {
        rate = salestaxHash[taxValue].rate || 0;
      }
    }

    return rate;
  }

  adjustPricingBy(key, supplyPrice, markup, retailPrice) {
    if (key === 'supplyPrice') {
      return {
        supplyPrice: supplyPrice,
        markup: ((retailPrice - supplyPrice) / supplyPrice * 100).toFixed(2),
        retailPrice: retailPrice
      };
    } else if (key === 'markup') {
      return {
        supplyPrice: supplyPrice,
        markup: markup,
        retailPrice: (supplyPrice * (1 + markup / 100)).toFixed(2)
      };
    } else if (key === 'retailPrice') {
      return {
        supplyPrice: supplyPrice,
        markup: (retailPrice - supplyPrice) / supplyPrice * 100,
        retailPrice: retailPrice
      };
    }
  }

  handleToggleTypeInInventory = typeId => {
    this.formRef.onStateReset();
    this.setState({ inventoryType: typeId });
  };

  handleNameChange = e => {
    this.setState({
      name: e.target.value,
      handle: e.target.value.replace(/ /g, '')
    });
  };

  handleActiveChange = e => {
    this.setState({ active: !this.state.active });
  };

  handleProductHandleChange = e => {
    this.setState({ handle: e.target.value });
  };

  handleDescriptionChange = e => {
    this.setState({ description: e.target.value });
  };

  handleImageLoad = file => {
    this.setState({ pendingImage: file });

    // directUploadToS3(file)
    // .then(fileUrl => {
    //   console.log("fileUrl", fileUrl);
    // })
    // .catch(err => console.log("err", err));
  };

  /**
   * Actions handler for Product Tag
   */

  handleTagChange = e => this.setState({ tagValue: e.target.value });

  handleAddTag = async e => {
    var { tagValue, tags } = this.state;
    if (tagValue) {
      if (tags.indexOf(tagValue) === -1) {
        await this.props.createTag(tagValue);
        this.setState({
          tags: update(tags, { $push: [tagValue] }),
          tagValue: ''
        });
      }
    }
  };

  handleDeleteTag = tag => {
    var { tags } = this.state;
    var index = tags.indexOf(tag);
    this.setState({
      tags: update(tags, {
        $splice: [[index, 1]]
      })
    });
  };

  /**
   * Actions handler for Product Literal Type
   */

  handleLiteralTypeChange = e => {
    var literalType = _.find(ProductLiteralType, { value: e.target.value });
    if (!literalType || !literalType.ignore) {
      if (literalType && literalType.value === 'product:type:add:new') {
        this.newTypeModalRef.open().then(async data => {
          const result = await this.props.createType(data.name);
          this.setState({ literalTypeId: result.payload.data.id });
        });
      } else {
        this.setState({ literalTypeId: e.target.value });
      }
    }
  };

  /**
   * Actions handler for Product Supplier
   */

  handleSupplierChange = e => {
    var supplier = _.find(ProductSupplier, { value: e.target.value });
    if (!supplier || !supplier.ignore) {
      if (supplier && supplier.value === 'product:supplier:add:new') {
        this.newSupplierModalRef.open().then(async supplierInfo => {
          const result = await this.props.createSupplier(supplierInfo);
          this.setState({ supplierId: result.payload.data.id });
        });
      } else {
        this.setState({ supplierId: e.target.value });
      }
    }
  };

  /**
   * Actions handler for Product Brand
   */

  handleBrandChange = e => {
    var brand = _.find(ProductBrand, { value: e.target.value });
    if (!brand || !brand.ignore) {
      if (brand && brand.value === 'product:brand:add:new') {
        this.newBrandModalRef.open().then(async brandInfo => {
          const result = await this.props.createBrand(brandInfo);
          this.setState({ brandId: result.payload.data.id });
        });
      } else {
        this.setState({ brandId: e.target.value });
      }
    }
  };

  /**
   * Action handler for Product Sales Account Code
   */

  handleSalesAccountCodeChange = e => {
    this.setState({ salesAccountCode: e.target.value });
  };

  /**
   * Actions handler for Product Supplier Code
   */

  handleSupplierCodeChange = e => {
    this.setState({ supplierCode: e.target.value });
  };

  /**
   * Actions handler for Product Purchase Account Code
   */

  handlePurchaseAccountCodeChange = e => {
    this.setState({ purchaseAccountCode: e.target.value });
  };

  /**
   * Handler for Product variant attribute name. Used when editing
   */

  handlePrimaryVariantAttrNameChange = (index, attr) => {
    if (!attr.ignore) {
      if (attr.value === 'product:variant:attr:add') {
        this.setState({ tempIndex: index, openNewProductAttrDlg: true });
      } else {
        this.setState({
          primaryVariantAttrs: update(this.state.primaryVariantAttrs, {
            [index]: { attrId: { $set: attr.value } }
          })
        });
      }
    }
  };

  /**
   * Handle for Product variant value. Used when editing
   */

  handlePrimaryVariantValueChange = (index, value) => {
    this.setState({
      primaryVariantAttrs: update(this.state.primaryVariantAttrs, {
        [index]: { value: { $set: value } }
      })
    });
  };

  /**
   * Handler for Product variant attribute remove. Used when editing
   */

  handlePrimaryVariantAttrRemove = index => {
    this.setState({
      primaryVariantAttrs: update(this.state.primaryVariantAttrs, {
        $splice: [[index, 1]]
      })
    });
  };

  /** Toggle showing Pricing Table */

  handlePrimaryPricingTableOpen = e => {
    e.preventDefault();
    this.setState({
      showPricingTableByOutlet: !this.state.showPricingTableByOutlet
    });
  };

  /**
   * Product Pricing
   */

  handlePrimaryPricingElementChange = (key, value) => {
    this.setState({ [key]: value }, () => {
      const {
        primarySupplyPrice,
        primaryMarkup,
        primaryRetailPrice
      } = this.state;
      var adjustBy;
      if (key === 'primarySupplyPrice') {
        adjustBy = 'supplyPrice';
      } else if (key === 'primaryMarkup') {
        adjustBy = 'markup';
      } else if (key === 'primaryRetailPrice') {
        adjustBy = 'retailPrice';
      }

      const { supplyPrice, markup, retailPrice } = this.adjustPricingBy(
        adjustBy,
        primarySupplyPrice,
        primaryMarkup,
        primaryRetailPrice
      );
      this.setState({
        primarySupplyPrice: supplyPrice,
        primaryMarkup: markup,
        primaryRetailPrice: retailPrice
      });
    });
  };

  handlePrimaryTaxTableChange = (outletId, tax) => {
    if (tax.value === 'product:tax:add-tax') {
      this.setState({ openNewSalesTaxDlg: true });
    } else {
      // Find out which row of the table is effected from this change
      var index = this.state.primaryTaxByOutlet.findIndex(
        line => line.outletId === outletId
      );
      if (index !== -1) {
        this.setState({
          primaryTaxByOutlet: update(this.state.primaryTaxByOutlet, {
            [index]: {
              saleTaxId: { $set: tax.value },
              rate: { $set: this.readSalesTaxRate(tax.value, outletId) }
            }
          })
        });
      }
    }
  };

  // Handle "close request" of "new sales tax" dialog
  handleNewSalesTaxClose = e => {
    this.setState({ openNewSalesTaxDlg: false });
  };

  handleNewSalesTaxAdd = async taxInfo => {
    const { name, rate } = taxInfo;
    await this.props.createSalesTax({ name, rate });
    this.setState({ openNewSalesTaxDlg: false });
  };

  /**
   * Standard Inventory
   */

  handlePrimarySKUChange = sku => {
    this.setState({ primarySKU: sku });
  };

  handlePrimaryTrackingChange = (outletId, key, value) => {
    var index = this.state.primaryTrackingInventory.findIndex(
      line => line.outletId === outletId
    );
    this.setState({
      primaryTrackingInventory: update(this.state.primaryTrackingInventory, {
        [index]: {
          [key]: { $set: value }
        }
      })
    });
  };

  handleHasVariantsChange = e => {
    console.log('before reset');
    this.formRef.onStateReset();
    console.log('after reset');
    this.setState({ hasVariant: !this.state.hasVariant });
  };

  handleTrackingInventoryChange = e => {
    this.formRef.onStateReset();
    this.setState({ hasInventory: !this.state.hasInventory });
  };

  /**
   * Standard Inventory - handle actions for new variant change / add / remove
   */

  handleVariantAttrNameChange = (index, attr) => {
    if (!attr.ignore) {
      if (attr.value === 'product:variant:attr:add') {
        this.setState({ tempIndex: index, openNewProductAttrDlg: true });
      } else {
        this.setState(
          {
            productInventory: update(this.state.productInventory, {
              variantAttrs: {
                [index]: { attrId: { $set: attr.value } }
              }
            })
          },
          () => this.updateVariantItemsTable()
        );
      }
    }
  };

  handleVariantAttrAdd = () => {
    this.setState(
      {
        productInventory: update(this.state.productInventory, {
          variantAttrs: {
            $push: [
              {
                attrId: '',
                values: []
              }
            ]
          }
        })
      },
      () => this.updateVariantItemsTable()
    );
  };

  handleVariantAttrRemove = index => {
    this.setState(
      {
        productInventory: update(this.state.productInventory, {
          variantAttrs: {
            $splice: [[index, 1]]
          }
        })
      },
      () => this.updateVariantItemsTable()
    );
  };

  handleNewProductVariantAttrClose = e => {
    this.setState({ openNewProductAttrDlg: false });
  };

  handleNewVariantAttrNameAdd = async attrName => {
    const result = await this.props.createVariantAttribute(attrName);
    this.setState(
      {
        productInventory: update(this.state.productInventory, {
          variantAttrs: {
            [this.state.tempIndex]: {
              attrId: { $set: result.payload.data.attribute_id }
            }
          }
        })
      },
      () => () => this.updateVariantItemsTable()
    );
    this.setState({ openNewProductAttrDlg: false });
  };

  /**
   * Standard inventory - handle action for adding new attribute value
   */

  handleVariantValueAdd = (index, value) => {
    this.setState(
      {
        productInventory: update(this.state.productInventory, {
          variantAttrs: {
            [index]: {
              values: { $push: [value] }
            }
          }
        })
      },
      () => this.updateVariantItemsTable()
    );
  };

  /**
   * Standard inventory - handle action for removing new attribute value
   */

  handleVariantValueRemove = (index, value) => {
    var valueIndex = this.state.productInventory.variantAttrs[
      index
    ].values.indexOf(value);
    this.setState(
      {
        productInventory: update(this.state.productInventory, {
          variantAttrs: {
            [index]: {
              values: { $splice: [[valueIndex, 1]] }
            }
          }
        })
      },
      () => this.updateVariantItemsTable()
    );
  };

  handleVariantItemRemove = index => {
    this.setState({
      productInventory: update(this.state.productInventory, {
        variantItems: { $splice: [[index, 1]] }
      })
    });
  };

  handleVariantItemChange = (value, index, key) => {
    this.setState(
      {
        productInventory: update(this.state.productInventory, {
          variantItems: {
            [index]: {
              [key]: { $set: value }
            }
          }
        })
      },
      () => {
        if (
          key === 'supplyPrice' ||
          key === 'markup' ||
          key === 'retailPrice'
        ) {
          const {
            supplyPrice,
            markup,
            retailPrice
          } = this.state.productInventory.variantItems[index];
          var adjustedPricing = this.adjustPricingBy(
            key,
            supplyPrice,
            markup,
            retailPrice
          );
          this.setState({
            productInventory: update(this.state.productInventory, {
              variantItems: {
                [index]: {
                  supplyPrice: { $set: adjustedPricing.supplyPrice },
                  markup: { $set: adjustedPricing.markup },
                  retailPrice: { $set: adjustedPricing.retailPrice }
                }
              }
            })
          });
        }
      }
    );
  };

  handleVariantItemTrackingChange = (index, outletId, key, value) => {
    var changedIndex = this.state.productInventory.variantItems[
      index
    ].trackingInventory.findIndex(line => line.outletId === outletId);
    this.setState({
      productInventory: update(this.state.productInventory, {
        variantItems: {
          [index]: {
            trackingInventory: {
              [changedIndex]: {
                [key]: { $set: value }
              }
            }
          }
        }
      })
    });
  };

  handleVariantItemTaxChange = (index, outletId, tax) => {
    var changedIndex = this.state.productInventory.variantItems[
      index
    ].taxByOutlet.findIndex(line => line.outletId === outletId);

    this.setState({
      productInventory: update(this.state.productInventory, {
        variantItems: {
          [index]: {
            taxByOutlet: {
              [changedIndex]: {
                saleTaxId: { $set: tax.value },
                rate: { $set: this.readSalesTaxRate(tax.value, outletId) }
              }
            }
          }
        }
      })
    });
  };

  _updateVariantItemsTable(
    variantA,
    variantB,
    variantC,
    result = [],
    indexA = 0,
    indexB = 0,
    indexC = 0
  ) {
    var _length = variant =>
      !variant ? 0 : !variant.values ? 0 : variant.values.length;
    var _ithValue = (variant, i = 0) =>
      !variant ? undefined : !variant.values ? undefined : variant.values[i];
    var _attrId = variant => (!variant ? undefined : variant.attrId);

    if (indexA < _length(variantA)) {
      var attrIds = [_attrId(variantA)];
      var values = [_ithValue(variantA, indexA)];
      if (_attrId(variantB) !== undefined) attrIds.push(_attrId(variantB));
      if (_ithValue(variantB, indexB) !== undefined)
        values.push(_ithValue(variantB, indexB));
      if (_attrId(variantC) !== undefined) attrIds.push(_attrId(variantC));
      if (_ithValue(variantC, indexC)) values.push(_ithValue(variantC, indexC));

      result.push({ attrIds, values });
      this._updateVariantItemsTable(
        variantA,
        variantB,
        variantC,
        result,
        indexA + 1,
        indexB,
        indexC
      );
    } else if (indexB < _length(variantB) - 1) {
      this._updateVariantItemsTable(
        variantA,
        variantB,
        variantC,
        result,
        0,
        indexB + 1,
        indexC
      );
    } else if (indexC < _length(variantC) - 1) {
      this._updateVariantItemsTable(
        variantA,
        variantB,
        variantC,
        result,
        0,
        0,
        indexC + 1
      );
    }
  }

  updateVariantItemsTable() {
    const { variantAttrs } = this.state.productInventory;
    var variantItems = [];
    this._updateVariantItemsTable(
      variantAttrs[0],
      variantAttrs[1],
      variantAttrs[2],
      variantItems
    );

    const { outlets } = this.props;
    variantItems.forEach((variantItem, i) => {
      var trackingInventory = [];
      var taxByOutlet = [];
      outlets.forEach(outlet => {
        if (this.state.hasInventory) {
          trackingInventory.push({
            outletId: outlet.outletId,
            outletName: outlet.outletName,
            currentInventoryCount: 0,
            reorderPointCount: 0,
            reorderAmountCount: 0
          });
        }

        var rate = 0;

        if (outlet.defaultSaletax) {
          var tax = this.props.salestaxHash(outlet.defaultSaletax);
          if (tax) rate = tax.rate;
        }

        taxByOutlet.push({
          outletId: outlet.outletId,
          outletName: outlet.outletName,
          saleTaxId: ProductTaxByOutlet[0].value,
          rate
        });
      });

      variantItem.trackingInventory = trackingInventory;
      variantItem.taxByOutlet = taxByOutlet;
      variantItem.supplierCode = 0;
      variantItem.supplyPrice = this.state.primarySupplyPrice;
      variantItem.markup = this.state.primaryMarkup;
      variantItem.retailPrice = this.state.primaryRetailPrice;
    });

    this.setState({
      productInventory: update(this.state.productInventory, {
        variantItems: { $set: variantItems }
      })
    });
  }

  handleCancel = () => {
    this.props.routerGoBack();
  };

  handleProductSave = () => {
    var {
      id,
      name,
      active,
      handle,
      productHandle,
      tags,
      description,
      literalTypeId,
      brandId,
      supplierId,
      supplierCode,
      salesAccountCode,
      purchaseAccountCode,
      inventoryType,
      hasInventory,
      primarySKU,
      primarySupplyPrice,
      primaryMarkup,
      primaryRetailPrice,
      primaryTaxByOutlet,
      primaryVariantAttrs,
      primaryTrackingInventory
    } = this.state;

    if (!name) {
      this.setState({
        nameWarning: true
      });
      return;
    }

    var { productsHash } = this.props;
    var product = productsHash[id];

    var productUpdate = {
      id: id,
      name: name,
      active: active,
      handle: handle,
      description: description,
      tags: tags,
      literalTypeId: literalTypeId,
      brandId: brandId,
      supplierId: supplierId,
      supplierCode: supplierCode,
      salesAccountCode: salesAccountCode,
      purchaseAccountCode: purchaseAccountCode,
      isComposite: inventoryType !== 'product:type-inventory:standard',
      hasInventory: hasInventory,
      sku: primarySKU,
      supplyPrice: primarySupplyPrice,
      markup: primaryMarkup,
      retailPrice: primaryRetailPrice,
      taxByOutlet: primaryTaxByOutlet,
      trackingInventory: primaryTrackingInventory,
      attrIds: primaryVariantAttrs.map(variantAttr => variantAttr.attrId),
      values: primaryVariantAttrs.map(variantAttr => variantAttr.value)
    };

    if (this.state.action === 'edit') {
      const trackingInventoryHash = product.trackingInventory.reduce(
        (memo, item) => {
          memo[item.outletId] = item;
          return memo;
        },
        {}
      );

      var inventoryChanges = primaryTrackingInventory.reduce(
        (memo, tracking) => {
          var prevTracking = trackingInventoryHash[tracking.outletId] || {};
          memo[tracking.outletId] =
            tracking.currentInventoryCount -
            (prevTracking.currentInventoryCount || 0);
          return memo;
        },
        {}
      );

      productUpdate.inventoryChanges = inventoryChanges;
      console.log('ffffff', productUpdate);
      // rbProductResource.update(productUpdate)
      //   .then(() => {
      //     window.location = '/product';
      //   });
    } else {
      console.log('ffffff', productHandle, product);
      // this.props.startRequest();
      // rbProductResource.addVariant(productHandle, product)
      //   .then(() => {
      //     // this.props.doneRequest();
      //     window.location = '/product';
      //   })
      //   .catch(error => {
      //     // this.props.doneRequest();
      //   });
    }
  };

  handleProductAdd = async () => {
    const {
      name,
      active,
      handle,
      description,
      pendingImage,
      tags,
      literalTypeId,
      brandId,
      supplierId,
      supplierCode,
      salesAccountCode,
      purchaseAccountCode,
      inventoryType,
      hasVariant,
      hasInventory,
      primarySKU,
      primarySupplyPrice,
      primaryMarkup,
      primaryRetailPrice,
      primaryTaxByOutlet,
      primaryTrackingInventory,
      productInventory
    } = this.state;

    if (!name) {
      this.setState({
        nameWarning: true
      });
      return;
    }

    if (pendingImage) {
    }

    var products = [];
    if (!hasVariant) {
      products.push({
        name: name,
        active: active,
        handle: handle,
        description: description,
        tags: tags,
        literalTypeId: literalTypeId,
        brandId: brandId,
        supplierId: supplierId,
        supplierCode: supplierCode,
        salesAccountCode: salesAccountCode,
        purchaseAccountCode: purchaseAccountCode,
        isComposite: inventoryType !== 'product:type-inventory:standard',
        hasInventory: hasInventory,
        sku: primarySKU,
        supplyPrice: primarySupplyPrice,
        markup: primaryMarkup,
        retailPrice: primaryRetailPrice,
        taxByOutlet: primaryTaxByOutlet,
        trackingInventory: primaryTrackingInventory
      });
    } else {
      var common = {
        name: name,
        active: active,
        handle: handle,
        description: description,
        tags: tags,
        literalTypeId: literalTypeId,
        brandId: brandId,
        supplierId: supplierId,
        supplierCode: supplierCode,
        salesAccountCode: salesAccountCode,
        purchaseAccountCode: purchaseAccountCode,
        isComposite: inventoryType !== 'product:type-inventory:standard',
        hasInventory: hasInventory
      };

      productInventory.variantItems.map((variantItem, i) =>
        products.push({
          ...common,
          ...variantItem,
          primary: i === 0
        })
      );
    }

    await this.props.createProduct(products);
    this.props.routerReplace('/product');
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

  handleFormStateChange = formState => {
    this.setState({ formState });
  };

  render() {
    const {
      inventoryType,
      name,
      active,
      handle,
      action,
      nameWarning,
      formState
    } = this.state;

    var literalTypeOptions = [...ProductLiteralType];
    this.props.literalTypes.map(type =>
      literalTypeOptions.push({ label: type.name, value: type.id })
    );

    var brandOptions = [...ProductBrand];
    this.props.brands.map(brand =>
      brandOptions.push({ label: brand.name, value: brand.id })
    );

    var supplierOptions = [...ProductSupplier];
    this.props.suppliers.map(supplier =>
      supplierOptions.push({ label: supplier.name, value: supplier.id })
    );

    var variantAttrNameOptions = [...VariantAttributeName];
    this.props.variantAttrNames.map(attrName =>
      variantAttrNameOptions.push({
        label: attrName.value,
        value: attrName.attributeId
      })
    );

    var taxOptions = [...ProductTaxByOutlet];
    this.props.salestax.map(tax =>
      taxOptions.push({ label: tax.name, value: tax.id })
    );
    taxOptions.push({ label: '+ Add sales tax', value: 'product:tax:add-tax' });
    return this.state.action !== 'view' ? (
      <Content>
        <Heading
          title={
            this.state.action === 'create'
              ? 'Add Product'
              : this.state.action === 'add_variant'
                ? `Add variant to ${this.state.name}`
                : `Edit Product - ${this.state.name}`
          }
        />
        {this.state.showFull && (
          <Section label="Details" classes="line">
            <DetailsLeft>
              <ClassicInput
                label="Product Name"
                classes="vd-man"
                value={name}
                onChange={this.handleNameChange}
              />
              {nameWarning && (
                <RBInputErrorMessageSection>
                  You must have a product name. This is unique identifier for
                  this product
                </RBInputErrorMessageSection>
              )}
              <ClassicCheckbox
                label="This product can be sold"
                checked={active}
                onChange={this.handleActiveChange}
                classes="contains-checkbox"
                labelClasses="snug"
              />
              <ClassicInput
                label="Product handle"
                value={handle}
                onChange={this.handleProductHandleChange}
              />
              <ClassicInput
                label="Description"
                classes="vd-man"
                value={this.state.description}
                onChange={this.handleDescriptionChange}
              />
              <ClassicAddTag
                label="Product Tags"
                tags={this.state.tags}
                value={this.state.tagValue}
                onChange={this.handleTagChange}
                onAdd={this.handleAddTag}
                onDelete={this.handleDeleteTag}
              />

              <hr className="vd-mtm hr" />
              <div className="vd-flex">
                <div>
                  <ClassicSelect
                    label="Product Type"
                    options={literalTypeOptions}
                    value={this.state.literalTypeId}
                    onChange={this.handleLiteralTypeChange}
                  />
                  <ClassicSelect
                    label="Supplier"
                    options={supplierOptions}
                    value={this.state.supplierId}
                    onChange={this.handleSupplierChange}
                  />
                  <ClassicInput
                    label="Sales account code"
                    value={this.state.salesAccountCode}
                    onChange={this.handleSalesAccountCodeChange}
                  />
                </div>
                <div>
                  <ClassicSelect
                    label="Product brand"
                    options={brandOptions}
                    value={this.state.brandId}
                    onChange={this.handleBrandChange}
                  />
                  <ClassicInput
                    label="Supplier code"
                    value={this.state.supplierCode}
                    onChange={this.handleSupplierCodeChange}
                  />
                  <ClassicInput
                    label="Purchase account code"
                    value={this.state.purchaseAccountCode}
                    onChange={this.handlePurchaseAccountCodeChange}
                  />
                </div>
              </div>
            </DetailsLeft>
            <DetailsRight>
              <label>Image</label>
              {/* <Dropzone
                onLoad={this.handleImageLoad}/> */}
            </DetailsRight>
          </Section>
        )}
        <RBForm
          ref={c => (this.formRef = c)}
          onFormStateChanged={this.handleFormStateChange}
        >
          <Section label="Pricing" classes="padded-20">
            <PricingContent>
              <PricingComponent
                classes="vd-mrl"
                label="Supply price"
                help="Excluding tax"
                type="number"
                step=".01"
                value={this.state.primarySupplyPrice}
                onChange={e =>
                  this.handlePrimaryPricingElementChange(
                    'primarySupplyPrice',
                    e.target.value
                  )
                }
              />
              <PricingComponent
                classes="vd-mrl"
                label="x Markup (%)"
                type="number"
                step=".01"
                value={this.state.primaryMarkup}
                onChange={e =>
                  this.handlePrimaryPricingElementChange(
                    'primaryMarkup',
                    e.target.value
                  )
                }
              />
              <PricingComponent
                label="= Retail price"
                help="Excluding tax"
                type="number"
                step=".01"
                value={this.state.primaryRetailPrice}
                onChange={e =>
                  this.handlePrimaryPricingElementChange(
                    'primaryRetailPrice',
                    e.target.value
                  )
                }
              />
            </PricingContent>
            <PricingShowDetail
              showing={this.state.showPricingTableByOutlet}
              onToggle={this.handlePrimaryPricingTableOpen}
            />
            {this.state.showPricingTableByOutlet && (
              <ProductTaxTableByOutlet
                data={this.state.primaryTaxByOutlet}
                taxOptions={taxOptions}
                retailPrice={this.state.primaryRetailPrice}
                onChangeTax={this.handlePrimaryTaxTableChange}
              />
            )}
          </Section>
          {action === 'create' ? (
            <Section label="Product Type & Inventory" classes="padded-20">
              {/* Product Type & Inventory section */}
              <ImageButtonSegControl
                primary
                options={ProductTypeInInventory}
                onChange={id => this.handleToggleTypeInInventory(id)}
              />
              <hr className="vd-hr" />
              {/* If product type is standard in inventory */}
              {inventoryType === ProductTypeInInventory[0].id ? (
                <StandardInventory
                  primarySKU={this.state.primarySKU}
                  skuGeneration={this.props.storeSetting.skuGeneration}
                  productInventory={this.state.productInventory}
                  primaryTrackingInventory={this.state.primaryTrackingInventory}
                  taxOptions={taxOptions}
                  hasVariants={this.state.hasVariant}
                  hasInventory={this.state.hasInventory}
                  variantAttrNameOptions={variantAttrNameOptions}
                  onPrimaryTrackingChange={this.handlePrimaryTrackingChange}
                  onToggleHasVariants={this.handleHasVariantsChange}
                  onToggleTrackingInventory={this.handleTrackingInventoryChange}
                  onPrimarySKUChange={this.handlePrimarySKUChange}
                  onVariantAttrAdd={this.handleVariantAttrAdd}
                  onVariantAttrRemove={this.handleVariantAttrRemove}
                  onVariantAttrNameChange={this.handleVariantAttrNameChange}
                  onVariantValueAdd={this.handleVariantValueAdd}
                  onVariantValueRemove={this.handleVariantValueRemove}
                  onVariantItemRemove={this.handleVariantItemRemove}
                  onVariantItemChange={this.handleVariantItemChange}
                  onVariantItemTrackingChange={
                    this.handleVariantItemTrackingChange
                  }
                  onVariantItemTaxChange={this.handleVariantItemTaxChange}
                  onFormElementStateChange={this.handleFormElementStateChange}
                />
              ) : (
                <CompositeInventory />
              )}
            </Section>
          ) : (
            <div>
              <Section
                label="Variants"
                subhead="Variants allow you to specify the different attributes of your product, such as size or color. You can define up to three attributes for this product (e.g. color), and each attribute can have many values (e.g. black, green, etc)"
                classes="padded-20"
              >
                <ProductVariantAttrControl
                  hasVariant={this.state.hasVariant}
                  variantAttrNameOptions={variantAttrNameOptions}
                  variantAttrs={this.state.primaryVariantAttrs}
                  onToggleHasVariants={this.handleHasVariantsChange}
                  onVariantAttrNameChange={
                    this.handlePrimaryVariantAttrNameChange
                  }
                  onVariantValueChange={this.handlePrimaryVariantValueChange}
                  onVariantAttrRemove={this.handlePrimaryVariantAttrRemove}
                />
              </Section>
              <Section label="Inventory" classes="padded-20">
                <ProductInventoryControl
                  primarySKU={this.state.primarySKU}
                  hasInventory={this.state.hasInventory}
                  primaryTrackingInventory={this.state.primaryTrackingInventory}
                  onPrimarySKUChange={this.handlePrimarySKUChange}
                  onToggleTrackingInventory={this.handleTrackingInventoryChange}
                  onPrimaryTrackingChange={this.handlePrimaryTrackingChange}
                  onFormElementStateChange={this.handleFormElementStateChange}
                />
              </Section>
            </div>
          )}
        </RBForm>
        <div className="vd-flex vd-flex--justify-end">
          <Button negative text="Cancel" onClick={this.handleCancel} />
          {this.state.action === 'create' && (
            <Button
              primary
              onClick={this.handleProductAdd}
              disabled={formState.invalid}
            >
              Add Product
            </Button>
          )}
          {this.state.action === 'add_variant' && (
            <Button
              primary
              onClick={this.handleProductSave}
              disabled={formState.invalid}
            >
              Add Variant
            </Button>
          )}
          {this.state.action === 'edit' && (
            <Button
              primary
              onClick={this.handleProductSave}
              disabled={formState.invalid}
            >
              Save Product
            </Button>
          )}
        </div>

        <NewProductTypeDialog ref={c => (this.newTypeModalRef = c)} />
        <NewProductSupplierDialog ref={c => (this.newSupplierModalRef = c)} />
        <NewProductBrandDialog ref={c => (this.newBrandModalRef = c)} />
        <NewProductVariantAttr
          open={this.state.openNewProductAttrDlg}
          onRequestClose={this.handleNewProductVariantAttrClose}
          onSubmit={this.handleNewVariantAttrNameAdd}
        />

        <NewSalesTaxDialog
          open={this.state.openNewSalesTaxDlg}
          onRequestClose={this.handleNewSalesTaxClose}
          onSubmit={this.handleNewSalesTaxAdd}
        />
      </Content>
    ) : (
      <div>
        {/* To Do - Display details of the product */}
        Here is details of the product
      </div>
    );
  }
}

export default CRUDProducts;
