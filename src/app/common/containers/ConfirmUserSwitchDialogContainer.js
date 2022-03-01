import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withHandlers, withStateHandlers } from 'recompose';
import ConfirmUserSwitchDialog from '../components/ConfirmUserSwitchDialog';
import {
  openModal,
  closeModal,
  isModalOpenSelector,
  optionsSelector
} from '../../../modules/modal';
import { login, getSession } from '../../../modules/auth';
import ModalTypes from '../../../constants/modalTypes';

const mapStateToProps = state => ({
  isOpen: isModalOpenSelector(ModalTypes.CONFIRM_USER_SWITCH)(state),
  options: optionsSelector(ModalTypes.CONFIRM_USER_SWITCH)(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      login,
      getSession,
      openModal,
      closeModal
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStateHandlers(() => ({ password: '' }), {
    onChangePassword: () => password => ({ password })
  }),
  withHandlers({
    onRequestClose: props => () => {
      props.closeModal(ModalTypes.CONFIRM_USER_SWITCH);
    },
    onChooseAnotherUser: props => () => {
      props.openModal({ type: ModalTypes.SWITCH_DIALOG });
    },
    onSwitchUser: props => async e => {
      e.preventDefault();
      try {
        await props.getSession({
          username: props.options.user.userEmail,
          password: props.password
        });
        window.location = window.location;
      } catch (error) {
        console.log('error: ', error);
      }
    }
  })
);

export default enhance(ConfirmUserSwitchDialog);
