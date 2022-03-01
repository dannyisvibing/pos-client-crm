import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { withHandlers } from 'recompose';
import PaymentControlPanel from '../components/PaymentControlPanel';
import {
  saleInProgressSelector,
  getSaleActionLabel,
  updateTenderAmount,
  paymentMethodsSelector,
  pay
} from '../../../modules/sale';
import {
  getCustomerById,
  getCustomerGroupById
} from '../../../modules/customer';
import { closeModal } from '../../../modules/modal';
import ModalTypes from '../../../constants/modalTypes';
import withCurrencyFormatter from '../../common/containers/WithCurrencyFormatter';

const mapStateToProps = state => ({
  saleInProgress: saleInProgressSelector(state),
  saleActionLabel: getSaleActionLabel(state),
  paymentMethods: paymentMethodsSelector(state),
  getCustomer(id) {
    return getCustomerById(state, id);
  },
  getCustomerGroup(id) {
    return getCustomerGroupById(state, id);
  }
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateTenderAmount,
      closeModal,
      pay
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withCurrencyFormatter,
  withHandlers({
    onClickBack: props => () => {
      props.closeModal(ModalTypes.PAY_PANEL);
    },
    onTenderedAmountChange: props => tenderedAmount => {
      props.updateTenderAmount(tenderedAmount);
    },
    onPay: props => async paymentMethodId => {
      await props.pay(paymentMethodId);
      props.closeModal(ModalTypes.PAY_PANEL);
    }
  })
);

export default enhance(PaymentControlPanel);
