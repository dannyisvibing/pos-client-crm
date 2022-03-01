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
import { RBHeader, RBButton, RBTextArea } from '../../../rombostrap';
import RBInput from '../../../rombostrap/components/RBInput';
// import RBInput, { RBInputErrorMessageSection } from '../../../rombostrap/components/RBInput';

const ProductSupplierDialog = props => {
  const { isOpen, values, isValid, isSubmitting } = props;
  return (
    <RBDialog size="small" open={isOpen} onRequestClose={props.onCloseDialog}>
      <form onSubmit={props.handleSubmit}>
        <RBDialogHeader>
          <RBHeader category="dialog">Add Supplier</RBHeader>
        </RBDialogHeader>
        <RBDialogContent>
          <RBField>
            <RBLabel>Supplier name</RBLabel>
            <RBValue>
              <RBInput
                value={values.name}
                onInputChange={props.onNameChange}
                onBlur={props.onNameBlur}
              />
            </RBValue>
          </RBField>
          <RBField>
            <RBLabel>Description</RBLabel>
            <RBValue>
              <RBTextArea
                type="text"
                name="description"
                value={values.description}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
              />
            </RBValue>
          </RBField>
          <RBField>
            <RBLabel>Default Markup</RBLabel>
            <RBValue>
              <RBInput
                value={values.defaultMarkup}
                rbNumberEnabled
                onInputChange={props.onMarkupChange}
                onBlur={props.onMarkupBlur}
              />
            </RBValue>
            {/* {this.isInvalidMarkup() && (
              <RBInputErrorMessageSection>Please use numbers only</RBInputErrorMessageSection>
            )} */}
          </RBField>
        </RBDialogContent>
        <RBDialogActions>
          <RBButton category="primary" disabled={!isValid || isSubmitting}>
            Add Supplier
          </RBButton>
        </RBDialogActions>
      </form>
    </RBDialog>
  );
};

const { func, object, bool } = PropTypes;
ProductSupplierDialog.propTypes = {
  isOpen: bool,
  values: object.isRequired,
  touched: object.isRequired,
  errors: object.isRequired,
  isValid: bool,
  isSubmitting: bool,
  setFieldValue: func.isRequired,
  setFieldTouched: func.isRequired,
  handleChange: func.isRequired,
  handleBlur: func.isRequired,
  handleSubmit: func.isRequired,
  closeModal: func.isRequired
};

export default ProductSupplierDialog;
