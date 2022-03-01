import React from 'react';
import RBTable, {
  RBTBody,
  RBTR,
  RBTD
} from '../../../rombostrap/components/RBTable/RBTable';

const CSVMatchCardSampleData = ({ data = [] }) => (
  <div className="vd-csv-match-card-sample-data">
    <RBTable classes="csv-card-matching-sample-data-container">
      <RBTBody>
        {data.map((value, i) => (
          <RBTR key={i}>
            <RBTD>
              <div className="csv-card-matching-sample-data-cell">{value}</div>
            </RBTD>
          </RBTR>
        ))}
      </RBTBody>
    </RBTable>
  </div>
);

export default CSVMatchCardSampleData;
