import { compose } from 'redux';
import { connect } from 'react-redux';
import List from './List';
import { getOutletById } from '../../../modules/outlet';
import withCurrencyFormatter from '../../common/containers/WithCurrencyFormatter';

const mapStateToProps = state => ({
  getOutletById(id) {
    return getOutletById(state, id);
  }
});

const enhance = compose(connect(mapStateToProps), withCurrencyFormatter);

export default enhance(List);
