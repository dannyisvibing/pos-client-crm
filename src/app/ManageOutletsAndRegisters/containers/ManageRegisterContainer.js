import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ManageRegister from '../legacy/Register/ManageRegister';
import {
  fetchRegisters,
  registersSelector,
  createRegister,
  updateRegister
} from '../../../modules/register';
import {
  fetchReceiptTemplates,
  receiptTemplatesSelector
} from '../../../modules/retailer';
import { routerReplace } from '../../../modules/app';
import spinnerWhileLoading from '../../common/containers/SpinnerWhileLoadingContainer';

const PAGE_TAG = 'ManageRegisterPage';

const mapStateToProps = state => ({
  register: registersSelector(state)[0],
  receiptTemplates: receiptTemplatesSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      routerReplace,
      createRegister,
      updateRegister
    },
    dispatch
  );

const enhance = compose(connect(mapStateToProps, mapDispatchToProps));

export default spinnerWhileLoading(PAGE_TAG, {
  reducers: {
    fetchRegisters,
    fetchReceiptTemplates
  },
  resolve: async props => {
    if (props.params.id) {
      await props.fetchRegisters({ ids: [props.params.id] });
    }
    await props.fetchReceiptTemplates();
  }
})(enhance(ManageRegister));
