import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withHandlers } from 'recompose';
import SlideUp from '../../common/components/SlideUp';
import { isModalOpenSelector, closeModal } from '../../../modules/modal';
import ModalTypes from '../../../constants/modalTypes';

const mapStateToProps = state => ({
  open: isModalOpenSelector(ModalTypes.PAY_PANEL)(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      closeModal
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    onRequestClose: props => () => {
      props.closeModal(ModalTypes.PAY_PANEL);
    }
  })
);

export default enhance(SlideUp);
