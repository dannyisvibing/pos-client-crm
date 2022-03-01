import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import { lifecycle } from 'recompose';
import ProductBrandsTable from '../components/ProductBrandsTable';
import {
  brandsSelector,
  productsSelector,
  generateBrandsTableDatasource,
  fetchBrands,
  deleteBrand
} from '../../../modules/product';
import { openModal } from '../../../modules/modal';

const datasourceSelector = createSelector(
  [brandsSelector, productsSelector],
  generateBrandsTableDatasource
);

const mapStateToProps = state => ({
  datasource: datasourceSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchBrands,
      deleteBrand,
      openModal
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentWillMount() {
      this.props.fetchBrands();
    }
  })
);

export default enhance(ProductBrandsTable);
