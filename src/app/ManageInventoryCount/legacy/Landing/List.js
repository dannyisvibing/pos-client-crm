import React from 'react';
import _ from 'lodash';
import STATES from '../../../../constants/states';
import { RBCheckbox, RBFlag, RBButton, RBLoader } from '../../../../rombostrap';
import LandingActions from './Actions';

function getOutletName(outlets, outletId) {
  return (_.find(outlets, { outletId }) || {}).outletName;
}

const List = ({
  state,
  outlets,
  selectedTab,
  selectedAll,
  selectedStocktakes,
  filteredStocktakes,
  listHasActions,
  deletableStocktakes,
  onGoto,
  onToggleSelect,
  onToggleSelectAll,
  onDeleteStocktakes
}) => (
  <div>
    {!!_.size(filteredStocktakes) && (
      <table className="vd-table">
        <thead>
          <tr>
            <td className="vd-tight vd-no-pad-l">
              {listHasActions &&
                !!_.size(deletableStocktakes) && (
                  <RBCheckbox
                    checked={selectedAll}
                    onChange={e => onToggleSelectAll(e.target.checked)}
                  />
                )}
            </td>
            <td className="vd-no-pad-l clickable">
              {!!_.size(selectedStocktakes) ? '' : 'Name'}
              {!!_.size(selectedStocktakes) && (
                <LandingActions
                  selectionTotal={_.size(selectedStocktakes)}
                  selectedAll={selectedAll}
                  onDeleteStocktakes={onDeleteStocktakes}
                />
              )}
            </td>
            <td className="clickable">Outlet</td>
            <td className="vd-no-pad-r clickable">Count</td>
          </tr>
        </thead>
        <tbody>
          {filteredStocktakes.map((stocktake, i) => (
            <tr key={i}>
              <td className="vd-no-pad-l">
                {stocktake.isDeletable() && (
                  <RBCheckbox
                    checked={stocktake.selected}
                    onChange={e => onToggleSelect(stocktake, e.target.checked)}
                  />
                )}
              </td>
              <td
                className="vd-no-pad-l clickable"
                onClick={e => onGoto(e, stocktake)}
              >
                <span className="vd-mrm vd-link vd-link--secondary">
                  {stocktake.name}
                </span>
                {stocktake.isInProgress() && <RBFlag>In Progress</RBFlag>}
                {stocktake.isCompleteProcessing() && (
                  <RBFlag>Processing</RBFlag>
                )}
                {stocktake.isOverdue() && (
                  <RBFlag category="negative">Overdue</RBFlag>
                )}
                <div className="vd-text-supplementary vd-mts">
                  {stocktake.isNotStarted()
                    ? stocktake.getFriendlyDueAtDate()
                    : ''}
                  {stocktake.isCancelled()
                    ? stocktake.getFriendlyUpdatedDate()
                    : ''}
                  {stocktake.isComplete()
                    ? stocktake.getFriendlyFinishDate()
                    : ''}
                  {stocktake.isInProgress()
                    ? stocktake.getFriendlyStartDate()
                    : ''}
                </div>
              </td>
              <td>{getOutletName(outlets, stocktake.outletId)}</td>
              <td className="vd-no-pad-r">
                {stocktake.isPartial() ? 'Partial' : 'Full'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
    {state === STATES.error && (
      <div className="vd-section vd-align-center">
        Something has gone wrong... Please try again.
      </div>
    )}
    {(state === STATES.nextPage || state === STATES.inProgress) && (
      <div className="vd-section vd-align-center">
        <RBLoader />
      </div>
    )}
    {state === STATES.ready &&
      !_.size(filteredStocktakes) && (
        <div className="vd-section vd-align-center">
          <div className="ic-image ic-image-emptylist" />
          <p>You have no {selectedTab} inventory counts</p>
          <RBButton category="primary" href="/product/inventory_count/create">
            Add Inventory Count
          </RBButton>
        </div>
      )}
    {/* <div className='footer'>
            If you're experiencing problems with your product data,
        </div> */}
  </div>
);

export default List;
