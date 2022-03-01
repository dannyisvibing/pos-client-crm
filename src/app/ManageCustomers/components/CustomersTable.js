import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { RBFlex, RBButton } from '../../../rombostrap';
import CustomerTableDetail from './CustomerTableDetail';
import displayRoundFilter from '../../../utils/displayRound';

class CustomersTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { openedId: undefined };

    this.handleExportCustomer = this.handleExportCustomer.bind(this);
    this.handleDeleteCustomer = this.handleDeleteCustomer.bind(this);
  }

  handleExportCustomer() {}

  handleDeleteCustomer(e, customerId) {}

  handleSelectTr = id => {
    if (this.state.openedId === id) {
      this.setState({ openedId: undefined });
    } else {
      this.setState({ openedId: id });
    }
  };

  render() {
    const { retailerSettings, datasource } = this.props;
    const { storeCreditEnabled, loyaltyEnabled } = retailerSettings;
    return (
      <div>
        <RBFlex flex flexJustify="between" flexAlign="baseline">
          <div className="vd-text--secondary vd-text--sub vd-mtm">
            Showing customers
          </div>
          <RBButton
            modifiers={['text']}
            category="secondary"
            classes="right"
            onClick={this.handleExportCustomer}
          >
            <i className="fa fa-download vd-mrs" />
            Export List
          </RBButton>
        </RBFlex>
        <hr className="vd-hr vd-mts vd-mbn" />
        <table className="vd-table vd-table--fixed vd-mbl" width="100%">
          <thead>
            <tr>
              <th width="200" className="vd-plm">
                Customer
              </th>
              <th width="200">Location</th>
              {!!storeCreditEnabled && (
                <th className="vd-align-right" width="100">
                  Store Credit
                </th>
              )}
              {!!loyaltyEnabled && (
                <th className="vd-align-right" width="100">
                  Loyalty
                </th>
              )}
              <th width="80" className="vd-align-right">
                Account
              </th>
              <th width="20" className="vd-prs vd-no-pad-l" />
            </tr>
          </thead>
          <tbody>
            {datasource.map((row, index) => (
              <Fragment key={row.id}>
                <tr
                  className={classnames('cv-expand-customer vd-expandable', {
                    'vd-expandable--expanded': this.state.openedId === row.id
                  })}
                  onClick={() => this.handleSelectTr(row.id)}
                >
                  <td className="vd-plm">
                    <div>
                      <span className="vd-mrm">
                        {row.company}, {row.name}
                      </span>
                      <span className="vd-flag">
                        {row.customerGroup || 'All Customers'}
                      </span>
                    </div>
                    <div className=" ">
                      <span className="vd-text--sub vd-text--secondary vd-mts vd-mrm">
                        {row.code}
                      </span>
                    </div>
                  </td>
                  <td>{row.location}</td>
                  {!!storeCreditEnabled && (
                    <td className="vd-align-right">
                      {displayRoundFilter(row.storeCredit)}
                    </td>
                  )}
                  {!!loyaltyEnabled && (
                    <td className="vd-align-right">
                      {displayRoundFilter(row.loyalty)}
                    </td>
                  )}
                  <td className="vd-align-right">
                    {displayRoundFilter(row.account)}
                  </td>
                  <td className="vd-prs vd-no-pad-l vd-align-right">
                    <RBButton
                      href={`/customer/edit/${row.id}`}
                      modifiers={['icon', 'table']}
                      category="secondary"
                    >
                      <i className="fa fa-pencil" />
                    </RBButton>
                  </td>
                </tr>
                <tr key={`${row.id}-expanded`}>
                  <td
                    className="vd-no-pad-r vd-no-pad-t vd-no-pad-b"
                    colSpan={
                      4 +
                      (storeCreditEnabled ? 1 : 0) +
                      (loyaltyEnabled ? 1 : 0)
                    }
                  >
                    <CustomerTableDetail
                      data={row}
                      storeCreditEnabled={storeCreditEnabled}
                      loyaltyEnabled={loyaltyEnabled}
                      onDelete={e => this.handleDeleteCustomer(e, row.id)}
                    />
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2" className="vd-plm">
                All Customers ({datasource.length})
              </td>
              <td className="vd-align-right">0.00</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
}

CustomersTable.propTypes = {
  retailerSettings: PropTypes.object.isRequired,
  datasource: PropTypes.array
};

export default CustomersTable;
