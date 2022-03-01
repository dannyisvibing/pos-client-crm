import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { withProps } from 'recompose';
import _ from 'lodash';
import ManageSalesTaxPage from '../components/ManageSalesTaxPage';
import {
  createSalesTax,
  updateSalesTax,
  deleteSalesTax,
  fetchSalesTax,
  taxesSelector
} from '../../../modules/sale';
import { fetchOutlets, outletsSelector } from '../../../modules/outlet';
import spinnerWhileLoading from '../../common/containers/SpinnerWhileLoadingContainer';

const PAGE_TAG = 'ManageSalesTaxPage';

const mapStateToProps = state => ({
  salestax: taxesSelector(state),
  outlets: outletsSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createSalesTax,
      updateSalesTax,
      deleteSalesTax
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withProps(({ salestax }) => ({
    salestaxHash: _.keyBy(salestax, 'id')
  }))
);

export default spinnerWhileLoading(PAGE_TAG, {
  reducers: {
    fetchSalesTax,
    fetchOutlets
  },
  resolve: async props => {
    await props.fetchSalesTax();
    await props.fetchOutlets();
  }
})(enhance(ManageSalesTaxPage));
