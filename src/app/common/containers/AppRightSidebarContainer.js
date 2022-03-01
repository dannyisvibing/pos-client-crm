import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withHandlers } from 'recompose';
import AppRightSidebar from '../components/AppRightSidebar';
import { logout } from '../../../modules/auth';
import { activeUserSelector } from '../../../modules/user';
import {
  openModal,
  closeModal,
  isModalOpenSelector
} from '../../../modules/modal';
import ModalTypes from '../../../constants/modalTypes';

const mapStateToProps = state => ({
  activeUser: activeUserSelector(state),
  isOpen: isModalOpenSelector(ModalTypes.RIGHT_SIDEBAR)(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      closeModal,
      openModal,
      logout
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    onRequestClose: props => () => {
      props.closeModal(ModalTypes.RIGHT_SIDEBAR);
    },
    onSwitchUser: props => () => {
      props.openModal({ type: ModalTypes.SWITCH_DIALOG });
    },
    onSignOut: props => e => {
      e.preventDefault();
      props.closeModal(ModalTypes.RIGHT_SIDEBAR);
      props.logout();
    }
  })
);

export default enhance(AppRightSidebar);
