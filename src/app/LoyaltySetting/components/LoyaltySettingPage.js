import React from 'react';
import classnames from 'classnames';
import PrimaryContentLayout, {
  BodyComponent
} from '../../common/legacy/PrimaryContent';
import { ClassicButton } from '../../common/legacy/Basic';
import '../styles/LoyaltySettingsPage.css';

const enableDesc =
  'Allow customers to earn Loyalty $ when purchasing products. You can set Loyalty $ earned on individual products from the Edit Product page or from a price book. You can turn off Loyalty for individual customers on the Edit Customer page.';
// const welcomeEmailDesc = "Selecting this option will send customers an email welcoming them to the Loyalty program. The welcome email will be sent the next time the customer is added to a sale and includes a link where they can edit their details. Please note, the email will not be sent to customers if they haven't provided an email address, or if the customer has Loyalty disabled."

const Section = ({ title, description, enable, onChange, children }) => (
  <div className="box light size1of1">
    <div className="head box-gradient-4">
      <div className="input-row contains-checkbox line mbn mlm">
        <div className="unit field">
          <input
            type="checkbox"
            className="toggle-btn left"
            checked={enable}
            onChange={onChange}
          />
        </div>
        <div className="unit">
          <label htmlFor="vend_retailer_loyalty_enable_loyalty">{title}</label>
        </div>
      </div>
    </div>
    <div className="subhead info_bar">
      <p>{description}</p>
    </div>
    <div className="content padded-20">{children}</div>
  </div>
);

const LoyaltySettingPage = props => {
  const { values } = props;
  return (
    <PrimaryContentLayout title="Loyalty">
      <BodyComponent>
        <form onSubmit={props.handleSubmit}>
          <Section
            title="Enable loyalty"
            description={enableDesc}
            enable={values.loyaltyEnabled}
            onChange={e =>
              props.setFieldValue('loyaltyEnabled', e.target.checked)
            }
          >
            <div
              className={classnames('toggle-container mvl ptm', {
                disable: !values.loyaltyEnabled
              })}
            >
              <div className="box-2 size2of5 block-center">
                <h3 className="strong text-center mbl mtl">Earning Loyalty</h3>
                <div className="input-row line block-center size4of5 font-large-xl ptm pbm">
                  <div className="unit">
                    <input
                      name="earningLoyalty"
                      type="text"
                      value={values.earningLoyalty}
                      onChange={props.handleChange}
                      className="small text-right mrs"
                    />
                    USD
                    <b className="strong phl">
                      <span style={{ fontSize: 18 }}>=</span>
                    </b>
                    $1.00 Loyalty
                  </div>
                </div>
              </div>
              <div className="em font-12 text-center mtm pbl">
                Spending $<span id="loyalty-spend-amount">
                  {values.earningLoyalty}
                </span>{' '}
                earns $1.00 Loyalty.
              </div>
              <div className="mtl pts">
                <div className="input-row line contains-checkbox">
                  <div className="unit">
                    <label htmlFor="vend_retailer_loyalty_offer_signup_bonus_loyalty">
                      Bonus Loyalty
                    </label>
                  </div>
                  <div className="unit field">
                    <input
                      name="offerBonusLoyalty"
                      type="checkbox"
                      className="toggle-btn"
                      id="vend_retailer_loyalty_offer_signup_bonus_loyalty"
                      checked={values.offerBonusLoyalty}
                      onChange={props.handleChange}
                    />
                    <div className="help">
                      Offer bonus Loyalty $ if a customer fills out all of their
                      details in the Customer Portal
                      {/* To Do - Add an example here */}
                      {/* (<a href="/loyalty/example" target="_blank">see example</a>) */}
                    </div>
                  </div>
                </div>
                <div className="input-row line mbl">
                  <div className="unit">
                    <label />
                  </div>
                  <div
                    className="unit field mll toggle-container disabled"
                    data-target="bonus"
                  >
                    <input
                      name="bonusLoyalty"
                      type="text"
                      className="small text-right"
                      id="vend_retailer_loyalty_signup_bonus_loyalty_amount"
                      value={values.bonusLoyalty}
                      onChange={props.handleChange}
                    />
                    <span className="pls font-large">Loyalty</span>
                  </div>
                </div>
              </div>
            </div>
          </Section>
          {/* To Do - Loyalty Welcome Email */}
          {/* <Section title='Send welcome email' description={welcomeEmailDesc}>
                            Hello
                        </Section> */}
          <div className="form-button-bar">
            <ClassicButton label="Save" />
          </div>
        </form>
      </BodyComponent>
    </PrimaryContentLayout>
  );
};

export default LoyaltySettingPage;
