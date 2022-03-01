import React from 'react';
import {
  RBFlex,
  RBButton,
  RBField,
  RBInput,
  RBSelect
} from '../../../rombostrap';
import { RBLabel, RBValue } from '../../../rombostrap/components/RBField';
import DescriptionSection from '../../common/components/DescriptionSection';
import CountryCode from '../../../constants/countryCodes';

const Address = props => {
  const { values, setFieldValue, setFieldTouched, handleSubmit } = props;

  return (
    <DescriptionSection
      title="Address"
      description="Here you can set the store address"
    >
      <form onSubmit={handleSubmit}>
        <div className="vd-g-row">
          <div className="vd-g-col vd-mrl">
            <RBField>
              <RBLabel>Street</RBLabel>
              <RBValue>
                <RBInput
                  value={values.physicalStreet1}
                  onInputChange={street =>
                    setFieldValue('physicalStreet1', street)
                  }
                  onBlur={() => setFieldTouched('physicalStreet1', true)}
                />
              </RBValue>
            </RBField>
            <RBField>
              <RBLabel>Street</RBLabel>
              <RBValue>
                <RBInput
                  value={values.physicalStreet2}
                  onInputChange={street =>
                    setFieldValue('physicalStreet2', street)
                  }
                  onBlur={() => setFieldTouched('physicalStreet2', true)}
                />
              </RBValue>
            </RBField>
            <RBField>
              <RBLabel>Suburb</RBLabel>
              <RBValue>
                <RBInput
                  value={values.physicalSuburb}
                  onInputChange={suburb =>
                    setFieldValue('physicalSuburb', suburb)
                  }
                  onBlur={() => setFieldTouched('physicalSuburb', true)}
                />
              </RBValue>
            </RBField>
            <RBField>
              <RBLabel>City</RBLabel>
              <RBValue>
                <RBInput
                  value={values.physicalCity}
                  onInputChange={city => setFieldValue('physicalCity', city)}
                  onBlur={() => setFieldTouched('physicalCity', true)}
                />
              </RBValue>
            </RBField>
            <RBField>
              <RBLabel>Postcode</RBLabel>
              <RBValue>
                <RBInput
                  value={values.physicalPostcode}
                  onInputChange={postcode =>
                    setFieldValue('physicalPostcode', postcode)
                  }
                  onBlur={() => setFieldTouched('physicalPostcode', true)}
                />
              </RBValue>
            </RBField>
            <RBField>
              <RBLabel>State</RBLabel>
              <RBValue>
                <RBInput
                  value={values.physicalState}
                  onInputChange={state => setFieldValue('physicalState', state)}
                  onBlur={() => setFieldTouched('physicalState', true)}
                />
              </RBValue>
            </RBField>
            <RBField>
              <RBLabel>Country</RBLabel>
              <RBValue>
                <RBSelect
                  selectedEntity={values.physicalCountry}
                  nullLabel=""
                  entities={CountryCode}
                  entityKey="name"
                  entityValue="code"
                  onChange={option =>
                    setFieldValue('physicalCountry', option.code)
                  }
                />
              </RBValue>
            </RBField>
          </div>
          <div className="vd-g-col">
            <RBField>
              <RBLabel>Street</RBLabel>
              <RBValue>
                <RBInput
                  value={values.postalStreet1}
                  onInputChange={street =>
                    setFieldValue('postalStreet1', street)
                  }
                  onChange={option =>
                    setFieldValue('postalStreet1', option.code)
                  }
                />
              </RBValue>
            </RBField>
            <RBField>
              <RBLabel>Street</RBLabel>
              <RBValue>
                <RBInput
                  value={values.postalStreet2}
                  onInputChange={street =>
                    setFieldValue('postalStreet2', street)
                  }
                  onChange={option =>
                    setFieldValue('postalStreet2', option.code)
                  }
                />
              </RBValue>
            </RBField>
            <RBField>
              <RBLabel>Suburb</RBLabel>
              <RBValue>
                <RBInput
                  value={values.postalSuburb}
                  onInputChange={suburb =>
                    setFieldValue('postalSuburb', suburb)
                  }
                  onChange={option =>
                    setFieldValue('postalSuburb', option.code)
                  }
                />
              </RBValue>
            </RBField>
            <RBField>
              <RBLabel>City</RBLabel>
              <RBValue>
                <RBInput
                  value={values.postalCity}
                  onInputChange={city => setFieldValue('postalCity', city)}
                  onChange={option => setFieldValue('postalCity', option.code)}
                />
              </RBValue>
            </RBField>
            <RBField>
              <RBLabel>Postcode</RBLabel>
              <RBValue>
                <RBInput
                  value={values.postalPostcode}
                  onInputChange={postcode =>
                    setFieldValue('postalPostcode', postcode)
                  }
                  onChange={option =>
                    setFieldValue('postalPostcode', option.code)
                  }
                />
              </RBValue>
            </RBField>
            <RBField>
              <RBLabel>State</RBLabel>
              <RBValue>
                <RBInput
                  value={values.postalState}
                  onInputChange={state => setFieldValue('postalState', state)}
                  onChange={option => setFieldValue('postalState', option.code)}
                />
              </RBValue>
            </RBField>
            <RBField>
              <RBLabel>Country</RBLabel>
              <RBValue>
                <RBSelect
                  selectedEntity={values.postalCountry}
                  nullLabel=""
                  entities={CountryCode}
                  entityKey="name"
                  entityValue="code"
                  onChange={option =>
                    setFieldValue('postalCountry', option.code)
                  }
                />
              </RBValue>
            </RBField>
          </div>
        </div>
        <div className="vd-g-row vd-mtl">
          <RBFlex flex flexJustify="between">
            <div />
            <RBButton modifiers={['text']} category="secondary">
              Save
            </RBButton>
          </RBFlex>
        </div>
      </form>
    </DescriptionSection>
  );
};

export default Address;
