import React from 'react';
import { RBFlex, RBButton, RBField, RBInput } from '../../../rombostrap';
import { RBLabel, RBValue } from '../../../rombostrap/components/RBField';
import DescriptionSection from '../../common/components/DescriptionSection';

const ContactInformation = props => {
  const { values, setFieldValue, setFieldTouched, handleSubmit } = props;

  return (
    <DescriptionSection
      title="Contact Information"
      description="Here you can set the store contact"
    >
      <form onSubmit={handleSubmit}>
        <div className="vd-g-row">
          <div className="vd-g-col vd-mrl">
            <RBField>
              <RBLabel>Contact name</RBLabel>
              <RBValue>
                <div className="vd-g-row">
                  <RBInput
                    classes="vd-g-col vd-mrs"
                    value={values.firstname}
                    onInputChange={firstname =>
                      setFieldValue('firstname', firstname)
                    }
                    onBlur={() => setFieldTouched('firstname', true)}
                  />
                  <RBInput
                    classes="vd-g-col"
                    value={values.lastname}
                    onInputChange={lastname =>
                      setFieldValue('lastname', lastname)
                    }
                    onBlur={() => setFieldTouched('lastname', true)}
                  />
                </div>
              </RBValue>
            </RBField>
            <RBField>
              <RBLabel>Email</RBLabel>
              <RBValue>
                <RBInput
                  value={values.email}
                  onInputChange={email => setFieldValue('email', email)}
                  onBlur={() => setFieldTouched('email', true)}
                />
              </RBValue>
            </RBField>
            <RBField>
              <RBLabel>Phone</RBLabel>
              <RBValue>
                <RBInput
                  value={values.phone}
                  onInputChange={phone => setFieldValue('phone', phone)}
                  onBlur={() => setFieldTouched('phone', true)}
                />
              </RBValue>
            </RBField>
          </div>
          <div className="vd-g-col">
            <RBField>
              <RBLabel>Website</RBLabel>
              <RBValue>
                <RBInput
                  value={values.website}
                  onInputChange={website => setFieldValue('website', website)}
                  onBlur={() => setFieldTouched('website', true)}
                />
              </RBValue>
            </RBField>
            <RBField>
              <RBLabel>Twitter</RBLabel>
              <RBValue>
                <RBInput
                  value={values.twitter}
                  onInputChange={twitter => setFieldValue('twitter', twitter)}
                  onBlur={() => setFieldTouched('twitter', true)}
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

export default ContactInformation;
