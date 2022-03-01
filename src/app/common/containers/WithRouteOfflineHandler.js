import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { lifecycle } from 'recompose';
import { openModal, closeModal } from '../../../modules/modal';
import { currentPageTagSelector } from '../../../modules/app';
import WindowDelegate from '../../../rombostrap/utils/windowDelegate';
import ModalTypes from '../../../constants/modalTypes';
import { PAGE_TAG } from '../../Sale/containers/SalePageContainer';

const mapStateToProps = state => ({
  currentPageTag: currentPageTagSelector(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      openModal,
      closeModal
    },
    dispatch
  );

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentWillMount() {
      this.onlineHandler = isOnline => {
        if (this.props.currentPageTag !== PAGE_TAG && !isOnline()) {
          this.props.openModal({ type: ModalTypes.OFFLINE_NOTIFICATION });
        } else {
          this.props.closeModal(ModalTypes.OFFLINE_NOTIFICATION);
        }
      };
      const windowDelegate = WindowDelegate.getInstance();
      windowDelegate.on(windowDelegate.EVENTS().online, this.onlineHandler);
    },
    componentWillUnmount() {
      const windowDelegate = WindowDelegate.getInstance();
      windowDelegate.off(windowDelegate.EVENTS().online, this.onlineHandler);
    }
  })
);
