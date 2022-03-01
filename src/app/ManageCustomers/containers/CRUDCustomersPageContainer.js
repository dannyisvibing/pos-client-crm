import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import CRUDCustomersPage from '../components/CRUDCustomersPage';
import {
  fetchCustomers,
  fetchCustomerGroups,
  customersSelector,
  customerGroupsSelector,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../../../modules/customer';
import { retailerSettingsSelector } from '../../../modules/retailer';
import { routerReplace } from '../../../modules/app';
import spinnerWhileLoading from '../../common/containers/SpinnerWhileLoadingContainer';

const PAGE_TAG = 'CRUDCustomersPage';

const mapStateToProps = state => ({
  customer: customersSelector(state)[0],
  customerGroups: customerGroupsSelector(state),
  retailerSettings: retailerSettingsSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createCustomer,
      updateCustomer,
      deleteCustomer,
      routerReplace
    },
    dispatch
  );

const enhance = compose(connect(mapStateToProps, mapDispatchToProps));

export default spinnerWhileLoading(PAGE_TAG, {
  reducers: {
    fetchCustomers,
    fetchCustomerGroups
  },
  resolve: async props => {
    const params = props.params;
    if (params.edit) {
      await props.fetchCustomers({ ids: [params.customerId] });
    }
    await props.fetchCustomerGroups();
  }
})(enhance(CRUDCustomersPage));
