import React, { PureComponent } from 'react';
import _ from 'lodash';
import moment from 'moment';
import PrimaryLayout, {
  BodyComponent
} from '../../common/legacy/PrimaryContent';
import RegisterClosureSummaryTable from './RegisterClosureSummary';
import { RBForm } from '../../../rombostrap';
import { TextArea, Button } from '../../common/legacy/Basic';
import {
  isCash,
  isCreditCard,
  isGiftCard,
  isLoyalty,
  isStoreCredit
} from '../../../modules/sale/sale.logic';
import CashMovementTypes from '../../../constants/cashMovementTypes';
import '../styles/OpenRegisterClosurePage.css';

class OpenRegisterClosurePage extends PureComponent {
  state = {
    fields: [],
    paidCash: 0,
    paidCreditCard: 0,
    paidGiftCard: 0,
    paidLoyalty: 0,
    paidStoreCredit: 0,
    cashMovements: [],
    countedCash: '',
    countedCreditCard: 0,
    closureNote: '',
    formState: {}
  };

  async componentWillMount() {
    const {
      closure,
      payments,
      getOutletById,
      getRegisterById,
      getUserId,
      fetchCashMovements
    } = this.props;
    const register = getRegisterById(closure.registerId);
    const outlet = getOutletById(register.outletId);

    const fields = [];
    fields.push({ label: 'Outlet', value: outlet.outletName });
    fields.push({ label: 'Register', value: register.registerName });
    fields.push({ label: 'Closure #', value: closure.closureIndex });
    fields.push({
      label: 'Opening Time',
      value: moment(closure.openingTime).format('ddd,Do MMMM,YYYY,h:mma')
    });
    this.setState({ fields });

    const datasource = [];
    const paidCash = this.calcExpectedAmount(payments, isCash);
    const paidCreditCard = this.calcExpectedAmount(payments, isCreditCard);
    const paidGiftCard = this.calcExpectedAmount(payments, isGiftCard);
    const paidLoyalty = this.calcExpectedAmount(payments, isLoyalty);
    const paidStoreCredit = this.calcExpectedAmount(payments, isStoreCredit);
    const profile = getUserId(closure.userId);

    datasource.push({
      time: closure.openingTime,
      userName: profile.displayName,
      amount: closure.openingFloat,
      reason: 'Opening float',
      note: closure.notes
    });

    this.setState({
      paidCash,
      paidCreditCard,
      paidGiftCard,
      paidLoyalty,
      paidStoreCredit,
      cashMovements: datasource
    });

    const result = await fetchCashMovements(
      closure.registerId,
      closure.closureId
    );
    const cashMovements = result.payload.data;

    cashMovements.forEach(move => {
      const profile = getUserId(move.userId);
      let cashIn = true;
      let reason = _.find(CashMovementTypes.add, { value: move.type });
      cashIn = cashIn && reason;
      reason = reason || _.find(CashMovementTypes.remove, { value: move.type });

      datasource.push({
        time: move.movedDate,
        userName: profile.displayName,
        amount: cashIn ? move.amount : -1 * move.amount,
        reason: reason.label,
        note: move.note,
        color: cashIn ? 'positive' : 'negative'
      });
    });

    this.setState({ cashMovements: datasource });
  }

  calcExpectedAmount(payments, whichMethod) {
    return payments
      .filter(payment => whichMethod(payment.methodId))
      .reduce((paidAmount, payment) => {
        paidAmount += payment.amount;
        return paidAmount;
      }, 0);
  }

  handleCountedCashChange = value => {
    this.setState({ countedCash: value });
  };

  handleCountedCreditCardChange = value => {
    this.setState({ countedCreditCard: value });
  };

  handleClosureChange = e => {
    this.setState({ closureNote: e.target.value });
  };

  handleCloseRegisterClosure = () => {
    const { closure, closeRegisterClosure } = this.props;
    const { registerId, closureId } = closure;
    const { countedCash, countedCreditCard } = this.state;
    closeRegisterClosure(registerId, closureId, countedCash, countedCreditCard);
  };

  handleFormStateChange = formState => {
    this.setState({ formState });
  };

  handleFormElementStateChanged = (name, state) => {
    if (!this.formRef) {
      setTimeout(() => {
        this.handleFormElementStateChanged(name, state);
      }, 0);
    } else {
      this.formRef.onStateChanged(name, state);
    }
  };

  render() {
    const { fields } = this.state;
    const { retailerSettings } = this.props;
    const currencySymbol = retailerSettings.currencySymbol || '$';

    return (
      <PrimaryLayout title="Close Register">
        <BodyComponent>
          <div className="wr-register-closure-info-container">
            <div className="wr-register-closure-info-section">
              <h2 className="wr-register-closure-summary-header">
                Register details
              </h2>
              <div className="wr-info-fields register-closure-info-fields">
                {fields.map((field, i) => (
                  <div key={i} className="wr-info-field">
                    <div className="wr-info-field-label">{field.label}</div>
                    <div className="wr-info-field-value">{field.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="wr-register-closure-info-section">
              <RBForm
                ref={c => (this.formRef = c)}
                onFormStateChanged={this.handleFormStateChange}
              >
                <RegisterClosureSummaryTable
                  formState={this.state.formState}
                  currencySymbol={currencySymbol}
                  giftCardEnabled={retailerSettings.giftCardEnabled}
                  loyaltyEnabled={retailerSettings.loyaltyEnabled}
                  storeCreditEnabled={retailerSettings.storeCreditEnabled}
                  paidCash={this.state.paidCash}
                  cashMovements={this.state.cashMovements}
                  paidCreditCard={this.state.paidCreditCard}
                  paidGiftCard={this.state.paidGiftCard}
                  paidLoyalty={this.state.paidLoyalty}
                  paidStoreCredit={this.state.paidStoreCredit}
                  countedCash={this.state.countedCash}
                  countedCreditCard={this.state.countedCreditCard}
                  onCountedCashChange={this.handleCountedCashChange}
                  onCountedCreditCardChange={this.handleCountedCreditCardChange}
                  onFormElementStateChanged={this.handleFormElementStateChanged}
                />
                <TextArea
                  placeholder="Type to add a register closure note"
                  value={this.state.closureNote}
                  onChange={this.handleClosureChange}
                />
                <div className="vd-flex vd-flex--column">
                  <Button
                    big
                    primary
                    classes={{
                      root:
                        'wr-closure-summary-form-close-register-button vd-flex vd-flex--column'
                    }}
                    onClick={this.handleCloseRegisterClosure}
                  >
                    <span>Close Register</span>
                  </Button>
                </div>
              </RBForm>
            </div>
          </div>
        </BodyComponent>
      </PrimaryLayout>
    );
  }
}

export default OpenRegisterClosurePage;
