import API_STOCKTAKE_STATUS from '../../../constants/stocktake/api-status';

var editStocktakeStatuses = [API_STOCKTAKE_STATUS.stocktake];
var viewStocktakeStatuses = [
  API_STOCKTAKE_STATUS.completed,
  API_STOCKTAKE_STATUS.cancelled
];
var performStocktakeStatuses = [
  API_STOCKTAKE_STATUS.inProgress,
  API_STOCKTAKE_STATUS.inProgressProcessed
];

function getValidRedirectRoute(stocktake) {
  var suggestedRoute;

  if (!stocktake || !stocktake.id || stocktake.deletedAt) {
    suggestedRoute = '/product/inventory_count';
  } else if (editStocktakeStatuses.indexOf(stocktake.status) > -1) {
    suggestedRoute = '/product/inventory_count/edit/' + stocktake.id;
  } else if (performStocktakeStatuses.indexOf(stocktake.status) > -1) {
    suggestedRoute =
      window.location.pathname.indexOf('review') > -1
        ? '/product/inventory_count/review/'
        : '/product/inventory_count/perform/';
    suggestedRoute += stocktake.id;
  } else if (viewStocktakeStatuses.indexOf(stocktake.status) > -1) {
    suggestedRoute = '/product/inventory_count/view/' + stocktake.id;
  }

  return suggestedRoute !== window.location.pathname ? suggestedRoute : false;
}

export default getValidRedirectRoute;
