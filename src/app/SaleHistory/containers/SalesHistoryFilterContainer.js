import _ from 'lodash';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import { myOutletsSelector } from '../../../modules/outlet';
import { usersSelector } from '../../../modules/user';
import { fetchReceipts } from '../../../modules/sale';
import SalesHistoryFilter from '../components/SalesHistoryFilter';
import {
  SALE_STATUS,
  SALE_STATUS_IN_PROGRESS,
  SALE_STATUS_COMPLETED
} from '../../../modules/sale/sale.constants';

const mapStateToProps = state => ({
  outlets: myOutletsSelector(state),
  users: usersSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchReceipts
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFormik({
    handleSubmit: async (values, { props, setSubmitting }) => {
      setSubmitting(true);
      const filter = {
        customerName: values.customerName,
        outletId: values.outletId,
        userId: values.userId
      };
      const saleStatus = _.find(SALE_STATUS, { entity: values.status });
      if (saleStatus) {
        filter.status = saleStatus.status;
        filter.subStatus = saleStatus.subStatus;
      } else {
        if (props.statusCategory === 'continue_sales')
          filter.status = SALE_STATUS_IN_PROGRESS;
        if (props.statusCategory === 'process_returns')
          filter.status = SALE_STATUS_COMPLETED;
      }
      await props.fetchReceipts(filter);
      setSubmitting(false);
    }
  })
);

export default enhance(SalesHistoryFilter);
