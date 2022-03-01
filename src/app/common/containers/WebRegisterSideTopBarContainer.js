import React from 'react';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { withHandlers, renderComponent, branch } from 'recompose';
import WebRegisterSideTopBar from '../components/WebRegisterSideTopBar';
import { getCurrentRegisterFromState } from '../../../modules/register';
import { getOutletById } from '../../../modules/outlet';
import { isSalePristineSelector, park } from '../../../modules/sale';
import { openModal } from '../../../modules/modal';
import ModalTypes from '../../../constants/modalTypes';

const mapStateToProps = state => ({
  currentRegister: getCurrentRegisterFromState(state),
  getOutletById(id) {
    return getOutletById(state, id);
  },
  isSalePristine: isSalePristineSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      openModal,
      park
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    onClickSwitch: props => () => {
      if (props.isSalePristine) {
        props.openModal({ type: ModalTypes.SELECT_REGISTER });
      } else {
        props.openModal({
          type: ModalTypes.SALE_CHANGE_CONFIRM,
          confirmHandler: async () => {
            await props.park();
            props.openModal({ type: ModalTypes.SELECT_REGISTER });
          }
        });
      }
    }
  })
);

export default compose(
  connect(mapStateToProps),
  branch(props => !props.currentRegister, renderComponent(() => <div />))
)(enhance(WebRegisterSideTopBar));
