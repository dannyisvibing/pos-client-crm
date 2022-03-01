import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { withFormik } from 'formik';
import Address from '../components/Address';
import {
  retailerContactSelector,
  updateRetailerContact
} from '../../../modules/retailer';

const mapStateToProps = state => ({
  retailerContact: retailerContactSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateRetailerContact
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFormik({
    mapPropsToValues: props => ({ ...props.retailerContact }),
    handleSubmit: async function(values, { props, setErrors, setSubmitting }) {
      await props.updateRetailerContact(values);
    }
  })
);

export default enhance(Address);
