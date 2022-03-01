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

const ProductTypeDialog = props => {
  const { isOpen, values, isValid, isSubmitting } = props;
  return (
    <RBDialog size="small" open={isOpen} onRequestClose={props.onCloseModal}>
      <form onSubmit={props.handleSubmit}>
        <RBDialogHeader>
          <RBHeader category="dialog">Add Group</RBHeader>
        </RBDialogHeader>
        <RBDialogContent>
          <RBField>
            <RBLabel>Group name</RBLabel>
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
            Add Group
          </RBButton>
        </RBDialogActions>
      </form>
    </RBDialog>
  );
};

const { func, object, bool } = PropTypes;
ProductTypeDialog.propTypes = {
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

export default ProductTypeDialog;
