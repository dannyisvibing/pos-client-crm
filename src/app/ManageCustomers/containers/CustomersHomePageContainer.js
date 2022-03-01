import { compose } from 'redux';
import { pure } from 'recompose';
import CustomersHomePage from '../components/CustomersHomePage';
import spinnerWhileLoading from '../../common/containers/SpinnerWhileLoadingContainer';
import { fetchCustomers, fetchCustomerGroups } from '../../../modules/customer';

const PAGE_TAG = 'CustomersHome';

const enhance = compose(pure);

export default spinnerWhileLoading(PAGE_TAG, {
  reducers: {
    fetchCustomers,
    fetchCustomerGroups
  },
  resolve: async props => {
    await props.fetchCustomers();
    await props.fetchCustomerGroups();
  }
})(enhance(CustomersHomePage));
