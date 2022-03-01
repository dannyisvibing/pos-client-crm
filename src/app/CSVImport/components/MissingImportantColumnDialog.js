import React, { Component } from 'react';
import { RBHeader } from '../../../rombostrap';
import RBDialog, {
  RBDialogHeader,
  RBDialogContent,
  RBDialogActions
} from '../../../rombostrap/components/RBDialog';
import RBButton, {
  RBButtonGroup
} from '../../../rombostrap/components/RBButton';
import RBTable, {
  RBTHead,
  RBTBody,
  RBTR,
  RBTH,
  RBTD
} from '../../../rombostrap/components/RBTable/RBTable';

class MissingImportantColumnDialog extends Component {
  state = {
    missingColumns: []
  };

  open(missingColumns) {
    return new Promise(resolve => {
      this._resolve = resolve;
      this.setState({
        open: true,
        missingColumns
      });
    });
  }

  handleRequestClose = e => {
    e.preventDefault();
    this.setState({ open: false });
  };

  render() {
    const { open, missingColumns } = this.state;
    return (
      <RBDialog
        open={open}
        size="large"
        onRequestClose={this.handleRequestClose}
      >
        <RBDialogHeader>
          <RBHeader category="dialog">
            Hold Up! We're missing an important column.
          </RBHeader>
        </RBDialogHeader>
        <RBDialogContent>
          You can't continue without these columns. You can go back and try to
          match them, or download a CSV with updated headers to add these
          columns.
          <RBTable classes="vd-mtl vd-csv-table" fixed>
            <RBTHead>
              <RBTR>
                <RBTH classes="vd-pln" width="140">
                  Column
                </RBTH>
                <RBTH classes="vd-prn">Description</RBTH>
              </RBTR>
            </RBTHead>
            <RBTBody>
              {missingColumns.map((column, i) => (
                <RBTR key={i}>
                  <RBTD classes="vd-pln csv-missing-column-field-name">
                    {column.name}
                  </RBTD>
                  <RBTD classes="vd-prn">-</RBTD>
                </RBTR>
              ))}
            </RBTBody>
          </RBTable>
        </RBDialogContent>
        <RBDialogActions>
          <RBButtonGroup>
            <RBButton category="secondary" onClick={this.handleRequestClose}>
              Go back to Match Columns
            </RBButton>
            <RBButton category="primary">Download CSV to Fix</RBButton>
          </RBButtonGroup>
        </RBDialogActions>
      </RBDialog>
    );
  }
}

export default MissingImportantColumnDialog;
