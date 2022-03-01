import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import yup from 'yup';
import LoginPage from '../components/LoginPage';
import { login } from '../../../modules/auth';

const validationSchema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required()
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      login
    },
    dispatch
  );

const enhance = compose(
  connect(null, mapDispatchToProps),
  withFormik({
    mapPropsToValues: () => ({ username: '', password: '' }),
    validationSchema,
    handleSubmit: async function(values, { props, setErrors, setSubmitting }) {
      setErrors({});
      setSubmitting(true);
      await props.login(values);
    }
  })
);

export default enhance(LoginPage);
