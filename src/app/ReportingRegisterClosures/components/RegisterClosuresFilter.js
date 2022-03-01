import React from 'react';
import Selectize from '../../common/legacy/Selectize';
import { Button } from '../../common/legacy/Basic';

const RegisterClosuresFilter = ({
  selectedOutlet,
  selectedRegister,
  outlets,
  registers,
  onChange,
  onApply
}) => (
  <form>
    <div className="wr-sales-history-searchfilters">
      <div className="wr-sales-history-searchfilters-container">
        <div className="wr-sales-history-searchfilters-item">
          <Selectize
            options={registers}
            value={selectedRegister}
            classes="wr-sales-history-search-item"
            label="Register"
            onChange={register => onChange('selectedRegister', register.value)}
          />
          <Selectize
            options={outlets}
            value={selectedOutlet}
            classes="wr-sales-history-search-item"
            label="Outlet"
            onChange={outlet => onChange('selectedOutlet', outlet.value)}
          />
        </div>
      </div>
      <div className="wr-sales-history-actions-container">
        <div className="wr-sales-history-actions">
          <Button primary onClick={onApply}>
            Search
          </Button>
        </div>
      </div>
    </div>
  </form>
);

export default RegisterClosuresFilter;
