import { compose } from 'redux';
import { connect } from 'react-redux';
import { productsSelector } from '../../../modules/product';
import SearchForProducts from '../components/SearchForProducts';
import { withHandlers } from 'recompose';

const mapStateToProps = state => ({
  products: productsSelector(state)
});

const enhance = compose(
  connect(mapStateToProps),
  withHandlers({
    onSelectSuggestion: props => suggestion => {
      props.handler(suggestion);
    }
  })
);

export default enhance(SearchForProducts);
