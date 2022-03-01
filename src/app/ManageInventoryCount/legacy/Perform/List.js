import React from 'react';
import classnames from 'classnames';
import STATES from '../../../../constants/states';
import MESSAGES from '../../../../constants/stocktake/messages';
import { RBFlag, RBLoader } from '../../../../rombostrap';
import Tooltip from '../Shared/Tooltip';

const List = ({
  stateProducts,
  stateItems,
  selectedTab,
  stocktake,
  filteredStocktakeItems,
  onSelectProductFromList
}) => {
  return (
    <div>
      {stateProducts === STATES.success && (
        <table className="vd-table vd-table--fixed">
          <thead>
            <tr>
              <td className="vd-no-pad-l vd-no-pad-r" width="6%" />
              <td className="clickable vd-no-pad-l">Product</td>
              <td className="clickable vd-no-pad-l vd-align-right" width="20%">
                Expected
              </td>
              <td className="clickable vd-no-pad-r vd-align-right" width="20%">
                Counted
              </td>
            </tr>
          </thead>
          <tbody>
            {stateProducts === STATES.success &&
              stocktake.isInProgressProcessing() && (
                <tr className="vd-align-center">
                  <td colSpan="4">
                    <i className="fa fa-info-circle" />
                    <span className="vd-plm">{MESSAGES.perform.startJob}</span>
                  </td>
                </tr>
              )}
            {filteredStocktakeItems.map((item, i) => (
              <tr
                key={i}
                className={classnames({
                  clickable: true,
                  'table-row--completed': item.is.countedMatching,
                  'table-row--unplanned': item.is.unplanned,
                  'table-row--disabled': item.is.excluded
                })}
                onClick={e => onSelectProductFromList(e, item)}
              >
                <td className="vd-no-pad-r vd-no-pad-l vd-align-center">
                  {!item.is.syncing && (
                    <span
                      className={classnames('vd-text--success fa', {
                        'fa-dot-circle-o': item.is.countedNotMatching,
                        'fa-check': item.is.countedMatching
                      })}
                    />
                  )}
                  {item.is.syncing && (
                    <i className="icon-css-loader icon-css-loader--small" />
                  )}
                  {item.is.unplanned && (
                    <i className="fa fa-exclamation-triangle vd-text--negative" />
                  )}
                </td>
                <td className="vd-no-pad-l">
                  {item.is.excluded && <RBFlag>Excluded</RBFlag>}
                  {item.is.unplanned && (
                    <Tooltip type="info" direction="bottom">
                      <p>
                        This item was not part of your planned count. Don't
                        worry you can fix this during the Review stage.
                      </p>
                    </Tooltip>
                  )}
                  {item.name}
                  <div className="vd-mts">{item.sku}</div>
                </td>
                <td className="vd-align-right">{item.preExpected}</td>
                <td className="vd-align-right vd-no-pad-r">
                  {item.preCounted}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {stateItems === STATES.noResults && (
        <div className="vd-align-center">
          <p>
            Could not retrieve any products that match the filters you've
            provided. Please try again.
          </p>
        </div>
      )}

      {(stateItems === STATES.inProgress ||
        stateProducts === STATES.inProgress) && (
        <div className="vd-section vd-align-center">
          {stateProducts === STATES.success && (
            <p>You can start counting products!</p>
          )}
          <RBLoader />
        </div>
      )}

      {stateItems === STATES.error && (
        <div className="content-section content-section--centered">
          <p>Something has gone wrong... Please try again.</p>
        </div>
      )}
    </div>
  );
};

export default List;
