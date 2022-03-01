import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { mapProps, withProps } from 'recompose';
import _ from 'lodash';
import CRUDProductsPage from '../components/CRUDProductsPage';
import spinnerWhileLoading from '../../common/containers/SpinnerWhileLoadingContainer';
import { routerGoBack, routerReplace } from '../../../modules/app';
import {
  productsSelector,
  brandsSelector,
  suppliersSelector,
  tagsSelector,
  typesSelector,
  variantAttrsSelector,
  createProduct,
  createType,
  createSupplier,
  createBrand,
  createTag,
  createVariantAttribute,
  fetchProducts,
  fetchBrands,
  fetchSuppliers,
  fetchTags,
  fetchTypes,
  fetchVariantAttributes
} from '../../../modules/product';
import { fetchOutlets, outletsSelector } from '../../../modules/outlet';
import { fetchRetailer, retailerSelector } from '../../../modules/retailer';
import {
  fetchSalesTax,
  createSalesTax,
  taxesSelector
} from '../../../modules/sale';

const PAGE_TAG = 'CRUDProducts';

const mapStateToProps = state => ({
  outlets: outletsSelector(state),
  taxes: taxesSelector(state),
  products: productsSelector(state),
  literalTypes: typesSelector(state),
  brands: brandsSelector(state),
  suppliers: suppliersSelector(state),
  tags: tagsSelector(state),
  variantAttrs: variantAttrsSelector(state),
  retailer: retailerSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createProduct,
      createType,
      createSupplier,
      createBrand,
      createTag,
      createSalesTax,
      createVariantAttribute,
      routerGoBack,
      routerReplace
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  mapProps(({ products, retailer, taxes, variantAttrs, ...rest }) => ({
    productsHash: _.keyBy(products, 'id'),
    storeSetting: retailer.settings,
    salestax: taxes,
    salestaxHash: _.keyBy(taxes, 'id'),
    variantAttrNames: variantAttrs,
    ...rest
  })),
  withProps(({ outlets, tags }) => ({
    outletsHash: _.keyBy(outlets, 'outletId'),
    tagsHash: _.keyBy(tags, 'id')
  }))
);

export default spinnerWhileLoading(PAGE_TAG, {
  reducers: {
    fetchProducts,
    fetchBrands,
    fetchSuppliers,
    fetchTags,
    fetchTypes,
    fetchVariantAttributes,
    fetchOutlets,
    fetchRetailer,
    fetchSalesTax
  },
  resolve: async props => {
    const params = props.params;
    if (params.edit) {
      await props.fetchProducts({ ids: [params.productId] });
    }
    await props.fetchBrands();
    await props.fetchSuppliers();
    await props.fetchTags();
    await props.fetchTypes();
    await props.fetchVariantAttributes();
    await props.fetchOutlets();
    await props.fetchRetailer();
    await props.fetchSalesTax();
  }
})(enhance(CRUDProductsPage));
