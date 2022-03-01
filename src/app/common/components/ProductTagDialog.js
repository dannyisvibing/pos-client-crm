import React from 'react';
import PropTypes from 'prop-types';
import RBDialog, {
  RBDialogHeader,
  RBDialogContent,
  RBDialogActions
} from '../../../rombostrap/components/RBDialog';
import RBField, {
  RBLabel,
  RBValue
} from '../../../rombostrap/components/RBField';
import { RBHeader, RBInput, RBButton } from '../../../rombostrap';
import ModalTypes from '../../../constants/modalTypes';

const ProductTagsDialog = props => {
  const { isOpen, values, isValid, isSubmitting } = props;
  return (
    <RBDialog
      size="small"
      open={isOpen}
      onRequestClose={() => props.closeModal(ModalTypes.PRODUCT_TAGS)}
    >
      <form onSubmit={props.handleSubmit}>
        <RBDialogHeader>
          <RBHeader category="dialog">New Tag</RBHeader>
        </RBDialogHeader>
        <RBDialogContent>
          <RBField>
            <RBLabel>Tag name</RBLabel>
            <RBValue>
              <RBInput
                value={values.name}
                onInputChange={props.onChange}
                onBlur={props.onBlur}
              />
            </RBValue>
          </RBField>
        </RBDialogContent>
        <RBDialogActions>
          <RBButton category="primary" disabled={!isValid || isSubmitting}>
            Add Tag
          </RBButton>
        </RBDialogActions>
      </form>
    </RBDialog>
  );
};

const { func, object, bool } = PropTypes;
ProductTagsDialog.propTypes = {
  isOpen: bool,
  values: object.isRequired,
  touched: object.isRequired,
  errors: object.isRequired,
  isValid: bool,
  isSubmitting: bool,
  setFieldValue: func.isRequired,
  setFieldTouched: func.isRequired,
  handleSubmit: func.isRequired,
  closeModal: func.isRequired
};

export default ProductTagsDialog;
