import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import { lifecycle } from 'recompose';
import ProductSuppliersTable from '../components/ProductSuppliersTable';
import {
  suppliersSelector,
  productsSelector,
  generateSuppliersTableDatasource,
  fetchSuppliers,
  deleteSupplier
} from '../../../modules/product';
import { openModal } from '../../../modules/modal';

const datasourceSelector = createSelector(
  [suppliersSelector, productsSelector],
  generateSuppliersTableDatasource
);

const mapStateToProps = state => ({
  datasource: datasourceSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchSuppliers,
      deleteSupplier,
      openModal
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentWillMount() {
      this.props.fetchSuppliers();
    }
  })
);

export default enhance(ProductSuppliersTable);
