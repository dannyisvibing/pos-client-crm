import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withHandlers, withState } from 'recompose';
import SaleHistoryPage from '../components/SaleHistoryPage';
import spinnerWhileLoading from '../../common/containers/SpinnerWhileLoadingContainer';
import { fetchOutlets } from '../../../modules/outlet';
import { fetchRegisters } from '../../../modules/register';
import {
  fetchReceipts,
  fetchSalesTax,
  initializeSale
} from '../../../modules/sale';
import { fetchCustomers } from '../../../modules/customer';
import { fetchProducts } from '../../../modules/product';
import {
  SALE_STATUS_IN_PROGRESS,
  SALE_STATUS_COMPLETED
} from '../../../modules/sale/sale.constants';

const PAGE_TAG = 'SalesHistoryPage';

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchReceipts
    },
    dispatch
  );

const enhance = compose(
  connect(null, mapDispatchToProps),
  withState('activeCategory', 'setActiveCategory', 'continue_sales'),
  withHandlers({
    onSelectCategory: props => async (e, value) => {
      e.preventDefault();
      props.setActiveCategory(value);
      if (value === 'continue_sales') {
        props.fetchReceipts({ status: SALE_STATUS_IN_PROGRESS });
      } else if (value === 'process_returns') {
        props.fetchReceipts({ status: SALE_STATUS_COMPLETED });
      } else {
        props.fetchReceipts();
      }
    }
  })
);

export default spinnerWhileLoading(PAGE_TAG, {
  reducers: {
    fetchOutlets,
    fetchRegisters,
    fetchReceipts,
    fetchCustomers,
    fetchProducts,
    fetchSalesTax,
    initializeSale
  },
  resolve: async props => {
    await props.fetchCustomers();
    await props.fetchProducts();
    await props.fetchOutlets();
    await props.fetchRegisters();
    await props.fetchSalesTax();
    await props.fetchReceipts({ status: SALE_STATUS_IN_PROGRESS });
    await props.initializeSale();
  }
})(enhance(SaleHistoryPage));
