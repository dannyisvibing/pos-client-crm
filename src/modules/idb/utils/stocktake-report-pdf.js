import moment from 'moment';
import _ from 'lodash';
import { vn } from 'vend-number';
// import store from '../../../redux/store';
// import rbOutletStore from '../../outlet/outlet.store';
// import StocktakeNumber from './stocktake-number';
// import currencyFilter from '../../../filters/currency-filter';
// const _currencyFilter = currencyFilter();
// const getBigNumberValue = StocktakeNumber.getBigNumberValue;

var definition = {
  content: [
    { text: 'mirrow', style: 'header' },
    { text: 'Main Outlet - 29 Jan 2018 11:00 PM', style: 'subheader' },
    {
      style: 'stocktakeSummary',
      table: {
        widths: [50, '*', 50, '*'],
        body: [
          [
            { text: 'Outlet', color: 'gray' },
            'Main Outlet',
            { text: 'Start', color: 'gray' },
            '02 Feb 2018, 02:17 PM'
          ],
          [
            { text: 'Type', color: 'gray' },
            'Full',
            { text: 'End', color: 'gray' },
            '03 Feb 2018, 01:32 PM'
          ]
        ]
      },
      layout: 'noBorders'
    },
    {
      table: {
        widths: '*',
        body: [
          [
            '',
            { text: 'Difference', alignment: 'right' },
            { text: 'Difference Cost', alignment: 'right' },
            { text: 'Inventory Value', alignment: 'right' }
          ],
          [
            'Gain',
            { text: 0.0, alignment: 'right' },
            { text: '$0.00', alignment: 'right' },
            { text: '', alignment: 'right' }
          ],
          [
            'Loss',
            { text: -3.0, alignment: 'right' },
            { text: '$360.00', alignment: 'right' },
            { text: '', alignment: 'right' }
          ],
          [
            'Total',
            { text: -3.0, alignment: 'right' },
            { text: '$-360.00', alignment: 'right' },
            { text: '$240.00', alignment: 'right' }
          ]
        ]
      },
      layout: {
        hLineWidth: function(i, node) {
          if (i === 0 || i === 2) return 0;
          return 1;
        },
        vLineWidth: function(i, node) {
          return 0;
        },
        hLineColor: function(i, node) {
          return 'lightgray';
        },
        paddingBottom: function(i, node) {
          return 12;
        },
        paddingTop: function(i, node) {
          return 12;
        }
      }
    }
  ],
  styles: {
    header: {
      fontSize: 18,
      bold: true,
      margin: [0, 0, 0, 10]
    },
    subheader: {
      fontSize: 16,
      bold: true,
      margin: [0, 10, 0, 5]
    },
    stocktakeSummary: {
      margin: [0, 5, 0, 35]
    }
  },
  defaultStyle: {
    // alignment: 'justify'
  }
};

function calculateTotals(stocktakeItems) {
  var totals = {
      costGain: vn(0),
      costLoss: vn(0),
      countGain: vn(0),
      countLoss: vn(0)
    },
    costField,
    countField;

  _.forEach(stocktakeItems, stocktakeItem => {
    var differenceCost = stocktakeItem.getDifferenceCost(),
      differenceCount = stocktakeItem.getDifferenceCount();

    if (differenceCost) {
      costField = differenceCost > 0 ? 'costGain' : 'costLoss';
      totals[costField] = totals[costField].plus(differenceCost);
    }

    if (differenceCount) {
      countField = differenceCount > 0 ? 'countGain' : 'countLoss';
      totals[countField] = totals[countField].plus(differenceCount);
    }
  });

  return _.mapValues(totals, total => {
    return total.toString();
  });
}

function exportPDF(stocktake, stocktakeItems) {
  // definition.content[0].text = store.getState().store.storeSetting.storeName;
  definition.content[1].text = stocktake.name;
  // definition.content[2].table.body[0][1] = rbOutletStore.get(stocktake.outletId).outletName;
  definition.content[2].table.body[0][3] = moment(
    stocktake.consignment_date
  ).format('DD MMM YYYY, hh:mm a');
  definition.content[2].table.body[1][1] =
    stocktake.filters.length > 0 ? 'Partial' : 'Full';
  definition.content[2].table.body[1][3] = moment(stocktake.received_at).format(
    'DD MMM YYYY, hh:mm a'
  );

  var totals = calculateTotals(stocktakeItems);
  totals.costDifference = vn(totals.costGain)
    .plus(totals.countLoss)
    .toString();
  totals.countDifference = vn(totals.countGain)
    .plus(totals.countLoss)
    .toString();

  definition.content[3].table.body[1][1].text = totals.countGain;
  // definition.content[3].table.body[1][2].text = _currencyFilter(+totals.costGain);
  definition.content[3].table.body[2][1].text = totals.countLoss;
  // definition.content[3].table.body[2][2].text = _currencyFilter(+totals.costLoss);
  definition.content[3].table.body[3][1].text = totals.countDifference;
  // definition.content[3].table.body[3][2].text = _currencyFilter(+totals.costDifference);

  // var inventoryValue = stocktakeItems.reduce((total, stocktakeItem) => {
  //     total = total.plus(stocktakeItem.cost.times(stocktakeItem.counted));
  //     return total;
  // }, vn(0));

  // inventoryValue = getBigNumberValue(inventoryValue);

  // definition.content[3].table.body[3][3].text = _currencyFilter(inventoryValue);
  window.pdfMake.createPdf(definition).download(stocktake.name);
}

export default exportPDF;
