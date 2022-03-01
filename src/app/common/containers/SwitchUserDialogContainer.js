import _ from 'lodash';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withHandlers, withStateHandlers } from 'recompose';
import SwitchUserDialog from '../components/SwitchUserDialog';
import {
  openModal,
  closeModal,
  isModalOpenSelector
} from '../../../modules/modal';
import { usersSelector, activeUserSelector } from '../../../modules/user';
import ModalTypes from '../../../constants/modalTypes';

const mapStateToProps = state => ({
  users: usersSelector(state),
  activeUser: activeUserSelector(state),
  isOpen: isModalOpenSelector(ModalTypes.SWITCH_DIALOG)(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      closeModal,
      openModal
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStateHandlers(({ users }) => ({ name: '', filteredUsers: users }), {
    onNameChange: (state, { users }) => name => ({
      name,
      filteredUsers: _.filter(users, user => {
        return user.displayName.toLowerCase().indexOf(name.toLowerCase()) > -1;
      })
    })
  }),
  withHandlers({
    onRequestClose: props => () => {
      props.closeModal(ModalTypes.SWITCH_DIALOG);
    },
    onSelectUser: props => async user => {
      await props.closeModal(ModalTypes.SWITCH_DIALOG);
      if (props.activeUser.userId !== user.userId) {
        props.openModal({
          type: ModalTypes.CONFIRM_USER_SWITCH,
          user
        });
      }
    }
  })
);

export default enhance(SwitchUserDialog);
