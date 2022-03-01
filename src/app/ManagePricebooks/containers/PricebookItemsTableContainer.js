import { compose } from 'redux';
import { connect } from 'react-redux';
import { withHandlers } from 'recompose';
import PricebookItemsTable from '../components/PricebookItemsTable';
import { productsSelector, getProductById } from '../../../modules/product';
import { calcRetailPrice } from '../../../modules/sale';

const mapStateToProps = state => ({
  products: productsSelector(state)
});

const enhance = compose(
  connect(mapStateToProps),
  withHandlers({
    getProductById: props => id => {
      return getProductById(props.products, id);
    },
    onDiscountChange: props => (item, index, discount, setFieldValue) => {
      const supplyPrice = getProductById(props.products, item.productId)
        .supplyPrice;
      const retailPrice = calcRetailPrice(supplyPrice, item.markup, discount);
      setFieldValue(`items.${index}.discount`, discount);
      setFieldValue(`items.${index}.retailPrice`, retailPrice);
    },
    onMarkupChange: props => (item, index, markup, setFieldValue) => {
      const supplyPrice = getProductById(props.products, item.productId)
        .supplyPrice;
      const retailPrice = calcRetailPrice(supplyPrice, markup, item.discount);
      setFieldValue(`items.${index}.markup`, markup);
      setFieldValue(`items.${index}.retailPrice`, retailPrice);
    }
  })
);

export default enhance(PricebookItemsTable);
