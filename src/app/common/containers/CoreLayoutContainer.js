import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateLocale, availableLocalesSelector } from '../../../modules/i18n';
import TrackUserProvider from './TrackUserProvider';
import CoreLayout from '../components/CoreLayout';

const mapDispatchToProps = {
  updateLocale
};

const mapStateToProps = state => ({
  noLocales: availableLocalesSelector(state).length === 0
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TrackUserProvider(CoreLayout))
);
