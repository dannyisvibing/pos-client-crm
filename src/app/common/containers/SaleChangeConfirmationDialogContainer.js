import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withHandlers } from 'recompose';
import SaleChangeConfirmationDialog from '../components/SaleChangeConfirmationDialog';
import {
  isModalOpenSelector,
  optionsSelector,
  closeModal
} from '../../../modules/modal';
import ModalTypes from '../../../constants/modalTypes';

const mapStateToProps = state => ({
  isOpen: isModalOpenSelector(ModalTypes.SALE_CHANGE_CONFIRM)(state),
  options: optionsSelector(ModalTypes.SALE_CHANGE_CONFIRM)(state)
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
    onRequestClose: props => () => {
      props.closeModal(ModalTypes.SALE_CHANGE_CONFIRM);
    },
    onReturn: props => async () => {
      await props.closeModal(ModalTypes.SALE_CHANGE_CONFIRM);
      if (props.options.onReturnHandler) {
        props.options.onReturnHandler();
      }
    },
    onConfirm: props => async () => {
      await props.closeModal(ModalTypes.SALE_CHANGE_CONFIRM);
      if (props.options.confirmHandler) {
        props.options.confirmHandler();
      }
    }
  })
);

export default enhance(SaleChangeConfirmationDialog);
