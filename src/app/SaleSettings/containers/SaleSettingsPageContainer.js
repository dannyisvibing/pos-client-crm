import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SaleSettingsPage from '../components/SaleSettingsPage';
import { routerPush } from '../../../modules/app';
import {
  createQkLayout,
  fetchQkLayout,
  qkLayoutsSelector
} from '../../../modules/sale';
import {
  fetchRegisters,
  updateRegister,
  getCurrentRegisterFromState
} from '../../../modules/register';
import { fetchOutlets } from '../../../modules/outlet';
import spinnerWhileLoading from '../../common/containers/SpinnerWhileLoadingContainer';
import { withHandlers } from 'recompose';

const PAGE_TAG = 'SaleSettingsPage';

const mapStateToProps = state => ({
  getCurrentRegister() {
    return getCurrentRegisterFromState(state);
  },
  qkLayouts: qkLayoutsSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      routerPush,
      updateRegister,
      createQkLayout
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    onEnableQuickKey: props => event => {
      const isEnabled = event.target.checked;
      const currentRegisterId = props.getCurrentRegister().registerId;
      props.updateRegister(currentRegisterId, { qklayoutEnabled: isEnabled });
    },
    onAddNewLayout: props => async event => {
      event.preventDefault();
      const result = await props.createQkLayout();
      const newQkLayout = result.payload.data;
      props.routerPush(
        `/webregister/settings/quickkeys/${newQkLayout.qkLayoutId}`
      );
    },
    onSetActive: props => async qkLayout => {
      const currentRegisterId = props.getCurrentRegister().registerId;
      props.updateRegister(currentRegisterId, {
        currentQklayoutId: qkLayout.qkLayoutId
      });
    },
    onEditLayout: props => qkLayout => {
      props.routerPush(
        `/webregister/settings/quickkeys/${qkLayout.qkLayoutId}`
      );
    },
    onDuplicateLayout: props => async qkLayout => {},
    onRemoveLayout: props => async qkLayout => {}
  })
);

export default spinnerWhileLoading(PAGE_TAG, {
  reducers: {
    fetchQkLayout,
    fetchOutlets,
    fetchRegisters
  },
  resolve: async props => {
    await props.fetchQkLayout();
    await props.fetchOutlets();
    await props.fetchRegisters();
  }
})(enhance(SaleSettingsPage));
