import { connect } from 'react-redux';
import { compose } from 'redux';
import CustomerGroupsTable from '../components/CustomerGroupsTable';
import { customerGroupsSelector } from '../../../modules/customer';

const enhance = compose(
  connect(state => ({
    customerGroups: customerGroupsSelector(state)
  }))
);

export default enhance(CustomerGroupsTable);
