import { compose } from 'redux';
import { connect } from 'react-redux';
import { customersSelector } from '../../../modules/customer';
import SearchForCustomers from '../components/SearchForCustomers';
import { withHandlers } from 'recompose';

const mapStateToProps = state => ({
  customers: customersSelector(state)
});

const enhance = compose(
  connect(mapStateToProps),
  withHandlers({
    onSelectSuggestion: props => suggestion => {
      props.handler(suggestion);
    }
  })
);

export default enhance(SearchForCustomers);
