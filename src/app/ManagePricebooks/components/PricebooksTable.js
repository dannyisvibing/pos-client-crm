import React from 'react';
import moment from 'moment';
import { RBLoader, RBLink, RBButton } from '../../../rombostrap';
import RBTable, {
  RBTHead,
  RBTBody,
  RBTH,
  RBTD,
  RBTR
} from '../../../rombostrap/components/RBTable/RBTable';
import { logRender } from '../../../utils/debug';

const PricebooksTable = ({ pricebooks }) => {
  logRender('render PricebooksTable');
  console.log('pricebooks', pricebooks);
  return (
    <RBTable compact>
      <RBTHead>
        <RBTR>
          <RBTH width="250">Price Book Name</RBTH>
          <RBTH width="145">Customer Group</RBTH>
          <RBTH width="145">Outlet</RBTH>
          <RBTH width="145">Valid From</RBTH>
          <RBTH width="145">Valid To</RBTH>
          <RBTH width="145">Create At</RBTH>
          <RBTH classes="vd-tight" />
        </RBTR>
      </RBTHead>
      <RBTBody>
        {/* STATES.inProgress */}
        {false && (
          <RBTR>
            <RBTD colSpan="7" classes="vd-align-center">
              <RBLoader />
            </RBTD>
          </RBTR>
        )}
        {/* STATES.ready */}
        {true &&
          pricebooks.map((book, i) => (
            <RBTR key={i}>
              <RBTD>
                <RBLink
                  href={`/product/price_book/show/${book.bookId}`}
                  secondary
                  classes="vd-clickable"
                >
                  {book.name}
                </RBLink>
              </RBTD>
              <RBTD>{book.customerGroup.name}</RBTD>
              <RBTD>{book.outlet.outletName}</RBTD>
              <RBTD>{moment(book.validFrom).format('DD MMM YYYY')}</RBTD>
              <RBTD>{moment(book.validTo).format('DD MMM YYYY')}</RBTD>
              <RBTD>{moment(book.createdAt).format('DD MMM YYYY')}</RBTD>
              <RBTD classes="vd-tight">
                <RBButton
                  href={`/product/price_book/edit/${book.bookId}`}
                  modifiers={['icon', 'table']}
                  category="primary"
                >
                  <i className="fa fa-pencil" />
                </RBButton>
              </RBTD>
            </RBTR>
          ))}
        {/* STATES.error */}
        {false && (
          <RBTR>
            <RBTD colSpan="7" classes="vd-align-center">
              {/* To Do - Error Message */}
            </RBTD>
          </RBTR>
        )}
      </RBTBody>
    </RBTable>
  );
};

export default PricebooksTable;
