import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withHandlers } from 'recompose';
import SaleLostWarnDialog from '../components/SaleLostWarnDialog';
import { saleInProgressSelector, resetSale } from '../../../modules/sale';
import { isModalOpenSelector, closeModal } from '../../../modules/modal';
import ModalTypes from '../../../constants/modalTypes';

const mapStateToProps = state => ({
  isOpen: isModalOpenSelector(ModalTypes.WARN_LOST_SALE)(state),
  saleInProgress: saleInProgressSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      closeModal,
      resetSale
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    onRequestClose: props => () => {
      props.closeModal(ModalTypes.WARN_LOST_SALE);
    },
    onContinueSale: props => () => {
      props.closeModal(ModalTypes.WARN_LOST_SALE);
    },
    onDiscardChanges: props => () => {
      props.closeModal(ModalTypes.WARN_LOST_SALE);
      props.resetSale();
    }
  })
);

export default enhance(SaleLostWarnDialog);
