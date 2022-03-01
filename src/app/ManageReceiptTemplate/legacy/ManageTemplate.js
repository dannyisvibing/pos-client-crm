import React, { Component } from 'react';
import {
  RBSection,
  RBSectionBack,
  RBHeader,
  RBSave,
  RBField
} from '../../../rombostrap';
import { RBSectionActionBar } from '../../../rombostrap/components/RBSection';
import { RBLabel, RBValue } from '../../../rombostrap/components/RBField';
import RBInput from '../../../rombostrap/components/RBInputV1';
import DescriptionSection from '../../common/components/DescriptionSection';

class ManageTemplate extends Component {
  state = {};

  componentWillMount() {
    const { params, receiptTemplates } = this.props;
    if (!params.create) {
      const template = receiptTemplates[0];
      this.setState({ ...template });
    }
  }

  handleFormChange = (key, value) => {
    this.setState({ [key]: value });
  };

  performSave = async e => {
    e.preventDefault();

    const { params, createReceiptTemplate, routerReplace } = this.props;
    if (params.create) {
      await createReceiptTemplate(this.state);
      routerReplace('/setup/outlets_and_registers');
    } else {
    }
  };

  render() {
    const { params } = this.props;
    return (
      <div>
        <RBSection>
          <RBHeader category="page">
            <RBSectionBack href="/setup/outlets_and_registers" />
            {params.create ? 'Add Receipt Template' : 'Edit Receipt Template'}
          </RBHeader>
        </RBSection>
        <RBSection type="action-bar">
          <RBSectionActionBar type="about">
            {params.create && (
              <div>Fill out the form to create a receipt template</div>
            )}
            {!params.create && <div>Change information of the template</div>}
          </RBSectionActionBar>
          <RBSectionActionBar type="actions">
            <RBSave
              lastUpdated={this.state.updatedAt}
              form={{ dirty: this.state.dirty }}
              saving={this.state.saving}
              onSave={this.performSave}
            />
          </RBSectionActionBar>
        </RBSection>
        <form>
          <RBSection classes="vd-mtl">
            <DescriptionSection
              title="Details"
              description="Here you can set your receipt details"
            >
              <div className="vd-g-row">
                <div className="vd-g-col">
                  <RBField>
                    <RBLabel>Receipt name</RBLabel>
                    <RBValue>
                      <RBInput
                        value={this.state.name}
                        onInputChange={value =>
                          this.handleFormChange('name', value)
                        }
                      />
                    </RBValue>
                  </RBField>
                </div>
                <div className="vd-g-col" />
              </div>
            </DescriptionSection>
          </RBSection>
          <hr className="vd-hr" />
          <DescriptionSection
            title="Layout"
            description="Here you can set your receipt layout"
          >
            <div className="vd-g-row vd-mbl">
              <RBField>
                <RBLabel>Header text</RBLabel>
                <RBValue>
                  <RBInput
                    value={this.state.header}
                    onInputChange={value =>
                      this.handleFormChange('header', value)
                    }
                  />
                </RBValue>
              </RBField>
            </div>
            <div className="vd-g-row vd-mbl">
              <div className="vd-g-col">
                <RBField>
                  <RBLabel>Invoice no. prefix</RBLabel>
                  <RBValue>
                    <RBInput
                      value={this.state.labelInvoice}
                      onInputChange={value =>
                        this.handleFormChange('labelInvoice', value)
                      }
                    />
                  </RBValue>
                </RBField>
                <RBField>
                  <RBLabel>Invoice heading</RBLabel>
                  <RBValue>
                    <RBInput
                      value={this.state.labelInvoiceTitle}
                      onInputChange={value =>
                        this.handleFormChange('labelInvoiceTitle', value)
                      }
                    />
                  </RBValue>
                </RBField>
                <RBField>
                  <RBLabel>Served by label</RBLabel>
                  <RBValue>
                    <RBInput
                      value={this.state.labelServedBy}
                      onInputChange={value =>
                        this.handleFormChange('labelServedBy', value)
                      }
                    />
                  </RBValue>
                </RBField>
                <RBField>
                  <RBLabel>Discount label</RBLabel>
                  <RBValue>
                    <RBInput
                      value={this.state.labelLineDiscount}
                      onInputChange={value =>
                        this.handleFormChange('labelLineDiscount', value)
                      }
                    />
                  </RBValue>
                </RBField>
                <RBField>
                  <RBLabel>Sub total label</RBLabel>
                  <RBValue>
                    <RBInput
                      value={this.state.labelSubTotal}
                      onInputChange={value =>
                        this.handleFormChange('labelSubTotal', value)
                      }
                    />
                  </RBValue>
                </RBField>
                <RBField>
                  <RBLabel>Tax label</RBLabel>
                  <RBValue>
                    <RBInput
                      value={this.state.labelTax}
                      onInputChange={value =>
                        this.handleFormChange('labelTax', value)
                      }
                    />
                  </RBValue>
                </RBField>
                <RBField>
                  <RBLabel>To pay label</RBLabel>
                  <RBValue>
                    <RBInput
                      value={this.state.labelToPay}
                      onInputChange={value =>
                        this.handleFormChange('labelToPay', value)
                      }
                    />
                  </RBValue>
                </RBField>
                <RBField>
                  <RBLabel>Total label</RBLabel>
                  <RBValue>
                    <RBInput
                      value={this.state.labeTotal}
                      onInputChange={value =>
                        this.handleFormChange('labeTotal', value)
                      }
                    />
                  </RBValue>
                </RBField>
                <RBField>
                  <RBLabel>Change label</RBLabel>
                  <RBValue>
                    <RBInput
                      value={this.state.labelChange}
                      onInputChange={value =>
                        this.handleFormChange('labelChange', value)
                      }
                    />
                  </RBValue>
                </RBField>
                <RBField>
                  <RBLabel>Loyalty</RBLabel>
                  <RBValue>
                    <RBInput
                      value={this.state.labelLoyalty}
                      onInputChange={value =>
                        this.handleFormChange('labelLoyalty', value)
                      }
                    />
                  </RBValue>
                </RBField>
                <RBField>
                  <RBLabel>Loyalty earned label</RBLabel>
                  <RBValue>
                    <RBInput
                      value={this.state.labelLoyaltyEarned}
                      onInputChange={value =>
                        this.handleFormChange('labelLoyaltyEarned', value)
                      }
                    />
                  </RBValue>
                </RBField>
                <RBField>
                  <RBLabel>Loyalty message</RBLabel>
                  <RBValue>
                    <RBInput
                      value={this.state.labelLoyaltyLink}
                      onInputChange={value =>
                        this.handleFormChange('labelLoyaltyLink', value)
                      }
                    />
                  </RBValue>
                </RBField>
              </div>
              <div className="vd-g-col" />
            </div>
            <div className="vd-g-row vd-mbl">
              <RBField>
                <RBLabel>Footer text</RBLabel>
                <RBValue>
                  <RBInput
                    value={this.state.footer}
                    onInputChange={value =>
                      this.handleFormChange('footer', value)
                    }
                  />
                </RBValue>
              </RBField>
            </div>
          </DescriptionSection>
        </form>
      </div>
    );
  }
}

export default ManageTemplate;
