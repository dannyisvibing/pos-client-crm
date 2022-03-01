import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import { lifecycle } from 'recompose';
import ProductTagsTable from '../components/ProductTagsTable';
import {
  tagsSelector,
  productsSelector,
  generateTagsTableDatasource,
  fetchTags
} from '../../../modules/product';
import { openModal } from '../../../modules/modal';

const datasourceSelector = createSelector(
  [tagsSelector, productsSelector],
  generateTagsTableDatasource
);

const mapStateToProps = state => ({
  datasource: datasourceSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchTags,
      openModal
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentWillMount() {
      this.props.fetchTags();
    }
  })
);

export default enhance(ProductTagsTable);
