import React from 'react';
import classnames from 'classnames';
import find from 'lodash/find';

const RBSelect = ({
  classes,
  selectedEntity = '',
  entities = [],
  nullLabel = '',
  entityKey = 'name',
  entityValue = 'entity',
  onChange,
  ...props
}) => {
  var nullEntity = [];
  if (nullLabel !== undefined) {
    nullEntity.push({
      [entityKey]: nullLabel,
      [entityValue]: ''
    });
  }

  return (
    <div className={classnames('vd-select-container', classes)}>
      <select
        className="vd-select"
        value={selectedEntity || ''}
        onChange={event =>
          onChange(find(entities, { [entityValue]: event.target.value }) || {})
        }
        {...props}
      >
        {nullEntity.concat(entities).map((entity, i) => (
          <option key={i} label={entity[entityKey]} value={entity[entityValue]}>
            {entity[entityValue]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RBSelect;
