import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import { createSelector } from 'reselect';
import { withHandlers } from 'recompose';
import yup from 'yup';
import ProductBrandDialog from '../components/ProductBrandDialog';
import {
  brandsSelector,
  getBrandById,
  createBrand,
  updateBrand
} from '../../../modules/product';
import {
  isModalOpenSelector,
  optionsSelector,
  closeModal
} from '../../../modules/modal';
import ModalTypes from '../../../constants/modalTypes';

const validationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string()
});

const brandSelector = createSelector(
  [brandsSelector, optionsSelector(ModalTypes.PRODUCT_BRANDS)],
  (brands, options) => getBrandById(brands, options.id)
);

const mapStateToProps = state => ({
  isOpen: isModalOpenSelector(ModalTypes.PRODUCT_BRANDS)(state),
  brand: brandSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      closeModal,
      createBrand,
      updateBrand
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: props => ({ ...props.brand }),
    validationSchema,
    handleSubmit: async function(values, { props }) {
      const { name, description } = values;
      const brand = { name, description };
      if (props.brand.id) {
        await props.updateBrand(props.brand.id, brand);
      } else {
        await props.createBrand(brand);
      }
      props.closeModal(ModalTypes.PRODUCT_BRANDS);
    }
  }),
  withHandlers({
    onNameChange: props => value => {
      props.setFieldValue('name', value);
    },
    onNameBlur: props => () => {
      props.setFieldTouched('name', true);
    },
    onCloseDialog: props => () => {
      props.closeModal(ModalTypes.PRODUCT_BRANDS);
    }
  })
);

export default enhance(ProductBrandDialog);
