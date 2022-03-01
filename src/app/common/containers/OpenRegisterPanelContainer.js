import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { withFormik } from 'formik';
import yup from 'yup';
import OpenRegisterPanel from '../components/OpenRegisterPanel';
import { getCurrentRegisterFromState } from '../../../modules/register';
import { openRegisterClosure } from '../../../modules/sale';

const validationSchema = yup.object().shape({
  openingFloat: yup.number().required(),
  openingNotes: yup.string().required()
});

const mapStateToProps = state => ({
  getCurrentRegister() {
    return getCurrentRegisterFromState(state);
  }
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      openRegisterClosure
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFormik({
    mapPropsToValues: () => ({ openingFloat: '', openingNotes: '' }),
    validationSchema,
    handleSubmit: async function(values, { props, setSubmitting }) {
      setSubmitting(true);
      const register = props.getCurrentRegister();
      const closure = {
        closureIndex: register.nextClosureIndex || 1,
        outletId: register.outletId,
        registerId: register.registerId,
        openingFloat: values.openingFloat,
        notes: values.openingNotes
      };
      await props.openRegisterClosure(register.registerId, closure);
      setSubmitting(false);
    }
  })
);

export default enhance(OpenRegisterPanel);
