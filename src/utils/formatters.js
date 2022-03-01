import currencyFilter from './currencyFormatter';
import numberFilter from './numberFilter';
import percentFilter from './percentFilter';
import dateFilter from './dateFilter';

class Formatters {
  static named(name) {
    switch (name) {
      case 'currency':
        return currencyFilter({
          currencySymbol: window.defaultCurrency
        });
      case 'number':
        return numberFilter();
      case 'number_positive':
        return numberFilter({
          min: 0.1
        });
      case 'percent':
        return percentFilter();
      case 'percent_precise':
        return percentFilter({
          format: '(0,0.[00]%)'
        });
      case 'date':
        return dateFilter();

      default:
        return function(a) {
          return a;
        };
    }
  }
}

export default Formatters;
