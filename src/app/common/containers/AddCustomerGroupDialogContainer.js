import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import { withHandlers } from 'recompose';
import yup from 'yup';
import AddCustomerGroupDialog from '../components/AddCustomerGroupDialog';
import {
  getCustomerGroupById,
  createCustomerGroup
} from '../../../modules/customer';
import {
  isModalOpenSelector,
  optionsSelector,
  closeModal
} from '../../../modules/modal';
import ModalTypes from '../../../constants/modalTypes';

const validationSchema = yup.object().shape({
  name: yup.string().required()
});

const mapStateToProps = state => ({
  isOpen: isModalOpenSelector(ModalTypes.CUSTOMER_GROUP)(state),
  getCustomerGroup() {
    const options = optionsSelector(ModalTypes.CUSTOMER_GROUP)(state);
    return getCustomerGroupById(state, options.id);
  }
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      closeModal,
      createCustomerGroup
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFormik({
    mapPropsToValues: props => ({ ...props.getCustomerGroup() }),
    validationSchema,
    handleSubmit: async function(values, { props, setErrors, setSubmitting }) {
      const { name } = values;
      if (props.getCustomerGroup().id) {
      } else {
        await props.createCustomerGroup(name);
      }
      props.closeModal(ModalTypes.CUSTOMER_GROUP);
    }
  }),
  withHandlers({
    onChange: props => value => {
      props.setFieldValue('name', value);
    },
    onBlur: props => () => {
      props.setFieldTouched('name', true);
    },
    onCloseModal: props => () => {
      props.closeModal(ModalTypes.CUSTOMER_GROUP);
    }
  })
);

export default enhance(AddCustomerGroupDialog);
