import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ViewConsignment from '../legacy/ViewConsignment';
import { retailerSettingsSelector } from '../../../modules/retailer';
import { routerReplace } from '../../../modules/app';

const mapStateToProps = state => ({
  retailerSettings: retailerSettingsSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      routerReplace
    },
    dispatch
  );

const enhance = compose(connect(mapStateToProps, mapDispatchToProps));

export default enhance(ViewConsignment);
