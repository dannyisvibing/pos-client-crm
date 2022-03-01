import { compose } from 'redux';
import { connect } from 'react-redux';
import ManageCustomersEntry from '../components/ManageCustomersEntry';
import { getPageToRenderFromRouteParam } from '../../../modules/customer';

const mapStateToProps = (state, props) => ({
  page: getPageToRenderFromRouteParam(props.match.params)
});

const mapDispatchToProps = {};

const enhance = compose(connect(mapStateToProps, mapDispatchToProps));

export default enhance(ManageCustomersEntry);
