import { compose } from 'redux';
import { connect } from 'react-redux';
import ManagePricebooksEntry from '../components/ManagePricebooksEntry';
import { getPageToRenderFromRouteParam } from '../../../modules/pricebook';

const mapStateToProps = (state, props) => ({
  page: getPageToRenderFromRouteParam(props.match.params)
});

const mapDispatchToProps = {};

const enhance = compose(connect(mapStateToProps, mapDispatchToProps));

export default enhance(ManagePricebooksEntry);
