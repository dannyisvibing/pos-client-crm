import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withHandlers, withState } from 'recompose';
import WarnNoSaleNoteDialog from '../components/WarnNoSaleNoteDialog';
import {
  isModalOpenSelector,
  optionsSelector,
  closeModal
} from '../../../modules/modal';
import { saleInProgressSelector } from '../../../modules/sale';
import ModalTypes from '../../../constants/modalTypes';

const mapStateToProps = state => ({
  isOpen: isModalOpenSelector(ModalTypes.WARN_NO_SALE_NOTE)(state),
  modalOptions: optionsSelector(ModalTypes.WARN_NO_SALE_NOTE)(state),
  saleInProgress: saleInProgressSelector(state)
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
  withState('note', 'setNote', ''),
  withHandlers({
    onRequestClose: props => () => {
      props.closeModal(ModalTypes.WARN_NO_SALE_NOTE);
    },
    onParkSale: props => () => {
      props.modalOptions.confirmHandler(props.note);
      props.closeModal(ModalTypes.WARN_NO_SALE_NOTE);
    },
    onNoteChange: props => e => {
      props.setNote(e.target.value);
    }
  })
);

export default enhance(WarnNoSaleNoteDialog);
