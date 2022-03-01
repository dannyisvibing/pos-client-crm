import { compose } from 'redux';
import { connect } from 'react-redux';
import spinnerWhileLoading from '../../common/containers/SpinnerWhileLoadingContainer';
import PricebooksHomePage from '../components/PricebooksHomePage';
import { fetchPricebooks } from '../../../modules/pricebook';

const PAGE_TAG = 'PricebookHomePage';

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

const enhance = compose(connect(mapStateToProps, mapDispatchToProps));

export default spinnerWhileLoading(PAGE_TAG, {
  reducers: {
    fetchPricebooks
  },
  resolve: async props => {
    await props.fetchPricebooks();
  }
})(enhance(PricebooksHomePage));
