import React from 'react';
import { CardState } from '../../managers/card/card.model';
import topSalesPeopleService from '../../managers/top-sales-people/top-sales-people.service';
import { getCurrentPeriodDescription } from '../../utils/periodUtils';
import { RBFlex, RBUserBadge } from '../../../../rombostrap';
import ContextAwareComponent from '../ContextAwareComponent';
import withCurrencyFormatter from '../../../common/containers/WithCurrencyFormatter';

class TopSalesPeople extends ContextAwareComponent {
  state = {};

  componentWillMount() {
    super.componentWillMount();
    // return;
    // this.loadData();
  }

  componentWillUnmount() {
    // return;
    // super.componentWillUnmount();
  }

  onOutletChange() {
    // return;
    // this.loadData();
  }

  onPeriodChange() {
    // return;
    // this.loadData();
  }

  loadData(options = {}) {
    const { card } = this.props;
    if (!options.slient) {
      card.setState(CardState.Loading);
    }

    topSalesPeopleService
      .getPerformanceData(this.outlet, this.period)
      /**
       * @return {SalesPersonPerformance}
       */
      .then(data => {
        card.setState(CardState.Ready);
        this.setState({ data });
      })
      .catch(err => {
        this.setState({ data: null });
      });
  }

  render() {
    const { card, formatCurrency } = this.props;
    const { data } = this.state;
    return (
      card.getState() === CardState.Ready && (
        <div className="ds-card-component ds-number-card ds-badge-metric-card">
          <h2 className="vd-man">
            <span className="ds-card-header">Top Sales People</span>
          </h2>
          <div className="vd-mtm">
            {data.map((salesPersonPerf, i) => (
              <div className="ds-badge-metric">
                <RBUserBadge />
                <span className="ds-badge-metric-value">
                  {formatCurrency(salesPersonPerf.value)}
                </span>
              </div>
            ))}
          </div>
          {!data.length && (
            <RBFlex flex flexJustify="center" flexAlign="center">
              No sales have been made {getCurrentPeriodDescription(this.period)}
            </RBFlex>
          )}
        </div>
      )
    );
  }
}

export default withCurrencyFormatter(TopSalesPeople);
