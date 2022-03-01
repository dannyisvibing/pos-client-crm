import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { withHandlers, withState } from 'recompose';
import ReceiptBuilder from '../components/ReceiptBuilder';
import {
  isSaleNotStarted,
  isSaleConfirmed,
  saleInProgressSelector,
  getSaleActionLabel,
  updateCustomer,
  updateLineItem,
  removeLineItem,
  updateSaleNote,
  updateSaleDiscount,
  removeTax,
  resetSale,
  park,
  discard
} from '../../../modules/sale';
import {
  getCustomerById,
  getCustomerGroupById
} from '../../../modules/customer';
import { getCurrentRegisterFromState } from '../../../modules/register';
import { getOutletById } from '../../../modules/outlet';
import { retailerSettingsSelector } from '../../../modules/retailer';
import { openModal } from '../../../modules/modal';
import ModalTypes from '../../../constants/modalTypes';
import withCurrencyFormatter from '../../common/containers/WithCurrencyFormatter';

const mapStateToProps = state => ({
  saleInProgress: saleInProgressSelector(state),
  isSaleConfirmed: isSaleConfirmed(state),
  isSaleNotStarted: isSaleNotStarted(state),
  getCustomer(id) {
    return getCustomerById(state, id);
  },
  getCustomerGroup(id) {
    return getCustomerGroupById(state, id);
  },
  getOutletById(id) {
    return getOutletById(state, id);
  },
  saleActionLabel: getSaleActionLabel(state),
  currentRegister: getCurrentRegisterFromState(state),
  retailerSettings: retailerSettingsSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateCustomer,
      updateLineItem,
      removeLineItem,
      updateSaleDiscount,
      updateSaleNote,
      removeTax,
      resetSale,
      park,
      discard,
      openModal
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withCurrencyFormatter,
  withState('expandedLineItemIndex', 'setExpandedLineItemIndex', -1),
  withState('isOpenDiscountPopover', 'setOpenDiscountPopover', false),
  withState('isOpenTaxPopover', 'setOpenTaxPopover', false),
  withHandlers({
    onDismiss: props => () => {
      const saleInProgress = props.saleInProgress;
      if (saleInProgress.isPristine) {
        props.resetSale();
      } else {
        props.openModal({ type: ModalTypes.WARN_LOST_SALE });
      }
    },
    onPark: props => () => {
      const saleInProgress = props.saleInProgress;
      if (!saleInProgress.saleSafeNote) {
        props.openModal({
          type: ModalTypes.WARN_NO_SALE_NOTE,
          confirmHandler: async newNote => {
            await props.updateSaleNote(newNote);
            props.park();
          }
        });
      } else {
        props.park();
      }
    },
    onDiscard: props => () => {
      props.discard();
    },
    onClickCustomerSuggestion: props => suggestion => {
      props.updateCustomer(suggestion.id);
    },
    onRemoveCustomer: props => e => {
      e.preventDefault();
      props.updateCustomer();
    },
    onRemoveLineItem: props => lineItemIndex => {
      props.removeLineItem(lineItemIndex);
    },
    onChangeLineItem: props => (lineItemIndex, change) => {
      props.updateLineItem(lineItemIndex, change);
    },
    onChangeSafeNote: props => e => {
      props.updateSaleNote(e.target.value);
    },
    onResetSaleDiscount: props => () => {
      props.updateSaleDiscount(null);
    },
    onDiscountTypeChange: props => discountType => {
      props.updateSaleDiscount({ type: discountType });
    },
    onDiscountAmountChange: props => discountAmount => {
      props.updateSaleDiscount({ amount: discountAmount });
    },
    onTaxRemove: props => tax => {
      props.removeTax(tax);
    },
    onClickPay: props => e => {
      e.preventDefault();
      props.openModal({ type: ModalTypes.PAY_PANEL });
    },
    onShowCustomerDetail: props => () => {},
    onClickLineItem: props => lineItemIndex => {
      props.setExpandedLineItemIndex(
        props.expandedLineItemIndex === lineItemIndex ? -1 : lineItemIndex
      );
    },
    onClickDiscount: props => () => {
      props.setOpenDiscountPopover(true);
    },
    onClickTax: props => () => {
      props.setOpenTaxPopover(true);
    },
    onClosePopover: props => () => {
      props.setOpenDiscountPopover(false);
      props.setOpenTaxPopover(false);
    }
  })
);

export default enhance(ReceiptBuilder);
