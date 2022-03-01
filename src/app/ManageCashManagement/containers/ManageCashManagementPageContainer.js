import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { branch, renderComponent, withState, withHandlers } from 'recompose';
import ManageCashManagementPage from '../components/ManageCashManagementPage';
import OpenRegisterPanel from '../../common/containers/OpenRegisterPanelContainer';
import {
  fetchRegisters,
  getCurrentRegisterFromApi
} from '../../../modules/register';
import { activeUserSelector } from '../../../modules/user';
import {
  fetchClosures,
  fetchCashMovements,
  createCashMovement,
  closuresSelector,
  generateCashMovementsTableDatasource
} from '../../../modules/sale';
import spinnerWhileLoading from '../../common/containers/SpinnerWhileLoadingContainer';

const PAGE_TAG = 'ManageCashManagementCash';

const mapStateToProps = state => ({
  activeUser: activeUserSelector(state),
  closure: closuresSelector(state)[0],
  datasource: generateCashMovementsTableDatasource(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createCashMovement
    },
    dispatch
  );

const enhance = compose(
  withState('dialogState', 'setDialogState', {
    isOpen: false,
    isAdding: false
  }),
  connect(mapStateToProps, mapDispatchToProps),
  branch(props => !Boolean(props.closure), renderComponent(OpenRegisterPanel)),
  withHandlers({
    onToggleDialog: props => isAdding => {
      props.setDialogState({
        isOpen: !props.dialogState.isOpen,
        isAdding
      });
    },
    onSubmit: props => async form => {
      const { closureId, registerId } = props.closure;
      const cashMovement = {
        closureId,
        userId: props.activeUser.userId,
        amount: form.cashAmount,
        type: form.option,
        note: form.note
      };
      await props.createCashMovement(registerId, closureId, cashMovement);
      props.setDialogState({ isOpen: false });
    }
  })
);

export default spinnerWhileLoading(PAGE_TAG, {
  reducers: {
    fetchRegisters,
    fetchClosures,
    fetchCashMovements
  },
  resolve: async props => {
    const result = await props.fetchRegisters();
    const payload = result.payload.data;
    const currentRegister = getCurrentRegisterFromApi(payload.data);
    await props.fetchClosures(currentRegister.registerId, {
      ids: [currentRegister.openingClosureId]
    });
    if (currentRegister.openingClosureId) {
      await props.fetchCashMovements(
        currentRegister.registerId,
        currentRegister.openingClosureId
      );
    }
  }
})(enhance(ManageCashManagementPage));
