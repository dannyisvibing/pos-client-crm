import React from 'react';
import classnames from 'classnames';

export const Table = ({
  classes,
  compact,
  fixed,
  report,
  nestedReport,
  nestedIndentedReport,
  expandable,
  children,
  ...props
}) => (
  <table
    className={classnames('vd-table', classes, {
      'vd-table--compact': compact,
      'vd-table--fixed': fixed,
      'vd-table--report': report,
      'vd-table--report--nested': nestedReport,
      'vd-table--report--nested--indented': nestedIndentedReport,
      'vd-table--expandable': expandable
    })}
    {...props}
  >
    {children}
  </table>
);

export const THead = ({ classes, children, ...props }) => (
  <thead className={classnames(classes)} {...props}>
    {children}
  </thead>
);

export const TBody = ({ classes, children, ...props }) => (
  <tbody className={classnames(classes)} {...props}>
    {children}
  </tbody>
);

export const TFoot = ({ classes, children, ...props }) => (
  <tfoot className={classnames(classes)}>{children}</tfoot>
);

export const TR = ({
  classes,
  expandable,
  expanded,
  unexpandable,
  children,
  ...props
}) => (
  <tr
    className={classnames(classes, {
      'vd-expandable': expandable,
      'vd-expandable--expanded': expanded,
      'vd-expandable--nt': unexpandable
    })}
    {...props}
  >
    {children}
  </tr>
);

export const TH = ({ classes, children, ...props }) => (
  <th className={classnames(classes)} {...props}>
    {children}
  </th>
);

export const TD = ({ classes, children, nestedReportContainer, ...props }) => (
  <td
    className={classnames(classes, {
      'vd-table-nested-report-container': nestedReportContainer
    })}
    {...props}
  >
    {children}
  </td>
);
