import STORES from '../stores';
import EntityStore from '../entity-store';
import Version from '../model/version';
import Tax from '../model/tax';
import StocktakeCount from '../model/stocktake-count';
import Stocktake from '../model/stocktake';
import StocktakeItem from '../model/stocktake-item';
import ProductFilter from '../model/product-filter';
import Outlet from '../model/outlet';
import Register from '../model/register';
import Product from '../model/product';
import ProductTax from '../model/product-tax';
import Pricebook from '../model/price-book';
import PriceBookProduct from '../model/price-book-product';
import User from '../model/user';
import Customer from '../model/customer';
import CustomerGroup from '../model/customer-group';
import PendingSale from '../model/pending-sale';

var managers = {},
  storeModels = {};

storeModels[STORES.versions] = Version;
storeModels[STORES.products] = Product;
storeModels[STORES.taxes] = Tax;
storeModels[STORES.outlets] = Outlet;
storeModels[STORES.productTaxes] = ProductTax;
storeModels[STORES.priceBooks] = Pricebook;
storeModels[STORES.priceBookProducts] = PriceBookProduct;
storeModels[STORES.registers] = Register;
storeModels[STORES.users] = User;
storeModels[STORES.customers] = Customer;
storeModels[STORES.customerGroups] = CustomerGroup;
storeModels[STORES.stocktakes] = Stocktake;
storeModels[STORES.stocktakeCounts] = StocktakeCount;
storeModels[STORES.stocktakeItems] = StocktakeItem;
storeModels[STORES.brands] = ProductFilter;
storeModels[STORES.suppliers] = ProductFilter;
storeModels[STORES.tags] = ProductFilter;
storeModels[STORES.productTypes] = ProductFilter;
storeModels[STORES.pendingSale] = PendingSale;

export default class StoreManager {
  static getStore(storeName) {
    if (!managers[storeName]) {
      managers[storeName] = new EntityStore(storeName, storeModels[storeName]);
    }
    return managers[storeName];
  }
}
