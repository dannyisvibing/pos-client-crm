import { connect } from 'react-redux';
import OfflineNotificationDialog from '../components/OfflineNotificationDialog';
import { routerPush } from '../../../modules/app';
import { isModalOpenSelector, closeModal } from '../../../modules/modal';
import ModalTypes from '../../../constants/modalTypes';
import { compose, bindActionCreators } from 'redux';
import { withHandlers } from 'recompose';

const mapStateToProps = state => ({
  isOpen: isModalOpenSelector(ModalTypes.OFFLINE_NOTIFICATION)(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      closeModal,
      routerPush
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    onRequestClose: () => () => {},
    onGoto: props => () => {
      props.closeModal(ModalTypes.OFFLINE_NOTIFICATION);
      props.routerPush('/webregister');
    }
  })
);

export default enhance(OfflineNotificationDialog);
