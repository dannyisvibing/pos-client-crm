import { connect } from 'react-redux';
import ProtectedRoute from '../components/ProtectedRoute';
import { hasSessionSelector } from '../../../modules/auth';

const mapStateToProps = state => ({
  hasSession: hasSessionSelector(state)
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProtectedRoute);
