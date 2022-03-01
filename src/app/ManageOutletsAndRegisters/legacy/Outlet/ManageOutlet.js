import React, { Component } from 'react';
import {
  RBSection,
  RBSectionBack,
  RBHeader,
  RBCheckbox,
  RBSave,
  RBSelect,
  RBField
} from '../../../../rombostrap';
import { RBSectionActionBar } from '../../../../rombostrap/components/RBSection';
import RBInput from '../../../../rombostrap/components/RBInputV1';
import { RBLabel, RBValue } from '../../../../rombostrap/components/RBField';
import DescriptionSection from '../../../common/components/DescriptionSection';
import NewSalesTaxDialog from '../Dialog/NewSalesTaxDialog';
import CountryCode from '../../../../constants/countryCodes';

class ManageOutlet extends Component {
  state = {
    taxes: []
  };

  componentWillMount() {
    const { salesTaxes, outlet = {} } = this.props;
    this.setState({
      taxes: salesTaxes,
      ...outlet,
      name: outlet.outletName
    });
  }

  handleFormChange = (key, value) => {
    this.setState({
      [key]: value,
      dirty: true
    });
    if (key === 'defaultSaletax' && value === 'store:sales-tax:add') {
      this.newSalesTaxDlg.open().then(result => {
        this.props.createSalesTax(result).then(id => {
          this.setState({
            defaultSaletax: id,
            taxes: this.state.taxes.concat({
              id: id,
              name: result.name,
              rate: result.rate
            })
          });
        });
      });
    } else if (key === 'outletName') {
      const { params } = this.props;
      if (params.create) {
        this.setState({
          orderNumberPrefix: value.substring(0, 3).toUpperCase(),
          supplierReturnPrefix: value.substring(0, 3).toUpperCase(),
          orderNumber: 1,
          supplierReturnNumber: 1
        });
      }
    }
  };

  performSave = async e => {
    e.preventDefault();

    this.setState({ saving: true });
    const { params, createOutlet, updateOutlet, routerReplace } = this.props;
    if (params.create) {
      const result = await createOutlet(this.state);
      routerReplace(`/setup/register/new/${result.payload.data.outletId}`);
    } else {
      await updateOutlet(this.state);
      this.setState({ saving: false });
    }
  };

  handleDelete = e => {};

  render() {
    const { params } = this.props;

    var taxOptions = this.state.taxes
      .map(tax => ({
        name: `${tax.name} (${tax.rate}%)`,
        entity: tax.id
      }))
      .concat({
        name: 'Add sales tax',
        entity: 'store:sales-tax:add'
      });
    return (
      <div>
        <RBSection>
          <RBHeader category="page">
            <RBSectionBack href="/setup/outlets_and_registers" />
            {params.create ? 'Add Outlet' : `Edit ${this.state.name}`}
          </RBHeader>
        </RBSection>
        <RBSection type="action-bar">
          <RBSectionActionBar type="about">
            {params.create && <div>Fill out the form to create a outlet</div>}
            {!params.create && <div>Change information of the outlet</div>}
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
              description="Here you can set your outlet details"
            >
              <div className="vd-g-row">
                <div className="vd-g-col vd-mrl">
                  <RBField>
                    <RBLabel>Outlet name</RBLabel>
                    <RBValue>
                      <RBInput
                        value={this.state.outletName}
                        modelOptions={{ updateOn: 'blur' }}
                        onInputChange={outletName =>
                          this.handleFormChange('outletName', outletName)
                        }
                      />
                    </RBValue>
                  </RBField>
                  <RBField>
                    <RBLabel>Default sales tax</RBLabel>
                    <RBValue>
                      <RBSelect
                        selectedEntity={this.state.defaultSaletax}
                        nullLabel="No Tax (0%)"
                        entities={taxOptions}
                        onChange={option =>
                          this.handleFormChange('defaultSaletax', option.entity)
                        }
                      />
                    </RBValue>
                  </RBField>
                  <RBField>
                    <RBLabel>Order number prefix</RBLabel>
                    <RBValue>
                      <RBInput
                        value={this.state.orderNumberPrefix}
                        onInputChange={value =>
                          this.handleFormChange('orderNumberPrefix', value)
                        }
                      />
                    </RBValue>
                  </RBField>
                  <RBField>
                    <RBLabel>Order number</RBLabel>
                    <RBValue>
                      <RBInput
                        value={this.state.orderNumber}
                        onInputChange={value =>
                          this.handleFormChange('orderNumber', value)
                        }
                      />
                    </RBValue>
                  </RBField>
                </div>
                <div className="vd-g-col">
                  <RBField>
                    <RBLabel>Supplier return prefix</RBLabel>
                    <RBValue>
                      <RBInput
                        value={this.state.supplierReturnPrefix}
                        onInputChange={value =>
                          this.handleFormChange('supplierReturnPrefix', value)
                        }
                      />
                    </RBValue>
                  </RBField>
                  <RBField>
                    <RBLabel>Supplier return number</RBLabel>
                    <RBValue>
                      <RBInput
                        value={this.state.supplierReturnNumber}
                        onInputChange={value =>
                          this.handleFormChange('supplierReturnNumber', value)
                        }
                      />
                    </RBValue>
                  </RBField>
                </div>
              </div>
            </DescriptionSection>
            <hr className="vd-hr" />
            <DescriptionSection
              title="Sell Screen Prompts"
              description="Here you can set sell prompt of your outlet"
            >
              <RBCheckbox
                label="Negatove"
                description="Warn sell screen users when they are about to sell more inventory than is available"
                checked={this.state.warnNegativeInventory}
                onChange={e =>
                  this.handleFormChange(
                    'warnNegativeInventory',
                    e.target.checked
                  )
                }
              />
            </DescriptionSection>
            <hr className="vd-hr" />
            <DescriptionSection
              title="Address"
              description="Here you can set address of new outlet"
            >
              <div className="vd-g-row">
                <div className="vd-g-col vd-mrl">
                  <RBField>
                    <RBLabel>Street</RBLabel>
                    <RBValue>
                      <RBInput
                        value={this.state.physicalStreet1}
                        onInputChange={street =>
                          this.handleFormChange('physicalStreet1', street)
                        }
                      />
                    </RBValue>
                  </RBField>
                  <RBField>
                    <RBLabel>Street</RBLabel>
                    <RBValue>
                      <RBInput
                        value={this.state.physicalStreet2}
                        onInputChange={street =>
                          this.handleFormChange('physicalStreet2', street)
                        }
                      />
                    </RBValue>
                  </RBField>
                  <RBField>
                    <RBLabel>Suburb</RBLabel>
                    <RBValue>
                      <RBInput
                        value={this.state.physicalSuburb}
                        onInputChange={suburb =>
                          this.handleFormChange('physicalSuburb', suburb)
                        }
                      />
                    </RBValue>
                  </RBField>
                  <RBField>
                    <RBLabel>City</RBLabel>
                    <RBValue>
                      <RBInput
                        value={this.state.physicalCity}
                        onInputChange={city =>
                          this.handleFormChange('physicalCity', city)
                        }
                      />
                    </RBValue>
                  </RBField>
                  <RBField>
                    <RBLabel>Postcode</RBLabel>
                    <RBValue>
                      <RBInput
                        value={this.state.physicalPostcode}
                        onInputChange={postcode =>
                          this.handleFormChange('physicalPostcode', postcode)
                        }
                      />
                    </RBValue>
                  </RBField>
                  <RBField>
                    <RBLabel>State</RBLabel>
                    <RBValue>
                      <RBInput
                        value={this.state.physicalState}
                        onInputChange={state =>
                          this.handleFormChange('physicalState', state)
                        }
                      />
                    </RBValue>
                  </RBField>
                  <RBField>
                    <RBLabel>Country</RBLabel>
                    <RBValue>
                      <RBSelect
                        selectedEntity={this.state.physicalCountry}
                        nullLabel=""
                        entities={CountryCode}
                        entityKey="name"
                        entityValue="code"
                        onChange={option =>
                          this.handleFormChange('physicalCountry', option.code)
                        }
                      />
                    </RBValue>
                  </RBField>
                </div>
                <div className="vd-g-col">
                  <RBField>
                    <RBLabel>Email</RBLabel>
                    <RBValue>
                      <RBInput
                        value={this.state.email}
                        onInputChange={value =>
                          this.handleFormChange('email', value)
                        }
                      />
                    </RBValue>
                  </RBField>
                  <RBField>
                    <RBLabel>Phone</RBLabel>
                    <RBValue>
                      <RBInput
                        value={this.state.phone}
                        onInputChange={value =>
                          this.handleFormChange('phone', value)
                        }
                      />
                    </RBValue>
                  </RBField>
                  <RBField>
                    <RBLabel>Twitter</RBLabel>
                    <RBValue>
                      <RBInput
                        value={this.state.twitter}
                        onInputChange={value =>
                          this.handleFormChange('twitter', value)
                        }
                      />
                    </RBValue>
                  </RBField>
                </div>
              </div>
            </DescriptionSection>
          </RBSection>
        </form>
        {!params.create && (
          <RBSection>
            <hr className="vd-hr" />
            <a
              className="vd-text--negative"
              href=""
              onClick={this.handleDelete}
            >
              Delete
            </a>
          </RBSection>
        )}
        <NewSalesTaxDialog ref={c => (this.newSalesTaxDlg = c)} />
      </div>
    );
  }
}

export default ManageOutlet;
