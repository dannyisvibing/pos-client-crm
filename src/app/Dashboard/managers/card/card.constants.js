import React from 'react';
import { CardState } from './card.model';
import NumberCard from '../../legacy/Cards/NumberCardContainer';
import UserPerformance from '../../legacy/Cards/UserPerformance';
import ProductPerformance from '../../legacy/Cards/ProductPerformance';
import DiscountsNumberCard from '../../legacy/Cards/DiscountsNumberCard';
// import TopSalesPeople from '../../legacy/Cards/TopSalesPeople';
import RecommendationCard from '../../legacy/Cards/RecommendationCard';
import Teaser3Card from '../../legacy/Cards/Teaser3Card';

const CARDS = {
  'performance.primary': {
    Component: undefined,
    initialState: CardState.Loading
  },
  'performance.user': {
    Component: ({ card }) => <UserPerformance card={card} />,
    size: 3,
    initialState: CardState.Hidden,
    title: 'My Sales Performance',
    description: 'Keep track of your own sales performance'
  },
  'performance.product': {
    Component: ({ card }) => <ProductPerformance card={card} />,
    size: 2,
    initialState: CardState.Hidden,
    title: 'Top Products Sold',
    description: 'Easily view your bestselling products'
  },
  'number.revenue': {
    Component: ({ card }) => (
      <NumberCard
        card={card}
        title="Revenue"
        metric="totalRevenue"
        format="currency"
      />
    ),
    size: 1,
    initialState: CardState.Loading,
    title: 'Revenue',
    description: 'Get a snapshot of your overall revenue by outlet(s).',
    icon: 'fa-tachometer'
  },
  'number.gross_profit': {
    Component: ({ card }) => (
      <NumberCard
        card={card}
        title="Gross Profit"
        metric="grossProfit"
        format="currency"
      />
    ),
    size: 1,
    initialState: CardState.Loading,
    title: 'Gross Profit',
    description: 'Keep an eye on your margins.',
    icon: 'fa-dollar'
  },
  'number.sale_count': {
    Component: ({ card }) => (
      <NumberCard card={card} title="Sale Count" metric="saleCount" />
    ),
    size: 1,
    initialState: CardState.Loading,
    title: 'Sale Count',
    description: 'Watch how many sales are being made in-store.',
    icon: 'fa-shopping-bag'
  },
  'number.customer_count': {
    Component: ({ card }) => (
      <NumberCard
        card={card}
        title="Sales with Customer"
        metric="customerAttachment"
        format="percentage"
      />
    ),
    size: 1,
    initialState: CardState.Loading,
    title: 'Sales with Customer',
    description:
      'Track the percentage of sales that have customer details recorded.',
    icon: 'fa-users'
  },
  'number.basket_size': {
    Component: ({ card }) => (
      <NumberCard
        card={card}
        title="Avg. Items Per Sale"
        metric="basketSize"
        average="true"
      />
    ),
    size: 1,
    initialState: CardState.Loading,
    title: 'Average Items Per Sale',
    description: 'See the average number of items sold per sale.'
  },
  'number.basket_value': {
    Component: ({ card }) => (
      <NumberCard
        card={card}
        title="Avg. Sale Value"
        metric="basketValue"
        format="currency"
        average="true"
      />
    ),
    size: 1,
    initialState: CardState.Loading,
    title: 'Average Sale Value',
    description: 'See the average revenue made per sale.',
    icon: 'fa-shopping-basket'
  },
  'number.discounts': {
    Component: ({ card }) => (
      <DiscountsNumberCard
        card={card}
        title="Discounts Offered"
        metric="totalDiscount"
        format="currency"
      />
    ),
    size: 2,
    initialState: CardState.Loading,
    title: 'Discounts Offered',
    description: 'Monitor the discounts applied by staff.',
    icon: 'fa-tag'
  },
  // 'number.top_sales_people': {
  //     Component: ({card}) => <TopSalesPeople card={card}/>,
  //     size: 2,
  //     initialState: CardState.Loading,
  //     title: 'Top Sales People',
  //     description: 'Easily view your best-performing sales people'
  // },
  'recommendation-single': {
    Component: ({ card }) => <RecommendationCard card={card} size={1} />,
    size: 1,
    initialState: CardState.Loading
  },
  'recommendation-double': {
    Component: ({ card }) => <RecommendationCard card={card} size={2} />,
    size: 2,
    initialState: CardState.Loading
  },
  'teaser-3': {
    Component: ({ card }) => <Teaser3Card card={card} />,
    size: 3,
    initialState: CardState.Ready,
    cssClass: 'ds-teaser-card'
  }
};

export default CARDS;
