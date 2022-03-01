import { compose } from 'redux';
import { lifecycle, withState } from 'recompose';
import WindowDelegate from '../../../rombostrap/utils/windowDelegate';

export default compose(
  withState('isOnline', 'setIsOnline', true),
  lifecycle({
    componentWillMount() {
      const { setIsOnline } = this.props;
      this.onlineHandler = isOnline => {
        setIsOnline(isOnline());
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
