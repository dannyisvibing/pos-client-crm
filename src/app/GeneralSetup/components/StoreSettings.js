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
import CurrencyCodes from '../../../constants/currencies.json';
import TimezoneList from '../../../constants/timezones.json';
import DisplayPrices from '../../../constants/displayPrices.json';
import LabelPrinterFormat from '../../../constants/labelPrinterFormat.json';
import SKUGeneration from '../../../constants/skuGeneration.json';
import UserSwitchingSecurity from '../../../constants/userSwitchingSecurity.json';
import '../styles/GeneralSetupPage.css';

const StoreSettings = props => {
  const { values, setFieldValue, setFieldTouched, handleSubmit } = props;

  return (
    <DescriptionSection
      title="Store Settings"
      description="Here you can set the global store settings"
    >
      <form onSubmit={handleSubmit}>
        <div className="vd-g-row">
          <div className="vd-g-col vd-mrl">
            <RBField>
              <RBLabel>Store name</RBLabel>
              <RBValue>
                <RBInput
                  value={values.storeName}
                  onInputChange={storeName =>
                    setFieldValue('storeName', storeName)
                  }
                  onBlur={() => setFieldTouched('storeName', true)}
                />
              </RBValue>
            </RBField>
            <RBField>
              <RBLabel classes="setup-default-currency">Private URL</RBLabel>
              <RBValue classes="private-url">
                {values.storeCname}.rombopos.com
              </RBValue>
            </RBField>
            <RBField classes="setup-default-currency">
              <RBLabel>Default currency</RBLabel>
              <RBValue>
                <RBSelect
                  selectedEntity={values.defaultCurrency}
                  nullLabel=""
                  entities={CurrencyCodes}
                  entityValue="code"
                  onChange={option =>
                    setFieldValue('defaultCurrency', option.code)
                  }
                />
              </RBValue>
            </RBField>
            <RBField>
              <RBLabel>Time zone</RBLabel>
              <RBValue>
                <RBSelect
                  selectedEntity={values.timezone}
                  nullLabel=""
                  entities={TimezoneList}
                  entityKey="text"
                  entityValue="abbr"
                  onChange={option => setFieldValue('timezone', option.abbr)}
                />
              </RBValue>
            </RBField>
            <RBField>
              <RBLabel>Display prices</RBLabel>
              <RBValue>
                <RBSelect
                  selectedEntity={values.displayPrice}
                  nullLabel=""
                  entities={DisplayPrices}
                  onChange={option =>
                    setFieldValue('displayPrice', option.entity)
                  }
                />
              </RBValue>
            </RBField>
          </div>
          <div className="vd-g-col">
            <RBField>
              <RBLabel>Label printer format</RBLabel>
              <RBValue>
                <RBSelect
                  selectedEntity={values.labelPrinterFormat}
                  nullLabel=""
                  entities={LabelPrinterFormat}
                  onChange={option =>
                    setFieldValue('labelPrinterFormat', option.entity)
                  }
                />
              </RBValue>
            </RBField>
            <RBField>
              <RBLabel>SKU generation</RBLabel>
              <RBValue>
                <RBSelect
                  selectedEntity={values.skuGeneration}
                  nullLabel=""
                  entities={SKUGeneration}
                  onChange={option =>
                    setFieldValue('skuGeneration', option.entity)
                  }
                />
              </RBValue>
            </RBField>
            <RBField>
              <RBLabel>Current sequence number</RBLabel>
              <RBValue>
                <RBInput
                  value={values.currentSeqNumber}
                  onInputChange={number =>
                    setFieldValue('currentSeqNumber', number)
                  }
                  onBlur={() => setFieldTouched('currentSeqNumber', true)}
                />
              </RBValue>
            </RBField>
            <RBField>
              <RBLabel>User switching security</RBLabel>
              <RBValue>
                <RBSelect
                  selectedEntity={values.userSwitchingSecurity}
                  nullLabel=""
                  entities={UserSwitchingSecurity}
                  onChange={option =>
                    setFieldValue('userSwitchingSecurity', option.entity)
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

export default StoreSettings;
