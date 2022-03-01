import { connect } from 'react-redux';
import MustReturnToSaleDialog from '../components/MustReturnToSaleDialog';
import {
  isModalOpenSelector,
  optionsSelector,
  closeModal
} from '../../../modules/modal';
import ModalTypes from '../../../constants/modalTypes';
import { compose, bindActionCreators } from 'redux';
import { withHandlers } from 'recompose';

const mapStateToProps = state => ({
  isOpen: isModalOpenSelector(ModalTypes.MUST_RETURN_TO_SALE)(state),
  modalOptions: optionsSelector(ModalTypes.MUST_RETURN_TO_SALE)(state)
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
      props.closeModal(ModalTypes.MUST_RETURN_TO_SALE);
    },
    onConfirmAction: props => () => {
      props.modalOptions.confirmHandler();
      props.closeModal(ModalTypes.MUST_RETURN_TO_SALE);
    }
  })
);

export default enhance(MustReturnToSaleDialog);
