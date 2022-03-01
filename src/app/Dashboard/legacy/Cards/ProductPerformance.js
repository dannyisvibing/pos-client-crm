import React from 'react';
import { CardState } from '../../managers/card/card.model';
import { ProductsBy } from '../../managers/product-performance/product-performance.service';
import rbDashboardService from '../../managers/dashboard/dashboard.service';
import withCurrencyFormatter from '../../../common/containers/WithCurrencyFormatter';
import ContextAwareComponent from '../ContextAwareComponent';
import { RBTabs, RBTab, RBFlex, RBProductBadge } from '../../../../rombostrap';
import { getCurrentPeriodDescription } from '../../utils/periodUtils';

const tabs = [
  {
    productsBy: ProductsBy.BY_COUNT,
    label: 'By Quantity'
  },
  {
    productsBy: ProductsBy.BY_REVENUE,
    label: 'By Revenue'
  }
];

class ProductPerformance extends ContextAwareComponent {
  state = {};

  componentWillMount() {
    super.componentWillMount();
    // return;
    // this.setState({ productsBy: rbDashboardService.getProductsBy() });
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

  handleTabChange = (e, value) => {
    e.preventDefault();
    this.setState({ productsBy: value });
    rbDashboardService.setProductsBy(value);
  };

  loadData(options = {}) {
    return;
    // const { card } = this.props;
    // if (!options.silent) {
    //   card.setState(CardState.Loading);
    // }

    // rbProductPerformanceService
    //   .getPerformanceData(this.outlet, this.period)
    //   /**
    //    * @return {ProductPerformanceData}
    //    */
    //   .then(data => {
    //     card.setState(CardState.Ready);
    //     this.setState({ data });
    //   })
    //   .catch(err => {
    //     this.setState({ data: null });
    //   });
  }

  render() {
    const { card, formatCurrency } = this.props;
    const { productsBy, data } = this.state;
    return (
      card.getState() === CardState.Ready && (
        <div className="ds-card-component ds-number-card ds-badge-metric-card">
          <h2 className="vd-man pro-top-products-title">
            <span className="ds-card-header">Top Products Sold</span>
          </h2>
          <div className="vd-mtm">
            <RBTabs activeValue={productsBy} onClick={this.handleTabChange}>
              {tabs.map((tab, i) => (
                <RBTab key={i} value={tab.productsBy}>
                  {tab.label}
                </RBTab>
              ))}
            </RBTabs>
            {data[productsBy].map((productPerf, i) => (
              <div key={i} className="ds-badge-metric">
                <RBProductBadge
                  product={productPerf.product}
                  size="small"
                  exactMatch={true}
                />
                {!productPerf.currency && (
                  <span className="ds-badge-metric-value">
                    {productPerf.value}
                  </span>
                )}
                {productPerf.currency && (
                  <span className="ds-badge-metric-value">
                    {formatCurrency(productPerf.value)}
                  </span>
                )}
              </div>
            ))}
          </div>
          {!data[productsBy].length && (
            <RBFlex flex flexJustify="center" flexAlign="center">
              No products have been sold{' '}
              {getCurrentPeriodDescription(this.period)}
            </RBFlex>
          )}
        </div>
      )
    );
  }
}

export default withCurrencyFormatter(ProductPerformance);
