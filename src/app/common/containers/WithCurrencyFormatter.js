import { compose } from 'redux';
import { connect } from 'react-redux';
import { withHandlers } from 'recompose';
import { retailerSettingsSelector } from '../../../modules/retailer';
import currencyFormatter from '../../../utils/currencyFormatter';

const mapStateToProps = state => ({
  retailerSettings: retailerSettingsSelector(state)
});

export default compose(
  connect(mapStateToProps),
  withHandlers({
    formatCurrency: props => number => {
      const defaultCurrency = props.retailerSettings.defaultCurrency;
      return currencyFormatter({
        currencySymbol: defaultCurrency
      })(number);
    }
  })
);
