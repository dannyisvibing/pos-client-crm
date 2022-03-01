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

export const Section = ({ label, classes, children }) => (
  <div className="box box--cv light collapsible split size1of1">
    <div className="head box-gradient-4">{label}</div>
    <div className={classnames('content', classes)}>{children}</div>
  </div>
);

export const LeftPart = ({ subhead, children }) => (
  <div className="split-left size1of2 unit">
    {subhead && (
      <div className="subhead info_bar">
        <p>{subhead}</p>
      </div>
    )}
    <div className="subcontent padded-20">{children}</div>
  </div>
);

export const RightPart = ({ subhead, children }) => (
  <div className="split-right size1of2 unit">
    {subhead && (
      <div className="subhead info_bar">
        <p>{subhead}</p>
      </div>
    )}
    <div className="subcontent padded-20">{children}</div>
  </div>
);
