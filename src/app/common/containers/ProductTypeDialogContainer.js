import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import { createSelector } from 'reselect';
import { withHandlers } from 'recompose';
import yup from 'yup';
import ProductTypeDialog from '../components/ProductTypeDialog';
import {
  typesSelector,
  getTypeById,
  createType,
  updateType
} from '../../../modules/product';
import {
  isModalOpenSelector,
  optionsSelector,
  closeModal
} from '../../../modules/modal';
import ModalTypes from '../../../constants/modalTypes';

const validationSchema = yup.object().shape({
  name: yup.string().required()
});

const typeSelector = createSelector(
  [typesSelector, optionsSelector(ModalTypes.PRODUCT_TYPES)],
  (types, options) => getTypeById(types, options.id)
);

const mapStateToProps = state => ({
  isOpen: isModalOpenSelector(ModalTypes.PRODUCT_TYPES)(state),
  type: typeSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      closeModal,
      createType,
      updateType
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: props => ({ ...props.type }),
    validationSchema,
    handleSubmit: async function(values, { props, setErrors, setSubmitting }) {
      const { name } = values;
      if (props.type.id) {
        await props.updateType({
          id: props.type.id,
          name
        });
      } else {
        await props.createType(name);
      }
      props.closeModal(ModalTypes.PRODUCT_TYPES);
    }
  }),
  withHandlers({
    onChange: props => value => {
      props.setFieldValue('name', value);
    },
    onBlur: props => () => {
      props.setFieldTouched('name', true);
    }
  })
);

export default enhance(ProductTypeDialog);
