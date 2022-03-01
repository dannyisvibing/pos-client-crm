import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withHandlers } from 'recompose';
import StoreCreditSettingPage from '../components/StoreCreditSettingsPage';
import {
  retailerSettingsSelector,
  updateRetailerSettings
} from '../../../modules/retailer';

const mapStateToProps = state => ({
  retailerSettings: retailerSettingsSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateRetailerSettings
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    onEnableStoreCredit: props => e => {
      const enabled = e.target.checked;
      props.updateRetailerSettings({
        ...props.retailerSettings,
        storeCreditEnabled: enabled
      });
    }
  })
);

export default enhance(StoreCreditSettingPage);
