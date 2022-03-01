import request from '../../utils/http';
import _ from 'lodash';
import moment from 'moment';
import queryString from 'query-string';
import { MANAGE_PRODUCTS } from '../../constants/pageTags';
import {
  typesSelector,
  brandsSelector,
  suppliersSelector,
  tagsSelector
} from './index';
import WindowDelegate from '../../rombostrap/utils/windowDelegate';
import { productsManager } from '../idb/managers';

export const fetchProducts = async filter => {
  const windowDelegate = WindowDelegate.getInstance();
  if (windowDelegate.isOnline()) {
    const response = await request({
      url: '/products',
      params: filter
    });
    const result = response.data;
    return result.data;
  } else {
    return productsManager.getAll();
  }
};

export const getPageToRenderFromRouteParam = ({ action, id }) => {
  if (!action && !id) {
    return { tag: MANAGE_PRODUCTS.HOME };
  } else if (action === 'new' && !id) {
    return {
      tag: MANAGE_PRODUCTS.CRUD,
      props: { create: true }
    };
  } else if (action === 'edit' && !!id) {
    return {
      tag: MANAGE_PRODUCTS.CRUD,
      props: { edit: true, productId: id }
    };
  } else if (action === 'show' && !!id) {
    return {
      tag: MANAGE_PRODUCTS.VIEW,
      props: { productId: id }
    };
  } else if (action === 'add_variant' && !!id) {
    return {
      tag: MANAGE_PRODUCTS.CRUD,
      props: { addVariant: true, productId: id }
    };
  } else if (action === 'import') {
    return { tag: MANAGE_PRODUCTS.IMPORT };
  } else if (action === 'type') {
    return { tag: MANAGE_PRODUCTS.TYPE };
  } else if (action === 'brand') {
    return { tag: MANAGE_PRODUCTS.BRAND };
  } else if (action === 'supplier') {
    return { tag: MANAGE_PRODUCTS.SUPPLIER };
  } else if (action === 'tag') {
    return { tag: MANAGE_PRODUCTS.TAG };
  }
};

export const generateProductsTableDatasource = products => {
  const groupify = _.groupBy(products, 'productHandle');
  return _.values(groupify).reduce((memo, variantsSet) => {
    variantsSet.sort((a, b) => (b.primaryItem || 0) - (a.primaryItem || 0));
    const product = variantsSet[0];
    let row = {
      id: product.id,
      title: product.name,
      active: product.active,
      sku: product.sku,
      created: moment(product.created).format('DD MMM YYYY'),
      tags: (product.tags || '').split(','),
      brandId: product.brand.id,
      brand: product.brand.name || '',
      supplierId: product.supplier.id,
      supplier: product.supplier.name || '',
      variants: undefined,
      price: product.retailPrice,
      count: variantsSet.reduce((count, product) => {
        count += (product.trackingInventory || []).reduce((count, tracking) => {
          count += tracking.currentInventoryCount || 0;
          return count;
        }, 0);

        return count;
      }, 0)
    };

    if (variantsSet.length > 1) {
      row.variants = [];
      variantsSet.forEach(product => {
        const line = {
          id: product.id,
          name: product.fullname,
          price: product.retailPrice,
          count: (product.trackingInventory || []).reduce((count, tracking) => {
            count += tracking.currentInventoryCount || 0;
            return count;
          }, 0)
        };

        row.variants.push(line);
      });
    }

    memo.push(row);
    return memo;
  }, []);
};

export const generateTypeTableDatasource = (types, products) => {
  return types.map(type => {
    let item = {
      id: type.id,
      name: type.name
    };

    item.count = products.reduce(
      (count, product) => count + (product.literalTypeId === item.id ? 1 : 0),
      0
    );
    return item;
  });
};

export const generateBrandsTableDatasource = (brands, products) => {
  return brands.map(brand => {
    let item = {
      id: brand.id,
      name: brand.name,
      description: brand.description
    };

    item.count = products.reduce(
      (count, product) => count + (product.brandId === item.id ? 1 : 0),
      0
    );
    return item;
  });
};

export const generateSuppliersTableDatasource = (suppliers, products) => {
  return suppliers.map(supplier => {
    let item = {
      id: supplier.id,
      name: supplier.name,
      description: supplier.description,
      defaultMarkup: supplier.defaultMarkup
    };

    item.count = products.reduce(
      (count, product) => count + (product.supplierId === item.id ? 1 : 0),
      0
    );
    return item;
  });
};

export const generateTagsTableDatasource = (tags, products) => {
  return tags.map(tag => {
    let item = {
      id: tag.id,
      name: tag.name
    };

    item.count = products.reduce(
      (count, product) => count + (product.tagIds.includes(item.id) ? 1 : 0),
      0
    );
    return item;
  });
};

export const generateHistoryTableDatasource = (history, users, outlets) => {
  const outletsHash = _.keyBy(outlets, 'outletId');
  const usersHash = _.keyBy(users, 'userId');
  return history.map(item => {
    return {
      date: moment(item.appliedDate).format(),
      variant: '',
      username: usersHash[item.userId].displayName,
      outletName: outletsHash[item.outletId].outletName,
      quantity: item.quantity,
      outletQuantity: item.outletQuantity,
      change: item.changedQuantity,
      action:
        item.action === 0
          ? 'Created'
          : item.action === 1
            ? 'Updated'
            : item.action === 2
              ? 'Sold'
              : ''
    };
  });
};

export const generateGeneralData = products => {
  return {
    primaryId: products[0].id,
    name: products[0].name,
    description: products[0].description,
    tags: (products[0].tags || '').split(','),
    brand: products[0].brand.name,
    handle: products[0].handle,
    supplyPrice: products[0].supplyPrice,
    supplier: products[0].supplier.name,
    averageCost:
      products.reduce((total, product) => total + product.supplyPrice, 0) /
      products.length
  };
};

export const generateInventoryTableDatasource = (
  products,
  outlets,
  variantAttrs
) => {
  var inventoryInfo = {
    data: []
  };
  const outletsHash = _.keyBy(outlets, 'outletId');
  if (products.length === 1) {
    inventoryInfo.type = 'single';
    products[0].trackingInventory.forEach(tracking => {
      inventoryInfo.data.push({
        id: products[0].id,
        outletName: outletsHash[tracking.outletId].outletName,
        inStock: tracking.currentInventoryCount
      });
    });
  } else {
    inventoryInfo.type = 'variants';
    const variantAttrNamesHash = _.keyBy(variantAttrs, 'attributeId');
    products.forEach(product => {
      let variants = [];
      if (product.variantAttr1)
        variants.push({
          name: variantAttrNamesHash[product.variantAttr1].value,
          value: product.variantValue1
        });
      if (product.variantAttr2)
        variants.push({
          name: variantAttrNamesHash[product.variantAttr2].value,
          value: product.variantValue2
        });
      if (product.variantAttr3)
        variants.push({
          name: variantAttrNamesHash[product.variantAttr3].value,
          value: product.variantValue3
        });

      inventoryInfo.data.push({
        id: product.id,
        variants,
        sku: product.sku,
        price: product.retailPrice,
        inStock: product.trackingInventory.reduce(
          (total, tracking) => total + tracking.currentInventoryCount,
          0
        )
      });
    });
  }

  return inventoryInfo;
};

export const getProductById = (products, id) => {
  const initial = { name: '' };
  if (!id) return initial;
  return _.find(products, product => product.id === id) || initial;
};

export const getTypeById = (types, id) => {
  const initial = { name: '' };
  if (!id) return initial;
  return _.find(types, type => type.id === id) || initial;
};

export const getBrandById = (brands, id) => {
  const initial = { name: '', description: '' };
  if (!id) return initial;
  return _.find(brands, brand => brand.id === id) || initial;
};

export const getSupplierById = (suppliers, id) => {
  const initial = { name: '', description: '', defaultMarkup: 0 };
  if (!id) return initial;
  return _.find(suppliers, supplier => supplier.id === id) || initial;
};

export const getTagById = (tags, id) => {
  const initial = { name: '' };
  if (!id) return initial;
  return _.find(tags, tag => tag.id === id) || initial;
};

export const getFilterFromLocationSearch = (search, state) => {
  if (search.tags && typeof search.tags === 'string') {
    search.tags = [search.tags];
  }

  return {
    productName: search.productName || '',
    typeId:
      typesSelector(state).findIndex(type => type.id === search.typeId) > -1
        ? search.typeId
        : '',
    brandId:
      brandsSelector(state).findIndex(brand => brand.id === search.brandId) > -1
        ? search.brandId
        : '',
    supplierId:
      suppliersSelector(state).findIndex(
        supplier => supplier.id === search.supplierId
      ) > -1
        ? search.supplierId
        : '',
    status:
      ['active', 'inactive', 'all'].indexOf(search.status) > -1
        ? search.status
        : 'active',
    tags: _.compact(
      (search.tags || []).map(tagId => {
        return tagsSelector(state).find(tag => tag.id === tagId);
      })
    )
  };
};

export const getLocationSearchFromFilter = filter => {
  return queryString.stringify({
    ...filter,
    tags: filter.tags.map(tag => tag.id)
  });
};

export const getHttpReqParamFromFilter = filter => {
  return {
    ...filter,
    tags: filter.tags.map(tag => tag.id)
  };
};
