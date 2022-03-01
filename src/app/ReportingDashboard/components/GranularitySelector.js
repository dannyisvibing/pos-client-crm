import React from 'react';
import classnames from 'classnames';

import GranularityDefinitionService from '../../../modules/reporting/granularity-definitions.service';

function getGranularities() {
  return [
    GranularityDefinitionService.findByKey('day'),
    GranularityDefinitionService.findByKey('week'),
    GranularityDefinitionService.findByKey('month')
  ];
}

const GranularitySelector = ({
  granularityDateSelection,
  onGranularitySelect
}) => (
  <ul className="button-group granularity-selector">
    {getGranularities().map((granularity, i) => (
      <li key={i}>
        <a
          className={classnames('button fixed', {
            secondary:
              granularityDateSelection.granularity.key === granularity.key
          })}
          onClick={e => {
            e.preventDefault();
            var period;
            switch (granularity.key) {
              case 'day':
                period = 8;
                break;
              case 'week':
                period = 8;
                break;
              case 'month':
                period = 7;
                break;
              default:
                break;
            }
            onGranularitySelect({
              granularity: granularity,
              periodCount: period
            });
          }}
        >
          {granularity.name}
        </a>
      </li>
    ))}
  </ul>
);

export default GranularitySelector;
