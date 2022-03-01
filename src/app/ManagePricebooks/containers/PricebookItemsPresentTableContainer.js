import { compose } from 'redux';
import { connect } from 'react-redux';
import { withHandlers } from 'recompose';
import PricebookItemsPresentTable from '../components/PricebookItemsPresentTable';
import { productsSelector, getProductById } from '../../../modules/product';

const mapStateToProps = state => ({
  products: productsSelector(state)
});

const enhance = compose(
  connect(mapStateToProps),
  withHandlers({
    getProductById: props => id => {
      return getProductById(props.products, id);
    }
  })
);

export default enhance(PricebookItemsPresentTable);
