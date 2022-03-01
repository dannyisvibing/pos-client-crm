import { compose } from 'redux';
import { connect } from 'react-redux';
import PricebooksTable from '../components/PricebooksTable';
import { pricebooksSelector } from '../../../modules/pricebook';

const mapStateToProps = state => ({
  pricebooks: pricebooksSelector(state)
});

const mapDispatchToProps = {};

const enhance = compose(connect(mapStateToProps, mapDispatchToProps));

export default enhance(PricebooksTable);
