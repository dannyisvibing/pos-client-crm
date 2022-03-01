import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import { createSelector } from 'reselect';
import { withHandlers } from 'recompose';
import yup from 'yup';
import ProductTagDialog from '../components/ProductTagDialog';
import {
  tagsSelector,
  getTagById,
  createTag,
  updateTag
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

const tagSelector = createSelector(
  [tagsSelector, optionsSelector(ModalTypes.PRODUCT_TAGS)],
  (tags, options) => getTagById(tags, options.id)
);

const mapStateToProps = state => ({
  isOpen: isModalOpenSelector(ModalTypes.PRODUCT_TAGS)(state),
  tag: tagSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      closeModal,
      createTag,
      updateTag
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFormik({
    enableReinitialize: true,
    mapPropsToValues: props => ({ ...props.tag }),
    validationSchema,
    handleSubmit: async function(values, { props }) {
      const { name } = values;
      if (props.tag.id) {
        await props.updateTag({ id: props.tag.id, name });
      } else {
        await props.createTag(name);
      }
      props.closeModal(ModalTypes.PRODUCT_TAGS);
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

export default enhance(ProductTagDialog);
