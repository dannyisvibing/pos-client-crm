import React from 'react';
import classnames from 'classnames';

export const Content = ({ children }) => (
  <div className="product-page--new cv-main-body cv-main-body--v2-min-width">
    <div className="cv-page-content">{children}</div>
  </div>
);

export const Heading = ({ title }) => (
  <div className="subheading">
    <h1>{title}</h1>
  </div>
);

export const Section = ({ label, subhead, classes, children }) => (
  <div className="box box--cv light collapsible split size1of1">
    <div className="head box-gradient-4">{label}</div>
    {subhead && (
      <div className="subhead info_bar">
        <p>{subhead}</p>
      </div>
    )}
    <div className={classnames('content', classes)}>{children}</div>
  </div>
);

export const DetailsLeft = ({ children }) => (
  <div className="split-left size3of4 unit">
    <div className="subcontent padded-20">{children}</div>
  </div>
);

export const DetailsRight = ({ children }) => (
  <div className="split-right size1of4 unit hidden-in-embedded-app">
    <div className="subcontent">{children}</div>
  </div>
);

export const PricingContent = ({ children }) => (
  <div className="product-price text-center">
    <div className="line pricing-values box-2 man inline-block">{children}</div>
  </div>
);

export const PricingComponent = ({ classes, label, help, ...props }) => (
  <div className={classnames('unit', classes)}>
    <label>{label}</label>
    <div>
      <input type="text" {...props} />
    </div>
    {help && <div className="help">{help}</div>}
  </div>
);

export const PricingShowDetail = ({ showing, onToggle }) => (
  <div className="text-center mvl">
    <a
      href=""
      className="js-toggle-tax-by-outlet-table no-decoration"
      onClick={onToggle}
    >
      <i className="icon-general-arrow-blue-up" />
      <span className="mls font-large">
        {showing ? 'Hide taxes by outlet' : 'Show taxes by outlet'}
      </span>
    </a>
  </div>
);
