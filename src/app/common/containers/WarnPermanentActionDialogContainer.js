import { connect } from 'react-redux';
import WarnPermanentActionDialog from '../components/WarnPermanentActionDialog';
import {
  isModalOpenSelector,
  optionsSelector,
  closeModal
} from '../../../modules/modal';
import ModalTypes from '../../../constants/modalTypes';
import { compose, bindActionCreators } from 'redux';
import { withHandlers } from 'recompose';

const mapStateToProps = state => ({
  isOpen: isModalOpenSelector(ModalTypes.WARN_PERMANENT_ACTION)(state),
  modalOptions: optionsSelector(ModalTypes.WARN_PERMANENT_ACTION)(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      closeModal
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    onCloseDialog: props => () => {
      props.closeModal(ModalTypes.WARN_PERMANENT_ACTION);
    },
    onConfirmAction: props => () => {
      props.modalOptions.confirmHandler();
      props.closeModal(ModalTypes.WARN_PERMANENT_ACTION);
    }
  })
);

export default enhance(WarnPermanentActionDialog);
