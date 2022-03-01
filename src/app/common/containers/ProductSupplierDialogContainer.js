import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import { createSelector } from 'reselect';
import { withHandlers } from 'recompose';
import yup from 'yup';
import ProductSupplierDialog from '../components/ProductSupplierDialog';
import {
  suppliersSelector,
  getSupplierById,
  createSupplier,
  updateSupplier
} from '../../../modules/product';
import {
  isModalOpenSelector,
  optionsSelector,
  closeModal
} from '../../../modules/modal';
import ModalTypes from '../../../constants/modalTypes';

const validationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  defaultMarkup: yup.number()
});

const supplierSelector = createSelector(
  [suppliersSelector, optionsSelector(ModalTypes.PRODUCT_SUPPLIERS)],
  (suppliers, options) => getSupplierById(suppliers, options.id)
);

const mapStateToProps = state => ({
  isOpen: isModalOpenSelector(ModalTypes.PRODUCT_SUPPLIERS)(state),
  supplier: supplierSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      closeModal,
      createSupplier,
      updateSupplier
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: props => ({ ...props.supplier }),
    validationSchema,
    handleSubmit: async function(values, { props, setErrors, setSubmitting }) {
      const { name, description, defaultMarkup } = values;
      const supplier = { name, description, defaultMarkup };
      if (props.supplier.id) {
        await props.updateSupplier(props.supplier.id, supplier);
      } else {
        await props.createSupplier(supplier);
      }
      props.closeModal(ModalTypes.PRODUCT_SUPPLIERS);
    }
  }),
  withHandlers({
    onNameChange: props => value => {
      props.setFieldValue('name', value);
    },
    onNameBlur: props => () => {
      props.setFieldTouched('name', true);
    },
    onMarkupChange: props => value => {
      props.setFieldValue('defaultMarkup', value);
    },
    onMarkupBlur: props => () => {
      props.setFieldTouched('defaultMarkup', true);
    },
    onCloseDialog: props => () => {
      props.closeModal(ModalTypes.PRODUCT_SUPPLIERS);
    }
  })
);

export default enhance(ProductSupplierDialog);
