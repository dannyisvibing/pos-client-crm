import React from 'react';
import { RBSection, RBFlex, RBLoader } from '../../../../rombostrap';
import RBButton, {
  RBButtonGroup
} from '../../../../rombostrap/components/RBButton';

const CompletedActionBar = ({ onDownloadPDF }) => (
  <div>
    <RBSection type="secondary">
      <RBFlex flex flexJustify="between" flexAlign="center">
        <span>View and export your count as a report.</span>
        <RBButtonGroup>
          {/* if !reports.pdf.isFinished() */}
          {/* if disabled=reports.pdf.isInProgress() || !stocktakeItems.length */}
          {true && (
            <RBButton category="secondary" onClick={onDownloadPDF}>
              {/* reports.pdf.isInProgress() */}
              {false ? 'Generating PDF...' : 'Generate PDF Report'}
            </RBButton>
          )}
          {/* reports.pdf.isFinished() */}
          {false && <RBButton category="primary">Download PDF Report</RBButton>}
          {/* if !reports.csv.isFinished() */}
          {/* if disabled=reports.csv.isInProgress() || !stocktakeItems.length */}
          {true && (
            <RBButton category="secondary">
              {/* if reports.csv.isInProgress() */}
              {false && <span classname="progress-bar" />}
              {/* reports.csv.isInProgress() */}
              {false ? 'Generating CSV...' : 'Generate CSV Report'}
              {/* if reports.csv.isInProgress() */}
              {false && <RBLoader />}
            </RBButton>
          )}
          {/* if reports.csv.isFinished() */}
          {false && <RBButton category="primary">Download CSV Report</RBButton>}
        </RBButtonGroup>
      </RBFlex>
    </RBSection>
  </div>
);

export default CompletedActionBar;
