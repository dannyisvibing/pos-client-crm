import treo from 'treo';
import treoPromise from 'treo/plugins/treo-promise';
import treoWebSql from 'treo/plugins/treo-websql';
import STORES from './stores';

var database;

function _createSchema() {
  return (
    treo
      .schema()
      .version(1)

      .addStore(STORES.products, {
        key: 'id'
      })

      .addStore(STORES.taxes, {
        key: 'id'
      })

      .addStore(STORES.outlets, {
        key: 'outletId'
      })

      .addStore(STORES.productTaxes, {
        key: 'productId'
      })

      .addStore(STORES.versions, {
        key: 'entityStoreName'
      })

      .addStore(STORES.priceBooks, {
        key: 'book_id'
      })

      .addStore(STORES.priceBookProducts, {
        key: 'item_id'
      })

      // .addStore(STORES.paymentTypes, {
      //     key: 'method_id'
      // })

      .addStore(STORES.registers, {
        key: 'register_id'
      })

      .addStore(STORES.users, {
        key: 'user_id'
      })

      .version(2)

      .addStore(STORES.customers, {
        KEY: 'id'
      })

      .addStore(STORES.customerGroups, {
        KEY: 'id'
      })

      .version(3)

      .addStore(STORES.stocktakes, {
        key: 'id'
      })

      .addStore(STORES.stocktakeItems, {
        key: 'id'
      })

      .addIndex('ByStocktakeId', 'stocktakeId')

      .addStore(STORES.tags, {
        key: 'id'
      })

      .addStore(STORES.productTypes, {
        key: 'id'
      })

      .addStore(STORES.brands, {
        //*
        key: 'id'
      })

      .addStore(STORES.suppliers, {
        //*
        key: 'id'
      })

      .version(4)

      .addStore(STORES.stocktakeCounts, {
        key: 'id'
      })

      .addIndex('ByStocktakeId', 'stocktakeId')

      .version(5)

      .getStore(STORES.products)
      .addIndex('BySku', 'sku')

      .version(6)

      .addStore(STORES.pendingSale, {
        key: 'id'
      })

      .addStore(STORES.settings, {
        key: 'id'
      })
  );
}

if (!database) {
  database = treo('rombopos', _createSchema());
}

database.use(treoPromise());
database.use(treoWebSql());

export default database;
