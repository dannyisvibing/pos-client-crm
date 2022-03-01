import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { branch, renderComponent } from 'recompose';
import OpenRegisterPanel from '../../common/containers/OpenRegisterPanelContainer';
import OpenRegisterClosurePage from '../components/OpenRegisterClosurePage';
import { retailerSettingsSelector } from '../../../modules/retailer';
import {
  fetchRegisters,
  getCurrentRegisterFromApi,
  getRegisterById
} from '../../../modules/register';
import {
  fetchClosures,
  fetchCashMovements,
  closuresSelector,
  fetchPayments,
  closeRegisterClosure,
  paymentsSelector
} from '../../../modules/sale';
import { fetchOutlets, getOutletById } from '../../../modules/outlet';
import { getUserById } from '../../../modules/user';
import spinnerWhileLoading from '../../common/containers/SpinnerWhileLoadingContainer';

const PAGE_TAG = 'OpenRegisterClosurePage';

const mapStateToProps = state => ({
  retailerSettings: retailerSettingsSelector(state),
  closure: closuresSelector(state)[0],
  getRegisterById(id) {
    return getRegisterById(state, id);
  },
  getOutletById(id) {
    return getOutletById(state, id);
  },
  payments: paymentsSelector(state),
  getUserId(id) {
    return getUserById(state, id);
  }
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchCashMovements,
      closeRegisterClosure
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  branch(props => !Boolean(props.closure), renderComponent(OpenRegisterPanel))
);

export default spinnerWhileLoading(PAGE_TAG, {
  reducers: {
    fetchOutlets,
    fetchRegisters,
    fetchClosures,
    fetchPayments
  },
  resolve: async props => {
    const result = await props.fetchRegisters();
    const payload = result.payload.data;
    const currentRegister = getCurrentRegisterFromApi(payload.data);
    await props.fetchOutlets({ ids: [currentRegister.outletId] });
    await props.fetchClosures(currentRegister.registerId, {
      ids: [currentRegister.openingClosureId]
    });
    await props.fetchPayments({ closureId: currentRegister.openingClosureId });
  }
})(enhance(OpenRegisterClosurePage));
