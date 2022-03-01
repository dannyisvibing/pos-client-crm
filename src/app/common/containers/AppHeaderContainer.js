import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withHandlers } from 'recompose';
import AppHeader from '../components/AppHeader';
import withOnlineHandler from './WithOnlineHandler';
import { retailerSettingsSelector } from '../../../modules/retailer';
import { activeUserSelector } from '../../../modules/user';
import { openModal } from '../../../modules/modal';
import ModalTypes from '../../../constants/modalTypes';

const mapStateToProps = state => ({
  retailerSettings: retailerSettingsSelector(state),
  activeUser: activeUserSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      openModal
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withOnlineHandler,
  withHandlers({
    onClickUser: props => () => {
      props.openModal({ type: ModalTypes.RIGHT_SIDEBAR });
    }
  })
);

export default enhance(AppHeader);
