import React from 'react';
import classnames from 'classnames';

export const DateSelectorTabs = ({ classes, horizontal, children }) => (
  <div
    className={classnames('date-selector-tabs', classes, {
      'date-selector-tabs--horizontal': horizontal
    })}
  >
    {children}
  </div>
);

export const DateSelectorTab = ({ classes, active, children, ...props }) => (
  <div
    className={classnames('date-selector-tab', classes, {
      active: active
    })}
    {...props}
  >
    {children}
  </div>
);

export const DateSelectorTabButton = ({ title, ...props }) => (
  <a href="" className="date-selector-tab-button" {...props}>
    {title}
  </a>
);

export const DateSelector = ({ classes, children, ...props }) => (
  <form className={classnames('date-selector', classes)} {...props}>
    {children}
  </form>
);

export const DateSelectorFooter = ({ children }) => (
  <div className="date-selector-footer">{children}</div>
);

export const DateSelectorFooterSection = ({ left, right, children }) => (
  <div
    className={classnames('date-selector-footer-section', {
      'date-selector-footer-section--left': left,
      'date-selector-footer-section--right': right
    })}
  >
    {children}
  </div>
);

export const DateSelectorPreview = ({ children }) => (
  <span className="date-selector-preview">{children}</span>
);

export const DateSelectorContent = ({ children }) => (
  <div className="tabs-content date-selector-content">{children}</div>
);

export const DateSelectorOptions = ({ children }) => (
  <ul className="date-selector-options">{children}</ul>
);

export const DateSelectorOption = ({ active, children, ...props }) => (
  <li
    className={classnames({
      'date-selector-option--active': active
    })}
    {...props}
  >
    {children}
  </li>
);
