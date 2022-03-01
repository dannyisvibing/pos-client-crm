import CurrencyCodes from '../constants/countryCodes';

export default function(defaultCurrency) {
  var currency = CurrencyCodes.find(d => d.code === defaultCurrency);
  if (currency) {
    return currency.symbol_native;
  } else {
    return '$';
  }
}
