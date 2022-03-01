import React, { Component } from 'react';
import * as keyBy from 'lodash/keyBy';
import { RBSection, RBHeader, RBButton, RBFlex } from '../../../rombostrap';
import { RBButtonGroup } from '../../../rombostrap/components/RBButton';
import OutletTable from './OutletTable';
import ReceiptTemplateCard from './Layout/ReceiptTemplateCard';
import '../styles/OutletsAndRegistersTable.css';

class OutletsNRegisters extends Component {
  state = {
    data: [],
    details: {},
    receiptTemplates: []
  };

  componentWillMount() {
    const { outlets, registers, salesTaxes, receiptTemplates } = this.props;
    const taxesHash = keyBy(salesTaxes, 'saletax_id');
    registers.forEach(register => {
      register.receiptTemplateName = (
        receiptTemplates.find(
          template => template.id === register.receiptTemplateId
        ) || {}
      ).name;
    });

    var data = outlets.reduce((memo, outlet) => {
      var defaultTax = taxesHash[outlet.defaultSaletax];

      var outletRow = {
        name: outlet.outletName,
        defaultTax: defaultTax
          ? `${defaultTax.name} (${defaultTax.rate}%)`
          : 'No Tax (0%)',
        outletLink: `/setup/outlet/view/${outlet.outletId}`,
        editOutletLink: `/setup/outlet/edit/${outlet.outletId}`,
        addRegisterLink: `/setup/register/new/${outlet.outletId}`,
        registers: registers
          .filter(register => register.outletId === outlet.outletId)
          .reduce((memo, register) => {
            var registerRow = {
              name: register.registerName,
              status: register.openingClosureId ? 'Open' : 'Close',
              registerLink: `/setup/register/view/${register.registerId}`,
              editRegisterLink: `/setup/register/edit/${register.registerId}`,
              ...register
            };

            memo.push(registerRow);
            return memo;
          }, [])
      };

      memo.push(outletRow);
      return memo;
    }, []);

    this.setState({ data, receiptTemplates });
  }

  handleMoreFewerDetails = (e, registerId) => {
    e.preventDefault();
    var details = this.state.details;
    details[registerId] = !details[registerId];
    this.setState({ details });
  };

  render() {
    const { receiptTemplates } = this.props;
    return (
      <div className="vd-primary-layout">
        <RBSection>
          <RBHeader category="page">Outlets and Registers</RBHeader>
        </RBSection>
        <RBSection type="secondary">
          <RBFlex
            flex
            flexDirection="row"
            flexJustify="between"
            flexAlign="center"
          >
            <span className="vd-mrl">
              A list of all of your outlets and registers.
            </span>
            <RBButtonGroup>
              <RBButton category="primary" href="/setup/outlet/new">
                Add Outlet
              </RBButton>
              <RBButton category="primary" href="/setup/receipt_template/new">
                Add Receipt Template
              </RBButton>
            </RBButtonGroup>
          </RBFlex>
        </RBSection>
        <RBSection>
          <OutletTable
            data={this.state.data}
            details={this.state.details}
            onMoreFewerDetails={this.handleMoreFewerDetails}
          />
        </RBSection>
        <RBSection classes="vd-mtxl">
          <RBHeader>Receipt Templates</RBHeader>
          <RBSection>
            <div className="vd-g-row">
              {receiptTemplates.map((template, i) => (
                <ReceiptTemplateCard
                  key={i}
                  classes="vd-col-3"
                  template={template}
                />
              ))}
            </div>
          </RBSection>
        </RBSection>
      </div>
    );
  }
}

export default OutletsNRegisters;
