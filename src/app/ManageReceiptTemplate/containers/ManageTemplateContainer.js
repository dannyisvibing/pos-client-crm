import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import ManageTemplate from '../legacy/ManageTemplate';
import {
  fetchReceiptTemplates,
  createReceiptTemplate,
  receiptTemplatesSelector
} from '../../../modules/retailer';
import { routerReplace } from '../../../modules/app';
import spinnerWhileLoading from '../../common/containers/SpinnerWhileLoadingContainer';

const PAGE_TAG = 'ManageTemplate';

const mapStateToProps = state => ({
  receiptTemplates: receiptTemplatesSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createReceiptTemplate,
      routerReplace
    },
    dispatch
  );

const enhance = compose(connect(mapStateToProps, mapDispatchToProps));

export default spinnerWhileLoading(PAGE_TAG, {
  reducers: {
    fetchReceiptTemplates
  },
  resolve: async props => {
    const { params } = props;
    await props.fetchReceiptTemplates({ ids: [params.id] });
  }
})(enhance(ManageTemplate));
