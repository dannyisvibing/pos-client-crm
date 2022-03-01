import React, { Component } from 'react';
import { RBSection, RBFlex, RBHeader, RBButton } from '../../../rombostrap';
import CSVMatchCard from './CSVMatchCard';
import ColumnStates from '../constants/columnStates';
import WindowDelegate from '../../../rombostrap/utils/windowDelegate';

class CSVMatchFields extends Component {
  state = {};

  componentDidMount() {
    this._onResize = event => this.resizeFields();
    const windowDelegate = WindowDelegate.getInstance();
    windowDelegate.on(windowDelegate.EVENTS().resize, this._onResize);

    this.resizeFields();
  }

  componentWillUnmount() {
    const windowDelegate = WindowDelegate.getInstance();
    windowDelegate.off(windowDelegate.EVENTS().resize, this._onResize);
  }

  resizeFields() {
    var documentWidth = document.getElementsByTagName('body')[0].clientWidth;
    var primarySidebarWidth = document.getElementsByClassName(
      'vd-primary-sidebar'
    )[0].clientWidth;
    var secondarySidebarWidth = document.getElementsByClassName(
      'vd-secondary-sidebar'
    )[0].clientWidth;

    var width = documentWidth - primarySidebarWidth - secondarySidebarWidth;
    this.matchFields.style.width = `${width}px`;
  }

  getUnmatchedCount() {
    const { cards } = this.props;
    return cards.reduce(
      (unmatchedCount, card) =>
        unmatchedCount + (card.state === ColumnStates.unmatched ? 1 : 0),
      0
    );
  }

  getHeaderString() {
    const { fileName } = this.props;
    var unmatchedCount = this.getUnmatchedCount();
    if (unmatchedCount > 0) {
      return `There are ${unmatchedCount} ${
        unmatchedCount > 1 ? 'columns' : 'column'
      } that are not matched in "${fileName}".`;
    } else {
      return 'All matched! Ready for us to check the product information?';
    }
  }

  render() {
    const { cards = [], onCancel, onContinue } = this.props;

    return (
      <div ref={c => (this.matchFields = c)}>
        <RBSection>
          <RBFlex flex flexJustify="between" flexAlign="center">
            <div />
            <RBHeader>{this.getHeaderString()}</RBHeader>
            <div />
          </RBFlex>
        </RBSection>
        <form className="vd-flex vd-flex--row csv-card-matching-container">
          <div style={{ minWidth: '97px' }} />
          {cards.map((card, i) => (
            <CSVMatchCard key={i} card={card} {...this.props} />
          ))}
        </form>
        <RBSection classes="vd-ptn">
          <div className="vd-align-right">
            <RBButton category="secondary" onClick={onCancel}>
              Cancel
            </RBButton>
            <RBButton category="primary" onClick={onContinue}>
              {this.getUnmatchedCount() > 0 ? 'Continue Anyway' : 'Continue'}
            </RBButton>
          </div>
        </RBSection>
      </div>
    );
  }
}

export default CSVMatchFields;
