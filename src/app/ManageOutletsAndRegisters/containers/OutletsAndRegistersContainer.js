import { compose } from 'redux';
import { connect } from 'react-redux';
import OutletsAndRegisters from '../legacy/OutletsAndRegisters';
import { fetchOutlets, outletsSelector } from '../../../modules/outlet';
import { fetchRegisters, registersSelector } from '../../../modules/register';
import { fetchSalesTax, taxesSelector } from '../../../modules/sale';
import {
  fetchReceiptTemplates,
  receiptTemplatesSelector
} from '../../../modules/retailer';
import spinnerWhileLoading from '../../common/containers/SpinnerWhileLoadingContainer';

const PAGE_TAG = 'OutletsAndRegisters';

const mapStateToProps = state => ({
  outlets: outletsSelector(state),
  registers: registersSelector(state),
  salesTaxes: taxesSelector(state),
  receiptTemplates: receiptTemplatesSelector(state)
});

const enhance = compose(connect(mapStateToProps));

export default spinnerWhileLoading(PAGE_TAG, {
  reducers: {
    fetchOutlets,
    fetchRegisters,
    fetchSalesTax,
    fetchReceiptTemplates
  },
  resolve: async props => {
    await props.fetchOutlets();
    await props.fetchRegisters();
    await props.fetchSalesTax();
    await props.fetchReceiptTemplates();
  }
})(enhance(OutletsAndRegisters));
