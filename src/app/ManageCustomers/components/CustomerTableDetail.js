import React from 'react';
import classnames from 'classnames';
import displayRoundFilter from '../../../utils/displayRound';
import { RBButton, RBFlex } from '../../../rombostrap';

const CustomerProfileDetailItem = ({ label, value }) => (
  <div className="vd-g-row vd-mbm">
    <div className="vd-g-col vd-g-s-4">
      <strong>{label}</strong>
    </div>
    <div className="vd-g-col vd-g-s-8">{value}</div>
  </div>
);

const CustomerBalanceItem = ({ label, value, head, classes }) => (
  <div className={classnames('vd-g-row vd-mbm', classes)}>
    <div className="vd-g-col vd-g-s-6">
      {head ? <strong>{label}</strong> : <div>{label}</div>}
    </div>
    <div className="vd-g-col vd-g-s-6">{value}</div>
  </div>
);

const CustomersExpandedDetail = ({
  data,
  storeCreditEnabled,
  loyaltyEnabled,
  onDelete
}) => (
  <div className="vd-g-row vd-mbl">
    <div className="vd-g-col vd-g-s-6 vd-mtl vd-ptm">
      <div className="vd-mrxl">
        <div className="vd-text-signpost">Customer Profile</div>
        <hr className="vd-hr vd-mtm vd-mbl" />
        <CustomerProfileDetailItem label="Sex" value={data.sex} />
        <div className="vd-text-signpost vd-mtxl">Contact Info</div>
        <hr className="vd-hr vd-mtm vd-mbl" />
        <CustomerProfileDetailItem
          label="Postal Address"
          value={data.postalAddress}
        />
        <CustomerProfileDetailItem
          label="Physical Address"
          value={data.physicalAddress}
        />
      </div>
    </div>
    <div className="vd-g-col vd-g-s-3 vd-mtl vd-ptm">
      <div className="vd-text-signpost">Balance</div>
      <hr className="vd-hr vd-mtm vd-mbl" />
      <CustomerBalanceItem
        head
        label="Account"
        value={displayRoundFilter(data.account)}
      />
      <CustomerBalanceItem
        head
        label="Total Spent"
        value={displayRoundFilter(data.totalSpent)}
      />
      <CustomerBalanceItem
        head
        label="Last 12 Months"
        value={displayRoundFilter(data.last12Months)}
        classes="vd-pbs"
      />
      {!!loyaltyEnabled && (
        <div>
          <CustomerBalanceItem
            head
            label="Loyalty"
            value={displayRoundFilter(data.loyalty)}
          />
          <CustomerBalanceItem
            head
            label="Total Earned"
            value={displayRoundFilter(data.totalEarnedLoyalty)}
          />
          <CustomerBalanceItem
            head
            label="Total Redeemed"
            value={displayRoundFilter(data.totalRedeemedLoyalty)}
          />
        </div>
      )}
      {!!storeCreditEnabled && (
        <div>
          <CustomerBalanceItem
            head
            label="Store Credit"
            value={displayRoundFilter(data.storeCredit)}
          />
          <CustomerBalanceItem
            head
            label="Total Issued"
            value={displayRoundFilter(data.totalIssuedStoreCredit)}
          />
          <CustomerBalanceItem
            head
            label="Total Redeemed"
            value={displayRoundFilter(data.totalRedeemedStoreCredit)}
          />
        </div>
      )}
    </div>
    <div className="vd-g-col vd-g-s-3 vd-mts vd-flex vd-hide-print">
      <div className="vd-mrm vd-mlxl vd-flex vd-flex--column vd-flex--justify-between">
        <div className="vd-mbm">
          <RBFlex flex flexDirection="column" classes="vd-button-group">
            <RBButton
              modifiers={['text']}
              category="secondary"
              classes="vd-align-left"
              href={`/customer/edit/${data.id}`}
            >
              <i className="fa fa-pencil vd-mrs" />
              Edit Customer
            </RBButton>
          </RBFlex>
        </div>
        <div>
          {/* To Do - Print Customer */}
          {/* <Button
                        component='a'
                        group
                        text='Print Customer'
                        faIcon='fa fa-print'
                        classes={{root: 'vd-flex vd-flex--column', btn: 'vd-align-left'}}
                        disabled={true}
                        secondary/> */}
          {/* To Do - View Sales History */}
          <RBFlex flex flexDirection="column" classes="vd-button-group">
            <RBButton
              modifiers={['text']}
              category="secondary"
              classes="vd-align-left"
              href={`/history?customer_id=${data.id}`}
            >
              <i className="fa fa-list vd-mrs" />
              View Sales History
            </RBButton>
          </RBFlex>
          <RBFlex flex flexDirection="column" classes="vd-button-group">
            <RBButton
              modifiers={['text']}
              category="secondary"
              classes="vd-align-left"
              onClick={onDelete}
            >
              <i className="fa fa-trash vd-mrs" />
              Delete
            </RBButton>
          </RBFlex>
        </div>
      </div>
    </div>
  </div>
);

export default CustomersExpandedDetail;
