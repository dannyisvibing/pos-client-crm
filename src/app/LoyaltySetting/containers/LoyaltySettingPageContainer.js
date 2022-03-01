import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { withFormik } from 'formik';
import LoyaltySettingPage from '../components/LoyaltySettingPage';
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
  withFormik({
    mapPropsToValues: props => ({ ...props.retailerSettings }),
    handleSubmit: function(values, { props }) {
      props.updateRetailerSettings(values);
    }
  })
);

export default enhance(LoyaltySettingPage);
