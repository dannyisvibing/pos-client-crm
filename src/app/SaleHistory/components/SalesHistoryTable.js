import React, { Fragment } from 'react';
import RBTable, {
  RBTHead,
  RBTR,
  RBTH,
  RBTBody,
  RBTD
} from '../../../rombostrap/components/RBTable/RBTable';
import { RBButton } from '../../../rombostrap';
import ReceiptDetailPanel from './ReceiptDetailPanel';
import '../styles/SalesHistoryTable.css';

const SalesHistoryTable = props => {
  const { datasource, expandedReceiptIndex, formatCurrency } = props;
  return (
    <div>
      <RBTable compact fixed>
        <RBTHead>
          <RBTR>
            <RBTH classes="wr-sales-history-date-heading">Date</RBTH>
            <RBTH>Receipt</RBTH>
            <RBTH>Sold by</RBTH>
            <RBTH>Customer</RBTH>
            <RBTH>Note</RBTH>
            <RBTH classes="vd-align-right">
              <div className="wr-sales-history-table-sale-total-column">
                Sale Total
              </div>
            </RBTH>
            <RBTH classes="wr-sales-history-table-status-heading">Status</RBTH>
            <RBTH classes="wr-sales-history-table-actions-heading">Status</RBTH>
          </RBTR>
        </RBTHead>
        <RBTBody>
          {datasource.map((receipt, index) => (
            <Fragment key={index}>
              <RBTR
                expandable
                expanded={expandedReceiptIndex === index}
                onClick={() => props.onClickReceipt(index)}
              >
                <RBTD>{receipt.date}</RBTD>
                <RBTD>{receipt.receiptNo}</RBTD>
                <RBTD>
                  <div>{receipt.sellerName}</div>
                  <div className="vd-text--sub">{receipt.outletName}</div>
                </RBTD>
                <RBTD>{receipt.customerName}</RBTD>
                <RBTD classes="vd-truncate">{receipt.note || '-'}</RBTD>
                <RBTD classes="vd-align-right">
                  <div className="wr-sales-history-table-sale-total-column">
                    {formatCurrency(receipt.saleTotal)}
                  </div>
                </RBTD>
                <RBTD>{receipt.statusString}</RBTD>
                <RBTD classes="vd-prl vd-align-right">
                  <div className="wr-sales-history-table-actions-group-action">
                    {receipt.availableAction === 'continue' && (
                      <RBButton
                        modifiers={['icon', 'table']}
                        category="primary"
                        onClick={e => {
                          e.stopPropagation();
                          props.onContinue(receipt.receiptId);
                        }}
                      >
                        <i className="fa fa-share" />
                      </RBButton>
                    )}
                    {receipt.availableAction === 'return' && (
                      <RBButton
                        modifiers={['icon', 'table']}
                        category="primary"
                        onClick={e => {
                          e.stopPropagation();
                          props.onReturn(receipt.receiptId);
                        }}
                      >
                        <i className="fa fa-undo" />
                      </RBButton>
                    )}
                  </div>
                </RBTD>
              </RBTR>
              <RBTR>
                <RBTD classes="vd-no-pad-t vd-no-pad-b" colSpan="8">
                  <div className="wr-expanded-sale-container">
                    <ReceiptDetailPanel receipt={receipt} />
                    <div className="vd-col-2 wr-expanded-sale-actions">
                      {receipt.availableAction === 'return' && (
                        <RBButton
                          modifiers={['text']}
                          category="secondary"
                          onClick={() => {
                            props.onReturn(receipt.receiptId);
                          }}
                        >
                          <i className="fa fa-share vd-mrs" />
                          Return Items
                        </RBButton>
                      )}
                      {receipt.availableAction === 'continue' && (
                        <RBButton
                          modifiers={['text']}
                          category="secondary"
                          onClick={() => {
                            props.onContinue(receipt.receiptId);
                          }}
                        >
                          <i className="fa fa-share vd-mrs" />
                          Continue Sale
                        </RBButton>
                      )}
                    </div>
                  </div>
                </RBTD>
              </RBTR>
            </Fragment>
          ))}
        </RBTBody>
      </RBTable>
    </div>
  );
};

export default SalesHistoryTable;
