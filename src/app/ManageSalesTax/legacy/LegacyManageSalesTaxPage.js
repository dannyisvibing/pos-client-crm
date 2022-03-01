import React, { Component } from 'react';
import PrimaryContentLayout, {
  TipComponent,
  BodyComponent
} from '../../common/legacy/PrimaryContent';
import { Button } from '../../common/legacy/Basic';
import SalesTaxTable from './SalesTaxTable';
import OutletDefaultTaxTable from './OutletDefaultTaxTable';
import NewSalesTaxDialog from './NewSalesTaxV1';
import WarnPermanentAction from './WarnPermanentAction';

class SalesTaxes extends Component {
  state = {};

  handleSalestaxDialogOpen = (e, action, taxId) => {
    const { salestaxHash } = this.props;
    this.setState({
      openSalestaxDialog: action !== 'delete' ? true : false,
      openWarnPermanentActionDialog: action === 'delete' ? true : false,
      action,
      taxId,
      taxInfo: taxId ? salestaxHash[taxId] : undefined
    });
  };

  handleSalestaxDialogClose = e => {
    this.setState({
      openSalestaxDialog: false,
      openWarnPermanentActionDialog: false
    });
  };

  handleSalestaxModify = taxInfo => {
    const { name, rate } = taxInfo;
    const { action, taxId } = this.state;
    const { createSalesTax, updateSalesTax, deleteSalesTax } = this.props;
    if (action === 'add') {
      createSalesTax({ name, rate });
    } else if (action === 'edit') {
      updateSalesTax({ id: taxId, name, rate });
    } else if (action === 'delete') {
      deleteSalesTax(taxId);
    }

    this.setState({
      openSalestaxDialog: false,
      openWarnPermanentActionDialog: false
    });
  };

  render() {
    const { salestax = [], salestaxHash = {}, outlets = [] } = this.props;

    var defaultTaxData = outlets.reduce((memo, outlet) => {
      if (!outlet.defaultSaletax) {
        memo.push({
          outletId: outlet.outletId,
          outletName: outlet.outletName,
          tax: 'No Tax (0%)'
        });
      } else {
        var tax = salestaxHash[outlet.defaultSaletax];
        if (tax) {
          memo.push({
            outletName: outlet.outletName,
            tax: `${salestaxHash[outlet.defaultSaletax].name} (${
              salestaxHash[outlet.defaultSaletax].rate
            }%)`
          });
        }
      }

      return memo;
    }, []);

    return (
      <PrimaryContentLayout title="Sales Tax">
        <TipComponent>
          <Button
            primary
            unnested
            onClick={e => this.handleSalestaxDialogOpen(e, 'add')}
          >
            Add Sales Tax
          </Button>
          {/* To Do - Combine taxes into a group */}
          {/* <Button primary unnested>Combine Taxes into a Group</Button> */}
        </TipComponent>
        <BodyComponent>
          <SalesTaxTable
            salestax={salestax}
            onEdit={(e, id) => this.handleSalestaxDialogOpen(e, 'edit', id)}
            onDelete={(e, id) => this.handleSalestaxDialogOpen(e, 'delete', id)}
          />
          <div className="vd-header vd-header--subpage vd-mtl vd-mbl">
            Default Outlet Taxes
          </div>
          <OutletDefaultTaxTable defaultTaxData={defaultTaxData} />
          <NewSalesTaxDialog
            taxInfo={this.state.taxInfo}
            open={this.state.openSalestaxDialog}
            onRequestClose={this.handleSalestaxDialogClose}
            onSubmit={this.handleSalestaxModify}
          />
          <WarnPermanentAction
            open={this.state.openWarnPermanentActionDialog}
            onRequestClose={this.handleSalestaxDialogClose}
            onConfirm={this.handleSalestaxModify}
          />
        </BodyComponent>
      </PrimaryContentLayout>
    );
  }
}

export default SalesTaxes;
