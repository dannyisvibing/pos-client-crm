import ProductCSVColumns from '../constants/productCSVColumns';
import EntityImportService from './entityImportManager';
// import productResource from '../products/product.resource';
// import rbOutletStore from '../outlet/outlet.store';

export default class ProductImportService extends EntityImportService {
  static getEntityName(plural) {
    return plural ? 'products' : 'product';
  }

  static composeCards(data = []) {
    return super.composeCards(data);
  }

  static getEntityColumnsDefinition(data) {
    return this._resolveColumnsDefinition(data[0]);
  }

  static assureImportantColumns(cards) {
    return super.assureImportantColumns(cards, ['name'], ProductCSVColumns);
  }

  static import(csvData) {
    // return productResource.import(csvData);
  }

  static getTemplate() {
    // return productResource.csvTemplate();
  }

  static _resolveColumnsDefinition(columnNames) {
    var flattenedDefinition = this._flattenColumnsDefinition(
      columnNames,
      ProductCSVColumns
    );
    return flattenedDefinition.map(column => {
      if (!column.resolver) return column;
      if (column.resolver.entity === 'outlet') {
        // var name = rbOutletStore.get(column.resolver.id).outletName;
        var name = '';
        column.name = column.name.replace('%name%', name);
        return column;
      }
      return column;
    });
  }
}
