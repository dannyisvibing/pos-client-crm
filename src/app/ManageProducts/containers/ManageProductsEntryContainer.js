import { compose } from 'redux';
import { connect } from 'react-redux';
import ManageProductsEntry from '../components/ManageProductsEntry';
import { getPageToRenderFromRouteParam } from '../../../modules/product';

const mapStateToProps = (state, props) => ({
  page: getPageToRenderFromRouteParam(props.match.params)
});

const mapDispatchToProps = {};

const enhance = compose(connect(mapStateToProps, mapDispatchToProps));

export default enhance(ManageProductsEntry);
