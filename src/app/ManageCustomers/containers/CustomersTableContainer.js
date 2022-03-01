import { connect } from 'react-redux';
import { compose } from 'redux';
import { createSelector } from 'reselect';
import CustomersTable from '../components/CustomersTable';
import { retailerSettingsSelector } from '../../../modules/retailer';
import {
  customersSelector,
  customerGroupsSelector,
  generateCustomersTableDatasource
} from '../../../modules/customer';

const datasourceSelector = createSelector(
  [customersSelector, customerGroupsSelector],
  generateCustomersTableDatasource
);

const mapStateToProps = state => ({
  retailerSettings: retailerSettingsSelector(state),
  datasource: datasourceSelector(state)
});

const mapDispatchToProps = {};

const enhance = compose(connect(mapStateToProps, mapDispatchToProps));

export default enhance(CustomersTable);
