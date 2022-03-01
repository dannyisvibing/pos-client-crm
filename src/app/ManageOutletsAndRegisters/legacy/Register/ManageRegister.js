import React, { Component } from 'react';
import {
  RBSection,
  RBSectionBack,
  RBHeader,
  RBSave,
  RBSelect,
  RBField,
  RBRadio
} from '../../../../rombostrap';
import { RBSectionActionBar } from '../../../../rombostrap/components/RBSection';
import RBInput from '../../../../rombostrap/components/RBInputV1';
import { RBLabel, RBValue } from '../../../../rombostrap/components/RBField';
import DescriptionSection from '../../../common/components/DescriptionSection';
import AskForANote from '../../../../constants/askForNote.json';

class ManageRegister extends Component {
  state = {
    registerName: '',
    receiptTemplateId: '',
    receiptNumber: 1,
    receiptPrefix: '',
    receiptSuffix: '',
    selectUserForNextSale: 0,
    emailReceipt: 1,
    printReceipt: 1,
    askForNote: 'on-some',
    printNoteOnReceipt: 1,
    showDiscountsOnReceipt: 1,
    receiptTemplates: []
  };

  componentWillMount() {
    const { params, register, receiptTemplates } = this.props;
    this.setState({ outletId: params.id });
    if (!params.create) {
      if (!register) {
        this.props.routerReplace('/setup/outlets_and_registers');
        return;
      } else {
        this.setState({ ...register });
      }
    }

    this.setState({ receiptTemplates });
  }

  handleFormChange = (key, value) => {
    this.setState({ [key]: value });
  };

  performSave = e => {
    e.preventDefault();

    const { params, createRegister, updateRegister } = this.props;
    if (params.create) {
      createRegister(this.state)
        .then(() => {
          this.props.routerReplace('/setup/outlets_and_registers');
        })
        .catch(err => {});
    } else {
      updateRegister(this.state.registerId, this.state)
        .then(() => {
          this.props.routerReplace('/setup/outlets_and_registers');
        })
        .catch(err => {});
    }
  };

  handleDelete = e => {
    e.preventDefault();
  };

  render() {
    const { params } = this.props;

    return (
      <div>
        <RBSection>
          <RBHeader category="page">
            <RBSectionBack href="/setup/outlets_and_registers" />
            {params.create ? 'Add Register' : `Edit ${this.state.registerName}`}
          </RBHeader>
        </RBSection>
        <RBSection type="action-bar">
          <RBSectionActionBar type="about">
            {params.create && <div>Fill out the form to create a register</div>}
            {!params.create && <div>Change information of the register</div>}
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
              description="Here you can set your register details"
            >
              <div className="vd-g-row">
                <div className="vd-g-col vd-mrl">
                  <RBField>
                    <RBLabel>Register name</RBLabel>
                    <RBValue>
                      <RBInput
                        value={this.state.registerName}
                        onInputChange={value =>
                          this.handleFormChange('registerName', value)
                        }
                      />
                    </RBValue>
                  </RBField>
                </div>
                <div className="vd-g-col vd-mrl">
                  <RBField>
                    <RBLabel>Cash management</RBLabel>
                    <RBValue>
                      <RBSelect
                        selectedEntity="cash"
                        entities={[{ name: 'Cash', entity: 'cash' }]}
                        onChange={option => {}}
                      />
                    </RBValue>
                  </RBField>
                </div>
              </div>
            </DescriptionSection>
            <hr className="vd-hr" />
            <DescriptionSection
              title="Receipt"
              description="Here you can set your register receipt"
            >
              <div className="vd-g-row">
                <div className="vd-g-col">
                  <RBField>
                    <RBLabel>Receipt template</RBLabel>
                    <RBValue>
                      <RBSelect
                        selectedEntity={this.state.receiptTemplateId}
                        entities={this.state.receiptTemplates}
                        entityValue="id"
                        onChange={option =>
                          this.handleFormChange('receiptTemplateId', option.id)
                        }
                      />
                    </RBValue>
                  </RBField>
                  <RBField>
                    <RBLabel>Number</RBLabel>
                    <RBValue>
                      <RBInput
                        value={this.state.receiptNumber}
                        onInputChange={value =>
                          this.handleFormChange('receiptNumber', value)
                        }
                      />
                    </RBValue>
                  </RBField>
                  <RBField>
                    <RBLabel>Prefix</RBLabel>
                    <RBValue>
                      <RBInput
                        value={this.state.receiptPrefix}
                        onInputChange={value =>
                          this.handleFormChange('receiptPrefix', value)
                        }
                      />
                    </RBValue>
                  </RBField>
                  <RBField>
                    <RBLabel>Suffix</RBLabel>
                    <RBValue>
                      <RBInput
                        value={this.state.receiptSuffix}
                        onInputChange={value =>
                          this.handleFormChange('receiptSuffix', value)
                        }
                      />
                    </RBValue>
                  </RBField>
                </div>
                <div className="vd-g-col" />
              </div>
            </DescriptionSection>
            <hr className="vd-hr" />
            <DescriptionSection
              title="At End of Sale"
              description="Here you can set your register settings after sale"
            >
              <div className="vd-g-row vd-mbl">
                <RBField>
                  <RBLabel>Select user for next sale</RBLabel>
                  <RBValue>
                    <RBRadio
                      classes="vd-mrl"
                      name="selectUserForNextSale"
                      label="Yes"
                      value="1"
                      checked={this.state.selectUserForNextSale}
                      onChange={() =>
                        this.handleFormChange('selectUserForNextSale', true)
                      }
                    />
                    <RBRadio
                      name="selectUserForNextSale"
                      label="No"
                      value="0"
                      checked={!this.state.selectUserForNextSale}
                      onChange={() =>
                        this.handleFormChange('selectUserForNextSale', false)
                      }
                    />
                  </RBValue>
                </RBField>
                <RBField>
                  <RBLabel>Ask for a note</RBLabel>
                  <RBValue>
                    <RBSelect
                      selectedEntity={this.state.askForNote}
                      entities={AskForANote}
                      onChange={option =>
                        this.handleFormChange('askForNote', option.entity)
                      }
                    />
                  </RBValue>
                </RBField>
              </div>
              <div className="vd-g-row vd-mbl">
                <RBField>
                  <RBLabel>Email receipt</RBLabel>
                  <RBValue>
                    <RBRadio
                      classes="vd-mrl"
                      name="emailReceipt"
                      label="Yes"
                      value="1"
                      checked={this.state.emailReceipt}
                      onChange={() =>
                        this.handleFormChange('emailReceipt', true)
                      }
                    />
                    <RBRadio
                      name="emailReceipt"
                      label="No"
                      value="0"
                      checked={!this.state.emailReceipt}
                      onChange={() =>
                        this.handleFormChange('emailReceipt', false)
                      }
                    />
                  </RBValue>
                </RBField>
                <RBField>
                  <RBLabel>Print note on receipt</RBLabel>
                  <RBValue>
                    <RBRadio
                      classes="vd-mrl"
                      name="printNoteOnReceipt"
                      label="Yes"
                      value="1"
                      checked={this.state.printNoteOnReceipt}
                      onChange={() =>
                        this.handleFormChange('printNoteOnReceipt', true)
                      }
                    />
                    <RBRadio
                      name="printNoteOnReceipt"
                      label="No"
                      value="0"
                      checked={!this.state.printNoteOnReceipt}
                      onChange={() =>
                        this.handleFormChange('printNoteOnReceipt', false)
                      }
                    />
                  </RBValue>
                </RBField>
              </div>
              <div className="vd-g-row vd-mbl">
                <RBField>
                  <RBLabel>Print receipt</RBLabel>
                  <RBValue>
                    <RBRadio
                      classes="vd-mrl"
                      name="printReceipt"
                      label="Yes"
                      value="1"
                      checked={this.state.printReceipt}
                      onChange={() =>
                        this.handleFormChange('printReceipt', true)
                      }
                    />
                    <RBRadio
                      name="printReceipt"
                      label="No"
                      value="0"
                      checked={!this.state.printReceipt}
                      onChange={() =>
                        this.handleFormChange('printReceipt', false)
                      }
                    />
                  </RBValue>
                </RBField>
                <RBField>
                  <RBLabel>Show discounts on receipts</RBLabel>
                  <RBValue>
                    <RBRadio
                      classes="vd-mrl"
                      name="showDiscountsOnReceipt"
                      label="Yes"
                      value="1"
                      checked={this.state.showDiscountsOnReceipt}
                      onChange={() =>
                        this.handleFormChange('showDiscountsOnReceipt', true)
                      }
                    />
                    <RBRadio
                      name="showDiscountsOnReceipt"
                      label="No"
                      value="0"
                      checked={!this.state.showDiscountsOnReceipt}
                      onChange={() =>
                        this.handleFormChange('showDiscountsOnReceipt', false)
                      }
                    />
                  </RBValue>
                </RBField>
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
      </div>
    );
  }
}

export default ManageRegister;
