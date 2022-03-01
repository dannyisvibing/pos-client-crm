import React from 'react';
import moment from 'moment';
import RBTable, {
  RBTHead,
  RBTBody,
  RBTR,
  RBTH,
  RBTD
} from '../../../rombostrap/components/RBTable/RBTable';
import { RBLoader, RBLink, RBButton } from '../../../rombostrap';

import STATES from './constants/states';

function getTypeString(type) {
  if (type === 'supplierOrder') return 'Supplier order';
  if (type === 'supplierReturn') return 'Supplier return';
  if (type === 'outletTransfer') return 'Outlet transfer';
}

function getSource(getOutletById, consignment) {
  if (consignment.type === 'supplierOrder') return consignment.supplier.name;
  if (consignment.type === 'supplierReturn') return '-';
  if (consignment.type === 'outletTransfer')
    return getOutletById(consignment.sourceOutletId).outletName;
}

const Sort = ({ title, prop, selected, direction, onSort }) => (
  <a
    href=""
    onClick={e => {
      e.preventDefault();
      onSort(prop);
    }}
  >
    {title}
    {selected === prop && (
      <i
        className={`vd-mls fa fa-caret-${direction === 'asc' ? 'up' : 'down'}`}
      />
    )}
  </a>
);

const List = ({
  state,
  consignments,
  order,
  orderDirection,
  getOutletById,
  formatCurrency,
  onSort
}) => {
  return (
    <RBTable compact fixed>
      <RBTHead>
        <RBTR>
          <RBTH width="100" classes="vd-no-pad-l">
            <Sort
              prop="name"
              title="Name"
              selected={order}
              direction={orderDirection}
              onSort={onSort}
            />
          </RBTH>
          <RBTH width="100">
            <Sort
              prop="type"
              title="Type"
              selected={order}
              direction={orderDirection}
              onSort={onSort}
            />
          </RBTH>
          <RBTH width="100">
            <Sort
              prop="created_at"
              title="Date"
              selected={order}
              direction={orderDirection}
              onSort={onSort}
            />
          </RBTH>
          <RBTH width="90">
            <Sort
              prop="due_at"
              title="Delivery Due"
              selected={order}
              direction={orderDirection}
              onSort={onSort}
            />
          </RBTH>
          <RBTH width="80">
            <Sort
              prop="reference"
              title="Number"
              selected={order}
              direction={orderDirection}
              onSort={onSort}
            />
          </RBTH>
          <RBTH width="80">Outlet</RBTH>
          <RBTH width="80">Source</RBTH>
          <RBTH width="70">
            <Sort
              prop="status"
              title="Status"
              selected={order}
              direction={orderDirection}
              onSort={onSort}
            />
          </RBTH>
          <RBTH width="50" classes="vd-align-right">
            Items
          </RBTH>
          <RBTH width="80" classes="vd-align-right">
            Total Cost
          </RBTH>
          <RBTH width="50" classes="vd-no-pad-r" />
        </RBTR>
      </RBTHead>
      <RBTBody>
        {state === STATES.inProgress && (
          <RBTR>
            <RBTD colSpan="11" classes="vd-align-center">
              <RBLoader />
            </RBTD>
          </RBTR>
        )}
        {state === STATES.ready &&
          consignments.map((consignment, i) => (
            <RBTR key={i}>
              <RBTD classes="vd-no-pad-l">
                <RBLink
                  secondary
                  href={`/product/consignment/${consignment.id}`}
                >
                  {consignment.name}
                </RBLink>
              </RBTD>
              <RBTD>
                <RBLink
                  secondary
                  href={`/product/consignment/${consignment.id}`}
                >
                  {getTypeString(consignment.type)}
                </RBLink>
              </RBTD>
              <RBTD>{moment(consignment.createdAt).format('D MMM YYYY')}</RBTD>
              <RBTD>{moment(consignment.dueAt).format('D MMM YYYY')}</RBTD>
              <RBTD>
                <RBLink href={`/product/consignment/${consignment.id}`}>
                  {consignment.reference}
                </RBLink>
              </RBTD>
              <RBTD classes="vd-truncate">
                {getOutletById(consignment.outletId).outletName}
              </RBTD>
              <RBTD classes="vd-truncate">
                {getSource(getOutletById, consignment)}
              </RBTD>
              <RBTD classes="consignment-status">{consignment.status}</RBTD>
              <RBTD classes="vd-align-right">
                {consignment.items.reduce(
                  (total, item) => total + item.quantity,
                  0
                )}
              </RBTD>
              <RBTD classes="vd-align-right">
                {formatCurrency(
                  consignment.items.reduce(
                    (total, item) => total + item.supplyPrice * item.quantity,
                    0
                  )
                )}
              </RBTD>
              <RBTD classes="vd-no-pad-r vd-align-center">
                {consignment.status === 'open' &&
                  consignment.type === 'supplierOrder' && (
                    <RBButton
                      href={`/product/consignment/${consignment.id}/edit`}
                      modifiers={['icon', 'table']}
                      category="primary"
                    >
                      <i className="fa fa-pencil" />
                    </RBButton>
                  )}
                {consignment.status === 'sent' &&
                  consignment.type !== 'supplierReturn' && (
                    <RBButton
                      href={`/product/consignment/${consignment.id}/receive`}
                      modifiers={['inline', 'table']}
                    >
                      Receive
                    </RBButton>
                  )}
              </RBTD>
            </RBTR>
          ))}
      </RBTBody>
    </RBTable>
  );
};

export default List;
