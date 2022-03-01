import React from 'react';
import RBField, {
  RBLabel,
  RBValue
} from '../../../rombostrap/components/RBField';
import RBInput, {
  RBInputErrorMessageSection
} from '../../../rombostrap/components/RBInput';
import { RBButton } from '../../../rombostrap';
import { TextArea } from '../legacy/Basic';
import '../styles/OpenRegisterPanel.css';

const OpenRegisterPanel = props => {
  const {
    values,
    touched,
    errors,
    isSubmitting,
    isValid,
    setFieldValue,
    setFieldTouched,
    handleChange,
    handleBlur,
    handleSubmit
  } = props;
  return (
    <div className="wr-current-sale-panel wr-current-sale-panel--summary">
      <div className="wr-transition-fade wr-full-height wr-current-sale-panel-content">
        <div className="open-register-panel-container open-register-panel-container--boxed open-register-panel-container--fill">
          <div className="open-register-panel">
            <div className="open-register-panel-header vd-align-center">
              <img
                className="wr-register-closed-image"
                src={`${process.env.PUBLIC_URL}/img/register-closed.svg`}
                alt="register closed"
              />
              <div className="vd-mtm vd-mbm vd-header vd-header--subpage">
                Register Closed
              </div>
            </div>
            <p className="vd-p pro-open-register-intro">
              <span>
                Set an opening float to open the register and make a sale
              </span>
            </p>
            <form onSubmit={handleSubmit}>
              <RBField>
                <RBLabel>Opening Float</RBLabel>
                <RBValue>
                  <RBInput
                    value={values.openingFloat}
                    placeholder="0.00"
                    rbNumberEnabled
                    rbNumberOptions={{
                      decimalPlaces: 2,
                      stripNonNumeric: true
                    }}
                    onInputChange={value =>
                      setFieldValue('openingFloat', value)
                    }
                    onBlur={() => setFieldTouched('openingFloat', true)}
                  />
                </RBValue>
                {touched.openingFloat &&
                  errors.openingFloat && (
                    <RBInputErrorMessageSection>
                      Please use numbers only
                    </RBInputErrorMessageSection>
                  )}
              </RBField>
              <TextArea
                name="openingNotes"
                label="Notes"
                note="Max characters: 255"
                placeholder="Enter a note"
                value={values.openingNotes}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <RBButton
                category="primary"
                classes="open-register-panel-button"
                disabled={isSubmitting || !isValid}
              >
                Open Register
              </RBButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenRegisterPanel;
