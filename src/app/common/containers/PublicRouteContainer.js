import { connect } from 'react-redux';
import PublicRoute from '../components/PublicRoute';
import { hasSessionSelector } from '../../../modules/auth';

const mapStateToProps = state => ({
  hasSession: hasSessionSelector(state)
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PublicRoute);
