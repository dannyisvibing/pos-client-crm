import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { lifecycle } from 'recompose';
import CustomersFilter from '../components/CustomersFilter';
import {
  filterSelector,
  customerGroupsSelector,
  setFilter,
  applyFilter,
  applyFilterFromUrl
} from '../../../modules/customer';

const mapStateToProps = state => ({
  filter: filterSelector(state),
  customerGroups: customerGroupsSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setFilter,
      applyFilter,
      applyFilterFromUrl
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentWillMount() {
      this.props.applyFilterFromUrl();
    }
  })
);

export default enhance(CustomersFilter);
