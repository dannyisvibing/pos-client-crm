import React from 'react';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import {
  withStateHandlers,
  withHandlers,
  branch,
  renderComponent
} from 'recompose';
import SelectRegisterDialog from '../components/SelectRegisterDialog';
import { myOutletsSelector } from '../../../modules/outlet';
import {
  registersSelector,
  getCurrentRegisterFromState,
  setCurrentRegister
} from '../../../modules/register';
import { isModalOpenSelector, closeModal } from '../../../modules/modal';
import ModalTypes from '../../../constants/modalTypes';

const mapStateToProps = state => ({
  outlets: myOutletsSelector(state),
  registers: registersSelector(state),
  currentRegister: getCurrentRegisterFromState(state),
  isOpen: isModalOpenSelector(ModalTypes.SELECT_REGISTER)(state)
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
  withStateHandlers(
    ({ outlets }) => ({
      selectedOutletId: outlets[0].outletId
    }),
    {
      selectOutlet: () => id => ({
        selectedOutletId: id
      })
    }
  ),
  withHandlers({
    onRequestClose: props => () => {
      props.closeModal(ModalTypes.SELECT_REGISTER);
    },
    onSelectRegister: props => registerId => {
      // props.closeModal(ModalTypes.SELECT_REGISTER);
      setCurrentRegister(registerId);
      window.location = window.location;
    }
  })
);

export default compose(
  connect(mapStateToProps),
  branch(props => !props.outlets[0], renderComponent(() => <div />))
)(enhance(SelectRegisterDialog));
