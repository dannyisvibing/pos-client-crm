import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { withState, lifecycle } from 'recompose';
import ProductsFilter from '../components/ProductsFilter';
import {
  filterSelector,
  typesSelector,
  brandsSelector,
  suppliersSelector,
  tagsSelector,
  setFilter,
  removeTagFilter,
  resetFilter,
  applyFilter,
  applyFilterFromUrl
} from '../../../modules/product';

const mapStateToProps = state => ({
  filter: filterSelector(state),
  types: typesSelector(state),
  brands: brandsSelector(state),
  suppliers: suppliersSelector(state),
  tags: tagsSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setFilter,
      removeTagFilter,
      resetFilter,
      applyFilter,
      applyFilterFromUrl
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('tagName', 'setTagName', ''),
  lifecycle({
    componentWillMount() {
      this.props.applyFilterFromUrl();
    }
  })
);

export default enhance(ProductsFilter);
