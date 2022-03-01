import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import { pure } from 'recompose';
import ProductTable from '../components/ProductTable';
import {
  productsSelector,
  generateProductsTableDatasource,
  filterSelector,
  setFilter,
  applyFilter,
  setActive
} from '../../../modules/product';

const datasourceSelector = createSelector(
  productsSelector,
  generateProductsTableDatasource
);

const mapStateToProps = state => ({
  filter: filterSelector(state),
  datasource: datasourceSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setFilter,
      applyFilter,
      setActive
    },
    dispatch
  );

const enhance = compose(connect(mapStateToProps, mapDispatchToProps), pure);

export default enhance(ProductTable);
