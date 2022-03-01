import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import { lifecycle } from 'recompose';
import ProductTypeTable from '../components/ProductTypeTable';
import {
  typesSelector,
  productsSelector,
  generateTypeTableDatasource,
  fetchTypes,
  deleteType
} from '../../../modules/product';
import { openModal } from '../../../modules/modal';

const datasourceSelector = createSelector(
  [typesSelector, productsSelector],
  generateTypeTableDatasource
);

const mapStateToProps = state => ({
  datasource: datasourceSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchTypes,
      deleteType,
      openModal
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentWillMount() {
      this.props.fetchTypes();
    }
  })
);

export default enhance(ProductTypeTable);
