import { compose } from 'redux';
import { connect } from 'react-redux';
import ReportingRegisterClosures from '../components/ReportingRegisterClosures';
import { fetchOutlets, outletsSelector } from '../../../modules/outlet';
import { fetchRegisters, registersSelector } from '../../../modules/register';
import spinnerWhileLoading from '../../common/containers/SpinnerWhileLoadingContainer';

const PAGE_TAG = 'ReportingRegisterClosures';

const mapStateToProps = state => ({
  outlets: outletsSelector(state),
  registers: registersSelector(state)
});

const enhance = compose(connect(mapStateToProps));

export default spinnerWhileLoading(PAGE_TAG, {
  reducers: {
    fetchOutlets,
    fetchRegisters
  },
  resolve: async props => {
    await props.fetchOutlets();
    await props.fetchRegisters();
  }
})(enhance(ReportingRegisterClosures));
