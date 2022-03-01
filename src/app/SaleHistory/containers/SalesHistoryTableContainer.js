import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withHandlers, withState } from 'recompose';
import SalesHistoryTable from '../components/SalesHistoryTable';
import withCurrencyFormatter from '../../common/containers/WithCurrencyFormatter';
import {
  generateSalesHistoryTableDatasource,
  switchSale,
  returnSale
} from '../../../modules/sale';
import { routerReplace } from '../../../modules/app';

const mapStateToProps = state => ({
  datasource: generateSalesHistoryTableDatasource(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      switchSale,
      returnSale,
      routerReplace
    },
    dispatch
  );

const enhance = compose(
  withState('expandedReceiptIndex', 'setExpandedReceiptIndex', -1),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    onContinue: props => receiptId => {
      props.switchSale(receiptId, () => {
        props.routerReplace('/webregister');
      });
    },
    onReturn: props => receiptId => {
      props.returnSale(receiptId, () => {
        props.routerReplace('/webregister');
      });
    },
    onClickReceipt: props => index => {
      if (props.expandedReceiptIndex === index) {
        props.setExpandedReceiptIndex(-1);
      } else {
        props.setExpandedReceiptIndex(index);
      }
    }
  }),
  withCurrencyFormatter
);

export default enhance(SalesHistoryTable);
