import CustomerCSVColumns from '../constants/customerCSVColumns';
import EntityImportService from './entityImportManager';
// import customerResource from '../customers/customer.resource';

export default class ProductImportService extends EntityImportService {
  static getEntityName(plural) {
    return plural ? 'customers' : 'customer';
  }

  static composeCards(data = []) {
    return super.composeCards(data);
  }

  static getEntityColumnsDefinition(data) {
    return this._resolveColumnsDefinition(data[0]);
  }

  static assureImportantColumns(cards) {
    return super.assureImportantColumns(
      cards,
      ['firstname', 'lastname'],
      CustomerCSVColumns
    );
  }

  static import(csvData) {
    // return customerResource.import(csvData);
  }

  static getTemplate() {
    // return customerResource.csvTemplate();
  }

  static _resolveColumnsDefinition(columnNames) {
    return this._flattenColumnsDefinition(columnNames, CustomerCSVColumns);
  }
}
