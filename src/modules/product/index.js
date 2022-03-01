import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import { push } from 'react-router-redux';
import request from '../../utils/http';
import { locationSearchSelector } from '../app';
import {
  fetchProducts as _fetchProducts,
  getPageToRenderFromRouteParam,
  generateProductsTableDatasource,
  generateTypeTableDatasource,
  generateBrandsTableDatasource,
  generateSuppliersTableDatasource,
  generateTagsTableDatasource,
  generateHistoryTableDatasource,
  generateGeneralData,
  generateInventoryTableDatasource,
  getProductById,
  getTypeById,
  getBrandById,
  getSupplierById,
  getTagById,
  getFilterFromLocationSearch,
  getLocationSearchFromFilter,
  getHttpReqParamFromFilter
} from './product.logic';

export {
  getPageToRenderFromRouteParam,
  generateProductsTableDatasource,
  generateTypeTableDatasource,
  generateBrandsTableDatasource,
  generateSuppliersTableDatasource,
  generateTagsTableDatasource,
  generateHistoryTableDatasource,
  generateGeneralData,
  generateInventoryTableDatasource,
  getProductById,
  getTypeById,
  getBrandById,
  getSupplierById,
  getTagById
};

const initialState = {
  filter: {
    tags: []
  },
  products: [],
  history: [],
  types: [],
  brands: [],
  suppliers: [],
  tags: [],
  variantAttrs: [],
  loading: false,
  error: null
};

// ==================================
// Selectors
// ==================================
const productReducerSelector = state => state.product;

export const loadingSelector = createSelector(
  productReducerSelector,
  productReducer => productReducer.loading
);

export const filterSelector = createSelector(
  productReducerSelector,
  productReducer => productReducer.filter
);

export const productsSelector = createSelector(
  productReducerSelector,
  productReducer => productReducer.products
);

export const historySelector = createSelector(
  productReducerSelector,
  productReducer => productReducer.history
);

export const typesSelector = createSelector(
  productReducerSelector,
  productReducer => productReducer.types
);

export const brandsSelector = createSelector(
  productReducerSelector,
  productReducer => productReducer.brands
);

export const suppliersSelector = createSelector(
  productReducerSelector,
  productReducer => productReducer.suppliers
);

export const tagsSelector = createSelector(
  productReducerSelector,
  productReducer => productReducer.tags
);

export const variantAttrsSelector = createSelector(
  productReducerSelector,
  productReducer => productReducer.variantAttrs
);

// ==================================
// Actions
// ==================================
export const resetModule = createAction('product/RESET');

export const loading = createAction('product/LOADING');

export const setFilter = createAction('product/SET_FILTER');

export const resetFilter = createAction(
  'product/RESET_FILTER',
  () => dispatch => {
    dispatch(
      setFilter({
        tags: [],
        options: { merge: false }
      })
    );
    dispatch(applyFilter());
  }
);

export const removeTagFilter = createAction('product/REMOVE_TAG_FILTER');

export const applyFilter = createAction(
  'product/APPLY_FILTER',
  () => (dispatch, getState) => {
    const filter = filterSelector(getState());
    const locationSearch = getLocationSearchFromFilter(filter);
    dispatch(push('/product?' + locationSearch));
    dispatch(fetchProducts(getHttpReqParamFromFilter(filter)));
  }
);

export const applyFilterFromUrl = createAction(
  'product/APPLY_FILTER_FROM_URL',
  () => (dispatch, getState) => {
    const locationSearch = locationSearchSelector(getState());
    const filter = getFilterFromLocationSearch(locationSearch, getState());
    dispatch(
      setFilter({
        ...filter,
        options: { merge: false }
      })
    );
    dispatch(fetchProducts(getHttpReqParamFromFilter(filter)));
  }
);

export const setActive = createAction(
  'product/SET_ACTIVE',
  (productId, isActive) => (dispatch, getState) => {
    const products = productsSelector(getState());
    const index = products.findIndex(product => product.id === productId);
    return index;
    // const productHandle = products[index].productHandle;
    // return request({
    //   url: '/products',
    //   method: 'put',

    // })
  }
);

export const createProduct = createAction('product/CREATE', products => {
  return request({
    url: '/products',
    method: 'post',
    body: { products }
  });
});

export const fetchProducts = createAction('product/FETCH', _fetchProducts);

export const fetchVariants = createAction('product/FETCH_VARIANTS', id => {
  return request({
    url: `/products/${id}/variants`
  });
});

export const fetchHistory = createAction('product/FETCH_HISTORY', id => {
  return request({
    url: `/products/${id}/history`
  });
});

export const createType = createAction('product/CREATE_TYPE', name => {
  return request({
    url: '/productTypes',
    method: 'post',
    body: { name }
  });
});

export const fetchTypes = createAction('product/FETCH_TYPES', () => {
  return request({
    url: '/productTypes'
  });
});

export const updateType = createAction('product/UPDATE_TYPE', type => {
  return request({
    url: `/productTypes/${type.id}`,
    method: 'put',
    body: { type }
  });
});

export const deleteType = createAction('product/DELETE_TYPE', id => {
  return request({
    url: `/productTypes/${id}`,
    method: 'delete'
  });
});

export const createBrand = createAction(
  'product/CREATE_BRAND',
  ({ name, description }) => {
    return request({
      url: '/brands',
      method: 'post',
      body: { name, description }
    });
  }
);

export const fetchBrands = createAction('product/FETCH_BRANDS', () => {
  return request({
    url: '/brands'
  });
});

export const updateBrand = createAction('product/UPDATE_BRAND', (id, brand) => {
  return request({
    url: `/brands/${id}`,
    method: 'put',
    body: { brand }
  });
});

export const deleteBrand = createAction('product/DELETE_BRAND', id => {
  return request({
    url: `/brands/${id}`,
    method: 'delete'
  });
});

export const createSupplier = createAction(
  'product/CREATE_SUPPLIER',
  ({ name, description, defaultMarkup }) => {
    return request({
      url: '/suppliers',
      method: 'post',
      body: { name, description, defaultMarkup }
    });
  }
);

export const fetchSuppliers = createAction('product/FETCH_SUPPLIERS', () => {
  return request({
    url: '/suppliers'
  });
});

export const updateSupplier = createAction(
  'product/UPDATE_SUPPLIER',
  (id, supplier) => {
    return request({
      url: `/suppliers/${id}`,
      method: 'put',
      body: { supplier }
    });
  }
);

export const deleteSupplier = createAction('product/DELETE_SUPPLIER', id => {
  return request({
    url: `/suppliers/${id}`,
    method: 'delete'
  });
});

export const createTag = createAction('product/CREATE_TAG', name => {
  return request({
    url: '/tags',
    method: 'post',
    body: { name }
  });
});

export const fetchTags = createAction('product/FETCH_TAGS', () => {
  return request({
    url: '/tags'
  });
});

export const updateTag = createAction('product/UPDATE_TAG', ({ id, name }) => {
  return request({
    url: `/tags/${id}`,
    method: 'put',
    body: { name }
  });
});

export const createVariantAttribute = createAction(
  'product/CREATE_VARIANT_ATTRIBUTE',
  name => {
    return request({
      url: '/variantAttrs',
      method: 'post',
      body: { name }
    });
  }
);

export const fetchVariantAttributes = createAction(
  'product/FETCH_VARIANT_ATTRIBUTES',
  () => {
    return request({
      url: '/variantAttrs'
    });
  }
);

// ==================================
// Action Handlers
// ==================================
const ACTION_HANDLERS = {
  [setFilter]: (state, action) => {
    let filter = {};
    const { options = { merge: true }, ...newFilter } = action.payload;
    if (options.merge) {
      if (newFilter.tagName) {
        const selectedTag = state.tags.find(
          tag => tag.name === newFilter.tagName
        );
        if (
          selectedTag &&
          state.filter.tags.findIndex(tag => tag.id === selectedTag.id) < 0
        ) {
          filter.tags = [...state.filter.tags, selectedTag];
        }
      } else {
        filter = newFilter;
      }
      filter = { ...state.filter, ...filter };
    } else {
      if (newFilter.tagName) {
        const selectedTag = state.tags.find(
          tag => tag.name === newFilter.tagName
        );
        if (selectedTag) {
          filter = { status: 'all', tags: [selectedTag] };
        }
      } else {
        filter = { status: 'all', tags: [], ...newFilter };
      }
    }

    return {
      ...state,
      filter
    };
  },
  [removeTagFilter]: (state, action) => ({
    ...state,
    filter: {
      ...state.filter,
      tags: state.filter.tags.filter(tag => tag.id !== action.payload)
    }
  }),
  [setActive]: (state, action) => {
    let products = [...state.products];
    products[action.payload].active = !products[action.payload].active;
    return {
      ...state,
      products
    };
  },
  [fetchProducts]: {
    next: (state, action) => {
      return {
        ...state,
        products: action.payload
      };
    },
    throw: state => state
  },
  [fetchVariants]: {
    next: (state, action) => {
      const result = action.payload.data;
      return {
        ...state,
        products: result.data
      };
    },
    throw: state => state
  },
  [fetchHistory]: {
    next: (state, action) => {
      return {
        ...state,
        history: action.payload.data
      };
    },
    throw: state => state
  },
  [createProduct]: {
    next: (state, action) => {
      return {
        ...state
      };
    },
    throw: state => state
  },
  [createType]: {
    next: (state, action) => {
      const newType = action.payload.data;
      return {
        ...state,
        types: [...state.types, newType]
      };
    },
    throw: state => state
  },
  [fetchTypes]: {
    next: (state, action) => {
      const result = action.payload.data;
      return {
        ...state,
        types: result.data
      };
    },
    throw: state => state
  },
  [updateType]: {
    next: (state, action) => {
      const updatedType = action.payload.data;
      const index = state.types.findIndex(type => type.id === updatedType.id);
      return {
        ...state,
        types: [
          ...state.types.slice(0, index),
          updatedType,
          ...state.types.slice(index + 1)
        ]
      };
    },
    throw: state => state
  },
  [deleteType]: {
    next: (state, action) => {
      const deletedId = action.payload.data;
      return {
        ...state,
        types: state.types.filter(type => type.id !== deletedId)
      };
    },
    throw: state => state
  },
  [createBrand]: {
    next: (state, action) => {
      const newBrand = action.payload.data;
      return {
        ...state,
        brands: [...state.brands, newBrand]
      };
    },
    throw: state => state
  },
  [fetchBrands]: {
    next: (state, action) => {
      const result = action.payload.data;
      return {
        ...state,
        brands: result.data
      };
    },
    throw: state => state
  },
  [updateBrand]: {
    next: (state, action) => {
      const updatedBrand = action.payload.data;
      const index = state.brands.findIndex(
        brand => brand.id === updatedBrand.id
      );
      return {
        ...state,
        brands: [
          ...state.brands.slice(0, index),
          updatedBrand,
          ...state.brands.slice(index + 1)
        ]
      };
    },
    throw: state => state
  },
  [deleteBrand]: {
    next: (state, action) => {
      const deletedId = action.payload.data;
      return {
        ...state,
        brands: state.brands.filter(brand => brand.id !== deletedId)
      };
    },
    throw: state => state
  },
  [fetchSuppliers]: {
    next: (state, action) => {
      const result = action.payload.data;
      return {
        ...state,
        suppliers: result.data
      };
    },
    throw: state => state
  },
  [createSupplier]: {
    next: (state, action) => {
      const newSupplier = action.payload.data;
      return {
        ...state,
        suppliers: [...state.brands, newSupplier]
      };
    },
    throw: state => state
  },
  [updateSupplier]: {
    next: (state, action) => {
      const updatedSupplier = action.payload.data;
      const index = state.suppliers.findIndex(
        supplier => supplier.id === updatedSupplier.id
      );
      return {
        ...state,
        suppliers: [
          ...state.suppliers.slice(0, index),
          updatedSupplier,
          ...state.suppliers.slice(index + 1)
        ]
      };
    },
    throw: state => state
  },
  [deleteSupplier]: {
    next: (state, action) => {
      const deletedId = action.payload.data;
      return {
        ...state,
        suppliers: state.suppliers.filter(supplier => supplier.id !== deletedId)
      };
    },
    throw: state => state
  },
  [createTag]: {
    next: (state, action) => {
      const newTag = action.payload.data;
      return {
        ...state,
        tags: [...state.tags, newTag]
      };
    },
    throw: state => state
  },
  [fetchTags]: {
    next: (state, action) => {
      const result = action.payload.data;
      return {
        ...state,
        tags: result.data
      };
    },
    throw: state => state
  },
  [updateTag]: {
    next: (state, action) => {
      const updatedTag = action.payload.data;
      console.log('sssssssssssssssssss', updatedTag);
      const index = state.tags.findIndex(tag => tag.id === updatedTag.id);
      return {
        ...state,
        tags: [
          ...state.tags.slice(0, index),
          updatedTag,
          ...state.tags.slice(index + 1)
        ]
      };
    },
    throw: state => state
  },
  [createVariantAttribute]: {
    next: (state, action) => {
      const newAttr = action.payload.data;
      return {
        ...state,
        variantAttrs: [...state.variantAttrs, newAttr]
      };
    },
    throw: state => state
  },
  [fetchVariantAttributes]: {
    next: (state, action) => {
      const variantAttrs = action.payload.data;
      return {
        ...state,
        variantAttrs
      };
    },
    throw: state => state
  },
  [resetModule]: () => {
    return initialState;
  }
};

// ==================================
// Reducer
// ==================================
export default handleActions(ACTION_HANDLERS, initialState);
